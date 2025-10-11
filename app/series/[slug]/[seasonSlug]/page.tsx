import Link from "next/link";
import Image from "next/image";
import { getTVImageUrl } from "@/api/tmdb-tv";
// REMOVED: import { TV_SERIES_STATIC } from "@/data/tvSeriesStatic"; // 61MB - Now lazy loaded
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';

interface SeasonPageProps {
  params: Promise<{
    slug: string;
    seasonSlug: string;
  }>;
}

// Cache TMDB API calls for better performance
const getTMDBSeries = cache(async (tmdbId: number) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${tmdbId}?api_key=b31d2e5f33b74ffa7b3b483ff353f760`,
    { next: { revalidate: 86400 } } // Cache for 24 hours
  );
  if (!response.ok) return null;
  return response.json();
});

// Extract TMDB ID from slug (e.g., "breaking-bad-1396" -> 1396)
function extractTmdbIdFromSlug(slug: string): number | null {
  const match = slug.match(/-(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}

// Extract season number from seasonSlug (e.g., "season-1" -> 1)
function extractSeasonNumber(seasonSlug: string): number | null {
  const match = seasonSlug.match(/^season-(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}

// Helper function to create episode slug
function createEpisodeSlug(seriesName: string, seasonNumber: number, episodeNumber: number, episodeName: string, episodeImdbId: string): string {
  const nameSlug = episodeName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const s = seasonNumber.toString().padStart(2, '0');
  const e = episodeNumber.toString().padStart(2, '0');
  return `${nameSlug}-s${s}e${e}-${episodeImdbId}`;
}

export async function generateMetadata({ params }: SeasonPageProps): Promise<Metadata> {
  const { slug, seasonSlug } = await params;
  const tmdbId = extractTmdbIdFromSlug(slug);
  const seasonNumber = extractSeasonNumber(seasonSlug);
  
  if (!tmdbId || seasonNumber === null) {
    return {
      title: 'Season Not Found',
      description: 'The requested season could not be found.',
    };
  }
  
  try {
    const series = await getTMDBSeries(tmdbId);
    if (series) {
      return {
        title: `${series.name} - Season ${seasonNumber} - Watch All Episodes`,
        description: `Watch all episodes of ${series.name} Season ${seasonNumber} online.`,
      };
    }
  } catch (error) {
    // Silent error handling
  }
  
  return {
    title: 'Season Not Found',
    description: 'The requested season could not be found.',
  };
}

interface EpisodeData {
  episode_imdb_id: string;
  episode_number: number;
  episode_name: string;
  overview?: string;
  still_path?: string;
  air_date?: string;
  vote_average?: number;
  runtime?: number;
}

export default async function SeasonPage({ params }: SeasonPageProps) {
  const { slug, seasonSlug } = await params;
  const tmdbId = extractTmdbIdFromSlug(slug);
  const seasonNumber = extractSeasonNumber(seasonSlug);
  
  if (!tmdbId || seasonNumber === null) {
    notFound();
  }
  
  // Get series details from TMDB (cached)
  const series = await getTMDBSeries(tmdbId);
  if (!series) {
    notFound();
  }
  
  // TV_SERIES_STATIC removed - using MongoDB API instead
  const staticData = null;
  
  // Static data removed - using TMDB data only
  const episodes: EpisodeData[] = [];
  
  if (episodes.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center space-x-2 text-gray-400">
            <li><Link href="/series" className="hover:text-purple-400">TV Series</Link></li>
            <li>›</li>
            <li><Link href={`/series/${slug}`} className="hover:text-purple-400">{series.name}</Link></li>
            <li>›</li>
            <li className="text-white">Season {seasonNumber}</li>
          </ol>
        </nav>

        {/* Season Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-4xl font-bold text-white">
              {series.name} - Season {seasonNumber}
            </h1>
          </div>
          <p className="text-gray-400">
            {episodes.length} {episodes.length === 1 ? 'Episode' : 'Episodes'}
          </p>
        </div>

        {/* Episodes List */}
        <div className="space-y-4">
          {episodes.map((episode: EpisodeData) => (
            <Link
              key={episode.episode_imdb_id}
              href={`/episode/${createEpisodeSlug(series.name, seasonNumber, episode.episode_number, episode.episode_name, episode.episode_imdb_id)}`}
              className="block bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all duration-200 group"
            >
              <div className="flex flex-col md:flex-row gap-4 p-4">
                {/* Episode Thumbnail */}
                <div className="relative w-full md:w-80 h-48 md:h-auto flex-shrink-0 bg-gray-700 rounded overflow-hidden">
                  <Image
                    src={getTVImageUrl(episode.still_path, 'w500')}
                    alt={`${series.name} S${seasonNumber}E${episode.episode_number}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200">
                    <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-200">
                      <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                  {/* Episode Number Badge */}
                  <div className="absolute top-2 left-2 bg-black bg-opacity-80 text-white px-3 py-1 rounded font-semibold">
                    E{episode.episode_number}
                  </div>
                  {/* Duration Badge */}
                  {episode.runtime && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                      {episode.runtime} min
                    </div>
                  )}
                </div>
                
                {/* Episode Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors">
                      {episode.episode_number}. {episode.episode_name}
                    </h3>
                    {episode.vote_average && (
                      <span className="text-yellow-400 text-sm ml-2">
                        ⭐ {episode.vote_average.toFixed(1)}
                      </span>
                    )}
                  </div>
                  
                  {episode.air_date && (
                    <p className="text-gray-400 text-sm mb-2">
                      Aired: {new Date(episode.air_date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  )}
                  
                  {episode.overview && (
                    <p className="text-gray-300 text-sm line-clamp-3">
                      {episode.overview}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}


