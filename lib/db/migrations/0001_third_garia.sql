CREATE TABLE `analytics_snapshots` (
	`id` text PRIMARY KEY NOT NULL,
	`company_id` text NOT NULL,
	`snapshot_type` text NOT NULL,
	`progress` real NOT NULL,
	`ai_acceleration` real NOT NULL,
	`completed_phases` integer NOT NULL,
	`total_phases` integer NOT NULL,
	`total_insights` integer NOT NULL,
	`risk_count` integer NOT NULL,
	`opportunity_count` integer NOT NULL,
	`recommendation_count` integer NOT NULL,
	`automation_count` integer NOT NULL,
	`project_value` real,
	`team_size` integer,
	`velocity_score` real,
	`quality_score` real,
	`risk_score` real,
	`custom_metrics` text,
	`notes` text,
	`created_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `chart_configurations` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`company_id` text,
	`chart_type` text NOT NULL,
	`chart_name` text NOT NULL,
	`configuration` text NOT NULL,
	`colors` text,
	`data_filters` text,
	`display_options` text,
	`is_public` integer DEFAULT false,
	`is_template` integer DEFAULT false,
	`use_count` integer DEFAULT 0,
	`last_used` integer,
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `dashboard_exports` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`company_id` text NOT NULL,
	`export_type` text NOT NULL,
	`file_name` text NOT NULL,
	`file_size` integer,
	`export_format` text NOT NULL,
	`include_charts` integer DEFAULT true,
	`include_insights` integer DEFAULT true,
	`include_phases` integer DEFAULT true,
	`date_range` text,
	`filters` text,
	`status` text DEFAULT 'completed' NOT NULL,
	`error_message` text,
	`download_count` integer DEFAULT 0,
	`last_downloaded` integer,
	`expires_at` integer,
	`created_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `dashboard_preferences` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`company_id` text,
	`preference_type` text NOT NULL,
	`preference_name` text NOT NULL,
	`preference_value` text NOT NULL,
	`is_global` integer DEFAULT false,
	`is_default` integer DEFAULT false,
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `dashboard_views` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`company_id` text NOT NULL,
	`view_type` text NOT NULL,
	`session_id` text,
	`time_spent` integer,
	`interaction_count` integer DEFAULT 0,
	`charts_viewed` text,
	`actions_performed` text,
	`device_type` text,
	`browser_info` text,
	`created_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `performance_metrics` (
	`id` text PRIMARY KEY NOT NULL,
	`company_id` text NOT NULL,
	`metric_type` text NOT NULL,
	`metric_name` text NOT NULL,
	`metric_value` real NOT NULL,
	`metric_unit` text,
	`benchmark_value` real,
	`target_value` real,
	`calculation_method` text,
	`data_source` text,
	`period` text NOT NULL,
	`period_start` integer NOT NULL,
	`period_end` integer NOT NULL,
	`trend` text,
	`confidence` real,
	`metadata` text,
	`created_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `companies` ADD `last_analytics_update` integer;--> statement-breakpoint
ALTER TABLE `companies` ADD `analytics_version` text DEFAULT '1.0';--> statement-breakpoint
ALTER TABLE `workflow_phases` ADD `estimated_hours` real DEFAULT 0;--> statement-breakpoint
ALTER TABLE `workflow_phases` ADD `actual_hours` real DEFAULT 0;--> statement-breakpoint
ALTER TABLE `workflow_phases` ADD `complexity` text DEFAULT 'standard';