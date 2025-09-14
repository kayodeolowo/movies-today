"use client";
import Dropdown from "./Dropdown";

export type MediaType = 'movie' | 'tv';
export type MovieCategory = 'now_playing' | 'popular' | 'top_rated' | 'upcoming';
export type TVCategory = 'popular' | 'top_rated' | 'on_the_air' | 'airing_today';

interface MediaFiltersProps {
  mediaType: MediaType;
  movieCategory: MovieCategory;
  tvCategory: TVCategory;
  onMediaTypeChange: (type: MediaType) => void;
  onMovieCategoryChange: (category: MovieCategory) => void;
  onTVCategoryChange: (category: TVCategory) => void;
}

const mediaTypeOptions = [
  { id: "movie", label: "Movies", icon: "🎬" },
  { id: "tv", label: "TV Series", icon: "📺" },
];

const movieCategories = [
  { id: "now_playing", label: "Now Playing", icon: "🎪" },
  { id: "popular", label: "Popular", icon: "🔥" },
  { id: "top_rated", label: "Top Rated", icon: "⭐" },
  { id: "upcoming", label: "Upcoming", icon: "🔮" },
];

const tvCategories = [
  { id: "popular", label: "Popular", icon: "🔥" },
  { id: "top_rated", label: "Top Rated", icon: "⭐" },
  { id: "on_the_air", label: "On The Air", icon: "📡" },
  { id: "airing_today", label: "Airing Today", icon: "📅" },
];

export default function MediaFilters({
  mediaType,
  movieCategory,
  tvCategory,
  onMediaTypeChange,
  onMovieCategoryChange,
  onTVCategoryChange,
}: MediaFiltersProps) {
  const currentCategories = mediaType === 'movie' ? movieCategories : tvCategories;
  const activeCategory = mediaType === 'movie' ? movieCategory : tvCategory;

  const handleCategoryChange = (categoryId: string) => {
    if (mediaType === 'movie') {
      onMovieCategoryChange(categoryId as MovieCategory);
    } else {
      onTVCategoryChange(categoryId as TVCategory);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center gap-4 w-full">
      {/* Media Type Dropdown - 50% of the filters container (25% of screen) */}
      <div className="w-full lg:w-1/2">
        <Dropdown
          options={mediaTypeOptions}
          value={mediaType}
          onChange={(value) => onMediaTypeChange(value as MediaType)}
          placeholder="Select Media Type"
          className="w-full"
        />
      </div>

      {/* Category Dropdown - 50% of the filters container (25% of screen) */}
      <div className="w-full lg:w-1/2">
        <Dropdown
          options={currentCategories}
          value={activeCategory}
          onChange={handleCategoryChange}
          placeholder="Select Category"
          className="w-full"
        />
      </div>
    </div>
  );
}