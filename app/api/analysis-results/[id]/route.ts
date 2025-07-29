import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getCompanyById } from '@/lib/db/services';
import { eq } from 'drizzle-orm';
import { db, analysisResults } from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: analysisId } = await params;
    
    // Get analysis result to verify ownership via company
    const [analysis] = await db
      .select()
      .from(analysisResults)
      .where(eq(analysisResults.id, analysisId))
      .limit(1);

    if (!analysis) {
      return NextResponse.json({ error: 'Analysis result not found' }, { status: 404 });
    }

    // Verify company belongs to user
    const company = await getCompanyById(analysis.companyId);
    if (!company || company.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const updateData = await req.json();
    
    // Prepare update fields
    const updateFields: any = { updatedAt: new Date() };
    if (updateData.type) updateFields.type = updateData.type;
    if (updateData.title) updateFields.title = updateData.title;
    if (updateData.results) updateFields.results = typeof updateData.results === 'string' ? updateData.results : JSON.stringify(updateData.results);
    if (updateData.confidence !== undefined) updateFields.confidence = updateData.confidence;
    if (updateData.generatedBy) updateFields.generatedBy = updateData.generatedBy;
    if (updateData.phase !== undefined) updateFields.phase = updateData.phase;
    if (updateData.status) updateFields.status = updateData.status;

    const [updatedAnalysis] = await db
      .update(analysisResults)
      .set(updateFields)
      .where(eq(analysisResults.id, analysisId))
      .returning();

    return NextResponse.json({ analysisResult: updatedAnalysis });
  } catch (error) {
    console.error('Error updating analysis result:', error);
    return NextResponse.json({ error: 'Failed to update analysis result' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: analysisId } = await params;
    
    // Get analysis result to verify ownership via company
    const [analysis] = await db
      .select()
      .from(analysisResults)
      .where(eq(analysisResults.id, analysisId))
      .limit(1);

    if (!analysis) {
      return NextResponse.json({ error: 'Analysis result not found' }, { status: 404 });
    }

    // Verify company belongs to user
    const company = await getCompanyById(analysis.companyId);
    if (!company || company.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await db.delete(analysisResults).where(eq(analysisResults.id, analysisId));

    return NextResponse.json({ message: 'Analysis result deleted successfully' });
  } catch (error) {
    console.error('Error deleting analysis result:', error);
    return NextResponse.json({ error: 'Failed to delete analysis result' }, { status: 500 });
  }
} 