import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createUserSession, updateUserSession, getUserActiveSessions, getCompanyById } from "@/lib/db/services";
import { generateId } from "@/lib/db/services";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessions = await getUserActiveSessions(userId);
    return NextResponse.json({ sessions });
  } catch (error) {
    console.error("Error fetching user sessions:", error);
    return NextResponse.json({ error: "Failed to fetch user sessions" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { companyId, sessionData } = await req.json();

    // If companyId is provided, verify it belongs to user
    if (companyId) {
      const company = await getCompanyById(companyId);
      if (!company || company.userId !== userId) {
        return NextResponse.json({ error: "Company not found or unauthorized" }, { status: 404 });
      }
    }

    await createUserSession({
      id: generateId(),
      userId,
      companyId: companyId || null,
      sessionData: typeof sessionData === "string" ? sessionData : JSON.stringify(sessionData || {}),
    });

    return NextResponse.json({ message: "User session created successfully" });
  } catch (error) {
    console.error("Error creating user session:", error);
    return NextResponse.json({ error: "Failed to create user session" }, { status: 500 });
  }
}
