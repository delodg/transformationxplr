import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createCompany, getCompaniesByUser, updateCompany, getAIInsightsByCompany, getWorkflowPhasesByCompany, ensureUserExists } from "@/lib/db/services";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const companies = await getCompaniesByUser(userId);
    return NextResponse.json({ companies });
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure user exists in database before creating company
    console.log(`Attempting to ensure user ${userId} exists before creating company`);
    const userExists = await ensureUserExists(userId);

    if (!userExists) {
      console.error(`Failed to create or verify user ${userId} - attempting company creation anyway`);
      // We'll still try to create the company in case there's a timing issue
    } else {
      console.log(`User ${userId} confirmed to exist, proceeding with company creation`);
    }

    const companyData = await req.json();

    // Add additional logging for debugging
    console.log(`Creating company for user ${userId} with data:`, {
      ...companyData,
      userId,
      // Don't log sensitive data, just structure
      hasRequiredFields: !!(companyData.clientName && companyData.industry),
    });

    const newCompany = await createCompany({ ...companyData, userId });

    return NextResponse.json({ company: newCompany });
  } catch (error) {
    console.error("Error creating company:", error);
    return NextResponse.json({ error: "Failed to create company" }, { status: 500 });
  }
}
