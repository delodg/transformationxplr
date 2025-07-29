import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAIInsight, getAIInsightsByCompany, bulkCreateAIInsights, getCompanyById } from "@/lib/db/services";
import { generateId } from "@/lib/db/services";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");

    if (!companyId) {
      return NextResponse.json({ error: "Company ID is required" }, { status: 400 });
    }

    // Verify company belongs to user
    const company = await getCompanyById(companyId);
    if (!company || company.userId !== userId) {
      return NextResponse.json({ error: "Company not found or unauthorized" }, { status: 404 });
    }

    const insights = await getAIInsightsByCompany(companyId);
    return NextResponse.json({ insights });
  } catch (error) {
    console.error("Error fetching AI insights:", error);
    return NextResponse.json({ error: "Failed to fetch AI insights" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requestData = await req.json();

    // Check if it's a single insight or bulk creation
    if (Array.isArray(requestData.insights)) {
      // Bulk creation
      const { companyId, insights } = requestData;

      // Verify company belongs to user
      const company = await getCompanyById(companyId);
      if (!company || company.userId !== userId) {
        return NextResponse.json({ error: "Company not found or unauthorized" }, { status: 404 });
      }

      const insightsWithIds = insights.map((insight: any) => ({
        ...insight,
        id: insight.id || generateId(),
        companyId,
      }));

      const newInsights = await bulkCreateAIInsights(insightsWithIds);
      return NextResponse.json({ insights: newInsights });
    } else {
      // Single insight creation
      const { companyId, ...insightData } = requestData;

      // Verify company belongs to user
      const company = await getCompanyById(companyId);
      if (!company || company.userId !== userId) {
        return NextResponse.json({ error: "Company not found or unauthorized" }, { status: 404 });
      }

      const newInsight = await createAIInsight({
        ...insightData,
        id: generateId(),
        companyId,
      });
      return NextResponse.json({ insight: newInsight });
    }
  } catch (error) {
    console.error("Error creating AI insight:", error);
    return NextResponse.json({ error: "Failed to create AI insight" }, { status: 500 });
  }
}
