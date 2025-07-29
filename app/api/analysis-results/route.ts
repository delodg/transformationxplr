import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAnalysisResult, getAnalysisResultsByCompany, getCompanyById } from "@/lib/db/services";
import { generateId } from "@/lib/db/services";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");
    const type = searchParams.get("type");

    if (!companyId) {
      return NextResponse.json({ error: "Company ID is required" }, { status: 400 });
    }

    // Verify company belongs to user
    const company = await getCompanyById(companyId);
    if (!company || company.userId !== userId) {
      return NextResponse.json({ error: "Company not found or unauthorized" }, { status: 404 });
    }

    const analysisResults = await getAnalysisResultsByCompany(companyId, type || undefined);
    return NextResponse.json({ analysisResults });
  } catch (error) {
    console.error("Error fetching analysis results:", error);
    return NextResponse.json({ error: "Failed to fetch analysis results" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { companyId, type, title, results, confidence, generatedBy, phase, status } = await req.json();

    // Verify company belongs to user
    const company = await getCompanyById(companyId);
    if (!company || company.userId !== userId) {
      return NextResponse.json({ error: "Company not found or unauthorized" }, { status: 404 });
    }

    await createAnalysisResult({
      id: generateId(),
      companyId,
      type,
      title,
      results: typeof results === "string" ? results : JSON.stringify(results),
      confidence: confidence || null,
      generatedBy: generatedBy || null,
      phase: phase || null,
      status: status || "active",
    });

    return NextResponse.json({ message: "Analysis result created successfully" });
  } catch (error) {
    console.error("Error creating analysis result:", error);
    return NextResponse.json({ error: "Failed to create analysis result" }, { status: 500 });
  }
}
