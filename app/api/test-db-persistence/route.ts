import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { 
  companies, 
  aiInsights, 
  workflowPhases, 
  chatMessages, 
  questionnaires, 
  analysisResults,
  userSessions 
} from "@/lib/db/schema";
import { 
  createCompany, 
  createAIInsight, 
  createWorkflowPhase, 
  createChatMessage,
  createQuestionnaire,
  createAnalysisResult,
  createUserSession,
  getCompaniesByUser,
  getAIInsightsByCompany,
  getWorkflowPhasesByCompany,
  getChatMessagesByCompany,
  ensureUserExists,
  generateId
} from "@/lib/db/services";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const testResults = {
      databaseConnection: false,
      userCreation: false,
      companyCreation: false,
      aiInsightsCreation: false,
      workflowPhasesCreation: false,
      chatMessagesCreation: false,
      questionnairesCreation: false,
      analysisResultsCreation: false,
      userSessionsCreation: false,
      dataRetrieval: false,
      errors: [] as string[],
      testData: {} as any
    };

    console.log("🧪 Starting comprehensive database persistence test...");

    // Test 1: Database Connection
    try {
      await db.select().from(companies).limit(1);
      testResults.databaseConnection = true;
      console.log("✅ Database connection successful");
    } catch (error) {
      testResults.errors.push(`Database connection failed: ${error}`);
      console.error("❌ Database connection failed:", error);
    }

    // Test 2: User Creation/Verification
    try {
      const userExists = await ensureUserExists(userId);
      testResults.userCreation = userExists;
      console.log(`✅ User creation/verification: ${userExists}`);
    } catch (error) {
      testResults.errors.push(`User creation failed: ${error}`);
      console.error("❌ User creation failed:", error);
    }

    // Test 3: Company Creation
    const testCompanyId = `test-company-${generateId()}`;
    try {
      const testCompany = await createCompany({
        id: testCompanyId,
        userId: userId,
        clientName: "Test Company for DB Verification",
        industry: "Technology",
        engagementType: "Full Transformation",
        status: "initiation",
        progress: 25,
        aiAcceleration: 15,
        startDate: "2025-01-15",
        estimatedCompletion: "2025-06-15",
        region: "North America",
        currentPhase: 2,
        revenue: "$10M-$50M",
        employees: "100-500",
        currentERP: "NetSuite",
        painPoints: JSON.stringify(["Manual processes", "Lack of automation"]),
        objectives: JSON.stringify(["Accelerate month-end close", "Improve accuracy"]),
        timeline: "6 months",
        budget: "$500K-$1M",
        teamMembers: JSON.stringify([]),
        projectValue: 750000,
        hackettIPMatches: 12
      });

      testResults.companyCreation = !!testCompany;
      testResults.testData.company = testCompany;
      console.log("✅ Company creation successful");
    } catch (error) {
      testResults.errors.push(`Company creation failed: ${error}`);
      console.error("❌ Company creation failed:", error);
    }

    // Test 4: AI Insights Creation
    if (testResults.companyCreation) {
      try {
        const testInsight = await createAIInsight({
          id: generateId(),
          companyId: testCompanyId,
          type: "recommendation",
          title: "Test AI Insight",
          description: "This is a test insight to verify database persistence",
          confidence: 0.85,
          impact: "high",
          source: "AI Analysis",
          phase: 2,
          actionable: true,
          estimatedValue: 50000,
          timeframe: "3 months",
          dependencies: JSON.stringify(["Phase 1 completion", "Stakeholder approval"]),
          recommendations: JSON.stringify(["Implement automation", "Train team"])
        });

        testResults.aiInsightsCreation = !!testInsight;
        testResults.testData.insight = testInsight;
        console.log("✅ AI Insights creation successful");
      } catch (error) {
        testResults.errors.push(`AI Insights creation failed: ${error}`);
        console.error("❌ AI Insights creation failed:", error);
      }
    }

    // Test 5: Workflow Phases Creation
    if (testResults.companyCreation) {
      try {
        const testPhase = await createWorkflowPhase({
          id: generateId(),
          companyId: testCompanyId,
          phaseNumber: 1,
          title: "Test Phase - Project Initiation",
          description: "Test phase for database verification",
          status: "completed",
          aiAcceleration: 50,
          duration: "2 weeks",
          traditionalDuration: "4 weeks",
          hackettIP: JSON.stringify(["Client Profiling Templates", "Industry Benchmarks"]),
          deliverables: JSON.stringify(["Client intelligence profile", "SOW analysis", "Data collection plan"]),
          aiSuggestions: JSON.stringify(["Auto-populated client profile", "Recommended data collection approach"]),
          keyActivities: JSON.stringify(["Client onboarding", "Engagement type selection", "Document upload"]),
          dependencies: JSON.stringify(["Previous phase completion", "Stakeholder availability"]),
          teamRole: JSON.stringify(["Project Manager", "Business Analyst"]),
          clientTasks: JSON.stringify(["Provide required documentation", "Assign dedicated resources"]),
          progress: 100,
          estimatedCompletion: "2025-01-29",
          riskFactors: JSON.stringify(["Resource availability constraints", "Stakeholder alignment challenges"]),
          successMetrics: JSON.stringify(["Phase completion within timeline", "Stakeholder satisfaction > 85%"])
        });

        testResults.workflowPhasesCreation = !!testPhase;
        testResults.testData.phase = testPhase;
        console.log("✅ Workflow Phases creation successful");
      } catch (error) {
        testResults.errors.push(`Workflow Phases creation failed: ${error}`);
        console.error("❌ Workflow Phases creation failed:", error);
      }
    }

    // Test 6: Chat Messages Creation
    if (testResults.companyCreation) {
      try {
        const testMessage = await createChatMessage({
          id: generateId(),
          companyId: testCompanyId,
          role: "assistant",
          content: "This is a test chat message to verify database persistence",
          timestamp: new Date(),
          confidence: 0.9,
          relatedPhase: 1,
          model: "claude-sonnet-4-20250514",
          fallback: false
        });

        testResults.chatMessagesCreation = !!testMessage;
        testResults.testData.message = testMessage;
        console.log("✅ Chat Messages creation successful");
      } catch (error) {
        testResults.errors.push(`Chat Messages creation failed: ${error}`);
        console.error("❌ Chat Messages creation failed:", error);
      }
    }

    // Test 7: Questionnaires Creation
    if (testResults.companyCreation) {
      try {
        await createQuestionnaire({
          id: generateId(),
          companyId: testCompanyId,
          type: "onboarding",
          data: JSON.stringify({
            companyName: "Test Company",
            industry: "Technology",
            responses: ["Response 1", "Response 2"]
          }),
          completedAt: new Date()
        });

        testResults.questionnairesCreation = true;
        console.log("✅ Questionnaires creation successful");
      } catch (error) {
        testResults.errors.push(`Questionnaires creation failed: ${error}`);
        console.error("❌ Questionnaires creation failed:", error);
      }
    }

    // Test 8: Analysis Results Creation
    if (testResults.companyCreation) {
      try {
        await createAnalysisResult({
          id: generateId(),
          companyId: testCompanyId,
          type: "gap-analysis",
          title: "Test Gap Analysis",
          results: JSON.stringify({
            gaps: ["Process inefficiency", "Technology limitations"],
            recommendations: ["Implement automation", "Upgrade systems"],
            priority: "high"
          }),
          confidence: 0.88,
          generatedBy: "ai",
          phase: 2,
          status: "active"
        });

        testResults.analysisResultsCreation = true;
        console.log("✅ Analysis Results creation successful");
      } catch (error) {
        testResults.errors.push(`Analysis Results creation failed: ${error}`);
        console.error("❌ Analysis Results creation failed:", error);
      }
    }

    // Test 9: User Sessions Creation
    try {
      await createUserSession({
        id: generateId(),
        userId: userId,
        companyId: testCompanyId,
        sessionData: JSON.stringify({
          preferences: { theme: "light", language: "en" },
          context: { currentTab: "workflow", lastAction: "create_company" }
        }),
        startedAt: new Date(),
        lastActivity: new Date()
      });

      testResults.userSessionsCreation = true;
      console.log("✅ User Sessions creation successful");
    } catch (error) {
      testResults.errors.push(`User Sessions creation failed: ${error}`);
      console.error("❌ User Sessions creation failed:", error);
    }

    // Test 10: Data Retrieval
    if (testResults.companyCreation) {
      try {
        const companies = await getCompaniesByUser(userId);
        const insights = await getAIInsightsByCompany(testCompanyId);
        const phases = await getWorkflowPhasesByCompany(testCompanyId);
        const messages = await getChatMessagesByCompany(testCompanyId);

        const retrievalSuccess = companies.length > 0 && 
                                insights.length > 0 && 
                                phases.length > 0 && 
                                messages.length > 0;

        testResults.dataRetrieval = retrievalSuccess;
        testResults.testData.retrieval = {
          companiesCount: companies.length,
          insightsCount: insights.length,
          phasesCount: phases.length,
          messagesCount: messages.length
        };
        console.log(`✅ Data retrieval successful: ${JSON.stringify(testResults.testData.retrieval)}`);
      } catch (error) {
        testResults.errors.push(`Data retrieval failed: ${error}`);
        console.error("❌ Data retrieval failed:", error);
      }
    }

    // Clean up test data
    try {
      if (testResults.companyCreation) {
        await db.delete(companies).where(eq(companies.id, testCompanyId));
        console.log("🧹 Test data cleaned up");
      }
    } catch (error) {
      console.warn("⚠️ Test data cleanup failed:", error);
    }

    const overallSuccess = Object.values(testResults)
      .slice(0, -2) // Exclude errors and testData arrays
      .every(result => result === true);

    console.log(`🎯 Database persistence test completed. Overall success: ${overallSuccess}`);

    return NextResponse.json({
      success: overallSuccess,
      results: testResults,
      summary: {
        totalTests: 10,
        passed: Object.values(testResults).slice(0, -2).filter(Boolean).length,
        failed: testResults.errors.length
      }
    });

  } catch (error) {
    console.error("❌ Database persistence test failed:", error);
    return NextResponse.json({ 
      error: "Database persistence test failed", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}