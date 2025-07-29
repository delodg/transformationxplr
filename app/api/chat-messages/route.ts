import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createChatMessage, getChatMessagesByCompany, bulkCreateChatMessages, deleteChatMessagesByCompany, getCompanyById } from "@/lib/db/services";
import { generateId } from "@/lib/db/services";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");

    if (!companyId) {
      return NextResponse.json({ error: "Company ID is required" }, { status: 400 });
    }

    // Verify company belongs to user
    const company = await getCompanyById(companyId);
    if (!company || company.userId !== userId) {
      return NextResponse.json({ error: "Company not found or unauthorized" }, { status: 404 });
    }

    const messages = await getChatMessagesByCompany(companyId);
    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    return NextResponse.json({ error: "Failed to fetch chat messages" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requestData = await req.json();

    // Check if it's a single message or bulk creation
    if (Array.isArray(requestData.messages)) {
      // Bulk creation
      const { companyId, messages } = requestData;

      // Verify company belongs to user
      const company = await getCompanyById(companyId);
      if (!company || company.userId !== userId) {
        return NextResponse.json({ error: "Company not found or unauthorized" }, { status: 404 });
      }

      const messagesWithIds = messages.map((message: any) => ({
        ...message,
        id: message.id || generateId(),
        companyId,
        timestamp: message.timestamp ? new Date(message.timestamp) : new Date(),
      }));

      const newMessages = await bulkCreateChatMessages(messagesWithIds);
      return NextResponse.json({ messages: newMessages });
    } else {
      // Single message creation
      const { companyId, ...messageData } = requestData;

      // Verify company belongs to user
      const company = await getCompanyById(companyId);
      if (!company || company.userId !== userId) {
        return NextResponse.json({ error: "Company not found or unauthorized" }, { status: 404 });
      }

      const newMessage = await createChatMessage({
        ...messageData,
        id: generateId(),
        companyId,
        timestamp: messageData.timestamp ? new Date(messageData.timestamp) : new Date(),
      });
      return NextResponse.json({ message: newMessage });
    }
  } catch (error) {
    console.error("Error creating chat message:", error);
    return NextResponse.json({ error: "Failed to create chat message" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");

    if (!companyId) {
      return NextResponse.json({ error: "Company ID is required" }, { status: 400 });
    }

    // Verify company belongs to user
    const company = await getCompanyById(companyId);
    if (!company || company.userId !== userId) {
      return NextResponse.json({ error: "Company not found or unauthorized" }, { status: 404 });
    }

    await deleteChatMessagesByCompany(companyId);
    return NextResponse.json({ message: "All chat messages deleted successfully" });
  } catch (error) {
    console.error("Error deleting chat messages:", error);
    return NextResponse.json({ error: "Failed to delete chat messages" }, { status: 500 });
  }
}
