import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getAIInsightsByCompany, getWorkflowPhasesByCompany, getCompanyById, updateCompany, deleteCompany } from "@/lib/db/services";

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

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: companyId } = await params;

    // Verify company belongs to user
    const existingCompany = await getCompanyById(companyId);
    if (!existingCompany || existingCompany.userId !== userId) {
      return NextResponse.json({ error: "Company not found or unauthorized" }, { status: 404 });
    }

    const updateData = await req.json();
    const updatedCompany = await updateCompany(companyId, updateData);

    return NextResponse.json({ company: updatedCompany });
  } catch (error) {
    console.error("Error updating company:", error);
    return NextResponse.json({ error: "Failed to update company" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: companyId } = await params;

    // Verify company belongs to user
    const existingCompany = await getCompanyById(companyId);
    if (!existingCompany || existingCompany.userId !== userId) {
      return NextResponse.json({ error: "Company not found or unauthorized" }, { status: 404 });
    }

    await deleteCompany(companyId);

    return NextResponse.json({ message: "Company deleted successfully" });
  } catch (error) {
    console.error("Error deleting company:", error);
    return NextResponse.json({ error: "Failed to delete company" }, { status: 500 });
  }
}
