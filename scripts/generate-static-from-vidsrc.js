const fs = require('fs');
const path = require('path');

// TMDB API functions (simplified for static generation)
async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

async function getTVShowByImdbId(imdbId) {
  const apiKey = process.env.TMDB_API_KEY || 'your-tmdb-api-key';
  const url = `https://api.themoviedb.org/3/find/${imdbId}?api_key=${apiKey}&external_source=imdb_id`;
  
  const response = await fetchWithRetry(url);
  const data = await response.json();
  
  if (data.tv_results && data.tv_results.length > 0) {
    return data.tv_results[0];
  }
  return null;
}

async function getSeasonDetails(tmdbId, seasonNumber) {
  const apiKey = process.env.TMDB_API_KEY || 'your-tmdb-api-key';
  const url = `https://api.themoviedb.org/3/tv/${tmdbId}/season/${seasonNumber}?api_key=${apiKey}`;
  
  const response = await fetchWithRetry(url);
  const data = await response.json();
  
  return data.episodes || [];
}

function parseEpisodeId(episodeId) {
  // Format: tt1234567_1x5 (series_imdb_id_season_number_x_episode_number)
  const match = episodeId.match(/^(tt\d+)_(\d+)x(\d+)$/);
  if (match) {
    return {
      seriesImdbId: match[1],
      seasonNumber: parseInt(match[2]),
      episodeNumber: parseInt(match[3])
    };
  }
  return null;
}

