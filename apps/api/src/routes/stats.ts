import { Hono } from 'hono';
import { stream } from 'hono/streaming';
import { db } from '../db';
import { workLogs, clients } from '../db/schema';
import { requireAuth } from '../lib/auth';
import { eq, and, sql, desc, asc, gte, lte } from 'drizzle-orm';

const app = new Hono<{ Variables: { userId: string } }>();

app.use('*', requireAuth);

// Helper: Get Date Range strictly as strings (YYYY-MM-DD) for SQLite index usage
const getDateRange = (range: string) => {
  const now = new Date();
  const d = new Date(now);
  
  switch (range) {
    case '24h': d.setDate(now.getDate() - 1); break;
    case '7d': d.setDate(now.getDate() - 7); break;
    case '30d': d.setDate(now.getDate() - 30); break;
    case '90d': d.setDate(now.getDate() - 90); break;
    case '6m': d.setMonth(d.getMonth() - 6); break;
    case '1y': d.setFullYear(d.getFullYear() - 1); break;
    default: d.setMonth(d.getMonth() - 6); break;
  }
  
  return {
    start: d.toISOString().split('T')[0], // "2026-01-01"
    end: now.toISOString().split('T')[0]
  };
};

/**
 * GET /stats/export
 * SCALABILITY FIX: Uses Streams & Chunking to prevent OOM (Out Of Memory) crashes.
 */
app.get('/export', async (c) => {
  const userId = c.get('userId');
  const range = c.req.query('range') || 'all'; 

  // Headers for CSV download
  c.header('Content-Type', 'text/csv; charset=utf-8');
  c.header('Content-Disposition', `attachment; filename="work_logs_${new Date().toISOString().split('T')[0]}.csv"`);

  return stream(c, async (stream) => {
    // 1. Write Header
    await stream.write(`Date,Client,Summary,Hours,Rate,Total,Status\n`);

    // 2. Build Query Filters
    const filters = [eq(workLogs.userId, userId)];
    if (range !== 'all') {
      const { start } = getDateRange(range);
      filters.push(gte(workLogs.date, start));
    }

    // 3. Batch Fetching (Chunking) to keep memory usage low
    // Fetching 100k rows at once crashes Node. Fetching 1000 at a time does not.
    const BATCH_SIZE = 1000;
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const logs = await db
        .select({
          date: workLogs.date,
          clientName: clients.companyName,
          summary: workLogs.summary,
          hours: workLogs.hoursWorked,
          rate: clients.hourlyRate,
          isBlocked: workLogs.isBlocked
        })
        .from(workLogs)
        .innerJoin(clients, eq(workLogs.clientId, clients.id))
        .where(and(...filters))
        .orderBy(desc(workLogs.date))
        .limit(BATCH_SIZE)
        .offset(offset);

      if (logs.length === 0) {
        hasMore = false;
        break;
      }

      // Process and write chunk
      const chunkString = logs.map(log => {
        const rate = log.rate || 0;
        const hours = log.hours || 0;
        const total = (rate * hours).toFixed(2);
        
        // CSV Injection protection and formatting
        const safeSummary = `"${(log.summary || '').replace(/"/g, '""').replace(/(\r\n|\n|\r)/g, ' ')}"`;
        const safeClient = `"${(log.clientName || 'Unknown').replace(/"/g, '""')}"`;
        const status = log.isBlocked ? 'Blocked' : 'Done';

        return `${log.date},${safeClient},${safeSummary},${hours},${rate},${total},${status}`;
      }).join('\n');

      await stream.write(chunkString + '\n');

      offset += BATCH_SIZE;
      
      // Artificial break to allow event loop to handle other requests (optional but good for massive exports)
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  });
});

/**
 * GET /stats
 * SCALABILITY FIX: Uses Promise.all for concurrency & optimized SQL logic
 */
