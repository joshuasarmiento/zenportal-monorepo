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
    authToken: getEnv('TURSO_AUTH_TOKEN')
  },
  dodoPayments: {
    apiKey: getEnv('DODO_PAYMENTS_API_KEY'),
    webhookSecret: getEnv('DODO_PAYMENTS_WEBHOOK_SECRET'),
    productId: getEnv('DODO_PRODUCT_ID'),
  },
  betterAuth: {
    secretKey: getEnv('BETTER_AUTH_SECRET')
  },
  google: {
    googleclientSecret: getEnv('GOOGLE_CLIENT_SECRET'),
    googleclientId: getEnv('GOOGLE_CLIENT_ID')
  },
  resend: {
    apiKey: getEnv('RESEND_API_KEY')
  },
  redis: {
    url: getEnv('REDIS_URL')
  },
  app: {
    backendUrl: getEnv('BACKEND_URL'),
    frontendUrl: getEnv('FRONTEND_URL'),
    allowedOrigins: [
      ...getEnv('FRONTEND_URL').split(',').map((url) => url.trim()),
      'https://app.zenportal.com.ph'
    ]
  }
};
