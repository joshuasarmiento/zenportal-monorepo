import { Hono } from 'hono';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';
import { Webhook } from 'svix';

const app = new Hono();

// Validate Environment Variables
if (!process.env.STRIPE_SECRET_KEY) throw new Error('Missing STRIPE_SECRET_KEY');
if (!process.env.CLERK_WEBHOOK_SECRET) throw new Error('Missing CLERK_WEBHOOK_SECRET');
if (!process.env.STRIPE_WEBHOOK_SECRET) throw new Error('Missing STRIPE_WEBHOOK_SECRET');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-12-15.clover' as any });

// CLERK WEBHOOK
app.post('/clerk', async (c) => {
  const payload = await c.req.json();
  const headers = c.req.header();
  const secret = process.env.CLERK_WEBHOOK_SECRET!;

  const wh = new Webhook(secret);
  let evt: any;

  try {
    evt = wh.verify(JSON.stringify(payload), {
      "svix-id": headers["svix-id"] as string,
      "svix-timestamp": headers["svix-timestamp"] as string,
      "svix-signature": headers["svix-signature"] as string,
    });
  } catch (err) {
    return c.json({ error: "Invalid Signature" }, 400);
  }

  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url, primary_email_address_id } = evt.data;
    
    // Safer email extraction
    const primaryEmailObj = email_addresses.find((e: any) => e.id === primary_email_address_id);
    const email = primaryEmailObj ? primaryEmailObj.email_address : null;
    
    if (!email) {
      console.error(`❌ User ${id} created without a primary email.`);
      return c.json({ error: "No email found" }, 400);
    }

    const fullName = `${first_name || ''} ${last_name || ''}`.trim();

    await db.insert(users).values({
      id: id,
      email: email,
      fullName: fullName || 'New User',
      avatarUrl: image_url,
      tier: 'free',
    });
    console.log(`✅ User ${id} synced to Turso!`);
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;
    await db.delete(users).where(eq(users.id, id));
    console.log(`🗑️ User ${id} deleted from Turso.`);
  }

  return c.json({ success: true });
});

// STRIPE WEBHOOK
app.post('/stripe', async (c) => {
  const sig = c.req.header('stripe-signature');
  const body = await c.req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return c.json({ error: `Webhook Error: ${err.message}` }, 400);
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const subscriptionId = session.subscription as string;
      const customerId = session.customer as string;

      await db.update(users)
        .set({ tier: 'pro', stripeSubscriptionId: subscriptionId })
        .where(eq(users.stripeCustomerId, customerId));
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      await db.update(users)
        .set({ tier: 'free', stripeSubscriptionId: null })
        .where(eq(users.stripeCustomerId, customerId));
      break;
    }
  }

  return c.json({ received: true });
});

export { app as webhooksRouter };