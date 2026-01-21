import { Hono } from 'hono';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

const app = new Hono();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-12-15.clover' });
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

app.post('/stripe', async (c) => {
  const signature = c.req.header('stripe-signature');
  const body = await c.req.text();

  let event: Stripe.Event;

  try {
    // 1. Verify the request actually came from Stripe
    event = stripe.webhooks.constructEvent(body, signature!, endpointSecret);
  } catch (err: any) {
    console.error(`⚠️ Webhook signature verification failed.`, err.message);
    return c.text(`Webhook Error: ${err.message}`, 400);
  }

  // 2. Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // We stored the userId in the metadata when creating the checkout session
      const userId = session.metadata?.userId; 
      const subscriptionId = session.subscription as string;
      const customerId = session.customer as string;

      if (userId) {
        // 3. Update User to PRO in Turso
        await db.update(users)
          .set({ 
            tier: 'pro',
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId
          })
          .where(eq(users.id, userId));
          
        console.log(`✅ User ${userId} upgraded to PRO.`);
      }
      break;
    }
    
    case 'customer.subscription.deleted': {
        // Handle churn (downgrade to free)
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        await db.update(users)
            .set({ tier: 'free' })
            .where(eq(users.stripeCustomerId, customerId));
        
        console.log(`⚠️ Customer ${customerId} subscription ended.`);
        break;
    }
  }

  return c.json({ received: true });
});

export { app as webhooksRouter };