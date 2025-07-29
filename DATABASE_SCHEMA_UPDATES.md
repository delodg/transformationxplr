# Database Schema Updates for Enhanced Analytics Dashboard

## Overview

This document outlines all the database schema updates required to support the enhanced Company Analytics Dashboard with charts, historical tracking, export functionality, and dashboard preferences.

## Migration File

**Migration File**: `lib/db/migrations/0001_third_garia.sql`

## New Tables Added

### 1. `analytics_snapshots`

**Purpose**: Store historical data points for trending and timeline charts

```sql
CREATE TABLE `analytics_snapshots` (
  `id` text PRIMARY KEY NOT NULL,
  `company_id` text NOT NULL,
  `snapshot_type` text NOT NULL,  -- daily, weekly, monthly, milestone
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
  `velocity_score` real,          -- How fast phases are completed
  `quality_score` real,           -- Based on AI confidence and deliverable completion
  `risk_score` real,              -- Overall risk assessment
  `custom_metrics` text,          -- JSON object for additional KPIs
  `notes` text,                   -- Optional notes about this snapshot
  `created_at` integer DEFAULT (unixepoch()),
  FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE cascade
);
```

### 2. `dashboard_exports`

**Purpose**: Track PDF exports and report generations

```sql
CREATE TABLE `dashboard_exports` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL,
  `company_id` text NOT NULL,
  `export_type` text NOT NULL,        -- pdf, csv, json, png
  `file_name` text NOT NULL,
  `file_size` integer,                -- in bytes
  `export_format` text NOT NULL,      -- analytics-report, chart-export, raw-data
  `include_charts` integer DEFAULT true,
  `include_insights` integer DEFAULT true,
  `include_phases` integer DEFAULT true,
  `date_range` text,                  -- JSON object with start/end dates
  `filters` text,                     -- JSON object with applied filters
  `status` text DEFAULT 'completed' NOT NULL,  -- pending, completed, failed
  `error_message` text,
  `download_count` integer DEFAULT 0,
  `last_downloaded` integer,
  `expires_at` integer,               -- For temporary exports
  `created_at` integer DEFAULT (unixepoch()),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade,
  FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE cascade
);
```

### 3. `performance_metrics`

**Purpose**: Store calculated KPIs and metrics over time

```sql
CREATE TABLE `performance_metrics` (
  `id` text PRIMARY KEY NOT NULL,
  `company_id` text NOT NULL,
  `metric_type` text NOT NULL,        -- transformation-score, efficiency, roi, timeline-adherence
  `metric_name` text NOT NULL,
  `metric_value` real NOT NULL,
  `metric_unit` text,                 -- percentage, score, dollars, days, etc.
  `benchmark_value` real,             -- Industry or historical benchmark
  `target_value` real,                -- Target goal
  `calculation_method` text,          -- How this metric is calculated
  `data_source` text,                 -- phases, insights, manual, ai-generated
  `period` text NOT NULL,             -- daily, weekly, monthly, quarterly, project-to-date
  `period_start` integer NOT NULL,
  `period_end` integer NOT NULL,
  `trend` text,                       -- improving, declining, stable
  `confidence` real,                  -- Confidence in the metric calculation
  `metadata` text,                    -- JSON for additional context
  `created_at` integer DEFAULT (unixepoch()),
  FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE cascade
);
```

### 4. `dashboard_preferences`

**Purpose**: Store user dashboard customizations and settings

```sql
CREATE TABLE `dashboard_preferences` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL,
  `company_id` text,                  -- null for global preferences
  `preference_type` text NOT NULL,    -- dashboard-layout, chart-settings, export-defaults
  `preference_name` text NOT NULL,
  `preference_value` text NOT NULL,   -- JSON value
  `is_global` integer DEFAULT false,  -- Apply to all companies
  `is_default` integer DEFAULT false, -- Default setting
  `created_at` integer DEFAULT (unixepoch()),
  `updated_at` integer DEFAULT (unixepoch()),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade,
  FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE cascade
);
```

### 5. `chart_configurations`

**Purpose**: Store specific chart settings and customizations

```sql
CREATE TABLE `chart_configurations` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL,
  `company_id` text,
  `chart_type` text NOT NULL,         -- bar, pie, radar, area, line
  `chart_name` text NOT NULL,         -- phase-progress, insights-distribution, transformation-scorecard
  `configuration` text NOT NULL,      -- JSON object with chart settings
  `colors` text,                      -- JSON array of custom colors
  `data_filters` text,                -- JSON object with applied filters
  `display_options` text,             -- JSON object with display preferences
  `is_public` integer DEFAULT false,  -- Share with team
  `is_template` integer DEFAULT false, -- Available as template
  `use_count` integer DEFAULT 0,      -- How often this config is used
  `last_used` integer,
  `created_at` integer DEFAULT (unixepoch()),
  `updated_at` integer DEFAULT (unixepoch()),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade,
  FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE cascade
);
```

### 6. `dashboard_views`

**Purpose**: Track which dashboard tabs/views are most used

