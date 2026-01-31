// api/src/index.ts
import { serve } from '@hono/node-server'; // [!code ++]
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { handle } from 'hono/vercel';
// Import the auth instance and middleware
import { auth } from './lib/auth.js';

// Import your new Routers
import { billingRouter } from './routes/billing.js';
import { webhooksRouter } from './routes/webhooks.js';
import { clientsRouter } from './routes/clients.js';
import { logsRouter } from './routes/logs.js';
import { userRouter } from './routes/user.js';
import { statsRouter } from './routes/stats.js';
import { publicRouter } from './routes/public.js';
import { v1ProgrammaticRouter } from './routes/v1_programmatic.js';
import { config } from './config.js';

const app = new Hono();

// 1. Global Middleware
app.use('*', logger());
app.use('*', cors({
  origin: config.app.allowedOrigins,
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowHeaders: ['Content-Type', 'Authorization', 'paymongo-signature'],
}));

// 2. Mount Better Auth
app.on(['POST', 'GET'], '/api/auth/**', (c) => {
  return auth.handler(c.req.raw);
});

// 3. Mount Your API Routes
app.route('/api/billing', billingRouter);
app.route('/webhooks', webhooksRouter);
app.route('/clients', clientsRouter);
app.route('/logs', logsRouter);
app.route('/user', userRouter);
app.route('/stats', statsRouter);
app.route('/public', publicRouter);
app.route('/api/v1', v1ProgrammaticRouter);

// 4. Health Check - This is what you see in the browser
app.get('/', (c) => c.text('ZenPortal API is running 🚀'));

if (process.env.NODE_ENV !== 'production') {
  const port = 3000;
  console.log(`🚀 Hono Server running on http://localhost:${port}`)
  serve({
    fetch: app.fetch,
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