import { Hono } from 'hono';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth } from '../lib/auth';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const app = new Hono<{ Variables: { userId: string } }>();

app.use('*', requireAuth);

// 1. Define the Schema
// making it partial() means all fields are optional by default
const updateUserSchema = z.object({
  fullName: z.string().optional(),
  avatarUrl: z.string().optional(),
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

// Sync Schema
const syncUserSchema = z.object({
  email: z.email(),
  fullName: z.string().optional(),
  avatarUrl: z.string().optional(),
})

app.get('/me', async (c) => {
  const userId = c.get('userId');
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  if (!user) return c.json({ error: 'User not found' }, 404);
  return c.json(user);
});

// POST /sync - Create user if not exists (Call this from Frontend on login)
app.post('/sync', zValidator('json', syncUserSchema), async (c) => {
  const userId = c.get('userId');
  const body = c.req.valid('json');

  // Check if user already exists
  const existingUser = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (existingUser) {
    return c.json(existingUser);
  }

  // Create new user
  const newUser = await db.insert(users).values({
    id: userId,
    email: body.email,
    fullName: body.fullName || '',
    avatarUrl: body.avatarUrl || '',
    createdAt: new Date(),
  }).returning();

  return c.json(newUser[0]);
});

// 2. Use the Validator
app.patch('/me', zValidator('json', updateUserSchema), async (c) => {
  const userId = c.get('userId');
  const data = c.req.valid('json'); // This contains ONLY the fields sent

  if (Object.keys(data).length === 0) {
    return c.json({ error: 'No valid fields provided' }, 400);
  }

  // 3. Update directly
  // Drizzle ignores undefined values in the update object automatically
  const updatedUser = await db.update(users)
    .set(data)
    .where(eq(users.id, userId))
    .returning();

  return c.json(updatedUser[0]);
});

export { app as authRouter };