import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { 
  createCompany, 
  getCompaniesByUser, 
  updateCompany,
  getAIInsightsByCompany,
  getWorkflowPhasesByCompany 
} from '@/lib/db/services';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const companies = await getCompaniesByUser(userId);
    return NextResponse.json({ companies });
    
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const companyData = await req.json();
    const newCompany = await createCompany({ ...companyData, userId });
    
    return NextResponse.json({ company: newCompany });
    
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json({ error: 'Failed to create company' }, { status: 500 });
  }
} 