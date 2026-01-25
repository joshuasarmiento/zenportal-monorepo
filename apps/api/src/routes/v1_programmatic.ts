import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { and, eq, desc } from 'drizzle-orm';

import { db } from '../db';
import { workLogs, clients } from '../db/schema';
import { requireReadAccess, requireWriteAccess } from '../lib/bearer';
import { User } from '../types';

// Define the shape of the context's bearerUser variable
type BearerUser = {
  user: User;
  access: 'read' | 'write';
}

const app = new Hono<{ Variables: { bearerUser: BearerUser } }>();

// --- Read-Only Endpoint ---
// This endpoint is protected by `requireReadAccess`.
// It allows users with either a read or a write API key to fetch their logs.
app.get('/logs', requireReadAccess, async (c) => {
  const { user } = c.get('bearerUser');

  const logs = await db.query.workLogs.findMany({
    where: eq(workLogs.userId, user.id),
    orderBy: [desc(workLogs.date)],
    limit: 100, // Limit to 100 most recent logs for programmatic access
    with: {
      client: {
        columns: {
          companyName: true,
        },
      },
    },
  });

  return c.json(logs);
});


// --- Write Endpoint ---

// Zod schema for validating the incoming POST request body.
const createLogSchema = z.object({
  clientId: z.string().uuid("Invalid Client ID format."),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format.'),
  summary: z.string().min(1, 'Summary cannot be empty.'),
  hoursWorked: z.number().positive("Hours worked must be a positive number."),
});

// This endpoint is protected by `requireWriteAccess`.
// Only users with a write-level API key can create new work logs.
app.post('/logs', requireWriteAccess, zValidator('json', createLogSchema), async (c) => {
  const { user } = c.get('bearerUser');
  const body = c.req.valid('json');

  // Verify that the specified clientId belongs to the authenticated user
  const client = await db.query.clients.findFirst({
    where: and(
      eq(clients.id, body.clientId),
      eq(clients.userId, user.id)
    )
  });

  if (!client) {
    return c.json({ error: "Client not found or access denied." }, 404);
  }

  // Insert the new work log into the database
  const newLog = await db.insert(workLogs).values({
    id: uuidv4(),
    userId: user.id,
    ...body
  }).returning();

  return c.json(newLog[0], 201); // Return 201 Created status
});


export { app as v1ProgrammaticRouter };