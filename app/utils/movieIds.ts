// Function to fetch movie IDs from MongoDB
export async function getMovieIdsFromMongoDB(limit: number = 20, page: number = 1): Promise<{ movieIds: string[], total: number }> {
  try {
    const response = await fetch(`/api/movie-ids?limit=${limit}&page=${page}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch movie IDs from MongoDB');
    }

    const data = await response.json();
    return {
      movieIds: data.movieIds,
      total: data.pagination.total
    };
  } catch (error) {
    console.error('Error fetching movie IDs from MongoDB:', error);
    return { movieIds: [], total: 0 };
  }
}

// Function to get total movie count
export async function getTotalMovieCount(): Promise<number> {
  try {
    const response = await fetch('/api/movie-ids?limit=1', {
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

// Function to get random movie IDs
export async function getRandomMovieIds(count: number = 20): Promise<string[]> {
  try {
    const { movieIds } = await getMovieIdsFromMongoDB(1000); // Get a large batch
    const shuffled = movieIds.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  } catch (error) {
    console.error('Error getting random movie IDs:', error);
    return [];
  }
}

// Function to get movie IDs by range
export async function getMovieIdsByRange(start: number, end: number): Promise<string[]> {
  try {
    const { movieIds } = await getMovieIdsFromMongoDB(end - start, Math.floor(start / (end - start)) + 1);
    return movieIds.slice(start % (end - start), end - start);
  } catch (error) {
    console.error('Error getting movie IDs by range:', error);
    return [];
  }
}
