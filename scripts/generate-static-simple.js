const fs = require('fs');
const path = require('path');

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

async function generateStaticSimple() {
  console.log('🎬 Generating Simple Static TV Series from VidSrc Data...\n');

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
    let processedCount = 0;
    const maxEpisodes = 10000; // Limit processing for performance
    
    for (const episodeId of episodeIds) {
      if (processedCount >= maxEpisodes) break;
      
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
        processedCount++;
      }
    }

    console.log(`✅ Parsed ${processedCount} episodes for ${Object.keys(seriesEpisodes).length} series`);

    // Generate static data for series with most episodes
    const seriesWithEpisodeCounts = Object.entries(seriesEpisodes)
      .map(([seriesId, episodes]) => ({
        seriesId,
        episodeCount: episodes.length,
        episodes: episodes
      }))
      .sort((a, b) => b.episodeCount - a.episodeCount)
      .slice(0, 20); // Top 20 series

    console.log('\n📺 Top series by episode count:');
    seriesWithEpisodeCounts.forEach((series, index) => {
      console.log(`  ${index + 1}. ${series.seriesId} (${series.episodeCount} episodes)`);
    });

    // Generate static data
    const staticSeries = seriesWithEpisodeCounts.map((seriesData, index) => {
      const { seriesId, episodes } = seriesData;
      
      // Group episodes by season
      const seasonGroups = {};
      episodes.forEach(ep => {
        if (!seasonGroups[ep.seasonNumber]) {
          seasonGroups[ep.seasonNumber] = [];
        }
        seasonGroups[ep.seasonNumber].push(ep);
      });

      // Get first few seasons and episodes
      const seasons = Object.keys(seasonGroups)
        .map(seasonNum => parseInt(seasonNum))
        .sort((a, b) => a - b)
        .slice(0, 3); // First 3 seasons

      const allEpisodes = [];
      seasons.forEach(seasonNum => {
        const seasonEpisodes = seasonGroups[seasonNum]
          .sort((a, b) => a.episodeNumber - b.episodeNumber)
          .slice(0, 5); // First 5 episodes per season

        seasonEpisodes.forEach(ep => {
          allEpisodes.push({
            episode_imdb_id: ep.episodeId,
            series_name: `TV Series ${index + 1}`,
            season_number: ep.seasonNumber,
            episode_number: ep.episodeNumber,
            episode_name: `Season ${ep.seasonNumber} Episode ${ep.episodeNumber}`,
            overview: `Episode ${ep.episodeNumber} of Season ${ep.seasonNumber}`,
            still_path: null,
            air_date: "2020-01-01",
            vote_average: 8.0,
            runtime: 45,
            series_imdb_id: seriesId,
            series_tmdb_id: 1000 + index
          });
        });
      });

      return {
        series_name: `TV Series ${index + 1}`,
        series_imdb_id: seriesId,
        series_tmdb_id: 1000 + index,
        poster_path: null,
        backdrop_path: null,
        overview: `A popular TV series with ${episodes.length} episodes across multiple seasons.`,
        first_air_date: "2020-01-01",
        number_of_seasons: seasons.length,
        episodes: allEpisodes
      };
    });

    // Generate static file
    const staticFilePath = path.join(__dirname, '..', 'app', 'data', 'tvSeriesStatic.ts');
    
    const staticFileContent = `// Static TV Series Data - No Database Required!
// Generated from VidSrc data on ${new Date().toISOString()}
// Total: ${staticSeries.length} series, ${staticSeries.reduce((sum, s) => sum + s.episodes.length, 0)} episodes

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
    staticSeries.forEach((series, index) => {
      console.log(`  📺 ${series.series_name} (${series.series_imdb_id}) - ${series.episodes.length} episodes`);
    });

    console.log('\n🚀 Next steps:');
    console.log('1. Visit: http://localhost:3000/series-static');
    console.log('2. Browse the generated TV series');
    console.log('3. Click on any series to see seasons and episodes');

    return staticSeries;

  } catch (error) {
    console.error('❌ Error generating static data:', error.message);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  generateStaticSimple()
    .then(() => {
      console.log('\n🎉 Static generation completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Static generation failed:', error.message);
      process.exit(1);
    });
}

module.exports = { generateStaticSimple };

