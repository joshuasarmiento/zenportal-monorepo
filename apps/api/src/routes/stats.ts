import { Hono } from 'hono';
import { db } from '../db';
import { workLogs, clients } from '../db/schema';
import { requireAuth } from '../lib/auth';
import { eq, and, sql, desc, gte } from 'drizzle-orm';

const app = new Hono<{ Variables: { userId: string } }>();

app.use('*', requireAuth);

app.get('/', async (c) => {
  const userId = c.get('userId');
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);

  // 1. Dashboard Aggregates (Single Query)
  const [dashboardStats] = await db
    .select({
      hoursThisMonth: sql<number>`COALESCE(SUM(CASE WHEN ${workLogs.date} >= ${currentMonthStart} THEN ${workLogs.hoursWorked} ELSE 0 END), 0)`,
      totalEarnings: sql<number>`COALESCE(SUM(${workLogs.hoursWorked} * ${clients.hourlyRate}), 0)`,
      monthlyEarnings: sql<number>`COALESCE(SUM(CASE WHEN ${workLogs.date} >= ${currentMonthStart} THEN ${workLogs.hoursWorked} * ${clients.hourlyRate} ELSE 0 END), 0)`,
      pendingBlockers: sql<number>`COALESCE(SUM(CASE WHEN ${workLogs.isBlocked} = 1 THEN 1 ELSE 0 END), 0)`,
      activeClients: sql<number>`COUNT(DISTINCT CASE WHEN ${clients.status} = 'active' THEN ${clients.id} END)`
    })
    .from(workLogs)
    .innerJoin(clients, eq(workLogs.clientId, clients.id))
    .where(eq(workLogs.userId, userId));

  // 2. Revenue History (Last 6 Months via Group By)
  // SQLite specific syntax for month extraction (adjust for Postgres/MySQL if needed)
  const revenueHistory = await db
    .select({
      month: sql<string>`strftime('%Y-%m', ${workLogs.date})`,
      amount: sql<number>`SUM(${workLogs.hoursWorked} * ${clients.hourlyRate})`
    })
    .from(workLogs)
    .innerJoin(clients, eq(workLogs.clientId, clients.id))
    .where(eq(workLogs.userId, userId))
    .groupBy(sql`strftime('%Y-%m', ${workLogs.date})`)
    .orderBy(desc(sql`strftime('%Y-%m', ${workLogs.date})`))
    .limit(6);

  // 3. Top Clients (Group By)
  const topClients = await db
    .select({
      name: clients.companyName,
      amount: sql<number>`SUM(${workLogs.hoursWorked} * ${clients.hourlyRate})`
    })
    .from(workLogs)
    .innerJoin(clients, eq(workLogs.clientId, clients.id))
    .where(eq(workLogs.userId, userId))
    .groupBy(clients.id)
    .orderBy(desc(sql`SUM(${workLogs.hoursWorked} * ${clients.hourlyRate})`))
    .limit(3);

  // Formatting for Frontend
  const formattedHistory = revenueHistory.reverse().map(r => ({
    month: new Date(r.month + '-01').toLocaleString('default', { month: 'short' }),
    amount: Number(r.amount)
  }));

  const total = Number(dashboardStats.totalEarnings);
  const formattedTopClients = topClients.map(c => ({
    name: c.name,
    amount: Number(c.amount),
    percent: total > 0 ? Math.round((Number(c.amount) / total) * 100) : 0
  }));

  return c.json({
    hoursThisMonth: Number(dashboardStats.hoursThisMonth),
    activeClients: Number(dashboardStats.activeClients),
    pendingBlockers: Number(dashboardStats.pendingBlockers),
    totalEarnings: Number(dashboardStats.monthlyEarnings), // Current Month Earnings
    pending: 0, // Placeholder for invoice logic
    goalTarget: 2000,
    goalPercent: Math.min(100, Math.round((Number(dashboardStats.monthlyEarnings) / 2000) * 100)),
    revenueHistory: formattedHistory,
    topClients: formattedTopClients
  });
});

export { app as statsRouter };