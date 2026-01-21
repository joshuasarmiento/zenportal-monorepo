import { Hono } from 'hono';
import { db } from '../db';
import { workLogs } from '../db/schema';
import { requireAuth } from '../lib/auth';
import { eq, desc } from 'drizzle-orm';
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

  const newLog = await db.insert(workLogs).values({
    id: uuidv4(),
    userId: userId,
    clientId: body.clientId,
    date: body.date,
    summary: body.summary,
    hoursWorked: body.hoursWorked,
    videoUrl: body.videoUrl, // Loom link
    isBlocked: body.isBlocked || false,
    blockerDetails: body.blockerDetails,
  }).returning();

  // TODO: Trigger Email Notification to Client here (using Resend)

  return c.json(newLog[0]);
});

export { app as logsRouter };