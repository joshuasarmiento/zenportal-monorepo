// api/src/routes/billing.ts
import { Hono } from 'hono';
import { db } from '../db';
import { users, subscription } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { requireAuth } from '../lib/auth';
import { config } from '../config';

const app = new Hono<{ Variables: { userId: string } }>();

app.use('*', requireAuth);

// Helper: PayMongo API Request
async function paymongoRequest(endpoint: string, method: string = 'GET', body?: any) {
  const url = `https://api.paymongo.com/v1${endpoint}`;
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${btoa(config.paymongo.secretKey + ':')}`, // Encode Secret Key
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

// POST /checkout - Create PayMongo Checkout Session
app.post('/checkout', async (c) => {
  const userId = c.get('userId');
  
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (!user) return c.json({ error: 'User not found' }, 404);

  try {
    // 1. Create Checkout Session
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
            images: ["https://placehold.co/400"], // Optional: Add your logo URL
          },
        ],
        payment_method_types: ["card", "gcash", "grab_pay", "maya"],
        description: "Upgrade to Pro",
        success_url: `${config.app.frontendUrl}/settings/billing/?success=true`,
        cancel_url: `${config.app.frontendUrl}/settings/billing/?canceled=true`,
        send_email_receipt: true,
        show_description: true,
        show_line_items: true,
        metadata: {
          userId: userId, // CRITICAL: We need this to link the payment back to the user
          tier: 'pro'
        }
      },
    };

    const sessionData = await paymongoRequest('/checkout_sessions', 'POST', payload);
    const checkoutUrl = sessionData.data.attributes.checkout_url;

    return c.json({ url: checkoutUrl });

  } catch (error) {
    console.error(error);
    return c.json({ error: 'Failed to create checkout session' }, 500);
  }
});

// GET /subscription - Check status
app.get('/subscription', async (c) => {
  const userId = c.get('userId');

  const sub = await db.query.subscription.findFirst({
    where: eq(subscription.referenceId, userId),
    orderBy: [desc(subscription.createdAt)],
  });

  // If sub exists and periodEnd is in the future, they are Pro
  const isPro = sub && sub.periodEnd && sub.periodEnd > new Date();

  return c.json({
    subscription: isPro ? {
      status: 'active',
      plan: sub.plan,
      period_end: sub.periodEnd?.getTime(),
    } : null
  });
});

export { app as billingRouter };