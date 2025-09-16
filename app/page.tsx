"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getMoviesByImdbIds, getYear } from "./api/tmdb";
import { getTotalMovieCount, getRandomMovieIds } from "./utils/movieIds";
import { MOVIE_CATEGORIES, getAllCategoryKeys, type CategoryKey } from "./data/movieCategories";
import type { Movie } from "./api/tmdb";
import { generateMovieUrl } from "./lib/slug";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('FEATURED');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [allMoviesCache, setAllMoviesCache] = useState<Record<CategoryKey, Movie[]>>({} as Record<CategoryKey, Movie[]>);
  const [heroMovies, setHeroMovies] = useState<Movie[]>([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [totalMovies, setTotalMovies] = useState(0);

  const allCategories = getAllCategoryKeys();

  useEffect(() => {
    loadMoviesForCategory(activeCategory);
    loadHeroMovies();
    loadTotalMovieCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory]);

  // Auto-rotate hero movies
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroMovies.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [heroMovies.length]);

  const loadHeroMovies = async () => {
    try {
      // Fetch more IDs to account for filtering
      const heroMovieIds = await getRandomMovieIds(50);
      console.log('Hero movie IDs:', heroMovieIds);
      const heroMoviesData = await getMoviesByImdbIds(heroMovieIds);
      console.log('Hero movies data (filtered):', heroMoviesData);
      
      // Filter for movies with BOTH poster AND backdrop images working
      const moviesWithAllImages = heroMoviesData.filter(movie => {
        const hasPoster = movie.poster_path && 
                         movie.poster_path.trim() !== '' && 
                         movie.poster_path !== null;
        
        const hasBackdrop = movie.backdrop_path && 
                           movie.backdrop_path.trim() !== '' && 
                           movie.backdrop_path !== null;
        
        return hasPoster && hasBackdrop;
      });
      
      console.log(`Hero section: ${heroMoviesData.length} movies with posters, ${moviesWithAllImages.length} with BOTH poster and backdrop images`);
      
      // Take only the first 10 with all images working
      setHeroMovies(moviesWithAllImages.slice(0, 10));
    } catch (error) {
      console.error('Error loading hero movies:', error);
    }
  };

  const loadTotalMovieCount = async () => {
    try {
      const count = await getTotalMovieCount();
      setTotalMovies(count);
    } catch (error) {
      console.error('Error loading total movie count:', error);
    }
  };

  const loadMoviesForCategory = async (category: CategoryKey) => {
    setLoading(true);
    
    // Check if we already have cached data for this category
    if (allMoviesCache[category]) {
      setMovies(allMoviesCache[category]);
      setLoading(false);
      return;
    }

    try {
      // Get more movie IDs to account for filtering
      const movieIds = await getRandomMovieIds(30);
      console.log('Movie IDs for category', category, ':', movieIds);
      const moviesData = await getMoviesByImdbIds(movieIds);
      console.log('Movies data for category', category, ' (filtered):', moviesData);
      
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
      {/* Hero Section with Background Slider */}
      <div className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background Movie Slider */}
        {heroMovies.length > 0 ? (
          <div className="absolute inset-0">
            {heroMovies
              .filter((movie) => movie.imdb_id && movie.imdb_id.trim() !== '')
              .map((movie, index) => (
              <div
                key={`${movie.imdb_id}-${index}`}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentHeroIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <Image
                  src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  onError={(e) => {
                    console.log('Hero image error:', movie.title, movie.backdrop_path);
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
              </div>
            ))}
          </div>
        ) : (
          /* Fallback background when no hero movies with backdrops */
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"></div>
        )}

        {/* Hero Content */}
        <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            CineVerse
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
            Discover our massive collection of {totalMovies.toLocaleString()} movies. Watch, download, and explore.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="#movies"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
            >
              Explore Movies
            </Link>
            <Link 
              href="#movies"
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 backdrop-blur-sm"
            >
              Browse All
            </Link>
          </div>
        </div>

        {/* Hero Navigation Dots */}
        {heroMovies.length > 1 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
            {heroMovies.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentHeroIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  currentHeroIndex === index ? 'bg-purple-500' : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div id="movies" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Navigation */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">
              Movie Collections
            </h2>
            <div className="text-gray-400">
              {totalMovies.toLocaleString()} movies available
            </div>
          </div>
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-3">
            {allCategories.map((category) => {
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
              {movies
                .filter((movie) => movie.imdb_id && movie.imdb_id.trim() !== '')
                .map((movie, index) => (
                <Link 
                  href={generateMovieUrl(movie.title, movie.imdb_id || '')} 
                  key={`${movie.imdb_id}-${index}`}
                  className="group block transition-all duration-300 hover:transform hover:scale-105"
                >
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300">
                    <Image 
                      src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder.svg'}
                      alt={movie.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        console.log('Movie poster error:', movie.title, movie.poster_path);
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
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
