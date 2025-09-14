"use client";
import Link from "next/link";
import { Movie } from "../features/movies/moviesSlice";
import MovieCard from "./MovieCard";

interface MovieSectionProps {
  title: string;
  movies: Movie[];
  viewMoreLink: string;
  emoji: string;
  isLoading?: boolean;
}

export default function MovieSection({ 
  title, 
  movies, 
  viewMoreLink, 
  emoji, 

}: MovieSectionProps) {
  return (
    <section className="mb-12">
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <span className="text-3xl">{emoji}</span>
          {title}
        </h2>
      </div>

      {/* Movies Grid - Show 2 rows (10 items) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-6">
        {movies
          .filter(movie => movie && movie.id)
          .slice(0, 10) // Limit to 10 movies (2 rows on desktop)
          .map((movie) => (
            <MovieCard 
              key={movie.id} 
              item={movie}
              mediaType="movie"
            />
          ))}
      </div>

      {/* View More Button - Bottom of section */}
      <div className="text-center">
        <Link
          href={viewMoreLink}
          className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform"
        >
          View More {title}
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
}