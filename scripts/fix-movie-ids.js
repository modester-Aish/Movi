// Script to fix movie IDs in MongoDB
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env.local') });
const mongoose = require('mongoose');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// Define MovieIds model
const movieIdsSchema = new mongoose.Schema({
  imdb_ids: {
    type: [String],
    required: true,
    index: true
  }
}, {
  timestamps: true
});

const MovieIds = mongoose.models.movie_ids || mongoose.model('movie_ids', movieIdsSchema);

// Generate movie IDs
function generateMovieIds(count) {
  const movieIds = [];
  for (let i = 1; i <= count; i++) {
    const paddedNum = String(i).padStart(7, '0');
    movieIds.push(`tt${paddedNum}`);
  }
  return movieIds;
}

// Fix movie IDs in MongoDB
async function fixMovieIds() {
  try {
    // Delete all existing documents
    await MovieIds.deleteMany({});
    console.log('✅ Deleted all existing documents');
    
    // Create new documents with the specified counts
    const doc1 = await MovieIds.create({ imdb_ids: generateMovieIds(2000) });
    console.log(`✅ Created document 1 with ${doc1.imdb_ids.length} IDs`);
    
    const doc2 = await MovieIds.create({ imdb_ids: generateMovieIds(502) });
    console.log(`✅ Created document 2 with ${doc2.imdb_ids.length} IDs`);
    
    const doc3 = await MovieIds.create({ imdb_ids: generateMovieIds(866) });
    console.log(`✅ Created document 3 with ${doc3.imdb_ids.length} IDs`);
    
    const doc4 = await MovieIds.create({ imdb_ids: generateMovieIds(1949) });
    console.log(`✅ Created document 4 with ${doc4.imdb_ids.length} IDs`);
    
    // Check total IDs
    const allDocs = await MovieIds.find({});
    let totalIds = 0;
    allDocs.forEach(doc => {
      totalIds += doc.imdb_ids.length;
    });
    
    console.log(`\n✅ Created ${allDocs.length} documents with a total of ${totalIds} IDs`);
    
  } catch (error) {
    console.error('❌ Error fixing movie IDs:', error);
  }
}

// Main function
async function main() {
  try {
    await connectToMongoDB();
    await fixMovieIds();
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('\n✅ MongoDB connection closed');
  }
}

// Run the main function
main();