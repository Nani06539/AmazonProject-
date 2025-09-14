import { auth } from '@clerk/nextjs/server';
import { firestoreUtils, storageUtils } from './firebase-utils';

// Utility to get current user from Clerk
export const getCurrentUser = async () => {
  const { userId } = await auth();
  return userId;
};

// Enhanced Firestore operations with Clerk user context
export const clerkFirestoreUtils = {
  // Add document with Clerk user context
  async addWithUser(collectionName: string, data: any) {
    const userId = await getCurrentUser();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    return await firestoreUtils.add(collectionName, {
      ...data,
      clerkUserId: userId,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  },

  // Update document with user verification
  async updateWithUser(collectionName: string, docId: string, data: any) {
    const userId = await getCurrentUser();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    // Optional: Verify user owns the document
    const doc = await firestoreUtils.getById(collectionName, docId);
    if (doc && doc.clerkUserId !== userId) {
      throw new Error('Unauthorized: You can only update your own documents');
    }
    
    return await firestoreUtils.update(collectionName, docId, {
      ...data,
      updatedAt: new Date()
    });
  },

  // Delete document with user verification
  async deleteWithUser(collectionName: string, docId: string) {
    const userId = await getCurrentUser();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    // Optional: Verify user owns the document
    const doc = await firestoreUtils.getById(collectionName, docId);
    if (doc && doc.clerkUserId !== userId) {
      throw new Error('Unauthorized: You can only delete your own documents');
    }
    
    return await firestoreUtils.delete(collectionName, docId);
  },

  // Get user's documents
  async getUserDocuments(collectionName: string) {
    const userId = await getCurrentUser();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    return await firestoreUtils.query(collectionName, [
      { field: 'clerkUserId', operator: '==', value: userId }
    ], 'createdAt');
  },

  // Get all documents (admin function)
  async getAllDocuments(collectionName: string) {
    const userId = await getCurrentUser();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    // You could add admin role checking here
    return await firestoreUtils.getAll(collectionName);
  }
};

// Enhanced Storage operations with Clerk user context
export const clerkStorageUtils = {
  // Upload file with user-specific path
  async uploadUserFile(file: File, path: string): Promise<string> {
    const userId = await getCurrentUser();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    const userPath = `users/${userId}/${path}`;
    return await storageUtils.uploadFile(file, userPath);
  },

  // Get user's files
  async getUserFiles(path: string = '') {
    const userId = await getCurrentUser();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    const userPath = `users/${userId}/${path}`;
    return await storageUtils.listFiles(userPath);
  },

  // Delete user's file
  async deleteUserFile(path: string) {
    const userId = await getCurrentUser();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    const userPath = `users/${userId}/${path}`;
    return await storageUtils.deleteFile(userPath);
  },

  // Get download URL for user's file
  async getUserFileURL(path: string): Promise<string> {
    const userId = await getCurrentUser();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    const userPath = `users/${userId}/${path}`;
    return await storageUtils.getDownloadURL(userPath);
  }
};