```sql
CREATE TABLE `dashboard_views` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL,
  `company_id` text NOT NULL,
  `view_type` text NOT NULL,          -- overview, performance, insights, phases, export
  `session_id` text,                  -- Link to user session
  `time_spent` integer,               -- seconds spent on this view
  `interaction_count` integer DEFAULT 0, -- clicks, scrolls, etc.
  `charts_viewed` text,               -- JSON array of chart types viewed
  `actions_performed` text,           -- JSON array of actions (export, filter, etc.)
  `device_type` text,                 -- desktop, tablet, mobile
  `browser_info` text,                -- JSON with browser details
  `created_at` integer DEFAULT (unixepoch()),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade,
  FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE cascade
);
```

## Updated Existing Tables

### `companies` Table Updates

```sql
ALTER TABLE `companies` ADD `last_analytics_update` integer;
ALTER TABLE `companies` ADD `analytics_version` text DEFAULT '1.0';
```

### `workflow_phases` Table Updates

```sql
ALTER TABLE `workflow_phases` ADD `estimated_hours` real DEFAULT 0;
ALTER TABLE `workflow_phases` ADD `actual_hours` real DEFAULT 0;
ALTER TABLE `workflow_phases` ADD `complexity` text DEFAULT 'standard';
```

## New API Endpoints

### 1. Analytics Snapshots API

- **GET** `/api/analytics/snapshots` - Fetch analytics snapshots
- **POST** `/api/analytics/snapshots` - Create or generate snapshots

### 2. Dashboard Exports API

- **GET** `/api/analytics/exports` - Fetch export history
- **POST** `/api/analytics/exports` - Create export record
- **PATCH** `/api/analytics/exports` - Update export status

### 3. Performance Metrics API

- **GET** `/api/analytics/metrics` - Fetch performance metrics
- **POST** `/api/analytics/metrics` - Create performance metrics
- **PATCH** `/api/analytics/metrics` - Update metrics

## New Database Services

### Analytics Snapshots Services

- `createAnalyticsSnapshot()`
- `getAnalyticsSnapshotsByCompany()`
- `getAnalyticsSnapshotsInDateRange()`
- `getLatestAnalyticsSnapshot()`
- `generateAnalyticsSnapshot()`
- `getAnalyticsTrends()`

### Dashboard Exports Services

- `createDashboardExport()`
- `getDashboardExportsByUser()`
- `getDashboardExportsByCompany()`
- `updateDashboardExport()`
- `incrementExportDownloadCount()`

### Performance Metrics Services

- `createPerformanceMetric()`
- `getPerformanceMetricsByCompany()`
- `getPerformanceMetricsByType()`
- `getPerformanceMetricsInPeriod()`
- `updatePerformanceMetric()`

### Dashboard Preferences Services

- `createDashboardPreference()`
- `getDashboardPreferencesByUser()`
- `getDashboardPreference()`
- `upsertDashboardPreference()`

### Chart Configurations Services

- `createChartConfiguration()`
- `getChartConfigurationsByUser()`
- `getChartConfigurationsByType()`
- `updateChartConfiguration()`
- `incrementChartConfigUseCount()`

### Dashboard Views Services

- `createDashboardView()`
- `getDashboardViewsByUser()`
- `getDashboardViewsByCompany()`
- `getDashboardViewsAnalytics()`

## Key Features Enabled

### 1. Historical Analytics

- Track progress over time with analytics snapshots
- Generate trend analysis and performance metrics
- Compare current vs historical performance

### 2. Advanced Charts

- Phase progress analytics (bar chart)
- AI insights distribution (pie chart)
- Transformation scorecard (radar chart)
- Timeline progress tracking (area chart)

### 3. PDF Export Functionality

- Track all export activities
- Monitor download counts and usage
- Support different export formats and filters

### 4. User Preferences

- Save dashboard customizations
- Store chart configurations
- Track user behavior and preferences

### 5. Performance Tracking

- Calculate and store KPIs over time
- Compare against benchmarks and targets
- Identify trends and performance patterns

## Migration Instructions

1. **Run the migration**:

   ```bash
   npx drizzle-kit push
   ```

2. **Verify table creation**:
   Check that all 6 new tables are created and the 2 existing tables are updated.

3. **Test the new APIs**:

   - Test analytics snapshots generation
   - Test export functionality
   - Test performance metrics creation

4. **Update frontend integration**:
   - Enhanced dashboard now supports all new analytics features
   - Charts are populated with real historical data
   - Export functionality is fully integrated

## Data Flow

1. **Analytics Snapshots**: Automatically generated daily or triggered manually
2. **Performance Metrics**: Calculated based on company data and stored periodically
3. **Dashboard Exports**: Created when users export PDFs or other formats
4. **User Preferences**: Saved when users customize dashboard settings
5. **Chart Configurations**: Stored when users modify chart settings
6. **Dashboard Views**: Tracked automatically for analytics and UX optimization

This comprehensive schema update transforms the basic analytics dashboard into an enterprise-grade analytics platform with full historical tracking, advanced visualizations, and professional export capabilities.
