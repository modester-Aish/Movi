"use client";

import { useState, useEffect } from "react";
import { getMovieByImdbId } from "../api/tmdb";
import Image from "next/image";
import { getImageUrl, getFullImageUrl, getImageUrlWithFallback } from "../api/tmdb";

export default function TestMovieTT0000758() {
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testMovie = async () => {
      try {
        console.log('Testing movie tt0000758...');
        const movieData = await getMovieByImdbId('tt0000758');
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
        <div className="text-white text-xl">Loading movie tt0000758...</div>
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

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-yellow-500 text-xl">No movie data found for tt0000758</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-white text-3xl mb-8">Movie Test: tt0000758</h1>
      
      <div className="bg-gray-800 p-6 rounded-lg mb-8">
        <h2 className="text-white text-2xl mb-4">{movie.title}</h2>
        <div className="space-y-2 text-white">
          <p><strong>IMDB ID:</strong> {movie.imdb_id}</p>
          <p><strong>TMDB ID:</strong> {movie.id}</p>
          <p><strong>Release Date:</strong> {movie.release_date}</p>
          <p><strong>Poster Path:</strong> {movie.poster_path || 'null'}</p>
          <p><strong>Backdrop Path:</strong> {movie.backdrop_path || 'null'}</p>
          <p><strong>Overview:</strong> {movie.overview}</p>
        </div>
      </div>

      {/* Test Images */}
      <div className="space-y-8">
        <div>
          <h3 className="text-white text-xl mb-4">Image Tests</h3>
          
          {/* Poster Tests */}
          <div className="mb-6">
            <h4 className="text-white text-lg mb-2">Poster Tests</h4>
            <div className="flex gap-4 flex-wrap">
              <div>
                <p className="text-white text-sm mb-2">getImageUrl:</p>
                <Image
                  src={getImageUrl(movie.poster_path)}
                  alt={`${movie.title} Poster`}
                  width={150}
                  height={225}
                  className="border border-white"
                  onError={(e) => {
                    console.log('getImageUrl error for poster:', e);
                  }}
                  onLoad={() => console.log('getImageUrl poster loaded successfully')}
                />
              </div>
              
              <div>
                <p className="text-white text-sm mb-2">getImageUrlWithFallback:</p>
                <Image
                  src={getImageUrlWithFallback(movie.poster_path)}
                  alt={`${movie.title} Poster`}
                  width={150}
                  height={225}
                  className="border border-white"
                  onError={(e) => {
                    console.log('getImageUrlWithFallback error for poster:', e);
                  }}
                  onLoad={() => console.log('getImageUrlWithFallback poster loaded successfully')}
                />
              </div>

              <div>
                <p className="text-white text-sm mb-2">Direct TMDB URL:</p>
                <Image
                  src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder.svg'}
                  alt={`${movie.title} Poster`}
                  width={150}
                  height={225}
                  className="border border-white"
                  onError={(e) => {
                    console.log('Direct TMDB URL error for poster:', e);
                  }}
                  onLoad={() => console.log('Direct TMDB URL poster loaded successfully')}
                />
              </div>
            </div>
          </div>

          {/* Backdrop Tests */}
          <div className="mb-6">
            <h4 className="text-white text-lg mb-2">Backdrop Tests</h4>
            <div className="flex gap-4 flex-wrap">
              <div>
                <p className="text-white text-sm mb-2">getFullImageUrl:</p>
                <Image
                  src={getFullImageUrl(movie.backdrop_path)}
                  alt={`${movie.title} Backdrop`}
                  width={300}
                  height={150}
                  className="border border-white"
                  onError={(e) => {
                    console.log('getFullImageUrl error for backdrop:', e);
                  }}
                  onLoad={() => console.log('getFullImageUrl backdrop loaded successfully')}
                />
              </div>

              <div>
                <p className="text-white text-sm mb-2">Direct TMDB URL:</p>
                <Image
                  src={movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : '/placeholder.svg'}
                  alt={`${movie.title} Backdrop`}
                  width={300}
                  height={150}
                  className="border border-white"
                  onError={(e) => {
                    console.log('Direct TMDB URL error for backdrop:', e);
                  }}
                  onLoad={() => console.log('Direct TMDB URL backdrop loaded successfully')}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Raw Data */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-white text-lg mb-4">Raw Movie Data:</h3>
          <pre className="bg-gray-700 p-4 rounded text-green-400 text-sm overflow-auto max-h-96">
            {JSON.stringify(movie, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
