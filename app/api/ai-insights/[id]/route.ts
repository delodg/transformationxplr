import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { updateAIInsight, deleteAIInsight, getCompanyById } from "@/lib/db/services";
import { eq } from "drizzle-orm";
import { db, aiInsights } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: insightId } = await params;

    // Get insight to verify ownership via company
    const [insight] = await db.select().from(aiInsights).where(eq(aiInsights.id, insightId)).limit(1);

    if (!insight) {
      return NextResponse.json({ error: "AI insight not found" }, { status: 404 });
    }

    // Verify company belongs to user
    const company = await getCompanyById(insight.companyId);
    if (!company || company.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updateData = await req.json();
    const updatedInsight = await updateAIInsight(insightId, updateData);

    return NextResponse.json({ insight: updatedInsight });
  } catch (error) {
    console.error("Error updating AI insight:", error);
    return NextResponse.json({ error: "Failed to update AI insight" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: insightId } = await params;

    // Get insight to verify ownership via company
    const [insight] = await db.select().from(aiInsights).where(eq(aiInsights.id, insightId)).limit(1);

    if (!insight) {
      return NextResponse.json({ error: "AI insight not found" }, { status: 404 });
    }

    // Verify company belongs to user
    const company = await getCompanyById(insight.companyId);
    if (!company || company.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await deleteAIInsight(insightId);

    return NextResponse.json({ message: "AI insight deleted successfully" });
  } catch (error) {
    console.error("Error deleting AI insight:", error);
    return NextResponse.json({ error: "Failed to delete AI insight" }, { status: 500 });
  }
}
