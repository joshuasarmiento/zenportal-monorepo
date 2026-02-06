import { Hono } from 'hono';
import { stream } from 'hono/streaming';
import { db } from '../db/index.js';
import { workLogs, clients, workspaces } from '../db/schema.js';
import { requireAuth, type AuthVariables } from '../lib/auth.js';
import { eq, and, sql, desc, asc, gte, count } from 'drizzle-orm';

const app = new Hono<{ Variables: AuthVariables }>();

app.use('*', requireAuth);

// Helper: Get Date Range
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
 */
app.get('/export', async (c) => {
  const userId = c.get('userId');
  const workspace = c.get('workspace');
  if (!workspace) return c.json({ error: 'No active workspace' }, 401);

  const range = c.req.query('range') || 'all';

  // 1. SECURITY CHECK: Is Workspace Pro?
  if (workspace.tier !== 'pro') {
    return c.json({ error: 'Export is a Pro feature' }, 403);
  }

  // Headers for CSV download
  c.header('Content-Type', 'text/csv; charset=utf-8');
  c.header('Content-Disposition', `attachment; filename="work_logs_${new Date().toISOString().split('T')[0]}.csv"`);

  return stream(c, async (stream) => {
    // 1. Write Header
    await stream.write(`Date,Client,Summary,Hours,Rate,Total,Status,Video Link,Attachment\n`);

    // 2. Build Query Filters based on Workspace Clients
    // We want logs for clients in this workspace. 
    // Filter: workLogs -> innerJoin clients -> clients.workspaceId = workspace.id
    // Should we verify userId? "My Logs" vs "Team Logs"?
    // "Export" usually implies "My Work" or "Workspace Work" depending on role.
    // For now, let's export "My Work" within "This Workspace".
    const baseFilters = [
      eq(workLogs.userId, userId),
      eq(clients.workspaceId, workspace.id)
    ];

    if (range !== 'all') {
      const { start } = getDateRange(range);
      baseFilters.push(gte(workLogs.date, start));
    }

    // 3. Batch Fetching (Chunking)
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
          isBlocked: workLogs.isBlocked,
          video: workLogs.videoUrl,
          file: workLogs.attachmentUrl
        })
        .from(workLogs)
        .innerJoin(clients, eq(workLogs.clientId, clients.id))
        .where(and(...baseFilters))
        .orderBy(desc(workLogs.date))
        .limit(BATCH_SIZE)
        .offset(offset);

      if (logs.length === 0) {
        hasMore = false;
        break;
      }

      const chunkString = logs.map(log => {
        const rate = log.rate || 0;
        const hours = log.hours || 0;
        const total = (rate * hours).toFixed(2);

        const safeSummary = `"${(log.summary || '').replace(/"/g, '""').replace(/(\r\n|\n|\r)/g, ' ')}"`;
        const safeClient = `"${(log.clientName || 'Unknown').replace(/"/g, '""')}"`;
        const status = log.isBlocked ? 'Blocked' : 'Done';
        const videoLink = log.video || '';
        const fileLink = log.file || '';

        return `${log.date},${safeClient},${safeSummary},${videoLink},${fileLink},${hours},${rate},${total},${status}`;
      }).join('\n');

      await stream.write(chunkString + '\n');

      offset += BATCH_SIZE;
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  });
});

/**
 * GET /stats
 */
