import Link from "next/link";
import Image from "next/image";
import { getTVImageUrl } from "@/api/tmdb-tv";
// REMOVED: import { TV_SERIES_STATIC } from "@/data/tvSeriesStatic"; // 61MB - Now lazy loaded
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import clientPromise from '@/lib/mongodb-client';

interface SeriesPageProps {
  params: Promise<{
    slug: string;
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

// Helper function to create series slug
function createSeriesSlug(name: string, id: string | number): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${slug}-${id}`;
}

export async function generateMetadata({ params }: SeriesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tmdbId = extractTmdbIdFromSlug(slug);
  
  if (!tmdbId) {
    return {
      title: 'Series Not Found',
      description: 'The requested TV series could not be found.',
    };
  }
  
  try {
    const series = await getTMDBSeries(tmdbId);
    if (series) {
      return {
        title: `${series.name} - Watch All Seasons Online`,
        description: series.overview || `Watch ${series.name} - All seasons and episodes available.`,
      };
    }
  } catch (error) {
    // Silent error handling
  }
  
  return {
    title: 'Series Not Found',
    description: 'The requested TV series could not be found.',
  };
}

interface SeasonData {
  season_number: number;
  episodeCount: number;
  episodes: {
    episode_imdb_id: string;
    episode_number: number;
    episode_name: string;
    still_path?: string;
  }[];
}

export default async function SeriesDetailPage({ params }: SeriesPageProps) {
  const { slug } = await params;
  const tmdbId = extractTmdbIdFromSlug(slug);
  
  if (!tmdbId) {
    notFound();
  }
  
  // Get series details from TMDB (cached)
  const series = await getTMDBSeries(tmdbId);
  if (!series) {
    notFound();
  }
  
  // Fetch seasons/episodes data directly from MongoDB
  let seasons: SeasonData[] = [];
  try {
    const client = await clientPromise;
    const db = client.db('moviesDB');
    const episodesCollection = db.collection('episodes');
    
    // First get the series from our database to get the IMDB ID
    const seriesCollection = db.collection('tvSeries');
    const seriesData = await seriesCollection.findOne({ tmdb_id: tmdbId });
    
    if (!seriesData || !seriesData.imdb_id) {
      console.log(`No series found in database for TMDB ID ${tmdbId}`);
      return;
    }
    
    // Fetch episodes for this series using IMDB ID (since static data uses IMDB IDs)
    const episodes = await episodesCollection
      .find({ series_imdb_id: seriesData.imdb_id })
      .sort({ season_number: 1, episode_number: 1 })
      .toArray();
    
    // Group episodes by season
    const seasonMap = new Map<number, SeasonData>();
    
    episodes.forEach((episode: any) => {
      const seasonNumber = episode.season_number;
      
      if (!seasonMap.has(seasonNumber)) {
        seasonMap.set(seasonNumber, {
          season_number: seasonNumber,
          episodeCount: 0,
          episodes: []
        });
      }
      
      const season = seasonMap.get(seasonNumber)!;
      season.episodeCount++;
      season.episodes.push({
        episode_imdb_id: episode.episode_imdb_id || `episode-${episode.episode_number}`,
        episode_number: episode.episode_number,
        episode_name: episode.episode_name || `Episode ${episode.episode_number}`,
        still_path: episode.still_path
      });
    });
    
    // Convert map to array and sort by season number
    seasons = Array.from(seasonMap.values()).sort((a, b) => a.season_number - b.season_number);
    
    console.log(`Found ${episodes.length} episodes for series ${tmdbId}, grouped into ${seasons.length} seasons`);
  } catch (error) {
    console.error('Error fetching episodes from MongoDB:', error);
    // Fallback to empty seasons array
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Series Header */}
        <div className="mb-8">
          {/* Backdrop */}
          {series.backdrop_path && (
            <div className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-6">
              <Image
                src={getTVImageUrl(series.backdrop_path, 'original')}
                alt={series.name}
                fill
                className="object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
            </div>
          )}
          
          {/* Series Info */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Poster */}
            <div className="flex-shrink-0 w-48 md:w-64">
              <Image
                src={getTVImageUrl(series.poster_path, 'w500')}
                alt={series.name}
                width={256}
                height={384}
                className="rounded-lg shadow-2xl"
              />
            </div>
            
            {/* Details */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-4">{series.name}</h1>
              
              <div className="flex flex-wrap gap-4 mb-4 text-sm">
                {series.first_air_date && (
                  <span className="text-gray-300">
                    📅 {new Date(series.first_air_date).getFullYear()}
                    {series.last_air_date && ` - ${new Date(series.last_air_date).getFullYear()}`}
                  </span>
                )}
                {series.vote_average && (
                  <span className="text-yellow-400">
                    ⭐ {series.vote_average.toFixed(1)}/10
                  </span>
                )}
                {series.status && (
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    series.status === 'Returning Series' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-500 text-white'
                  }`}>
                    {series.status}
                  </span>
                )}
              </div>
              
              {series.genres && series.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {series.genres.map((genre: any, index: number) => (
                    <span key={index} className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs">
                      {typeof genre === 'object' ? genre.name : genre}
                    </span>
                  ))}
                </div>
              )}
              
              {series.overview && (
                <p className="text-gray-300 leading-relaxed mb-4">{series.overview}</p>
              )}
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Seasons:</span>
                  <span className="text-white ml-2 font-semibold">{series.number_of_seasons || seasons.length}</span>
                </div>
                <div>
                  <span className="text-gray-400">Episodes:</span>
                  <span className="text-white ml-2 font-semibold">{series.number_of_episodes || seasons.reduce((sum: number, s: any) => sum + s.episodeCount, 0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seasons List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Seasons</h2>
          
          {seasons.length === 0 ? (
            <div className="text-center py-16 bg-gray-800 rounded-lg">
              <p className="text-gray-400">No episodes available for this series yet.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {seasons.map((season) => (
                <Link
                  key={season.season_number}
                  href={`/series/${slug}/season-${season.season_number}`}
                  className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 hover:ring-2 hover:ring-purple-500 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                        Season {season.season_number}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {season.episodeCount} {season.episodeCount === 1 ? 'Episode' : 'Episodes'}
                      </p>
                    </div>
                    <div className="text-gray-400 group-hover:text-purple-400 transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


