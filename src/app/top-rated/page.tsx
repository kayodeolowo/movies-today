"use client";
import { useState, useCallback } from "react";
import { useGetTopRatedMoviesQuery } from "../../features/movies/moviesSlice";
import MovieCard from "../../components/MovieCard";
import SkeletonLoader from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import Pagination from "../../components/Pagination";

export default function TopRatedMoviesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data, error, isLoading, refetch } = useGetTopRatedMoviesQuery({ page: currentPage });

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              ⭐ Top Rated Movies
            </h1>
            <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full text-sm font-medium">
              Highest Rated
            </span>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            The highest rated movies of all time
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Loading State */}
        {isLoading && <SkeletonLoader type="grid" count={20} />}

        {/* Error State */}
        {error && (
          <ErrorMessage 
            message="Failed to load top rated movies. Please try again."
            onRetry={refetch}
          />
        )}

        {/* Movies Grid */}
        {data?.results && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
              {data.results
                .filter(item => item && item.id)
                .map((movie) => (
                  <MovieCard 
                    key={movie.id} 
                    item={movie}
                    mediaType="movie"
                  />
                ))}
            </div>

            {/* Pagination */}
            {data.total_pages > 1 && (
              <>
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.min(data.total_pages, 500)}
                  onPageChange={handlePageChange}
                  isLoading={isLoading}
                />
              
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}