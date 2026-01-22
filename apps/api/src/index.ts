import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { clerkMiddleware } from '@hono/clerk-auth';
import { serve } from '@hono/node-server';
import { handle } from 'hono/vercel';

import { clientsRouter } from './routes/clients';
import { logsRouter } from './routes/logs';
import { publicRouter } from './routes/public';
import { webhooksRouter } from './routes/webhooks';
import { statsRouter } from './routes/stats';
import { authRouter } from './routes/auth';
import { billingRouter } from './routes/billing';

const app = new Hono();

// 1. Global Middleware
app.use('/*', cors()); 
app.use('*', clerkMiddleware()); 

// 2. Protected Routes
app.route('/api/clients', clientsRouter);
app.route('/api/logs', logsRouter);

// 3. Public Routes
app.route('/api/public', publicRouter);

// 4. Webhooks (Stripe) - Must be Public!
app.route('/api/webhooks', webhooksRouter); 

app.route('/api/auth', authRouter);

app.route('/api/stats', statsRouter);

app.route('/api/billing', billingRouter);

app.get('/', (c) => c.text('ZenPortal API is running! 🚀'));

// Export for Vercel
export const GET = handle(app);
export const POST = handle(app);

const port = 3000
console.log(`🚀 Node Server running on http://localhost:${port}`)
serve({ fetch: app.fetch, port })
export default { port: 3000, fetch: app.fetch };

// export default app;