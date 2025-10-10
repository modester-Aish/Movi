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

async function generateAllVidSrcData() {
  console.log('🎬 Generating COMPLETE VidSrc Static Data...\n');
  console.log('⚠️  This will process ALL series and episodes!\n');

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

    console.log(`📊 Total Data:`);
    console.log(`   📺 TV Series: ${tvSeriesIds.length.toLocaleString()}`);
    console.log(`   🎬 Episodes: ${episodeIds.length.toLocaleString()}`);

    // Parse ALL episodes and group by series
    const seriesEpisodes = {};
    
    console.log('\n📋 Parsing ALL episode data...');
    console.log('   (This may take a few minutes)\n');
    
    let processedCount = 0;
    const totalEpisodes = episodeIds.length;
    
    for (let i = 0; i < episodeIds.length; i++) {
      const episodeId = episodeIds[i];
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

      // Progress indicator
      if (i % 10000 === 0) {
        const progress = ((i / totalEpisodes) * 100).toFixed(1);
        console.log(`   Progress: ${progress}% (${i.toLocaleString()} / ${totalEpisodes.toLocaleString()})`);
      }
    }

    console.log(`\n✅ Parsed ${processedCount.toLocaleString()} episodes for ${Object.keys(seriesEpisodes).length.toLocaleString()} series`);

    // Generate static data for ALL series
    const staticSeries = [];
    const seriesIds = Object.keys(seriesEpisodes);
    
    console.log('\n🎭 Generating static series data...');
    console.log('   (Processing all series)\n');

    for (let i = 0; i < seriesIds.length; i++) {
      const seriesImdbId = seriesIds[i];
      const seriesEpisodesList = seriesEpisodes[seriesImdbId];

      if (seriesEpisodesList.length === 0) continue;

      // Group episodes by season
      const seasonGroups = {};
      seriesEpisodesList.forEach(ep => {
        if (!seasonGroups[ep.seasonNumber]) {
          seasonGroups[ep.seasonNumber] = [];
        }
        seasonGroups[ep.seasonNumber].push(ep);
      });

      // Get all seasons
      const seasons = Object.keys(seasonGroups)
        .map(seasonNum => parseInt(seasonNum))
        .sort((a, b) => a - b);

      // Get ALL episodes for ALL seasons
      const allEpisodes = [];
      seasons.forEach(seasonNum => {
        const seasonEpisodes = seasonGroups[seasonNum]
          .sort((a, b) => a.episodeNumber - b.episodeNumber);

        seasonEpisodes.forEach(ep => {
          allEpisodes.push({
            episode_imdb_id: ep.episodeId,
            series_name: `Series ${i + 1}`,
            season_number: ep.seasonNumber,
            episode_number: ep.episodeNumber,
            episode_name: `S${ep.seasonNumber}E${ep.episodeNumber}`,
            overview: `Season ${ep.seasonNumber} Episode ${ep.episodeNumber}`,
            still_path: null,
            air_date: "2020-01-01",
            vote_average: 8.0,
            runtime: 45,
            series_imdb_id: seriesImdbId,
            series_tmdb_id: 1000 + i
          });
        });
      });

      staticSeries.push({
        series_name: `Series ${i + 1}`,
        series_imdb_id: seriesImdbId,
        series_tmdb_id: 1000 + i,
        poster_path: null,
        backdrop_path: null,
        overview: `TV Series with ${allEpisodes.length} episodes across ${seasons.length} seasons.`,
        first_air_date: "2020-01-01",
        number_of_seasons: seasons.length,
        episodes: allEpisodes
      });

      // Progress indicator
      if (i % 100 === 0) {
        const progress = ((i / seriesIds.length) * 100).toFixed(1);
        console.log(`   Progress: ${progress}% (${i.toLocaleString()} / ${seriesIds.length.toLocaleString()} series)`);
      }
    }

    console.log(`\n✅ Generated ${staticSeries.length.toLocaleString()} series`);

    // Calculate total episodes
    const totalEpisodesGenerated = staticSeries.reduce((sum, s) => sum + s.episodes.length, 0);

    // Generate static file
    console.log('\n📝 Writing static file...');
    const staticFilePath = path.join(__dirname, '..', 'app', 'data', 'tvSeriesStatic.ts');
    
    const staticFileContent = `// Static TV Series Data - No Database Required!
// Generated from COMPLETE VidSrc data on ${new Date().toISOString()}
// Total: ${staticSeries.length.toLocaleString()} series, ${totalEpisodesGenerated.toLocaleString()} episodes
// Source: https://vidsrc.me/ids/

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

// Static TV Series Data - ALL VidSrc Data
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

// Helper function to get all series
export function getAllStaticSeries(): StaticSeries[] {
  return STATIC_TV_SERIES;
}

// Helper function to extract TMDB ID from slug
function extractTmdbIdFromSlug(slug: string): number | null {
  const match = slug.match(/-(\\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}
`;

    fs.writeFileSync(staticFilePath, staticFileContent);

    console.log('✅ Static file written successfully!');

    // File size
    const stats = fs.statSync(staticFilePath);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

    console.log('\n📊 Final Statistics:');
    console.log(`   📁 File: ${staticFilePath}`);
    console.log(`   💾 Size: ${fileSizeMB} MB`);
    console.log(`   📺 Series: ${staticSeries.length.toLocaleString()}`);
    console.log(`   🎬 Episodes: ${totalEpisodesGenerated.toLocaleString()}`);
    console.log(`   🎯 Coverage: ${((staticSeries.length / tvSeriesIds.length) * 100).toFixed(1)}% of VidSrc series`);

    console.log('\n🚀 All Done!');
    console.log('   Visit: http://localhost:3000/series-static');

    return staticSeries;

  } catch (error) {
    console.error('❌ Error generating static data:', error.message);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  const startTime = Date.now();
  
  generateAllVidSrcData()
    .then(() => {
      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(1);
      console.log(`\n⏱️  Total time: ${duration} seconds`);
      console.log('🎉 Complete VidSrc import finished!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Import failed:', error.message);
      process.exit(1);
    });
}

module.exports = { generateAllVidSrcData };

