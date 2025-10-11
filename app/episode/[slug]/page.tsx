import { notFound } from 'next/navigation';
import Link from "next/link";
import Image from "next/image";
import clientPromise from '@/lib/mongodb-client';

// Helper function to extract episode ID from slug
function extractEpisodeIdFromSlug(slug: string): string | null {
  // Match format like: episode-1-s01e01-tt33241853_1x1
  const match = slug.match(/tt(\d+_\d+x\d+)$/);
  return match ? `tt${match[1]}` : null;
}

export default async function EpisodePage({ 
  params,
  searchParams
}: { 
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const { play } = await searchParams;
  const episodeId = extractEpisodeIdFromSlug(slug);
  
  if (!episodeId) {
    notFound();
  }
  
  // Fetch episode data from MongoDB
  let episode = null;
  let series = null;
  
  try {
    const client = await clientPromise;
    const db = client.db('moviesDB');
    const episodesCollection = db.collection('episodes');
    const seriesCollection = db.collection('tvSeries');
    
    // Find the episode
    episode = await episodesCollection.findOne({ episode_imdb_id: episodeId });
    
    if (!episode) {
      console.log(`Episode not found: ${episodeId}`);
      notFound();
      return;
    }
    
    // Find the series
    series = await seriesCollection.findOne({ imdb_id: episode.series_imdb_id });
    
    console.log(`Found episode: ${episode.episode_name} for series: ${series?.name || 'Unknown'}`);
    
  } catch (error) {
    console.error('Error fetching episode data:', error);
    notFound();
    return;
  }
  
  // Create series slug for navigation
  const seriesSlug = series ? `${series.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}-${series.tmdb_id}` : '';
  
  // Generate Vidsrc embed URL for the episode (always show player like movies do)
  const vidsrcUrl = series?.tmdb_id 
    ? `https://vidsrc.xyz/embed/tv/${series.tmdb_id}/${episode.season_number}-${episode.episode_number}?autoplay=1`
    : `https://vidsrc.xyz/embed/tv/${episode.series_imdb_id}/${episode.season_number}-${episode.episode_number}?autoplay=1`;
  
  return (
    <>
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
                    src={vidsrcUrl}
                    title={`${episode.episode_name} - ${series?.name || 'TV Series'} S${episode.season_number}E${episode.episode_number}`}
                    frameBorder="0"
                    referrerPolicy="no-referrer"
                    allowFullScreen
                    allow="autoplay; fullscreen; picture-in-picture"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Episode Details Section - Responsive Layout */}
              <div className="bg-gray-100 p-4 md:p-6">
                <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                  {/* Left side - Episode Poster/Still */}
                  <div className="flex-shrink-0 mx-auto md:mx-0">
                    <div className="w-32 md:w-48">
                      <Image
                        src={episode.still_path ? `https://image.tmdb.org/t/p/w500${episode.still_path}` : (series?.poster_path ? `https://image.tmdb.org/t/p/w500${series.poster_path}` : '/placeholder.svg')}
                        alt={`${episode.episode_name} episode still`}
                        width={192}
                        height={288}
                        className="rounded-lg w-full h-auto"
                      />
                      <Link 
                        href={`/series/${seriesSlug}/season-${episode.season_number}`}
                        className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium text-center block transition-colors"
                      >
                        Back to Season
                      </Link>
                    </div>
                  </div>

                  {/* Right side - Episode Details */}
                  <div className="flex-1">
                    {/* Episode Title */}
                    <h1 className="text-2xl font-bold text-black mb-3">
                      {episode.episode_number}. {episode.episode_name}
                    </h1>
                    
                    {series && (
                      <h2 className="text-lg text-gray-700 mb-3">
                        {series.name} • Season {episode.season_number}
                      </h2>
                    )}

                    {/* Synopsis */}
                    {episode.overview && (
                      <p className="text-black italic mb-4 leading-relaxed">
                        {episode.overview}
                      </p>
                    )}

                    {/* Episode Details - Responsive grid layout */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div className="flex">
                        <span className="font-bold text-black w-20">Genre:</span>
                        <span className="text-green-500 ml-2">
                          {series?.genres?.slice(0, 3).map((genre: any, index: number) => 
                            `${typeof genre === 'object' ? genre.name : genre}${index < Math.min(series?.genres?.length || 0, 3) - 1 ? ', ' : ''}`
                          ).join('') || 'TV Series'}
                        </span>
                      </div>

                      <div className="flex">
                        <span className="font-bold text-black w-20">Actor:</span>
                        <span className="text-green-500 ml-2">N/A</span>
                      </div>

                      <div className="flex">
                        <span className="font-bold text-black w-20">Director:</span>
                        <span className="text-green-500 ml-2">N/A</span>
                      </div>

                      <div className="flex">
                        <span className="font-bold text-black w-20">Country:</span>
                        <span className="text-green-500 ml-2">N/A</span>
                      </div>

                      <div className="flex">
                        <span className="font-bold text-black w-20">Quality:</span>
                        <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-medium ml-2">
                          HD
                        </span>
                      </div>

                      <div className="flex">
                        <span className="font-bold text-black w-20">Duration:</span>
                        <span className="text-green-500 ml-2">
                          {episode.runtime ? `${Math.floor(episode.runtime / 60)}h ${episode.runtime % 60}m` : 'N/A'}
                        </span>
                      </div>

                      <div className="flex">
                        <span className="font-bold text-black w-20">Aired:</span>
                        <span className="text-green-500 ml-2">
                          {episode.air_date ? new Date(episode.air_date).getFullYear().toString() : 'N/A'}
                        </span>
                      </div>

                      <div className="flex">
                        <span className="font-bold text-black w-20">IMDb:</span>
                        <span className="text-green-500 ml-2">
                          {episode.vote_average ? `${episode.vote_average.toFixed(1)}/10` : 'N/A'}
                        </span>
                      </div>

                      <div className="flex">
                        <span className="font-bold text-black w-20">Episode:</span>
                        <span className="text-green-500 ml-2">S{episode.season_number}E{episode.episode_number}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link 
                        href="/"
                        className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium text-center block transition-colors"
                      >
                        Trailer
                      </Link>
                      <button className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors">
                        Stream in HD
                      </button>
                      <button className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors">
                        Download in HD
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Related Content (25%) */}
            <div className="w-full lg:w-1/4 space-y-4">
              {/* Related Episodes */}
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold text-black mb-4">Related Episodes</h3>
                <div className="space-y-3">
                  <Link href={`/series/${seriesSlug}/season-${episode.season_number}`} className="flex gap-3 hover:bg-gray-50 p-2 rounded transition-colors">
                    <div className="w-16 h-20 rounded flex-shrink-0 overflow-hidden">
                      <Image
                        src={series?.poster_path ? `https://image.tmdb.org/t/p/w300${series.poster_path}` : '/placeholder.svg'}
                        alt={`Season ${episode.season_number}`}
                        width={64}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-black line-clamp-2">Season {episode.season_number} Episodes</h4>
                      <p className="text-xs text-gray-600">All episodes from this season</p>
                    </div>
                  </Link>
                  {series && (
                    <Link href={`/series/${seriesSlug}`} className="flex gap-3 hover:bg-gray-50 p-2 rounded transition-colors">
                      <div className="w-16 h-20 rounded flex-shrink-0 overflow-hidden">
                        <Image
                          src={series.poster_path ? `https://image.tmdb.org/t/p/w300${series.poster_path}` : '/placeholder.svg'}
                          alt={series.name}
                          width={64}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-black line-clamp-2">{series.name}</h4>
                        <p className="text-xs text-gray-600">All seasons and episodes</p>
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const episodeId = extractEpisodeIdFromSlug(slug);
  
  if (!episodeId) {
    return {
      title: 'Episode Not Found',
      description: 'The requested episode could not be found.',
    };
  }
  
  // Fetch episode data for metadata
  try {
    const client = await clientPromise;
    const db = client.db('moviesDB');
    const episodesCollection = db.collection('episodes');
    const seriesCollection = db.collection('tvSeries');
    
    const episode = await episodesCollection.findOne({ episode_imdb_id: episodeId });
    if (!episode) {
  return {
    title: 'Episode Not Found',
    description: 'The requested episode could not be found.',
  };
    }
    
    const series = await seriesCollection.findOne({ imdb_id: episode.series_imdb_id });
    
    return {
      title: `${episode.episode_name} - ${series?.name || 'TV Series'} S${episode.season_number}E${episode.episode_number}`,
      description: episode.overview || `Watch ${episode.episode_name} from ${series?.name || 'TV Series'} Season ${episode.season_number}.`,
    };
  } catch (error) {
    return {
      title: 'Episode Not Found',
      description: 'The requested episode could not be found.',
    };
  }
}