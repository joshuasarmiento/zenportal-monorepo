CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `clients` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`company_name` text NOT NULL,
	`contact_name` text,
	`contact_email` text,
	`access_token` text NOT NULL,
	`status` text DEFAULT 'active',
	`hourly_rate` real,
	`currency` text DEFAULT 'USD',
	`last_viewed_at` integer,
	`created_at` integer DEFAULT (strftime('%s', 'now') * 1000),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `clients_access_token_unique` ON `clients` (`access_token`);--> statement-breakpoint
CREATE INDEX `client_user_idx` ON `clients` (`user_id`);--> statement-breakpoint
CREATE INDEX `client_token_idx` ON `clients` (`access_token`);--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE TABLE `subscription` (
	`id` text PRIMARY KEY NOT NULL,
	`reference_id` text NOT NULL,
	`plan` text,
	`status` text,
	`period_start` integer,
	`period_end` integer,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `two_factor` (
	`id` text PRIMARY KEY NOT NULL,
	`secret` text NOT NULL,
	`backup_codes` text NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer NOT NULL,
	`image` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`lastLoginMethod` text,
	`headline` text,
	`bio` text,
	`website_url` text,
	`linkedin_url` text,
	`twitter_url` text,
	`portal_slug` text,
	`accent_color` text DEFAULT 'indigo',
	`public_template` text DEFAULT 'modern',
	`notify_client_view` integer DEFAULT true,
	`notify_client_on_log` integer DEFAULT true,
	`notify_weekly_recap` integer DEFAULT true,
	`notify_marketing` integer DEFAULT false,
	`tier` text DEFAULT 'free',
	`dodo_payments_customer_id` text,
	`api_key_read` text,
	`api_key_write` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_portal_slug_unique` ON `user` (`portal_slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_api_key_read_unique` ON `user` (`api_key_read`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_api_key_write_unique` ON `user` (`api_key_write`);--> statement-breakpoint
CREATE INDEX `api_key_read_idx` ON `user` (`api_key_read`);--> statement-breakpoint
CREATE INDEX `api_key_write_idx` ON `user` (`api_key_write`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `webhook_events` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`type` text NOT NULL,
	`processed_at` integer,
	`status` text DEFAULT 'processed'
);
--> statement-breakpoint
CREATE TABLE `work_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`client_id` text NOT NULL,
	`date` text NOT NULL,
	`summary` text NOT NULL,
	`hours_worked` real DEFAULT 0,
	`video_url` text,
	`attachment_url` text,
	`is_blocked` integer DEFAULT false,
	`blocker_details` text,
	`created_at` integer DEFAULT (strftime('%s', 'now') * 1000),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `user_date_idx` ON `work_logs` (`user_id`,`date`);--> statement-breakpoint
CREATE INDEX `log_user_idx` ON `work_logs` (`user_id`);--> statement-breakpoint
CREATE INDEX `log_client_idx` ON `work_logs` (`client_id`);--> statement-breakpoint
CREATE INDEX `log_date_idx` ON `work_logs` (`date`);