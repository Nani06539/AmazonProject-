# Firebase & Clerk Integration for Next.js Project

This project has been configured with Firebase for database (Firestore) and storage functionality, along with Clerk for authentication.

## What's Been Set Up

### 1. Environment Variables (`.env.local`)
- Firebase configuration variables are stored securely in `.env.local`
- All Firebase config values are prefixed with `NEXT_PUBLIC_` for client-side access
- Clerk authentication keys are configured for secure authentication

### 2. Firebase Configuration (`lib/firebase.ts`)
- Main Firebase app initialization
- Firestore database setup
- Firebase Storage setup
- Firebase Authentication setup (ready for future use)

### 3. Utility Functions (`lib/firebase-utils.ts`)
- **Firestore Operations:**
  - `getAll()` - Get all documents from a collection
  - `getById()` - Get a single document by ID
  - `add()` - Add a new document
  - `update()` - Update an existing document
  - `delete()` - Delete a document
  - `query()` - Query documents with filters, ordering, and limits

- **Storage Operations:**
  - `uploadFile()` - Upload a file to Firebase Storage
  - `getDownloadURL()` - Get download URL for a file
  - `deleteFile()` - Delete a file from storage
  - `listFiles()` - List all files in a directory

### 4. Clerk Authentication Integration
- **Middleware** (`middleware.ts`): Handles authentication routing and protection
- **Layout** (`app/layout.tsx`): Wrapped with `ClerkProvider` and includes authentication UI
- **Authentication Components**: Sign-in, Sign-up, and User profile buttons

### 5. Clerk-Firebase Integration (`lib/clerk-firebase-utils.ts`)
- Enhanced Firestore operations with user context
- User-specific storage operations
- Server-side authentication utilities

### 6. API Routes (`app/api/users/route.ts`)
- Server-side authentication with Clerk
- Protected Firebase operations
- RESTful API endpoints

### 7. Example Component (`components/FirebaseExample.tsx`)
- Demonstrates how to use Firebase with Clerk authentication
- Shows both Firestore database and Storage operations
- Includes user management and file upload functionality
- Authentication-gated features

## How to Use

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Access the Application
Navigate to `http://localhost:3000` to see the Firebase and Clerk integration.

### 3. Authentication Flow
1. Click "Sign Up" to create a new account
2. Verify your email (if required)
3. Sign in to access Firebase features
4. Use the User button to manage your profile

### 4. Using Firestore Database with Clerk Authentication
```typescript
import { clerkFirestoreUtils } from '@/lib/clerk-firebase-utils';

// Add a new document with user context
const userId = await clerkFirestoreUtils.addWithUser('users', {
  name: 'John Doe',
  email: 'john@example.com'
});

// Get current user's documents
const userDocuments = await clerkFirestoreUtils.getUserDocuments('users');

// Update user's document
await clerkFirestoreUtils.updateWithUser('users', userId, { name: 'Jane Doe' });

// Delete user's document
await clerkFirestoreUtils.deleteWithUser('users', userId);

// Get all documents (admin function)
const allDocuments = await clerkFirestoreUtils.getAllDocuments('users');
```

### 5. Using Firebase Storage with Clerk Authentication
```typescript
import { clerkStorageUtils } from '@/lib/clerk-firebase-utils';

// Upload file with user-specific path
const fileUrl = await clerkStorageUtils.uploadUserFile(file, 'profile.jpg');

// Get user's files
const userFiles = await clerkStorageUtils.getUserFiles('uploads/');

// Delete user's file
await clerkStorageUtils.deleteUserFile('profile.jpg');

// Get download URL for user's file
const url = await clerkStorageUtils.getUserFileURL('profile.jpg');
```

### 6. Server-Side Authentication with API Routes
```typescript
// Example API route with Clerk authentication
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Your protected logic here
  return NextResponse.json({ success: true, userId });
}
```

## Firebase Console Setup

### 1. Enable Firestore Database
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `windy-bounty-469120-k3`
3. Navigate to "Firestore Database" in the left sidebar
4. Click "Create database"
5. Choose "Start in test mode" for development
6. Select a location for your database

### 2. Enable Firebase Storage
1. Navigate to "Storage" in the left sidebar
2. Click "Get started"
3. Choose "Start in test mode" for development
4. Select a location for your storage

### 3. Security Rules (Optional)
For production, you'll want to set up proper security rules:

**Firestore Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Storage Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Environment Variables

The following environment variables are configured in `.env.local`:

### Firebase Configuration
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC_xXmBaJEgJremuUBe5uINlj3UHrUs954
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=windy-bounty-469120-k3.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=windy-bounty-469120-k3
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=windy-bounty-469120-k3.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=262007858183
NEXT_PUBLIC_FIREBASE_APP_ID=1:262007858183:web:1a47fa238ef0ff158f36a2
```

### Clerk Authentication
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_Z3Jvd2luZy1rcmlsbC05My5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_OralWq5V78TOSlFEHb0jQoPaOGoS0krnIG4BydhbJE
```

## Next Steps

1. **Clerk Dashboard**: Configure your Clerk application settings in the [Clerk Dashboard](https://dashboard.clerk.com/)
2. **Security Rules**: Implement proper Firebase security rules for production
3. **Real-time Updates**: Use Firestore real-time listeners for live data updates
4. **Error Handling**: Add comprehensive error handling and loading states
5. **TypeScript Types**: Create proper TypeScript interfaces for your data models
6. **User Roles**: Implement role-based access control using Clerk's user metadata
7. **Email Templates**: Customize Clerk's email templates for your brand

## Troubleshooting

- **Environment Variables Not Working**: Make sure `.env.local` is in the root directory and restart your development server
- **Firebase Connection Issues**: Check that your Firebase project is properly configured and the API key is correct
- **CORS Issues**: Ensure your Firebase project's authorized domains include `localhost` for development
- **Storage Upload Failures**: Check that Firebase Storage is enabled and security rules allow uploads

## Dependencies

- `firebase`: Firebase SDK for web applications
- `@clerk/nextjs`: Clerk authentication for Next.js
- `next`: Next.js framework
- `react`: React library
- `typescript`: TypeScript support
