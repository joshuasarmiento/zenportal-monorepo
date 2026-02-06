// api/src/index.ts
import './instrument.js';
import * as Sentry from '@sentry/node';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { handle } from 'hono/vercel';
// Import the auth instance and middleware
import { auth } from './lib/auth.js';
import { csrf } from 'hono/csrf'
import { secureHeaders } from 'hono/secure-headers'

// Import your new Routers
import { billingRouter } from './routes/billing.js';
import { clientsRouter } from './routes/clients.js';
import { logsRouter } from './routes/logs.js';
import { userRouter } from './routes/user.js';
import { statsRouter } from './routes/stats.js';
import { publicRouter } from './routes/public.js';
import { v1ProgrammaticRouter } from './routes/v1_programmatic.js';
import { config } from './config.js';

const app = new Hono();

// 1. Global Middleware
app.onError((err, c) => {
  Sentry.captureException(err);
  return c.text('Internal Server Error', 500);
});

app.use(secureHeaders())
app.use('*', logger());
app.use('*', cors({
  origin: config.app.allowedOrigins,
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowHeaders: ['Content-Type', 'Authorization', 'paymongo-signature'],
}));

app.use(
  csrf({
    origin: config.app.allowedOrigins,
    secFetchSite: (secFetchSite, c) => {
      // Always allow same-origin
      if (secFetchSite === 'same-origin') return true
      // Allow cross-site for webhook endpoints
      if (
        secFetchSite === 'cross-site' &&
        c.req.path.startsWith('/webhooks') ||
        c.req.path.startsWith('/api/auth/dodopayments/webhooks')
      ) {
        return true
      }
      return false
    },
  })
)

// 2. Mount Rate Limiting
import { rateLimit } from './lib/rate-limit.js';
app.use('*', rateLimit());

// 3. Mount Better Auth
import { bodyLimit } from 'hono/body-limit';

app.use('*', bodyLimit({
  maxSize: 50 * 1024 * 1024, // 50MB
  onError: (c) => {
    return c.text('Request body too large', 413);
  },
}));



app.on(['POST', 'GET'], '/api/auth/**', async (c) => {
  return auth.handler(c.req.raw);
});

// 3. Mount Your API Routes
app.route('/api/billing', billingRouter);
app.route('/clients', clientsRouter);
app.route('/logs', logsRouter);
app.route('/user', userRouter);
app.route('/stats', statsRouter);
app.route('/public', publicRouter);
app.route('/api/v1', v1ProgrammaticRouter);

// 4. Health Check - This is what you see in the browser
app.get('/', (c) => c.text('ZenPortal API is running 🚀'));

import { env } from './env.js';

if (env.NODE_ENV !== 'production') {
  const port = 3000;
  console.log(`🚀 Hono Server running on http://localhost:${port}`)
  serve({
    fetch: (req) => app.fetch(req, {}, {
      waitUntil: (promise: Promise<unknown>) => promise,
      passThroughOnException: () => { },
      props: {},
    }),
    port
  });
}

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
export const OPTIONS = handle(app);
export default app;