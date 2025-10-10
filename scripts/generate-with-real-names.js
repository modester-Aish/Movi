const fs = require('fs');
const path = require('path');

function parseEpisodeId(episodeId) {
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
  
  try {
    const response = await fetchWithRetry(url);
    const data = await response.json();
    
    if (data.tv_results && data.tv_results.length > 0) {
      return data.tv_results[0];
    }
  } catch (error) {
    console.log(`❌ TMDB error for ${imdbId}: ${error.message}`);
  }
  return null;
}

async function generateWithRealNames() {
  console.log('🎬 Generating TV Series with Real Names & Images...\n');

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

    // Parse episodes and group by series
    const seriesEpisodes = {};
    
    console.log('\n📋 Parsing episode data...');
    let processedCount = 0;
    const maxEpisodes = 50000; // Limit for performance
    
    for (let i = 0; i < Math.min(episodeIds.length, maxEpisodes); i++) {
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

      if (i % 10000 === 0) {
        console.log(`   Progress: ${((i / Math.min(episodeIds.length, maxEpisodes)) * 100).toFixed(1)}%`);
      }
    }

    console.log(`✅ Parsed ${processedCount.toLocaleString()} episodes for ${Object.keys(seriesEpisodes).length.toLocaleString()} series`);

    // Get top series by episode count
    const seriesWithEpisodeCounts = Object.entries(seriesEpisodes)
      .map(([seriesId, episodes]) => ({
        seriesId,
        episodeCount: episodes.length,
        episodes: episodes
      }))
      .sort((a, b) => b.episodeCount - a.episodeCount)
      .slice(0, 50); // Top 50 series

    console.log('\n🎭 Fetching real names from TMDB...');
    console.log('   (This may take a few minutes)\n');

    const staticSeries = [];

    for (let i = 0; i < seriesWithEpisodeCounts.length; i++) {
      const { seriesId, episodes } = seriesWithEpisodeCounts[i];
      
      console.log(`📺 Fetching: ${seriesId}...`);
      
      try {
        const tvShow = await getTVShowByImdbId(seriesId);
        
        if (!tvShow) {
          console.log(`   ❌ No TMDB data found`);
          continue;
        }

        // Group episodes by season
        const seasonGroups = {};
        episodes.forEach(ep => {
          if (!seasonGroups[ep.seasonNumber]) {
            seasonGroups[ep.seasonNumber] = [];
          }
          seasonGroups[ep.seasonNumber].push(ep);
        });

        const seasons = Object.keys(seasonGroups)
          .map(seasonNum => parseInt(seasonNum))
          .sort((a, b) => a - b);

        // Get first few episodes from first few seasons
        const allEpisodes = [];
        seasons.slice(0, 3).forEach(seasonNum => { // First 3 seasons
          const seasonEpisodes = seasonGroups[seasonNum]
            .sort((a, b) => a.episodeNumber - b.episodeNumber)
            .slice(0, 3); // First 3 episodes per season

          seasonEpisodes.forEach(ep => {
            allEpisodes.push({
              episode_imdb_id: ep.episodeId,
              series_name: tvShow.name,
              season_number: ep.seasonNumber,
              episode_number: ep.episodeNumber,
              episode_name: `S${ep.seasonNumber}E${ep.episodeNumber}`,
              overview: `Season ${ep.seasonNumber} Episode ${ep.episodeNumber}`,
              still_path: null,
              air_date: tvShow.first_air_date || "2020-01-01",
              vote_average: tvShow.vote_average || 8.0,
              runtime: 45,
              series_imdb_id: seriesId,
              series_tmdb_id: tvShow.id
            });
          });
        });

        staticSeries.push({
          series_name: tvShow.name,
          series_imdb_id: seriesId,
          series_tmdb_id: tvShow.id,
          poster_path: tvShow.poster_path,
          backdrop_path: tvShow.backdrop_path,
          overview: tvShow.overview || `TV Series with ${allEpisodes.length} episodes across ${seasons.length} seasons.`,
          first_air_date: tvShow.first_air_date || "2020-01-01",
          number_of_seasons: seasons.length,
          episodes: allEpisodes
        });

        console.log(`   ✅ Added: ${tvShow.name} (${allEpisodes.length} episodes)`);

      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
      }

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));

      // Progress indicator
      const progress = ((i + 1) / seriesWithEpisodeCounts.length * 100).toFixed(1);
      console.log(`   Progress: ${progress}% (${i + 1}/${seriesWithEpisodeCounts.length})\n`);
    }

    console.log(`✅ Generated ${staticSeries.length} series with real names!`);

    // Generate static file
    const staticFilePath = path.join(__dirname, '..', 'app', 'data', 'tvSeriesStatic.ts');
    
    const staticFileContent = `// Static TV Series Data - No Database Required!
// Generated with REAL names from TMDB on ${new Date().toISOString()}
// Total: ${staticSeries.length} series with real names and images

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

// Static TV Series Data - With Real Names!
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

    // File size
    const stats = fs.statSync(staticFilePath);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

    console.log('\n📊 Final Statistics:');
    console.log(`   📁 File: ${staticFilePath}`);
    console.log(`   💾 Size: ${fileSizeMB} MB`);
    console.log(`   📺 Series: ${staticSeries.length}`);
    console.log(`   🎬 Episodes: ${staticSeries.reduce((sum, s) => sum + s.episodes.length, 0)}`);

    console.log('\n📋 Generated Series:');
    staticSeries.forEach((series, index) => {
      console.log(`   ${index + 1}. ${series.series_name} (${series.episodes.length} episodes)`);
    });

    console.log('\n🚀 All Done!');
    console.log('   Visit: http://localhost:3000/series-static');
    console.log('   Now with REAL names and images!');

    return staticSeries;

  } catch (error) {
    console.error('❌ Error generating data:', error.message);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  generateWithRealNames()
    .then(() => {
      console.log('\n🎉 Real names generation completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Generation failed:', error.message);
      process.exit(1);
    });
}

module.exports = { generateWithRealNames };
