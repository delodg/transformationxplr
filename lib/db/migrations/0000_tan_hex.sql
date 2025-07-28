CREATE TABLE `ai_insights` (
	`id` text PRIMARY KEY NOT NULL,
	`company_id` text NOT NULL,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`confidence` real NOT NULL,
	`impact` text NOT NULL,
	`source` text NOT NULL,
	`phase` integer NOT NULL,
	`actionable` integer DEFAULT true,
	`estimated_value` real,
	`timeframe` text,
	`dependencies` text,
	`recommendations` text,
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `analysis_results` (
	`id` text PRIMARY KEY NOT NULL,
	`company_id` text NOT NULL,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`results` text NOT NULL,
	`confidence` real,
	`generated_by` text,
	`phase` integer,
	`status` text DEFAULT 'active',
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `chat_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`company_id` text NOT NULL,
	`role` text NOT NULL,
	`content` text NOT NULL,
	`timestamp` integer DEFAULT (unixepoch()),
	`confidence` real,
	`related_phase` integer,
	`model` text,
	`error` text,
	`fallback` integer DEFAULT false,
	`created_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `companies` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`client_name` text NOT NULL,
	`industry` text NOT NULL,
	`engagement_type` text NOT NULL,
	`status` text NOT NULL,
	`progress` real DEFAULT 0 NOT NULL,
	`ai_acceleration` real DEFAULT 0 NOT NULL,
	`start_date` text NOT NULL,
	`estimated_completion` text NOT NULL,
	`team_members` text,
	`hackett_ip_matches` integer DEFAULT 0,
	`region` text NOT NULL,
	`project_value` real DEFAULT 0,
	`current_phase` integer DEFAULT 1,
	`revenue` text,
	`employees` text,
	`current_erp` text,
	`pain_points` text,
	`objectives` text,
	`timeline` text,
	`budget` text,
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `questionnaires` (
	`id` text PRIMARY KEY NOT NULL,
	`company_id` text NOT NULL,
	`type` text NOT NULL,
	`data` text NOT NULL,
	`completed_at` integer,
	`created_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`company_id` text,
	`session_data` text,
	`started_at` integer DEFAULT (unixepoch()),
	`last_activity` integer DEFAULT (unixepoch()),
	`ended_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`first_name` text,
	`last_name` text,
	`image_url` text,
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `workflow_phases` (
	`id` text PRIMARY KEY NOT NULL,
	`company_id` text NOT NULL,
	`phase_number` integer NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`status` text NOT NULL,
	`ai_acceleration` real DEFAULT 0,
	`duration` text,
	`traditional_duration` text,
	`hackett_ip` text,
	`deliverables` text,
	`ai_suggestions` text,
	`key_activities` text,
	`dependencies` text,
	`team_role` text,
	`client_tasks` text,
	`progress` real DEFAULT 0,
	`estimated_completion` text,
	`risk_factors` text,
	`success_metrics` text,
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE cascade
);
