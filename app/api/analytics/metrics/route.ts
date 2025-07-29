import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { 
  createPerformanceMetric, 
  getPerformanceMetricsByCompany,
  getPerformanceMetricsByType,
  getPerformanceMetricsInPeriod,
  updatePerformanceMetric,
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
    const metricType = searchParams.get("metricType");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!companyId) {
      return NextResponse.json({ error: "Company ID is required" }, { status: 400 });
    }

    let metrics;

    // Get metrics by type
    if (metricType) {
      metrics = await getPerformanceMetricsByType(companyId, metricType);
    }
    // Get metrics in date range
    else if (startDate && endDate) {
      metrics = await getPerformanceMetricsInPeriod(
        companyId, 
        new Date(startDate), 
        new Date(endDate)
      );
    }
    // Get all metrics for company
    else {
      metrics = await getPerformanceMetricsByCompany(companyId);
    }

    // Group metrics by type for easier consumption
    const groupedMetrics = metrics.reduce((acc, metric) => {
      if (!acc[metric.metricType]) {
        acc[metric.metricType] = [];
      }
      acc[metric.metricType].push(metric);
      return acc;
    }, {} as Record<string, any[]>);

    return NextResponse.json({ metrics, groupedMetrics });

  } catch (error) {
    console.error("❌ Performance metrics API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch performance metrics" },
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
      metricType, 
      metricName, 
      metricValue, 
      metricUnit,
      benchmarkValue,
      targetValue,
      calculationMethod,
      dataSource,
      period,
      periodStart,
      periodEnd,
      trend,
      confidence,
      metadata
    } = body;

    if (!companyId || !metricType || !metricName || metricValue === undefined || !period || !periodStart || !periodEnd) {
      return NextResponse.json({ 
        error: "Missing required fields: companyId, metricType, metricName, metricValue, period, periodStart, periodEnd" 
      }, { status: 400 });
    }

    const metricData = {
      id: generateId(),
      companyId,
      metricType,
      metricName,
      metricValue,
      metricUnit: metricUnit || null,
      benchmarkValue: benchmarkValue || null,
      targetValue: targetValue || null,
      calculationMethod: calculationMethod || null,
      dataSource: dataSource || null,
      period,
      periodStart: new Date(periodStart),
      periodEnd: new Date(periodEnd),
      trend: trend || null,
      confidence: confidence || null,
      metadata: metadata ? JSON.stringify(metadata) : null
    };

    const newMetric = await createPerformanceMetric(metricData);
    return NextResponse.json({ metric: newMetric });

  } catch (error) {
    console.error("❌ Create performance metric error:", error);
    return NextResponse.json(
      { error: "Failed to create performance metric" },
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
    const { metricId, ...updates } = body;

    if (!metricId) {
      return NextResponse.json({ error: "Metric ID is required" }, { status: 400 });
    }

    // Convert date strings to Date objects if provided
    if (updates.periodStart) {
      updates.periodStart = new Date(updates.periodStart);
    }
    if (updates.periodEnd) {
      updates.periodEnd = new Date(updates.periodEnd);
    }

    // Stringify metadata if provided
    if (updates.metadata && typeof updates.metadata === 'object') {
      updates.metadata = JSON.stringify(updates.metadata);
    }

    const updatedMetric = await updatePerformanceMetric(metricId, updates);
    return NextResponse.json({ metric: updatedMetric });

  } catch (error) {
    console.error("❌ Update performance metric error:", error);
    return NextResponse.json(
      { error: "Failed to update performance metric" },
      { status: 500 }
    );
  }
}