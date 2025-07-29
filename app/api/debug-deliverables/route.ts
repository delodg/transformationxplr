import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { workflowPhases, companies } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all companies for this user
    const userCompanies = await db.select().from(companies).where(eq(companies.userId, userId));

    console.log(`🔍 Found ${userCompanies.length} companies for user ${userId}`);

    const result = [];

    for (const company of userCompanies) {
      const phases = await db.select().from(workflowPhases).where(eq(workflowPhases.companyId, company.id));

      console.log(`📊 Company ${company.clientName} has ${phases.length} phases`);

      const companyData = {
        companyId: company.id,
        companyName: company.clientName,
        phases: phases.map(phase => ({
          id: phase.id,
          phaseNumber: phase.phaseNumber,
          title: phase.title,
          deliverables: phase.deliverables,
          deliverablesType: typeof phase.deliverables,
          deliverablesLength: phase.deliverables ? phase.deliverables.length : 0,
          parsedDeliverables: (() => {
            try {
              return JSON.parse(phase.deliverables || "[]");
            } catch (error) {
              return `Parse error: ${error instanceof Error ? error.message : "Unknown error"}`;
            }
          })(),
        })),
      };

      result.push(companyData);
    }

    return NextResponse.json({ debug: result });
  } catch (error) {
    console.error("❌ Debug deliverables error:", error);
    return NextResponse.json({ error: "Failed to debug deliverables" }, { status: 500 });
  }
}
