const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  try {
    console.log('Connecting to MongoDB...');
    console.log('URI:', process.env.MONGODB_URI);
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');
    
    // Test the movies collection
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    // Get the movies collection
    const moviesCollection = db.collection('movies');
    const count = await moviesCollection.countDocuments();
    console.log('Total documents in movies collection:', count);
    
    // Get one document to see the structure
    const sampleDoc = await moviesCollection.findOne({});
    if (sampleDoc) {
      console.log('Sample document structure:');
      console.log('_id:', sampleDoc._id);
      console.log('imdb_ids array length:', sampleDoc.imdb_ids ? sampleDoc.imdb_ids.length : 'No imdb_ids field');
      if (sampleDoc.imdb_ids && sampleDoc.imdb_ids.length > 0) {
        console.log('First 5 movie IDs:', sampleDoc.imdb_ids.slice(0, 5));
      }
    } else {
      console.log('No documents found in movies collection');
    }
    
    await mongoose.disconnect();
    console.log('✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testConnection();
