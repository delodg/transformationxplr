import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getCompaniesByUser, getAIInsightsByCompany, getWorkflowPhasesByCompany } from "@/lib/db/services";
import { db } from "@/lib/db";
import { companies } from "@/lib/db/schema";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("🐛 DEBUG: AI Flow Test for user:", userId);

    // 1. Get all companies for the user
    const companies = await getCompaniesByUser(userId);
    console.log("🐛 DEBUG: Found companies:", companies.length);

    const debugData: any = {
      userId,
      totalCompanies: companies.length,
      companies: [],
    };

    // 2. For each company, get insights and phases
    for (const company of companies) {
      console.log(`🐛 DEBUG: Checking company ${company.id} (${company.clientName})`);

      const insights = await getAIInsightsByCompany(company.id);
      const phases = await getWorkflowPhasesByCompany(company.id);

      console.log(`🐛 DEBUG: Company ${company.clientName} has ${insights.length} insights and ${phases.length} phases`);

      debugData.companies.push({
        id: company.id,
        clientName: company.clientName,
        status: company.status,
        progress: company.progress,
        aiAcceleration: company.aiAcceleration,
        hackettIPMatches: company.hackettIPMatches,
        projectValue: company.projectValue,
        insightsCount: insights.length,
        phasesCount: phases.length,
        insights: insights.map(insight => ({
          id: insight.id,
          type: insight.type,
          title: insight.title,
          description: insight.description?.substring(0, 100) + "...",
          confidence: insight.confidence,
          impact: insight.impact,
          phase: insight.phase,
          createdAt: insight.createdAt,
        })),
        phases: phases.map(phase => ({
          id: phase.id,
          phaseNumber: phase.phaseNumber,
          title: phase.title,
          status: phase.status,
          progress: phase.progress,
          createdAt: phase.createdAt,
        })),
      });
    }

    // 3. Summary statistics
    const totalInsights = debugData.companies.reduce((sum: number, c: any) => sum + c.insightsCount, 0);
    const totalPhases = debugData.companies.reduce((sum: number, c: any) => sum + c.phasesCount, 0);

    debugData.summary = {
      totalInsights,
      totalPhases,
      companiesWithInsights: debugData.companies.filter((c: any) => c.insightsCount > 0).length,
      companiesWithPhases: debugData.companies.filter((c: any) => c.phasesCount > 0).length,
    };

    console.log("🐛 DEBUG: Summary:", debugData.summary);

    return NextResponse.json({
      success: true,
      message: "AI Flow Debug Complete",
      data: debugData,
    });
  } catch (error) {
    console.error("🐛 DEBUG: Error in AI flow debug:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Debug failed",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // List all companies for testing
    const allCompanies = await db
      .select({
        id: companies.id,
        clientName: companies.clientName,
        industry: companies.industry,
        status: companies.status,
        createdAt: companies.createdAt,
      })
      .from(companies)
      .limit(10);

    return NextResponse.json({
      success: true,
      message: "Debug AI Flow Test Endpoint",
      companies: allCompanies,
      instructions: {
        test: "POST /api/debug-ai-flow with { companyId: 'company_id_here' }",
        purpose: "Test the complete AI analysis flow from generation to dashboard display",
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error listing companies:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to list companies",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
