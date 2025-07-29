import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { 
  createDashboardExport, 
  getDashboardExportsByUser,
  getDashboardExportsByCompany,
  updateDashboardExport,
  incrementExportDownloadCount,
  generateId
} from "@/lib/db/services";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");

    let exports;
    if (companyId) {
      exports = await getDashboardExportsByCompany(companyId);
    } else {
      exports = await getDashboardExportsByUser(userId);
    }

    return NextResponse.json({ exports });

  } catch (error) {
    console.error("❌ Dashboard exports API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard exports" },
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
    const { 
      companyId, 
      exportType, 
      exportFormat, 
      fileName,
      fileSize,
      includeCharts = true,
      includeInsights = true,
      includePhases = true,
      dateRange = null,
      filters = null
    } = body;

    if (!companyId || !exportType || !exportFormat || !fileName) {
      return NextResponse.json({ 
        error: "Missing required fields: companyId, exportType, exportFormat, fileName" 
      }, { status: 400 });
    }

    const exportData = {
      id: generateId(),
      userId,
      companyId,
      exportType,
      fileName,
      fileSize: fileSize || null,
      exportFormat,
      includeCharts,
      includeInsights,
      includePhases,
      dateRange: dateRange ? JSON.stringify(dateRange) : null,
      filters: filters ? JSON.stringify(filters) : null,
      status: "completed" as const,
      errorMessage: null,
      downloadCount: 0,
      lastDownloaded: null,
      expiresAt: null
    };

    const newExport = await createDashboardExport(exportData);
    return NextResponse.json({ export: newExport });

  } catch (error) {
    console.error("❌ Create dashboard export error:", error);
    return NextResponse.json(
      { error: "Failed to create dashboard export record" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { exportId, action, ...updates } = body;

    if (!exportId) {
      return NextResponse.json({ error: "Export ID is required" }, { status: 400 });
    }

    let updatedExport;

    if (action === "download") {
      updatedExport = await incrementExportDownloadCount(exportId);
    } else {
      updatedExport = await updateDashboardExport(exportId, updates);
    }

    return NextResponse.json({ export: updatedExport });

  } catch (error) {
    console.error("❌ Update dashboard export error:", error);
    return NextResponse.json(
      { error: "Failed to update dashboard export" },
      { status: 500 }
    );
  }
}