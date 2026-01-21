import { Hono } from 'hono';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth } from '../lib/auth';

const app = new Hono<{ Variables: { userId: string } }>();

app.use('*', requireAuth);

app.get('/me', async (c) => {
  const userId = c.get('userId');
  
  const userProfile = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!userProfile) {
    return c.json({ error: 'User not found in DB' }, 404);
  }

  return c.json(userProfile);
});

export { app as authRouter };