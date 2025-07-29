import { sql } from "drizzle-orm";
import { text, integer, real, sqliteTable, primaryKey } from "drizzle-orm/sqlite-core";

// Users table (synced from Clerk webhooks)
export const users = sqliteTable("users", {
  id: text("id").primaryKey(), // Clerk user ID
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  imageUrl: text("image_url"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

// Companies/Projects table
export const companies = sqliteTable("companies", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  clientName: text("client_name").notNull(),
  industry: text("industry").notNull(),
  engagementType: text("engagement_type").notNull(),
  status: text("status").notNull(), // initiation, data-collection, analysis, roadmap, review, implementation
  progress: real("progress").notNull().default(0),
  aiAcceleration: real("ai_acceleration").notNull().default(0),
  startDate: text("start_date").notNull(),
  estimatedCompletion: text("estimated_completion").notNull(),
  teamMembers: text("team_members"), // JSON array
  hackettIPMatches: integer("hackett_ip_matches").default(0),
  region: text("region").notNull(),
  projectValue: real("project_value").default(0),
  currentPhase: integer("current_phase").default(1),
  // Additional onboarding data
  revenue: text("revenue"),
  employees: text("employees"),
  currentERP: text("current_erp"),
  painPoints: text("pain_points"), // JSON array
  objectives: text("objectives"), // JSON array
  timeline: text("timeline"),
  budget: text("budget"),
  // Enhanced analytics fields
  lastAnalyticsUpdate: integer("last_analytics_update", { mode: "timestamp" }),
  analyticsVersion: text("analytics_version").default("1.0"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

// AI Insights table
export const aiInsights = sqliteTable("ai_insights", {
  id: text("id").primaryKey(),
  companyId: text("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // recommendation, risk, opportunity, benchmark, automation
  title: text("title").notNull(),
  description: text("description").notNull(),
  confidence: real("confidence").notNull(),
  impact: text("impact").notNull(), // high, medium, low
  source: text("source").notNull(),
  phase: integer("phase").notNull(),
  actionable: integer("actionable", { mode: "boolean" }).default(true),
  estimatedValue: real("estimated_value"),
  timeframe: text("timeframe"),
  dependencies: text("dependencies"), // JSON array
  recommendations: text("recommendations"), // JSON array
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

// Chat Messages table
export const chatMessages = sqliteTable("chat_messages", {
  id: text("id").primaryKey(),
  companyId: text("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  role: text("role").notNull(), // user, assistant
  content: text("content").notNull(),
  timestamp: integer("timestamp", { mode: "timestamp" }).default(sql`(unixepoch())`),
  confidence: real("confidence"),
  relatedPhase: integer("related_phase"),
  model: text("model"),
  error: text("error"),
  fallback: integer("fallback", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

// Workflow Phases table (project-specific phase data)
export const workflowPhases = sqliteTable("workflow_phases", {
  id: text("id").primaryKey(),
  companyId: text("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  phaseNumber: integer("phase_number").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull(), // completed, in-progress, pending, ai-enhanced
  aiAcceleration: real("ai_acceleration").default(0),
  duration: text("duration"),
  traditionalDuration: text("traditional_duration"),
  hackettIP: text("hackett_ip"), // JSON array
  deliverables: text("deliverables"), // JSON array
  aiSuggestions: text("ai_suggestions"), // JSON array
  keyActivities: text("key_activities"), // JSON array
  dependencies: text("dependencies"), // JSON array
  teamRole: text("team_role"), // JSON array
  clientTasks: text("client_tasks"), // JSON array
  progress: real("progress").default(0),
  estimatedCompletion: text("estimated_completion"),
  riskFactors: text("risk_factors"), // JSON array
  successMetrics: text("success_metrics"), // JSON array
  // Enhanced tracking fields
  estimatedHours: real("estimated_hours").default(0),
  actualHours: real("actual_hours").default(0),
  complexity: text("complexity").default("standard"), // simple, standard, complex
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

// Questionnaires/Onboarding Data table
export const questionnaires = sqliteTable("questionnaires", {
  id: text("id").primaryKey(),
  companyId: text("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // onboarding, assessment, follow-up
  data: text("data").notNull(), // JSON data
  completedAt: integer("completed_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

// Analysis Results table (for storing various analysis outputs)
export const analysisResults = sqliteTable("analysis_results", {
  id: text("id").primaryKey(),
  companyId: text("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // gap-analysis, roi-analysis, risk-assessment, etc.
  title: text("title").notNull(),
  results: text("results").notNull(), // JSON data
  confidence: real("confidence"),
  generatedBy: text("generated_by"), // ai, manual, hybrid
  phase: integer("phase"),
  status: text("status").default("active"), // active, archived, superseded
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

// User Sessions table (for tracking user activity)
export const userSessions = sqliteTable("user_sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  companyId: text("company_id").references(() => companies.id, { onDelete: "cascade" }),
  sessionData: text("session_data"), // JSON data for user preferences, context, etc.
  startedAt: integer("started_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
  lastActivity: integer("last_activity", { mode: "timestamp" }).default(sql`(unixepoch())`),
  endedAt: integer("ended_at", { mode: "timestamp" }),
});

// NEW TABLES FOR ENHANCED ANALYTICS DASHBOARD

// Analytics Snapshots - Store historical data points for trending and timeline charts
export const analyticsSnapshots = sqliteTable("analytics_snapshots", {
  id: text("id").primaryKey(),
  companyId: text("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  snapshotType: text("snapshot_type").notNull(), // daily, weekly, monthly, milestone
  progress: real("progress").notNull(),
  aiAcceleration: real("ai_acceleration").notNull(),
  completedPhases: integer("completed_phases").notNull(),
  totalPhases: integer("total_phases").notNull(),
  totalInsights: integer("total_insights").notNull(),
  riskCount: integer("risk_count").notNull(),
  opportunityCount: integer("opportunity_count").notNull(),
  recommendationCount: integer("recommendation_count").notNull(),
  automationCount: integer("automation_count").notNull(),
  projectValue: real("project_value"),
  teamSize: integer("team_size"),
  // Performance metrics
  velocityScore: real("velocity_score"), // How fast phases are completed
  qualityScore: real("quality_score"), // Based on AI confidence and deliverable completion
  riskScore: real("risk_score"), // Overall risk assessment
  // Additional metrics as JSON for flexibility
  customMetrics: text("custom_metrics"), // JSON object for additional KPIs
  notes: text("notes"), // Optional notes about this snapshot
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

// Dashboard Exports - Track PDF exports and report generations
export const dashboardExports = sqliteTable("dashboard_exports", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  companyId: text("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  exportType: text("export_type").notNull(), // pdf, csv, json, png
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size"), // in bytes
  exportFormat: text("export_format").notNull(), // analytics-report, chart-export, raw-data
  includeCharts: integer("include_charts", { mode: "boolean" }).default(true),
  includeInsights: integer("include_insights", { mode: "boolean" }).default(true),
  includePhases: integer("include_phases", { mode: "boolean" }).default(true),
  dateRange: text("date_range"), // JSON object with start/end dates
  filters: text("filters"), // JSON object with applied filters
  status: text("status").notNull().default("completed"), // pending, completed, failed
  errorMessage: text("error_message"),
  downloadCount: integer("download_count").default(0),
  lastDownloaded: integer("last_downloaded", { mode: "timestamp" }),
  expiresAt: integer("expires_at", { mode: "timestamp" }), // For temporary exports
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

// Performance Metrics - Store calculated KPIs and metrics over time
export const performanceMetrics = sqliteTable("performance_metrics", {
  id: text("id").primaryKey(),
  companyId: text("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  metricType: text("metric_type").notNull(), // transformation-score, efficiency, roi, timeline-adherence
  metricName: text("metric_name").notNull(),
  metricValue: real("metric_value").notNull(),
  metricUnit: text("metric_unit"), // percentage, score, dollars, days, etc.
  benchmarkValue: real("benchmark_value"), // Industry or historical benchmark
  targetValue: real("target_value"), // Target goal
  calculationMethod: text("calculation_method"), // How this metric is calculated
  dataSource: text("data_source"), // phases, insights, manual, ai-generated
  period: text("period").notNull(), // daily, weekly, monthly, quarterly, project-to-date
  periodStart: integer("period_start", { mode: "timestamp" }).notNull(),
  periodEnd: integer("period_end", { mode: "timestamp" }).notNull(),
  trend: text("trend"), // improving, declining, stable
  confidence: real("confidence"), // Confidence in the metric calculation
  metadata: text("metadata"), // JSON for additional context
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

// Dashboard Preferences - Store user dashboard customizations and settings
export const dashboardPreferences = sqliteTable("dashboard_preferences", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  companyId: text("company_id").references(() => companies.id, { onDelete: "cascade" }), // null for global preferences
  preferenceType: text("preference_type").notNull(), // dashboard-layout, chart-settings, export-defaults
  preferenceName: text("preference_name").notNull(),
  preferenceValue: text("preference_value").notNull(), // JSON value
  isGlobal: integer("is_global", { mode: "boolean" }).default(false), // Apply to all companies
  isDefault: integer("is_default", { mode: "boolean" }).default(false), // Default setting
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

// Chart Configurations - Store specific chart settings and customizations
export const chartConfigurations = sqliteTable("chart_configurations", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  companyId: text("company_id").references(() => companies.id, { onDelete: "cascade" }),
  chartType: text("chart_type").notNull(), // bar, pie, radar, area, line
  chartName: text("chart_name").notNull(), // phase-progress, insights-distribution, transformation-scorecard
  configuration: text("configuration").notNull(), // JSON object with chart settings
  colors: text("colors"), // JSON array of custom colors
  dataFilters: text("data_filters"), // JSON object with applied filters
  displayOptions: text("display_options"), // JSON object with display preferences
  isPublic: integer("is_public", { mode: "boolean" }).default(false), // Share with team
  isTemplate: integer("is_template", { mode: "boolean" }).default(false), // Available as template
  useCount: integer("use_count").default(0), // How often this config is used
  lastUsed: integer("last_used", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

// Dashboard Views - Track which dashboard tabs/views are most used
export const dashboardViews = sqliteTable("dashboard_views", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  companyId: text("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  viewType: text("view_type").notNull(), // overview, performance, insights, phases, export
  sessionId: text("session_id"), // Link to user session
  timeSpent: integer("time_spent"), // seconds spent on this view
  interactionCount: integer("interaction_count").default(0), // clicks, scrolls, etc.
  chartsViewed: text("charts_viewed"), // JSON array of chart types viewed
  actionsPerformed: text("actions_performed"), // JSON array of actions (export, filter, etc.)
  deviceType: text("device_type"), // desktop, tablet, mobile
  browserInfo: text("browser_info"), // JSON with browser details
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

// Export types for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;
export type AIInsight = typeof aiInsights.$inferSelect;
export type NewAIInsight = typeof aiInsights.$inferInsert;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type NewChatMessage = typeof chatMessages.$inferInsert;
export type WorkflowPhase = typeof workflowPhases.$inferSelect;
export type NewWorkflowPhase = typeof workflowPhases.$inferInsert;
export type Questionnaire = typeof questionnaires.$inferSelect;
export type NewQuestionnaire = typeof questionnaires.$inferInsert;
export type AnalysisResult = typeof analysisResults.$inferSelect;
export type NewAnalysisResult = typeof analysisResults.$inferInsert;
export type UserSession = typeof userSessions.$inferSelect;
export type NewUserSession = typeof userSessions.$inferInsert;

// New table types
export type AnalyticsSnapshot = typeof analyticsSnapshots.$inferSelect;
export type NewAnalyticsSnapshot = typeof analyticsSnapshots.$inferInsert;
export type DashboardExport = typeof dashboardExports.$inferSelect;
export type NewDashboardExport = typeof dashboardExports.$inferInsert;
export type PerformanceMetric = typeof performanceMetrics.$inferSelect;
export type NewPerformanceMetric = typeof performanceMetrics.$inferInsert;
export type DashboardPreference = typeof dashboardPreferences.$inferSelect;
export type NewDashboardPreference = typeof dashboardPreferences.$inferInsert;
export type ChartConfiguration = typeof chartConfigurations.$inferSelect;
export type NewChartConfiguration = typeof chartConfigurations.$inferInsert;
export type DashboardView = typeof dashboardViews.$inferSelect;
export type NewDashboardView = typeof dashboardViews.$inferInsert;
