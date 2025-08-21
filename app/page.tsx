"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getMoviesByImdbIds, getImageUrl, getYear } from "./api/tmdb";
import { getMoviesForHomepageCategory, getMoviesForGenreCategory, getMovieCount } from "./data/bulkMovieIds";
import { MOVIE_CATEGORIES, getHomepageCategories, getGenreCategories, type CategoryKey } from "./data/movieCategories";
import type { Movie } from "./api/tmdb";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('FEATURED');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [allMoviesCache, setAllMoviesCache] = useState<Record<CategoryKey, Movie[]>>({} as Record<CategoryKey, Movie[]>);
  const [showGenres, setShowGenres] = useState(false);

  const homepageCategories = getHomepageCategories();
  const genreCategories = getGenreCategories();

  useEffect(() => {
    loadMoviesForCategory(activeCategory);
  }, [activeCategory]);

  const loadMoviesForCategory = async (category: CategoryKey) => {
    setLoading(true);
    
    // Check if we already have cached data for this category
    if (allMoviesCache[category]) {
      setMovies(allMoviesCache[category]);
      setLoading(false);
      return;
    }

    try {
      let movieIds: string[];
      
      if (homepageCategories.includes(category)) {
        movieIds = getMoviesForHomepageCategory(category, 20);
      } else {
        movieIds = getMoviesForGenreCategory(category, 20);
      }
      
      const moviesData = await getMoviesByImdbIds(movieIds);
      
      // Cache the data
      setAllMoviesCache(prev => ({
        ...prev,
        [category]: moviesData
      }));
      
      setMovies(moviesData);
    } catch (error) {
      console.error('Error loading movies:', error);
      setMovies([]);
    }
    
    setLoading(false);
  };

  const getCategoryInfo = (category: CategoryKey) => {
    return MOVIE_CATEGORIES[category];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Hero Section */}
      <div className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/80 z-10"></div>
        <div className="relative z-20 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            CineVerse
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
            Discover our massive collection of {getMovieCount().toLocaleString()} movies. Watch, download, and explore.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setShowGenres(!showGenres)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
            >
              {showGenres ? 'Show Featured' : 'Browse Genres'}
            </button>
            <Link 
              href="#movies"
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 backdrop-blur-sm"
            >
              Explore Movies
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div id="movies" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Navigation */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">
              {showGenres ? 'Browse by Genre' : 'Featured Collections'}
            </h2>
            <div className="text-gray-400">
              {getMovieCount().toLocaleString()} movies available
            </div>
          </div>
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-3">
            {(showGenres ? genreCategories : homepageCategories).map((category) => {
              const info = getCategoryInfo(category);
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-200 flex items-center gap-2 ${
                    activeCategory === category
                      ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white shadow-md'
                  }`}
                >
                  <span>{info.icon}</span>
                  <span>{info.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Description */}
        <div className="mb-8">
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{getCategoryInfo(activeCategory).icon}</span>
              <h3 className="text-xl font-semibold text-white">{getCategoryInfo(activeCategory).name}</h3>
            </div>
            <p className="text-gray-300">{getCategoryInfo(activeCategory).description}</p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            <span className="ml-4 text-gray-400 text-lg">Loading movies...</span>
          </div>
        )}

        {/* Movies Grid */}
        {!loading && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {movies.map((movie) => (
                <Link 
                  href={`/movie/${movie.imdb_id}`} 
                  key={movie.imdb_id}
                  className="group block transition-all duration-300 hover:transform hover:scale-105"
                >
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300">
                    <Image 
                      src={movie.poster_path ? getImageUrl(movie.poster_path) : '/placeholder.jpg'}
                      alt={movie.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-white font-semibold text-sm mb-1 truncate">{movie.title}</h3>
                      <div className="flex items-center justify-between text-xs text-gray-300">
                        <span>{getYear(movie.release_date)}</span>
                        <div className="flex items-center">
                          <span className="text-yellow-400">⭐</span>
                          <span className="ml-1">{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {movies.length === 0 && !loading && (
              <div className="text-center py-16">
                <div className="text-8xl mb-6">🎬</div>
                <h3 className="text-2xl font-medium text-gray-300 mb-4">No movies found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  No movies available in this category yet. Check back later for updates.
                </p>
              </div>
            )}

            {/* Load More Button */}
            {movies.length > 0 && (
              <div className="text-center mt-12">
                <button 
                  onClick={() => loadMoviesForCategory(activeCategory)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                >
                  Load More Movies
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-black/50 border-t border-gray-800 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">CineVerse</h3>
            <p className="text-gray-400 mb-6">
              Movie data provided by TMDB. Watch thousands of movies online.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-500">
              <span>© 2024 CineVerse</span>
              <span>•</span>
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
