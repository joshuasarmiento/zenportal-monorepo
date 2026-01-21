import { Hono } from 'hono';
import { db } from '../db';
import { clients } from '../db/schema';
import { requireAuth } from '../lib/auth';
import { eq, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid'; // npm install uuid @types/uuid

const app = new Hono<{ Variables: { userId: string } }>();

// Apply Auth Middleware to all routes in this file
app.use('*', requireAuth);

// GET /clients - List all my clients
app.get('/', async (c) => {
  const userId = c.get('userId');
  
  const myClients = await db.query.clients.findMany({
    where: eq(clients.userId, userId),
    orderBy: [desc(clients.createdAt)],
  });

  return c.json(myClients);
});

// POST /clients - Add a new client
app.post('/', async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json();

  // Generate a random "Magic Link" token
  const accessToken = uuidv4(); 

  const newClient = await db.insert(clients).values({
    id: uuidv4(),
    userId: userId,
    companyName: body.companyName,
    contactName: body.contactName,
    hourlyRate: body.hourlyRate,
    accessToken: accessToken, // This creates the portal link
  }).returning();

  return c.json(newClient[0]);
});

export { app as clientsRouter };