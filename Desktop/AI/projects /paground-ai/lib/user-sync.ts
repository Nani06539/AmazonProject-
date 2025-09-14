import { useUser } from '@clerk/nextjs';
import { firestoreUtils } from './firebase-utils';

export interface FirebaseUser {
  id: string;
  clerkUserId: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

// Function to ensure user exists in Firebase
export const ensureUserExists = async (clerkUser: any): Promise<FirebaseUser | null> => {
  if (!clerkUser?.id) return null;

  try {
    // Check if user already exists in Firebase
    const existingUsers = await firestoreUtils.query('users', [
      { field: 'clerkUserId', operator: '==', value: clerkUser.id }
    ]);

    if (existingUsers.length > 0) {
      // User exists, return the existing user
      return existingUsers[0] as FirebaseUser;
    }

    // User doesn't exist, create new user document
    const userData = {
      clerkUserId: clerkUser.id,
      email: clerkUser.emailAddresses?.[0]?.emailAddress || '',
      firstName: clerkUser.firstName || '',
      lastName: clerkUser.lastName || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };

    const userId = await firestoreUtils.add('users', userData);
    console.log(`Created new Firebase user document for Clerk user: ${clerkUser.id}`);

    // Return the created user
    return {
      id: userId,
      ...userData
    } as FirebaseUser;
  } catch (error) {
    console.error('Error ensuring user exists:', error);
    return null;
  }
};

// Hook to use in components for user synchronization
export const useUserSync = () => {
  const { user, isLoaded } = useUser();

  const syncUser = async () => {
    if (!isLoaded || !user) return null;
    return await ensureUserExists(user);
  };

  return {
    user,
    isLoaded,
    syncUser
  };
};

