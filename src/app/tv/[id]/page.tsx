"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  useGetTVShowDetailsQuery, 
  useGetTVShowCreditsQuery, 
  useGetTVShowVideosQuery,
  useGetSimilarTVShowsQuery 
} from "../../../features/movies/moviesSlice";
import SkeletonLoader from "../../../components/LoadingSpinner";
import ErrorMessage from "../../../components/ErrorMessage";
import VideoPlayer from "../../../components/VideoPlayer";
import MovieCard from "../../../components/MovieCard";
import { useRecentlyViewed } from "../../../hooks/useRecentlyViewed";

export default function TVShowDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const tvShowId = parseInt(params.id as string);
  const { addToRecentlyViewed } = useRecentlyViewed();

  const { data: tvShowDetails, error: detailsError, isLoading: detailsLoading } = useGetTVShowDetailsQuery(tvShowId);
  const { data: tvShowCredits, error: creditsError, isLoading: creditsLoading } = useGetTVShowCreditsQuery(tvShowId);
  const { data: tvShowVideos, error: videosError, isLoading: videosLoading } = useGetTVShowVideosQuery(tvShowId);
  const { data: similarTVShows, error: similarError, isLoading: similarLoading } = useGetSimilarTVShowsQuery({ id: tvShowId });

  // Add to recently viewed when TV show details are loaded
  useEffect(() => {
    if (tvShowDetails) {
      // Convert TVShowDetails to MediaItem format
      const mediaItem = {
        id: tvShowDetails.id,
        name: tvShowDetails.name,
        overview: tvShowDetails.overview,
        poster_path: tvShowDetails.poster_path,
        first_air_date: tvShowDetails.first_air_date,
        vote_average: tvShowDetails.vote_average,
        backdrop_path: tvShowDetails.backdrop_path,
        genre_ids: tvShowDetails.genres?.map(genre => genre.id) || [],
        adult: tvShowDetails.adult,
        original_language: tvShowDetails.original_language,
        original_name: tvShowDetails.original_name,
        popularity: tvShowDetails.popularity,
        vote_count: tvShowDetails.vote_count,
        origin_country: tvShowDetails.origin_country || [],
      };
      addToRecentlyViewed(mediaItem, 'tv');
    }
  }, [tvShowDetails, addToRecentlyViewed]);

  const formatEpisodeRunTime = (runtimes: number[]) => {
    if (!runtimes || runtimes.length === 0) return "N/A";
    const avgRuntime = Math.round(runtimes.reduce((acc, curr) => acc + curr, 0) / runtimes.length);
    return `${avgRuntime} min`;
  };

  const formatAirDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const handleTVShowClick = (tvShowId: number) => {
    router.push(`/tv/${tvShowId}`);
  };

  if (detailsLoading) {
    return <SkeletonLoader type="details" />;
  }

  if (detailsError || !tvShowDetails) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <ErrorMessage message="Failed to load TV show details" />
      </div>
    );
  }

  const creators = tvShowDetails.created_by;
  const mainCast = tvShowCredits?.cast.slice(0, 20);

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
            Back to Shows
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[60vh]">
        {tvShowDetails.backdrop_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/original${tvShowDetails.backdrop_path}`}
            alt={tvShowDetails.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        {/* TV Show Info Overlay */}
        <div className="absolute bottom-8 left-8 right-8 text-white">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{tvShowDetails.name}</h1>
            {tvShowDetails.tagline && (
              <p className="text-xl md:text-2xl text-gray-200 italic mb-4">{tvShowDetails.tagline}</p>
            )}
            <div className="flex flex-wrap gap-6 text-lg">
              <span className={`flex items-center ${tvShowDetails.vote_average >= 5.0 ? 'text-green-400' : 'text-red-400'}`}>
                ⭐ {tvShowDetails.vote_average.toFixed(1)} ({tvShowDetails.vote_count.toLocaleString()} votes)
              </span>
              {tvShowDetails.episode_run_time && tvShowDetails.episode_run_time.length > 0 && (
                <span>{formatEpisodeRunTime(tvShowDetails.episode_run_time)}</span>
              )}
              <span>{new Date(tvShowDetails.first_air_date).getFullYear()}</span>
              <span>{tvShowDetails.number_of_seasons} Season{tvShowDetails.number_of_seasons > 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Poster */}
          <div className="lg:col-span-1">
            {tvShowDetails.poster_path ? (
              <div className="relative aspect-[2/3] w-full max-w-sm mx-auto lg:mx-0 sticky top-24">
                <Image
                  src={`https://image.tmdb.org/t/p/w780${tvShowDetails.poster_path}`}
                  alt={tvShowDetails.name}
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
                {tvShowDetails.overview || "No overview available."}
              </p>
            </div>

            {/* Genres */}
            {tvShowDetails.genres && tvShowDetails.genres.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Genres</h3>
                <div className="flex flex-wrap gap-3">
                  {tvShowDetails.genres.map((genre) => (
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

            {/* Creators */}
            {creators && creators.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  Creator{creators.length > 1 ? 's' : ''}
                </h3>
                <div className="flex flex-wrap gap-4">
                  {creators.map((creator) => (
                    <div key={creator.id} className="text-lg text-gray-700 dark:text-gray-300">
                      {creator.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Videos/Trailers */}
            {tvShowVideos?.results && tvShowVideos.results.length > 0 && (
              <div>
                <VideoPlayer videos={tvShowVideos.results} />
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

            {/* TV Show Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white col-span-full">Show Details</h3>
              
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-lg">Status</h4>
                <p className="text-gray-700 dark:text-gray-300">{tvShowDetails.status}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-lg">First Air Date</h4>
                <p className="text-gray-700 dark:text-gray-300">{formatAirDate(tvShowDetails.first_air_date)}</p>
              </div>

              {tvShowDetails.last_air_date && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-lg">Last Air Date</h4>
                  <p className="text-gray-700 dark:text-gray-300">{formatAirDate(tvShowDetails.last_air_date)}</p>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-lg">Episodes</h4>
                <p className="text-gray-700 dark:text-gray-300">{tvShowDetails.number_of_episodes} episodes</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-lg">Seasons</h4>
                <p className="text-gray-700 dark:text-gray-300">{tvShowDetails.number_of_seasons} seasons</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-lg">Original Language</h4>
                <p className="text-gray-700 dark:text-gray-300">{tvShowDetails.original_language?.toUpperCase()}</p>
              </div>

              {tvShowDetails.in_production && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-lg">Production Status</h4>
                  <p className="text-green-600 dark:text-green-400">In Production</p>
                </div>
              )}
            </div>

            {/* External Links */}
            <div className="flex gap-4">
              {tvShowDetails.homepage && (
                <a
                  href={tvShowDetails.homepage}
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

        {/* Similar TV Shows */}
        {similarTVShows?.results && similarTVShows.results.length > 0 && (
          <div className="mt-12">
            <h3 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">You Might Also Like</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {similarTVShows.results
                .filter(tvShow => tvShow && tvShow.id) // Filter out null/undefined items
                .slice(0, 10)
                .map((tvShow) => (
                  <MovieCard 
                    key={tvShow.id} 
                    item={tvShow}
                    mediaType="tv"
                    onClick={handleTVShowClick}
                  />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}