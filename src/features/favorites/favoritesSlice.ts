import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MediaItem } from '../movies/moviesSlice';

export interface FavoriteItem extends MediaItem {
  mediaType: 'movie' | 'tv';
  addedAt: string;
}

interface FavoritesState {
  items: FavoriteItem[];
  isLoaded: boolean;
}

const initialState: FavoritesState = {
  items: [],
  isLoaded: false,
};

const FAVORITES_KEY = 'movies-today-favorites';
const MAX_FAVORITES = 100;

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    loadFavorites: (state) => {
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem(FAVORITES_KEY);
          if (stored) {
            const parsedFavorites = JSON.parse(stored);
            state.items = parsedFavorites;
          }
        } catch (error) {
          console.error('Error loading favorites:', error);
        }
        state.isLoaded = true;
      }
    },
    addFavorite: (state, action: PayloadAction<{ item: MediaItem; mediaType: 'movie' | 'tv' }>) => {
      const { item, mediaType } = action.payload;
      
      // Check if already exists
      const exists = state.items.some(fav => fav.id === item.id && fav.mediaType === mediaType);
      if (exists) return;

      const favoriteItem: FavoriteItem = {
        ...item,
        mediaType,
        addedAt: new Date().toISOString(),
      };

      // Add new favorite at the beginning and limit to MAX_FAVORITES
      state.items = [favoriteItem, ...state.items].slice(0, MAX_FAVORITES);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(FAVORITES_KEY, JSON.stringify(state.items));
        } catch (error) {
          console.error('Error saving favorites:', error);
        }
      }
    },
    removeFavorite: (state, action: PayloadAction<{ id: number; mediaType: 'movie' | 'tv' }>) => {
      const { id, mediaType } = action.payload;
      
      state.items = state.items.filter(fav => !(fav.id === id && fav.mediaType === mediaType));
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(FAVORITES_KEY, JSON.stringify(state.items));
        } catch (error) {
          console.error('Error saving favorites:', error);
        }
      }
    },
    clearFavorites: (state) => {
      state.items = [];
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem(FAVORITES_KEY);
        } catch (error) {
          console.error('Error clearing favorites:', error);
        }
      }
    },
  },
});

export const { loadFavorites, addFavorite, removeFavorite, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
export type { FavoriteItem };