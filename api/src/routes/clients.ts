import { Hono } from 'hono';
import { db } from '../db/index.js';
import { clients, users } from '../db/schema.js';
import { requireAuth } from '../lib/auth.js';
import { eq, and, desc, count } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const app = new Hono<{ Variables: { userId: string } }>();

// 1. Define Limit Constant (Easy to change later)
const FREE_PLAN_LIMIT = 1;

app.use('*', requireAuth);

const clientSchema = z.object({
  companyName: z.string().min(1),
  contactName: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal('')),
  hourlyRate: z.number().min(0),
  status: z.enum(['active', 'archived']).optional(),
});

const updateClientSchema = clientSchema.partial();

// GET /clients - READ ONLY (Always allowed)
app.get('/', async (c) => {
  const userId = c.get('userId');
  const page = Number(c.req.query('page')) || 1;
  const limit = Number(c.req.query('limit')) || 50;
  const offset = (page - 1) * limit;

  const myClients = await db.query.clients.findMany({
    where: eq(clients.userId, userId),
    orderBy: [desc(clients.createdAt)],
    limit: limit,
    offset: offset,
  });

  // Optional: Return metadata if needed (not requested but helpful)
  // For now just returning the array as before, but paginated.
  return c.json(myClients);
});

// GET /clients/:id
app.get('/:id', async (c) => {
  const userId = c.get('userId');
  const clientId = c.req.param('id');

  const client = await db.query.clients.findFirst({
    where: and(eq(clients.id, clientId), eq(clients.userId, userId)),
  });

  if (!client) return c.json({ error: 'Not found' }, 404);
  return c.json(client);
});

// POST /clients - CREATION (Protected by Soft Lock)
app.post('/', zValidator('json', clientSchema), async (c) => {
  const userId = c.get('userId');
  const body = c.req.valid('json');

  // Run checks in parallel for better performance
  const [user, clientCountData] = await Promise.all([
    db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { tier: true }
    }),
    db.select({ count: count() })
      .from(clients)
      .where(and(
        eq(clients.userId, userId),
        eq(clients.status, 'active') // Only count active clients
      ))
  ]);

  const currentCount = clientCountData[0]?.count || 0;
  const isPro = user?.tier === 'pro';

  // 2. The Soft Lock Logic
  if (!isPro && currentCount >= FREE_PLAN_LIMIT) {
    return c.json({
      error: 'Limit Reached',
      message: `You have reached the free limit of ${FREE_PLAN_LIMIT} active client. Archive existing clients or upgrade to Pro.`
    }, 403);
  }

  const newClient = await db.insert(clients).values({
    id: uuidv4(),
    userId: userId,
    companyName: body.companyName,
    contactName: body.contactName,
    contactEmail: body.contactEmail,
    hourlyRate: body.hourlyRate,
    status: 'active',
    accessToken: uuidv4(),
  }).returning();

  return c.json(newClient[0]);
});

// PUT /clients/:id - EDITING (Always allowed)
app.put('/:id', zValidator('json', updateClientSchema), async (c) => {
  const userId = c.get('userId');
  const clientId = c.req.param('id');
  const body = c.req.valid('json');

  const updated = await db.update(clients)
    .set(body)
    .where(and(eq(clients.id, clientId), eq(clients.userId, userId)))
    .returning();

  if (updated.length === 0) return c.json({ error: 'Not found' }, 404);
  return c.json(updated[0]);
});

export { app as clientsRouter };