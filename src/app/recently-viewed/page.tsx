"use client";
import { useState } from "react";
import Link from "next/link";
import { useRecentlyViewed } from "../../hooks/useRecentlyViewed";
import MovieCard from "../../components/MovieCard";
import SkeletonLoader from "../../components/LoadingSpinner";

type FilterType = 'all' | 'movie' | 'tv';

export default function RecentlyViewedPage() {
  const { recentlyViewed, clearRecentlyViewed, isLoaded } = useRecentlyViewed();
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredItems = recentlyViewed.filter(item => 
    filter === 'all' || item.mediaType === filter
  );

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">Recently Viewed</h1>
            <div className="mb-8 w-fit mx-auto">
              <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
                <div className="px-4 py-2 text-sm font-medium bg-gray-200 dark:bg-gray-600 rounded-md animate-pulse h-8 w-16"></div>
                <div className="px-4 py-2 text-sm font-medium bg-gray-200 dark:bg-gray-600 rounded-md animate-pulse h-8 w-20"></div>
                <div className="px-4 py-2 text-sm font-medium bg-gray-200 dark:bg-gray-600 rounded-md animate-pulse h-8 w-24"></div>
              </div>
            </div>
          </div>
          <SkeletonLoader type="grid" count={12} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {recentlyViewed.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 dark:text-gray-500 mb-6">
              <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-2xl font-semibold mb-2 text-gray-700 dark:text-gray-300">
                No viewing history yet
              </h3>
              <p className="text-lg mb-6">
                Start exploring movies and TV shows to see your viewing history here!
              </p>
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Discover Movies & Shows
              </Link>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">Recently Viewed</h1>
            {/* Filter tabs */}
            <div className="mb-8 w-fit mx-auto">
              <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                <button 
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    filter === 'all' 
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  All ({recentlyViewed.length})
                </button>
                <button 
                  onClick={() => setFilter('movie')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    filter === 'movie' 
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Movies ({recentlyViewed.filter(f => f.mediaType === 'movie').length})
                </button>
                <button 
                  onClick={() => setFilter('tv')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    filter === 'tv' 
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  TV Shows ({recentlyViewed.filter(f => f.mediaType === 'tv').length})
                </button>
              </div>
            </div>

            {/* Recently Viewed Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
              {filteredItems.map((item) => (
                <div key={`${item.id}-${item.mediaType}-${item.viewedAt}`} className="relative">
                  <MovieCard
                    item={item}
                    mediaType={item.mediaType}
                  />
                  {/* Viewed timestamp */}
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                    {formatTimeAgo(item.viewedAt)}
                  </div>
                </div>
              ))}
            </div>

           
          </>
        )}
      </main>
    </div>
  );
}