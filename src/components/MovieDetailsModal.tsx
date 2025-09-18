"use client";
import { useEffect } from "react";
import Image from "next/image";
import { useGetMovieDetailsQuery, useGetMovieCreditsQuery, useGetMovieVideosQuery } from "../features/movies/moviesSlice";
import SkeletonLoader from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import VideoPlayer from "./VideoPlayer";

interface MovieDetailsModalProps {
  movieId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function MovieDetailsModal({ movieId, isOpen, onClose }: MovieDetailsModalProps) {
  const { data: movieDetails, error: detailsError, isLoading: detailsLoading } = useGetMovieDetailsQuery(movieId, {
    skip: !isOpen,
  });
  const { data: movieCredits, error: creditsError, isLoading: creditsLoading } = useGetMovieCreditsQuery(movieId, {
    skip: !isOpen,
  });
  const { data: movieVideos, error: videosError, isLoading: videosLoading } = useGetMovieVideosQuery(movieId, {
    skip: !isOpen,
  });

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const director = movieCredits?.crew.find((person) => person.job === "Director");
  const mainCast = movieCredits?.cast.slice(0, 15); // Show more cast members since we're using horizontal scroll

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
      <div className="relative max-w-4xl w-full max-h-[90vh] bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-all duration-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="overflow-y-auto max-h-[90vh]">
          {detailsLoading && (
            <div className="p-6">
              <SkeletonLoader type="details" />
            </div>
          )}
          
          {detailsError && (
            <ErrorMessage message="Failed to load movie details" />
          )}

          {movieDetails && (
            <>
              {/* Hero Section */}
              <div className="relative h-64 md:h-80">
                {movieDetails.backdrop_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w1280${movieDetails.backdrop_path}`}
                    alt={movieDetails.title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                
                {/* Movie Info Overlay */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{movieDetails.title}</h1>
                  {movieDetails.tagline && (
                    <p className="text-lg md:text-xl text-gray-200 italic mb-2">{movieDetails.tagline}</p>
                  )}
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="flex items-center">
                      ⭐ {movieDetails.vote_average.toFixed(1)} ({movieDetails.vote_count.toLocaleString()} votes)
                    </span>
                    {movieDetails.runtime && (
                      <span>{formatRuntime(movieDetails.runtime)}</span>
                    )}
                    <span>{new Date(movieDetails.release_date).getFullYear()}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
                  {/* Poster */}
                  <div className="md:col-span-1">
                    {movieDetails.poster_path ? (
                      <div className="relative aspect-[2/3] w-full max-w-sm mx-auto">
                        <Image
                          src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
                          alt={movieDetails.title}
                          fill
                          className="object-cover rounded-lg shadow-lg"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[2/3] bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500">No poster available</span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="md:col-span-2 space-y-6">
                    {/* Overview */}
                    <div>
                      <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Overview</h2>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {movieDetails.overview || "No overview available."}
                      </p>
                    </div>

                    {/* Genres */}
                    {movieDetails.genres && movieDetails.genres.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Genres</h3>
                        <div className="flex flex-wrap gap-2">
                          {movieDetails.genres.map((genre) => (
                            <span
                              key={genre.id}
                              className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                            >
                              {genre.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Director */}
                    {director && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Director</h3>
                        <p className="text-gray-700 dark:text-gray-300">{director.name}</p>
                      </div>
                    )}

                    {/* Videos/Trailers */}
                    {movieVideos?.results && movieVideos.results.length > 0 && (
                      <div>
                        <VideoPlayer videos={movieVideos.results} />
                      </div>
                    )}

                    {/* Cast */}
                    {mainCast && mainCast.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Cast</h3>
                        <div className="flex gap-4 overflow-x-auto pb-4">
                          {mainCast.map((actor) => (
                            <div key={actor.id} className="flex-shrink-0 text-center w-20">
                              {actor.profile_path ? (
                                <div className="relative w-16 h-16 mx-auto mb-2">
                                  <Image
                                    src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                                    alt={actor.name}
                                    fill
                                    className="object-cover rounded-full ring-2 ring-gray-200 dark:ring-gray-700"
                                  />
                                </div>
                              ) : (
                                <div className="w-16 h-16 mx-auto mb-2 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center ring-2 ring-gray-200 dark:ring-gray-700">
                                  <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                  </svg>
                                </div>
                              )}
                              <p className="font-medium text-xs text-gray-900 dark:text-white truncate" title={actor.name}>
                                {actor.name}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400 truncate" title={actor.character}>
                                {actor.character}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Additional Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      {movieDetails.budget > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">Budget</h4>
                          <p className="text-gray-700 dark:text-gray-300">{formatMoney(movieDetails.budget)}</p>
                        </div>
                      )}
                      {movieDetails.revenue > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">Revenue</h4>
                          <p className="text-gray-700 dark:text-gray-300">{formatMoney(movieDetails.revenue)}</p>
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Status</h4>
                        <p className="text-gray-700 dark:text-gray-300">{movieDetails.status}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Original Language</h4>
                        <p className="text-gray-700 dark:text-gray-300">{movieDetails.original_language?.toUpperCase()}</p>
                      </div>
                    </div>

                    {/* External Links */}
                    <div className="flex gap-4 pt-4">
                      {movieDetails.imdb_id && (
                        <a
                          href={`https://www.imdb.com/title/${movieDetails.imdb_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors duration-200"
                        >
                          View on IMDb
                        </a>
                      )}
                      {movieDetails.homepage && (
                        <a
                          href={movieDetails.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200"
                        >
                          Official Website
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}