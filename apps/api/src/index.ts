import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { clerkMiddleware } from '@hono/clerk-auth';
import { serve } from '@hono/node-server';
import { handle } from 'hono/vercel';
import { secureHeaders } from 'hono/secure-headers';
import { csrf } from 'hono/csrf';

import { config } from './config'; // Ensure config is loaded and validated at startup
import { clientsRouter } from './routes/clients';
import { logsRouter } from './routes/logs';
import { publicRouter } from './routes/public';
import { webhooksRouter } from './routes/webhooks';
import { statsRouter } from './routes/stats';
import { authRouter } from './routes/auth';
import { billingRouter } from './routes/billing';
import { v1ProgrammaticRouter } from './routes/v1_programmatic';

const app = new Hono().basePath('/');

app.onError((err, c) => {
  console.error('API Global Error:', err);
  return c.json({ error: 'Internal Server Error', message: err.message }, 500);
});

// --- Global Middleware ---
// Applied to all incoming requests
app.use('*', secureHeaders());
app.use(
  '/*',
  cors({
    origin: config.app.frontendUrl,
    credentials: true,
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    allowMethods: ['POST', 'GET', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
  })
);

// --- Specialized API Routers ---
// These routers have their own specific authentication and do not use the default session-based auth.
app.route('/v1', v1ProgrammaticRouter);          // Programmatic access via API keys
app.route('/api/webhooks', webhooksRouter);     // Public webhooks (Stripe, Clerk)
app.route('/api/public', publicRouter);         // Publicly accessible data (reports, profiles)


// --- User-Facing API ---
// These routes are for the web frontend and are protected by Clerk (session auth) and CSRF.
const api = new Hono();
api.use('*', csrf());
api.use('*', clerkMiddleware());

api.route('/clients', clientsRouter);
api.route('/logs', logsRouter);
api.route('/auth', authRouter);
api.route('/stats', statsRouter);
api.route('/billing', billingRouter);

// Mount the user-facing API under the /api path
app.route('/api', api);


app.get('/', (c) => c.text('ZenPortal API is running! 🚀'));

// Export for Vercel
export const GET = handle(app);
export const POST = handle(app);

const port = 3000
console.log(`🚀 Node Server running on http://localhost:${port}`)
serve({ fetch: app.fetch, port })
export default { port: 3000, fetch: app.fetch };