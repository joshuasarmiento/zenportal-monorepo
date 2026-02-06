import * as Sentry from '@sentry/node';
import { env } from './env.js';

if (env.SENTRY_DSN) {
    Sentry.init({
        dsn: env.SENTRY_DSN,
        // Add environment to tags for better filtering
        // environment: env.NODE_ENV,
        // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,
    });
}
