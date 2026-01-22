import { Hono } from 'hono';
import { db } from '../db';
import { workLogs, users } from '../db/schema';
import { requireAuth } from '../lib/auth';
import { and, eq, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

const app = new Hono<{ Variables: { userId: string } }>();

app.use('*', requireAuth);

// GET /logs - Get recent logs
app.get('/', async (c) => {
  const userId = c.get('userId');
  const logs = await db.query.workLogs.findMany({
    where: eq(workLogs.userId, userId),
    with: { client: true }, // Join with Client table to get Company Name
    orderBy: [desc(workLogs.date)],
    limit: 20,
  });
  return c.json(logs);
});

// POST /logs - Create a new entry
app.post('/', async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json();

  // 1. Get User Tier
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { tier: true }
  });

  const isPro = user?.tier === 'pro';

  // 2. Enforce Pro Features (Video Integrations)
  // If user sends a video URL but is NOT pro, ignore it or throw error.
  // Here we simply strip it out to enforce "Basic" logging.
  const videoUrl = isPro ? body.videoUrl : null;
  const attachmentUrl = isPro ? body.attachmentUrl : null; // Optional: restrict attachments too

  const newLog = await db.insert(workLogs).values({
    id: uuidv4(),
    userId: userId,
    clientId: body.clientId,
    date: body.date,
    summary: body.summary,
    hoursWorked: body.hoursWorked,

    // Only save these if Pro
    videoUrl: body.videoUrl,
    attachmentUrl: body.attachmentUrl,

    isBlocked: body.isBlocked || false,
    blockerDetails: body.blockerDetails,
  }).returning();

  // TODO: Trigger Email Notification to Client here (using Resend)

  return c.json(newLog[0]);
});

// GET /logs/:id - Fetch Single Log Detail
app.get('/:id', async (c) => {
  const userId = c.get('userId');
  const logId = c.req.param('id');

  const log = await db.query.workLogs.findFirst({
    where: and(eq(workLogs.id, logId), eq(workLogs.userId, userId)),
    with: { client: true }, // Include client details
  });

  if (!log) return c.json({ error: 'Log not found' }, 404);
  return c.json(log);
});

export { app as logsRouter };