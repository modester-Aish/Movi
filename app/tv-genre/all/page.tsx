import Link from "next/link";
import Image from "next/image";
import { getTVImageUrl } from "@/api/tmdb-tv";
import { getAllStaticSeries } from "@/data/tvSeriesStatic";
import { TV_SERIES_IDS } from "@/data/tvSeriesIds";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All TV Series - Browse Complete Collection',
  description: 'Browse our complete collection of TV series and shows online.',
};

// Helper function to create series slug
function createSeriesSlug(name: string, tmdbId: number): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${slug}-${tmdbId}`;
}

export default async function AllTVSeriesPage() {
  // Load latest series using TV_SERIES_IDS (last 100 for "all" page)
  const totalSeries = TV_SERIES_IDS.length;
  const seriesIds = TV_SERIES_IDS.slice(totalSeries - 100, totalSeries);
  
  // Fetch series data from TMDB API
  const seriesPromises = seriesIds.map(async (imdbId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/tmdb-tv?imdbId=${imdbId}`);
      if (response.ok) {
        const data = await response.json();
        return {
          series_tmdb_id: data.id,
          series_name: data.name || `TV Series ${imdbId}`,
          poster_path: data.poster_path,
          backdrop_path: data.backdrop_path,
          overview: data.overview,
          first_air_date: data.first_air_date,
          last_air_date: data.last_air_date,
          vote_average: data.vote_average || 0,
          popularity: data.popularity || 0,
          number_of_seasons: data.number_of_seasons,
          episodes: [] // We'll add episodes later if needed
        };
      }
    } catch (error) {
      // Silent error handling
    }
    // Fallback data
    return {
      series_tmdb_id: 0,
      series_name: `TV Series ${imdbId}`,
      poster_path: null,
      backdrop_path: null,
      overview: 'No overview available',
      first_air_date: null,
      last_air_date: null,
      vote_average: 0,
      popularity: 0,
      number_of_seasons: 1,
      episodes: []
    };
  });
  
  const fetchedSeries = await Promise.all(seriesPromises);
  
  // Sort by latest release date (last_air_date) - most recent first
  const allSeries = fetchedSeries.sort((a, b) => {
    if (!a.last_air_date && !b.last_air_date) return 0;
    if (!a.last_air_date) return 1;
    if (!b.last_air_date) return -1;
    return new Date(b.last_air_date).getTime() - new Date(a.last_air_date).getTime();
  });
  const totalSeries = TV_SERIES_IDS.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/series" className="text-purple-400 hover:text-purple-300">
              ← Back to Featured Series
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">All TV Series</h1>
          <p className="text-gray-400">Complete collection of {totalSeries.toLocaleString()} TV shows</p>
          <p className="text-yellow-400 text-sm mt-2">
            ⚠️ Loading all {totalSeries.toLocaleString()} series - Please wait...
          </p>
        </div>

        {/* Series Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {allSeries.map((series) => (
            <Link
              key={series.series_tmdb_id}
              href={`/series/${createSeriesSlug(series.series_name, series.imdb_id || '')}`}
              className="group"
            >
              <div className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all duration-200">
                {/* Poster */}
                <div className="relative aspect-[2/3] bg-gray-700">
                  <Image
                    src={getTVImageUrl(series.poster_path, 'w500')}
                    alt={series.series_name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  {/* Episode Count Badge */}
                  <div className="absolute top-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                    {series.episodes.length} eps
                  </div>
                  {/* Series Number Badge */}
                  <div className="absolute top-2 left-2 bg-purple-600 bg-opacity-90 text-white text-xs px-2 py-1 rounded">
                    #{series.series_tmdb_id}
                  </div>
                </div>
                
                {/* Info */}
                <div className="p-3">
                  <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1 group-hover:text-purple-400 transition-colors">
                    {series.series_name}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{series.first_air_date?.split('-')[0] || 'N/A'}</span>
                    <span className="flex items-center">
                      📺 {series.number_of_seasons || 1} Season{series.number_of_seasons !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="text-xs text-purple-400 mt-1">
                    {series.episodes.length} Episodes Available
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer Info */}
        <div className="text-center mt-12 py-8 border-t border-gray-700">
          <p className="text-gray-400">
            🎉 Complete collection loaded! {totalSeries.toLocaleString()} TV series available.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Use TV Genres menu for faster browsing by category
          </p>
        </div>
      </div>
    </div>
  );
}
