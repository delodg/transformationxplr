import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createQuestionnaire, getQuestionnairesByCompany, getCompanyById } from "@/lib/db/services";
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

    const questionnaires = await getQuestionnairesByCompany(companyId, type || undefined);
    return NextResponse.json({ questionnaires });
  } catch (error) {
    console.error("Error fetching questionnaires:", error);
    return NextResponse.json({ error: "Failed to fetch questionnaires" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { companyId, type, data, completedAt } = await req.json();

    // Verify company belongs to user
    const company = await getCompanyById(companyId);
    if (!company || company.userId !== userId) {
      return NextResponse.json({ error: "Company not found or unauthorized" }, { status: 404 });
    }

    await createQuestionnaire({
      id: generateId(),
      companyId,
      type,
      data: typeof data === "string" ? data : JSON.stringify(data),
      completedAt: completedAt ? new Date(completedAt) : null,
    });

    return NextResponse.json({ message: "Questionnaire created successfully" });
  } catch (error) {
    console.error("Error creating questionnaire:", error);
    return NextResponse.json({ error: "Failed to create questionnaire" }, { status: 500 });
  }
}
