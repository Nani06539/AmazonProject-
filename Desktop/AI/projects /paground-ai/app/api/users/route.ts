import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { clerkFirestoreUtils } from '@/lib/clerk-firebase-utils';

// GET /api/users - Get current user's documents
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userDocuments = await clerkFirestoreUtils.getUserDocuments('users');
    
    return NextResponse.json({
      success: true,
      data: userDocuments
    });
  } catch (error) {
    console.error('Error fetching user documents:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user document
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    const docId = await clerkFirestoreUtils.addWithUser('users', {
      name,
      email
    });

    return NextResponse.json({
      success: true,
      data: { id: docId, name, email }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating user document:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

