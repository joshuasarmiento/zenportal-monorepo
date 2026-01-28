import { Hono } from 'hono';

import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';
import { secureHeaders } from 'hono/secure-headers'

import { serve } from '@hono/node-server';

import { config } from './config'; // Ensure config is loaded and validated at startup
import { auth } from './lib/auth';
import { clientsRouter } from './routes/clients';
import { logsRouter } from './routes/logs';
import { publicRouter } from './routes/public';
import { statsRouter } from './routes/stats';
import { webhooksRouter } from './routes/webhooks';
import { userRouter } from './routes/user';
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

// --- Auth Handler ---
app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

// --- Specialized API Routers ---
// These routers have their own specific authentication and do not use the default session-based auth.
app.route('/v1', v1ProgrammaticRouter);          // Programmatic access via API keys
app.route('/webhooks', webhooksRouter);     // Public webhooks (Paymongo)
app.route('/public', publicRouter);         // Publicly accessible data (reports, profiles)

// --- User-Facing API ---
// These routes are for the web frontend and are protected by session auth and CSRF.
const api = new Hono();
api.use('*', csrf());

api.route('/clients', clientsRouter);
api.route('/logs', logsRouter);
api.route('/user', userRouter);
api.route('/stats', statsRouter);


// Mount the user-facing API under the /api path
app.route('/', api);

app.get('/', (c) => c.text('ZenPortal API is running! 🚀'));

const port = 3000
console.log(`🚀 Node Server running on http://localhost:${port}`)

serve(app)

export default app