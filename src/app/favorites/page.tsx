"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useFavorites, FavoriteItem } from "../../hooks/useFavorites";
import MovieCard from "../../components/MovieCard";
import SkeletonLoader from "../../components/LoadingSpinner";

type FilterType = 'all' | 'movie' | 'tv';

// Lazy loading component for favorites grid
function LazyFavoritesGrid({ favorites }: { favorites: FavoriteItem[] }) {
  const [visibleItems, setVisibleItems] = useState(8); // Start with 8 items
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Reset visible items when favorites change (filter change)
  useEffect(() => {
    setVisibleItems(8);
  }, [favorites.length]);

  const loadMore = () => {
    setIsLoadingMore(true);
    // Simulate slight delay for better UX
    setTimeout(() => {
      setVisibleItems(prev => Math.min(prev + 8, favorites.length));
      setIsLoadingMore(false);
    }, 300);
  };

  const displayedItems = favorites
    .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
    .slice(0, visibleItems);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
        {displayedItems.map((item) => (
          <MovieCard
            key={`${item.id}-${item.mediaType}`}
            item={item}
            mediaType={item.mediaType}
          />
        ))}
      </div>
      
      {/* Load more button */}
      {visibleItems < favorites.length && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            disabled={isLoadingMore}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors duration-200 inline-flex items-center"
          >
            {isLoadingMore ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </>
            ) : (
              `Load More (${favorites.length - visibleItems} remaining)`
            )}
          </button>
        </div>
      )}
    </>
  );
}

export default function FavoritesPage() {
  const { favorites, isLoaded } = useFavorites();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [showContent, setShowContent] = useState(false);

  const filteredFavorites = favorites.filter(favorite => {
    if (activeFilter === 'all') return true;
    return favorite.mediaType === activeFilter;
  });

  // Show page instantly, then load content
  useEffect(() => {
    // Show the page structure immediately
    setShowContent(true);
  }, []);

  // Always show the page structure immediately
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">My Favorites</h1>
        
        {!isLoaded ? (
          // Show skeleton while loading
          <>
            <div className="mb-8 w-fit mx-auto">
              <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
                <div className="px-4 py-2 text-sm font-medium bg-gray-200 dark:bg-gray-600 rounded-md animate-pulse h-8 w-16"></div>
                <div className="px-4 py-2 text-sm font-medium bg-gray-200 dark:bg-gray-600 rounded-md animate-pulse h-8 w-20"></div>
                <div className="px-4 py-2 text-sm font-medium bg-gray-200 dark:bg-gray-600 rounded-md animate-pulse h-8 w-24"></div>
              </div>
            </div>
            <SkeletonLoader type="grid" count={12} />
          </>
        ) : favorites.length === 0 ? (
          // Empty state
          <div className="text-center py-16">
            <div className="text-gray-400 dark:text-gray-500 mb-6">
              <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h3 className="text-2xl font-semibold mb-2 text-gray-700 dark:text-gray-300">
                No favorites yet
              </h3>
              <p className="text-lg mb-6">
                Start exploring movies and TV shows, then click the heart icon to add them to your favorites!
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
          // Content loaded
          <>
            {/* Filter tabs */}
            <div className="mb-8 w-fit mx-auto">
              <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
                <button 
                  onClick={() => setActiveFilter('all')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    activeFilter === 'all' 
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  All ({favorites.length})
                </button>
                <button 
                  onClick={() => setActiveFilter('movie')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    activeFilter === 'movie' 
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  Movies ({favorites.filter(f => f.mediaType === 'movie').length})
                </button>
                <button 
                  onClick={() => setActiveFilter('tv')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    activeFilter === 'tv' 
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  TV Shows ({favorites.filter(f => f.mediaType === 'tv').length})
                </button>
              </div>
            </div>

            {/* Lazy loaded favorites grid */}
            <LazyFavoritesGrid favorites={filteredFavorites} />
          </>
        )}
      </main>
    </div>
  );
}