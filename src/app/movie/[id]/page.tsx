"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  useGetMovieDetailsQuery, 
  useGetMovieCreditsQuery, 
  useGetMovieVideosQuery,
  useGetSimilarMoviesQuery 
} from "../../../features/movies/moviesSlice";
import SkeletonLoader from "../../../components/LoadingSpinner";
import ErrorMessage from "../../../components/ErrorMessage";
import VideoPlayer from "../../../components/VideoPlayer";
import MovieCard from "../../../components/MovieCard";
import { useRecentlyViewed } from "../../../hooks/useRecentlyViewed";

export default function MovieDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const movieId = parseInt(params.id as string);
  const { addToRecentlyViewed } = useRecentlyViewed();

  const { data: movieDetails, error: detailsError, isLoading: detailsLoading } = useGetMovieDetailsQuery(movieId);
  const { data: movieCredits, error: creditsError, isLoading: creditsLoading } = useGetMovieCreditsQuery(movieId);
  const { data: movieVideos, error: videosError, isLoading: videosLoading } = useGetMovieVideosQuery(movieId);
  const { data: similarMovies, error: similarError, isLoading: similarLoading } = useGetSimilarMoviesQuery({ id: movieId });

  // Add to recently viewed when movie details are loaded
  useEffect(() => {
    if (movieDetails) {
      // Convert MovieDetails to MediaItem format
      const mediaItem = {
        id: movieDetails.id,
        title: movieDetails.title,
        overview: movieDetails.overview,
        poster_path: movieDetails.poster_path,
        release_date: movieDetails.release_date,
        vote_average: movieDetails.vote_average,
        backdrop_path: movieDetails.backdrop_path,
        genre_ids: movieDetails.genres?.map(genre => genre.id) || [],
        adult: movieDetails.adult,
        original_language: movieDetails.original_language,
        original_title: movieDetails.original_title,
        popularity: movieDetails.popularity,
        video: movieDetails.video,
        vote_count: movieDetails.vote_count,
      };
      addToRecentlyViewed(mediaItem, 'movie');
    }
  }, [movieDetails, addToRecentlyViewed]);

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

  const handleMovieClick = (movieId: number) => {
    router.push(`/movie/${movieId}`);
  };

  if (detailsLoading) {
    return <SkeletonLoader type="details" />;
  }

  if (detailsError || !movieDetails) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <ErrorMessage message="Failed to load movie details" />
      </div>
    );
  }

  const director = movieCredits?.crew.find((person) => person.job === "Director");
  const mainCast = movieCredits?.cast.slice(0, 20);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Back Button */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Movies
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[60vh]">
        {movieDetails.backdrop_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}`}
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
        <div className="absolute bottom-8 left-8 right-8 text-white">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{movieDetails.title}</h1>
            {movieDetails.tagline && (
              <p className="text-xl md:text-2xl text-gray-200 italic mb-4">{movieDetails.tagline}</p>
            )}
            <div className="flex flex-wrap gap-3 sm:gap-6 text-lg">
              <span className={`flex items-center ${movieDetails.vote_average >= 5.0 ? 'text-green-400' : 'text-red-400'}`}>
                ⭐ {movieDetails.vote_average.toFixed(1)} ({movieDetails.vote_count.toLocaleString()} votes)
              </span>
              {movieDetails.runtime && (
                <span>{formatRuntime(movieDetails.runtime)}</span>
              )}
              <span>{new Date(movieDetails.release_date).getFullYear()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Poster */}
          <div className="lg:col-span-1">
            {movieDetails.poster_path ? (
              <div className="relative aspect-[2/3] w-full max-w-sm mx-auto lg:mx-0 sticky top-24">
                <Image
                  src={`https://image.tmdb.org/t/p/w780${movieDetails.poster_path}`}
                  alt={movieDetails.title}
                  fill
                  className="object-cover rounded-lg shadow-xl"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
            ) : (
              <div className="aspect-[2/3] bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center max-w-sm mx-auto lg:mx-0">
                <span className="text-gray-500">No poster available</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="lg:col-span-3 space-y-8">
            {/* Overview */}
            <div>
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Overview</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {movieDetails.overview || "No overview available."}
              </p>
            </div>

            {/* Genres */}
            {movieDetails.genres && movieDetails.genres.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Genres</h3>
                <div className="flex flex-wrap gap-3">
                  {movieDetails.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-lg font-medium"
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
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Director</h3>
                <p className="text-lg text-gray-700 dark:text-gray-300">{director.name}</p>
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
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Cast</h3>
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {mainCast.map((actor) => (
                    <div key={actor.id} className="flex-shrink-0 text-center w-24">
                      {actor.profile_path ? (
                        <div className="relative w-20 h-20 mx-auto mb-3">
                          <Image
                            src={`https://image.tmdb.org/t/p/w342${actor.profile_path}`}
                            alt={actor.name}
                            fill
                            className="object-cover rounded-full ring-2 ring-gray-200 dark:ring-gray-700"
                            sizes="80px"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 mx-auto mb-3 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center ring-2 ring-gray-200 dark:ring-gray-700">
                          <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                        </div>
                      )}
                      <p className="font-medium text-sm text-gray-900 dark:text-white truncate" title={actor.name}>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white col-span-full">Movie Details</h3>
              
              {movieDetails.budget > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-lg">Budget</h4>
                  <p className="text-gray-700 dark:text-gray-300">{formatMoney(movieDetails.budget)}</p>
                </div>
              )}
              {movieDetails.revenue > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-lg">Revenue</h4>
                  <p className="text-gray-700 dark:text-gray-300">{formatMoney(movieDetails.revenue)}</p>
                </div>
              )}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-lg">Status</h4>
                <p className="text-gray-700 dark:text-gray-300">{movieDetails.status}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-lg">Original Language</h4>
                <p className="text-gray-700 dark:text-gray-300">{movieDetails.original_language?.toUpperCase()}</p>
              </div>
            </div>

            {/* External Links */}
            <div className="flex gap-4">
              {movieDetails.imdb_id && (
                <a
                  href={`https://www.imdb.com/title/${movieDetails.imdb_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  View on IMDb
                </a>
              )}
              {movieDetails.homepage && (
                <a
                  href={movieDetails.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  Official Website
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Similar Movies */}
        {similarMovies?.results && similarMovies.results.length > 0 && (
          <div className="mt-12">
            <h3 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">You Might Also Like</h3>
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
              {similarMovies.results
                .filter(movie => movie && movie.id) // Filter out null/undefined items
                .slice(0, 10)
                .map((movie) => (
                  <MovieCard 
                    key={movie.id} 
                    item={movie}
                    mediaType="movie"
                    onClick={handleMovieClick}
                  />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}