// api/src/index.ts
import { serve } from '@hono/node-server'; // [!code ++]
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

// Import the auth instance and middleware
import { auth } from './lib/auth'; 

// Import your new Routers
import { billingRouter } from './routes/billing';
import { webhooksRouter } from './routes/webhooks';
import { clientsRouter } from './routes/clients';
import { logsRouter } from './routes/logs';
import { userRouter } from './routes/user';
import { statsRouter } from './routes/stats';
import { publicRouter } from './routes/public';
import { v1ProgrammaticRouter } from './routes/v1_programmatic';
import { config } from './config';

const app = new Hono();

// 1. Global Middleware
app.use('*', logger());
app.use('*', cors({
    origin: [config.app.frontendUrl],
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

// 5. START THE SERVER [!code ++]
const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port
});

export default app;