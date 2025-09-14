'use client';

import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { useUserSync } from '@/lib/user-sync';
import Link from 'next/link';

interface YouTubeVideo {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      high: {
        url: string;
      };
      medium: {
        url: string;
      };
    };
    channelTitle: string;
    publishedAt: string;
    duration?: string;
    viewCount?: string;
  };
}

interface VideoDetails {
  id: string;
  title: string;
  description: string;
  channelTitle: string;
  publishedAt: string;
  viewCount: string;
  likeCount: string;
  duration: string;
  thumbnails: {
    high: {
      url: string;
    };
  };
}

const CATEGORIES = [
  { id: 'all', name: 'All', icon: '🏠' },
  { id: 'trending', name: 'Trending', icon: '🔥' },
  { id: 'music', name: 'Music', icon: '🎵' },
  { id: 'gaming', name: 'Gaming', icon: '🎮' },
  { id: 'education', name: 'Education', icon: '📚' },
  { id: 'technology', name: 'Technology', icon: '💻' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'news', name: 'News', icon: '📰' },
  { id: 'live', name: 'Live', icon: '🔴' },
  { id: 'ai', name: 'AI', icon: '🤖' }
];

const SIDEBAR_ITEMS = [
  { id: 'home', name: 'Home', icon: '🏠', active: true },
  { id: 'shorts', name: 'Shorts', icon: '📱' },
  { id: 'subscriptions', name: 'Subscriptions', icon: '📺' },
  { id: 'history', name: 'History', icon: '⏰' },
  { id: 'playlists', name: 'Playlists', icon: '📋' },
  { id: 'your-videos', name: 'Your videos', icon: '🎬' },
  { id: 'watch-later', name: 'Watch later', icon: '⏰' },
  { id: 'liked-videos', name: 'Liked videos', icon: '👍' },
  { id: 'downloads', name: 'Downloads', icon: '⬇️' }
];

