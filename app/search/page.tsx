"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getMoviesByImdbIds, getImageUrl, getYear } from "../api/tmdb";
import { searchMoviesByTitle, getRandomMovieIds } from "../data/bulkMovieIds";
import type { Movie } from "../api/tmdb";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Get movie IDs for search - increase limit for better results
        const movieIds = searchMoviesByTitle(query, 100);
        
        // Add some random movies to increase variety
        const randomIds = getRandomMovieIds(50);
        const allIds = [...movieIds, ...randomIds];
        
        const moviesData = await getMoviesByImdbIds(allIds);
        
        // Filter by search term (client-side filtering)
        const filtered = moviesData.filter(movie =>
          movie.title.toLowerCase().includes(query.toLowerCase()) ||
          movie.overview?.toLowerCase().includes(query.toLowerCase()) ||
          movie.release_date?.includes(query)
        );
        
        // Remove duplicates based on imdb_id
        const uniqueMovies = filtered.filter((movie, index, self) => 
          index === self.findIndex(m => m.imdb_id === movie.imdb_id)
        );
        
        // Sort by relevance (exact matches first, then partial matches)
        const sorted = uniqueMovies.sort((a, b) => {
          const aExact = a.title.toLowerCase() === query.toLowerCase();
          const bExact = b.title.toLowerCase() === query.toLowerCase();
          
          if (aExact && !bExact) return -1;
          if (!aExact && bExact) return 1;
          
          return (b.vote_average || 0) - (a.vote_average || 0);
        });
        
        setResults(sorted.slice(0, 60)); // Show up to 60 results
      } catch (error) {
        console.error('Error searching movies:', error);
        setError('Failed to search movies. Please try again.');
        setResults([]);
      }

      setLoading(false);
    };

    performSearch();
  }, [query]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
            <p className="mt-4 text-gray-400 text-lg">Searching for &quot;{query}&quot;...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-block mb-4 text-purple-400 hover:text-purple-300 transition-colors">
            &larr; Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">
            Search Results
          </h1>
          <p className="text-gray-400">
            {results.length > 0 
              ? `Found ${results.length} movie${results.length !== 1 ? 's' : ''} for &quot;${query}&quot;`
              : `No movies found for "${query}"`
            }
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* No Results */}
        {!loading && results.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-white mb-2">No movies found</h2>
            <p className="text-gray-400 mb-6">
              We couldn&apos;t find any movies matching &quot;{query}&quot;
            </p>
            <div className="space-y-2 text-gray-500">
              <p>Try:</p>
              <ul className="text-sm">
                <li>• Using different keywords</li>
                <li>• Checking your spelling</li>
                <li>• Using more general terms</li>
                <li>• Searching by movie title only</li>
              </ul>
            </div>
          </div>
        )}

        {/* Search Results Grid */}
        {results.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.map((movie, index) => (
              <Link
                key={`${movie.imdb_id}-${index}`}
                href={`/movie/${movie.imdb_id}`}
                className="group relative bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {/* Movie Poster */}
                <div className="relative aspect-[2/3] bg-gray-700">
                  <Image
                    src={movie.poster_path ? getImageUrl(movie.poster_path) : '/placeholder.svg'}
                    alt={movie.title}
                    fill
                    className="object-cover group-hover:brightness-110 transition-all duration-300"
                  />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Movie Info */}
                <div className="p-3">
                  <h3 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-purple-400 transition-colors">
                    {movie.title}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-gray-400 text-xs">
                      {getYear(movie.release_date)}
                    </span>
                    <div className="flex items-center">
                      <span className="text-yellow-400 text-xs">⭐</span>
                      <span className="text-gray-400 text-xs ml-1">
                        {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
            <p className="mt-4 text-gray-400 text-lg">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  );
}
