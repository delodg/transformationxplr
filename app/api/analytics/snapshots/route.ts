import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { 
  createAnalyticsSnapshot, 
  getAnalyticsSnapshotsByCompany,
  getAnalyticsSnapshotsInDateRange,
  generateAnalyticsSnapshot,
  getAnalyticsTrends
} from "@/lib/db/services";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const action = searchParams.get("action");

    if (!companyId) {
      return NextResponse.json({ error: "Company ID is required" }, { status: 400 });
    }

    // Get analytics trends
    if (action === "trends") {
      const days = parseInt(searchParams.get("days") || "30");
      const trends = await getAnalyticsTrends(companyId, days);
      return NextResponse.json(trends);
    }

    // Get snapshots with optional date range
    let snapshots;
    if (startDate && endDate) {
      snapshots = await getAnalyticsSnapshotsInDateRange(
        companyId, 
        new Date(startDate), 
        new Date(endDate)
      );
    } else {
      snapshots = await getAnalyticsSnapshotsByCompany(companyId);
    }

    return NextResponse.json({ snapshots });

  } catch (error) {
    console.error("❌ Analytics snapshots API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics snapshots" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { companyId, action } = body;

    if (!companyId) {
      return NextResponse.json({ error: "Company ID is required" }, { status: 400 });
    }

    // Generate a new analytics snapshot
    if (action === "generate") {
      const snapshot = await generateAnalyticsSnapshot(companyId);
      return NextResponse.json({ snapshot });
    }

    // Create a custom snapshot
    const snapshot = await createAnalyticsSnapshot(body);
    return NextResponse.json({ snapshot });

  } catch (error) {
    console.error("❌ Create analytics snapshot error:", error);
    return NextResponse.json(
      { error: "Failed to create analytics snapshot" },
      { status: 500 }
    );
  }
}