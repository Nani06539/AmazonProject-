'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { firestoreUtils, storageUtils } from '@/lib/firebase-utils';
import { useUserSync } from '@/lib/user-sync';
import Link from 'next/link';
import ImageGenerator from './ImageGenerator';
import ImageGallery from './ImageGallery';

interface LibraryItem {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'book' | 'video' | 'document' | 'link' | 'other';
  url?: string;
  fileUrl?: string;
  fileName?: string;
  author?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}


export default function LibraryPage() {
  const { user } = useUser();
  const { syncUser } = useUserSync();
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [generatedImages, setGeneratedImages] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<LibraryItem | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'article' as const,
    url: '',
    author: '',
    tags: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Load library items
  const loadItems = async () => {
    if (!user?.id) return;
    
    try {
      const data = await firestoreUtils.query('library', [{ field: 'clerkUserId', operator: '==', value: user.id }]);
      const allItems = data as LibraryItem[];
      setItems(allItems);
      
      // Filter AI-generated images
      const aiImages = allItems.filter(item => 
        item.tags.includes('ai-generated') && item.type === 'other'
      );
      setGeneratedImages(aiImages);
    } catch (error) {
      console.error('Error loading library items:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add or update library item
  const saveItem = async () => {
    if (!formData.title.trim() || !user?.id) return;

    try {
      let fileUrl = '';
      let fileName = '';

      // Upload file if selected
      if (selectedFile) {
        setUploadingFile(true);
        fileName = selectedFile.name;
        fileUrl = await storageUtils.uploadFile(selectedFile, `users/${user.id}/library/${fileName}`);
        setUploadingFile(false);
      }

      const itemData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        type: formData.type,
        url: formData.url.trim() || undefined,
        author: formData.author.trim() || undefined,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        clerkUserId: user.id,
        ...(fileUrl && { fileUrl, fileName })
      };

      if (editingItem) {
        await firestoreUtils.update('library', editingItem.id, itemData);
      } else {
        await firestoreUtils.add('library', itemData);
      }

      setFormData({
        title: '',
        description: '',
        type: 'article',
        url: '',
        author: '',
        tags: ''
      });
      setSelectedFile(null);
      setShowForm(false);
      setEditingItem(null);
      loadItems();
    } catch (error) {
      console.error('Error saving library item:', error);
      setUploadingFile(false);
    }
  };

  // Delete library item
  const deleteItem = async (itemId: string, fileName?: string) => {
    if (!confirm('Are you sure you want to delete this library item?') || !user?.id) return;

    try {
      // Delete file from storage if exists
      if (fileName) {
        await storageUtils.deleteFile(`users/${user.id}/library/${fileName}`);
      }
      
      await firestoreUtils.delete('library', itemId);
      loadItems();
    } catch (error) {
      console.error('Error deleting library item:', error);
    }
  };

  // Handle image generation
  const handleImageGenerated = (item: LibraryItem) => {
    setGeneratedImages(prev => [item, ...prev]);
    // Also add to main items list
    setItems(prev => [item, ...prev]);
  };

  // Handle image deletion
  const handleImageDeleted = (id: string) => {
    setGeneratedImages(prev => prev.filter(img => img.id !== id));
    // Also remove from main items list
    setItems(prev => prev.filter(item => item.id !== id));
  };

  // Edit library item
  const editItem = (item: LibraryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      type: item.type,
      url: item.url || '',
      author: item.author || '',
      tags: item.tags.join(', ')
    });
    setSelectedFile(null);
    setShowForm(true);
  };

  // Cancel form
  const cancelForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'article',
      url: '',
      author: '',
      tags: ''
    });
    setSelectedFile(null);
    setShowForm(false);
    setEditingItem(null);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return '📄';
      case 'book': return '📚';
      case 'video': return '🎥';
      case 'document': return '📋';
      case 'link': return '🔗';
      default: return '📁';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'article': return 'bg-blue-100 text-blue-800';
      case 'book': return 'bg-purple-100 text-purple-800';
      case 'video': return 'bg-red-100 text-red-800';
      case 'document': return 'bg-green-100 text-green-800';
      case 'link': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    const initializeLibrary = async () => {
      if (user) {
        await syncUser();
        await loadItems();
      }
    };

    initializeLibrary();
  }, [user, syncUser]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/" className="text-blue-600 hover:text-blue-700 mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">📚 Personal Library</h1>
            <p className="text-gray-600 mt-2">Build your knowledge base</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            + Add Item
          </button>
        </div>

        {/* Image Generator */}
        <ImageGenerator onImageGenerated={handleImageGenerated} userId={user?.id || ''} />

        {/* Generated Images Gallery */}
        <ImageGallery 
          images={generatedImages} 
          onDeleteImage={handleImageDeleted} 
        />

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingItem ? 'Edit Library Item' : 'Add New Library Item'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Item title..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="article">Article</option>
                  <option value="book">Book</option>
                  <option value="video">Video</option>
                  <option value="document">Document</option>
                  <option value="link">Link</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Brief description..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Author name..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File Upload
                </label>
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {selectedFile && (
                  <p className="text-sm text-gray-600 mt-1">Selected: {selectedFile.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="research, tech, business..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={saveItem}
                disabled={uploadingFile}
                className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                {uploadingFile ? 'Uploading...' : (editingItem ? 'Update Item' : 'Save Item')}
              </button>
              <button
                onClick={cancelForm}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Library Items List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading library...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <span className="text-6xl mb-4 block">📚</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your library is empty</h3>
            <p className="text-gray-600 mb-6">
              Start building your personal knowledge base
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Add Your First Item
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{getTypeIcon(item.type)}</span>
                      <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </span>
                    </div>
                    {item.author && (
                      <p className="text-sm text-gray-600 mb-2">By {item.author}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => editItem(item)}
                      className="text-green-600 hover:text-green-700 p-2 rounded-lg hover:bg-green-50 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteItem(item.id, item.fileName)}
                      className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {item.description && (
                  <p className="text-gray-700 mb-4">{item.description}</p>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full hover:bg-blue-200 transition-colors"
                    >
                      🔗 View Link
                    </a>
                  )}
                  {item.fileUrl && (
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full hover:bg-green-200 transition-colors"
                    >
                      📁 Download File
                    </a>
                  )}
                </div>

                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="text-sm text-gray-500">
                  Added: {item.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                  {item.updatedAt && item.updatedAt !== item.createdAt && (
                    <span className="ml-4">
                      Updated: {item.updatedAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
