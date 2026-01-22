import { Hono } from 'hono';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth } from '../lib/auth';
import Stripe from 'stripe';

const app = new Hono<{ Variables: { userId: string } }>();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-12-15.clover' });

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
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1,
      },
    ],
    success_url: `${process.env.FRONTEND_URL}/settings?success=true`,
    cancel_url: `${process.env.FRONTEND_URL}/settings?canceled=true`,
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
    return_url: `${process.env.FRONTEND_URL}/settings`,
  });

  return c.json({ url: session.url });
});

export { app as billingRouter };