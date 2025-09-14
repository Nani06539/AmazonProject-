'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { firestoreUtils } from '@/lib/firebase-utils';
import { useUserSync } from '@/lib/user-sync';
import Link from 'next/link';

interface BusinessIdea {
  id: string;
  title: string;
  description: string;
  market: string;
  targetAudience: string;
  revenueModel: string;
  status: 'idea' | 'research' | 'planning' | 'development' | 'launched';
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export default function IdeasPage() {
  const { user } = useUser();
  const { syncUser } = useUserSync();
  const [ideas, setIdeas] = useState<BusinessIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingIdea, setEditingIdea] = useState<BusinessIdea | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    market: '',
    targetAudience: '',
    revenueModel: '',
    status: 'idea' as const,
    priority: 'medium' as const,
    tags: ''
  });

  // Load ideas
  const loadIdeas = async () => {
    if (!user?.id) return;
    
    try {
      const data = await firestoreUtils.query('businessIdeas', [{ field: 'clerkUserId', operator: '==', value: user.id }]);
      setIdeas(data as BusinessIdea[]);
    } catch (error) {
      console.error('Error loading ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add or update idea
  const saveIdea = async () => {
    if (!formData.title.trim() || !formData.description.trim() || !user?.id) return;

    try {
      const ideaData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        market: formData.market.trim(),
        targetAudience: formData.targetAudience.trim(),
        revenueModel: formData.revenueModel.trim(),
        status: formData.status,
        priority: formData.priority,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        clerkUserId: user.id
      };

      if (editingIdea) {
        await firestoreUtils.update('businessIdeas', editingIdea.id, ideaData);
      } else {
        await firestoreUtils.add('businessIdeas', ideaData);
      }

      setFormData({
        title: '',
        description: '',
        market: '',
        targetAudience: '',
        revenueModel: '',
        status: 'idea',
        priority: 'medium',
        tags: ''
      });
      setShowForm(false);
      setEditingIdea(null);
      loadIdeas();
    } catch (error) {
      console.error('Error saving idea:', error);
    }
  };

  // Delete idea
  const deleteIdea = async (ideaId: string) => {
    if (!confirm('Are you sure you want to delete this business idea?')) return;

    try {
      await firestoreUtils.delete('businessIdeas', ideaId);
      loadIdeas();
    } catch (error) {
      console.error('Error deleting idea:', error);
    }
  };

  // Edit idea
  const editIdea = (idea: BusinessIdea) => {
    setEditingIdea(idea);
    setFormData({
      title: idea.title,
      description: idea.description,
      market: idea.market,
      targetAudience: idea.targetAudience,
      revenueModel: idea.revenueModel,
      status: idea.status,
      priority: idea.priority,
      tags: idea.tags.join(', ')
    });
    setShowForm(true);
  };

  // Cancel form
  const cancelForm = () => {
    setFormData({
      title: '',
      description: '',
      market: '',
      targetAudience: '',
      revenueModel: '',
      status: 'idea',
      priority: 'medium',
      tags: ''
    });
    setShowForm(false);
    setEditingIdea(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'idea': return 'bg-gray-100 text-gray-800';
      case 'research': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'development': return 'bg-orange-100 text-orange-800';
      case 'launched': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    const initializeIdeas = async () => {
      if (user) {
        await syncUser();
        await loadIdeas();
      }
    };

    initializeIdeas();
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
            <h1 className="text-3xl font-bold text-gray-900">💡 Business Ideas</h1>
            <p className="text-gray-600 mt-2">Document and track your business concepts</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            + New Idea
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingIdea ? 'Edit Business Idea' : 'Create New Business Idea'}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Business idea title..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Market
                </label>
                <input
                  type="text"
                  value={formData.market}
                  onChange={(e) => setFormData({ ...formData, market: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Target market..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Describe your business idea..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Who is your target audience?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Revenue Model
                </label>
                <input
                  type="text"
                  value={formData.revenueModel}
                  onChange={(e) => setFormData({ ...formData, revenueModel: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="How will you make money?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="idea">Just an Idea</option>
                  <option value="research">Research Phase</option>
                  <option value="planning">Planning Phase</option>
                  <option value="development">Development</option>
                  <option value="launched">Launched</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="tech, saas, mobile..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={saveIdea}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                {editingIdea ? 'Update Idea' : 'Save Idea'}
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

        {/* Ideas List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading ideas...</p>
          </div>
        ) : ideas.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <span className="text-6xl mb-4 block">💡</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No business ideas yet</h3>
            <p className="text-gray-600 mb-6">
              Start documenting your business concepts and ideas
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Create Your First Idea
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {ideas.map((idea) => (
              <div key={idea.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{idea.title}</h3>
                    <div className="flex gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(idea.status)}`}>
                        {idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(idea.priority)}`}>
                        {idea.priority.charAt(0).toUpperCase() + idea.priority.slice(1)} Priority
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => editIdea(idea)}
                      className="text-purple-600 hover:text-purple-700 p-2 rounded-lg hover:bg-purple-50 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteIdea(idea.id)}
                      className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{idea.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {idea.market && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Market:</span>
                      <p className="text-gray-900">{idea.market}</p>
                    </div>
                  )}
                  {idea.targetAudience && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Target Audience:</span>
                      <p className="text-gray-900">{idea.targetAudience}</p>
                    </div>
                  )}
                  {idea.revenueModel && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Revenue Model:</span>
                      <p className="text-gray-900">{idea.revenueModel}</p>
                    </div>
                  )}
                </div>

                {idea.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {idea.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="text-sm text-gray-500">
                  Created: {idea.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                  {idea.updatedAt && idea.updatedAt !== idea.createdAt && (
                    <span className="ml-4">
                      Updated: {idea.updatedAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
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
