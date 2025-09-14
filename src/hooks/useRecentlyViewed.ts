"use client";
import { useState, useEffect, useCallback } from 'react';
import { MediaItem } from '../features/movies/moviesSlice';

const RECENTLY_VIEWED_KEY = 'movies-today-recently-viewed';
const MAX_RECENTLY_VIEWED = 50; // Limit to last 50 items

export interface RecentlyViewedItem {
  id: number;
  title?: string; // for movies
  name?: string; // for tv shows
  overview: string;
  poster_path: string | null;
  release_date?: string; // for movies
  first_air_date?: string; // for tv shows
  vote_average: number;
  backdrop_path: string | null;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title?: string; // for movies
  original_name?: string; // for tv shows
  popularity: number;
  video?: boolean; // for movies
  vote_count: number;
  origin_country?: string[]; // for tv shows
  mediaType: 'movie' | 'tv';
  viewedAt: string;
}

export const useRecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load recently viewed from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
        if (stored) {
          const parsedItems = JSON.parse(stored);
          setRecentlyViewed(parsedItems);
        }
        setIsLoaded(true);
      }
    } catch (error) {
      console.error('Error loading recently viewed:', error);
      setIsLoaded(true);
    }
  }, []);

  // Save recently viewed to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      try {
        localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recentlyViewed));
      } catch (error) {
        console.error('Error saving recently viewed:', error);
      }
    }
  }, [recentlyViewed, isLoaded]);

  const addToRecentlyViewed = useCallback((item: MediaItem, mediaType: 'movie' | 'tv') => {
    const viewedItem: RecentlyViewedItem = {
      id: item.id,
      overview: item.overview,
      poster_path: item.poster_path,
      vote_average: item.vote_average,
      backdrop_path: item.backdrop_path,
      genre_ids: item.genre_ids,
      adult: item.adult,
      original_language: item.original_language,
      popularity: item.popularity,
      vote_count: item.vote_count,
      mediaType,
      viewedAt: new Date().toISOString(),
      // Conditional properties based on media type
      ...(mediaType === 'movie' && 'title' in item ? {
        title: item.title,
        release_date: item.release_date,
        original_title: item.original_title,
        video: item.video,
      } : {}),
      ...(mediaType === 'tv' && 'name' in item ? {
        name: item.name,
        first_air_date: item.first_air_date,
        original_name: item.original_name,
        origin_country: item.origin_country,
      } : {}),
    };

    setRecentlyViewed(prev => {
      // Remove existing entry if it exists
      const filtered = prev.filter(viewed => !(viewed.id === item.id && viewed.mediaType === mediaType));
      
      // Add new entry at the beginning
      const updated = [viewedItem, ...filtered];
      
      // Keep only the most recent MAX_RECENTLY_VIEWED items
      return updated.slice(0, MAX_RECENTLY_VIEWED);
    });
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([]);
  }, []);

  return {
    recentlyViewed,
    addToRecentlyViewed,
    clearRecentlyViewed,
    isLoaded,
  };
};