import { Hono } from 'hono';
import { db } from '../db';
import { users, subscription } from '../db/schema';
import { eq } from 'drizzle-orm';
import { config } from '../config';
import * as crypto from 'crypto';

const app = new Hono();

// POST /webhooks/paymongo
app.post('/paymongo', async (c) => {
  const signatureHeader = c.req.header('paymongo-signature');
  const rawBody = await c.req.text(); // We need the raw text for verification

  if (!signatureHeader) {
    return c.json({ error: 'Missing signature' }, 401);
  }

  // 1. Signature Verification
  try {
    const parts = signatureHeader.split(',');
    const timestamp = parts.find(p => p.startsWith('t='))?.split('=')[1];
    const testSignature = parts.find(p => p.startsWith('te='))?.split('=')[1];
    const liveSignature = parts.find(p => p.startsWith('li='))?.split('=')[1];

    if (!timestamp) throw new Error('Missing timestamp');

    // Combine timestamp and raw body
    const canonicalString = `${timestamp}.${rawBody}`;
    
    // Create HMAC SHA256
    const computedSignature = crypto
      .createHmac('sha256', config.paymongo.webhookSecret)
      .update(canonicalString)
      .digest('hex');

    // Compare signatures (Use 'te' for test mode, 'li' for live)
    // For safety in development, you can check both or toggle based on config
    const signatureToMatch = config.paymongo.publicKey.startsWith('pk_live') ? liveSignature : testSignature;

    if (computedSignature !== signatureToMatch) {
       console.error("Signature Mismatch:", { computedSignature, signatureToMatch });
       return c.json({ error: 'Invalid signature' }, 401);
    }
  } catch (err) {
    console.error("Webhook Verification Failed", err);
    return c.json({ error: 'Verification failed' }, 401);
  }

  // 2. Process the Event
  const event = JSON.parse(rawBody);
  const type = event.data.attributes.type;

  // Event: checkout_session.payment.paid
  if (type === 'checkout_session.payment.paid') {
    const attributes = event.data.attributes.data.attributes;
    const metadata = attributes.metadata;
    const userId = metadata?.userId;

    if (userId) {
      console.log(`✅ Payment received for User: ${userId}`);

      // Calculate Subscription End Date (e.g., 30 days)
      const now = new Date();
      const periodEnd = new Date();
      periodEnd.setDate(now.getDate() + 30);

      // A. Update User
      await db.update(users)
        .set({ 
          tier: 'pro',
          paymongoCustomerId: attributes.billing?.email
        })
        .where(eq(users.id, userId));

      // B. Record Subscription
      await db.insert(subscription).values({
        id: event.data.id, // Webhook Event ID or Checkout ID
        referenceId: userId,
        plan: 'pro',
        status: 'paid',
        periodStart: now,
        periodEnd: periodEnd,
        createdAt: now,
      });
    }
  }

  return c.json({ status: 'ok' });
});

export { app as webhooksRouter };