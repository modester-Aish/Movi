// Script to check all movie IDs in MongoDB
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

// Check all movie IDs in MongoDB
async function checkMovieIds() {
  try {
    // Get all documents
    const allDocs = await MovieIds.find({});
    
    console.log(`✅ Found ${allDocs.length} documents in the movie_ids collection`);
    
    // Log details of each document
    allDocs.forEach((doc, index) => {
      console.log(`\nDocument ${index + 1}:`);
      console.log(`  _id: ${doc._id}`);
      console.log(`  imdb_ids count: ${doc.imdb_ids.length}`);
      console.log(`  First 5 IDs: ${doc.imdb_ids.slice(0, 5).join(', ')}`);
    });
    
    // Calculate total unique IDs
    let allIds = [];
    allDocs.forEach(doc => {
      if (doc.imdb_ids && Array.isArray(doc.imdb_ids)) {
        allIds = [...allIds, ...doc.imdb_ids];
      }
    });
    
    // Remove duplicates
    const uniqueIds = [...new Set(allIds)];
    
    console.log(`\n✅ Total IDs across all documents: ${allIds.length}`);
    console.log(`✅ Total unique IDs: ${uniqueIds.length}`);
    
  } catch (error) {
    console.error('❌ Error checking movie IDs:', error);
  }
}

// Main function
async function main() {
  try {
    await connectToMongoDB();
    await checkMovieIds();
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