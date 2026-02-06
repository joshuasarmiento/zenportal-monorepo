import { Hono } from 'hono';
import { db } from '../db/index.js';
import { clients, workspaces } from '../db/schema.js';
import { requireAuth, type AuthVariables } from '../lib/auth.js';
import { eq, and, desc, count } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const app = new Hono<{ Variables: AuthVariables }>();

// 1. Define Limit Constant
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

// GET /clients - READ ONLY
app.get('/', async (c) => {
  const workspace = c.get('workspace');
  if (!workspace) return c.json({ error: 'No active workspace' }, 401);

  const page = Number(c.req.query('page')) || 1;
  const limit = Number(c.req.query('limit')) || 50;
  const offset = (page - 1) * limit;

  const myClients = await db.query.clients.findMany({
    where: eq(clients.workspaceId, workspace.id),
    orderBy: [desc(clients.createdAt)],
    limit: limit,
    offset: offset,
  });

  return c.json(myClients);
});

// GET /clients/:id
app.get('/:id', async (c) => {
  const workspace = c.get('workspace');
  if (!workspace) return c.json({ error: 'No active workspace' }, 401);
  const clientId = c.req.param('id');

  const client = await db.query.clients.findFirst({
    where: and(eq(clients.id, clientId), eq(clients.workspaceId, workspace.id)),
  });

  if (!client) return c.json({ error: 'Not found' }, 404);
  return c.json(client);
});

// POST /clients - CREATION
app.post('/', zValidator('json', clientSchema), async (c) => {
  const workspace = c.get('workspace');
  const member = c.get('member');
  const userId = c.get('userId');

  if (!workspace) return c.json({ error: 'No active workspace' }, 401);

  // Check permission: Only owner/admin can add clients? 
  // For now, let's allow all members? Or restrict? 
  // Let's restrict to owner/admin for safety, or allow all if it's a small team.
  // The plan didn't specify, but safer to assume members can add items usually.
  // Actually, for agencies, probably prefer Admins/Owners.
  // Let's stick to simple for now: Allow all members.

  const body = c.req.valid('json');

  // Run checks in parallel
  const [workspaceData, clientCountData] = await Promise.all([
    db.query.workspaces.findFirst({
      where: eq(workspaces.id, workspace.id),
      columns: { tier: true }
    }),
    db.select({ count: count() })
      .from(clients)
      .where(and(
        eq(clients.workspaceId, workspace.id),
        eq(clients.status, 'active')
      ))
  ]);

  const currentCount = clientCountData[0]?.count || 0;
  const isPro = workspaceData?.tier === 'pro';

  // 2. The Soft Lock Logic
  if (!isPro && currentCount >= FREE_PLAN_LIMIT) {
    return c.json({
      error: 'Limit Reached',
      message: `You have reached the free limit of ${FREE_PLAN_LIMIT} active client. Archive existing clients or upgrade to Pro.`
    }, 403);
  }

  const newClient = await db.insert(clients).values({
    id: uuidv4(),
    workspaceId: workspace.id,
    companyName: body.companyName,
    contactName: body.contactName,
    contactEmail: body.contactEmail,
    hourlyRate: body.hourlyRate,
    status: 'active',
    accessToken: uuidv4(),
  }).returning();

  return c.json(newClient[0]);
});

// PUT /clients/:id - EDITING
app.put('/:id', zValidator('json', updateClientSchema), async (c) => {
  const workspace = c.get('workspace');
  if (!workspace) return c.json({ error: 'No active workspace' }, 401);

  const clientId = c.req.param('id');
  const body = c.req.valid('json');

  const updated = await db.update(clients)
    .set(body)
    .where(and(eq(clients.id, clientId), eq(clients.workspaceId, workspace.id)))
    .returning();

  if (updated.length === 0) return c.json({ error: 'Not found' }, 404);
  return c.json(updated[0]);
});

export { app as clientsRouter };