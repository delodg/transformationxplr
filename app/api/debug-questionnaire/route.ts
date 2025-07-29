import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ensureUserExists, createCompany } from "@/lib/db/services";

export async function POST(req: NextRequest) {
  console.log("🐛 DEBUG: Questionnaire submission started");

  try {
    // Check authentication
    const { userId } = await auth();
    console.log("🐛 DEBUG: Auth result:", { userId, hasUser: !!userId });

    if (!userId) {
      console.log("🐛 DEBUG: No user - returning 401");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get questionnaire data
    const questionnaireData = await req.json();
    console.log("🐛 DEBUG: Received questionnaire data:", {
      companyName: questionnaireData.companyName,
      industry: questionnaireData.industry,
      hasRequiredFields: !!(questionnaireData.companyName && questionnaireData.industry),
      dataKeys: Object.keys(questionnaireData),
    });

    // Test database connection by ensuring user exists
    console.log("🐛 DEBUG: Testing user creation/verification");
    try {
      const userExists = await ensureUserExists(userId);
      console.log("🐛 DEBUG: User exists result:", userExists);
    } catch (userError) {
      console.log("🐛 DEBUG: User creation failed:", userError);
      return NextResponse.json(
        {
          error: "Database connection failed",
          details: userError instanceof Error ? userError.message : String(userError),
        },
        { status: 500 }
      );
    }

    // Create simplified company data
    const companyData = {
      id: `debug-${Date.now()}`,
      clientName: questionnaireData.companyName,
      industry: questionnaireData.industry,
      engagementType: "Full Transformation",
      status: "initiation" as const,
      progress: 5,
      aiAcceleration: 35, // Mock value
      startDate: new Date().toISOString().split("T")[0],
      estimatedCompletion: `${new Date().getFullYear()}-12-31`,
      teamMembers: JSON.stringify([]),
      hackettIPMatches: 800, // Mock value
      region: questionnaireData.region,
      projectValue: 2500000, // Mock value
      currentPhase: 1,
      revenue: questionnaireData.revenue,
      employees: questionnaireData.employees,
      currentERP: questionnaireData.currentERP,
      painPoints: JSON.stringify(questionnaireData.painPoints || []),
      objectives: JSON.stringify(questionnaireData.objectives || []),
      timeline: questionnaireData.timeline,
      budget: questionnaireData.budget,
      userId: userId,
    };

    console.log("🐛 DEBUG: Attempting company creation with data:", {
      ...companyData,
      painPointsLength: questionnaireData.painPoints?.length || 0,
      objectivesLength: questionnaireData.objectives?.length || 0,
    });

    // Test company creation
    try {
      const newCompany = await createCompany(companyData);
      console.log("🐛 DEBUG: Company created successfully:", {
        id: newCompany.id,
        clientName: newCompany.clientName,
      });

      return NextResponse.json({
        success: true,
        company: newCompany,
        debug: {
          userExists: true,
          databaseConnected: true,
          questionnaireProcessed: true,
        },
      });
    } catch (dbError) {
      console.log("🐛 DEBUG: Company creation failed:", dbError);
      return NextResponse.json(
        {
          error: "Company creation failed",
          details: dbError instanceof Error ? dbError.message : String(dbError),
          debug: {
            userExists: true,
            databaseConnected: false,
            questionnaireProcessed: true,
          },
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.log("🐛 DEBUG: General error:", error);
    return NextResponse.json(
      {
        error: "Debug test failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
