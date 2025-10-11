// Categorize All TV Series - Divide 17k series into Years, Genres, and Categories
// This script will organize all series into proper categories

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'moviesDB';

async function categorizeAllSeries() {
  console.log('🚀 Starting TV Series Categorization...\n');

  let client;
  
  try {
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db(DB_NAME);
    const tvSeriesCollection = db.collection('tvSeries');
    const tvGenresCollection = db.collection('tvGenres');
    const tvYearsCollection = db.collection('tvYears');

    // Get all TV series
    console.log('📊 Fetching all TV series...');
    const allSeries = await tvSeriesCollection.find({}).toArray();
    console.log(`✅ Found ${allSeries.length} TV series\n`);

    // 1. CATEGORIES - Divide by rating and year
    console.log('📂 Creating Categories...');
    const categories = {
      'New Releases': allSeries.filter(s => s.first_air_date && new Date(s.first_air_date).getFullYear() >= 2023),
      'Popular': allSeries.filter(s => s.vote_average >= 7.0),
      'Featured': allSeries.filter(s => s.vote_average >= 8.0),
      'Classic Shows': allSeries.filter(s => s.first_air_date && new Date(s.first_air_date).getFullYear() <= 2010),
      'Trending': allSeries.filter(s => s.first_air_date && new Date(s.first_air_date).getFullYear() >= 2020)
    };

    // Add category field to series
    for (const [categoryName, seriesList] of Object.entries(categories)) {
      console.log(`   📁 ${categoryName}: ${seriesList.length} series`);
      await tvSeriesCollection.updateMany(
        { imdb_id: { $in: seriesList.map(s => s.imdb_id) } },
        { $addToSet: { categories: categoryName } }
      );
    }

    // 2. YEARS - Group by release year
    console.log('\n📅 Creating Years...');
    const yearGroups = {};
    allSeries.forEach(series => {
      if (series.first_air_date) {
        const year = new Date(series.first_air_date).getFullYear();
        if (!yearGroups[year]) yearGroups[year] = [];
        yearGroups[year].push(series);
      }
    });

    // Save years to database
    const yearData = Object.entries(yearGroups).map(([year, seriesList]) => ({
      year: parseInt(year),
      series_count: seriesList.length,
      series_ids: seriesList.map(s => s.imdb_id),
      created_at: new Date()
    }));

    await tvYearsCollection.deleteMany({});
    await tvYearsCollection.insertMany(yearData);
    console.log(`✅ Created ${yearData.length} year categories`);

    // 3. GENRES - Create genre categories based on series data
    console.log('\n🎭 Creating Genres...');
    
    // Define genre mappings based on series names and data
    const genreMappings = {
      'Action': ['action', 'adventure', 'thriller', 'crime'],
      'Comedy': ['comedy', 'sitcom', 'funny'],
      'Drama': ['drama', 'melodrama', 'soap'],
      'Horror': ['horror', 'scary', 'supernatural', 'paranormal'],
      'Sci-Fi': ['sci-fi', 'science fiction', 'futuristic', 'space'],
      'Fantasy': ['fantasy', 'magic', 'medieval', 'superhero'],
      'Romance': ['romance', 'love', 'romantic'],
      'Documentary': ['documentary', 'docu', 'biography'],
      'Reality': ['reality', 'real', 'competition', 'game show'],
      'Animation': ['animation', 'animated', 'cartoon', 'anime'],
      'Mystery': ['mystery', 'detective', 'investigation'],
      'Family': ['family', 'kids', 'children', 'teen']
    };

    const genreData = [];
    for (const [genreName, keywords] of Object.entries(genreMappings)) {
      const matchingSeries = allSeries.filter(series => {
        const name = (series.name || '').toLowerCase();
        const overview = (series.overview || '').toLowerCase();
        const text = `${name} ${overview}`;
        return keywords.some(keyword => text.includes(keyword));
      });

      if (matchingSeries.length > 0) {
        genreData.push({
          genre: genreName,
          slug: genreName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          series_count: matchingSeries.length,
          series_ids: matchingSeries.map(s => s.imdb_id),
          keywords: keywords,
          created_at: new Date()
        });

        // Add genre to series documents
        await tvSeriesCollection.updateMany(
          { imdb_id: { $in: matchingSeries.map(s => s.imdb_id) } },
          { $addToSet: { genres: genreName } }
        );

        console.log(`   🎭 ${genreName}: ${matchingSeries.length} series`);
      }
    }

    await tvGenresCollection.deleteMany({});
    await tvGenresCollection.insertMany(genreData);
    console.log(`✅ Created ${genreData.length} genre categories`);

    // 4. Add random shuffle to avoid same series in all categories
    console.log('\n🔀 Shuffling series for variety...');
    await tvSeriesCollection.updateMany(
      {},
      { $set: { random_order: Math.floor(Math.random() * 1000000) } }
    );

    // 5. Create indexes for better performance
    console.log('\n🔍 Creating indexes...');
    await tvSeriesCollection.createIndex({ categories: 1 });
    await tvSeriesCollection.createIndex({ genres: 1 });
    await tvSeriesCollection.createIndex({ first_air_date: 1 });
    await tvSeriesCollection.createIndex({ vote_average: -1 });
    await tvSeriesCollection.createIndex({ random_order: 1 });
    
    await tvGenresCollection.createIndex({ slug: 1 });
    await tvYearsCollection.createIndex({ year: 1 });

    console.log('✅ All indexes created');

    // 6. Summary
    console.log('\n📊 CATEGORIZATION SUMMARY:');
    console.log(`📁 Categories: ${Object.keys(categories).length}`);
    console.log(`📅 Years: ${yearData.length}`);
    console.log(`🎭 Genres: ${genreData.length}`);
    console.log(`📺 Total Series: ${allSeries.length}`);
    
    console.log('\n🎉 Categorization completed successfully!');
    console.log('🔄 Now refresh your browser to see categorized content!');

  } catch (error) {
    console.error('❌ Categorization failed:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('\n📡 Disconnected from MongoDB');
    }
  }
}

// Run categorization
categorizeAllSeries();
