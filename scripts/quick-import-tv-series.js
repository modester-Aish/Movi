// Quick Import Script - Import TV Series Data to MongoDB
// This script will import the data directly without using the large static file

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/moviesDB';
const DB_NAME = 'moviesDB';
const COLLECTION_NAME = 'tvSeries';

async function quickImport() {
  console.log('🚀 Starting Quick TV Series Import...\n');

  let client;
  
  try {
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Sample TV Series data for testing
    const sampleSeries = [
      {
        imdb_id: "tt0903747",
        tmdb_id: 1396,
        name: "Breaking Bad",
        poster_path: "/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
        backdrop_path: "/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
        overview: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
        first_air_date: "2008-01-20",
        vote_average: 8.9,
        number_of_seasons: 5,
        seasons: [
          {
            season_number: 1,
            episodes: [
              { episode_number: 1, episode_imdb_id: "tt0903747_1x1", episode_name: "Pilot" },
              { episode_number: 2, episode_imdb_id: "tt0903747_1x2", episode_name: "Cat's in the Bag..." }
            ]
          }
        ],
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        imdb_id: "tt0944947",
        tmdb_id: 1399,
        name: "Game of Thrones",
        poster_path: "/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg",
        backdrop_path: "/2OMB0ynKlyIenMJWI2Dy9IWT4c.jpg",
        overview: "Seven noble families fight for control of the mythical land of Westeros.",
        first_air_date: "2011-04-17",
        vote_average: 8.3,
        number_of_seasons: 8,
        seasons: [
          {
            season_number: 1,
            episodes: [
              { episode_number: 1, episode_imdb_id: "tt0944947_1x1", episode_name: "Winter Is Coming" },
              { episode_number: 2, episode_imdb_id: "tt0944947_1x2", episode_name: "The Kingsroad" }
            ]
          }
        ],
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        imdb_id: "tt0460649",
        tmdb_id: 1416,
        name: "How I Met Your Mother",
        poster_path: "/9jYz8uM8pN6tOe7kLr4K9N3B2V8.jpg",
        backdrop_path: "/dXz5H9q7g7L5Z8R9H2K3M4N5P6Q7.jpg",
        overview: "A father recounts to his children, through a series of flashbacks, the journey he and his four best friends took leading up to him meeting their mother.",
        first_air_date: "2005-09-19",
        vote_average: 8.3,
        number_of_seasons: 9,
        seasons: [
          {
            season_number: 1,
            episodes: [
              { episode_number: 1, episode_imdb_id: "tt0460649_1x1", episode_name: "Pilot" },
              { episode_number: 2, episode_imdb_id: "tt0460649_1x2", episode_name: "Purple Giraffe" }
            ]
          }
        ],
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    console.log(`📊 Importing ${sampleSeries.length} sample TV series...`);

    // Clear existing data
    await collection.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert sample data
    await collection.insertMany(sampleSeries);
    console.log('✅ Sample TV series imported successfully!');

    // Create indexes
    await collection.createIndex({ imdb_id: 1 }, { unique: true });
    await collection.createIndex({ name: 1 });
    await collection.createIndex({ first_air_date: -1 });
    console.log('🔍 Database indexes created');

    console.log('\n🎉 Quick import completed!');
    console.log('📺 Now refresh your browser to see TV series!');

  } catch (error) {
    console.error('❌ Import failed:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('\n📡 Disconnected from MongoDB');
    }
  }
}

// Run the import
quickImport();
