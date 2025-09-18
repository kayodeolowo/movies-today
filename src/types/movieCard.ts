export interface MovieCardItem {
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
}

export interface MovieCardProps {
  item: MovieCardItem | null | undefined;
  mediaType: 'movie' | 'tv';
  onClick?: (id: number) => void;
}