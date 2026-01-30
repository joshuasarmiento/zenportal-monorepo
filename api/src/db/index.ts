import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema.js';
import { config } from '../config.js';

const client = createClient({
  url: config.turso.databaseUrl,
  authToken: config.turso.authToken,
});

export const db = drizzle(client, { schema });