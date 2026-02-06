// api/src/routes/billing.ts
import { Hono } from 'hono';
import { requireAuth, type AuthVariables } from '../lib/auth.js';
import { dodo } from '../lib/auth.js';

const app = new Hono<{ Variables: AuthVariables }>();

app.use('*', requireAuth);

// GET /subscription - Check status from Dodo
app.get('/subscription', async (c) => {
  const workspace = c.get('workspace');

  if (!workspace) {
    return c.json({ error: 'No active workspace' }, 401);
  }

  if (!workspace.dodoPaymentsCustomerId) {
    return c.json({ subscription: null });
  }

  try {
    // Fetch active subscriptions from Dodo
    // The SDK uses pagination, result has 'items' array
    const response = await dodo.subscriptions.list({
      customer_id: workspace.dodoPaymentsCustomerId,
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
    if (workspace.tier === 'pro') {
      return c.json({ subscription: { status: 'active', plan: 'pro' } });
    }
    return c.json({ error: 'Failed to fetch subscription status' }, 500);
  }
});

app.get('/transactions', async (c) => {
  const workspace = c.get('workspace');

  if (!workspace) {
    return c.json({ error: 'No active workspace' }, 401);
  }

  console.log(`[Billing] Fetching transactions for workspace ${workspace.id}, Dodo ID: ${workspace.dodoPaymentsCustomerId}`);

  try {
    if (!workspace.dodoPaymentsCustomerId) {
      // Graceful return empty if no customer ID, meaning no payments ever made via new system
      return c.json({ transactions: [] });
    }

    const response = await dodo.payments.list({
      customer_id: workspace.dodoPaymentsCustomerId,
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