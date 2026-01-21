import { createMiddleware } from 'hono/factory';
import { getAuth } from '@hono/clerk-auth';

// Middleware to FORCE login. 
// If no user is found, it returns 401 Unauthorized immediately.
export const requireAuth = createMiddleware(async (c, next) => {
  const auth = getAuth(c);

  if (!auth?.userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  // Pass the userId to the next handler
  c.set('userId', auth.userId);
  await next();
});

// Type definition for Hono Variables
type Variables = {
  userId: string;
};