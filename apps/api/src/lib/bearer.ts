import { createMiddleware } from 'hono/factory';
import { bearerAuth } from 'hono/bearer-auth';
import { db } from '../db';
import { users } from '../db/schema';
import { eq, or } from 'drizzle-orm';
import { User } from '../types';

type BearerUser = {
  user: User;
  access: 'read' | 'write';
}

// This middleware is the core of the programmatic API authentication.
// It takes a required access level ('read' or 'write') and creates a middleware handler.
const verifyApiKey = (requiredAccess: 'read' | 'write') => {
  return createMiddleware<{ Variables: { bearerUser: BearerUser } }>(async (c, next) => {
    // 1. Use Hono's helper to extract the token from the 'Authorization: Bearer <token>' header.
    const authHandler = bearerAuth({
      verifyToken: async (token) => {
        // 2. Determine which database columns to search based on the required access level.
        // If 'write' access is required, a write key MUST be used.
        // If 'read' access is required, EITHER a read or a write key is acceptable.
        const searchConditions = requiredAccess === 'write'
          ? [eq(users.apiKeyWrite, token)]
          : [eq(users.apiKeyRead, token), eq(users.apiKeyWrite, token)];

        // 3. Find the user in the database who owns this API key.
        const user = await db.query.users.findFirst({
          where: or(...searchConditions)
        });
        
        // 4. If no user is found, the token is invalid. Return false.
        if (!user) {
          return false;
        }

        // 5. Determine the access level granted by this specific token.
        const access: 'read' | 'write' = user.apiKeyWrite === token ? 'write' : 'read';

        // 6. Attach the user and their access level to the context for use in downstream handlers.
        c.set('bearerUser', { user, access });
        return true; // Token is valid
      }
    });
    
    // 7. Execute the bearerAuth handler. If it fails, it will automatically send a 401 response.
    return authHandler(c, next);
  });
};

// Export two pre-configured middleware handlers for convenience.
export const requireReadAccess = verifyApiKey('read');
export const requireWriteAccess = verifyApiKey('write');