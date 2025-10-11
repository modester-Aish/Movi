import Link from "next/link";
import Image from "next/image";
import { getTVImageUrl, formatEpisodeCode } from "@/api/tmdb-tv";
// REMOVED: import { TV_SERIES_STATIC } from "@/data/tvSeriesStatic"; // 61MB - Now lazy loaded
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';

interface EpisodePageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Cache TMDB API calls for better performance
const getTMDBSeries = cache(async (tmdbId: number) => {
  if (!tmdbId) return null;
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${tmdbId}?api_key=b31d2e5f33b74ffa7b3b483ff353f760`,
      { next: { revalidate: 86400 } } // Cache for 24 hours
    );
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    return null;
  }
});

// Cache episode lookup for better performance (with dynamic import)
const findEpisodeInStatic = cache(async (episodeId: string) => {
  // TV_SERIES_STATIC removed - using MongoDB API instead
  return null;
});

// Extract episode ID from slug (e.g., "pilot-s01e01-tt0903747_1x1" -> "tt0903747_1x1")
function extractEpisodeIdFromSlug(slug: string): string | null {
  // Match both old format (tt0959621) and new format (tt0903747_1x1)
  const newFormatMatch = slug.match(/(tt\d+_\d+x\d+)$/);
  if (newFormatMatch) {
    return newFormatMatch[1];
  }
  
  const oldFormatMatch = slug.match(/(tt\d{7,8})$/);
  return oldFormatMatch ? oldFormatMatch[1] : null;
}

// Helper function to create series slug
function createSeriesSlug(name: string, tmdbId: number): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${slug}-${tmdbId}`;
}

export async function generateMetadata({ params }: EpisodePageProps): Promise<Metadata> {
  const { slug } = await params;
  const episodeId = extractEpisodeIdFromSlug(slug);
  
  if (!episodeId) {
    return {
      title: 'Episode Not Found',
      description: 'The requested episode could not be found.',
    };
  }
  
  // Static data lookup removed - using MongoDB API instead
  // Return default metadata for episode pages
  
  return {
    title: 'Episode Not Found',
    description: 'The requested episode could not be found.',
  };
}

interface EpisodeData {
  episode_imdb_id: string;
  tmdb_episode_id: number;
  series_tmdb_id: number;
  series_imdb_id?: string;
  series_name: string;
  season_number: number;
  episode_number: number;
  episode_name: string;
  overview?: string;
  still_path?: string;
  air_date?: string;
  vote_average?: number;
  runtime?: number;
}

interface OtherEpisode {
  episode_imdb_id: string;
  episode_number: number;
  episode_name: string;
  still_path?: string;
}

export default async function EpisodePlayerPage({ params }: EpisodePageProps) {
  const { slug } = await params;
  const episodeId = extractEpisodeIdFromSlug(slug);
  
  if (!episodeId) {
    notFound();
  }
  
  // Static data lookup removed - episode pages will use MongoDB API
  // For now, return 404 until MongoDB episode API is implemented
  notFound(); // Temporary - will implement MongoDB episode lookup later

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* YouTube Style Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Column - Main Content (75%) */}
          <div className="flex-1 lg:w-3/4 space-y-4">
            
            {/* Video Player */}
            <div className="bg-black rounded-lg overflow-hidden">
              <div className="relative pt-[56.25%] w-full">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://vidsrc.xyz/embed/tv/${episode.series_imdb_id || episode.episode_imdb_id}/${episode.season_number}-${episode.episode_number}`}
                  title={`${episode.series_name} S${episode.season_number}E${episode.episode_number} - ${episode.episode_name}`}
                  frameBorder="0"
                  referrerPolicy="no-referrer"
                  allowFullScreen
                  allow="autoplay; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Episode Details Section */}
            <div className="bg-gray-100 p-4 md:p-6">
              <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                
                {/* Left side - Series Poster */}
                <div className="flex-shrink-0 mx-auto md:mx-0">
                  <div className="w-32 md:w-48">
                    <Image
                      src={getTVImageUrl(series?.poster_path, 'w500')}
                      alt={`${episode.series_name} poster`}
                      width={192}
                      height={288}
                      className="rounded-lg w-full h-auto"
                    />
                    <Link 
                      href={`/series/${createSeriesSlug(episode.series_name, episode.series_tmdb_id)}`}
                      className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium text-center block transition-colors"
                    >
                      View Series
                    </Link>
                  </div>
                </div>

                {/* Right side - Episode Details */}
                <div className="flex-1">
                  {/* Episode Title */}
                  <h1 className="text-2xl font-bold text-black mb-3">
                    {formatEpisodeCode(episode.season_number, episode.episode_number)} - {episode.episode_name}
                  </h1>

                  {/* Synopsis */}
                  {episode.overview && (
                    <p className="text-black italic mb-4 leading-relaxed">
                      {episode.overview}
                    </p>
                  )}

                  {/* Episode Details - Responsive grid layout */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="flex">
                      <span className="font-bold text-black w-24">Series:</span>
                      <span className="text-green-500 ml-2">{episode.series_name}</span>
                    </div>

                    <div className="flex">
                      <span className="font-bold text-black w-24">Season:</span>
                      <span className="text-green-500 ml-2">{episode.season_number}</span>
                    </div>

                    <div className="flex">
                      <span className="font-bold text-black w-24">Episode:</span>
                      <span className="text-green-500 ml-2">{episode.episode_number}</span>
                    </div>

                    <div className="flex">
                      <span className="font-bold text-black w-24">Duration:</span>
                      <span className="text-green-500 ml-2">
                        {episode.runtime ? `${episode.runtime} min` : 'N/A'}
                      </span>
                    </div>

                    {episode.air_date && (
                      <div className="flex">
                        <span className="font-bold text-black w-24">Aired:</span>
                        <span className="text-green-500 ml-2">
                          {new Date(episode.air_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {episode.vote_average && (
                      <div className="flex">
                        <span className="font-bold text-black w-24">Rating:</span>
                        <span className="text-green-500 ml-2">
                          ⭐ {episode.vote_average.toFixed(1)}/10
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons - Responsive layout */}
                  <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    <Link 
                      href={`/series/${createSeriesSlug(episode.series_name, episode.series_tmdb_id)}/season-${episode.season_number}`}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium text-center transition-colors flex-1"
                    >
                      All Episodes
                    </Link>
                    <Link 
                      href={`/series/${createSeriesSlug(episode.series_name, episode.series_tmdb_id)}`}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium text-center transition-colors flex-1"
                    >
                      All Seasons
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Episode Title */}
            <div className="space-y-3">
              <h2 className="text-xl font-medium text-gray-900 leading-tight">
                {episode.series_name} - {formatEpisodeCode(episode.season_number, episode.episode_number)} - {episode.episode_name}
              </h2>
              
              {/* Episode Stats */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-6 text-sm text-gray-600">
                <span>Season {episode.season_number}</span>
                <span className="hidden sm:inline">•</span>
                <span>Episode {episode.episode_number}</span>
                {episode.air_date && (
                  <>
                    <span className="hidden sm:inline">•</span>
                    <span>{new Date(episode.air_date).getFullYear()}</span>
                  </>
                )}
                {episode.runtime && (
                  <>
                    <span className="hidden sm:inline">•</span>
                    <span>{episode.runtime} min</span>
                  </>
                )}
                {episode.vote_average && (
                  <>
                    <span className="hidden sm:inline">•</span>
                    <span>⭐ {episode.vote_average.toFixed(1)}</span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            {episode.overview && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">Synopsis</h3>
                  <p className="text-gray-800 leading-relaxed italic">
                    {episode.overview}
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Right Column - Other Episodes (25%) */}
          <div className="w-full lg:w-1/4 space-y-4">
            
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <button className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full font-medium">Season {episode.season_number}</button>
              <Link 
                href={`/series/${createSeriesSlug(episode.series_name, episode.series_tmdb_id)}`}
                className="text-gray-600 px-3 py-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                All Seasons
              </Link>
            </div>

            {/* Other Episodes List */}
            <div className="space-y-3 max-h-96 lg:max-h-screen overflow-y-auto">
              {otherEpisodes.length > 0 ? (
                otherEpisodes.map((otherEp: OtherEpisode) => (
                  <Link
                    key={otherEp.episode_imdb_id}
                    href={`/episode/${createEpisodeSlug(otherEp.episode_number, otherEp.episode_name, otherEp.episode_imdb_id)}`}
                    className="flex items-start space-x-3 group hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  >
                    <div className="relative w-24 h-16 sm:w-32 sm:h-20 rounded overflow-hidden flex-shrink-0 bg-gray-200">
                      {otherEp.still_path ? (
                        <Image
                          src={getTVImageUrl(otherEp.still_path, 'w342')}
                          alt={`Episode ${otherEp.episode_number}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                          <div className="text-center text-white">
                            <div className="text-lg">📺</div>
                            <div className="text-xs font-semibold">E{otherEp.episode_number}</div>
                          </div>
                        </div>
                      )}
                      <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
                        E{otherEp.episode_number}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-gray-900 text-xs sm:text-sm font-medium line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {otherEp.episode_number}. {otherEp.episode_name}
                      </h4>
                      <p className="text-gray-600 text-xs mt-1">{episode.series_name}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">No other episodes available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

