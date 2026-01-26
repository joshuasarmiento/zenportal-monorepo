import { Hono } from 'hono';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';
import { Webhook } from 'svix';
import { config } from '../config';
import { sendSubscriptionEmail } from '../lib/email';

const app = new Hono();

const stripe = new Stripe(config.stripe.secretKey, { apiVersion: '2025-12-15.clover' as any });

// CLERK WEBHOOK
app.post('/clerk', async (c) => {
  const payload = await c.req.json();
  const headers = c.req.header();
  const secret = config.clerk.webhookSecret;

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
    event = stripe.webhooks.constructEvent(body, sig!, config.stripe.webhookSecret);
  } catch (err: any) {
    return c.json({ error: `Webhook Error: ${err.message}` }, 400);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;

        const result = await db.update(users)
          .set({ tier: 'pro', stripeSubscriptionId: subscriptionId })
          .where(eq(users.stripeCustomerId, customerId))
          .returning({ email: users.email, fullName: users.fullName });

        if (result[0]) {
          // Send Welcome Email
          await sendSubscriptionEmail(result[0].email, result[0].fullName || 'User', 'created');
        }
        break;
      }

      // case 'customer.subscription.updated': {
      //   const subscription = event.data.object as Stripe.Subscription;
      //   const customerId = subscription.customer as string;
      //   const status = subscription.status;
      //   const isValidPro = status === 'active';
      //   const newTier = isValidPro ? 'pro' : 'free';

      //   const result = await db.update(users)
      //     .set({ tier: newTier, stripeSubscriptionId: subscription.id })
      //     .where(eq(users.stripeCustomerId, customerId))
      //     .returning({ email: users.email, fullName: users.fullName });

      //   if (result[0]) {
      //      // Send Update Email
      //      await sendSubscriptionEmail(result[0].email, result[0].fullName || 'User', 'updated', newTier);
      //   }
      //   break;
      // }
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const status = subscription.status;

        // 🟢 CHANGED: We now treat 'active' as PRO, even if they scheduled a cancellation.
        // They paid for the month, so let them keep it until it expires.
        const isValidPro = status === 'active' || status === 'trialing';

        const newTier = isValidPro ? 'pro' : 'free';

        const result = await db.update(users)
          .set({ 
            tier: newTier, 
            stripeSubscriptionId: subscription.id 
          })
          .where(eq(users.stripeCustomerId, customerId))
          .returning({ email: users.email, fullName: users.fullName, tier: users.tier });

        // Only send email if the tier ACTUALLY changed (e.g., Active -> Past Due)
        if (result[0] && result[0].tier !== newTier) {
           await sendSubscriptionEmail(result[0].email, result[0].fullName || 'User', 'updated', newTier);
        }
        
        console.log(`🔄 Subscription updated for ${customerId}. Status: ${status}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const result = await db.update(users)
          .set({ tier: 'free', stripeSubscriptionId: null })
          .where(eq(users.stripeCustomerId, customerId))
          .returning({ email: users.email, fullName: users.fullName });

        if (result[0]) {
          // Send Cancellation Email
          await sendSubscriptionEmail(result[0].email, result[0].fullName || 'User', 'deleted');
        }
        break;
      }
    }
  } catch (err) {
    console.error(`Error processing webhook: ${err}`);
    return c.json({ error: 'Webhook processing failed' }, 500);
  }

  return c.json({ received: true });
});

export { app as webhooksRouter };