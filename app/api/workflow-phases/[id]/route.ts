import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { updateWorkflowPhase, getCompanyById } from "@/lib/db/services";
import { eq } from "drizzle-orm";
import { db, workflowPhases } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: phaseId } = await params;

    // Get phase to verify ownership via company
    const [phase] = await db.select().from(workflowPhases).where(eq(workflowPhases.id, phaseId)).limit(1);

    if (!phase) {
      return NextResponse.json({ error: "Workflow phase not found" }, { status: 404 });
    }

    // Verify company belongs to user
    const company = await getCompanyById(phase.companyId);
    if (!company || company.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updateData = await req.json();
    const updatedPhase = await updateWorkflowPhase(phaseId, updateData);

    return NextResponse.json({ phase: updatedPhase });
  } catch (error) {
    console.error("Error updating workflow phase:", error);
    return NextResponse.json({ error: "Failed to update workflow phase" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: phaseId } = await params;

    // Get phase to verify ownership via company
    const [phase] = await db.select().from(workflowPhases).where(eq(workflowPhases.id, phaseId)).limit(1);

    if (!phase) {
      return NextResponse.json({ error: "Workflow phase not found" }, { status: 404 });
    }

    // Verify company belongs to user
    const company = await getCompanyById(phase.companyId);
    if (!company || company.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await db.delete(workflowPhases).where(eq(workflowPhases.id, phaseId));

    return NextResponse.json({ message: "Workflow phase deleted successfully" });
  } catch (error) {
    console.error("Error deleting workflow phase:", error);
    return NextResponse.json({ error: "Failed to delete workflow phase" }, { status: 500 });
  }
}
