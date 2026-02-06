import { Hono } from 'hono';
import { db } from '../db/index.js';
import { workLogs, clients, workspaces, users } from '../db/schema.js';
import { requireAuth, type AuthVariables } from '../lib/auth.js';
import { and, eq, desc, sql, count } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { sendLogEmail } from '../lib/email.js';
import { config } from '../config.js';

const app = new Hono<{ Variables: AuthVariables }>();

app.use('*', requireAuth);

// Schema Validation
const logSchema = z.object({
  clientId: z.uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  summary: z.string().min(1, 'Summary is required'),
  hoursWorked: z.number().positive(),
  videoUrl: z.url().optional().or(z.literal('')),
  attachmentUrl: z.url().optional().or(z.literal('')),
  isBlocked: z.boolean().optional(),
  blockerDetails: z.string().optional()
});

const updateLogSchema = logSchema.partial();

// GET /logs - Get logs with Pagination
app.get('/', async (c) => {
  const userId = c.get('userId'); // Still allow filtering by "My Logs"
  const workspace = c.get('workspace');
  if (!workspace) return c.json({ error: 'No active workspace' }, 401);

  // We should only show logs that belong to clients in the CURRENT workspace.
  // And arguably, only logs created by the current user? Or all logs in workspace?
  // Use case: "My Work Logs".
  // Let's filter by BOTH userId AND workspace context via Client relationship.
  // But optimized: Filter by userId, then we can filter in memory or join.
  // Better: Join. 
  // Drizzle query builder with `with` handles this.

  const page = Number(c.req.query('page') || 1);
  const limit = 20;
  const offset = (page - 1) * limit;

  // We want logs where userId = me AND client.workspaceId = currentWorkspace
  // This is tricky with simple query builder unless we start from clients or use sql.
  // Let's rely on the fact that if I switch workspace, I should only see clients from that workspace.
  // So validation on frontend filters clients.
  // But backend must enforce.

  // Alternative: query.workLogs.findMany where userId = me.
  // Then filter result? Pagination breaks.

  // Correct Drizzle way:
  // We need to ensure the client belongs to the workspace.
  // But Drizzle Query API is limited for deep filtering.
  // Let's use `db.select().from(workLogs).innerJoin(clients, ...)`

  const logs = await db.select({
    id: workLogs.id,
    userId: workLogs.userId,
    clientId: workLogs.clientId,
    date: workLogs.date,
    summary: workLogs.summary,
    hoursWorked: workLogs.hoursWorked,
    videoUrl: workLogs.videoUrl,
    attachmentUrl: workLogs.attachmentUrl,
    isBlocked: workLogs.isBlocked,
    blockerDetails: workLogs.blockerDetails,
    createdAt: workLogs.createdAt,
    client: clients // Select client data too
  })
    .from(workLogs)
    .innerJoin(clients, eq(workLogs.clientId, clients.id))
    .where(and(
      eq(workLogs.userId, userId),
      eq(clients.workspaceId, workspace.id)
    ))
    .orderBy(desc(workLogs.date))
    .limit(limit)
    .offset(offset);

  // Transform to match previous structure (nested client)
  const formattedLogs = logs.map(l => ({
    ...l,
    client: l.client
  }));

  return c.json(formattedLogs);
});

