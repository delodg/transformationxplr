import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getAIInsightsByCompany, getWorkflowPhasesByCompany } from "@/lib/db/services";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: companyId } = await params;

    // Get AI insights and workflow phases for the company
    const [insights, phases] = await Promise.all([getAIInsightsByCompany(companyId), getWorkflowPhasesByCompany(companyId)]);

    return NextResponse.json({
      insights,
      phases,
    });
  } catch (error) {
    console.error("Error fetching company data:", error);
    return NextResponse.json({ error: "Failed to fetch company data" }, { status: 500 });
  }
}
