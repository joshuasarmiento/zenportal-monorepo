import { Hono } from 'hono';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';
import { Webhook } from 'svix';

const app = new Hono();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-12-15.clover' });

// --- CLERK CONFIG ---
const clerkWebhookSecret = process.env.CLERK_WEBHOOK_SECRET!; // We will add this to .env later

// 2. CLERK WEBHOOK (The Fix)
app.post('/clerk', async (c) => {
  const payload = await c.req.json();
  const headers = c.req.header();

  // Verify the webhook signature (Security)
  const wh = new Webhook(clerkWebhookSecret);
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

  // Handle the Event
  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;
    
    // Get primary email
    const email = email_addresses.find((e: any) => e.id === evt.data.primary_email_address_id)?.email_address;
    const fullName = `${first_name || ''} ${last_name || ''}`.trim();

    // Sync to Turso
    await db.insert(users).values({
      id: id, // IMPORTANT: We use Clerk's ID as our Primary Key
      email: email,
      fullName: fullName || 'New User',
      avatarUrl: image_url,
      tier: 'free', // Default to free
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

  // Handle the event
  switch (event.type) {
    // A. User Successfully Paid (Upgrade to Pro)
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const subscriptionId = session.subscription as string;
      const customerId = session.customer as string;

      // Find user by Stripe Customer ID and Upgrade
      await db.update(users)
        .set({ 
          tier: 'pro',
          stripeSubscriptionId: subscriptionId
        })
        .where(eq(users.stripeCustomerId, customerId));
        
      console.log(`✅ User upgraded to PRO (Customer: ${customerId})`);
      break;
    }

    // B. User Canceled / Payment Failed (Downgrade to Free)
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      await db.update(users)
        .set({ tier: 'free', stripeSubscriptionId: null })
        .where(eq(users.stripeCustomerId, customerId));

      console.log(`❌ User downgraded to FREE (Customer: ${customerId})`);
      break;
    }
  }

  return c.json({ received: true });
});

export { app as webhooksRouter };