import { Hono } from 'hono';
import { db } from '../db';
import { workLogs, clients } from '../db/schema';
import { requireAuth } from '../lib/auth';
import { eq, and, sql } from 'drizzle-orm';

const app = new Hono<{ Variables: { userId: string } }>();

app.use('*', requireAuth);

app.get('/', async (c) => {
  const userId = c.get('userId');

  // 1. Calculate Hours (Current Month)
  // Note: For simplicity, this sums ALL hours. In production, add a date filter.
  const hoursResult = await db
    .select({ total: sql<number>`sum(${workLogs.hoursWorked})` })
    .from(workLogs)
    .where(eq(workLogs.userId, userId));

  // 2. Count Active Clients
  const clientsResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(clients)
    .where(and(eq(clients.userId, userId), eq(clients.status, 'active')));

  // 3. Count Blockers
  const blockersResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(workLogs)
    .where(and(eq(workLogs.userId, userId), eq(workLogs.isBlocked, true)));

  return c.json({
    hoursThisMonth: hoursResult[0]?.total || 0,
    activeClients: clientsResult[0]?.count || 0,
    pendingBlockers: blockersResult[0]?.count || 0,
  });
});

export { app as statsRouter };