// Fallback videos for when API fails
const FALLBACK_VIDEOS = [
  {
    id: { videoId: 'dQw4w9WgXcQ' },
    snippet: {
      title: 'Rick Astley - Never Gonna Give You Up (Official Music Video)',
      description: 'The official music video for "Never Gonna Give You Up" by Rick Astley',
      thumbnails: {
        high: { url: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg' },
        medium: { url: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg' }
      },
      channelTitle: 'Rick Astley',
      publishedAt: '2009-10-25T06:57:33Z'
    }
  },
  {
    id: { videoId: '9bZkp7q19f0' },
    snippet: {
      title: 'PSY - GANGNAM STYLE(강남스타일) M/V',
      description: 'PSY - GANGNAM STYLE(강남스타일) M/V',
      thumbnails: {
        high: { url: 'https://i.ytimg.com/vi/9bZkp7q19f0/hqdefault.jpg' },
        medium: { url: 'https://i.ytimg.com/vi/9bZkp7q19f0/mqdefault.jpg' }
      },
      channelTitle: 'officialpsy',
      publishedAt: '2012-07-15T07:46:32Z'
    }
  },
  {
    id: { videoId: 'kJQP7kiw5Fk' },
    snippet: {
      title: 'Luis Fonsi - Despacito ft. Daddy Yankee',
      description: 'Luis Fonsi - Despacito ft. Daddy Yankee',
      thumbnails: {
        high: { url: 'https://i.ytimg.com/vi/kJQP7kiw5Fk/hqdefault.jpg' },
        medium: { url: 'https://i.ytimg.com/vi/kJQP7kiw5Fk/mqdefault.jpg' }
      },
      channelTitle: 'Luis Fonsi',
      publishedAt: '2017-01-13T04:20:06Z'
    }
  },
  {
    id: { videoId: 'ZZ5LpwO-An4' },
    snippet: {
      title: 'Baby Shark Dance | Sing and Dance! | Animal Songs | PINKFONG Songs for Children',
      description: 'Baby Shark Dance | Sing and Dance! | Animal Songs | PINKFONG Songs for Children',
      thumbnails: {
        high: { url: 'https://i.ytimg.com/vi/ZZ5LpwO-An4/hqdefault.jpg' },
        medium: { url: 'https://i.ytimg.com/vi/ZZ5LpwO-An4/mqdefault.jpg' }
      },
      channelTitle: 'Pinkfong Baby Shark - Kids\' Songs & Stories',
      publishedAt: '2016-06-17T16:00:00Z'
    }
  },
  {
    id: { videoId: 'y6120QOlsfU' },
    snippet: {
      title: 'Sandstorm - Darude',
      description: 'Sandstorm - Darude',
      thumbnails: {
        high: { url: 'https://i.ytimg.com/vi/y6120QOlsfU/hqdefault.jpg' },
        medium: { url: 'https://i.ytimg.com/vi/y6120QOlsfU/mqdefault.jpg' }
      },
      channelTitle: 'Darude',
      publishedAt: '2009-03-31T15:35:38Z'
    }
  }
];

export default function VideoBrowsingPage() {
  const { user } = useUser();
  const { syncUser } = useUserSync();
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [apiError, setApiError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Get trending videos
  const getTrendingVideos = async () => {
    setCategoryLoading(true);
    setApiError(false);
    setIsSearchMode(false);
    
    try {
      const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
      
      if (!apiKey || apiKey === 'AIzaSyC_xXmBaJEgJremuUBe5uINlj3UHrUs954') {
        setVideos(FALLBACK_VIDEOS);
        return;
      }

      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=20&regionCode=US&key=${apiKey}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'YouTube API error');
      }
      
      setVideos(data.items || FALLBACK_VIDEOS);
    } catch (error) {
      console.error('Error fetching trending videos:', error);
      setApiError(true);
      setVideos(FALLBACK_VIDEOS);
    } finally {
      setCategoryLoading(false);
    }
  };

  // Search videos
  const searchVideos = async (query: string) => {
    if (!query.trim()) return;
    
    setSearchLoading(true);
    setApiError(false);
    setIsSearchMode(true);
    
    try {
      const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
      
      if (!apiKey || apiKey === 'AIzaSyC_xXmBaJEgJremuUBe5uINlj3UHrUs954') {
        const filteredVideos = FALLBACK_VIDEOS.filter(video =>
          video.snippet.title.toLowerCase().includes(query.toLowerCase()) ||
          video.snippet.channelTitle.toLowerCase().includes(query.toLowerCase())
        );
        setVideos(filteredVideos);
        return;
      }

      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${encodeURIComponent(query)}&type=video&order=relevance&key=${apiKey}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'YouTube API error');
      }
      
      setVideos(data.items || []);
    } catch (error) {
      console.error('Error searching videos:', error);
      setApiError(true);
      setVideos([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Get videos by category
  const getVideosByCategory = async (categoryId: string) => {
    setCategoryLoading(true);
    setApiError(false);
    setIsSearchMode(false);
    
    try {
      const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
      
      if (!apiKey || apiKey === 'AIzaSyC_xXmBaJEgJremuUBe5uINlj3UHrUs954') {
        setVideos(FALLBACK_VIDEOS);
        return;
      }

      let query = '';
      
      const categoryQueries: { [key: string]: string } = {
        music: 'music hits 2024',
        gaming: 'gaming highlights',
        education: 'educational videos',
        technology: 'tech news latest',
        entertainment: 'entertainment news',
        sports: 'sports highlights',
        news: 'breaking news today',
        live: 'live streaming',
        ai: 'artificial intelligence'
      };

      query = categoryQueries[categoryId] || 'trending videos';

      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${encodeURIComponent(query)}&type=video&order=viewCount&key=${apiKey}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'YouTube API error');
      }
      
      setVideos(data.items || FALLBACK_VIDEOS);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setApiError(true);
      setVideos(FALLBACK_VIDEOS);
    } finally {
      setCategoryLoading(false);
    }
  };

  // Get video details
  const getVideoDetails = async (videoId: string) => {
    setLoading(true);
    
    try {
      const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
      
      if (!apiKey || apiKey === 'AIzaSyC_xXmBaJEgJremuUBe5uINlj3UHrUs954') {
        const fallbackVideo = FALLBACK_VIDEOS.find(v => v.id.videoId === videoId);
        if (fallbackVideo) {
          setSelectedVideo({
            id: videoId,
            title: fallbackVideo.snippet.title,
            description: fallbackVideo.snippet.description,
            channelTitle: fallbackVideo.snippet.channelTitle,
            publishedAt: fallbackVideo.snippet.publishedAt,
            viewCount: '1000000',
            likeCount: '50000',
            duration: 'PT3M30S',
            thumbnails: fallbackVideo.snippet.thumbnails
          });
        }
        return;
      }

      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${apiKey}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'YouTube API error');
      }
      
      if (data.items && data.items.length > 0) {
        const video = data.items[0];
        setSelectedVideo({
          id: video.id,
          title: video.snippet.title,
          description: video.snippet.description,
          channelTitle: video.snippet.channelTitle,
          publishedAt: video.snippet.publishedAt,
          viewCount: video.statistics.viewCount,
          likeCount: video.statistics.likeCount,
          duration: video.contentDetails.duration,
          thumbnails: video.snippet.thumbnails
        });
      }
    } catch (error) {
      console.error('Error fetching video details:', error);
      const fallbackVideo = FALLBACK_VIDEOS.find(v => v.id.videoId === videoId);
      if (fallbackVideo) {
        setSelectedVideo({
          id: videoId,
          title: fallbackVideo.snippet.title,
          description: fallbackVideo.snippet.description,
          channelTitle: fallbackVideo.snippet.channelTitle,
          publishedAt: fallbackVideo.snippet.publishedAt,
          viewCount: '1000000',
          likeCount: '50000',
          duration: 'PT3M30S',
          thumbnails: fallbackVideo.snippet.thumbnails
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Format duration
  const formatDuration = (duration: string) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return '3:30';
    
    const hours = (match[1] || '').replace('H', '');
    const minutes = (match[2] || '').replace('M', '');
    const seconds = (match[3] || '').replace('S', '');
    
    let result = '';
    if (hours) result += `${hours}:`;
    result += `${minutes.padStart(2, '0')}:`;
    result += seconds.padStart(2, '0');
    
    return result;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return '1 day ago';
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`;
    if (diffInHours < 720) return `${Math.floor(diffInHours / 168)} weeks ago`;
    if (diffInHours < 8760) return `${Math.floor(diffInHours / 720)} months ago`;
    return `${Math.floor(diffInHours / 8760)} years ago`;
  };

  // Format view count
  const formatViewCount = (count: string) => {
    const num = parseInt(count);
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M views`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K views`;
    }
    return `${num} views`;
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchVideos(searchQuery);
  };

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSearchQuery('');
    if (categoryId === 'all' || categoryId === 'trending') {
      getTrendingVideos();
    } else {
      getVideosByCategory(categoryId);
    }
  };

  // Handle video selection
  const handleVideoSelect = (video: YouTubeVideo) => {
    getVideoDetails(video.id.videoId);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setIsSearchMode(false);
    getTrendingVideos();
  };

  useEffect(() => {
    const initializeVideos = async () => {
      if (user) {
        await syncUser();
      }
      getTrendingVideos();
    };

    initializeVideos();
  }, [user, syncUser]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left side - Menu and Logo */}
          <div className="flex items-center">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg mr-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <Link href="/" className="flex items-center">
              <div className="flex items-center">
                <div className="w-8 h-6 bg-red-600 rounded-sm mr-1"></div>
                <span className="text-xl font-bold text-gray-900">Playground</span>
              </div>
            </Link>
          </div>

          {/* Center - Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="flex">
              <div className="flex-1 relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  className="w-full px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:border-blue-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>

          {/* Right side - User actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.5 19.5h15a2 2 0 002-2V6.5a2 2 0 00-2-2h-15a2 2 0 00-2 2v11a2 2 0 002 2z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
            </button>
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.firstName?.charAt(0) || 'U'}
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-4 py-2 overflow-x-auto">
          <div className="flex space-x-4 min-w-max">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 min-h-screen transition-all duration-300`}>
          <div className="p-4">
            {SIDEBAR_ITEMS.map((item) => (
              <button
                key={item.id}
                className={`w-full flex items-center px-3 py-2 rounded-lg mb-1 transition-colors ${
                  item.active
                    ? 'bg-gray-100 text-black'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-xl mr-3">{item.icon}</span>
                {!sidebarCollapsed && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {selectedVideo ? (
            <div className="max-w-4xl mx-auto">
              {/* Video Player */}
              <div className="mb-6">
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1&rel=0&modestbranding=1`}
                    title={selectedVideo.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>

              {/* Video Info */}
              <div className="mb-6">
                <h1 className="text-xl font-semibold text-gray-900 mb-2">
                  {selectedVideo.title}
                </h1>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-4">
                    <span>{formatViewCount(selectedVideo.viewCount)}</span>
                    <span>•</span>
                    <span>{formatDate(selectedVideo.publishedAt)}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1 hover:bg-gray-100 px-3 py-1 rounded-full">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                      <span>{formatViewCount(selectedVideo.likeCount)}</span>
                    </button>
                    <button className="hover:bg-gray-100 px-3 py-1 rounded-full">
                      Share
                    </button>
                    <button className="hover:bg-gray-100 px-3 py-1 rounded-full">
                      Save
                    </button>
                  </div>
                </div>

                {/* Channel Info */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {selectedVideo.channelTitle.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedVideo.channelTitle}</h3>
                      <p className="text-sm text-gray-600">1.2M subscribers</p>
                    </div>
                  </div>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full font-medium">
                    Subscribe
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {selectedVideo.description}
                </p>
              </div>
            </div>
          ) : (
            <div>
              {/* Video Grid */}
              {categoryLoading || searchLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="aspect-video bg-gray-200 rounded-lg mb-2"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : videos.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No videos found</h3>
                  <p className="text-gray-600">
                    {isSearchMode ? 'Try a different search term' : 'Try selecting a different category'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {videos.map((video) => (
                    <div
                      key={video.id.videoId}
                      onClick={() => handleVideoSelect(video)}
                      className="cursor-pointer group"
                    >
                      <div className="relative mb-2">
                        <img
                          src={video.snippet.thumbnails.medium.url}
                          alt={video.snippet.title}
                          className="w-full aspect-video object-cover rounded-lg group-hover:rounded-none transition-all duration-200"
                        />
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1 rounded">
                          {formatDuration('PT3M30S')}
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <div className="w-9 h-9 bg-gray-300 rounded-full flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-blue-600">
                            {video.snippet.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {video.snippet.channelTitle}
                          </p>
                          <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
                            <span>{formatViewCount('1000000')}</span>
                            <span>•</span>
                            <span>{formatDate(video.snippet.publishedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
