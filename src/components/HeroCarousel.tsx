"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Movie, MediaItem } from "../features/movies/moviesSlice";

interface HeroCarouselProps {
  movies: Movie[];
  autoSlideInterval?: number;
  isLoading?: boolean;
}

export default function HeroCarousel({ movies, autoSlideInterval = 4000, isLoading = false }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<number>>(new Set());
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // The minimum distance for a swipe
  const minSwipeDistance = 50;

  // Auto-slide functionality - always runs regardless of hover
  useEffect(() => {
    if (movies.length <= 1) return;

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Start new interval
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
    }, autoSlideInterval);

    // Cleanup on unmount or dependency change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [movies.length, autoSlideInterval, currentIndex]); // Include currentIndex to reset timer after manual navigation

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + movies.length) % movies.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
  };

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  // Handle image load errors
  const handleImageError = (movieId: number) => {
    console.warn(`Failed to load image for movie ID: ${movieId}`);
    setImageLoadErrors(prev => new Set(prev).add(movieId));
  };

  // Handle successful image loads
  const handleImageLoad = (movieId: number) => {
    setImagesLoaded(prev => new Set(prev).add(movieId));
  };

  // Generate fallback gradient based on movie ID
  const getFallbackGradient = (movieId: number) => {
    const gradients = [
      "from-purple-900 via-blue-900 to-indigo-900",
      "from-red-900 via-pink-900 to-purple-900", 
      "from-blue-900 via-indigo-900 to-purple-900",
      "from-green-900 via-blue-900 to-purple-900",
      "from-yellow-900 via-orange-900 to-red-900",
      "from-teal-900 via-cyan-900 to-blue-900",
    ];
    return gradients[movieId % gradients.length];
  };

  // Skeleton loader when loading or no movies
  if (isLoading || !movies.length) {
    return (
      <div className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden rounded-2xl shadow-2xl">
        {/* Skeleton background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800 animate-pulse">
          {/* Shimmer effect */}
          <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        </div>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/30" />

        {/* Skeleton Content */}
        <div className="absolute inset-0 flex items-end">
          <div className="w-full p-6 md:p-8 lg:p-12">
            <div className="max-w-7xl mx-auto">
              <div className="max-w-3xl">
                {/* Skeleton Title */}
                <div className="h-12 md:h-16 lg:h-20 bg-white/20 rounded-lg mb-4 animate-pulse"></div>
                
                {/* Skeleton Details */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="h-6 w-16 bg-white/20 rounded animate-pulse"></div>
                  <div className="h-6 w-1 bg-white/20 rounded animate-pulse"></div>
                  <div className="h-6 w-12 bg-white/20 rounded animate-pulse"></div>
                  <div className="h-6 w-1 bg-white/20 rounded animate-pulse"></div>
                  <div className="h-6 w-20 bg-white/20 rounded-full animate-pulse"></div>
                </div>

                {/* Skeleton Overview */}
                <div className="space-y-3 mb-8">
                  <div className="h-5 bg-white/20 rounded animate-pulse"></div>
                  <div className="h-5 bg-white/20 rounded animate-pulse w-4/5"></div>
                  <div className="h-5 bg-white/20 rounded animate-pulse w-3/5"></div>
                </div>

                {/* Skeleton Buttons */}
                <div className="flex flex-wrap gap-4">
                  <div className="h-14 w-36 bg-white/20 rounded-full animate-pulse"></div>
                  <div className="h-14 w-32 bg-white/20 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skeleton Navigation Arrows */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/20 rounded-full animate-pulse"></div>
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/20 rounded-full animate-pulse"></div>

        {/* Skeleton Dots */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
            ))}
          </div>
        </div>

        {/* Skeleton Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
          <div className="h-full bg-white/30 w-1/3 animate-pulse"></div>
        </div>
      </div>
    );
  }

  const currentMovie = movies[currentIndex];

  return (
    <div 
      className="group relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden rounded-2xl shadow-2xl"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Background Images */}
      <div className="absolute inset-0">
        {movies.map((movie, index) => (
          <div
            key={movie.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {movie.backdrop_path && !imageLoadErrors.has(movie.id) ? (
              <>
                <Image
                  src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                  onError={() => handleImageError(movie.id)}
                  onLoad={() => handleImageLoad(movie.id)}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  quality={85}
                />
                {/* Loading skeleton overlay */}
                {!imagesLoaded.has(movie.id) && (
                  <div className="absolute inset-0 bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
                )}
              </>
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${getFallbackGradient(movie.id)}`}>
                {/* Overlay pattern for visual interest */}
                <div className="absolute inset-0 bg-black/20">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%), 
                                     radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
                                     radial-gradient(circle at 40% 70%, rgba(255,255,255,0.05) 0%, transparent 50%)`
                  }} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/30" />

      {/* Content */}
      <div className="absolute inset-0 flex items-end">
        <div className="w-full p-6 md:p-8 lg:p-12">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl">
              {/* Movie Title */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
                {currentMovie.title}
              </h2>

              {/* Movie Details */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-white/90">
                <div className="flex items-center space-x-2">
                  <span className={`text-lg font-semibold ${currentMovie.vote_average >= 5.0 ? 'text-green-400' : 'text-red-400'}`}>
                    ⭐ {currentMovie.vote_average.toFixed(1)}
                  </span>
                </div>
                <span className="text-lg">•</span>
                <span className="text-lg font-medium">
                  {new Date(currentMovie.release_date).getFullYear()}
                </span>
                <span className="text-lg">•</span>
                <span className="px-3 py-1 bg-blue-600/80 rounded-full text-sm font-medium backdrop-blur-sm">
                  🎬 Movie
                </span>
              </div>

              {/* Overview */}
              <p className="text-lg md:text-xl text-white/95 mb-8 leading-relaxed line-clamp-3 drop-shadow-lg">
                {currentMovie.overview || "No overview available."}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link
                  href={`/movie/${currentMovie.id}`}
                  className="inline-flex items-center px-8 py-4 bg-white text-gray-900 rounded-full font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-xl"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Watch Now
                </Link>
                <Link
                  href={`/movie/${currentMovie.id}`}
                  className="inline-flex items-center px-8 py-4 bg-white/20 text-white rounded-full font-bold text-lg hover:bg-white/30 backdrop-blur-sm transform hover:scale-105 transition-all duration-200 border border-white/30"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  More Info
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/30 hover:bg-black/60 text-white rounded-full backdrop-blur-sm transition-all duration-200 opacity-70 hover:opacity-100 hover:scale-110"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/30 hover:bg-black/60 text-white rounded-full backdrop-blur-sm transition-all duration-200 opacity-70 hover:opacity-100 hover:scale-110"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-3">
          {movies.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white scale-125 shadow-lg'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Animated Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <div
          className="h-full bg-white transition-all duration-1000 ease-linear"
          style={{ width: `${((currentIndex + 1) / movies.length) * 100}%` }}
        />
      </div>

      {/* Individual slide progress indicator */}
      <div className="absolute bottom-1 left-0 w-full h-1">
        <div
          key={currentIndex} // Reset animation when slide changes
          className="h-full bg-white/40 animate-progress"
          style={{
            width: `${100 / movies.length}%`,
            marginLeft: `${(currentIndex * 100) / movies.length}%`,
            animationDuration: `${autoSlideInterval}ms`
          }}
        />
      </div>
    </div>
  );
}