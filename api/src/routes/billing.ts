// api/src/routes/billing.ts
import { Hono } from 'hono';
import { db } from '../db/index.js';
import { users, subscription } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';
import { requireAuth } from '../lib/auth.js';
import { config } from '../config.js';

const app = new Hono<{ Variables: { userId: string } }>();

app.use('*', requireAuth);

// Helper: PayMongo API Request
// We use this to talk to PayMongo API for Checkout Sessions
async function paymongoRequest(endpoint: string, method: string = 'GET', body?: any) {
  const url = `https://api.paymongo.com/v1${endpoint}`;
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${btoa(config.paymongo.secretKey + ':')}`,
    },
  };

  if (body) {
    options.body = JSON.stringify({ data: body });
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorData = await response.json();
    console.error('PayMongo Error:', JSON.stringify(errorData, null, 2));
    throw new Error('Payment service error');
  }

  return response.json();
}

// 1. POST /subscribe (Renamed from /checkout to match your Frontend)
// Creates a new PayMongo Checkout Session
app.post('/subscribe', async (c) => {
  const userId = c.get('userId');

  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (!user) return c.json({ error: 'User not found' }, 404);

  try {
    const payload = {
      attributes: {
        billing: {
          name: user.name,
          email: user.email,
        },
        line_items: [
          {
            name: "ZenPortal Pro Plan",
            amount: 200000, // 2,000.00 PHP (in centavos)
            currency: "PHP",
            quantity: 1,
            images: ["https://placehold.co/400"],
          },
        ],
        payment_method_types: ["qrph", "gcash", "card"],
        description: "Upgrade to Pro",
        success_url: `${config.app.frontendUrl}/settings/billing/?success=true`,
        cancel_url: `${config.app.frontendUrl}/settings/billing/?canceled=true`,
        send_email_receipt: true, //
        show_description: true,
        show_line_items: true,
        metadata: {
          userId: userId,
          tier: 'pro'
        }
      },
    };

    const sessionData = await paymongoRequest('/checkout_sessions', 'POST', payload);

    // Return the full data so the frontend can get the ID and URL
    return c.json(sessionData);

  } catch (error) {
    console.error(error);
    return c.json({ error: 'Failed to create checkout session' }, 500);
  }
});

// 2. GET /session/:id
// Retrieve a Checkout Session to check its status
app.get('/session/:id', async (c) => {
  const sessionId = c.req.param('id');
  try {
    const sessionData = await paymongoRequest(`/checkout_sessions/${sessionId}`, 'GET');

    // Security: Ensure the session belongs to the requesting user
    const metaUserId = sessionData.data.attributes.metadata?.userId;
    if (metaUserId && metaUserId !== c.get('userId')) {
      return c.json({ error: 'Unauthorized access to this session' }, 403);
    }

    return c.json(sessionData);
  } catch (error) {
    return c.json({ error: 'Failed to retrieve session' }, 500);
  }
});

// 3. POST /session/:id/expire
// Expire (Cancel) a Checkout Session
app.post('/session/:id/expire', async (c) => {
  const sessionId = c.req.param('id');
  try {
    // Optional: Retrieve first to verify ownership before expiring
    const currentSession = await paymongoRequest(`/checkout_sessions/${sessionId}`, 'GET');
    const metaUserId = currentSession.data.attributes.metadata?.userId;

    if (metaUserId && metaUserId !== c.get('userId')) {
      return c.json({ error: 'Unauthorized' }, 403);
    }

    const expiredSession = await paymongoRequest(`/checkout_sessions/${sessionId}/expire`, 'POST');
    return c.json(expiredSession);
  } catch (error) {
    return c.json({ error: 'Failed to expire session' }, 500);
  }
});

// GET /subscription - Check status (Unchanged)
app.get('/subscription', async (c) => {
  const userId = c.get('userId');

  const sub = await db.query.subscription.findFirst({
    where: eq(subscription.referenceId, userId),
    orderBy: [desc(subscription.createdAt)],
  });

  const isPro = sub && sub.periodEnd && sub.periodEnd > new Date();

  return c.json({
    subscription: isPro ? {
      status: 'active',
      plan: sub.plan,
      period_end: sub.periodEnd?.getTime(),
    } : null
  });
});

app.get('/transactions', async (c) => {
  const userId = c.get('userId');

  try {
    const history = await db.query.subscription.findMany({
      where: eq(subscription.referenceId, userId),
      orderBy: [desc(subscription.createdAt)],
    });

    return c.json({ transactions: history });
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Failed to fetch transactions' }, 500);
  }
});

export { app as billingRouter };