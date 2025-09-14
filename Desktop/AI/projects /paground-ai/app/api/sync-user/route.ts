import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { ensureUserExists } from '@/lib/user-sync';

export async function POST() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user data from Clerk
    const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user data from Clerk');
    }

    const clerkUser = await response.json();

    // Ensure user exists in Firebase
    const firebaseUser = await ensureUserExists(clerkUser);

    if (!firebaseUser) {
      return NextResponse.json(
        { error: 'Failed to sync user' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User synced successfully',
      user: firebaseUser
    });
  } catch (error) {
    console.error('Error syncing user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

