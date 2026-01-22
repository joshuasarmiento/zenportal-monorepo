import { Hono } from 'hono';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth } from '../lib/auth';

const app = new Hono<{ Variables: { userId: string } }>();

app.use('*', requireAuth);

// GET /me - Get User Profile & Settings
app.get('/me', async (c) => {
  const userId = c.get('userId');
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  if (!user) return c.json({ error: 'User not found' }, 404);
  return c.json(user);
});

// PATCH /me - Update Settings
app.patch('/me', async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json();

  // Update only allowed fields
  const updatedUser = await db.update(users)
    .set({
      fullName: body.fullName,
      avatarUrl: body.avatarUrl,
      portalSlug: body.portalSlug,
      accentColor: body.accentColor,
      notifyClientView: body.notifyClientView,
      notifyWeeklyRecap: body.notifyWeeklyRecap,
      notifyMarketing: body.notifyMarketing,
    })
    .where(eq(users.id, userId))
    .returning();

  return c.json(updatedUser[0]);
});

export { app as authRouter };