import {
  db,
  companies,
  chatMessages,
  aiInsights,
  workflowPhases,
  questionnaires,
  analysisResults,
  userSessions,
  users,
  analyticsSnapshots,
  dashboardExports,
  performanceMetrics,
  dashboardPreferences,
  chartConfigurations,
  dashboardViews,
} from "./index";
import { eq, and, desc, asc, isNull, gte, lte, between } from "drizzle-orm";
import type {
  NewCompany,
  Company,
  NewChatMessage,
  ChatMessage,
  NewAIInsight,
  AIInsight,
  NewWorkflowPhase,
  WorkflowPhase,
  NewQuestionnaire,
  NewAnalysisResult,
  NewUserSession,
  NewUser,
  NewAnalyticsSnapshot,
  AnalyticsSnapshot,
  NewDashboardExport,
  DashboardExport,
  NewPerformanceMetric,
  PerformanceMetric,
  NewDashboardPreference,
  DashboardPreference,
  NewChartConfiguration,
  ChartConfiguration,
  NewDashboardView,
  DashboardView,
} from "./schema";
import { sql } from "drizzle-orm";

// ===============================
// USER SERVICES
// ===============================

export async function ensureUserExists(userId: string): Promise<boolean> {
  try {
    // Check if user exists first
    const [existingUser] = await db.select().from(users).where(eq(users.id, userId)).limit(1);

    if (existingUser) {
      console.log(`User ${userId} already exists`);
      return true;
    }

    // Create a basic user record if it doesn't exist
    console.log(`Creating user record for ${userId}`);
    await db.insert(users).values({
      id: userId,
      email: `${userId}@temp.local`, // Temporary email, will be updated by webhook
      firstName: null,
      lastName: null,
      imageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log(`Successfully created user record for ${userId}`);

    // Verify the user was created
    const [verifyUser] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!verifyUser) {
      console.error(`Failed to verify user creation for ${userId}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error ensuring user exists:", error);

    // If it's a unique constraint error, the user might already exist
    if (error && typeof error === "object" && "code" in error && error.code === "SQLITE_CONSTRAINT") {
      console.log(`User ${userId} might already exist (constraint error), checking again...`);
      try {
        const [existingUser] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
        return !!existingUser;
      } catch (checkError) {
        console.error("Error checking user existence after constraint error:", checkError);
        return false;
      }
    }

    return false;
  }
}

// ===============================
// COMPANY SERVICES
// ===============================

export async function createCompany(company: NewCompany): Promise<Company> {
  const [newCompany] = await db.insert(companies).values(company).returning();
  return newCompany;
}

export async function getCompaniesByUser(userId: string): Promise<Company[]> {
  return await db.select().from(companies).where(eq(companies.userId, userId)).orderBy(desc(companies.updatedAt));
}

export async function getCompanyById(companyId: string): Promise<Company | null> {
  const [company] = await db.select().from(companies).where(eq(companies.id, companyId)).limit(1);
  return company || null;
}

export async function updateCompany(companyId: string, updates: Partial<NewCompany>): Promise<Company> {
  const [updatedCompany] = await db
    .update(companies)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(companies.id, companyId))
    .returning();
  return updatedCompany;
}

export async function deleteCompany(companyId: string): Promise<void> {
  await db.delete(companies).where(eq(companies.id, companyId));
}

// ===============================
// CHAT MESSAGE SERVICES
// ===============================

export async function createChatMessage(message: NewChatMessage): Promise<ChatMessage> {
  const [newMessage] = await db.insert(chatMessages).values(message).returning();
  return newMessage;
}

export async function getChatMessagesByCompany(companyId: string): Promise<ChatMessage[]> {
  return await db.select().from(chatMessages).where(eq(chatMessages.companyId, companyId)).orderBy(asc(chatMessages.timestamp));
}

export async function deleteChatMessagesByCompany(companyId: string): Promise<void> {
  await db.delete(chatMessages).where(eq(chatMessages.companyId, companyId));
}

export async function bulkCreateChatMessages(messages: NewChatMessage[]): Promise<ChatMessage[]> {
  if (messages.length === 0) return [];
  return await db.insert(chatMessages).values(messages).returning();
}

// ===============================
// AI INSIGHTS SERVICES
// ===============================

export async function createAIInsight(insight: NewAIInsight): Promise<AIInsight> {
  const [newInsight] = await db.insert(aiInsights).values(insight).returning();
  return newInsight;
}

export async function getAIInsightsByCompany(companyId: string): Promise<AIInsight[]> {
  return await db.select().from(aiInsights).where(eq(aiInsights.companyId, companyId)).orderBy(desc(aiInsights.createdAt));
}

export async function updateAIInsight(insightId: string, updates: Partial<NewAIInsight>): Promise<AIInsight> {
  const [updatedInsight] = await db
    .update(aiInsights)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(aiInsights.id, insightId))
    .returning();
  return updatedInsight;
}

export async function deleteAIInsight(insightId: string): Promise<void> {
  await db.delete(aiInsights).where(eq(aiInsights.id, insightId));
}

export async function bulkCreateAIInsights(insights: NewAIInsight[]): Promise<AIInsight[]> {
  if (insights.length === 0) return [];
  return await db.insert(aiInsights).values(insights).returning();
}

// ===============================
// WORKFLOW PHASES SERVICES
// ===============================

export async function createWorkflowPhase(phase: NewWorkflowPhase): Promise<WorkflowPhase> {
  const [newPhase] = await db.insert(workflowPhases).values(phase).returning();
  return newPhase;
}

export async function getWorkflowPhasesByCompany(companyId: string): Promise<WorkflowPhase[]> {
  return await db.select().from(workflowPhases).where(eq(workflowPhases.companyId, companyId)).orderBy(asc(workflowPhases.phaseNumber));
}

export async function updateWorkflowPhase(phaseId: string, updates: Partial<NewWorkflowPhase>): Promise<WorkflowPhase> {
  const [updatedPhase] = await db
    .update(workflowPhases)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(workflowPhases.id, phaseId))
    .returning();
  return updatedPhase;
}

export async function bulkCreateWorkflowPhases(phases: NewWorkflowPhase[]): Promise<WorkflowPhase[]> {
  if (phases.length === 0) return [];
  return await db.insert(workflowPhases).values(phases).returning();
}

// ===============================
// QUESTIONNAIRE SERVICES
// ===============================

export async function createQuestionnaire(questionnaire: NewQuestionnaire): Promise<void> {
  await db.insert(questionnaires).values(questionnaire);
}

export async function getQuestionnairesByCompany(companyId: string, type?: string): Promise<any[]> {
  if (type) {
    return await db
      .select()
      .from(questionnaires)
      .where(and(eq(questionnaires.companyId, companyId), eq(questionnaires.type, type)))
      .orderBy(desc(questionnaires.createdAt));
  } else {
    return await db.select().from(questionnaires).where(eq(questionnaires.companyId, companyId)).orderBy(desc(questionnaires.createdAt));
  }
}

// ===============================
// ANALYSIS RESULTS SERVICES
// ===============================

export async function createAnalysisResult(analysis: NewAnalysisResult): Promise<void> {
  await db.insert(analysisResults).values(analysis);
}

export async function getAnalysisResultsByCompany(companyId: string, type?: string): Promise<any[]> {
  if (type) {
    return await db
      .select()
      .from(analysisResults)
      .where(and(eq(analysisResults.companyId, companyId), eq(analysisResults.type, type)))
      .orderBy(desc(analysisResults.createdAt));
  } else {
    return await db.select().from(analysisResults).where(eq(analysisResults.companyId, companyId)).orderBy(desc(analysisResults.createdAt));
  }
}

// ===============================
// USER SESSION SERVICES
// ===============================

export async function createUserSession(session: NewUserSession): Promise<void> {
  await db.insert(userSessions).values(session);
}

export async function updateUserSession(sessionId: string, updates: Partial<NewUserSession>): Promise<void> {
  await db
    .update(userSessions)
    .set({ ...updates, lastActivity: new Date() })
    .where(eq(userSessions.id, sessionId));
}

export async function getUserActiveSessions(userId: string): Promise<any[]> {
  return await db
    .select()
    .from(userSessions)
    .where(and(eq(userSessions.userId, userId), isNull(userSessions.endedAt)))
    .orderBy(desc(userSessions.lastActivity));
}

// ===============================
// ANALYTICS SNAPSHOTS SERVICES
// ===============================

export async function createAnalyticsSnapshot(snapshot: NewAnalyticsSnapshot): Promise<AnalyticsSnapshot> {
  const [newSnapshot] = await db.insert(analyticsSnapshots).values(snapshot).returning();
  return newSnapshot;
}

export async function getAnalyticsSnapshotsByCompany(companyId: string): Promise<AnalyticsSnapshot[]> {
  return await db.select().from(analyticsSnapshots).where(eq(analyticsSnapshots.companyId, companyId)).orderBy(desc(analyticsSnapshots.createdAt));
}

export async function getAnalyticsSnapshotsInDateRange(companyId: string, startDate: Date, endDate: Date): Promise<AnalyticsSnapshot[]> {
  return await db
    .select()
    .from(analyticsSnapshots)
    .where(and(eq(analyticsSnapshots.companyId, companyId), between(analyticsSnapshots.createdAt, startDate, endDate)))
    .orderBy(asc(analyticsSnapshots.createdAt));
}

export async function getLatestAnalyticsSnapshot(companyId: string): Promise<AnalyticsSnapshot | null> {
  const [snapshot] = await db.select().from(analyticsSnapshots).where(eq(analyticsSnapshots.companyId, companyId)).orderBy(desc(analyticsSnapshots.createdAt)).limit(1);
  return snapshot || null;
}

export async function deleteAnalyticsSnapshot(snapshotId: string): Promise<void> {
  await db.delete(analyticsSnapshots).where(eq(analyticsSnapshots.id, snapshotId));
}

// ===============================
// DASHBOARD EXPORTS SERVICES
// ===============================

export async function createDashboardExport(exportData: NewDashboardExport): Promise<DashboardExport> {
  const [newExport] = await db.insert(dashboardExports).values(exportData).returning();
  return newExport;
}

export async function getDashboardExportsByUser(userId: string): Promise<DashboardExport[]> {
  return await db.select().from(dashboardExports).where(eq(dashboardExports.userId, userId)).orderBy(desc(dashboardExports.createdAt));
}

export async function getDashboardExportsByCompany(companyId: string): Promise<DashboardExport[]> {
  return await db.select().from(dashboardExports).where(eq(dashboardExports.companyId, companyId)).orderBy(desc(dashboardExports.createdAt));
}

export async function getDashboardExportById(exportId: string): Promise<DashboardExport | null> {
  const [exportData] = await db.select().from(dashboardExports).where(eq(dashboardExports.id, exportId)).limit(1);
  return exportData || null;
}

export async function updateDashboardExport(exportId: string, updates: Partial<NewDashboardExport>): Promise<DashboardExport> {
  const [updatedExport] = await db.update(dashboardExports).set(updates).where(eq(dashboardExports.id, exportId)).returning();
  return updatedExport;
}

export async function incrementExportDownloadCount(exportId: string): Promise<DashboardExport> {
  const [updatedExport] = await db
    .update(dashboardExports)
    .set({
      downloadCount: sql`${dashboardExports.downloadCount} + 1`,
      lastDownloaded: new Date(),
    })
    .where(eq(dashboardExports.id, exportId))
    .returning();
  return updatedExport;
}

export async function deleteDashboardExport(exportId: string): Promise<void> {
  await db.delete(dashboardExports).where(eq(dashboardExports.id, exportId));
}

// ===============================
// PERFORMANCE METRICS SERVICES
// ===============================

export async function createPerformanceMetric(metric: NewPerformanceMetric): Promise<PerformanceMetric> {
  const [newMetric] = await db.insert(performanceMetrics).values(metric).returning();
  return newMetric;
}

export async function getPerformanceMetricsByCompany(companyId: string): Promise<PerformanceMetric[]> {
  return await db.select().from(performanceMetrics).where(eq(performanceMetrics.companyId, companyId)).orderBy(desc(performanceMetrics.createdAt));
}

export async function getPerformanceMetricsByType(companyId: string, metricType: string): Promise<PerformanceMetric[]> {
  return await db
    .select()
    .from(performanceMetrics)
    .where(and(eq(performanceMetrics.companyId, companyId), eq(performanceMetrics.metricType, metricType)))
    .orderBy(desc(performanceMetrics.periodEnd));
}

export async function getPerformanceMetricsInPeriod(companyId: string, startDate: Date, endDate: Date): Promise<PerformanceMetric[]> {
  return await db
    .select()
    .from(performanceMetrics)
    .where(and(eq(performanceMetrics.companyId, companyId), between(performanceMetrics.periodStart, startDate, endDate)))
    .orderBy(asc(performanceMetrics.periodStart));
}

export async function updatePerformanceMetric(metricId: string, updates: Partial<NewPerformanceMetric>): Promise<PerformanceMetric> {
  const [updatedMetric] = await db.update(performanceMetrics).set(updates).where(eq(performanceMetrics.id, metricId)).returning();
  return updatedMetric;
}

export async function deletePerformanceMetric(metricId: string): Promise<void> {
  await db.delete(performanceMetrics).where(eq(performanceMetrics.id, metricId));
}

// ===============================
// DASHBOARD PREFERENCES SERVICES
// ===============================

export async function createDashboardPreference(preference: NewDashboardPreference): Promise<DashboardPreference> {
  const [newPreference] = await db.insert(dashboardPreferences).values(preference).returning();
  return newPreference;
}

export async function getDashboardPreferencesByUser(userId: string): Promise<DashboardPreference[]> {
  return await db.select().from(dashboardPreferences).where(eq(dashboardPreferences.userId, userId)).orderBy(desc(dashboardPreferences.updatedAt));
}

export async function getDashboardPreference(userId: string, preferenceType: string, preferenceName: string, companyId?: string): Promise<DashboardPreference | null> {
  const conditions = [eq(dashboardPreferences.userId, userId), eq(dashboardPreferences.preferenceType, preferenceType), eq(dashboardPreferences.preferenceName, preferenceName)];

  if (companyId) {
    conditions.push(eq(dashboardPreferences.companyId, companyId));
  } else {
    conditions.push(isNull(dashboardPreferences.companyId));
  }

  const [preference] = await db
    .select()
    .from(dashboardPreferences)
    .where(and(...conditions))
    .limit(1);
  return preference || null;
}

export async function upsertDashboardPreference(preference: NewDashboardPreference): Promise<DashboardPreference> {
  const existing = await getDashboardPreference(preference.userId, preference.preferenceType, preference.preferenceName, preference.companyId || undefined);

  if (existing) {
    const [updated] = await db
      .update(dashboardPreferences)
      .set({
        preferenceValue: preference.preferenceValue,
        updatedAt: new Date(),
      })
      .where(eq(dashboardPreferences.id, existing.id))
      .returning();
    return updated;
  } else {
    return await createDashboardPreference(preference);
  }
}

export async function deleteDashboardPreference(preferenceId: string): Promise<void> {
  await db.delete(dashboardPreferences).where(eq(dashboardPreferences.id, preferenceId));
}

// ===============================
// CHART CONFIGURATIONS SERVICES
// ===============================

export async function createChartConfiguration(config: NewChartConfiguration): Promise<ChartConfiguration> {
  const [newConfig] = await db.insert(chartConfigurations).values(config).returning();
  return newConfig;
}

export async function getChartConfigurationsByUser(userId: string): Promise<ChartConfiguration[]> {
  return await db.select().from(chartConfigurations).where(eq(chartConfigurations.userId, userId)).orderBy(desc(chartConfigurations.lastUsed));
}

export async function getChartConfigurationsByType(userId: string, chartType: string): Promise<ChartConfiguration[]> {
  return await db
    .select()
    .from(chartConfigurations)
    .where(and(eq(chartConfigurations.userId, userId), eq(chartConfigurations.chartType, chartType)))
    .orderBy(desc(chartConfigurations.useCount));
}

export async function getChartConfiguration(userId: string, chartName: string, companyId?: string): Promise<ChartConfiguration | null> {
  const conditions = [eq(chartConfigurations.userId, userId), eq(chartConfigurations.chartName, chartName)];

  if (companyId) {
    conditions.push(eq(chartConfigurations.companyId, companyId));
  }

  const [config] = await db
    .select()
    .from(chartConfigurations)
    .where(and(...conditions))
    .limit(1);
  return config || null;
}

export async function updateChartConfiguration(configId: string, updates: Partial<NewChartConfiguration>): Promise<ChartConfiguration> {
  const [updatedConfig] = await db
    .update(chartConfigurations)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(chartConfigurations.id, configId))
    .returning();
  return updatedConfig;
}

export async function incrementChartConfigUseCount(configId: string): Promise<ChartConfiguration> {
  const [updatedConfig] = await db
    .update(chartConfigurations)
    .set({
      useCount: sql`${chartConfigurations.useCount} + 1`,
      lastUsed: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(chartConfigurations.id, configId))
    .returning();
  return updatedConfig;
}

export async function deleteChartConfiguration(configId: string): Promise<void> {
  await db.delete(chartConfigurations).where(eq(chartConfigurations.id, configId));
}

// ===============================
// DASHBOARD VIEWS SERVICES
// ===============================

export async function createDashboardView(view: NewDashboardView): Promise<DashboardView> {
  const [newView] = await db.insert(dashboardViews).values(view).returning();
  return newView;
}

export async function getDashboardViewsByUser(userId: string): Promise<DashboardView[]> {
  return await db.select().from(dashboardViews).where(eq(dashboardViews.userId, userId)).orderBy(desc(dashboardViews.createdAt));
}

export async function getDashboardViewsByCompany(companyId: string): Promise<DashboardView[]> {
  return await db.select().from(dashboardViews).where(eq(dashboardViews.companyId, companyId)).orderBy(desc(dashboardViews.createdAt));
}

export async function getDashboardViewsAnalytics(userId: string, startDate: Date, endDate: Date): Promise<DashboardView[]> {
  return await db
    .select()
    .from(dashboardViews)
    .where(and(eq(dashboardViews.userId, userId), between(dashboardViews.createdAt, startDate, endDate)))
    .orderBy(desc(dashboardViews.createdAt));
}

export async function updateDashboardView(viewId: string, updates: Partial<NewDashboardView>): Promise<DashboardView> {
  const [updatedView] = await db.update(dashboardViews).set(updates).where(eq(dashboardViews.id, viewId)).returning();
  return updatedView;
}

export async function deleteDashboardView(viewId: string): Promise<void> {
  await db.delete(dashboardViews).where(eq(dashboardViews.id, viewId));
}

// ===============================
// ANALYTICS HELPER FUNCTIONS
// ===============================

export async function generateAnalyticsSnapshot(companyId: string): Promise<AnalyticsSnapshot> {
  // Get current company data
  const company = await getCompanyById(companyId);
  if (!company) throw new Error("Company not found");

  // Get insights breakdown
  const insights = await getAIInsightsByCompany(companyId);
  const phases = await getWorkflowPhasesByCompany(companyId);

  const insightCounts = insights.reduce((acc, insight) => {
    acc[insight.type] = (acc[insight.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate performance scores
  const completedPhases = phases.filter(p => p.status === "completed").length;
  const velocityScore = completedPhases > 0 ? (completedPhases / phases.length) * 100 : 0;
  const qualityScore = insights.length > 0 ? (insights.reduce((sum, i) => sum + (i.confidence || 0), 0) / insights.length) * 100 : 0;
  const riskScore = Math.max(0, 100 - (insightCounts.risk || 0) * 10);

  const snapshotData: NewAnalyticsSnapshot = {
    id: generateId(),
    companyId,
    snapshotType: "daily",
    progress: company.progress,
    aiAcceleration: company.aiAcceleration,
    completedPhases,
    totalPhases: phases.length,
    totalInsights: insights.length,
    riskCount: insightCounts.risk || 0,
    opportunityCount: insightCounts.opportunity || 0,
    recommendationCount: insightCounts.recommendation || 0,
    automationCount: insightCounts.automation || 0,
    projectValue: company.projectValue,
    teamSize: parseJSONField(company.teamMembers, []).length,
    velocityScore,
    qualityScore,
    riskScore,
    customMetrics: JSON.stringify({}),
    notes: null,
  };

  return await createAnalyticsSnapshot(snapshotData);
}

export async function getAnalyticsTrends(
  companyId: string,
  days: number = 30
): Promise<{
  snapshots: AnalyticsSnapshot[];
  trends: {
    progress: "improving" | "declining" | "stable";
    velocity: "improving" | "declining" | "stable";
    quality: "improving" | "declining" | "stable";
    risk: "improving" | "declining" | "stable";
  };
}> {
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

  const snapshots = await getAnalyticsSnapshotsInDateRange(companyId, startDate, endDate);

  if (snapshots.length < 2) {
    return {
      snapshots,
      trends: { progress: "stable", velocity: "stable", quality: "stable", risk: "stable" },
    };
  }

  const first = snapshots[0];
  const last = snapshots[snapshots.length - 1];

  const calculateTrend = (startValue: number, endValue: number): "improving" | "declining" | "stable" => {
    const diff = endValue - startValue;
    if (Math.abs(diff) < 5) return "stable";
    return diff > 0 ? "improving" : "declining";
  };

  return {
    snapshots,
    trends: {
      progress: calculateTrend(first.progress, last.progress),
      velocity: calculateTrend(first.velocityScore || 0, last.velocityScore || 0),
      quality: calculateTrend(first.qualityScore || 0, last.qualityScore || 0),
      risk: calculateTrend(first.riskScore || 0, last.riskScore || 0),
    },
  };
}

// ===============================
// UTILITY FUNCTIONS
// ===============================

export function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

export function parseJSONField<T>(field: string | null, defaultValue: T): T {
  if (!field) return defaultValue;
  try {
    return JSON.parse(field);
  } catch {
    return defaultValue;
  }
}

export function stringifyJSONField<T>(value: T): string {
  return JSON.stringify(value);
}

// ===============================
// MIGRATION HELPERS
// ===============================

export async function migrateLocalStorageToDatabase(userId: string): Promise<void> {
  // This function will help migrate existing localStorage data to database
  // Can be called when user first signs in after implementing database
  console.log("Starting localStorage migration for user:", userId);

  if (typeof window === "undefined") return;

  try {
    // Get all localStorage keys that match our patterns
    const storageKeys = Object.keys(localStorage);
    const companyKeys = storageKeys.filter(key => key.startsWith("ai-conversation-"));

    for (const key of companyKeys) {
      const companyId = key.replace("ai-conversation-", "");
      const conversationData = localStorage.getItem(key);

      if (conversationData) {
        try {
          const messages = JSON.parse(conversationData);

          // Check if this company already exists in database
          const existingCompany = await getCompanyById(companyId);
          if (!existingCompany) {
            // Skip if company doesn't exist - we can't migrate without company context
            continue;
          }

          // Check if messages already exist
          const existingMessages = await getChatMessagesByCompany(companyId);
          if (existingMessages.length === 0 && Array.isArray(messages)) {
            // Migrate messages
            const messagesToInsert: NewChatMessage[] = messages.map((msg: any) => ({
              id: msg.id || generateId(),
              companyId: companyId,
              role: msg.role,
              content: msg.content,
              timestamp: new Date(msg.timestamp),
              confidence: msg.confidence || null,
              relatedPhase: msg.relatedPhase || null,
              model: msg.model || null,
              error: msg.error || null,
              fallback: msg.fallback || false,
            }));

            await bulkCreateChatMessages(messagesToInsert);
            console.log(`Migrated ${messagesToInsert.length} messages for company ${companyId}`);
          }
        } catch (error) {
          console.error(`Error migrating conversation for ${companyId}:`, error);
        }
      }
    }

    console.log("LocalStorage migration completed for user:", userId);
  } catch (error) {
    console.error("Error during localStorage migration:", error);
  }
}
