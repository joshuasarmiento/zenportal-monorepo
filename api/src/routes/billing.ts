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

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { dodoPaymentsCustomerId: true, tier: true }
  });

  if (!user?.dodoPaymentsCustomerId) {
    return c.json({ subscription: null });
  }

  try {
    // Fetch active subscriptions from Dodo
    // The SDK uses pagination, result has 'items' array
    const response = await dodo.subscriptions.list({
      customer_id: user.dodoPaymentsCustomerId,
      status: 'active',
      page_size: 1
    });
    // @ts-ignore - Handle type overlap if necessary, but SDK returns items
    const activeSub = response.items?.[0];

    if (!activeSub) {
      return c.json({ subscription: null });
    }

    return c.json({
      subscription: {
        status: activeSub.status,
        plan: 'pro', // Assuming simple pro plan for now
        period_end: activeSub.next_billing_date ? new Date(activeSub.next_billing_date).getTime() : null,
        id: activeSub.subscription_id
      }
    });

  } catch (error) {
    console.error('Failed to fetch Dodo subscription:', error);
    // Fallback to local tier status if API fails
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