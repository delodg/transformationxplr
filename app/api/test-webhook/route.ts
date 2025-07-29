import { NextRequest, NextResponse } from "next/server";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    console.log("🧪 Testing webhook functionality...");

    // Create a test user payload similar to what Clerk would send
    const testUserPayload = {
      data: {
        id: `test_webhook_${Date.now()}`,
        email_addresses: [{
          email_address: `test-webhook-${Date.now()}@example.com`
        }],
        first_name: "Webhook",
        last_name: "Test",
        image_url: "https://example.com/avatar.jpg"
      },
      type: "user.created"
    };

    console.log("📝 Test user payload:", testUserPayload);

    // Test database connection first
    console.log("🔍 Testing database connection...");
    
    try {
      // Try to insert the test user
      await db.insert(users).values({
        id: testUserPayload.data.id,
        email: testUserPayload.data.email_addresses[0].email_address,
        firstName: testUserPayload.data.first_name,
        lastName: testUserPayload.data.last_name,
        imageUrl: testUserPayload.data.image_url,
      });
      
      console.log("✅ Test user created successfully");

      // Verify the user was created by querying it back
      const createdUser = await db.select().from(users).where(eq(users.id, testUserPayload.data.id));
      console.log("🔍 Verified user in database:", createdUser);

      // Clean up - delete the test user
      await db.delete(users).where(eq(users.id, testUserPayload.data.id));
      console.log("🧹 Test user cleaned up");

      return NextResponse.json({
        success: true,
        message: "Webhook test successful - database connection working",
        testPayload: testUserPayload,
        createdUser: createdUser[0],
        timestamp: new Date().toISOString()
      });

    } catch (dbError) {
      console.error("❌ Database operation failed:", dbError);
      return NextResponse.json({
        success: false,
        error: "Database operation failed",
        details: dbError instanceof Error ? dbError.message : "Unknown database error",
        testPayload: testUserPayload,
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

  } catch (error) {
    console.error("❌ Webhook test failed:", error);
    return NextResponse.json({
      success: false,
      error: "Webhook test failed",
      details: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Simple health check...");
    
    // Basic environment check
    const envCheck = {
      databaseUrlExists: !!process.env.TURSO_DATABASE_URL,
      authTokenExists: !!process.env.TURSO_AUTH_TOKEN,
      webhookSecretExists: !!process.env.CLERK_WEBHOOK_SECRET,
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    };

    console.log("🔧 Environment status:", envCheck);

    return NextResponse.json({
      success: true,
      message: "Test webhook endpoint is accessible",
      environment: envCheck,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("❌ Health check failed:", error);
    return NextResponse.json({
      success: false,
      error: "Health check failed",
      details: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
