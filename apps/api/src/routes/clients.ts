import { Hono } from 'hono';
import { db } from '../db';
import { clients, users } from '../db/schema';
import { requireAuth } from '../lib/auth';
import { eq, and, desc, count } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const app = new Hono<{ Variables: { userId: string } }>();

app.use('*', requireAuth);

const clientSchema = z.object({
  companyName: z.string().min(1),
  contactName: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal('')),
  hourlyRate: z.number().min(0),
});

// GET /clients
app.get('/', async (c) => {
  const userId = c.get('userId');
  const myClients = await db.query.clients.findMany({
    where: eq(clients.userId, userId),
    orderBy: [desc(clients.createdAt)],
  });
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

// POST /clients
app.post('/', zValidator('json', clientSchema), async (c) => {
  const userId = c.get('userId');
  const body = c.req.valid('json');

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { tier: true }
  });

  // Count only ACTIVE clients for the limit
  const clientCount = await db
    .select({ count: count() })
    .from(clients)
    .where(and(
      eq(clients.userId, userId), 
      eq(clients.status, 'active')
    ));

  const currentCount = clientCount[0].count;
  const isPro = user?.tier === 'pro';

  if (!isPro && currentCount >= 2) {
    return c.json({ 
      error: 'Free Limit Reached', 
      message: 'Archive old clients or Upgrade to Pro to add more.' 
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

// PUT /clients/:id
app.put('/:id', async (c) => {
  const userId = c.get('userId');
  const clientId = c.req.param('id');
  const body = await c.req.json();

  const updated = await db.update(clients)
    .set({
      companyName: body.companyName,
      contactName: body.contactName,
      contactEmail: body.contactEmail,
      hourlyRate: body.hourlyRate,
      status: body.status
    })
    .where(and(eq(clients.id, clientId), eq(clients.userId, userId)))
    .returning();

  if (updated.length === 0) return c.json({ error: 'Not found' }, 404);
  return c.json(updated[0]);
});

export { app as clientsRouter };