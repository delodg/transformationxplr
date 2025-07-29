import { db, companies, chatMessages, aiInsights, workflowPhases, questionnaires, analysisResults, userSessions, users } from "./index";
import { eq, and, desc, asc, isNull } from "drizzle-orm";
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
} from "./schema";

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
