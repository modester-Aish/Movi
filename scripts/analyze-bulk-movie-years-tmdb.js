const fs = require('fs');
const path = require('path');

// TMDB API configuration
const TMDB_API_KEY = 'b31d2e5f33b74ffa7b3b483ff353f760';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Import bulk movie IDs
const bulkMovieIdsPath = path.join(__dirname, '../app/data/bulkMovieIds.ts');
const bulkMovieIdsContent = fs.readFileSync(bulkMovieIdsPath, 'utf8');

// Extract movie IDs from the file
const movieIdsMatch = bulkMovieIdsContent.match(/export const BULK_MOVIE_IDS = \[([\s\S]*?)\];/);
if (!movieIdsMatch) {
  console.error('❌ Could not extract movie IDs from bulkMovieIds.ts');
  process.exit(1);
}

const movieIdsString = movieIdsMatch[1];
const movieIds = movieIdsString
  .split(',')
  .map(id => id.trim().replace(/'/g, ''))
  .filter(id => id && id.startsWith('tt'));

console.log(`🎬 Found ${movieIds.length.toLocaleString()} movie IDs in bulk file`);

// Function to fetch movie data from TMDB
async function fetchMovieData(imdbId) {
  try {
    const url = `${TMDB_BASE_URL}/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 429) {
        console.log('⏳ Rate limited, waiting 1 second...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        return fetchMovieData(imdbId);
      }
      return null;
    }
    
    const data = await response.json();
    
    if (data.movie_results && data.movie_results.length > 0) {
      const movie = data.movie_results[0];
      return {
        imdbId,
        title: movie.title,
        year: movie.release_date ? parseInt(movie.release_date.split('-')[0]) : null,
        overview: movie.overview,
        rating: movie.vote_average,
        poster: movie.poster_path,
        backdrop: movie.backdrop_path
      };
    }
    
    return null;
  } catch (error) {
    console.error(`❌ Error fetching ${imdbId}:`, error.message);
    return null;
  }
}

// Function to analyze year distribution
function analyzeYearDistribution(movies) {
  const yearStats = {};
  let totalMovies = 0;
  let moviesWithoutYear = 0;
  
  movies.forEach(movie => {
    if (movie && movie.year) {
      totalMovies++;
      yearStats[movie.year] = (yearStats[movie.year] || 0) + 1;
    } else {
      moviesWithoutYear++;
    }
  });
  
  return { yearStats, totalMovies, moviesWithoutYear };
}

// Main analysis function
async function analyzeBulkMovieYears() {
  console.log('🚀 Starting year analysis of bulk movies...\n');
  
  const sampleSize = 1000; // Analyze first 1000 movies for demo
  const sampleIds = movieIds.slice(0, sampleSize);
  
  console.log(`📊 Analyzing sample of ${sampleSize} movies...`);
  console.log('⏳ This may take a few minutes due to API rate limits...\n');
  
  const movies = [];
  const yearStats = {};
  let processed = 0;
  let found = 0;
  
  for (const imdbId of sampleIds) {
    processed++;
    
    if (processed % 50 === 0) {
      console.log(`📈 Progress: ${processed}/${sampleSize} (${found} found)`);
    }
    
    const movieData = await fetchMovieData(imdbId);
    
    if (movieData) {
      found++;
      movies.push(movieData);
      
      if (movieData.year) {
        yearStats[movieData.year] = (yearStats[movieData.year] || 0) + 1;
      }
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n✅ Analysis completed!');
  console.log('=' .repeat(50));
  
  // Display results
  console.log(`📊 Sample Analysis Results:`);
  console.log(`   Total processed: ${processed}`);
  console.log(`   Movies found: ${found}`);
  console.log(`   Movies with year data: ${Object.keys(yearStats).length}`);
  console.log(`   Movies without year: ${found - Object.keys(yearStats).length}\n`);
  
  // Year distribution
  console.log('📅 YEAR DISTRIBUTION (Sample):');
  console.log('=' .repeat(40));
  
  const sortedYears = Object.keys(yearStats)
    .map(year => parseInt(year))
    .sort((a, b) => a - b);
  
  let totalWithYears = 0;
  const decades = {};
  
  sortedYears.forEach(year => {
    const count = yearStats[year];
    totalWithYears += count;
    const decade = Math.floor(year / 10) * 10;
    decades[decade] = (decades[decade] || 0) + count;
    
    console.log(`${year}: ${count.toString().padStart(3)} movies`);
  });
  
  console.log('=' .repeat(40));
  console.log(`Total with years: ${totalWithYears}\n`);
  
  // Decade summary
  console.log('🗓️ DECADE SUMMARY:');
  console.log('=' .repeat(30));
  
  const sortedDecades = Object.keys(decades).sort((a, b) => parseInt(a) - parseInt(b));
  sortedDecades.forEach(decade => {
    const count = decades[decade];
    const percentage = ((count / totalWithYears) * 100).toFixed(1);
    console.log(`${decade}s: ${count.toString().padStart(3)} movies (${percentage}%)`);
  });
  
  // Top years
  console.log('\n🏆 TOP 10 YEARS:');
  console.log('=' .repeat(25));
  
  const topYears = Object.entries(yearStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  topYears.forEach(([year, count], index) => {
    const percentage = ((count / totalWithYears) * 100).toFixed(1);
    console.log(`${(index + 1).toString().padStart(2)}. ${year}: ${count.toString().padStart(2)} movies (${percentage}%)`);
  });
  
  // Year range
  if (sortedYears.length > 0) {
    console.log('\n📅 YEAR RANGE:');
    console.log('=' .repeat(20));
    console.log(`Oldest: ${sortedYears[0]}`);
    console.log(`Newest: ${sortedYears[sortedYears.length - 1]}`);
    console.log(`Span: ${sortedYears[sortedYears.length - 1] - sortedYears[0]} years`);
  }
  
  // Extrapolation for full dataset
  console.log('\n🔮 ESTIMATED FULL DATASET (95,942 movies):');
  console.log('=' .repeat(50));
  
  const avgMoviesPerYear = totalWithYears / sortedYears.length;
  const estimatedTotalWithYears = Math.round((found / processed) * movieIds.length * (totalWithYears / found));
  
  console.log(`Estimated movies with year data: ${estimatedTotalWithYears.toLocaleString()}`);
  console.log(`Estimated movies without year: ${(movieIds.length - estimatedTotalWithYears).toLocaleString()}`);
  console.log(`Estimated average per year: ${(avgMoviesPerYear * (movieIds.length / sampleSize)).toFixed(0)} movies`);
  
  // Save detailed results
  const results = {
    sampleSize,
    totalProcessed: processed,
    moviesFound: found,
    moviesWithYear: totalWithYears,
    yearDistribution: yearStats,
    decadeDistribution: decades,
    topYears: topYears.slice(0, 20),
    analysisDate: new Date().toISOString()
  };
  
  const outputPath = path.join(__dirname, 'bulk-movie-year-analysis.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  
  console.log(`\n💾 Detailed results saved to: ${outputPath}`);
  console.log('\n🎉 Analysis complete!');
}

// Run the analysis
analyzeBulkMovieYears().catch(console.error);
