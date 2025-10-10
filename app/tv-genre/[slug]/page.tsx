"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getTVImageUrl } from "@/api/tmdb-tv";
import { TV_SERIES_STATIC } from "@/data/tvSeriesStatic";
import { getTVGenreBySlug } from "@/data/tvGenres";

// Helper function to create series slug
function createSeriesSlug(name: string, id: string | number): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${slug}-${id}`;
}

export default function TVGenrePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [displayCount, setDisplayCount] = useState(7);
  
  const genre = getTVGenreBySlug(slug);
  
  // Set page title
  useEffect(() => {
    if (genre) {
      document.title = `${genre.name} TV Shows - Watch Online`;
    }
  }, [genre]);
  
  if (!genre) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Genre Not Found</h1>
            <p className="text-gray-400">The requested TV genre could not be found.</p>
            <Link href="/series" className="text-purple-400 hover:text-purple-300 mt-4 inline-block">
              ← Back to TV Series
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get all series from static data - sorted by newest first
  const allSeriesData = Object.entries(TV_SERIES_STATIC)
    .filter(([_, data]) => data.name) // Only series with names
    .sort((a, b) => {
      // Sort by first_air_date (newest first)
      const dateA = a[1].first_air_date ? new Date(a[1].first_air_date).getTime() : 0;
      const dateB = b[1].first_air_date ? new Date(b[1].first_air_date).getTime() : 0;
      return dateB - dateA;
    })
    .map(([imdbId, data]) => ({
      imdb_id: imdbId,
      tmdb_id: data.tmdb_id,
      name: data.name || `TV Series ${imdbId}`,
      poster_path: data.poster_path,
      backdrop_path: data.backdrop_path,
      overview: data.overview,
      first_air_date: data.first_air_date,
      vote_average: data.vote_average || 0,
      number_of_seasons: data.number_of_seasons || data.seasons?.length || 0,
      episodeCount: data.seasons?.reduce((sum, season) => sum + season.episodes.length, 0) || 0
    }));
  
  const seriesInGenre = allSeriesData.slice(0, displayCount);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/series" className="text-purple-400 hover:text-purple-300">
              ← Back to TV Series
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">{genre.name} TV Shows</h1>
          <p className="text-gray-400">{genre.description}</p>
          <p className="text-purple-400 mt-2 text-sm">
            📺 Showing {allSeriesData.length.toLocaleString()} TV shows • New releases first
          </p>
        </div>

        {/* Series Grid */}
        {seriesInGenre.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📺</div>
            <h2 className="text-2xl font-bold text-white mb-2">No TV Shows Available</h2>
            <p className="text-gray-400">No TV shows found in the {genre.name} genre.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {seriesInGenre.map((series) => (
                <Link
                  key={series.imdb_id}
                  href={`/series/${createSeriesSlug(series.name, series.tmdb_id || series.imdb_id)}`}
                  className="group"
                >
                  <div className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all duration-200">
                    {/* Poster */}
                    <div className="relative aspect-[2/3] bg-gray-700">
                      <Image
                        src={getTVImageUrl(series.poster_path, 'w500')}
                        alt={series.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      {/* Episode Count Badge */}
                      <div className="absolute top-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                        {series.episodeCount} eps
                      </div>
                      {/* Genre Badge */}
                      <div className="absolute top-2 left-2 bg-purple-600 bg-opacity-90 text-white text-xs px-2 py-1 rounded">
                        {genre.name}
                      </div>
                    </div>
                    
                    {/* Info */}
                    <div className="p-3">
                      <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1 group-hover:text-purple-400 transition-colors">
                        {series.name}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{series.first_air_date?.split('-')[0] || 'N/A'}</span>
                        {series.vote_average > 0 && (
                          <span className="flex items-center">
                            ⭐ {series.vote_average.toFixed(1)}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-purple-400 mt-1">
                        {series.number_of_seasons} {series.number_of_seasons === 1 ? 'Season' : 'Seasons'}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Load More Button */}
            {displayCount < allSeriesData.length && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setDisplayCount(prev => Math.min(prev + 7, allSeriesData.length))}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg"
                >
                  Load More ({allSeriesData.length - displayCount} remaining)
                </button>
                <p className="text-gray-400 text-sm mt-2">
                  Showing {displayCount} of {allSeriesData.length} series in {genre.name}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
