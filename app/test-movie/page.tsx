"use client";

import { useState, useEffect } from "react";
import { getMovieByImdbId } from "../api/tmdb";

export default function TestMovie() {
  const [movie, setMovie] = useState<{
    title?: string;
    imdb_id?: string;
    id?: number;
    release_date?: string;
    poster_path?: string | null;
    overview?: string;
    genres?: Array<{ name: string }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testMovie = async () => {
      try {
        console.log('Testing movie fetch...');
        const movieData = await getMovieByImdbId('tt0021577');
        console.log('Movie data received:', movieData);
        setMovie(movieData);
      } catch (err) {
        console.error('Error fetching movie:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    testMovie();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-white text-3xl mb-8">Movie Data Test</h1>
      
      {movie ? (
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-white text-2xl mb-4">{movie.title}</h2>
          <div className="space-y-2 text-white">
            <p><strong>IMDB ID:</strong> {movie.imdb_id}</p>
            <p><strong>TMDB ID:</strong> {movie.id}</p>
            <p><strong>Release Date:</strong> {movie.release_date}</p>
            <p><strong>Poster Path:</strong> {movie.poster_path || 'null'}</p>
            <p><strong>Overview:</strong> {movie.overview}</p>
            <p><strong>Genres:</strong> {movie.genres?.map((g: { name: string }) => g.name).join(', ') || 'none'}</p>
          </div>
          
          <div className="mt-6">
            <h3 className="text-white text-xl mb-2">Raw Movie Data:</h3>
            <pre className="bg-gray-700 p-4 rounded text-green-400 text-sm overflow-auto">
              {JSON.stringify(movie, null, 2)}
            </pre>
          </div>
        </div>
      ) : (
        <div className="text-white text-xl">No movie data received</div>
      )}
    </div>
  );
}
