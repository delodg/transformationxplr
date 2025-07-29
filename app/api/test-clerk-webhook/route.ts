import { NextRequest, NextResponse } from "next/server";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    console.log("🧪 Testing Clerk webhook with realistic payload...");

    // Create a realistic Clerk webhook payload
    const clerkWebhookPayload = {
      data: {
        id: "user_test_" + Date.now(),
        email_addresses: [
          {
            email_address: `test-clerk-${Date.now()}@example.com`,
            id: "idn_test",
            object: "email_address",
            verification: {
              status: "verified",
              strategy: "ticket",
            },
          },
        ],
        first_name: "Test",
        last_name: "User",
        image_url: "https://img.clerk.com/test_image.jpg",
        created_at: Date.now(),
        updated_at: Date.now(),
        object: "user",
        username: null,
        phone_numbers: [],
        web3_wallets: [],
        external_accounts: [],
        saml_accounts: [],
        public_metadata: {},
        private_metadata: {},
        unsafe_metadata: {},
      },
      object: "event",
      type: "user.created",
    };

    console.log("📝 Simulated Clerk payload:", JSON.stringify(clerkWebhookPayload, null, 2));

    // Test the same logic as the real webhook endpoint
    try {
      await db.insert(users).values({
        id: clerkWebhookPayload.data.id,
        email: clerkWebhookPayload.data.email_addresses[0]?.email_address || "",
        firstName: clerkWebhookPayload.data.first_name || null,
        lastName: clerkWebhookPayload.data.last_name || null,
        imageUrl: clerkWebhookPayload.data.image_url || null,
      });

      console.log("✅ User created successfully via webhook simulation");

      // Verify the user was created
      const createdUser = await db.select().from(users).where(eq(users.id, clerkWebhookPayload.data.id));
      console.log("🔍 Verified user in database:", createdUser);

      // Test update functionality
      await db
        .update(users)
        .set({
          firstName: "Updated",
          lastName: "Name",
          updatedAt: new Date(),
        })
        .where(eq(users.id, clerkWebhookPayload.data.id));

      console.log("✅ User updated successfully");

      // Verify the update
      const updatedUser = await db.select().from(users).where(eq(users.id, clerkWebhookPayload.data.id));
      console.log("🔍 Verified user update:", updatedUser);

      // Clean up
      await db.delete(users).where(eq(users.id, clerkWebhookPayload.data.id));
      console.log("🧹 Test user cleaned up");

      return NextResponse.json({
        success: true,
        message: "Clerk webhook simulation successful",
        payload: clerkWebhookPayload,
        createdUser: createdUser[0],
        updatedUser: updatedUser[0],
        timestamp: new Date().toISOString(),
      });
    } catch (dbError) {
      console.error("❌ Database operation failed in webhook simulation:", dbError);
      return NextResponse.json(
        {
          success: false,
          error: "Database operation failed",
          details: dbError instanceof Error ? dbError.message : "Unknown database error",
          payload: clerkWebhookPayload,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("❌ Clerk webhook simulation failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Webhook simulation failed",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check if the webhook endpoint is accessible
    console.log("🔍 Checking webhook endpoint accessibility...");

    return NextResponse.json({
      success: true,
      message: "Clerk webhook test endpoint is accessible",
      endpoints: {
        testClerkWebhook: "/api/test-clerk-webhook",
        realClerkWebhook: "/api/webhooks/clerk",
        testWebhook: "/api/test-webhook",
      },
      environment: {
        webhookSecretExists: !!process.env.CLERK_WEBHOOK_SECRET,
        webhookSecretLength: process.env.CLERK_WEBHOOK_SECRET?.length || 0,
        databaseUrlExists: !!process.env.TURSO_DATABASE_URL,
        authTokenExists: !!process.env.TURSO_AUTH_TOKEN,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Webhook accessibility check failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Webhook accessibility check failed",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
