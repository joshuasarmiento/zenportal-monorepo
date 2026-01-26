import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';
import { config } from '../config';

const client = createClient({
  url: config.turso.databaseUrl,
  authToken: config.turso.authToken,
});

export const db = drizzle(client, { schema });