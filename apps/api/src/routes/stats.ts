import { Hono } from 'hono';
import { db } from '../db';
import { workLogs, clients } from '../db/schema';
import { requireAuth } from '../lib/auth';
import { eq, and, sql, desc, gte } from 'drizzle-orm';

const app = new Hono<{ Variables: { userId: string } }>();

app.use('*', requireAuth);

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
    
    // FIX 1: Use startDateStr for the cards too, not just the chart
    const filterDate = startDateStr; 
    
    const isDailyGroup = ['24h', '7d', '30d'].includes(range);
    const groupByFormat = isDailyGroup ? '%Y-%m-%d' : '%Y-%m';

    // 2. Dashboard Aggregates (Updated to use filterDate)
    const [dashboardStats] = await db
      .select({
        // FIX 1: Changed condition to use filterDate
        hoursPeriod: sql<number>`COALESCE(SUM(CASE WHEN ${workLogs.date} >= ${filterDate} THEN ${workLogs.hoursWorked} ELSE 0 END), 0)`,
        
        // FIX 1: Changed condition to use filterDate
        earningsPeriod: sql<number>`COALESCE(SUM(CASE WHEN ${workLogs.date} >= ${filterDate} THEN ${workLogs.hoursWorked} * ${clients.hourlyRate} ELSE 0 END), 0)`,
        
        // Blocked is usually "current status", so we check all time or period? 
        // Let's keep blocked as "current unresolved" (All Time) because a blocker from last month is still a blocker today.
        blockedRevenue: sql<number>`COALESCE(SUM(CASE WHEN ${workLogs.isBlocked} = 1 THEN ${workLogs.hoursWorked} * ${clients.hourlyRate} ELSE 0 END), 0)`,
        pendingBlockersCount: sql<number>`COALESCE(SUM(CASE WHEN ${workLogs.isBlocked} = 1 THEN 1 ELSE 0 END), 0)`,
        
        activeClients: sql<number>`COUNT(DISTINCT CASE WHEN ${clients.status} = 'active' THEN ${clients.id} END)`
      })
      .from(workLogs)
      .innerJoin(clients, eq(workLogs.clientId, clients.id))
      .where(eq(workLogs.userId, userId));

    // 3. Revenue History
    const revenueHistory = await db
      .select({
        rawDate: sql<string>`strftime(${groupByFormat}, ${workLogs.date})`, // Keep raw for sorting
        amount: sql<number>`SUM(${workLogs.hoursWorked} * ${clients.hourlyRate})`
      })
      .from(workLogs)
      .innerJoin(clients, eq(workLogs.clientId, clients.id))
      .where(and(
        eq(workLogs.userId, userId),
        gte(workLogs.date, startDateStr)
      ))
      .groupBy(sql`strftime(${groupByFormat}, ${workLogs.date})`)
      .orderBy(sql`strftime(${groupByFormat}, ${workLogs.date})`); // Backend sorts correctly (YYYY-MM)

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

    // 5. Formatting
    const formattedHistory = revenueHistory.map(r => {
      let label = r.rawDate;
      if (!r.rawDate) return { period: 'Unknown', amount: 0, rawDate: '' };

      try {
        if (!isDailyGroup) {
          // YYYY-MM -> "Jan"
          const [y, m] = r.rawDate.split('-');
          const date = new Date(parseInt(y), parseInt(m) - 1, 1);
          label = date.toLocaleString('default', { month: 'short' });
        } else {
          // YYYY-MM-DD -> "Jan 12"
          const date = new Date(r.rawDate);
          label = date.toLocaleString('default', { month: 'short', day: 'numeric' });
        }
      } catch (e) {
        label = r.rawDate;
      }
      
      return {
        period: label,
        amount: Number(r.amount || 0),
        rawDate: r.rawDate // Send this to frontend so we don't have to guess order
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
    const currentEarnings = Number(dashboardStats?.earningsPeriod || 0);

    return c.json({
      totalEarnings: currentEarnings,
      hoursThisMonth: Number(dashboardStats?.hoursPeriod || 0), // Now reflects selected range
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