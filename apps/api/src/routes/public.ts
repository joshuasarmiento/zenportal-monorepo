import { Hono } from 'hono';
import { db } from '../db';
import { clients, workLogs, users } from '../db/schema';
import { eq, desc } from 'drizzle-orm';

const app = new Hono();

// GET /public/report/:token
app.get('/report/:token', async (c) => {
  const token = c.req.param('token');

  const clientData = await db.query.clients.findFirst({
    where: eq(clients.accessToken, token),
    with: { 
      owner: {
        // STRICT Privacy: Only return what is needed for the report display
        columns: { 
          fullName: true, 
          email: true, 
          tier: true, 
          avatarUrl: true,
          accentColor: true 
        }
      }
    }
  });

  if (!clientData) {
    return c.json({ error: 'Report not found or expired' }, 404);
  }

  const logs = await db.query.workLogs.findMany({
    where: eq(workLogs.clientId, clientData.id),
    orderBy: [desc(workLogs.date)],
    limit: 10,
  });

  return c.json({
    client: clientData,
    logs: logs,
  });
});

// GET /public/agency/:slug
app.get('/agency/:slug', async (c) => {
  const slug = c.req.param('slug');

  const user = await db.query.users.findFirst({
    where: eq(users.portalSlug, slug),
    columns: {
      fullName: true,
      avatarUrl: true,
      accentColor: true,
      email: true,
      // Explicitly excluding billing IDs and internal flags
    }
  });

  if (!user) return c.json({ error: 'Agency not found' }, 404);
  return c.json(user);
});

export { app as publicRouter };