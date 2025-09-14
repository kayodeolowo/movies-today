"use client";
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { MediaItem } from '../features/movies/moviesSlice';
import { loadFavorites, addFavorite, removeFavorite } from '../features/favorites/favoritesSlice';
import type { FavoriteItem } from '../features/favorites/favoritesSlice';

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

  const addToFavorites = (item: MediaItem, mediaType: 'movie' | 'tv') => {
    dispatch(addFavorite({ item, mediaType }));
  };

  const removeFromFavorites = (id: number, mediaType: 'movie' | 'tv') => {
    dispatch(removeFavorite({ id, mediaType }));
  };

  const isFavorite = (id: number, mediaType: 'movie' | 'tv') => {
    return favorites.some(fav => fav.id === id && fav.mediaType === mediaType);
  };

  const toggleFavorite = (item: MediaItem, mediaType: 'movie' | 'tv') => {
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