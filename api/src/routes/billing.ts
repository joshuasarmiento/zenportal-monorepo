// api/src/routes/billing.ts
import { Hono } from 'hono';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { requireAuth } from '../lib/auth.js';
import { dodo } from '../lib/auth.js';

const app = new Hono<{ Variables: { userId: string } }>();

app.use('*', requireAuth);

// GET /subscription - Check status from Dodo
app.get('/subscription', async (c) => {
  const userId = c.get('userId');

  // 1. Fetch User
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { dodoPaymentsCustomerId: true, tier: true, email: true }
  });

  if (!user) return c.json({ error: 'User not found' }, 404);

  let customerId = user.dodoPaymentsCustomerId;

  // 2. Self-Healing: If no Customer ID, try to find by email
  if (!customerId && user.email) {
    try {
      console.log(`[Billing] No Customer ID for ${userId}. Looking up by email: ${user.email}`);
      const customers = await dodo.customers.list({ email: user.email });
      const foundCustomer = customers.items?.[0];

      if (foundCustomer) {
        console.log(`[Billing] Found Dodo Customer ID ${foundCustomer.customer_id}. Syncing DB...`);
        customerId = foundCustomer.customer_id;

        // Update DB immediately
        await db.update(users)
          .set({ dodoPaymentsCustomerId: customerId })
          .where(eq(users.id, userId));
      }
    } catch (err) {
      console.error('[Billing] Customer lookup failed:', err);
    }
  }

  // If still no customer ID, they likely haven't subscribed yet
  if (!customerId) {
    return c.json({ subscription: null });
  }

  try {
    // 3. Fetch active subscriptions from Dodo
    const response = await dodo.subscriptions.list({
      customer_id: customerId,
      status: 'active',
      page_size: 1
    });

    // @ts-ignore
    const activeSub = response.items?.[0];

    // 4. Synchronization Logic
    if (activeSub) {
      // If we found an active sub but local tier is free, fix it!
      if (user.tier !== 'pro') {
        console.log(`[Billing] Detected active subscription for ${userId} but Tier was Free. Upgrading...`);
        await db.update(users).set({ tier: 'pro' }).where(eq(users.id, userId));
      }

      return c.json({
        subscription: {
          status: activeSub.status,
          plan: 'pro',
          period_end: activeSub.next_billing_date ? new Date(activeSub.next_billing_date).getTime() : null,
          id: activeSub.subscription_id
        }
      });
    } else {
      // No active subscription found
      // If local tier is pro, we might need to downgrade? 
      // safer to leave it for now or check for 'past_due' etc, but strictly speacking if no active sub, they are free.
      // For safety, let's not auto-downgrade here without more checks (could be a grace period), 
      // but we return null subscription.
      return c.json({ subscription: null });
    }

  } catch (error) {
    console.error('Failed to fetch Dodo subscription:', error);
    // Fallback: If API fails but we locally think they are pro, let them be pro
    if (user.tier === 'pro') {
      return c.json({ subscription: { status: 'active', plan: 'pro' } });
    }
    return c.json({ error: 'Failed to fetch subscription status' }, 500);
  }
});

app.get('/transactions', async (c) => {
  const userId = c.get('userId');

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { dodoPaymentsCustomerId: true }
  });

  console.log(`[Billing] Fetching transactions for user ${userId}, Dodo ID: ${user?.dodoPaymentsCustomerId}`);

  if (!user?.dodoPaymentsCustomerId) {
    console.log('[Billing] No Dodo Customer ID found for user. Attempting to recover by email...');

    // Fetch full user to get email
    const fullUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { email: true }
    });

    if (fullUser?.email) {
      try {
        const customers = await dodo.customers.list({ email: fullUser.email });
        const customer = customers.items?.[0]; // Dodo returns items array

        if (customer) {
          console.log(`[Billing] Found Dodo Customer ID ${customer.customer_id} for email ${fullUser.email}. Updating DB...`);

          await db.update(users)
            .set({ dodoPaymentsCustomerId: customer.customer_id })
            .where(eq(users.id, userId));

          // Use this ID for the current request
          if (user) {
            user.dodoPaymentsCustomerId = customer.customer_id;
          }
        } else {
          console.log('[Billing] No customer found in Dodo for this email.');
          return c.json({ transactions: [] });
        }
      } catch (err) {
        console.error('[Billing] Failed to lookup customer by email:', err);
        return c.json({ transactions: [] });
      }
    } else {
      return c.json({ transactions: [] });
    }
  }

  try {
    // user is definitely defined here due to checks above, but TS needs coaxing
    if (!user?.dodoPaymentsCustomerId) {
      throw new Error("No Dodo Customer ID available");
    }

    const response = await dodo.payments.list({
      customer_id: user.dodoPaymentsCustomerId,
      page_size: 100
    });

    console.log(`[Billing] Found ${response.items?.length || 0} transactions`);
    return c.json({ transactions: response.items || [] });
  } catch (error) {
    console.error('Failed to fetch Dodo transactions:', error);
    return c.json({ error: 'Failed to fetch transactions' }, 500);
  }
});

export { app as billingRouter };