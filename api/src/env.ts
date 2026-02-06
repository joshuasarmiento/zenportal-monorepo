import { z } from 'zod';
import 'dotenv/config';

const envSchema = z.object({
    // Node Environment
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

    // Database
    TURSO_DATABASE_URL: z.string().min(1, 'TURSO_DATABASE_URL is required'),
    TURSO_AUTH_TOKEN: z.string().min(1, 'TURSO_AUTH_TOKEN is required'),

    // Payments (Dodo)
    DODO_PAYMENTS_API_KEY: z.string().min(1, 'DODO_PAYMENTS_API_KEY is required'),
    DODO_PAYMENTS_WEBHOOK_SECRET: z.string().min(1, 'DODO_PAYMENTS_WEBHOOK_SECRET is required'),
    DODO_PRODUCT_ID: z.string().min(1, 'DODO_PRODUCT_ID is required'),

    // Authentication
    BETTER_AUTH_SECRET: z.string().min(1, 'BETTER_AUTH_SECRET is required'),
    GOOGLE_CLIENT_SECRET: z.string().min(1, 'GOOGLE_CLIENT_SECRET is required'),
    GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID is required'),

    // Email
    RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required'),

    // Infrastructure
    REDIS_URL: z.string().url('REDIS_URL must be a valid URL'),

    // Application URLs
    BACKEND_URL: z.url('BACKEND_URL must be a valid URL'),
    FRONTEND_URL: z.url('FRONTEND_URL must be a valid URL'),

    // Monitoring
    SENTRY_DSN: z.string().optional(),
});

// Validate `process.env` against the schema
// This will throw a detailed error if validation fails
export const env = envSchema.parse(process.env);
