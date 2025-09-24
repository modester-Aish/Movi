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

console.log(`🎬 Total movies to analyze: ${movieIds.length.toLocaleString()}`);

// Batch processing configuration
const BATCH_SIZE = 100;
const DELAY_BETWEEN_BATCHES = 2000; // 2 seconds
const MAX_RETRIES = 3;

// Results storage
let allResults = [];
let yearStats = {};
let processedCount = 0;
let foundCount = 0;
let errorCount = 0;

// Function to fetch movie data from TMDB with retry logic
async function fetchMovieData(imdbId, retryCount = 0) {
  try {
    const url = `${TMDB_BASE_URL}/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 429) {
        // Rate limited - wait and retry
        const waitTime = Math.pow(2, retryCount) * 1000; // Exponential backoff
        console.log(`⏳ Rate limited, waiting ${waitTime/1000}s...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        
        if (retryCount < MAX_RETRIES) {
          return fetchMovieData(imdbId, retryCount + 1);
        }
        return null;
      }
      
      if (response.status === 404) {
        return null; // Movie not found
      }
      
      throw new Error(`HTTP ${response.status}`);
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
        backdrop: movie.backdrop_path,
        genres: movie.genre_ids || []
      };
    }
    
    return null;
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      console.log(`⚠️ Error fetching ${imdbId}, retrying... (${retryCount + 1}/${MAX_RETRIES})`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchMovieData(imdbId, retryCount + 1);
    }
    
    console.error(`❌ Failed to fetch ${imdbId} after ${MAX_RETRIES} retries:`, error.message);
    return null;
  }
}

