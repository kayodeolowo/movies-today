"use client";
import Link from "next/link";
import { useFavorites } from "../../hooks/useFavorites";
import MovieCard from "../../components/MovieCard";

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  console.log('FavoritesPage render - favorites count:', favorites.length);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
     

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {favorites.length === 0 ? (
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
          <>
            {/* Filter tabs */}
            <div className="mb-8 w-fit mx-auto">
              <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
                <button className="px-4 py-2 text-sm font-medium bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm">
                  All ({favorites.length})
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Movies ({favorites.filter(f => f.mediaType === 'movie').length})
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  TV Shows ({favorites.filter(f => f.mediaType === 'tv').length})
                </button>
              </div>
            </div>

            {/* Favorites Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {favorites
                .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
                .map((item) => (
                  <MovieCard
                    key={`${item.id}-${item.mediaType}`}
                    item={item}
                    mediaType={item.mediaType}
                  />
                ))}
            </div>

            
          </>
        )}
      </main>
    </div>
  );
}