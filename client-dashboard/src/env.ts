import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.string().url({ message: 'VITE_API_URL must be a valid URL in your .env file' }),
  VITE_BETTERAUTH_URL: z.string().url({ message: 'VITE_BETTERAUTH_URL must be a valid URL in your .env file' }),
  VITE_DODO_PRODUCT_ID_MONTHLY: z.string({ message: 'VITE_DODO_PRODUCT_ID_MONTHLY is required' }),
  VITE_DODO_PRODUCT_ID_YEARLY: z.string({ message: 'VITE_DODO_PRODUCT_ID_YEARLY is required' })
});

// This will throw a build-time error if the environment variables are missing or invalid.
export const env = envSchema.parse(import.meta.env);
