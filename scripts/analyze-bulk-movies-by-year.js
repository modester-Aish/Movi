const mongoose = require('mongoose');
require('dotenv').config();

// Movie schema (matching your Movie model)
const movieSchema = new mongoose.Schema({
  imdbId: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true, index: true },
  year: { type: Number, index: true },
  category: { 
    type: String, 
    required: true,
    enum: [
      'FEATURED', 'TRENDING', 'NEW_RELEASES', 'TOP_RATED',
      'ACTION', 'DRAMA', 'COMEDY', 'THRILLER', 'HORROR', 
      'ROMANCE', 'SCI_FI', 'ANIMATION', 'DOCUMENTARY', 'FAMILY'
    ],
    index: true
  },
  genre: { type: String, index: true },
  rating: { type: Number, min: 0, max: 10 },
  poster: String,
  backdrop: String,
  overview: String,
  runtime: Number,
  language: String,
  status: String,
  budget: Number,
  revenue: Number
}, {
  timestamps: true
});

const Movie = mongoose.models.Movie || mongoose.model('Movie', movieSchema);

async function analyzeMoviesByYear() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movies');
    console.log('✅ Connected to MongoDB');

    console.log('\n📊 Analyzing year-wise distribution of bulk movies...\n');

    // Get total movie count
    const totalMovies = await Movie.countDocuments();
    console.log(`🎬 Total movies in database: ${totalMovies.toLocaleString()}`);

    // Get movies with years
    const moviesWithYears = await Movie.countDocuments({ year: { $exists: true, $ne: null } });
    console.log(`📅 Movies with year data: ${moviesWithYears.toLocaleString()}`);
    console.log(`❌ Movies without year data: ${(totalMovies - moviesWithYears).toLocaleString()}\n`);

    // Year-wise distribution
    const yearDistribution = await Movie.aggregate([
      { $match: { year: { $exists: true, $ne: null } } },
      { $group: { _id: '$year', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    console.log('📈 YEAR-WISE DISTRIBUTION:');
    console.log('=' .repeat(50));
    
    let totalWithYears = 0;
    const decades = {};
    
    yearDistribution.forEach(({ _id: year, count }) => {
      totalWithYears += count;
      const decade = Math.floor(year / 10) * 10;
      decades[decade] = (decades[decade] || 0) + count;
      
      console.log(`${year}: ${count.toLocaleString().padStart(8)} movies`);
    });

    console.log('=' .repeat(50));
    console.log(`Total: ${totalWithYears.toLocaleString()} movies\n`);

    // Decade-wise summary
    console.log('🗓️ DECADE-WISE SUMMARY:');
    console.log('=' .repeat(40));
    
    const sortedDecades = Object.keys(decades).sort((a, b) => parseInt(a) - parseInt(b));
    sortedDecades.forEach(decade => {
      const count = decades[decade];
      const percentage = ((count / totalWithYears) * 100).toFixed(1);
      console.log(`${decade}s: ${count.toLocaleString().padStart(8)} movies (${percentage}%)`);
    });

    console.log('=' .repeat(40));

    // Top 10 years with most movies
    console.log('\n🏆 TOP 10 YEARS WITH MOST MOVIES:');
    console.log('=' .repeat(45));
    
    const topYears = yearDistribution
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    topYears.forEach(({ _id: year, count }, index) => {
      const percentage = ((count / totalWithYears) * 100).toFixed(1);
      console.log(`${(index + 1).toString().padStart(2)}. ${year}: ${count.toLocaleString().padStart(6)} movies (${percentage}%)`);
    });

    // Year range analysis
    const oldestMovie = yearDistribution[0];
    const newestMovie = yearDistribution[yearDistribution.length - 1];
    
    console.log('\n📅 YEAR RANGE ANALYSIS:');
    console.log('=' .repeat(30));
    console.log(`Oldest movie year: ${oldestMovie._id} (${oldestMovie.count} movies)`);
    console.log(`Newest movie year: ${newestMovie._id} (${newestMovie.count} movies)`);
    console.log(`Year span: ${newestMovie._id - oldestMovie._id} years`);

    // Category-wise year distribution
    console.log('\n🎭 CATEGORY-WISE YEAR DISTRIBUTION:');
    console.log('=' .repeat(50));
    
    const categoryYearStats = await Movie.aggregate([
      { $match: { year: { $exists: true, $ne: null } } },
      { 
        $group: { 
          _id: { category: '$category', year: '$year' }, 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { '_id.category': 1, '_id.year': 1 } }
    ]);

    const categoryStats = {};
    categoryYearStats.forEach(({ _id: { category, year }, count }) => {
      if (!categoryStats[category]) {
        categoryStats[category] = { total: 0, years: 0, yearRange: { min: year, max: year } };
      }
      categoryStats[category].total += count;
      categoryStats[category].years += 1;
      categoryStats[category].yearRange.min = Math.min(categoryStats[category].yearRange.min, year);
      categoryStats[category].yearRange.max = Math.max(categoryStats[category].yearRange.max, year);
    });

    Object.keys(categoryStats).sort().forEach(category => {
      const stats = categoryStats[category];
      const avgPerYear = (stats.total / stats.years).toFixed(1);
      console.log(`${category.padEnd(15)}: ${stats.total.toString().padStart(6)} movies, ${stats.years} years, avg ${avgPerYear}/year (${stats.yearRange.min}-${stats.yearRange.max})`);
    });

    console.log('\n✅ Analysis completed successfully!');
    
  } catch (error) {
    console.error('❌ Error analyzing movies:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the analysis
analyzeMoviesByYear();
