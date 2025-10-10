// Migration Script: Import TV Series Static Data to MongoDB
// Run this script once to migrate data from tvSeriesStatic.ts to MongoDB

const { MongoClient } = require('mongodb');
const path = require('path');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'moviesDB';
const COLLECTION_NAME = 'tvSeries';

async function migrateTVSeries() {
  console.log('🚀 Starting TV Series migration to MongoDB...\n');

  let client;
  
  try {
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Import the static data
    console.log('📥 Loading TV Series static data...');
    const { TV_SERIES_STATIC } = require('../app/data/tvSeriesStatic.ts');
    
    // Convert object to array of documents
    const seriesArray = Object.entries(TV_SERIES_STATIC).map(([imdbId, data]) => ({
      imdb_id: imdbId,
      tmdb_id: data.tmdb_id,
      name: data.name,
      poster_path: data.poster_path,
      backdrop_path: data.backdrop_path,
      overview: data.overview,
      first_air_date: data.first_air_date,
      vote_average: data.vote_average,
      number_of_seasons: data.number_of_seasons,
      seasons: data.seasons || [],
      created_at: new Date(),
      updated_at: new Date()
    }));

    console.log(`📊 Total series to migrate: ${seriesArray.length}\n`);

    // Clear existing data (optional)
    console.log('🗑️  Clearing existing TV series data...');
    await collection.deleteMany({});
    console.log('✅ Cleared existing data\n');

    // Insert in batches to avoid memory issues
    const BATCH_SIZE = 1000;
    let inserted = 0;

    for (let i = 0; i < seriesArray.length; i += BATCH_SIZE) {
      const batch = seriesArray.slice(i, i + BATCH_SIZE);
      await collection.insertMany(batch, { ordered: false });
      inserted += batch.length;
      console.log(`✅ Inserted ${inserted} / ${seriesArray.length} series`);
    }

    // Create indexes for better query performance
    console.log('\n🔍 Creating database indexes...');
    await collection.createIndex({ imdb_id: 1 }, { unique: true });
    await collection.createIndex({ tmdb_id: 1 });
    await collection.createIndex({ name: 1 });
    await collection.createIndex({ first_air_date: -1 });
    await collection.createIndex({ vote_average: -1 });
    console.log('✅ Indexes created\n');

    console.log('🎉 Migration completed successfully!');
    console.log(`📊 Total series migrated: ${inserted}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('\n📡 Disconnected from MongoDB');
    }
  }
}

// Run migration
migrateTVSeries();

