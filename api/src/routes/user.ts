import { Hono } from 'hono';
import { db } from '../db/index.js';
import { users, workspaces } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { requireAuth, type AuthVariables, auth } from '../lib/auth.js';
import { sendAuthEmail } from '../lib/email.js';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { v4 as uuidv4 } from 'uuid';

const app = new Hono<{ Variables: AuthVariables }>();

app.use('*', requireAuth);

// 1. Define the Schema
// Updated to match Better Auth schema (name, image)
const updateUserSchema = z.object({
  name: z.string().optional(),
  image: z.string().optional(),

  // Custom Profile Fields
  headline: z.string().optional(),
  bio: z.string().optional(),
  websiteUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
  twitterUrl: z.string().optional(),

  // Notification settings might need to move to workspace too? 
  // Schema says notify* fields are on WORKSPACE now (notifyClientView, notifyClientOnLog, etc)
  // Let's verify schema.ts again?
  // Schema.ts step 174 showed notify* fields on WORKSPACES (lines 92-94).
  // So they should be removed from User too.

  // Only keep what is actually on User table
});

// GET /me - Return the authenticated user
app.get('/me', async (c) => {
  console.log('[User Route] GET /me called');
  const userId = c.get('userId');
  console.log('[User Route] userId:', userId);

  // Fetch the full user profile including all custom fields
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId)
  });

  if (!user) {
    console.log('[User Route] User not found in DB');
    return c.json({ error: 'User not found' }, 404);
  }

  console.log('[User Route] User found, returning profile');
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

  const workspace = c.get('workspace');
  if (!workspace) return c.json({ error: 'No active workspace' }, 401);

  if (workspace.tier !== 'pro') {
    return c.json({ error: 'API access is a Pro feature. Please upgrade your workspace.' }, 403);
  }

  const newKeys = {
    apiKeyRead: `zen_read_${uuidv4()}`,
    apiKeyWrite: `zen_write_${uuidv4()}`,
  };

  await db.update(workspaces)
    .set(newKeys)
    .where(eq(workspaces.id, workspace.id));

  return c.json(newKeys);
});

// POST /set-password - Set password for authenticated user (Trusted Flow)
// Used when user is logged in (e.g. via Social) but has no password set.
app.post('/set-password', zValidator('json', z.object({
  password: z.string().min(8)
})), async (c) => {
  const userId = c.get('userId');
  const { password } = c.req.valid('json');

  try {
    // Use better-auth's internal API to set the password
    // Passing headers so it can extract the session/user context automatically
    await auth.api.setPassword({
      body: {
        newPassword: password
      },
      headers: c.req.raw.headers
    });

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId)
    });

    if (user && user.email) {
      await sendAuthEmail(
        user.email,
        "Password Set Successfully",
        `<p>Your password has been successfully created. You can now log in with your email and password.</p>`
      );
    }

    return c.json({ success: true });
  } catch (e: any) {
    console.error("Failed to set password:", e);
    return c.json({ error: e.message || 'Failed to set password' }, 500);
  }
});

export { app as userRouter };