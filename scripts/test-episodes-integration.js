const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function testEpisodesIntegration() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('moviesDB');
    const seriesCollection = db.collection('tvSeries');
    const episodesCollection = db.collection('episodes');
    
    // Get some sample series
    const sampleSeries = await seriesCollection.find({}).limit(5).toArray();
    console.log(`\n📺 Testing with ${sampleSeries.length} sample series...`);
    
    for (const series of sampleSeries) {
      console.log(`\n🔍 Testing series: ${series.name} (IMDB: ${series.imdb_id}, TMDB: ${series.tmdb_id})`);
      
      // Count episodes for this series
      const episodeCount = await episodesCollection.countDocuments({ 
        series_imdb_id: series.imdb_id 
      });
      
      console.log(`  📊 Episodes found: ${episodeCount}`);
      
      if (episodeCount > 0) {
        // Get season breakdown
        const seasonBreakdown = await episodesCollection.aggregate([
          { $match: { series_imdb_id: series.imdb_id } },
          { $group: { 
              _id: '$season_number', 
              episodeCount: { $sum: 1 },
              episodes: { $push: { 
                episode_number: '$episode_number', 
                episode_name: '$episode_name' 
              }}
            }
          },
          { $sort: { _id: 1 } }
        ]).toArray();
        
        console.log(`  📋 Season breakdown:`);
        seasonBreakdown.forEach(season => {
          console.log(`    Season ${season._id}: ${season.episodeCount} episodes`);
          // Show first few episodes
          const firstEpisodes = season.episodes.slice(0, 3);
          firstEpisodes.forEach(ep => {
            console.log(`      - E${ep.episode_number}: ${ep.episode_name}`);
          });
          if (season.episodes.length > 3) {
            console.log(`      ... and ${season.episodes.length - 3} more`);
          }
        });
      } else {
        console.log(`  ⚠️  No episodes found for this series`);
      }
    }
    
    // Overall statistics
    console.log('\n📈 OVERALL STATISTICS:');
    
    const totalSeries = await seriesCollection.countDocuments();
    const totalEpisodes = await episodesCollection.countDocuments();
    const seriesWithEpisodes = await episodesCollection.distinct('series_imdb_id');
    
    console.log(`📊 Total series in database: ${totalSeries}`);
    console.log(`📊 Total episodes in database: ${totalEpisodes}`);
    console.log(`📊 Series with episodes: ${seriesWithEpisodes.length}`);
    console.log(`📊 Average episodes per series: ${(totalEpisodes / seriesWithEpisodes.length).toFixed(1)}`);
    
    // Top series by episode count
    console.log('\n🏆 TOP 10 SERIES BY EPISODE COUNT:');
    const topSeries = await episodesCollection.aggregate([
      { $group: { _id: '$series_imdb_id', episodeCount: { $sum: 1 } } },
      { $sort: { episodeCount: -1 } },
      { $limit: 10 }
    ]).toArray();
    
    for (const series of topSeries) {
      const seriesInfo = await seriesCollection.findOne({ imdb_id: series._id });
      const seriesName = seriesInfo ? seriesInfo.name : `Unknown (${series._id})`;
      console.log(`  ${seriesName}: ${series.episodeCount} episodes`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the test
testEpisodesIntegration();