// POST /logs - Create a new entry
app.post('/', zValidator('json', logSchema), async (c) => {
  const userId = c.get('userId');
  const workspace = c.get('workspace');
  if (!workspace) return c.json({ error: 'No active workspace' }, 401);

  const body = c.req.valid('json');

  let result;

  try {
    result = await db.transaction(async (tx) => {
      // 1. Verify Client belongs to Workspace
      const client = await tx.query.clients.findFirst({
        where: and(eq(clients.id, body.clientId), eq(clients.workspaceId, workspace.id)),
        columns: { id: true, contactEmail: true, companyName: true, accessToken: true }
      });

      if (!client) throw new Error('CLIENT_NOT_FOUND_OR_ACCESS_DENIED');

      // 2. Get Workspace Tier Limits
      const workspaceData = await tx.query.workspaces.findFirst({
        where: eq(workspaces.id, workspace.id),
        columns: { tier: true, notifyClientOnLog: true }
      });

      const isPro = workspaceData?.tier === 'pro';

      // 3. Enforce Monthly Limit via Workspace count or User count?
      // Let's enforce per Workspace total logs? Or per User in Workspace?
      // Plan: "Freelancer vs Agency". 
      // If Agency is Free, limit applies to whole agency? usage limits usually account-wide.
      // Let's assume LIMIT is per Workspace.

      if (!isPro) {
        const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"

        // Count all logs in this workspace for this month
        // Requires join
        const [usage] = await tx
          .select({ count: count() })
          .from(workLogs)
          .innerJoin(clients, eq(workLogs.clientId, clients.id))
          .where(and(
            eq(clients.workspaceId, workspace.id),
            sql`${workLogs.date} LIKE ${currentMonth + '%'}`
          ));

        if (usage.count >= 100) {
          throw new Error('LIMIT_REACHED');
        }
      }

      // 4. Enforce Pro Features
      const videoUrl = isPro ? body.videoUrl : null;
      const attachmentUrl = body.attachmentUrl || null;

      const insertedLog = await tx.insert(workLogs).values({
        id: uuidv4(),
        userId: userId,
        clientId: body.clientId,
        date: body.date,
        summary: body.summary,
        hoursWorked: body.hoursWorked,
        videoUrl: videoUrl || null,
        attachmentUrl: attachmentUrl || null,
        isBlocked: body.isBlocked || false,
        blockerDetails: body.blockerDetails || '',
      }).returning();

      // Fetch user name for email
      const user = await tx.query.users.findFirst({
        where: eq(users.id, userId),
        columns: { name: true }
      });

      return { log: insertedLog[0], workspaceData, client, user };
    });
  } catch (err: any) {
    if (err.message === 'LIMIT_REACHED') {
      return c.json({
        error: 'Monthly workspace limit reached (100 logs). Upgrade to Pro.',
        code: 'LIMIT_REACHED'
      }, 403);
    }
    if (err.message === 'CLIENT_NOT_FOUND_OR_ACCESS_DENIED') {
      return c.json({ error: 'Invalid Client' }, 400);
    }
    throw err;
  }

  // Restore variables
  const { log: newLogItem, workspaceData, client, user } = result as any;
  const newLog = [newLogItem];

  // 5. Trigger Email Notification
  // Use workspace settings, not user settings
  if (client?.contactEmail && user?.name && workspaceData?.notifyClientOnLog) {
    const reportLink = `${config.app.frontendUrl}/c/${client.accessToken}`;

    await sendLogEmail({
      to: client.contactEmail,
      clientName: client.companyName,
      vaName: user.name, // "John Doe" from "Agency X"
      summary: body.summary,
      link: reportLink
    });
  }

  return c.json(newLog[0]);
});

// GET /logs/:id
app.get('/:id', async (c) => {
  const userId = c.get('userId');
  const workspace = c.get('workspace');
  if (!workspace) return c.json({ error: 'No active workspace' }, 401);
  const logId = c.req.param('id');

  const log = await db.query.workLogs.findFirst({
    where: and(eq(workLogs.id, logId), eq(workLogs.userId, userId)),
    with: { client: true },
  });

  if (!log) return c.json({ error: 'Log not found' }, 404);

  // Security check: ensure log's client belongs to current workspace
  if (log.client.workspaceId !== workspace.id) {
    return c.json({ error: 'Unauthorized' }, 403);
  }

  return c.json(log);
});

// PATCH /logs/:id
app.patch('/:id', zValidator('json', updateLogSchema), async (c) => {
  const userId = c.get('userId');
  const workspace = c.get('workspace');
  if (!workspace) return c.json({ error: 'No active workspace' }, 401);

  const logId = c.req.param('id');
  const body = c.req.valid('json');

  const workspaceData = await db.query.workspaces.findFirst({
    where: eq(workspaces.id, workspace.id),
    columns: { tier: true }
  });

  if (body.videoUrl && workspaceData?.tier !== 'pro') {
    delete body.videoUrl;
  }

  // Ensure log exists and belongs to user AND workspace
  // We first fetch it to check workspace ownership via client
  const existingLog = await db.query.workLogs.findFirst({
    where: and(eq(workLogs.id, logId), eq(workLogs.userId, userId)),
    with: { client: true }
  });

  if (!existingLog || existingLog.client.workspaceId !== workspace.id) {
    return c.json({ error: 'Log not found or unauthorized' }, 404);
  }

  const updatedLog = await db.update(workLogs)
    .set(body)
    .where(eq(workLogs.id, logId))
    .returning();

  return c.json(updatedLog[0]);
});

export { app as logsRouter };