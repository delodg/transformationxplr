import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getCompanyById } from "@/lib/db/services";
import { eq } from "drizzle-orm";
import { db, questionnaires } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: questionnaireId } = await params;

    // Get questionnaire to verify ownership via company
    const [questionnaire] = await db.select().from(questionnaires).where(eq(questionnaires.id, questionnaireId)).limit(1);

    if (!questionnaire) {
      return NextResponse.json({ error: "Questionnaire not found" }, { status: 404 });
    }

    // Verify company belongs to user
    const company = await getCompanyById(questionnaire.companyId);
    if (!company || company.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updateData = await req.json();

    // Prepare update fields
    const updateFields: any = {};
    if (updateData.type) updateFields.type = updateData.type;
    if (updateData.data) updateFields.data = typeof updateData.data === "string" ? updateData.data : JSON.stringify(updateData.data);
    if (updateData.completedAt !== undefined) updateFields.completedAt = updateData.completedAt ? new Date(updateData.completedAt) : null;

    const [updatedQuestionnaire] = await db.update(questionnaires).set(updateFields).where(eq(questionnaires.id, questionnaireId)).returning();

    return NextResponse.json({ questionnaire: updatedQuestionnaire });
  } catch (error) {
    console.error("Error updating questionnaire:", error);
    return NextResponse.json({ error: "Failed to update questionnaire" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: questionnaireId } = await params;

    // Get questionnaire to verify ownership via company
    const [questionnaire] = await db.select().from(questionnaires).where(eq(questionnaires.id, questionnaireId)).limit(1);

    if (!questionnaire) {
      return NextResponse.json({ error: "Questionnaire not found" }, { status: 404 });
    }

    // Verify company belongs to user
    const company = await getCompanyById(questionnaire.companyId);
    if (!company || company.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await db.delete(questionnaires).where(eq(questionnaires.id, questionnaireId));

    return NextResponse.json({ message: "Questionnaire deleted successfully" });
  } catch (error) {
    console.error("Error deleting questionnaire:", error);
    return NextResponse.json({ error: "Failed to delete questionnaire" }, { status: 500 });
  }
}
