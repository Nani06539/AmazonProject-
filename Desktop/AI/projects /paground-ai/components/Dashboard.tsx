'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { firestoreUtils } from '@/lib/firebase-utils';
import { useUserSync } from '@/lib/user-sync';
import Link from 'next/link';
import MotivationalQuote from './MotivationalQuote';

export default function Dashboard() {
  const { user } = useUser();
  const { syncUser } = useUserSync();
  const [activeSection, setActiveSection] = useState('overview');
  const [stats, setStats] = useState({
    notes: 0,
    ideas: 0,
    library: 0,
    files: 0
  });
  const [loading, setLoading] = useState(true);

  const sections = [
    {
      id: 'overview',
      name: 'Overview',
      icon: '📊',
      description: 'Your dashboard summary',
      href: '/dashboard'
    },
    {
      id: 'notes',
      name: 'Notes',
      icon: '📝',
      description: 'Personal notes and thoughts',
      href: '/notes'
    },
    {
      id: 'ideas',
      name: 'Business Ideas',
      icon: '💡',
      description: 'Business concepts and plans',
      href: '/ideas'
    },
    {
      id: 'library',
      name: 'Library',
      icon: '📚',
      description: 'Your personal knowledge base',
      href: '/library'
    },
    {
      id: 'videos',
      name: 'Video Browsing',
      icon: '🎥',
      description: 'Search and watch YouTube videos',
      href: '/videos'
    }
  ];

  // Load statistics
  const loadStats = async () => {
    if (!user?.id) return;
    
    try {
      const [notes, ideas, library] = await Promise.all([
        firestoreUtils.query('notes', [{ field: 'clerkUserId', operator: '==', value: user.id }]),
        firestoreUtils.query('businessIdeas', [{ field: 'clerkUserId', operator: '==', value: user.id }]),
        firestoreUtils.query('library', [{ field: 'clerkUserId', operator: '==', value: user.id }])
      ]);

      setStats({
        notes: notes.length,
        ideas: ideas.length,
        library: library.length,
        files: library.filter((item: any) => item.fileUrl).length
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeDashboard = async () => {
      if (user) {
        // Ensure user exists in Firebase
        await syncUser();
        // Load stats
        await loadStats();
      }
    };

    initializeDashboard();
  }, [user, syncUser]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName || 'there'}! 👋
          </h1>
          <p className="text-gray-600">
            What would you like to work on today?
          </p>
        </div>

        {/* Motivational Quote */}
        <div className="mb-8">
          <MotivationalQuote />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📝</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Notes</p>
                <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.notes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">💡</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Business Ideas</p>
                <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.ideas}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">📚</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Library Items</p>
                <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.library}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <span className="text-2xl">📁</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Files</p>
                <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.files}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <span className="text-2xl">🎥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Videos Watched</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {sections.map((section) => (
            <Link
              key={section.id}
              href={section.href}
              className="group"
            >
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer group-hover:transform group-hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{section.icon}</span>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {section.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {section.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center py-8">
              <span className="text-4xl mb-4 block">🎉</span>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to Playground!</h3>
              <p className="text-gray-600 mb-4">
                Start by creating your first note, business idea, or adding something to your library.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/notes">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Create Note
                  </button>
                </Link>
                <Link href="/ideas">
                  <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Add Business Idea
                  </button>
                </Link>
                <Link href="/library">
                  <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Add to Library
                  </button>
                </Link>
                <Link href="/videos">
                  <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Browse Videos
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
