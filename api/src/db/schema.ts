// api/src/db/schema.ts
import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';

// --- BETTER AUTH TABLES ---

export const users = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' }).notNull(),
  image: text('image'), // Renamed from avatarUrl
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),

  lastLoginMethod: text("lastLoginMethod"),

  // Custom Profile Fields (Personal)
  headline: text('headline'),
  bio: text('bio'),
  websiteUrl: text('website_url'),
  linkedinUrl: text('linkedin_url'),
  twitterUrl: text('twitter_url'),

  // Default Workspace for quick login
  defaultWorkspaceId: text('default_workspace_id'),
});

export const sessions = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  activeWorkspaceId: text("active_workspace_id"), // Track which workspace is active in this session
});

export const accounts = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp" }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp" }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verifications = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

export const twoFactor = sqliteTable("two_factor", {
  id: text("id").primaryKey(),
  secret: text("secret").notNull(),
  backupCodes: text("backup_codes").notNull(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
});

// --- WORKSPACE TABLES ---

export const workspaces = sqliteTable('workspaces', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  type: text('type', { enum: ['freelancer', 'agency'] }).default('freelancer').notNull(),

  // Branding
  logo: text('logo'),
  accentColor: text('accent_color').default('indigo'),
  publicTemplate: text('public_template', { enum: ['modern', 'corporate', 'creative'] }).default('modern'),
  portalSlug: text('portal_slug').unique(), // For public access

  // Billing (Moved from User)
  tier: text('tier', { enum: ['free', 'pro'] }).default('free'),
  dodoPaymentsCustomerId: text('dodo_payments_customer_id'),

  // Settings
  notifyClientView: integer('notify_client_view', { mode: 'boolean' }).default(true),
  notifyClientOnLog: integer('notify_client_on_log', { mode: 'boolean' }).default(true),
  notifyWeeklyRecap: integer('notify_weekly_recap', { mode: 'boolean' }).default(true),

  // Programmatic Access
  apiKeyRead: text('api_key_read').unique(),
  apiKeyWrite: text('api_key_write').unique(),

  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`(strftime('%s', 'now') * 1000)`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .default(sql`(strftime('%s', 'now') * 1000)`),
});

export const workspaceMembers = sqliteTable('workspace_members', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: text('role', { enum: ['owner', 'admin', 'member'] }).default('member').notNull(),
  joinedAt: integer('joined_at', { mode: 'timestamp' })
    .default(sql`(strftime('%s', 'now') * 1000)`),
}, (table) => [
  index('member_workspace_idx').on(table.workspaceId),
  index('member_user_idx').on(table.userId),
]);

export const invitations = sqliteTable("invitation", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  role: text("role"),
  token: text("token").notNull().unique(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  inviterId: text("inviter_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  workspaceId: text("workspace_id").notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  status: text("status").notNull().default("pending"),
});


// --- CLIENTS TABLE ---
export const clients = sqliteTable('clients', {
  id: text('id').primaryKey(),
  // CHANGED: references workspace instead of user
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),

  companyName: text('company_name').notNull(),
  contactName: text('contact_name'),
  contactEmail: text('contact_email'),

  accessToken: text('access_token').notNull().unique(),

  status: text('status', { enum: ['active', 'archived'] }).default('active'),
  hourlyRate: real('hourly_rate'),
  currency: text('currency').default('USD'),

  lastViewedAt: integer('last_viewed_at', { mode: 'timestamp' }),

  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`(strftime('%s', 'now') * 1000)`),
}, (table) => [
  index('client_workspace_idx').on(table.workspaceId),
  index('client_token_idx').on(table.accessToken),
]);

export const subscription = sqliteTable("subscription", {
  id: text("id").primaryKey(), // PayMongo Checkout Session ID or Reference
  referenceId: text("reference_id").notNull(), // The Workspace ID (Changed from User ID)
  plan: text("plan"), // 'pro'
  status: text("status"), // 'paid', 'expired'

  // PayMongo doesn't have auto-recurring "subscriptions" in the basic Checkout API 
  // like Stripe, so we calculate these manually based on the payment date.
  periodStart: integer("period_start", { mode: "timestamp" }),
  periodEnd: integer("period_end", { mode: "timestamp" }),

  createdAt: integer("created_at", { mode: "timestamp" }),
});

// --- WORK LOGS TABLE ---
export const workLogs = sqliteTable('work_logs', {
  id: text('id').primaryKey(),
  // User log -> The person who did the work
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  // Client -> Belonging to a workspace
  clientId: text('client_id').notNull().references(() => clients.id, { onDelete: 'cascade' }),

  date: text('date').notNull(),
  summary: text('summary').notNull(),
  hoursWorked: real('hours_worked').default(0),

  videoUrl: text('video_url'),
  attachmentUrl: text('attachment_url'),

  isBlocked: integer('is_blocked', { mode: 'boolean' }).default(false),
  blockerDetails: text('blocker_details'),

  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`(strftime('%s', 'now') * 1000)`),
}, (table) => [
  index('user_date_idx').on(table.userId, table.date),
  index('log_user_idx').on(table.userId),
  index('log_client_idx').on(table.clientId),
  index('log_date_idx').on(table.date),
]);

// --- RELATIONS ---
export const usersRelations = relations(users, ({ many, one }) => ({
  workspaces: many(workspaceMembers), // A user can belong to many workspaces
  logs: many(workLogs),
}));

export const workspacesRelations = relations(workspaces, ({ many }) => ({
  members: many(workspaceMembers),
  clients: many(clients),
}));

export const workspaceMembersRelations = relations(workspaceMembers, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [workspaceMembers.workspaceId],
    references: [workspaces.id],
  }),
  user: one(users, {
    fields: [workspaceMembers.userId],
    references: [users.id],
  }),
}));

export const clientsRelations = relations(clients, ({ one, many }) => ({
  workspace: one(workspaces, { // Changed from owner/user
    fields: [clients.workspaceId],
    references: [workspaces.id],
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

// --- WEBHOOK EVENTS TABLE ---
export const webhookEvents = sqliteTable('webhook_events', {
  id: text('id').primaryKey(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  type: text('type').notNull(),
  processedAt: integer('processed_at', { mode: 'timestamp' }),
  status: text('status', { enum: ['processed', 'failed'] }).default('processed'),
});