"use client";
import { useState, useCallback } from "react";
import { 
  useGetNowPlayingMoviesQuery, 
  useGetPopularMoviesQuery, 
  useGetTopRatedMoviesQuery,
  useSearchMoviesQuery 
} from "../features/movies/moviesSlice";
import MovieCard from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import SearchBar from "../components/SearchBar";
import CategoryTabs from "../components/CategoryTabs";
import Pagination from "../components/Pagination";

export default function Home() {
  const [activeTab, setActiveTab] = useState("now_playing");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when tab or search changes
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
    if (searchQuery) {
      setSearchQuery("");
    }
  }, [searchQuery]);

  const handleSearch = useCallback((query: string) => {
    if (query.length >= 3) {
      setSearchQuery(query);
      setCurrentPage(1);
    }
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // API queries with pagination
  const nowPlayingQuery = useGetNowPlayingMoviesQuery(
    { page: currentPage }, 
    { skip: activeTab !== "now_playing" || !!searchQuery }
  );
  const popularQuery = useGetPopularMoviesQuery(
    { page: currentPage }, 
    { skip: activeTab !== "popular" || !!searchQuery }
  );
  const topRatedQuery = useGetTopRatedMoviesQuery(
    { page: currentPage }, 
    { skip: activeTab !== "top_rated" || !!searchQuery }
  );
  const searchQueryResult = useSearchMoviesQuery(
    { query: searchQuery, page: currentPage }, 
    { skip: !searchQuery || searchQuery.length < 3 }
  );

  const getCurrentQuery = () => {
    if (searchQuery && searchQuery.length >= 3) return searchQueryResult;
    switch (activeTab) {
      case "popular": return popularQuery;
      case "top_rated": return topRatedQuery;
      default: return nowPlayingQuery;
    }
  };

  const { data, error, isLoading, refetch } = getCurrentQuery();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-6">
            🎬 Movies Today
          </h1>
          <SearchBar 
            onSearch={handleSearch} 
            onClear={handleClearSearch}
            currentQuery={searchQuery}
          />
          {searchQuery && (
            <div className="text-center mt-4">
              <span className="text-gray-600 dark:text-gray-400">
                Searching for: "{searchQuery}" • Page {currentPage}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {!searchQuery && (
          <CategoryTabs activeTab={activeTab} onTabChange={handleTabChange} />
        )}

        {/* Loading State */}
        {isLoading && <LoadingSpinner />}

        {/* Error State */}
        {error && (
          <ErrorMessage 
            message="Failed to load movies. Please check your internet connection and try again."
            onRetry={refetch}
          />
        )}

        {/* Movies Grid */}
        {data?.results && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {data.results.map((movie) => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie}
                />
              ))}
            </div>

            {/* Pagination */}
            {data.total_pages > 1 && (
              <>
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.min(data.total_pages, 500)} // TMDB API limit
                  onPageChange={handlePageChange}
                  isLoading={isLoading}
                />
                <div className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
                  Showing page {currentPage} of {Math.min(data.total_pages, 500)} ({data.total_results.toLocaleString()} total results)
                </div>
              </>
            )}
          </>
        )}

        {/* No Results */}
        {data?.results && data.results.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-xl font-semibold mb-2">No movies found</h3>
              <p>Try searching for something else or check back later.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
