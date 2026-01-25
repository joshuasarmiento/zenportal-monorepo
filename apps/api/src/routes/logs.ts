import { Hono } from 'hono';
import { db } from '../db';
import { workLogs, users, clients } from '../db/schema';
import { requireAuth } from '../lib/auth';
import { and, eq, desc, sql, count } from 'drizzle-orm'; // Added sql, count
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { sendLogEmail } from '../lib/email';

const app = new Hono<{ Variables: { userId: string } }>();

app.use('*', requireAuth);

// Schema Validation
const logSchema = z.object({
  clientId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  summary: z.string().min(1, 'Summary is required'),
  hoursWorked: z.number().positive(),
  videoUrl: z.string().url().optional().or(z.literal('')),
  attachmentUrl: z.string().url().optional().or(z.literal('')),
  isBlocked: z.boolean().optional(),
  blockerDetails: z.string().optional()
});

const updateLogSchema = logSchema.partial();

// GET /logs - Get logs with Pagination
app.get('/', async (c) => {
  const userId = c.get('userId');
  const page = Number(c.req.query('page') || 1);
  const limit = 20;
  const offset = (page - 1) * limit;

  const logs = await db.query.workLogs.findMany({
    where: eq(workLogs.userId, userId),
    with: { client: true },
    orderBy: [desc(workLogs.date)],
    limit: limit,
    offset: offset,
  });

  return c.json(logs);
});

// POST /logs - Create a new entry
app.post('/', zValidator('json', logSchema), async (c) => {
  const userId = c.get('userId');
  const body = c.req.valid('json');

  // 1. Get User Tier
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { tier: true, fullName: true }
  });

  const isPro = user?.tier === 'pro';

  // 2. Enforce Monthly Limit for Free Tier
  if (!isPro) {
    const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"

    // Count logs created by this user in the current month
    // Note: Adjust the SQL syntax if you are using Postgres vs SQLite (this is generally compatible)
    const [usage] = await db
      .select({ count: count() })
      .from(workLogs)
      .where(and(
        eq(workLogs.userId, userId),
        sql`${workLogs.date} LIKE ${currentMonth + '%'}`
      ));

    if (usage.count >= 100) {
      return c.json({
        error: 'Monthly limit reached (100 logs). Upgrade to Pro for unlimited logs.',
        code: 'LIMIT_REACHED'
      }, 403);
    }
  }

  // 3. Enforce Pro Features (Video/Attachment)
  const videoUrl = isPro ? body.videoUrl : null;
  const attachmentUrl = isPro ? body.attachmentUrl : null;

  const newLog = await db.insert(workLogs).values({
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

  // 4. Trigger Email Notification
  const client = await db.query.clients.findFirst({
    where: eq(clients.id, body.clientId),
    columns: { contactEmail: true, companyName: true, accessToken: true }
  });

  if (client?.contactEmail && user?.fullName) {
    const reportLink = `${process.env.FRONTEND_URL}/c/${client.accessToken}`;

    await sendLogEmail({
      to: client.contactEmail,
      clientName: client.companyName,
      vaName: user.fullName,
      summary: body.summary,
      link: reportLink
    });
  }

  return c.json(newLog[0]);
});

// GET /logs/:id (Unchanged)
app.get('/:id', async (c) => {
  const userId = c.get('userId');
  const logId = c.req.param('id');

  const log = await db.query.workLogs.findFirst({
    where: and(eq(workLogs.id, logId), eq(workLogs.userId, userId)),
    with: { client: true },
  });

  if (!log) return c.json({ error: 'Log not found' }, 404);
  return c.json(log);
});

// PATCH /logs/:id
app.patch('/:id', zValidator('json', updateLogSchema), async (c) => {
  const userId = c.get('userId');
  const logId = c.req.param('id');
  const body = c.req.valid('json');

  const existingLog = await db.query.workLogs.findFirst({
    where: and(eq(workLogs.id, logId), eq(workLogs.userId, userId)),
  });

  if (!existingLog) return c.json({ error: 'Log not found or unauthorized' }, 404);

  const updatedLog = await db.update(workLogs)
    .set(body)
    .where(eq(workLogs.id, logId))
    .returning();

  return c.json(updatedLog[0]);
});

export { app as logsRouter };