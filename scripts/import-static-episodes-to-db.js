const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function importStaticEpisodesToDatabase() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('moviesDB');
    const episodesCollection = db.collection('episodes');
    
    // Read the static episodes file
    const episodesFilePath = path.join(__dirname, '..', 'data', 'vidsrc-episodes.txt');
    
    if (!fs.existsSync(episodesFilePath)) {
      throw new Error(`Episodes file not found: ${episodesFilePath}`);
    }
    
    console.log('📁 Reading episodes file...');
    const episodesContent = fs.readFileSync(episodesFilePath, 'utf8');
    const episodeLines = episodesContent.split('\n').filter(line => line.trim());
    
    console.log(`📊 Found ${episodeLines.length} episode entries`);
    
    // Clear existing episodes collection
    console.log('🗑️  Clearing existing episodes...');
    await episodesCollection.deleteMany({});
    console.log('✅ Cleared existing episodes');
    
    // Process episodes in batches
    const BATCH_SIZE = 1000;
    let totalInserted = 0;
    let batchCount = 0;
    
    console.log(`🚀 Starting import in batches of ${BATCH_SIZE}...`);
    
    for (let i = 0; i < episodeLines.length; i += BATCH_SIZE) {
      const batch = episodeLines.slice(i, i + BATCH_SIZE);
      const episodesToInsert = [];
      
      for (const line of batch) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;
        
        // Parse episode format: tt0041038_1x1
        const match = trimmedLine.match(/^(tt\d+)_(\d+)x(\d+)$/);
        if (!match) {
          console.log(`⚠️  Invalid format: ${trimmedLine}`);
          continue;
        }
        
        const [, imdbId, seasonNum, episodeNum] = match;
        
        // Create episode document
        const episodeDoc = {
          episode_imdb_id: trimmedLine, // Use the full episode ID as unique identifier
          tmdb_episode_id: null, // Will be null for static data
          series_tmdb_id: null, // Will be null for static data
          series_imdb_id: imdbId,
          series_name: `TV Series ${imdbId}`, // Placeholder name
          season_number: parseInt(seasonNum),
          episode_number: parseInt(episodeNum),
          episode_name: `Episode ${episodeNum}`,
          overview: '',
          still_path: null,
          air_date: null,
          vote_average: null,
          runtime: null,
          crew: [],
          guest_stars: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        episodesToInsert.push(episodeDoc);
      }
      
      if (episodesToInsert.length > 0) {
        try {
          await episodesCollection.insertMany(episodesToInsert, { ordered: false });
          totalInserted += episodesToInsert.length;
          batchCount++;
          
          const progress = ((i + batch.length) / episodeLines.length * 100).toFixed(1);
          console.log(`📦 Batch ${batchCount}: Inserted ${episodesToInsert.length} episodes (${progress}% complete)`);
          
        } catch (error) {
          if (error.code === 11000) {
            // Duplicate key error - some episodes might already exist
            console.log(`⚠️  Batch ${batchCount}: Some duplicates found, continuing...`);
          } else {
            console.error(`❌ Batch ${batchCount} failed:`, error.message);
          }
        }
      }
      
      // Add small delay between batches
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    console.log('\n🎉 IMPORT COMPLETE!');
    console.log(`📊 Total episodes imported: ${totalInserted}`);
    console.log(`📦 Batches processed: ${batchCount}`);
    
    // Create indexes for better performance
    console.log('🔧 Creating indexes...');
    await episodesCollection.createIndex({ episode_imdb_id: 1 }, { unique: true });
    await episodesCollection.createIndex({ series_imdb_id: 1 });
    await episodesCollection.createIndex({ series_imdb_id: 1, season_number: 1, episode_number: 1 });
    await episodesCollection.createIndex({ series_name: 1 });
    console.log('✅ Indexes created');
    
    // Get final count
    const finalCount = await episodesCollection.countDocuments();
    console.log(`📈 Final episode count in database: ${finalCount}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the import
importStaticEpisodesToDatabase();
