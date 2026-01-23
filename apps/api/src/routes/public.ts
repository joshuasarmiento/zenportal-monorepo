import { Hono } from 'hono';
import { db } from '../db';
import { clients, workLogs, users } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { sendClientViewedEmail } from '../lib/email';

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
          accentColor: true,
          notifyClientView: true
        }
      }
    }
  });

  if (!clientData) {
    return c.json({ error: 'Report not found or expired' }, 404);
  }

  // --- Trigger Notification Logic ---
  // Check if owner enabled notifications and has an email
  if (clientData.owner && clientData.owner.notifyClientView && clientData.owner.email) {
    // Fire and forget (don't await to keep response fast)
    sendClientViewedEmail(clientData.owner.email, clientData.companyName)
      .catch(err => console.error('Failed to send view alert', err));
  }

  const logs = await db.query.workLogs.findMany({
    where: eq(workLogs.clientId, clientData.id),
    orderBy: [desc(workLogs.date)],
    limit: 10, // Work Logs Limit to 10
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
      
      headline: true,
      bio: true,
      websiteUrl: true,
      linkedinUrl: true,
      twitterUrl: true,

      tier: true,
      createdAt: true, 
    }
  });

  if (!user) return c.json({ error: 'Agency not found' }, 404);
  return c.json(user);
});

export { app as publicRouter };