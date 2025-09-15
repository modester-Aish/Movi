"use client";

import { useState, useEffect } from "react";
import { getMoviesByImdbIds } from "../api/tmdb";
import { getRandomMovieIds } from "../utils/movieIds";

export default function TestHeroFiltering() {
  const [allMovies, setAllMovies] = useState<Array<{
    imdb_id: string;
    title: string;
    poster_path?: string | null;
    backdrop_path?: string | null;
    release_date?: string;
  }>>([]);
  const [moviesWithPosters, setMoviesWithPosters] = useState<Array<{
    imdb_id: string;
    title: string;
    poster_path?: string | null;
    backdrop_path?: string | null;
    release_date?: string;
  }>>([]);
  const [moviesWithBackdrops, setMoviesWithBackdrops] = useState<Array<{
    imdb_id: string;
    title: string;
    poster_path?: string | null;
    backdrop_path?: string | null;
    release_date?: string;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testFiltering = async () => {
      try {
        // Get 20 random movie IDs
        const movieIds = await getRandomMovieIds(20);
        console.log('Test movie IDs:', movieIds);
        
        // Fetch all movies
        const allMoviesData = await getMoviesByImdbIds(movieIds);
        console.log('All movies:', allMoviesData);
        
        // Filter movies with posters
        const withPosters = allMoviesData.filter(movie => 
          movie.poster_path && 
          movie.poster_path.trim() !== ''
        );
        
        // Filter movies with backdrops
        const withBackdrops = allMoviesData.filter(movie => 
          movie.backdrop_path && 
          movie.backdrop_path.trim() !== '' &&
          movie.backdrop_path !== null
        );
        
        // Filter movies with BOTH poster AND backdrop images
        const withAllImages = allMoviesData.filter(movie => {
          const hasPoster = movie.poster_path && 
                           movie.poster_path.trim() !== '' && 
                           movie.poster_path !== null;
          
          const hasBackdrop = movie.backdrop_path && 
                             movie.backdrop_path.trim() !== '' && 
                             movie.backdrop_path !== null;
          
          return hasPoster && hasBackdrop;
        });
        
        setAllMovies(allMoviesData);
        setMoviesWithPosters(withPosters);
        setMoviesWithBackdrops(withAllImages); // Show movies with ALL images
        
        console.log('Filtering results:', {
          total: allMoviesData.length,
          withPosters: withPosters.length,
          withBackdrops: withBackdrops.length,
          withAllImages: withAllImages.length
        });
        
      } catch (error) {
        console.error('Error testing filtering:', error);
      } finally {
        setLoading(false);
      }
    };

    testFiltering();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <h1 className="text-3xl font-bold mb-8">Testing Hero Section Filtering</h1>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading test data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Hero Section Filtering Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-blue-400">All Movies</h2>
          <p className="text-3xl font-bold text-white">{allMovies.length}</p>
          <p className="text-gray-400 mt-2">Total fetched</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-green-400">With Posters</h2>
          <p className="text-3xl font-bold text-white">{moviesWithPosters.length}</p>
          <p className="text-gray-400 mt-2">For movie grid</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-purple-400">With ALL Images</h2>
          <p className="text-3xl font-bold text-white">{moviesWithBackdrops.length}</p>
          <p className="text-gray-400 mt-2">For hero section (poster + backdrop)</p>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Movies with ALL Images (Hero Section)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {moviesWithBackdrops.map((movie) => (
              <div key={movie.imdb_id} className="bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold text-white mb-2">{movie.title}</h3>
                <p className="text-sm text-gray-400 mb-2">IMDB: {movie.imdb_id}</p>
                <div className="space-y-1 text-xs">
                  <p className="text-green-400">✅ Poster: {movie.poster_path ? 'Yes' : 'No'}</p>
                  <p className="text-purple-400">✅ Backdrop: {movie.backdrop_path ? 'Yes' : 'No'}</p>
                  <p className="text-gray-400">Year: {movie.release_date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Movies without ALL Images (Filtered Out)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allMovies.filter(movie => {
              const hasPoster = movie.poster_path && movie.poster_path.trim() !== '';
              const hasBackdrop = movie.backdrop_path && movie.backdrop_path.trim() !== '';
              return !hasPoster || !hasBackdrop;
            }).map((movie) => (
              <div key={movie.imdb_id} className="bg-gray-800 p-4 rounded-lg border border-red-500">
                <h3 className="font-semibold text-white mb-2">{movie.title}</h3>
                <p className="text-sm text-gray-400 mb-2">IMDB: {movie.imdb_id}</p>
                <div className="space-y-1 text-xs">
                  <p className="text-green-400">✅ Poster: {movie.poster_path ? 'Yes' : 'No'}</p>
                  <p className="text-red-400">❌ Backdrop: {movie.backdrop_path ? 'Yes' : 'No'}</p>
                  <p className="text-gray-400">Year: {movie.release_date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
