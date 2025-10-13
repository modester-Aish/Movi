"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MovieCard from "@/components/MovieCard";

// Movie type based on our processed data
interface ProcessedMovie {
  imdbId: string;
  id: string;
  imdb_id: string;
  title: string;
  year: number;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  vote_average: number;
  release_date: string;
  runtime: number;
  original_language: string;
  genres: number[];
}

interface YearPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function YearPage({ params }: YearPageProps) {
  const [slug, setSlug] = useState("");
  const [movies, setMovies] = useState<ProcessedMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalMovies, setTotalMovies] = useState(0);

  useEffect(() => {
    loadSlug();
  }, []);

  useEffect(() => {
    if (slug) {
      loadMovies(slug);
    }
  }, [slug]);

  const loadSlug = async () => {
    const { slug: slugParam } = await params;
    setSlug(slugParam);
  };

  const loadMovies = async (yearParam: string, page: number = 1) => {
    if (page === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    
    try {
      const response = await fetch(`/api/movies/year?year=${yearParam}&page=${page}&limit=7`);
      const data = await response.json();
      
      if (response.ok) {
        if (page === 1) {
          setMovies(data.movies);
        } else {
          setMovies(prev => [...prev, ...data.movies]);
        }
        
        setTotalMovies(data.totalMoviesForYear);
        setCurrentPage(page);
        setHasMore(data.pagination.hasNextPage);
      } else {
        console.error('Error loading movies:', data.error);
      }
    } catch (error) {
      console.error('Error loading movies:', error);
    }
    
    setLoading(false);
    setLoadingMore(false);
  };

  const loadMoreMovies = async () => {
    if (loadingMore || !hasMore) return;
    await loadMovies(slug, currentPage + 1);
  };

  const getPageTitle = () => {
    if (slug.endsWith('s') && slug.length === 5) {
      const decade = slug.slice(0, 4);
      return `${decade}s Movies`;
    }
    return `${slug} Movies`;
  };

  const getPageDescription = () => {
    if (slug.endsWith('s') && slug.length === 5) {
      const decade = slug.slice(0, 4);
      return `Browse movies from the ${decade}s`;
    }
    return `Browse movies from ${slug}`;
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <Link href="/years" className="hover:text-white transition-colors">Years</Link>
            <span>›</span>
            <span className="text-white">{slug}</span>
          </nav>
          
          <h1 className="text-4xl font-bold text-white mb-4">{getPageTitle()}</h1>
          <p className="text-gray-300 text-lg">{getPageDescription()}</p>
          
          <div className="flex items-center space-x-4 mt-2">
            <p className="text-gray-400">
              Showing {movies.length} of {totalMovies} movies
            </p>
            {totalMovies > 0 && (
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${(movies.length / totalMovies) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-400">
                  {Math.round((movies.length / totalMovies) * 100)}%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Movies Grid */}
        {loading ? (
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-gray-800 rounded animate-pulse"></div>
            ))}
          </div>
        ) : movies.length > 0 ? (
          <>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {movies.map((movie, index) => (
                <MovieCard key={`${movie.imdb_id}-${index}`} movie={movie} index={index} />
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
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-xl text-gray-400 mb-4">No movies found for {slug}</h3>
            <p className="text-gray-500 mb-6">
              {totalMovies === 0 ? 
                "No movies have been processed for this year yet. The movie processing script is still running." :
                "No movies found for this year. Try browsing other years."
              }
            </p>
            {totalMovies === 0 && (
              <div className="bg-gray-800 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-sm text-gray-400 mb-2">
                  <strong>Processing Status:</strong>
                </p>
                <p className="text-xs text-gray-500">
                  Our system is currently processing all 95,942 movies and extracting year data. 
                  Movies for {slug} will appear here once they are processed.
                </p>
              </div>
            )}
            <div className="mt-6">
              <Link 
                href="/years" 
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Browse All Years
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}