import { Hono } from 'hono';
import { db } from '../db';
import { workLogs, clients } from '../db/schema';
import { requireAuth } from '../lib/auth';
import { eq, and, sql, desc, gte } from 'drizzle-orm';

const app = new Hono<{ Variables: { userId: string } }>();

app.use('*', requireAuth);

/**
 * Helper: Calculate Start Date safely
 */
const getStartDate = (range: string): Date => {
  const now = new Date();
  const d = new Date(now);
  
  switch (range) {
    case '24h': d.setDate(now.getDate() - 1); break;
    case '7d': d.setDate(now.getDate() - 7); break;
    case '30d': d.setDate(now.getDate() - 30); break;
    case '90d': d.setDate(now.getDate() - 90); break;
    case '6m': 
    default: d.setMonth(d.getMonth() - 6); break;
  }
  // Reset time to start of that day for consistent querying
  d.setHours(0, 0, 0, 0);
  return d;
};

// GET /stats/export
app.get('/export', async (c) => {
  try {
    const userId = c.get('userId');
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
      .where(eq(workLogs.userId, userId))
      .orderBy(desc(workLogs.date));

    const csvRows = [['Date', 'Client', 'Summary', 'Hours', 'Rate/Hr', 'Total', 'Status'].join(',')];
    
    logs.forEach(log => {
      const rate = log.rate || 0;
      const hours = log.hours || 0;
      const total = (rate * hours).toFixed(2);
      const safeSummary = `"${(log.summary || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`;
      const safeClient = `"${(log.clientName || 'Unknown').replace(/"/g, '""')}"`;
      const status = log.isBlocked ? 'Blocked' : 'Done';
      csvRows.push([log.date, safeClient, safeSummary, hours, rate, total, status].join(','));
    });

    return c.body(csvRows.join('\n'), 200, {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="earnings_export_${new Date().toISOString().split('T')[0]}.csv"`,
    });
  } catch (error) {
    console.error('Export Error:', error);
    return c.json({ error: 'Failed to generate export' }, 500);
  }
});

// GET /stats
app.get('/', async (c) => {
  try {
    const userId = c.get('userId');
    const range = c.req.query('range') || '6m';
    
    // 1. Calculate Date Context
    const now = new Date();
    const startDate = getStartDate(range);
    const startDateStr = startDate.toISOString().split('T')[0]; // YYYY-MM-DD
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
    
    const isDailyGroup = ['24h', '7d', '30d'].includes(range);
    // SQLite format: %Y-%m-%d for daily, %Y-%m for monthly
    const groupByFormat = isDailyGroup ? '%Y-%m-%d' : '%Y-%m';

    // 2. Dashboard Aggregates
    const [dashboardStats] = await db
      .select({
        hoursThisMonth: sql<number>`COALESCE(SUM(CASE WHEN ${workLogs.date} >= ${currentMonthStart} THEN ${workLogs.hoursWorked} ELSE 0 END), 0)`,
        monthlyEarnings: sql<number>`COALESCE(SUM(CASE WHEN ${workLogs.date} >= ${currentMonthStart} THEN ${workLogs.hoursWorked} * ${clients.hourlyRate} ELSE 0 END), 0)`,
        // Calculated revenue stuck in blocked tasks
        blockedRevenue: sql<number>`COALESCE(SUM(CASE WHEN ${workLogs.isBlocked} = 1 THEN ${workLogs.hoursWorked} * ${clients.hourlyRate} ELSE 0 END), 0)`,
        pendingBlockersCount: sql<number>`COALESCE(SUM(CASE WHEN ${workLogs.isBlocked} = 1 THEN 1 ELSE 0 END), 0)`,
        activeClients: sql<number>`COUNT(DISTINCT CASE WHEN ${clients.status} = 'active' THEN ${clients.id} END)`
      })
      .from(workLogs)
      .innerJoin(clients, eq(workLogs.clientId, clients.id))
      .where(eq(workLogs.userId, userId));

    // 3. Revenue History (Chart Data)
    const revenueHistory = await db
      .select({
        period: sql<string>`strftime(${groupByFormat}, ${workLogs.date})`,
        amount: sql<number>`SUM(${workLogs.hoursWorked} * ${clients.hourlyRate})`
      })
      .from(workLogs)
      .innerJoin(clients, eq(workLogs.clientId, clients.id))
      .where(and(
        eq(workLogs.userId, userId),
        gte(workLogs.date, startDateStr)
      ))
      .groupBy(sql`strftime(${groupByFormat}, ${workLogs.date})`)
      .orderBy(sql`strftime(${groupByFormat}, ${workLogs.date})`);

    // 4. Top Clients
    const topClients = await db
      .select({
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
      .limit(5);

    // 5. Transform Data for Frontend
    const formattedHistory = revenueHistory.map(r => {
      let label = r.period;
      // Safety check for null periods
      if (!r.period) return { period: 'Unknown', amount: 0 };

      try {
        if (!isDailyGroup) {
          // Format YYYY-MM -> "Jan"
          const [y, m] = r.period.split('-');
          const date = new Date(parseInt(y), parseInt(m) - 1, 1);
          label = date.toLocaleString('default', { month: 'short' });
        } else {
          // Format YYYY-MM-DD -> "Jan 12"
          const date = new Date(r.period);
          label = date.toLocaleString('default', { month: 'short', day: 'numeric' });
        }
      } catch (e) {
        label = r.period; // Fallback to raw string
      }
      
      return {
        period: label,
        amount: Number(r.amount || 0)
      };
    });

    const totalRangeEarnings = topClients.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

    const formattedTopClients = topClients.map(c => ({
      name: c.name,
      amount: Number(c.amount || 0),
      percent: totalRangeEarnings > 0 
        ? Math.round((Number(c.amount || 0) / totalRangeEarnings) * 100) 
        : 0
    }));

    const GOAL_TARGET = 2000;
    const monthlyEarnings = Number(dashboardStats?.monthlyEarnings || 0);

    return c.json({
      totalEarnings: monthlyEarnings,
      hoursThisMonth: Number(dashboardStats?.hoursThisMonth || 0),
      activeClients: Number(dashboardStats?.activeClients || 0),
      blockedRevenue: Number(dashboardStats?.blockedRevenue || 0),
      pendingBlockersCount: Number(dashboardStats?.pendingBlockersCount || 0),
      goalTarget: GOAL_TARGET,
      goalPercent: Math.min(100, Math.round((monthlyEarnings / GOAL_TARGET) * 100)),
      revenueHistory: formattedHistory,
      topClients: formattedTopClients
    });

  } catch (err) {
    console.error('Stats API Error:', err);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

export { app as statsRouter };