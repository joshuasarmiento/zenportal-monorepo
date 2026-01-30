import { Hono } from 'hono';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { requireAuth, type AuthVariables } from '../lib/auth.js';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { v4 as uuidv4 } from 'uuid';

const app = new Hono<{ Variables: AuthVariables }>();

app.use('*', requireAuth);

// 1. Define the Schema
// Updated to match Better Auth schema (name, image)
const updateUserSchema = z.object({
  name: z.string().optional(),       // Renamed from fullName
  image: z.string().optional(),      // Renamed from avatarUrl
  portalSlug: z.string().optional(),
  accentColor: z.string().optional(),
  notifyClientView: z.boolean().optional(),
  notifyWeeklyRecap: z.boolean().optional(),
  notifyMarketing: z.boolean().optional(),
  headline: z.string().optional(),
  bio: z.string().optional(),
  websiteUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
  twitterUrl: z.string().optional(),
  publicTemplate: z.enum(['modern', 'corporate', 'creative']).optional(),
});

// GET /me - Return the authenticated user
app.get('/me', (c) => {
  const user = c.get('user');
  // requireAuth ensures user exists, but we handle the edge case just in case
  if (!user) return c.json({ error: 'User not found' }, 404);
  return c.json(user);
});

// PATCH /me - Update user profile
app.patch('/me', zValidator('json', updateUserSchema), async (c) => {
  const userId = c.get('userId');
  const data = c.req.valid('json');

  if (Object.keys(data).length === 0) {
    return c.json({ error: 'No valid fields provided' }, 400);
  }

  const updatedUser = await db.update(users)
    .set(data)
    .where(eq(users.id, userId))
    .returning();

  return c.json(updatedUser[0]);
});

// POST /api-key - Generate API Keys
app.post('/api-key', async (c) => {
  const userId = c.get('userId');

  // We query the DB to ensure we have the absolute latest 'tier' status
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { tier: true }
  });

  if (user?.tier !== 'pro') {
    return c.json({ error: 'API access is a Pro feature. Please upgrade your account.' }, 403);
  }

  const newKeys = {
    apiKeyRead: `zen_read_${uuidv4()}`,
    apiKeyWrite: `zen_write_${uuidv4()}`,
  };

  await db.update(users)
    .set(newKeys)
    .where(eq(users.id, userId));

  return c.json(newKeys);
});

export { app as userRouter };