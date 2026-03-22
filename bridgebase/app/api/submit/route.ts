import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface SubmissionData {
  id: string;
  organizationName: string;
  category: string;
  description: string;
  address: string;
  email: string;
  phone: string;
  website: string;
  cost?: string;
  languages?: string[];
  walkIn?: boolean;
  hours?: string;
  reason: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

const SUBMISSIONS_FILE = path.join(process.cwd(), 'data', 'submissions.json');

async function readSubmissions(): Promise<SubmissionData[]> {
  try {
    const data = await fs.readFile(SUBMISSIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeSubmissions(submissions: SubmissionData[]): Promise<void> {
  const dir = path.dirname(SUBMISSIONS_FILE);
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch {
    // ignore if exists
  }
  await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2));
}

function generateId(): string {
  return `sub-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { 
      organizationName, 
      category, 
      description, 
      address, 
      email, 
      phone, 
      website,
      cost,
      languages,
      walkIn,
      hours,
      reason 
    } = body;

    if (!organizationName || !category || !description || !address) {
      return NextResponse.json(
        { error: 'Missing required fields: organizationName, category, description, address' },
        { status: 400 }
      );
    }

    const submission: SubmissionData = {
      id: generateId(),
      organizationName,
      category,
      description,
      address,
      email: email || '',
      phone: phone || '',
      website: website || '',
      cost: cost || '',
      languages: languages || [],
      walkIn: walkIn || false,
      hours: hours || '',
      reason: reason || '',
      submittedAt: new Date().toISOString(),
      status: 'pending',
    };

    const submissions = await readSubmissions();
    submissions.push(submission);
    await writeSubmissions(submissions);

    return NextResponse.json({
      success: true,
      id: submission.id,
      message: 'Resource submitted successfully. It will be reviewed before being added.',
    });
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit resource' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const submissions = await readSubmissions();
    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('Error reading submissions:', error);
    return NextResponse.json(
      { error: 'Failed to read submissions' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid request. Required: id and status (approved/rejected)' },
        { status: 400 }
      );
    }

    const submissions = await readSubmissions();
    const index = submissions.findIndex(s => s.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    submissions[index].status = status;
    await writeSubmissions(submissions);

    return NextResponse.json({
      success: true,
      message: `Submission ${status}`,
    });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: 'Failed to update submission' },
      { status: 500 }
    );
  }
}
