"use client";
import { useState, useCallback } from "react";
import { 
  useGetNowPlayingMoviesQuery, 
  useGetPopularMoviesQuery, 
  useGetTopRatedMoviesQuery,
  useGetUpcomingMoviesQuery,
  useGetPopularTVShowsQuery,
  useGetTopRatedTVShowsQuery,
  useGetOnTheAirTVShowsQuery,
  useGetAiringTodayTVShowsQuery,
  useSearchMoviesQuery 
} from "../features/movies/moviesSlice";
import MovieCard from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import SearchBar from "../components/SearchBar";
import MediaFilters, { MediaType, MovieCategory, TVCategory } from "../components/MediaFilters";
import Pagination from "../components/Pagination";
import HeroCarousel from "../components/HeroCarousel";

export default function Home() {
  const [mediaType, setMediaType] = useState<MediaType>("movie");
  const [movieCategory, setMovieCategory] = useState<MovieCategory>("now_playing");
  const [tvCategory, setTVCategory] = useState<TVCategory>("popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when filters or search changes
  const handleMediaTypeChange = useCallback((type: MediaType) => {
    setMediaType(type);
    setCurrentPage(1);
    if (searchQuery) {
      setSearchQuery("");
    }
  }, [searchQuery]);

  const handleMovieCategoryChange = useCallback((category: MovieCategory) => {
    setMovieCategory(category);
    setCurrentPage(1);
  }, []);

  const handleTVCategoryChange = useCallback((category: TVCategory) => {
    setTVCategory(category);
    setCurrentPage(1);
  }, []);

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

  // Movie API queries
  const nowPlayingQuery = useGetNowPlayingMoviesQuery(
    { page: currentPage }, 
    { skip: mediaType !== "movie" || movieCategory !== "now_playing" || !!searchQuery }
  );
  const popularMoviesQuery = useGetPopularMoviesQuery(
    { page: currentPage }, 
    { skip: mediaType !== "movie" || movieCategory !== "popular" || !!searchQuery }
  );
  const topRatedMoviesQuery = useGetTopRatedMoviesQuery(
    { page: currentPage }, 
    { skip: mediaType !== "movie" || movieCategory !== "top_rated" || !!searchQuery }
  );
  const upcomingQuery = useGetUpcomingMoviesQuery(
    { page: currentPage }, 
    { skip: mediaType !== "movie" || movieCategory !== "upcoming" || !!searchQuery }
  );
  
  // TV Show API queries
  const popularTVQuery = useGetPopularTVShowsQuery(
    { page: currentPage }, 
    { skip: mediaType !== "tv" || tvCategory !== "popular" || !!searchQuery }
  );
  const topRatedTVQuery = useGetTopRatedTVShowsQuery(
    { page: currentPage }, 
    { skip: mediaType !== "tv" || tvCategory !== "top_rated" || !!searchQuery }
  );
  const onTheAirQuery = useGetOnTheAirTVShowsQuery(
    { page: currentPage }, 
    { skip: mediaType !== "tv" || tvCategory !== "on_the_air" || !!searchQuery }
  );
  const airingTodayQuery = useGetAiringTodayTVShowsQuery(
    { page: currentPage }, 
    { skip: mediaType !== "tv" || tvCategory !== "airing_today" || !!searchQuery }
  );
  
  const searchQueryResult = useSearchMoviesQuery(
    { query: searchQuery, page: currentPage }, 
    { skip: !searchQuery || searchQuery.length < 3 }
  );

  // Hero carousel data - always fetch popular movies for the carousel
  const heroCarouselQuery = useGetPopularMoviesQuery({ page: 1 });

  const getCurrentQuery = () => {
    if (searchQuery && searchQuery.length >= 3) return searchQueryResult;
    
    if (mediaType === "movie") {
      switch (movieCategory) {
        case "popular": return popularMoviesQuery;
        case "top_rated": return topRatedMoviesQuery;
        case "upcoming": return upcomingQuery;
        default: return nowPlayingQuery;
      }
    } else {
      switch (tvCategory) {
        case "popular": return popularTVQuery;
        case "top_rated": return topRatedTVQuery;
        case "on_the_air": return onTheAirQuery;
        case "airing_today": return airingTodayQuery;
        default: return popularTVQuery;
      }
    }
  };

  const { data, error, isLoading, refetch } = getCurrentQuery();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Carousel Section */}
      {!searchQuery && heroCarouselQuery.data?.results && (
        <section className="bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <HeroCarousel 
              movies={
                heroCarouselQuery.data.results
                  .filter(movie => movie.backdrop_path !== null && movie.backdrop_path !== undefined)
                  .slice(0, 8)
                  .slice(0, 5)
              } 
            />
          </div>
        </section>
      )}

      {/* Header */}
      <header className="">
        <div className="max-w-7xl mx-auto px-4 py-6">
        
          
          {/* Search and Filters Row */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-6 max-w-6xl mx-auto">
            {/* Search Bar */}
            <div className="w-full lg:flex-1 max-w-md lg:max-w-lg">
              <SearchBar 
                onSearch={handleSearch} 
                onClear={handleClearSearch}
                currentQuery={searchQuery}
                placeholder="Search movies and TV shows..."
              />
            </div>
            
            {/* Filters */}
            {!searchQuery && (
              <div className="w-full lg:w-auto lg:flex-shrink-0">
                <MediaFilters 
                  mediaType={mediaType}
                  movieCategory={movieCategory}
                  tvCategory={tvCategory}
                  onMediaTypeChange={handleMediaTypeChange}
                  onMovieCategoryChange={handleMovieCategoryChange}
                  onTVCategoryChange={handleTVCategoryChange}
                />
              </div>
            )}
          </div>
          
          {/* Search Results Indicator */}
          {searchQuery && (
            <div className="text-center mt-6">
              <span className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Searching for: "{searchQuery}" • Page {currentPage}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">

        {/* Loading State */}
        {isLoading && <LoadingSpinner />}

        {/* Error State */}
        {error && (
          <ErrorMessage 
            message="Failed to load movies. Please check your internet connection and try again."
            onRetry={refetch}
          />
        )}

        {/* Media Grid */}
        {data?.results && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {data.results
                .filter(item => item && item.id) // Filter out null/undefined items
                .map((item) => (
                  <MovieCard 
                    key={item.id} 
                    item={item}
                    mediaType={mediaType}
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
              <h3 className="text-xl font-semibold mb-2">No {mediaType === 'movie' ? 'movies' : 'TV shows'} found</h3>
              <p>Try searching for something else or check back later.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
