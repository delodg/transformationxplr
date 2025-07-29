import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { updateUserSession, getCompanyById } from '@/lib/db/services';
import { eq } from 'drizzle-orm';
import { db, userSessions } from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: sessionId } = await params;
    
    // Get session to verify ownership
    const [session] = await db
      .select()
      .from(userSessions)
      .where(eq(userSessions.id, sessionId))
      .limit(1);

    if (!session || session.userId !== userId) {
      return NextResponse.json({ error: 'Session not found or unauthorized' }, { status: 404 });
    }

    const updateData = await req.json();
    
    // If companyId is being updated, verify it belongs to user
    if (updateData.companyId && updateData.companyId !== session.companyId) {
      const company = await getCompanyById(updateData.companyId);
      if (!company || company.userId !== userId) {
        return NextResponse.json({ error: 'Company not found or unauthorized' }, { status: 404 });
      }
    }

    // Prepare update fields
    const updateFields: any = {};
    if (updateData.companyId !== undefined) updateFields.companyId = updateData.companyId;
    if (updateData.sessionData) updateFields.sessionData = typeof updateData.sessionData === 'string' ? updateData.sessionData : JSON.stringify(updateData.sessionData);
    if (updateData.endedAt !== undefined) updateFields.endedAt = updateData.endedAt ? new Date(updateData.endedAt) : null;

    await updateUserSession(sessionId, updateFields);

    return NextResponse.json({ message: 'User session updated successfully' });
  } catch (error) {
    console.error('Error updating user session:', error);
    return NextResponse.json({ error: 'Failed to update user session' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: sessionId } = await params;
    
    // Get session to verify ownership
    const [session] = await db
      .select()
      .from(userSessions)
      .where(eq(userSessions.id, sessionId))
      .limit(1);

    if (!session || session.userId !== userId) {
      return NextResponse.json({ error: 'Session not found or unauthorized' }, { status: 404 });
    }

    await db.delete(userSessions).where(eq(userSessions.id, sessionId));

    return NextResponse.json({ message: 'User session deleted successfully' });
  } catch (error) {
    console.error('Error deleting user session:', error);
    return NextResponse.json({ error: 'Failed to delete user session' }, { status: 500 });
  }
} 