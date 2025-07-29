import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createWorkflowPhase, getWorkflowPhasesByCompany, bulkCreateWorkflowPhases, getCompanyById } from "@/lib/db/services";
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

    const phases = await getWorkflowPhasesByCompany(companyId);
    return NextResponse.json({ phases });
  } catch (error) {
    console.error("Error fetching workflow phases:", error);
    return NextResponse.json({ error: "Failed to fetch workflow phases" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requestData = await req.json();

    // Check if it's a single phase or bulk creation
    if (Array.isArray(requestData.phases)) {
      // Bulk creation
      const { companyId, phases } = requestData;

      // Verify company belongs to user
      const company = await getCompanyById(companyId);
      if (!company || company.userId !== userId) {
        return NextResponse.json({ error: "Company not found or unauthorized" }, { status: 404 });
      }

      const phasesWithIds = phases.map((phase: any) => ({
        ...phase,
        id: phase.id || generateId(),
        companyId,
      }));

      const newPhases = await bulkCreateWorkflowPhases(phasesWithIds);
      return NextResponse.json({ phases: newPhases });
    } else {
      // Single phase creation
      const { companyId, ...phaseData } = requestData;

      // Verify company belongs to user
      const company = await getCompanyById(companyId);
      if (!company || company.userId !== userId) {
        return NextResponse.json({ error: "Company not found or unauthorized" }, { status: 404 });
      }

      const newPhase = await createWorkflowPhase({
        ...phaseData,
        id: generateId(),
        companyId,
      });
      return NextResponse.json({ phase: newPhase });
    }
  } catch (error) {
    console.error("Error creating workflow phase:", error);
    return NextResponse.json({ error: "Failed to create workflow phase" }, { status: 500 });
  }
}
