import { NextRequest, NextResponse } from "next/server";
import { db, users } from "@/lib/db";

export async function GET() {
  try {
    // Test database connection
    const userCount = await db.select().from(users).limit(1);

    return NextResponse.json({
      status: "Database connection successful",
      webhook_url: "https://transformationxplr.vercel.app/api/webhooks/clerk",
      database_ready: true,
      user_table_accessible: true,
    });
  } catch (error) {
    console.error("Database test failed:", error);

    return NextResponse.json(
      {
        status: "Database connection failed",
        webhook_url: "https://transformationxplr.vercel.app/api/webhooks/clerk",
        database_ready: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json({
    message: "Test webhook endpoint is working",
    timestamp: new Date().toISOString(),
  });
}
