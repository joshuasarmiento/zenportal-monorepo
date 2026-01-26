import { Hono } from 'hono';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth } from '../lib/auth';
import Stripe from 'stripe';
import { config } from '../config';

const app = new Hono<{ Variables: { userId: string } }>();
const stripe = new Stripe(config.stripe.secretKey, { apiVersion: '2025-12-15.clover' });

app.use('*', requireAuth);

// Helper: Get or Create Stripe Customer
async function getStripeCustomer(userId: string, email: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (user?.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  // Create new customer in Stripe
  const customer = await stripe.customers.create({
    email,
    metadata: { userId }, // Link Stripe Customer to your DB User ID
  });

  // Save ID to DB
  await db.update(users)
    .set({ stripeCustomerId: customer.id })
    .where(eq(users.id, userId));

  return customer.id;
}

// POST /checkout - Start Upgrade Flow
app.post('/checkout', async (c) => {
  const userId = c.get('userId');
  
  // 1. Fetch User
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  if (!user) return c.json({ error: 'User not found' }, 404);

  // 2. Get/Create Stripe Customer
  const customerId = await getStripeCustomer(userId, user.email);

  // 3. Create Checkout Session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: config.stripe.priceId,
        quantity: 1,
      },
    ],
    automatic_tax: { enabled: true },
    customer_update: { address: 'auto' },
    success_url: `${config.app.frontendUrl}/settings/billing/?success=true`,
    cancel_url: `${config.app.frontendUrl}/settings/billing/?canceled=true`,
  });

  return c.json({ url: session.url });
});

// POST /portal - Manage Existing Subscription
app.post('/portal', async (c) => {
  const userId = c.get('userId');

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user?.stripeCustomerId) {
    return c.json({ error: 'No billing account found' }, 400);
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${config.app.frontendUrl}/settings/billing`,
  });

  return c.json({ url: session.url });
});

app.get('/invoices', async (c) => {
  const userId = c.get('userId');

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user?.stripeCustomerId) {
    return c.json({ invoices: [] });
  }

  // Fetch last 10 invoices from Stripe
  const invoices = await stripe.invoices.list({
    customer: user.stripeCustomerId,
    limit: 10,
    status: 'paid', // Optional: only show paid invoices
  });

  // Format for frontend
  const history = invoices.data.map((inv) => ({
    id: inv.id,
    date: inv.created * 1000, // Stripe uses seconds, JS uses ms
    amount: inv.total / 100,  // Convert cents to dollars
    currency: inv.currency,
    status: inv.status,
    url: inv.hosted_invoice_url, // Link to view invoice
    pdf: inv.invoice_pdf,        // Link to download PDF
  }));

  return c.json({ invoices: history });
});

app.get('/subscription', async (c) => {
  const userId = c.get('userId');

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user?.stripeCustomerId) {
    return c.json({ subscription: null });
  }

  // List subscriptions to find the active one
  const subscriptions = await stripe.subscriptions.list({
    customer: user.stripeCustomerId,
    status: 'all',
    limit: 1,
  });

  if (subscriptions.data.length === 0) {
    return c.json({ subscription: null });
  }

  const sub = subscriptions.data[0];

  // 🟢 FIX: Access current_period_end via the first item
  const currentPeriodEnd = sub.items.data[0]?.current_period_end;

  return c.json({
    subscription: {
      status: sub.status,
      cancel_at_period_end: sub.cancel_at_period_end,
      // 🟢 NEW: Send the specific cancellation date
      cancel_at: sub.cancel_at ? sub.cancel_at * 1000 : null,
      current_period_end: currentPeriodEnd ? currentPeriodEnd * 1000 : Date.now(),
      plan: sub.items.data[0]?.price.nickname || 'Pro Plan',
    }
  });
});

export { app as billingRouter };