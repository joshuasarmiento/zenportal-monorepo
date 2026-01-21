import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { clerkMiddleware } from '@hono/clerk-auth';
import { clientsRouter } from './routes/clients';
import { logsRouter } from './routes/logs';
import { publicRouter } from './routes/public';
import { webhooksRouter } from './routes/webhooks'; // <-- ADD THIS

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
app.route('/api/webhooks', webhooksRouter); // <-- ADD THIS

app.get('/', (c) => c.text('ZenPortal API is running! 🚀'));

export default app;