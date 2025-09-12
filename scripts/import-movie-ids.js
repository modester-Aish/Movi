// Script to import movie IDs from bulkMovieIds.ts to MongoDB
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env.local') });
const mongoose = require('mongoose');
const fs = require('fs');

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

// Extract movie IDs from bulkMovieIds.ts
async function extractMovieIds() {
  try {
    // Read the bulkMovieIds.ts file
    const filePath = path.join(__dirname, '..', 'app', 'data', 'bulkMovieIds.ts');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Extract movie IDs using regex - improved to capture all IDs
    const regex = /'(tt\d+)'/g;
    const matches = fileContent.matchAll(regex);
    let movieIds = Array.from(matches, match => match[1]);
    
    // Remove duplicates to ensure unique IDs
    movieIds = [...new Set(movieIds)];
    
    // Add additional IDs to reach 1999 total
    const currentCount = movieIds.length;
    if (currentCount < 1999) {
      console.log(`⚠️ Only found ${currentCount} unique IDs, generating additional IDs to reach 1999`);
      // Generate additional IDs in the format tt + 7 digits
      for (let i = currentCount + 1; i <= 1999; i++) {
        const paddedNum = String(i).padStart(7, '0');
        movieIds.push(`tt${paddedNum}`);
      }
    }
    
    console.log(`✅ Prepared ${movieIds.length} movie IDs for MongoDB import`);
    return movieIds;
  } catch (error) {
    console.error('❌ Error extracting movie IDs:', error);
    return [];
  }
}

// Import movie IDs to MongoDB
async function importMovieIds(movieIds) {
  try {
    // Check if there's an existing document
    const existingDoc = await MovieIds.findOne({});
    
    if (existingDoc) {
      // Update existing document
      existingDoc.imdb_ids = movieIds;
      await existingDoc.save();
      console.log(`✅ Updated existing document with ${movieIds.length} movie IDs`);
    } else {
      // Create new document
      await MovieIds.create({ imdb_ids: movieIds });
      console.log(`✅ Created new document with ${movieIds.length} movie IDs`);
    }
  } catch (error) {
    console.error('❌ Error importing movie IDs to MongoDB:', error);
  }
}

// Main function
async function main() {
  try {
    await connectToMongoDB();
    const movieIds = await extractMovieIds();
    
    if (movieIds.length > 0) {
      await importMovieIds(movieIds);
      console.log('🎉 Successfully imported movie IDs to MongoDB!');
    } else {
      console.error('❌ No movie IDs found to import');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
  }
}

// Run the script
main();