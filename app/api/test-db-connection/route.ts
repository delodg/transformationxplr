import { NextRequest, NextResponse } from "next/server";
import { db, users } from "@/lib/db";
import { eq, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Testing database connection...");

    // Test 1: Basic connection test
    const basicTest = await db
      .select({ test: sql`1` })
      .from(users)
      .limit(1);
    console.log("✅ Basic connection test passed:", basicTest);

    // Test 2: Count existing users
    const userCount = await db.select({ count: sql<number>`count(*)` }).from(users);
    console.log("👥 Current user count:", userCount);

    // Test 3: Get sample of existing users (limit 3)
    const sampleUsers = await db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(users.createdAt)
      .limit(3);
    console.log("📝 Sample users:", sampleUsers);

    // Test 4: Environment variables check
    const envCheck = {
      databaseUrlExists: !!process.env.TURSO_DATABASE_URL,
      authTokenExists: !!process.env.TURSO_AUTH_TOKEN,
      webhookSecretExists: !!process.env.CLERK_WEBHOOK_SECRET,
      clerkSecretExists: !!process.env.CLERK_SECRET_KEY,
      databaseUrl: process.env.TURSO_DATABASE_URL ? process.env.TURSO_DATABASE_URL.substring(0, 30) + "..." : "NOT_SET",
    };
    console.log("🔧 Environment check:", envCheck);

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      tests: {
        basicConnection: basicTest,
        userCount: userCount[0],
        sampleUsers: sampleUsers,
        environment: envCheck,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Database connection test failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Database connection failed",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { testUserId, testEmail } = await request.json();

    console.log("🧪 Testing user creation...");

    // Test inserting a test user
    const testUser = {
      id: testUserId || `test_${Date.now()}`,
      email: testEmail || `test${Date.now()}@example.com`,
      firstName: "Test",
      lastName: "User",
      imageUrl: null,
    };

    await db.insert(users).values(testUser);
    console.log("✅ Test user created:", testUser);

    // Verify the user was created
    const createdUser = await db.select().from(users).where(eq(users.id, testUser.id));
    console.log("🔍 Verified user creation:", createdUser);

    // Clean up - delete the test user
    await db.delete(users).where(eq(users.id, testUser.id));
    console.log("🧹 Test user cleaned up");

    return NextResponse.json({
      success: true,
      message: "User creation test successful",
      testUser,
      verificationResult: createdUser,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ User creation test failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "User creation test failed",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
