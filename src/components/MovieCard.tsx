"use client";
import Image from "next/image";
import Link from "next/link";
import { Movie, TVShow, MediaItem } from "../features/movies/moviesSlice";

interface MovieCardProps {
  item: MediaItem | null | undefined;
  mediaType: 'movie' | 'tv';
  onClick?: (id: number) => void;
}

export default function MovieCard({ item, mediaType, onClick }: MovieCardProps) {
  // Guard against undefined/null item
  if (!item) {
    return null;
  }

  const imageUrl = item.poster_path
    ? `https://image.tmdb.org/t/p/w780${item.poster_path}`
    : "/placeholder-movie.jpg";
  
  const title = mediaType === 'movie' ? (item as Movie).title : (item as TVShow).name;
  const releaseDate = mediaType === 'movie' ? (item as Movie).release_date : (item as TVShow).first_air_date;
  const linkHref = mediaType === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`;

  // Additional safety checks for required properties
  if (!title || !item.id) {
    return null;
  }

  
  if (onClick) {
    return (
      <div
        className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
        onClick={() => onClick(item.id)}
      >
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
        <div className="relative  overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            width={200}
            height={300}
            className="h-40 object-cover w-full transition-transform duration-300 group-hover:scale-110"
           
          />
          
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

        

           <h3 className="font-semibold truncate  text-base mb-2 line-clamp-2 text-gray-900 dark:text-white">
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
        <div className="relative  overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            width={200}
            height={300}
            className="h-40 object-cover w-full transition-transform duration-300 group-hover:scale-110"
           
          />
          
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

        

           <h3 className="font-semibold truncate  text-base mb-2 line-clamp-2 text-gray-900 dark:text-white">
            {title}
          </h3>
      
        </div>
      </div>
    </Link>
  );
}