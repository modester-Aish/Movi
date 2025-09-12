import { IMovie } from '../models/Movie';

// Function to fetch movies from MongoDB by category
export async function getMoviesFromMongoDB(category: string, limit: number = 20, page: number = 1): Promise<{ movies: IMovie[], total: number }> {
  try {
    const response = await fetch(`/api/movies?category=${category}&limit=${limit}&page=${page}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch movies from MongoDB');
    }

    const data = await response.json();
    return {
      movies: data.movies,
      total: data.pagination.total
    };
  } catch (error) {
    console.error('Error fetching movies from MongoDB:', error);
    return { movies: [], total: 0 };
  }
}

// Function to get movie count by category
export async function getMovieCountByCategory(category?: string): Promise<number> {
  try {
    const url = category ? `/api/movies?category=${category}&limit=1` : '/api/movies?limit=1';
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch movie count');
    }

    const data = await response.json();
    return data.pagination.total;
  } catch (error) {
    console.error('Error fetching movie count:', error);
    return 0;
  }
}

// Function to get all movie IDs by category
export async function getMovieIdsByCategory(category: string, limit: number = 100): Promise<string[]> {
  try {
    const { movies } = await getMoviesFromMongoDB(category, limit);
    return movies.map(movie => movie.imdbId);
  } catch (error) {
    console.error('Error fetching movie IDs:', error);
    return [];
  }
}

// Function to get random movies by category
export async function getRandomMoviesByCategory(category: string, limit: number = 20): Promise<IMovie[]> {
  try {
    const response = await fetch(`/api/movies?category=${category}&limit=${limit}&random=true`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch random movies');
    }

    const data = await response.json();
    return data.movies;
  } catch (error) {
    console.error('Error fetching random movies:', error);
    return [];
  }
}

// Function to search movies in MongoDB
export async function searchMoviesInMongoDB(query: string, category?: string, limit: number = 20): Promise<IMovie[]> {
  try {
    const url = new URL('/api/movies/search', window.location.origin);
    url.searchParams.set('q', query);
    url.searchParams.set('limit', limit.toString());
    if (category) {
      url.searchParams.set('category', category);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to search movies');
    }

    const data = await response.json();
    return data.movies;
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
}
