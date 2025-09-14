"use client";
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { MediaItem } from '../features/movies/moviesSlice';
import { loadFavorites, addFavorite, removeFavorite } from '../features/favorites/favoritesSlice';
import type { FavoriteItem } from '../features/favorites/favoritesSlice';

// Type for items that can be added to favorites
type FavoriteableItem = MediaItem | {
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

export { FavoriteItem };

export const useFavorites = () => {
  const dispatch = useDispatch();
  const { items: favorites, isLoaded } = useSelector((state: RootState) => state.favorites);

  // Load favorites from localStorage on mount
  useEffect(() => {
    if (!isLoaded) {
      dispatch(loadFavorites());
    }
  }, [dispatch, isLoaded]);

  const addToFavorites = (item: FavoriteableItem, mediaType: 'movie' | 'tv') => {
    dispatch(addFavorite({ item: item as MediaItem, mediaType }));
  };

  const removeFromFavorites = (id: number, mediaType: 'movie' | 'tv') => {
    dispatch(removeFavorite({ id, mediaType }));
  };

  const isFavorite = (id: number, mediaType: 'movie' | 'tv') => {
    return favorites.some(fav => fav.id === id && fav.mediaType === mediaType);
  };

  const toggleFavorite = (item: FavoriteableItem, mediaType: 'movie' | 'tv') => {
    const isCurrentlyFavorite = isFavorite(item.id, mediaType);
    
    if (isCurrentlyFavorite) {
      removeFromFavorites(item.id, mediaType);
    } else {
      addToFavorites(item, mediaType);
    }
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    isLoaded,
  };
};