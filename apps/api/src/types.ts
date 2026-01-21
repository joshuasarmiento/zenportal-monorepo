// import { createInsertSchema, createSelectSchema } from 'drizzle-typebox'; // Optional: if using typebox
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm';
import { users, clients, workLogs } from './db/schema';

// --- DATABASE TYPES ---

// User
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

// Client
export type Client = InferSelectModel<typeof clients>;
export type NewClient = InferInsertModel<typeof clients>;

// Log
export type WorkLog = InferSelectModel<typeof workLogs>;
export type NewWorkLog = InferInsertModel<typeof workLogs>;

// --- API RESPONSE TYPES ---

// Valid response for GET /api/public/report/:token
export type PublicReportResponse = {
  client: Client & { owner: User };
  logs: WorkLog[];
};