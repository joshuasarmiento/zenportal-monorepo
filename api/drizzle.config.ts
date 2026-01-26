import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

if (!process.env.TURSO_DATABASE_URL) throw new Error('TURSO_DATABASE_URL is missing');
if (!process.env.TURSO_AUTH_TOKEN) throw new Error('TURSO_AUTH_TOKEN is missing');

export default defineConfig({ // Use defineConfig instead of the object literal
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
  verbose: true,
  strict: true,
});