// TMDB API utility functions

const TMDB_API_KEY = 'b31d2e5f33b74ffa7b3b483ff353f760';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export type Movie = {
  id: number;
  imdb_id: string;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  genres: { id: number; name: string }[];
  runtime?: number;
  vote_average?: number;
  original_language?: string;
  status?: string;
  budget?: number;
  revenue?: number;
  backdrop_path?: string;
};

type Video = {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
};

type MovieListItem = {
  id: number;
  imdb_id?: string;
  title: string;
  poster_path: string;
  release_date: string;
  genre_ids: number[];
};

export async function getMovieByImdbId(imdbId: string): Promise<Movie | null> {
  try {
    // First, find the TMDB ID using the IMDB ID
    const findUrl = `${TMDB_BASE_URL}/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;
    const findResponse = await fetch(findUrl);
    const findData = await findResponse.json();
    
    // Check if we found any movie results
    if (!findData.movie_results || findData.movie_results.length === 0) {
      return null;
    }
    
    // Get the TMDB ID from the first result
    const tmdbId = findData.movie_results[0].id;
    
    // Now get the full movie details using the TMDB ID
    const detailsUrl = `${TMDB_BASE_URL}/movie/${tmdbId}?api_key=${TMDB_API_KEY}`;
    const detailsResponse = await fetch(detailsUrl);
    const movieData = await detailsResponse.json();
    
    return {
      id: movieData.id,
      imdb_id: imdbId,
      title: movieData.title,
      overview: movieData.overview,
      poster_path: movieData.poster_path,
      release_date: movieData.release_date,
      genres: movieData.genres || [],
      runtime: movieData.runtime,
      vote_average: movieData.vote_average,
      original_language: movieData.original_language,
      status: movieData.status,
      budget: movieData.budget,
      revenue: movieData.revenue,
      backdrop_path: movieData.backdrop_path,
    };
  } catch (error) {
    console.error('Error fetching movie by IMDB ID:', error);
    return null;
  }
}

export async function getPopularMovies(page: number = 1): Promise<MovieListItem[]> {
  try {
    const url = `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`;
    const response = await fetch(url);
    const data = await response.json();
    
    // For each movie, get its IMDB ID
    const moviesWithImdbIds = await Promise.all(
      data.results.map(async (movie: any) => {
        try {
          const detailsUrl = `${TMDB_BASE_URL}/movie/${movie.id}?api_key=${TMDB_API_KEY}`;
          const detailsResponse = await fetch(detailsUrl);
          const movieDetails = await detailsResponse.json();
          
          return {
            ...movie,
            imdb_id: movieDetails.imdb_id,
          };
        } catch {
          return movie;
        }
      })
    );
    
    return moviesWithImdbIds;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return [];
  }
}

export async function getMoviesByImdbIds(imdbIds: string[]): Promise<Movie[]> {
  try {
    // Process in batches to avoid overwhelming the API
    const batchSize = 10;
    const movies: Movie[] = [];
    
    for (let i = 0; i < imdbIds.length; i += batchSize) {
      const batch = imdbIds.slice(i, i + batchSize);
      const batchPromises = batch.map(id => getMovieByImdbId(id));
      const batchResults = await Promise.all(batchPromises);
      
      // Filter out null results and add to movies array
      movies.push(...batchResults.filter((movie): movie is Movie => movie !== null));
      
      // Add a small delay to avoid rate limiting
      if (i + batchSize < imdbIds.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return movies;
  } catch (error) {
    console.error('Error fetching movies by IMDB IDs:', error);
    return [];
  }
}

export function getImageUrl(path: string): string {
  return `https://image.tmdb.org/t/p/w500${path}`;
}

export function getFullImageUrl(path: string): string {
  return `https://image.tmdb.org/t/p/original${path}`;
}

export function getYear(dateString: string): string {
  return dateString ? new Date(dateString).getFullYear().toString() : '';
}

export async function getSimilarMovies(movieId: number): Promise<MovieListItem[]> {
  try {
    const url = `${TMDB_BASE_URL}/movie/${movieId}/similar?api_key=${TMDB_API_KEY}&page=1`;
    const response = await fetch(url);
    const data = await response.json();
    
    // For each movie, get its IMDB ID
    const moviesWithImdbIds = await Promise.all(
      data.results.slice(0, 6).map(async (movie: any) => {
        try {
          const detailsUrl = `${TMDB_BASE_URL}/movie/${movie.id}?api_key=${TMDB_API_KEY}`;
          const detailsResponse = await fetch(detailsUrl);
          const movieDetails = await detailsResponse.json();
          
          return {
            ...movie,
            imdb_id: movieDetails.imdb_id,
          };
        } catch {
          return movie;
        }
      })
    );
    
    return moviesWithImdbIds;
  } catch (error) {
    console.error('Error fetching similar movies:', error);
    return [];
  }
}

// Fetch data from multiple IMDB IDs
export async function getMoviesByMultipleImdbIds(imdbIds: string[]): Promise<Movie[]> {
  try {
    // Use Promise.all to fetch multiple movies in parallel
    const moviesPromises = imdbIds.map(imdbId => getMovieByImdbId(imdbId));
    const movies = await Promise.all(moviesPromises);
    
    // Filter out any null results
    return movies.filter((movie): movie is Movie => movie !== null);
  } catch (error) {
    console.error('Error fetching movies by multiple IMDB IDs:', error);
    return [];
  }
}

// Fetch movie videos (trailers, teasers, etc.) from TMDB
export async function getMovieVideos(movieId: number): Promise<Video[]> {
  try {
    const url = `${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    // Return videos, prioritizing official YouTube trailers
    return data.results
      .filter((video: Video) => video.site.toLowerCase() === 'youtube')
      .sort((a: Video, b: Video) => {
        // Prioritize official trailers
        if (a.official && a.type === 'Trailer' && (!b.official || b.type !== 'Trailer')) return -1;
        if (b.official && b.type === 'Trailer' && (!a.official || a.type !== 'Trailer')) return 1;
        // Then official teasers
        if (a.official && a.type === 'Teaser' && (!b.official || b.type !== 'Teaser')) return -1;
        if (b.official && b.type === 'Teaser' && (!a.official || a.type !== 'Teaser')) return 1;
        return 0;
      });
  } catch (error) {
    console.error('Error fetching movie videos:', error);
    return [];
  }
}