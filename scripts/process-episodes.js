const fs = require('fs');
const path = require('path');
const https = require('https');

const TMDB_API_KEY = 'b31d2e5f33b74ffa7b3b483ff353f760';
const INPUT_FILE = path.join(__dirname, '..', 'data', 'vidsrc-episodes.txt');
const OUTPUT_FILE = path.join(__dirname, '..', 'app', 'data', 'tvSeriesStatic.ts');

console.log('🔄 Processing episode data...\n');

// Read episode IDs
const data = fs.readFileSync(INPUT_FILE, 'utf8');
const episodeEntries = data.trim().split(/\s+/).filter(Boolean);

console.log(`📊 Total entries: ${episodeEntries.length}\n`);

// Parse and organize data
const seriesData = {};

episodeEntries.forEach(entry => {
  // Format: tt0041038_1x1
  const match = entry.match(/^(tt\d+)_(\d+)x(\d+)$/);
  
  if (match) {
    const [, seriesImdbId, season, episode] = match;
    const seasonNum = parseInt(season, 10);
    const episodeNum = parseInt(episode, 10);
    
    // Initialize series if not exists
    if (!seriesData[seriesImdbId]) {
      seriesData[seriesImdbId] = {
        seasons: {}
      };
    }
    
    // Initialize season if not exists
    if (!seriesData[seriesImdbId].seasons[seasonNum]) {
      seriesData[seriesImdbId].seasons[seasonNum] = [];
    }
    
    // Add episode
    if (!seriesData[seriesImdbId].seasons[seasonNum].includes(episodeNum)) {
      seriesData[seriesImdbId].seasons[seasonNum].push(episodeNum);
    }
  }
});

// Convert to proper format
const formattedData = {};

Object.keys(seriesData).forEach(seriesImdbId => {
  const seasons = [];
  
  Object.keys(seriesData[seriesImdbId].seasons)
    .sort((a, b) => parseInt(a) - parseInt(b))
    .forEach(seasonNum => {
      const episodes = seriesData[seriesImdbId].seasons[seasonNum]
        .sort((a, b) => a - b)
        .map(episodeNum => ({
          episode_number: episodeNum,
          episode_imdb_id: `${seriesImdbId}_${seasonNum}x${episodeNum}`
        }));
      
      seasons.push({
        season_number: parseInt(seasonNum),
        episodes: episodes
      });
    });
  
  formattedData[seriesImdbId] = {
    seasons: seasons
  };
});

console.log(`✅ Organized data for ${Object.keys(formattedData).length} series\n`);

// Generate TypeScript file
const tsContent = `// Static TV Series Data
// Auto-generated from VidSrc episode data
// Generated: ${new Date().toISOString()}
// Total Series: ${Object.keys(formattedData).length}

export interface TVSeriesStatic {
  [imdbId: string]: {
    tmdb_id?: number;
    name?: string;
    poster_path?: string;
    backdrop_path?: string;
    overview?: string;
    first_air_date?: string;
    vote_average?: number;
    number_of_seasons?: number;
    seasons?: {
      season_number: number;
      episodes: {
        episode_number: number;
        episode_imdb_id: string;
        episode_name?: string;
      }[];
    }[];
  };
}

export const TV_SERIES_STATIC: TVSeriesStatic = ${JSON.stringify(formattedData, null, 2)};
`;

fs.writeFileSync(OUTPUT_FILE, tsContent, 'utf8');

console.log(`✅ Generated TypeScript file!`);
console.log(`📁 File: ${OUTPUT_FILE}`);
console.log(`\n📊 Statistics:`);
console.log(`   Total series: ${Object.keys(formattedData).length}`);

// Show sample
const sampleSeries = Object.keys(formattedData)[0];
const sampleData = formattedData[sampleSeries];
console.log(`\n📝 Sample data (${sampleSeries}):`);
console.log(`   Seasons: ${sampleData.seasons.length}`);
console.log(`   First season episodes: ${sampleData.seasons[0].episodes.length}`);
console.log(JSON.stringify(sampleData.seasons[0].episodes.slice(0, 3), null, 2));
