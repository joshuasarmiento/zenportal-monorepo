// api/src/routes/webhooks.ts
import { Hono } from 'hono';
import { db } from '../db/index.js';
import { users, subscription } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { config } from '../config.js';
import * as crypto from 'crypto';

const app = new Hono();

// 1. DEBUG LOGGING: Log every request that hits this router
app.use('*', async (c, next) => {
  console.log(`🔔 [Webhooks Router] Hit: ${c.req.method} ${c.req.url}`);
  await next();
});

// 2. BROWSER TEST: Add a GET route so you can visit the URL in your browser
// URL: https://<ngrok-url>/api/webhooks/paymongo
app.get('/paymongo', (c) => {
  return c.text('✅ Webhook endpoint is reachable! (PayMongo sends POST requests)');
});

// POST /webhooks/paymongo - The actual PayMongo handler
app.post('/paymongo', async (c) => {
  console.log("📝 Webhook POST received. verifying...");

  const signatureHeader = c.req.header('paymongo-signature');
  const rawBody = await c.req.text();

  if (!signatureHeader) {
    console.error("❌ Missing PayMongo Signature");
    return c.json({ error: 'Missing signature' }, 401);
  }

  try {
    const parts = signatureHeader.split(',');
    const timestamp = parts.find(p => p.startsWith('t='))?.split('=')[1];
    const testSignature = parts.find(p => p.startsWith('te='))?.split('=')[1];
    const liveSignature = parts.find(p => p.startsWith('li='))?.split('=')[1];

    if (!timestamp) throw new Error('Missing timestamp');

    const canonicalString = `${timestamp}.${rawBody}`;

    const computedSignature = crypto
      .createHmac('sha256', config.paymongo.webhookSecret)
      .update(canonicalString)
      .digest('hex');

    const signatureToMatch = config.paymongo.publicKey.startsWith('pk_live') ? liveSignature : testSignature;

    if (computedSignature !== signatureToMatch) {
      console.error("❌ Signature Mismatch:", { computed: computedSignature, received: signatureToMatch });
      return c.json({ error: 'Invalid signature' }, 401);
    }

    console.log("✅ Signature Verified!");

  } catch (err) {
    console.error("❌ Webhook Verification Failed:", err);
    return c.json({ error: 'Verification failed' }, 401);
  }

  // Process the Event
  const event = JSON.parse(rawBody);
  const type = event.data.attributes.type;
  console.log(`📦 Event Type: ${type}`);

  if (type === 'checkout_session.payment.paid') {
    const attributes = event.data.attributes.data.attributes;
    const metadata = attributes.metadata;
    const userId = metadata?.userId;

    if (userId) {
      console.log(`💰 Processing Payment for User: ${userId}`);

      const now = new Date();
      const periodEnd = new Date();
      periodEnd.setDate(now.getDate() + 30);

      await db.update(users)
        .set({
          tier: 'pro',
          paymongoCustomerId: attributes.billing?.email
        })
        .where(eq(users.id, userId));

      await db.insert(subscription).values({
        id: event.data.id,
        referenceId: userId,
        plan: 'pro',
        status: 'paid',
        periodStart: now,
        periodEnd: periodEnd,
        createdAt: now,
      });
      console.log("🎉 User Upgraded to PRO successfully");
    } else {
      console.warn("⚠️ No UserId found in metadata");
    }
  }

  return c.json({ status: 'ok' });
});

export { app as webhooksRouter };