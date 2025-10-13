"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getMoviesByImdbIds } from "@/api/tmdb";
import { BULK_MOVIE_IDS } from "@/data/bulkMovieIds";
import type { Movie } from "@/api/tmdb";
import { generateMovieUrl } from "@/lib/slug";

interface GenrePageProps {
  params: Promise<{
    slug: string;
  }>;
}

const getGenreIndex = (slug: string): number => {
  const genreMap: {[key: string]: number} = {
    'action': 0, 'action-adventure': 1, 'adventure': 2, 'animation': 3,
    'biography': 4, 'comedy': 5, 'costume': 6, 'crime': 7,
    'documentary': 8, 'drama': 9, 'family': 10, 'fantasy': 11,
    'film-noir': 12, 'game-show': 13, 'history': 14, 'horror': 15,
    'romance': 16, 'kungfu': 17, 'music': 18, 'musical': 19,
    'mystery': 20, 'mythological': 21, 'news': 22, 'psychological': 23,
    'reality': 24, 'reality-tv': 25, 'sci-fi': 26, 'sci-fi-fantasy': 27,
    'science-fiction': 28, 'short': 29
  };
  return genreMap[slug] || 0;
};

export default function GenrePage({ params }: GenrePageProps) {
  const [slug, setSlug] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadGenreMovies();
  }, []);

  const loadGenreMovies = async () => {
    try {
      const { slug: slugParam } = await params;
      setSlug(slugParam);
      
      // Load first 7 movies for this genre
      const genreIndex = getGenreIndex(slugParam);
      const startIndex = 1000 + (genreIndex * 200);
      const endIndex = startIndex + 7;
      const movieIds = BULK_MOVIE_IDS.slice(startIndex, endIndex);
      
      const moviesData = await getMoviesByImdbIds(movieIds);
      setMovies(moviesData);
      setCurrentPage(1);
      setHasMore(movieIds.length === 7);
    } catch (error) {
      console.error('Error loading genre movies:', error);
    }
    setLoading(false);
  };

  const loadMoreMovies = async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    try {
      const genreIndex = getGenreIndex(slug);
      const startIndex = 1000 + (genreIndex * 200) + (currentPage * 7);
      const endIndex = startIndex + 7;
      const movieIds = BULK_MOVIE_IDS.slice(startIndex, endIndex);
      
      if (movieIds.length === 0) {
        setHasMore(false);
      } else {
        const moviesData = await getMoviesByImdbIds(movieIds);
        setMovies(prev => [...prev, ...moviesData]);
        setCurrentPage(prev => prev + 1);
        setHasMore(movieIds.length === 7);
      }
    } catch (error) {
      console.error('Error loading more movies:', error);
      setHasMore(false);
    }
    setLoadingMore(false);
  };

  // Convert slug to readable name
  const genreName = slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-3xl font-bold text-white mb-8">{genreName} Movies</h1>
        
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-gray-800 rounded animate-pulse"></div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3">
              {movies.map((movie, index) => (
                <Link
                  key={`${movie.imdb_id}-${index}`}
                  href={generateMovieUrl(movie.title, movie.imdb_id)}
                  className="group relative"
                >
                  <div className="relative aspect-[2/3] bg-gray-800 rounded overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300">
                    <Image
                      src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder.svg'}
                      alt={`${movie.title} movie poster`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    <div className="absolute top-0.5 right-0.5 bg-yellow-500 text-black text-xs font-bold px-1 py-0.5 rounded">
                      HD
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 hover:scale-110 transition-all duration-200">
                        <svg className="w-3 h-3 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-white text-xs mt-1 line-clamp-1 group-hover:text-green-400 transition-colors">
                    {movie.title}
                  </h3>
                </Link>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMoreMovies}
                  disabled={loadingMore}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  {loadingMore ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading...</span>
                    </div>
                  ) : (
                    'Load More Movies'
                  )}
                </button>
              </div>
            )}

            {!hasMore && movies.length > 0 && (
              <div className="text-center mt-8">
                <p className="text-gray-400">No more movies to load</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}