const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const TMDB_API_KEY = 'b31d2e5f33b74ffa7b3b483ff353f760';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

async function fetchEpisodesForAllSeries() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('moviesDB');
    const seriesCollection = db.collection('tvSeries');
    const episodesCollection = db.collection('episodes');
    
    // Get all series from database
    const allSeries = await seriesCollection.find({}).toArray();
    console.log(`Found ${allSeries.length} series in database`);
    
    let totalEpisodesAdded = 0;
    let seriesProcessed = 0;
    
    for (const series of allSeries) {
      try {
        console.log(`\nProcessing series: ${series.name} (TMDB ID: ${series.tmdb_id})`);
        
        // Check if we already have episodes for this series
        const existingEpisodes = await episodesCollection.countDocuments({ series_tmdb_id: series.tmdb_id });
        if (existingEpisodes > 0) {
          console.log(`  Already has ${existingEpisodes} episodes, skipping...`);
          seriesProcessed++;
          continue;
        }
        
        // Fetch series details with episodes from TMDB
        const response = await fetch(`${TMDB_BASE_URL}/tv/${series.tmdb_id}?api_key=${TMDB_API_KEY}&append_to_response=external_ids`);
        if (!response.ok) {
          console.log(`  Failed to fetch TMDB data for ${series.name}`);
          continue;
        }
        
        const tmdbData = await response.json();
        
        if (!tmdbData.seasons || tmdbData.seasons.length === 0) {
          console.log(`  No seasons found for ${series.name}`);
          continue;
        }
        
        let episodesAdded = 0;
        
        // Process each season
        for (const season of tmdbData.seasons) {
          if (season.season_number === 0) continue; // Skip special seasons
          
          try {
            // Fetch season details with episodes
            const seasonResponse = await fetch(`${TMDB_BASE_URL}/tv/${series.tmdb_id}/season/${season.season_number}?api_key=${TMDB_API_KEY}`);
            if (!seasonResponse.ok) continue;
            
            const seasonData = await seasonResponse.json();
            
            if (!seasonData.episodes || seasonData.episodes.length === 0) continue;
            
            // Process each episode
            for (const episode of seasonData.episodes) {
              try {
                // Check if episode already exists
                const existingEpisode = await episodesCollection.findOne({ 
                  tmdb_episode_id: episode.id 
                });
                
                if (existingEpisode) {
                  console.log(`    Episode ${episode.season_number}x${episode.episode_number} already exists`);
                  continue;
                }
                
                // Create episode document
                const episodeDoc = {
                  episode_imdb_id: `episode-${episode.id}`, // Use TMDB ID as fallback
                  tmdb_episode_id: episode.id,
                  series_tmdb_id: series.tmdb_id,
                  series_imdb_id: series.imdb_id,
                  series_name: series.name,
                  season_number: episode.season_number,
                  episode_number: episode.episode_number,
                  episode_name: episode.name || `Episode ${episode.episode_number}`,
                  overview: episode.overview || '',
                  still_path: episode.still_path,
                  air_date: episode.air_date,
                  vote_average: episode.vote_average,
                  runtime: episode.runtime,
                  crew: episode.crew || [],
                  guest_stars: episode.guest_stars || [],
                  createdAt: new Date(),
                  updatedAt: new Date()
                };
                
                await episodesCollection.insertOne(episodeDoc);
                episodesAdded++;
                totalEpisodesAdded++;
                
                console.log(`    Added episode: ${episode.season_number}x${episode.episode_number} - ${episode.name}`);
                
                // Add small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 100));
                
              } catch (episodeError) {
                console.log(`    Error processing episode ${episode.season_number}x${episode.episode_number}:`, episodeError.message);
              }
            }
            
          } catch (seasonError) {
            console.log(`  Error processing season ${season.season_number}:`, seasonError.message);
          }
          
          // Add delay between seasons
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        console.log(`  Added ${episodesAdded} episodes for ${series.name}`);
        seriesProcessed++;
        
        // Add delay between series
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (seriesError) {
        console.log(`Error processing series ${series.name}:`, seriesError.message);
      }
    }
    
    console.log(`\n=== SUMMARY ===`);
    console.log(`Series processed: ${seriesProcessed}/${allSeries.length}`);
    console.log(`Total episodes added: ${totalEpisodesAdded}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

fetchEpisodesForAllSeries();

