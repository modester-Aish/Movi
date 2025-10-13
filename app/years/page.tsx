"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';

interface YearsData {
  years: number[];
  decades: Array<{
    decade: string;
    years: number[];
  }>;
  totalMovies: number;
  processedMovies: number;
  foundMovies: number;
  progress: string;
  lastUpdate: string;
  yearStats: {[key: string]: number};
}

interface Movie {
  imdb_id: string;
  title: string;
  year: number;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

export default function YearsPage() {
  const [yearsData, setYearsData] = useState<YearsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadYearsData();
    
    // Auto-refresh every 30 seconds to get latest data
    const interval = setInterval(loadYearsData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadYearsData = async () => {
    try {
      const response = await fetch('/api/years');
      const data = await response.json();
      
      if (response.ok) {
        setYearsData(data);
      } else {
        console.error('Error fetching years data:', data.error);
      }
    } catch (error) {
      console.error('Error loading years data:', error);
    }
    setLoading(false);
  };

  const generateMovieUrl = (title: string, imdbId: string) => {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return `/movie-${slug}-${imdbId}`;
  };

  return (
    <>
      <Head>
        <title>Movies by Year - Browse Films by Release Year | 123Movies</title>
        <meta name="description" content="Browse movies by release year from 1900s to present. Watch classic films, recent releases, and movies from your favorite decades. Free HD streaming available for all years." />
        <meta name="keywords" content="movies by year, films by decade, classic movies, recent movies, movies 2024, movies 2023, old movies, new movies, movies by release year, decade movies" />
        <meta property="og:title" content="Movies by Year - Browse Films by Release Year" />
        <meta property="og:description" content="Browse movies by release year from 1900s to present. Watch classic films, recent releases, and movies from your favorite decades." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Movies by Year - Browse Films by Release Year" />
        <meta name="twitter:description" content="Browse movies by release year from 1900s to present. Watch classic films, recent releases, and movies from your favorite decades." />
        <link rel="canonical" href="https://ww1.n123movie.me/years" />
      </Head>
      <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Movies by Year</h1>
          <p className="text-gray-300 text-lg">
            Browse movies from different decades and years
          </p>
          
          {/* Progress Bar */}
          {yearsData && (
            <div className="mt-6 bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">Movie Processing Progress</span>
                <span className="text-sm text-green-400">{yearsData.progress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${yearsData.progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>{yearsData.processedMovies.toLocaleString()} processed</span>
                <span>{yearsData.foundMovies.toLocaleString()} found</span>
                <span>Latest: {yearsData.years[0] || 'N/A'}</span>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading years data...</p>
          </div>
        ) : !yearsData ? (
          <div className="text-center py-16">
            <p className="text-gray-400">Failed to load years data</p>
            <p className="text-gray-500 text-sm mt-1">Please try refreshing the page</p>
          </div>
        ) : (
          <div className="space-y-12">
            {yearsData.decades.map((decade) => (
              <div key={decade.decade} className="mb-12">
                {/* Decade Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {decade.decade} ({decade.years.length} years)
                  </h2>
                  <Link 
                    href={`/year/${decade.decade}`}
                    className="text-green-400 hover:text-green-300 transition-colors"
                  >
                    View All →
                  </Link>
                </div>
                
                {/* Years Grid */}
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                  {decade.years.slice(0, 12).map((year) => (
                    <Link
                      key={year}
                      href={`/year/${year}`}
                      className="group relative bg-gray-800 rounded-lg p-4 text-center hover:bg-gray-700 transition-colors"
                    >
                      <div className="text-white font-semibold text-lg group-hover:text-green-400 transition-colors">
                        {year}
                      </div>
                      <div className="text-gray-400 text-sm mt-1">
                        {yearsData.yearStats[year.toString()] || 0} movies
                      </div>
                    </Link>
                  ))}
                </div>
                
                {decade.years.length > 12 && (
                  <div className="text-center mt-4">
                    <Link 
                      href={`/year/${decade.decade}`}
                      className="text-green-400 hover:text-green-300 transition-colors"
                    >
                      View all {decade.years.length} years →
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
}