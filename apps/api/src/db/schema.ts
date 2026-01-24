import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';

// --- USERS TABLE (Updated) ---
export const users = sqliteTable('users', {
  id: text('id').primaryKey(), // Matches Clerk User ID
  email: text('email').notNull().unique(),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  
  // NEW PROFILE FIELDS
  headline: text('headline'), // e.g. "Senior Full Stack Developer"
  bio: text('bio'), // Longer description
  websiteUrl: text('website_url'),
  linkedinUrl: text('linkedin_url'),
  twitterUrl: text('twitter_url'),
  
  // Branding & Settings
  // We renamed 'handle' -> 'portalSlug' to match your frontend code
  portalSlug: text('portal_slug').unique(), 
  // We renamed 'brandColor' -> 'accentColor' to match your frontend code
  accentColor: text('accent_color').default('indigo'),

  publicTemplate: text('public_template', { enum: ['modern', 'corporate', 'creative'] }).default('modern'),
  
  // Notifications (NEW COLUMNS)
  notifyClientView: integer('notify_client_view', { mode: 'boolean' }).default(false),
  notifyWeeklyRecap: integer('notify_weekly_recap', { mode: 'boolean' }).default(false),
  notifyMarketing: integer('notify_marketing', { mode: 'boolean' }).default(false),
  
  // SaaS / Billing
  tier: text('tier', { enum: ['free', 'pro'] }).default('free'),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`(strftime('%s', 'now'))`),
});

// --- CLIENTS TABLE (Unchanged) ---
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

// --- WORK LOGS TABLE (Unchanged) ---
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
    userDateIdx: index('user_date_idx').on(table.userId, table.date),
    userIdIdx: index('log_user_idx').on(table.userId),
    clientIdIdx: index('log_client_idx').on(table.clientId),
    dateIdx: index('log_date_idx').on(table.date),
  };
});

// --- RELATIONS (Unchanged) ---
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