import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  backdrop_path: string | null;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
  vote_count: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface MovieDetails extends Omit<Movie, 'genre_ids'> {
  belongs_to_collection: any;
  budget: number;
  genres: Genre[];
  homepage: string;
  imdb_id: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface MovieCredits {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface Video {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  official: boolean;
  published_at: string;
  site: string;
  size: number;
  type: string;
}

export interface MovieVideos {
  id: number;
  results: Video[];
}

interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

const API_READ_ACCESS_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_READ_ACCESS_TOKEN || '';
const BASE_URL = 'https://api.themoviedb.org/3';

export const moviesApi = createApi({
  reducerPath: 'moviesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      if (API_READ_ACCESS_TOKEN) {
        headers.set('Authorization', `Bearer ${API_READ_ACCESS_TOKEN}`);
      }
      headers.set('accept', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Movie'],
  endpoints: (builder) => ({
    getNowPlayingMovies: builder.query<MoviesResponse, { page?: number }>({
      query: ({ page = 1 } = {}) => `movie/now_playing?language=en-US&page=${page}`,
      providesTags: ['Movie'],
      keepUnusedDataFor: 300, // Cache for 5 minutes
    }),
    getPopularMovies: builder.query<MoviesResponse, { page?: number }>({
      query: ({ page = 1 } = {}) => `movie/popular?language=en-US&page=${page}`,
      providesTags: ['Movie'],
      keepUnusedDataFor: 300,
    }),
    getTopRatedMovies: builder.query<MoviesResponse, { page?: number }>({
      query: ({ page = 1 } = {}) => `movie/top_rated?language=en-US&page=${page}`,
      providesTags: ['Movie'],
      keepUnusedDataFor: 300,
    }),
    getMovieDetails: builder.query<MovieDetails, number>({
      query: (id) => `movie/${id}?language=en-US`,
      providesTags: (result, error, id) => [{ type: 'Movie', id }],
      keepUnusedDataFor: 600, // Cache for 10 minutes
    }),
    getMovieCredits: builder.query<MovieCredits, number>({
      query: (id) => `movie/${id}/credits`,
      providesTags: (result, error, id) => [{ type: 'Movie', id }],
      keepUnusedDataFor: 600, // Cache for 10 minutes
    }),
    getMovieVideos: builder.query<MovieVideos, number>({
      query: (id) => `movie/${id}/videos`,
      providesTags: (result, error, id) => [{ type: 'Movie', id }],
      keepUnusedDataFor: 600, // Cache for 10 minutes
    }),
    getSimilarMovies: builder.query<MoviesResponse, { id: number; page?: number }>({
      query: ({ id, page = 1 }) => `movie/${id}/similar?language=en-US&page=${page}`,
      providesTags: (result, error, { id }) => [{ type: 'Movie', id }],
      keepUnusedDataFor: 300, // Cache for 5 minutes
    }),
    searchMovies: builder.query<MoviesResponse, { query: string; page?: number }>({
      query: ({ query, page = 1 }) => `search/movie?query=${encodeURIComponent(query)}&language=en-US&page=${page}`,
      keepUnusedDataFor: 60, // Cache search results for 1 minute
    }),
  }),
});

export const {
  useGetNowPlayingMoviesQuery,
  useGetPopularMoviesQuery,
  useGetTopRatedMoviesQuery,
  useGetMovieDetailsQuery,
  useGetMovieCreditsQuery,
  useGetMovieVideosQuery,
  useGetSimilarMoviesQuery,
  useSearchMoviesQuery,
} = moviesApi;
