import 'dotenv/config';

// A helper function to safely get environment variables.
const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

// Centralized configuration object.
export const config = {
  turso: {
    databaseUrl: getEnv('TURSO_DATABASE_URL'),
    authToken: getEnv('TURSO_AUTH_TOKEN'),
  },
  clerk: {
    webhookSecret: getEnv('CLERK_WEBHOOK_SECRET'),
  },
  stripe: {
    secretKey: getEnv('STRIPE_SECRET_KEY'),
    webhookSecret: getEnv('STRIPE_WEBHOOK_SECRET'),
    priceId: getEnv('STRIPE_PRICE_ID'),
  },
  resend: {
    apiKey: getEnv('RESEND_API_KEY'),
  },
  app: {
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  }
};
