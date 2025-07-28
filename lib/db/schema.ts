import { sql } from 'drizzle-orm';
import { text, integer, real, sqliteTable, primaryKey } from 'drizzle-orm/sqlite-core';

// Users table (synced from Clerk webhooks)
export const users = sqliteTable('users', {
  id: text('id').primaryKey(), // Clerk user ID
  email: text('email').notNull().unique(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  imageUrl: text('image_url'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

// Companies/Projects table
export const companies = sqliteTable('companies', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  clientName: text('client_name').notNull(),
  industry: text('industry').notNull(),
  engagementType: text('engagement_type').notNull(),
  status: text('status').notNull(), // initiation, data-collection, analysis, roadmap, review, implementation
  progress: real('progress').notNull().default(0),
  aiAcceleration: real('ai_acceleration').notNull().default(0),
  startDate: text('start_date').notNull(),
  estimatedCompletion: text('estimated_completion').notNull(),
  teamMembers: text('team_members'), // JSON array
  hackettIPMatches: integer('hackett_ip_matches').default(0),
  region: text('region').notNull(),
  projectValue: real('project_value').default(0),
  currentPhase: integer('current_phase').default(1),
  // Additional onboarding data
  revenue: text('revenue'),
  employees: text('employees'),
  currentERP: text('current_erp'),
  painPoints: text('pain_points'), // JSON array
  objectives: text('objectives'), // JSON array
  timeline: text('timeline'),
  budget: text('budget'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

// AI Insights table
export const aiInsights = sqliteTable('ai_insights', {
  id: text('id').primaryKey(),
  companyId: text('company_id').notNull().references(() => companies.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // recommendation, risk, opportunity, benchmark, automation
  title: text('title').notNull(),
  description: text('description').notNull(),
  confidence: real('confidence').notNull(),
  impact: text('impact').notNull(), // high, medium, low
  source: text('source').notNull(),
  phase: integer('phase').notNull(),
  actionable: integer('actionable', { mode: 'boolean' }).default(true),
  estimatedValue: real('estimated_value'),
  timeframe: text('timeframe'),
  dependencies: text('dependencies'), // JSON array
  recommendations: text('recommendations'), // JSON array
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

// Chat Messages table
export const chatMessages = sqliteTable('chat_messages', {
  id: text('id').primaryKey(),
  companyId: text('company_id').notNull().references(() => companies.id, { onDelete: 'cascade' }),
  role: text('role').notNull(), // user, assistant
  content: text('content').notNull(),
  timestamp: integer('timestamp', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  confidence: real('confidence'),
  relatedPhase: integer('related_phase'),
  model: text('model'),
  error: text('error'),
  fallback: integer('fallback', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

// Workflow Phases table (project-specific phase data)
export const workflowPhases = sqliteTable('workflow_phases', {
  id: text('id').primaryKey(),
  companyId: text('company_id').notNull().references(() => companies.id, { onDelete: 'cascade' }),
  phaseNumber: integer('phase_number').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  status: text('status').notNull(), // completed, in-progress, pending, ai-enhanced
  aiAcceleration: real('ai_acceleration').default(0),
  duration: text('duration'),
  traditionalDuration: text('traditional_duration'),
  hackettIP: text('hackett_ip'), // JSON array
  deliverables: text('deliverables'), // JSON array
  aiSuggestions: text('ai_suggestions'), // JSON array
  keyActivities: text('key_activities'), // JSON array
  dependencies: text('dependencies'), // JSON array
  teamRole: text('team_role'), // JSON array
  clientTasks: text('client_tasks'), // JSON array
  progress: real('progress').default(0),
  estimatedCompletion: text('estimated_completion'),
  riskFactors: text('risk_factors'), // JSON array
  successMetrics: text('success_metrics'), // JSON array
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

// Questionnaires/Onboarding Data table
export const questionnaires = sqliteTable('questionnaires', {
  id: text('id').primaryKey(),
  companyId: text('company_id').notNull().references(() => companies.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // onboarding, assessment, follow-up
  data: text('data').notNull(), // JSON data
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

// Analysis Results table (for storing various analysis outputs)
export const analysisResults = sqliteTable('analysis_results', {
  id: text('id').primaryKey(),
  companyId: text('company_id').notNull().references(() => companies.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // gap-analysis, roi-analysis, risk-assessment, etc.
  title: text('title').notNull(),
  results: text('results').notNull(), // JSON data
  confidence: real('confidence'),
  generatedBy: text('generated_by'), // ai, manual, hybrid
  phase: integer('phase'),
  status: text('status').default('active'), // active, archived, superseded
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

// User Sessions table (for tracking user activity)
export const userSessions = sqliteTable('user_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  companyId: text('company_id').references(() => companies.id, { onDelete: 'cascade' }),
  sessionData: text('session_data'), // JSON data for user preferences, context, etc.
  startedAt: integer('started_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  lastActivity: integer('last_activity', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  endedAt: integer('ended_at', { mode: 'timestamp' }),
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