import { NextRequest, NextResponse } from "next/server";
import { db, users, companies, aiInsights, chatMessages, workflowPhases, questionnaires, analysisResults, userSessions } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    console.log(`🗑️ Starting cleanup for user: ${email}`);

    // Step 1: Find the user by email
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (!user) {
      return NextResponse.json({
        message: `User with email ${email} not found in database`,
        success: true,
      });
    }

    const userId = user.id;
    console.log(`👤 Found user: ${user.firstName} ${user.lastName} (ID: ${userId})`);

    // Step 2: Get all companies for this user
    const userCompanies = await db.select().from(companies).where(eq(companies.userId, userId));
    const companyIds = userCompanies.map(c => c.id);

    console.log(`🏢 Found ${userCompanies.length} companies for user`);

    // Step 3: Count all child records before deletion for reporting
    let totalInsights = 0;
    let totalMessages = 0;
    let totalPhases = 0;
    let totalQuestionnaires = 0;
    let totalResults = 0;

    for (const companyId of companyIds) {
      const insightsCount = await db.select().from(aiInsights).where(eq(aiInsights.companyId, companyId));
      const messagesCount = await db.select().from(chatMessages).where(eq(chatMessages.companyId, companyId));
      const phasesCount = await db.select().from(workflowPhases).where(eq(workflowPhases.companyId, companyId));
      const questionnairesCount = await db.select().from(questionnaires).where(eq(questionnaires.companyId, companyId));
      const resultsCount = await db.select().from(analysisResults).where(eq(analysisResults.companyId, companyId));

      totalInsights += insightsCount.length;
      totalMessages += messagesCount.length;
      totalPhases += phasesCount.length;
      totalQuestionnaires += questionnairesCount.length;
      totalResults += resultsCount.length;
    }

    // Count user sessions
    const sessionsCount = await db.select().from(userSessions).where(eq(userSessions.userId, userId));
    const totalSessions = sessionsCount.length;

    const deletionReport = {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      companiesDeleted: userCompanies.length,
      childRecordsDeleted: {
        aiInsights: totalInsights,
        chatMessages: totalMessages,
        workflowPhases: totalPhases,
        questionnaires: totalQuestionnaires,
        analysisResults: totalResults,
        userSessions: totalSessions,
      },
    };

    // Step 4: Delete child records for each company
    for (const companyId of companyIds) {
      console.log(`🧹 Cleaning data for company: ${companyId}`);

      // Delete AI Insights
      await db.delete(aiInsights).where(eq(aiInsights.companyId, companyId));

      // Delete Chat Messages
      await db.delete(chatMessages).where(eq(chatMessages.companyId, companyId));

      // Delete Workflow Phases
      await db.delete(workflowPhases).where(eq(workflowPhases.companyId, companyId));

      // Delete Questionnaires
      await db.delete(questionnaires).where(eq(questionnaires.companyId, companyId));

      // Delete Analysis Results
      await db.delete(analysisResults).where(eq(analysisResults.companyId, companyId));
    }

    // Step 5: Delete User Sessions
    await db.delete(userSessions).where(eq(userSessions.userId, userId));

    // Step 6: Delete Companies
    await db.delete(companies).where(eq(companies.userId, userId));

    // Step 7: Delete User
    await db.delete(users).where(eq(users.id, userId));

    console.log(`✅ Successfully cleaned all data for user: ${email}`);

    return NextResponse.json({
      success: true,
      message: `Successfully cleaned all data for user: ${email}`,
      deletionReport,
    });
  } catch (error) {
    console.error("❌ Error during user cleanup:", error);
    return NextResponse.json(
      {
        error: "Failed to cleanup user data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