async function generateStaticFromVidSrc() {
  console.log('🎬 Generating Static TV Series from VidSrc Data...\n');

  try {
    // Read VidSrc data
    const tvSeriesPath = path.join(__dirname, '..', 'data', 'vidsrc-tv-series.txt');
    const episodesPath = path.join(__dirname, '..', 'data', 'vidsrc-episodes.txt');

    if (!fs.existsSync(tvSeriesPath) || !fs.existsSync(episodesPath)) {
      throw new Error('VidSrc data files not found. Run download-vidsrc-data.js first.');
    }

    const tvSeriesData = fs.readFileSync(tvSeriesPath, 'utf8');
    const episodesData = fs.readFileSync(episodesPath, 'utf8');

    const tvSeriesIds = tvSeriesData.trim().split(/\s+/);
    const episodeIds = episodesData.trim().split(/\s+/);

    console.log(`📊 Processing ${tvSeriesIds.length} TV series and ${episodeIds.length} episodes`);

    // Parse episodes and group by series
    const seriesEpisodes = {};
    
    console.log('📋 Parsing episode data...');
    for (const episodeId of episodeIds.slice(0, 1000)) { // Limit to first 1000 for testing
      const parsed = parseEpisodeId(episodeId);
      if (parsed) {
        if (!seriesEpisodes[parsed.seriesImdbId]) {
          seriesEpisodes[parsed.seriesImdbId] = [];
        }
        seriesEpisodes[parsed.seriesImdbId].push({
          episodeId,
          seasonNumber: parsed.seasonNumber,
          episodeNumber: parsed.episodeNumber
        });
      }
    }

    console.log(`✅ Parsed episodes for ${Object.keys(seriesEpisodes).length} series`);

    // Generate static data for first 10 popular series
    const staticSeries = [];
    const popularSeries = tvSeriesIds.slice(0, 10);

    console.log('\n🎭 Fetching TV series details...');
    
    for (const seriesImdbId of popularSeries) {
      try {
        console.log(`📺 Fetching: ${seriesImdbId}...`);
        
        const tvShow = await getTVShowByImdbId(seriesImdbId);
        if (!tvShow) {
          console.log(`❌ No TMDB data for ${seriesImdbId}`);
          continue;
        }

        const seriesEpisodesList = seriesEpisodes[seriesImdbId] || [];
        if (seriesEpisodesList.length === 0) {
          console.log(`❌ No episodes found for ${seriesImdbId}`);
          continue;
        }

        // Get episodes for first season only (to keep it manageable)
        const firstSeasonEpisodes = seriesEpisodesList
          .filter(ep => ep.seasonNumber === 1)
          .slice(0, 5); // Limit to first 5 episodes

        if (firstSeasonEpisodes.length === 0) {
          console.log(`❌ No season 1 episodes for ${seriesImdbId}`);
          continue;
        }

        // Get season details from TMDB
        const seasonDetails = await getSeasonDetails(tvShow.id, 1);
        
        const episodes = firstSeasonEpisodes.map(ep => {
          const tmdbEpisode = seasonDetails.find(
            e => e.episode_number === ep.episodeNumber
          );
          
          return {
            episode_imdb_id: ep.episodeId,
            series_name: tvShow.name,
            season_number: ep.seasonNumber,
            episode_number: ep.episodeNumber,
            episode_name: tmdbEpisode?.name || `Episode ${ep.episodeNumber}`,
            overview: tmdbEpisode?.overview || '',
            still_path: tmdbEpisode?.still_path || tvShow.poster_path,
            air_date: tmdbEpisode?.air_date || tvShow.first_air_date,
            vote_average: tmdbEpisode?.vote_average || tvShow.vote_average,
            runtime: tmdbEpisode?.runtime || 45,
            series_imdb_id: seriesImdbId,
            series_tmdb_id: tvShow.id
          };
        });

        staticSeries.push({
          series_name: tvShow.name,
          series_imdb_id: seriesImdbId,
          series_tmdb_id: tvShow.id,
          poster_path: tvShow.poster_path,
          backdrop_path: tvShow.backdrop_path,
          overview: tvShow.overview,
          first_air_date: tvShow.first_air_date,
          number_of_seasons: tvShow.number_of_seasons,
          episodes: episodes
        });

        console.log(`✅ Added: ${tvShow.name} (${episodes.length} episodes)`);

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`❌ Error processing ${seriesImdbId}:`, error.message);
      }
    }

    // Generate static file
    const staticFilePath = path.join(__dirname, '..', 'app', 'data', 'tvSeriesStatic.ts');
    
    const staticFileContent = `// Static TV Series Data - No Database Required!
// Generated from VidSrc data on ${new Date().toISOString()}

export interface StaticEpisode {
  episode_imdb_id: string;
  series_name: string;
  season_number: number;
  episode_number: number;
  episode_name: string;
  overview: string;
  still_path: string | null;
  air_date: string;
  vote_average: number;
  runtime: number;
  series_imdb_id: string;
  series_tmdb_id: number;
}

export interface StaticSeries {
  series_name: string;
  series_imdb_id: string;
  series_tmdb_id: number;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  first_air_date: string;
  number_of_seasons: number;
  episodes: StaticEpisode[];
}

// Static TV Series Data - Generated from VidSrc
export const STATIC_TV_SERIES: StaticSeries[] = ${JSON.stringify(staticSeries, null, 2)};

// Helper function to get series by slug
export function getSeriesBySlug(slug: string): StaticSeries | undefined {
  return STATIC_TV_SERIES.find(series => {
    const seriesSlug = \`\${series.series_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}-\${series.series_tmdb_id}\`;
    return seriesSlug === slug;
  });
}

// Helper function to get episode by slug
export function getEpisodeBySlug(slug: string): StaticEpisode | undefined {
  for (const series of STATIC_TV_SERIES) {
    const episode = series.episodes.find(ep => {
      const episodeSlug = \`\${ep.episode_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}-s\${ep.season_number.toString().padStart(2, '0')}e\${ep.episode_number.toString().padStart(2, '0')}-\${ep.episode_imdb_id}\`;
      return episodeSlug === slug;
    });
    if (episode) return episode;
  }
  return undefined;
}

// Helper function to extract TMDB ID from slug
function extractTmdbIdFromSlug(slug: string): number | null {
  const match = slug.match(/-(\\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}
`;

    fs.writeFileSync(staticFilePath, staticFileContent);

    console.log('\n✅ Generated static TV series file!');
    console.log(`📁 File: ${staticFilePath}`);
    console.log(`📺 Series: ${staticSeries.length}`);
    console.log(`🎬 Total Episodes: ${staticSeries.reduce((sum, s) => sum + s.episodes.length, 0)}`);

    console.log('\n📋 Generated Series:');
    staticSeries.forEach(series => {
      console.log(`  📺 ${series.series_name} (${series.episodes.length} episodes)`);
    });

    console.log('\n🚀 Next steps:');
    console.log('1. Visit: http://localhost:3000/series-static');
    console.log('2. Browse the generated TV series');
    console.log('3. Add more series by editing the script');

    return staticSeries;

  } catch (error) {
    console.error('❌ Error generating static data:', error.message);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  generateStaticFromVidSrc()
    .then(() => {
      console.log('\n🎉 Static generation completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Static generation failed:', error.message);
      process.exit(1);
    });
}

module.exports = { generateStaticFromVidSrc };

