"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Movie, TVShow, MediaItem } from "../features/movies/moviesSlice";
import { useFavorites } from "../hooks/useFavorites";

// Union type for all possible item types
type MovieCardItem = MediaItem | {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  backdrop_path: string | null;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title?: string;
  original_name?: string;
  popularity: number;
  video?: boolean;
  vote_count: number;
  origin_country?: string[];
};

interface MovieCardProps {
  item: MovieCardItem | null | undefined;
  mediaType: 'movie' | 'tv';
  onClick?: (id: number) => void;
}

export default function MovieCard({ item, mediaType, onClick }: MovieCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [imageError, setImageError] = useState(false);

  // Guard against undefined/null item
  if (!item) {
    return null;
  }
  const imageUrl = item.poster_path
    ? `https://image.tmdb.org/t/p/w780${item.poster_path}`
    : null;
  
  const title = mediaType === 'movie' 
    ? ('title' in item ? item.title : (item as Movie).title)
    : ('name' in item ? item.name : (item as TVShow).name);
  const releaseDate = mediaType === 'movie' 
    ? ('release_date' in item ? item.release_date : (item as Movie).release_date)
    : ('first_air_date' in item ? item.first_air_date : (item as TVShow).first_air_date);
  const linkHref = mediaType === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`;
  const isItemFavorite = isFavorite(item.id, mediaType);

  // Additional safety checks for required properties
  if (!title || !item.id) {
    return null;
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(item, mediaType);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const DefaultImagePlaceholder = () => (
    <div className="h-40 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800 flex flex-col items-center justify-center text-gray-600 dark:text-gray-300">
      <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V3a1 1 0 011 1v15a1 1 0 01-1 1H8a1 1 0 01-1-1V4zm0 0H7m10 0h3a1 1 0 011 1v15a1 1 0 01-1 1h-3m-7 0h7" />
      </svg>
      <span className="text-xs text-center px-2 opacity-75">
        {mediaType === 'movie' ? 'Movie' : 'TV Show'} Poster
      </span>
    </div>
  );

  
  if (onClick) {
    return (
      <div
        className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
        onClick={() => onClick(item.id)}
      >
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
        <div className="relative overflow-hidden">
          {imageUrl && !imageError ? (
            <Image
              src={imageUrl}
              alt={title}
              width={200}
              height={300}
              className="h-[15rem] lg:h-40 object-cover w-full transition-transform duration-300 group-hover:scale-110"
              onError={handleImageError}
            />
          ) : (
            <DefaultImagePlaceholder />
          )}
          
          {/* Favorite button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-all duration-200 hover:scale-110"
          >
            {isItemFavorite ? (
              <FaHeart className="w-4 h-4 text-red-500" />
            ) : (
              <FaRegHeart className="w-4 h-4 text-white" />
            )}
          </button>
        </div>
        <div className="p-4">
         <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            {releaseDate ? new Date(releaseDate).getFullYear() : 'N/A'}
          </p>
          <div className={`px-2 py-1 rounded-full text-sm font-semibold ${item.vote_average >= 5.0 ? 'text-green-500' : 'text-red-500'}`}>
            ⭐ {item.vote_average.toFixed(1)}/10
          </div>
         </div>

           <h3 className="font-semibold truncate text-base  text-gray-900 dark:text-white" title={title}>
            {title}
          </h3>
        </div>
      </div>
    </div>
    );
  }

  // Default Link behavior for main movie list
  return (
    <Link href={linkHref} className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl block">
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
        <div className="relative overflow-hidden">
          {imageUrl && !imageError ? (
            <Image
              src={imageUrl}
              alt={title}
              width={200}
              height={300}
              className="h-[15rem] lg:h-40 object-cover w-full transition-transform duration-300 group-hover:scale-110"
              onError={handleImageError}
            />
          ) : (
            <DefaultImagePlaceholder />
          )}
          
          {/* Favorite button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-all duration-200 hover:scale-110"
          >
            {isItemFavorite ? (
              <FaHeart className="w-4 h-4 text-red-500" />
            ) : (
              <FaRegHeart className="w-4 h-4 text-white" />
            )}
          </button>
        </div>
        <div className="p-4">
         <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            {releaseDate ? new Date(releaseDate).getFullYear() : 'N/A'}
          </p>
          <div className={`px-2 py-1 rounded-full text-sm font-semibold ${item.vote_average >= 5.0 ? 'text-green-500' : 'text-red-500'}`}>
            ⭐ {item.vote_average.toFixed(1)}/10
          </div>
         </div>

           <h3 className="font-semibold truncate text-base  text-gray-900 dark:text-white" title={title}>
            {title}
          </h3>
        </div>
      </div>
    </Link>
  );
}