// Function to process a batch of movies
async function processBatch(batch, batchNumber) {
  console.log(`\n📦 Processing batch ${batchNumber} (${batch.length} movies)...`);
  
  const batchResults = [];
  
  for (const imdbId of batch) {
    processedCount++;
    
    if (processedCount % 10 === 0) {
      const progress = ((processedCount / movieIds.length) * 100).toFixed(1);
      console.log(`   📈 Progress: ${processedCount.toLocaleString()}/${movieIds.length.toLocaleString()} (${progress}%) - Found: ${foundCount}`);
    }
    
    const movieData = await fetchMovieData(imdbId);
    
    if (movieData) {
      foundCount++;
      batchResults.push(movieData);
      allResults.push(movieData);
      
      // Update year statistics
      if (movieData.year) {
        yearStats[movieData.year] = (yearStats[movieData.year] || 0) + 1;
      }
    } else {
      errorCount++;
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  
  console.log(`   ✅ Batch ${batchNumber} completed: ${batchResults.length} movies found`);
  
  // Save progress after each batch
  saveProgress(batchNumber);
  
  return batchResults;
}

// Function to save progress
function saveProgress(batchNumber) {
  const progressData = {
    batchNumber,
    processedCount,
    foundCount,
    errorCount,
    yearStats,
    lastUpdate: new Date().toISOString(),
    progress: ((processedCount / movieIds.length) * 100).toFixed(2)
  };
  
  const progressPath = path.join(__dirname, 'movie-analysis-progress.json');
  fs.writeFileSync(progressPath, JSON.stringify(progressData, null, 2));
  
  // Save detailed results every 10 batches
  if (batchNumber % 10 === 0) {
    const resultsPath = path.join(__dirname, `movie-analysis-batch-${batchNumber}.json`);
    fs.writeFileSync(resultsPath, JSON.stringify(allResults, null, 2));
    console.log(`   💾 Results saved to: ${resultsPath}`);
  }
}

// Function to generate final report
function generateFinalReport() {
  console.log('\n🎉 ANALYSIS COMPLETED!');
  console.log('=' .repeat(60));
  
  // Basic statistics
  console.log(`📊 FINAL STATISTICS:`);
  console.log(`   Total movies processed: ${processedCount.toLocaleString()}`);
  console.log(`   Movies found in TMDB: ${foundCount.toLocaleString()}`);
  console.log(`   Movies not found: ${errorCount.toLocaleString()}`);
  console.log(`   Success rate: ${((foundCount / processedCount) * 100).toFixed(1)}%\n`);
  
  // Year distribution
  const moviesWithYear = allResults.filter(m => m.year).length;
  console.log(`📅 YEAR DISTRIBUTION:`);
  console.log(`   Movies with year data: ${moviesWithYear.toLocaleString()}`);
  console.log(`   Movies without year: ${(foundCount - moviesWithYear).toLocaleString()}\n`);
  
  // Year-wise breakdown
  const sortedYears = Object.keys(yearStats)
    .map(year => parseInt(year))
    .sort((a, b) => a - b);
  
  if (sortedYears.length > 0) {
    console.log('📈 YEAR-WISE BREAKDOWN:');
    console.log('=' .repeat(50));
    
    let totalWithYears = 0;
    const decades = {};
    
    sortedYears.forEach(year => {
      const count = yearStats[year];
      totalWithYears += count;
      const decade = Math.floor(year / 10) * 10;
      decades[decade] = (decades[decade] || 0) + count;
      
      console.log(`${year}: ${count.toLocaleString().padStart(8)} movies`);
    });
    
    console.log('=' .repeat(50));
    console.log(`Total: ${totalWithYears.toLocaleString()} movies\n`);
    
    // Decade summary
    console.log('🗓️ DECADE SUMMARY:');
    console.log('=' .repeat(40));
    
    const sortedDecades = Object.keys(decades).sort((a, b) => parseInt(a) - parseInt(b));
    sortedDecades.forEach(decade => {
      const count = decades[decade];
      const percentage = ((count / totalWithYears) * 100).toFixed(1);
      console.log(`${decade}s: ${count.toLocaleString().padStart(8)} movies (${percentage}%)`);
    });
    
    console.log('=' .repeat(40));
    
    // Top 20 years
    console.log('\n🏆 TOP 20 YEARS WITH MOST MOVIES:');
    console.log('=' .repeat(50));
    
    const topYears = Object.entries(yearStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);
    
    topYears.forEach(([year, count], index) => {
      const percentage = ((count / totalWithYears) * 100).toFixed(1);
      console.log(`${(index + 1).toString().padStart(2)}. ${year}: ${count.toLocaleString().padStart(6)} movies (${percentage}%)`);
    });
    
    // Year range
    console.log('\n📅 YEAR RANGE:');
    console.log('=' .repeat(25));
    console.log(`Oldest movie year: ${sortedYears[0]} (${yearStats[sortedYears[0]].toLocaleString()} movies)`);
    console.log(`Newest movie year: ${sortedYears[sortedYears.length - 1]} (${yearStats[sortedYears[sortedYears.length - 1]].toLocaleString()} movies)`);
    console.log(`Total year span: ${sortedYears[sortedYears.length - 1] - sortedYears[0]} years`);
    console.log(`Average movies per year: ${(totalWithYears / sortedYears.length).toFixed(0)}`);
  }
  
  // Save final results
  const finalResults = {
    summary: {
      totalProcessed: processedCount,
      totalFound: foundCount,
      totalErrors: errorCount,
      successRate: ((foundCount / processedCount) * 100).toFixed(1),
      moviesWithYear: moviesWithYear,
      moviesWithoutYear: foundCount - moviesWithYear,
      analysisDate: new Date().toISOString()
    },
    yearDistribution: yearStats,
    decadeDistribution: Object.keys(decades).reduce((acc, decade) => {
      acc[decade] = decades[decade];
      return acc;
    }, {}),
    topYears: topYears.slice(0, 50),
    allMovies: allResults
  };
  
  const finalPath = path.join(__dirname, 'complete-movie-year-analysis.json');
  fs.writeFileSync(finalPath, JSON.stringify(finalResults, null, 2));
  
  console.log(`\n💾 Complete analysis saved to: ${finalPath}`);
  console.log(`📊 Analysis covers ${foundCount.toLocaleString()} movies from ${sortedYears.length} different years!`);
}

// Main function to analyze all movies
async function analyzeAllMovies() {
  console.log('🚀 Starting comprehensive analysis of ALL movies...');
  console.log(`📊 Processing ${movieIds.length.toLocaleString()} movies in batches of ${BATCH_SIZE}`);
  console.log(`⏱️ Estimated time: ${Math.ceil(movieIds.length / BATCH_SIZE * DELAY_BETWEEN_BATCHES / 60)} minutes\n`);
  
  const batches = [];
  for (let i = 0; i < movieIds.length; i += BATCH_SIZE) {
    batches.push(movieIds.slice(i, i + BATCH_SIZE));
  }
  
  console.log(`📦 Total batches to process: ${batches.length}\n`);
  
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    const batchNumber = i + 1;
    
    await processBatch(batch, batchNumber);
    
    // Delay between batches (except for the last one)
    if (i < batches.length - 1) {
      console.log(`⏳ Waiting ${DELAY_BETWEEN_BATCHES/1000}s before next batch...`);
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
    }
  }
  
  // Generate final report
  generateFinalReport();
}

// Check if we have existing progress
const progressPath = path.join(__dirname, 'movie-analysis-progress.json');
if (fs.existsSync(progressPath)) {
  console.log('📁 Found existing progress file. Starting from where we left off...\n');
}

// Run the analysis
analyzeAllMovies().catch(error => {
  console.error('❌ Analysis failed:', error);
  process.exit(1);
});
