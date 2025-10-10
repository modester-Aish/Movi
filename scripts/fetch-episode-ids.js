const https = require('https');
const fs = require('fs');
const path = require('path');

const TMDB_API_KEY = 'b31d2e5f33b74ffa7b3b483ff353f760';
const EPISODE_IDS_URL = 'https://vidsrc.me/ids/eps_imdb.txt';

console.log('📥 Fetching episode IDs from VidSrc...\n');

// Fetch episode IDs from VidSrc
https.get(EPISODE_IDS_URL, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', async () => {
    console.log('✅ Episode IDs downloaded successfully!\n');
    
    // Split IDs by space or newline
    const episodeIds = data.trim().split(/\s+/).filter(id => id.startsWith('tt'));
    console.log(`📊 Total episode IDs found: ${episodeIds.length}\n`);
    
    // Process first 100 episodes for testing
    const episodesToProcess = episodeIds.slice(0, 100);
    console.log(`🔄 Processing first ${episodesToProcess.length} episodes...\n`);
    
    const seriesData = {};
    let processed = 0;
    
    for (const episodeImdbId of episodesToProcess) {
      try {
        // Get episode details from TMDB
        const episodeInfo = await getEpisodeInfo(episodeImdbId);
        
        if (episodeInfo) {
          const { seriesImdbId, seriesTmdbId, seriesName, seasonNumber, episodeNumber, episodeName } = episodeInfo;
          
          // Initialize series if not exists
          if (!seriesData[seriesImdbId]) {
            seriesData[seriesImdbId] = {
              tmdb_id: seriesTmdbId,
              name: seriesName,
              seasons: []
            };
          }
          
          // Find or create season
          let season = seriesData[seriesImdbId].seasons.find(s => s.season_number === seasonNumber);
          if (!season) {
            season = {
              season_number: seasonNumber,
              episodes: []
            };
            seriesData[seriesImdbId].seasons.push(season);
          }
          
          // Add episode if not already exists
          const episodeExists = season.episodes.find(e => e.episode_imdb_id === episodeImdbId);
          if (!episodeExists) {
            season.episodes.push({
              episode_number: episodeNumber,
              episode_imdb_id: episodeImdbId,
              episode_name: episodeName
            });
          }
          
          processed++;
          console.log(`✓ [${processed}/${episodesToProcess.length}] ${seriesName} S${seasonNumber}E${episodeNumber} - ${episodeName}`);
        }
        
        // Rate limiting
        await sleep(250);
        
      } catch (error) {
        console.error(`✗ Error processing ${episodeImdbId}:`, error.message);
      }
    }
    
    // Sort seasons and episodes
    Object.keys(seriesData).forEach(seriesId => {
      seriesData[seriesId].seasons.sort((a, b) => a.season_number - b.season_number);
      seriesData[seriesId].seasons.forEach(season => {
        season.episodes.sort((a, b) => a.episode_number - b.episode_number);
      });
    });
    
    // Generate TypeScript file
    const outputPath = path.join(__dirname, '..', 'app', 'data', 'tvSeriesStatic.ts');
    const tsContent = generateTypeScriptFile(seriesData);
    
    fs.writeFileSync(outputPath, tsContent, 'utf8');
    
    console.log(`\n✅ Successfully generated tvSeriesStatic.ts!`);
    console.log(`📊 Total series: ${Object.keys(seriesData).length}`);
    console.log(`📁 File: ${outputPath}`);
    
  });

}).on('error', (err) => {
  console.error('❌ Error fetching episode IDs:', err);
});

// Helper function to get episode info from TMDB
async function getEpisodeInfo(imdbId) {
  return new Promise((resolve, reject) => {
    const url = `https://api.themoviedb.org/3/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          
          if (result.tv_episode_results && result.tv_episode_results.length > 0) {
            const episode = result.tv_episode_results[0];
            const seriesTmdbId = episode.show_id;
            const seasonNumber = episode.season_number;
            const episodeNumber = episode.episode_number;
            const episodeName = episode.name;
            
            // Get series info
            getSeriesInfo(seriesTmdbId).then(seriesInfo => {
              resolve({
                seriesImdbId: seriesInfo.imdb_id,
                seriesTmdbId: seriesTmdbId,
                seriesName: seriesInfo.name,
                seasonNumber: seasonNumber,
                episodeNumber: episodeNumber,
                episodeName: episodeName
              });
            }).catch(reject);
          } else {
            resolve(null);
          }
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

// Helper function to get series info from TMDB
async function getSeriesInfo(tmdbId) {
  return new Promise((resolve, reject) => {
    const url = `https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${TMDB_API_KEY}`;
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const series = JSON.parse(data);
          
          // Get external IDs
          const extUrl = `https://api.themoviedb.org/3/tv/${tmdbId}/external_ids?api_key=${TMDB_API_KEY}`;
          
          https.get(extUrl, (extRes) => {
            let extData = '';
            
            extRes.on('data', (chunk) => {
              extData += chunk;
            });
            
            extRes.on('end', () => {
              try {
                const externalIds = JSON.parse(extData);
                resolve({
                  imdb_id: externalIds.imdb_id || `tmdb_${tmdbId}`,
                  name: series.name
                });
              } catch (error) {
                reject(error);
              }
            });
          }).on('error', reject);
          
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

// Helper function to generate TypeScript file content
function generateTypeScriptFile(seriesData) {
  const header = `// Static TV Series Data
// Auto-generated from VidSrc episode IDs
// Generated: ${new Date().toISOString()}

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

export const TV_SERIES_STATIC: TVSeriesStatic = `;

  const jsonData = JSON.stringify(seriesData, null, 2);
  return header + jsonData + ';\n';
}

// Helper function to sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

