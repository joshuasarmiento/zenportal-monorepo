import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';

// --- USERS TABLE ---
export const users = sqliteTable('users', {
  id: text('id').primaryKey(), // Matches Clerk User ID
  email: text('email').notNull().unique(),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  
  // Branding
  handle: text('handle').unique(), // e.g. portal.app/juan
  brandColor: text('brand_color').default('#4F46E5'),
  
  // SaaS / Billing
  tier: text('tier', { enum: ['free', 'pro'] }).default('free'),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`(strftime('%s', 'now'))`),
});

// --- CLIENTS TABLE ---
export const clients = sqliteTable('clients', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  
  companyName: text('company_name').notNull(),
  contactName: text('contact_name'),
  contactEmail: text('contact_email'),
  
  // The "Magic Link" Token
  accessToken: text('access_token').notNull().unique(),
  
  status: text('status', { enum: ['active', 'archived'] }).default('active'),
  hourlyRate: real('hourly_rate'),
  currency: text('currency').default('USD'),
  
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`(strftime('%s', 'now'))`),
}, (table) => {
  return {
    userIdIdx: index('client_user_idx').on(table.userId),
    tokenIdx: index('client_token_idx').on(table.accessToken),
  };
});

// --- WORK LOGS TABLE ---
export const workLogs = sqliteTable('work_logs', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  clientId: text('client_id').notNull().references(() => clients.id, { onDelete: 'cascade' }),
  
  date: text('date').notNull(), // ISO Date String "2026-10-24"
  summary: text('summary').notNull(),
  hoursWorked: real('hours_worked').default(0),
  
  // Proof
  videoUrl: text('video_url'), // Loom Link
  attachmentUrl: text('attachment_url'),
  
  // Blockers
  isBlocked: integer('is_blocked', { mode: 'boolean' }).default(false),
  blockerDetails: text('blocker_details'),
  
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`(strftime('%s', 'now'))`),
}, (table) => {
  return {
    clientIdIdx: index('log_client_idx').on(table.clientId),
    dateIdx: index('log_date_idx').on(table.date),
  };
});

// --- RELATIONS ---
export const usersRelations = relations(users, ({ many }) => ({
  clients: many(clients),
  logs: many(workLogs),
}));

export const clientsRelations = relations(clients, ({ one, many }) => ({
  owner: one(users, {
    fields: [clients.userId],
    references: [users.id],
  }),
  logs: many(workLogs),
}));

export const workLogsRelations = relations(workLogs, ({ one }) => ({
  client: one(clients, {
    fields: [workLogs.clientId],
    references: [clients.id],
  }),
  user: one(users, {
    fields: [workLogs.userId],
    references: [users.id],
  }),
}));