import { Hono } from 'hono';
import { db } from '../db';
import { clients, users } from '../db/schema';
import { requireAuth } from '../lib/auth';
import { eq, and, desc, count} from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

const app = new Hono<{ Variables: { userId: string } }>();

app.use('*', requireAuth);

// GET /clients - List all
app.get('/', async (c) => {
  const userId = c.get('userId');
  const myClients = await db.query.clients.findMany({
    where: eq(clients.userId, userId),
    orderBy: [desc(clients.createdAt)],
  });
  return c.json(myClients);
});

// GET /clients/:id - Get Single Client (For Editing)
app.get('/:id', async (c) => {
  const userId = c.get('userId');
  const clientId = c.req.param('id');
  
  const client = await db.query.clients.findFirst({
    where: and(eq(clients.id, clientId), eq(clients.userId, userId)),
  });

  if (!client) return c.json({ error: 'Not found' }, 404);
  return c.json(client);
});

// POST /clients - Add new
app.post('/', async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json();

  // 1. Get User Tier
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { tier: true }
  });

  // 2. Count Existing Clients
  const clientCount = await db
    .select({ count: count() })
    .from(clients)
    .where(eq(clients.userId, userId));

  const currentCount = clientCount[0].count;
  const isPro = user?.tier === 'pro';

  // 3. Enforce Limit
  if (!isPro && currentCount >= 2) {
    return c.json({ 
      error: 'Free Limit Reached', 
      message: 'Upgrade to Pro to add more than 2 clients.' 
    }, 403);
  }

  const accessToken = uuidv4(); 
  const newClient = await db.insert(clients).values({
    id: uuidv4(),
    userId: userId,
    companyName: body.companyName,
    contactName: body.contactName,
    contactEmail: body.contactEmail, 
    hourlyRate: body.hourlyRate,
    status: 'active',               
    accessToken: accessToken,
  }).returning();

  return c.json(newClient[0]);
});

// PUT /clients/:id - Update Client
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
      status: body.status // e.g. 'active' or 'archived'
    })
    .where(and(eq(clients.id, clientId), eq(clients.userId, userId)))
    .returning();

  if (updated.length === 0) return c.json({ error: 'Not found' }, 404);
  return c.json(updated[0]);
});

export { app as clientsRouter };