app.get('/', async (c) => {
  const userId = c.get('userId');
  const workspace = c.get('workspace');
  if (!workspace) return c.json({ error: 'No active workspace' }, 401);

  const range = c.req.query('range') || '6m';

  // 1. Prepare Date Logic
  const { start: startDateStr } = getDateRange(range);
  const isDailyGroup = ['24h', '7d', '30d'].includes(range);
  const groupByFormat = isDailyGroup ? '%Y-%m-%d' : '%Y-%m';
  const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"

  // Base Logic: Stats for "Me" in "This Workspace"
  const baseCondition = and(
    eq(workLogs.userId, userId),
    eq(clients.workspaceId, workspace.id) // Ensure integrity through join
  );

  const dateCondition = gte(workLogs.date, startDateStr);

  // 2. Run Heavy Queries in PARALLEL
  const [statsResult, historyResult, topClientsResult, usageResult] = await Promise.all([

    // Query A: Dashboard Aggregates
    db.select({
      hoursPeriod: sql<number>`COALESCE(SUM(${workLogs.hoursWorked}), 0)`,
      earningsPeriod: sql<number>`COALESCE(SUM(${workLogs.hoursWorked} * ${clients.hourlyRate}), 0)`,
      blockedRevenue: sql<number>`COALESCE(SUM(CASE WHEN ${workLogs.isBlocked} = 1 THEN ${workLogs.hoursWorked} * ${clients.hourlyRate} ELSE 0 END), 0)`,
      pendingBlockersCount: sql<number>`COALESCE(SUM(CASE WHEN ${workLogs.isBlocked} = 1 THEN 1 ELSE 0 END), 0)`,
      activeClients: sql<number>`COUNT(DISTINCT ${workLogs.clientId})`
    })
      .from(workLogs)
      .innerJoin(clients, eq(workLogs.clientId, clients.id))
      .where(and(baseCondition, dateCondition)),

    // Query B: Revenue History (Chart)
    db.select({
      rawDate: sql<string>`strftime(${groupByFormat}, ${workLogs.date})`,
      amount: sql<number>`SUM(${workLogs.hoursWorked} * ${clients.hourlyRate})`
    })
      .from(workLogs)
      .innerJoin(clients, eq(workLogs.clientId, clients.id))
      .where(and(baseCondition, dateCondition))
      .groupBy(sql`strftime(${groupByFormat}, ${workLogs.date})`)
      .orderBy(asc(sql`strftime(${groupByFormat}, ${workLogs.date})`)),

    // Query C: Top Clients
    db.select({
      name: clients.companyName,
      amount: sql<number>`SUM(${workLogs.hoursWorked} * ${clients.hourlyRate})`
    })
      .from(workLogs)
      .innerJoin(clients, eq(workLogs.clientId, clients.id))
      .where(and(baseCondition, dateCondition))
      .groupBy(clients.id)
      .orderBy(desc(sql`SUM(${workLogs.hoursWorked} * ${clients.hourlyRate})`))
      .limit(5),

    // Query D: Monthly Log Count for Usage Limit (Workspace Wide?)
    // If usage limit is per Workspace, we should count all logs in workspace?
    // "Freelancer" = "Workspace".
    // If I am in an Agency, does my 100 log limit apply to ME or the AGENCY?
    // Usually Agencies have Pro.
    // Let's assume limit applies to the WORKSPACE total volume if Free.
    // So we should query ALL logs in workspace.
    // BUT `logs.ts` logic seemed to focus on User's usage (legacy).
    // In `logs.ts` updated version, I filtered by `clients.workspaceId`.
    // Let's match that here regardless of userId.
    db
      .select({ count: count() })
      .from(workLogs)
      .innerJoin(clients, eq(workLogs.clientId, clients.id))
      .where(and(
        eq(clients.workspaceId, workspace.id), // Count all logs in workspace
        sql`${workLogs.date} LIKE ${currentMonth + '%'}`
      ))
  ]);

  // 3. Process Results
  const dashboardStats = statsResult[0];
  const logCount = usageResult[0]?.count || 0;

  // Format History Data
  const formattedHistory = historyResult.map(r => {
    let label = r.rawDate;
    if (!r.rawDate) return { period: 'Unknown', amount: 0, rawDate: '' };

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

  const GOAL_TARGET = 2000;
  const currentEarnings = Number(dashboardStats?.earningsPeriod || 0);

  return c.json({
    totalEarnings: currentEarnings,
    hoursThisMonth: Number(dashboardStats?.hoursPeriod || 0),
    activeClients: Number(dashboardStats?.activeClients || 0),
    blockedRevenue: Number(dashboardStats?.blockedRevenue || 0),
    pendingBlockersCount: Number(dashboardStats?.pendingBlockersCount || 0),
    logCount: logCount,
    goalTarget: GOAL_TARGET,
    goalPercent: Math.min(100, Math.round((currentEarnings / GOAL_TARGET) * 100)),
    revenueHistory: formattedHistory,
    topClients: formattedTopClients
  });
});

export { app as statsRouter };