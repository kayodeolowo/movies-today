"use client";
import { useState, useEffect } from 'react';
import { MediaItem } from '../features/movies/moviesSlice';

const FAVORITES_KEY = 'movies-today-favorites';
const MAX_FAVORITES = 100; // Limit to 100 favorite items

export interface FavoriteItem extends MediaItem {
  mediaType: 'movie' | 'tv';
  addedAt: string;
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Load favorites from localStorage on mount and when refresh is triggered
  useEffect(() => {
    console.log('Loading favorites from localStorage, refreshTrigger:', refreshTrigger);
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(FAVORITES_KEY);
        if (stored) {
          const parsedFavorites = JSON.parse(stored);
          console.log('Loaded favorites from localStorage:', parsedFavorites);
          setFavorites(parsedFavorites);
        } else {
          console.log('No favorites found in localStorage');
          setFavorites([]);
        }
        setIsLoaded(true);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      setIsLoaded(true);
    }
  }, [refreshTrigger]);

  // Listen for storage changes from other components/tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === FAVORITES_KEY && e.newValue) {
        try {
          const parsedFavorites = JSON.parse(e.newValue);
          setFavorites(parsedFavorites);
        } catch (error) {
          console.error('Error parsing favorites from storage event:', error);
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageChange);
      }
    };
  }, []);

  // Save favorites to localStorage whenever it changes (but not on initial load)
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.error('Error saving favorites:', error);
      }
    }
  }, [favorites, isLoaded]);

  const addToFavorites = (item: MediaItem, mediaType: 'movie' | 'tv') => {
    try {
      const favoriteItem: FavoriteItem = {
        ...item,
        mediaType,
        addedAt: new Date().toISOString(),
      };

      setFavorites(prev => {
        // Check if already exists
        if (prev.some(fav => fav.id === item.id && fav.mediaType === mediaType)) {
          return prev;
        }
        
        // Add new favorite at the beginning and limit to MAX_FAVORITES
        const updated = [favoriteItem, ...prev];
        return updated.slice(0, MAX_FAVORITES);
      });
    } catch (error) {
      console.error('Error in addToFavorites:', error);
    }
  };

  const removeFromFavorites = (id: number, mediaType: 'movie' | 'tv') => {
    console.log('removeFromFavorites called for:', id, mediaType);
    setFavorites(prev => {
      console.log('Previous favorites before removal:', prev);
      const filtered = prev.filter(fav => !(fav.id === id && fav.mediaType === mediaType));
      console.log('Filtered favorites after removal:', filtered);
      return filtered;
    });
  };

  const isFavorite = (id: number, mediaType: 'movie' | 'tv') => {
    return favorites.some(fav => fav.id === id && fav.mediaType === mediaType);
  };

  const toggleFavorite = (item: MediaItem, mediaType: 'movie' | 'tv') => {
    console.log('toggleFavorite called for:', item.id, mediaType);
    const isCurrentlyFavorite = isFavorite(item.id, mediaType);
    console.log('isCurrentlyFavorite:', isCurrentlyFavorite);
    
    if (isCurrentlyFavorite) {
      console.log('Removing from favorites');
      removeFromFavorites(item.id, mediaType);
    } else {
      console.log('Adding to favorites');
      addToFavorites(item, mediaType);
    }
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
  };
};