'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { firestoreUtils, storageUtils } from '@/lib/firebase-utils';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export default function FirebaseExample() {
  const { user, isSignedIn } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string>('');

  // Load users from Firestore
  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await firestoreUtils.getAll('users');
      setUsers(data as User[]);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add new user to Firestore
  const addUser = async () => {
    if (!newUser.name || !newUser.email) return;
    
    try {
      await firestoreUtils.add('users', {
        ...newUser,
        createdAt: new Date(),
        clerkUserId: user?.id || null,
        addedBy: user?.emailAddresses[0]?.emailAddress || null
      });
      setNewUser({ name: '', email: '' });
      loadUsers(); // Reload the list
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  // Upload file to Firebase Storage
  const uploadFile = async () => {
    if (!uploadedFile) return;
    
    try {
      const path = `uploads/${Date.now()}_${uploadedFile.name}`;
      const url = await storageUtils.uploadFile(uploadedFile, path);
      setFileUrl(url);
      setUploadedFile(null);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Firebase Integration Example</h1>
      
      {!isSignedIn ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">Authentication Required</h2>
          <p className="text-yellow-700">Please sign in to access Firebase features.</p>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-green-800 mb-2">Welcome, {user?.firstName || user?.emailAddresses[0]?.emailAddress}!</h2>
          <p className="text-green-700">You're signed in and can now use Firebase features.</p>
        </div>
      )}
      
      {/* Firestore Database Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Firestore Database</h2>
        
        {!isSignedIn && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-gray-600">Sign in to add and manage users</p>
          </div>
        )}
        
        {/* Add User Form */}
        {isSignedIn && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Add New User</h3>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addUser}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add User
              </button>
            </div>
          </div>
        )}

        {/* Users List */}
        <div>
          <h3 className="text-lg font-medium mb-3">Users List</h3>
          {loading ? (
            <p className="text-gray-500">Loading users...</p>
          ) : (
            <div className="space-y-2">
              {users.map((user) => (
                <div key={user.id} className="p-3 bg-gray-50 rounded-md">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-500">
                    Created: {user.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                  </p>
                </div>
              ))}
              {users.length === 0 && (
                <p className="text-gray-500">No users found. Add some users above!</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Firebase Storage Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Firebase Storage</h2>
        
        {!isSignedIn && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-gray-600">Sign in to upload files</p>
          </div>
        )}
        
        {/* File Upload */}
        {isSignedIn && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Upload File</h3>
            <div className="flex gap-4 items-center">
              <input
                type="file"
                onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={uploadFile}
                disabled={!uploadedFile}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Upload
              </button>
            </div>
          </div>
        )}

        {/* Uploaded File URL */}
        {fileUrl && (
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Uploaded File URL:</h3>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 break-all"
            >
              {fileUrl}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
