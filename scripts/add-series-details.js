const fs = require('fs');
const path = require('path');
const https = require('https');

const TMDB_API_KEY = 'b31d2e5f33b74ffa7b3b483ff353f760';
const STATIC_FILE = path.join(__dirname, '..', 'app', 'data', 'tvSeriesStatic.ts');

console.log('📥 Adding series details from TMDB...\n');

// Read existing static data
const fileContent = fs.readFileSync(STATIC_FILE, 'utf8');
const jsonMatch = fileContent.match(/export const TV_SERIES_STATIC: TVSeriesStatic = ({[\s\S]*});/);

if (!jsonMatch) {
  console.error('❌ Could not parse static data file');
  process.exit(1);
}

const seriesData = JSON.parse(jsonMatch[1]);
const seriesIds = Object.keys(seriesData);

console.log(`📊 Total series to process: ${seriesIds.length}\n`);

// Process ALL series
const idsToProcess = seriesIds;
console.log(`🔄 Processing ALL ${idsToProcess.length} series...\n`);

let processed = 0;
let updated = 0;

async function processSeriesId(imdbId) {
  try {
    // Get TMDB ID from IMDB ID
    const findUrl = `https://api.themoviedb.org/3/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;
    
    const findData = await fetchJson(findUrl);
    
    if (findData.tv_results && findData.tv_results.length > 0) {
      const tvResult = findData.tv_results[0];
      const tmdbId = tvResult.id;
      
      // Get detailed series info
      const seriesUrl = `https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${TMDB_API_KEY}`;
      const seriesInfo = await fetchJson(seriesUrl);
      
      // Update series data
      seriesData[imdbId].tmdb_id = tmdbId;
      seriesData[imdbId].name = seriesInfo.name;
      seriesData[imdbId].poster_path = seriesInfo.poster_path;
      seriesData[imdbId].backdrop_path = seriesInfo.backdrop_path;
      seriesData[imdbId].overview = seriesInfo.overview;
      seriesData[imdbId].first_air_date = seriesInfo.first_air_date;
      seriesData[imdbId].vote_average = seriesInfo.vote_average;
      seriesData[imdbId].number_of_seasons = seriesInfo.number_of_seasons;
      
      updated++;
      console.log(`✓ [${processed + 1}/${idsToProcess.length}] ${seriesInfo.name} (${imdbId})`);
    } else {
      console.log(`✗ [${processed + 1}/${idsToProcess.length}] Not found: ${imdbId}`);
    }
    
    processed++;
    
  } catch (error) {
    console.error(`✗ Error processing ${imdbId}:`, error.message);
    processed++;
    
    // If rate limit error, wait longer
    if (error.message.includes('429') || error.message.includes('rate limit')) {
      console.log('⏳ Rate limit hit, waiting 5 seconds...');
      await sleep(5000);
    }
  }
}

// Helper function to fetch JSON
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

// Helper function to sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Process all series sequentially
async function processAll() {
  for (const imdbId of idsToProcess) {
    await processSeriesId(imdbId);
    await sleep(500); // Rate limiting (slower to avoid limits)
  }
  
  // Generate updated TypeScript file
  const header = fileContent.split('export const TV_SERIES_STATIC')[0];
  const tsContent = header + `export const TV_SERIES_STATIC: TVSeriesStatic = ${JSON.stringify(seriesData, null, 2)};\n`;
  
  fs.writeFileSync(STATIC_FILE, tsContent, 'utf8');
  
  console.log(`\n✅ Updated series details!`);
  console.log(`📊 Processed: ${processed}/${idsToProcess.length}`);
  console.log(`✓ Updated: ${updated}`);
  console.log(`📁 File: ${STATIC_FILE}`);
}

processAll().catch(console.error);

