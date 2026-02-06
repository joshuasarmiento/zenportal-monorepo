import 'dotenv/config';

// Centralized configuration object.
import { env } from './env.js';

export const config = {
  turso: {
    databaseUrl: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN
  },
  dodoPayments: {
    apiKey: env.DODO_PAYMENTS_API_KEY,
    webhookSecret: env.DODO_PAYMENTS_WEBHOOK_SECRET,
    productId: env.DODO_PRODUCT_ID,
  },
  betterAuth: {
    secretKey: env.BETTER_AUTH_SECRET
  },
  google: {
    googleclientSecret: env.GOOGLE_CLIENT_SECRET,
    googleclientId: env.GOOGLE_CLIENT_ID
  },
  resend: {
    apiKey: env.RESEND_API_KEY
  },
  redis: {
    url: env.REDIS_URL
  },
  app: {
    backendUrl: env.BACKEND_URL,
    frontendUrl: env.FRONTEND_URL,
    allowedOrigins: [
      ...env.FRONTEND_URL.split(',').map((url) => url.trim()),
      'https://app.zenportal.com.ph'
    ]
  }
};
