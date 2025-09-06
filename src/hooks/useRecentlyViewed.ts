"use client";
import { useState, useEffect, useCallback } from 'react';
import { MediaItem } from '../features/movies/moviesSlice';

const RECENTLY_VIEWED_KEY = 'movies-today-recently-viewed';
const MAX_RECENTLY_VIEWED = 50; // Limit to last 50 items

export interface RecentlyViewedItem extends MediaItem {
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
      ...item,
      mediaType,
      viewedAt: new Date().toISOString(),
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