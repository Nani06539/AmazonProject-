'use client';

import { useState, useEffect } from 'react';

interface QuoteData {
  quote: string;
  success: boolean;
  fallback?: boolean;
}

export default function MotivationalQuote() {
  const [quote, setQuote] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchQuote = async () => {
    try {
      setLoading(true);
      setError(false);
      
      const response = await fetch('/api/quote');
      if (!response.ok) {
        throw new Error('Failed to fetch quote');
      }
      
      const data: QuoteData = await response.json();
      setQuote(data.quote);
    } catch (err) {
      console.error('Error fetching quote:', err);
      setError(true);
      // Set a fallback quote
      setQuote("The only way to do great work is to love what you do.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  const handleRefresh = () => {
    fetchQuote();
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className="text-2xl mr-3">💫</span>
            <h3 className="text-lg font-semibold">Daily Motivation</h3>
          </div>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-white bg-opacity-20 rounded mb-2"></div>
          <div className="h-4 bg-white bg-opacity-20 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className="text-2xl mr-3">💫</span>
          <h3 className="text-lg font-semibold">Daily Motivation</h3>
        </div>
        <button
          onClick={handleRefresh}
          className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          title="Get new quote"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      
      <blockquote className="text-lg font-medium leading-relaxed mb-4">
        "{quote}"
      </blockquote>
      
      <div className="flex items-center justify-between text-sm opacity-80">
        <span>✨ AI-powered inspiration</span>
        {error && (
          <span className="text-yellow-200">Using fallback quote</span>
        )}
      </div>
    </div>
  );
}

