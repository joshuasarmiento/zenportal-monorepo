import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.string().url({ message: 'VITE_API_URL must be a valid URL in your .env file' }),
  VITE_BETTERAUTH_URL: z.string().url({ message: 'VITE_BETTERAUTH_URL must be a valid URL in your .env file' })
});

// This will throw a build-time error if the environment variables are missing or invalid.
export const env = envSchema.parse(import.meta.env);
