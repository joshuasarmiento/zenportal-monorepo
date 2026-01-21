import type { Config } from 'drizzle-kit';
import 'dotenv/config';

if (!process.env.TURSO_DATABASE_URL) throw new Error('TURSO_DATABASE_URL is missing');
if (!process.env.TURSO_AUTH_TOKEN) throw new Error('TURSO_AUTH_TOKEN is missing');

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  
  // FIX: Change 'driver' to 'dialect' and remove the explicit 'turso' driver string
  dialect: 'turso', 
  
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
  
  verbose: true,
  strict: true,
} satisfies Config;