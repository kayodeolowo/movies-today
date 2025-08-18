"use client";
import Image from "next/image";
import Link from "next/link";
import { Movie } from "../features/movies/moviesSlice";

interface MovieCardProps {
  movie: Movie;
  onClick?: (movieId: number) => void;
}

export default function MovieCard({ movie, onClick }: MovieCardProps) {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/placeholder-movie.jpg";

  // If onClick is provided, use it (for similar movies navigation)
  // Otherwise, use Link for main navigation
  if (onClick) {
    return (
      <div
        className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
        onClick={() => onClick(movie.id)}
      >
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={imageUrl}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-sm font-semibold">
            ⭐ {movie.vote_average.toFixed(1)}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900 dark:text-white">
            {movie.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            {new Date(movie.release_date).getFullYear()}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-400 line-clamp-3">
            {movie.overview}
          </p>
        </div>
      </div>
    </div>
    );
  }

  // Default Link behavior for main movie list
  return (
    <Link href={`/movie/${movie.id}`} className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl block">
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={imageUrl}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-sm font-semibold">
            ⭐ {movie.vote_average.toFixed(1)}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900 dark:text-white">
            {movie.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            {new Date(movie.release_date).getFullYear()}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-400 line-clamp-3">
            {movie.overview}
          </p>
        </div>
      </div>
    </Link>
  );
}