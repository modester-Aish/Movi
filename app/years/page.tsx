"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getMoviesByImdbIds } from '@/api/tmdb';
import { BULK_MOVIE_IDS } from '@/data/bulkMovieIds';
import { MOVIE_YEARS_DATA, getYearsForDecade } from '@/data/movieYearsData';
import { DECADE_RANGES } from '@/data/movieYearMapping';
import type { Movie } from '@/api/tmdb';
import { generateMovieUrl } from '@/lib/slug';

export default function YearsPage() {
  const [decades, setDecades] = useState<{[key: string]: Movie[]}>({});
  const [loading, setLoading] = useState(true);

  const decadeRanges = [
    { name: "2020s", years: MOVIE_YEARS_DATA.recent, startYear: 2020, endYear: 2025 },
    { name: "2010s", years: MOVIE_YEARS_DATA.decade2010s, startYear: 2010, endYear: 2019 },
    { name: "2000s", years: MOVIE_YEARS_DATA.decade2000s, startYear: 2000, endYear: 2009 },
    { name: "1990s", years: MOVIE_YEARS_DATA.decade1990s, startYear: 1990, endYear: 1999 },
    { name: "1980s", years: getYearsForDecade("1980s"), startYear: 1980, endYear: 1989 },
    { name: "1970s", years: getYearsForDecade("1970s"), startYear: 1970, endYear: 1979 },
    { name: "1960s", years: getYearsForDecade("1960s"), startYear: 1960, endYear: 1969 },
    { name: "1950s", years: getYearsForDecade("1950s"), startYear: 1950, endYear: 1959 },
    { name: "1940s", years: getYearsForDecade("1940s"), startYear: 1940, endYear: 1949 },
    { name: "1930s", years: getYearsForDecade("1930s"), startYear: 1930, endYear: 1939 },
    { name: "1920s", years: getYearsForDecade("1920s"), startYear: 1920, endYear: 1929 },
    { name: "1910s", years: getYearsForDecade("1910s"), startYear: 1910, endYear: 1919 },
    { name: "1900s", years: getYearsForDecade("1900s"), startYear: 1900, endYear: 1909 }
  ];

  useEffect(() => {
    loadDecades();
  }, []);

  const loadDecades = async () => {
    setLoading(true);
    try {
      const decadesData: {[key: string]: Movie[]} = {};
      
      for (const decade of decadeRanges) {
        // Use the new decade mapping for direct access
        const decadeMapping = DECADE_RANGES[decade.name];
        if (decadeMapping) {
          const movieIds = BULK_MOVIE_IDS.slice(decadeMapping.startIndex, decadeMapping.startIndex + 12);
          const moviesData = await getMoviesByImdbIds(movieIds);
          decadesData[decade.name] = moviesData;
        }
        
        // Add small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      setDecades(decadesData);
    } catch (error) {
      console.error('Error loading decades:', error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Movies by Year</h1>
          <p className="text-gray-300 text-lg">
            Browse movies from different decades and years
          </p>
        </div>

        {decadeRanges.map((decade) => (
          <div key={decade.name} className="mb-12">
            {/* Decade Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {decade.name} ({decade.startYear}-{decade.endYear})
              </h2>
              <Link 
                href={`/year/${decade.name}`}
                className="text-green-400 hover:text-green-300 transition-colors"
              >
                View All →
              </Link>
            </div>
            
            {/* Movies Grid */}
            {loading ? (
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="aspect-[2/3] bg-gray-800 rounded animate-pulse"></div>
                ))}
              </div>
            ) : decades[decade.name] && decades[decade.name].length > 0 ? (
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                {decades[decade.name].map((movie) => (
                  <Link
                    key={movie.imdb_id}
                    href={generateMovieUrl(movie.title, movie.imdb_id)}
                    className="group relative"
                  >
                    <div className="relative aspect-[2/3] bg-gray-800 rounded overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300">
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                      
                      {/* HD Badge */}
                      <div className="absolute top-0.5 right-0.5 bg-yellow-500 text-black text-xs font-bold px-1 py-0.5 rounded">
                        HD
                      </div>

                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 hover:scale-110 transition-all duration-200">
                          <svg className="w-3 h-3 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    {/* Title below poster */}
                    <h3 className="text-white text-xs mt-1 line-clamp-1 group-hover:text-green-400 transition-colors">
                      {movie.title}
                    </h3>
                    {movie.release_date && (
                      <p className="text-gray-400 text-xs">
                        {new Date(movie.release_date).getFullYear()}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No movies found for this decade</p>
                <p className="text-gray-500 text-sm mt-1">Try refreshing the page</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