app.get('/', async (c) => {
  try {
    const userId = c.get('userId');
    const range = c.req.query('range') || '6m';
    
    // 1. Prepare Date Logic
    const { start: startDateStr } = getDateRange(range);
    const isDailyGroup = ['24h', '7d', '30d'].includes(range);
    const groupByFormat = isDailyGroup ? '%Y-%m-%d' : '%Y-%m';

    // 2. Run Heavy Queries in PARALLEL (Drastically reduces latency)
    const [statsResult, historyResult, topClientsResult] = await Promise.all([
      
      // Query A: Dashboard Aggregates
      db.select({
          hoursPeriod: sql<number>`COALESCE(SUM(${workLogs.hoursWorked}), 0)`,
          earningsPeriod: sql<number>`COALESCE(SUM(${workLogs.hoursWorked} * ${clients.hourlyRate}), 0)`,
          blockedRevenue: sql<number>`COALESCE(SUM(CASE WHEN ${workLogs.isBlocked} = 1 THEN ${workLogs.hoursWorked} * ${clients.hourlyRate} ELSE 0 END), 0)`,
          pendingBlockersCount: sql<number>`COALESCE(SUM(CASE WHEN ${workLogs.isBlocked} = 1 THEN 1 ELSE 0 END), 0)`,
          activeClients: sql<number>`COUNT(DISTINCT ${workLogs.clientId})` // Only count clients active IN THIS PERIOD
        })
        .from(workLogs)
        .innerJoin(clients, eq(workLogs.clientId, clients.id))
        .where(and(
          eq(workLogs.userId, userId),
          gte(workLogs.date, startDateStr)
        )),

      // Query B: Revenue History (Chart)
      db.select({
          rawDate: sql<string>`strftime(${groupByFormat}, ${workLogs.date})`,
          amount: sql<number>`SUM(${workLogs.hoursWorked} * ${clients.hourlyRate})`
        })
        .from(workLogs)
        .innerJoin(clients, eq(workLogs.clientId, clients.id))
        .where(and(
          eq(workLogs.userId, userId),
          gte(workLogs.date, startDateStr)
        ))
        .groupBy(sql`strftime(${groupByFormat}, ${workLogs.date})`)
        .orderBy(asc(sql`strftime(${groupByFormat}, ${workLogs.date})`)),

      // Query C: Top Clients
      db.select({
          name: clients.companyName,
          amount: sql<number>`SUM(${workLogs.hoursWorked} * ${clients.hourlyRate})`
        })
        .from(workLogs)
        .innerJoin(clients, eq(workLogs.clientId, clients.id))
        .where(and(
          eq(workLogs.userId, userId),
          gte(workLogs.date, startDateStr)
        ))
        .groupBy(clients.id)
        .orderBy(desc(sql`SUM(${workLogs.hoursWorked} * ${clients.hourlyRate})`))
        .limit(5)
    ]);

    // 3. Process Results
    const dashboardStats = statsResult[0];

    // Format History Data
    const formattedHistory = historyResult.map(r => {
      let label = r.rawDate;
      if (!r.rawDate) return { period: 'Unknown', amount: 0, rawDate: '' };

      // Helper to make dates readable
      try {
        if (!isDailyGroup) {
          const [y, m] = r.rawDate.split('-');
          const date = new Date(parseInt(y), parseInt(m) - 1, 1);
          label = date.toLocaleString('default', { month: 'short' });
        } else {
          const date = new Date(r.rawDate);
          label = date.toLocaleString('default', { month: 'short', day: 'numeric' });
        }
      } catch (e) {
        label = r.rawDate;
      }
      return { period: label, amount: Number(r.amount || 0), rawDate: r.rawDate };
    });

    // Format Top Clients
    const totalRangeEarnings = topClientsResult.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    const formattedTopClients = topClientsResult.map(c => ({
      name: c.name,
      amount: Number(c.amount || 0),
      percent: totalRangeEarnings > 0 ? Math.round((Number(c.amount || 0) / totalRangeEarnings) * 100) : 0
    }));

    // Goals (Hardcoded for now, could be moved to User Settings DB)
    const GOAL_TARGET = 2000;
    const currentEarnings = Number(dashboardStats?.earningsPeriod || 0);

    return c.json({
      totalEarnings: currentEarnings,
      hoursThisMonth: Number(dashboardStats?.hoursPeriod || 0),
      activeClients: Number(dashboardStats?.activeClients || 0),
      blockedRevenue: Number(dashboardStats?.blockedRevenue || 0),
      pendingBlockersCount: Number(dashboardStats?.pendingBlockersCount || 0),
      goalTarget: GOAL_TARGET,
      goalPercent: Math.min(100, Math.round((currentEarnings / GOAL_TARGET) * 100)),
      revenueHistory: formattedHistory,
      topClients: formattedTopClients
    });

  } catch (err) {
    console.error('Stats API Error:', err);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

export { app as statsRouter };