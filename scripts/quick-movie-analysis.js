const fs = require('fs');
const path = require('path');

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

console.log('🎬 BULK MOVIE ANALYSIS REPORT');
console.log('=' .repeat(50));

console.log(`📊 Total Movies in Database: ${movieIds.length.toLocaleString()}`);

// Analyze IMDB ID patterns to estimate year distribution
console.log('\n🔍 IMDB ID PATTERN ANALYSIS:');
console.log('=' .repeat(40));

// IMDB IDs follow a pattern where earlier IDs generally correspond to older movies
// tt0000001 = very old movie (1900s)
// tt1000000 = around 1990s-2000s
// tt2000000 = 2000s-2010s
// tt3000000+ = 2010s+

const idRanges = {
  'tt0000001-tt0999999': { label: 'Very Old (1900s-1980s)', count: 0 },
  'tt1000000-tt1999999': { label: 'Classic Era (1980s-1990s)', count: 0 },
  'tt2000000-tt2999999': { label: 'Modern Era (1990s-2000s)', count: 0 },
  'tt3000000-tt3999999': { label: 'Recent (2000s-2010s)', count: 0 },
  'tt4000000-tt4999999': { label: 'Contemporary (2010s-2020s)', count: 0 },
  'tt5000000+': { label: 'Latest (2020s+)', count: 0 }
};

movieIds.forEach(id => {
  const idNum = parseInt(id.replace('tt', ''));
  
  if (idNum < 1000000) {
    idRanges['tt0000001-tt0999999'].count++;
  } else if (idNum < 2000000) {
    idRanges['tt1000000-tt1999999'].count++;
  } else if (idNum < 3000000) {
    idRanges['tt2000000-tt2999999'].count++;
  } else if (idNum < 4000000) {
    idRanges['tt3000000-tt3999999'].count++;
  } else if (idNum < 5000000) {
    idRanges['tt4000000-tt4999999'].count++;
  } else {
    idRanges['tt5000000+'].count++;
  }
});

Object.entries(idRanges).forEach(([range, data]) => {
  const percentage = ((data.count / movieIds.length) * 100).toFixed(1);
  console.log(`${range.padEnd(20)}: ${data.count.toLocaleString().padStart(8)} movies (${percentage}%)`);
});

// Sample analysis of actual years (first 100 movies)
console.log('\n📅 SAMPLE YEAR ANALYSIS (First 100 movies):');
console.log('=' .repeat(50));

// Function to estimate year from IMDB ID
function estimateYearFromId(imdbId) {
  const idNum = parseInt(imdbId.replace('tt', ''));
  
  // Rough estimation based on IMDB ID patterns
  if (idNum < 1000) return 1900 + Math.floor(idNum / 10);
  if (idNum < 10000) return 1910 + Math.floor(idNum / 100);
  if (idNum < 100000) return 1920 + Math.floor(idNum / 1000);
  if (idNum < 500000) return 1930 + Math.floor(idNum / 10000);
  if (idNum < 1000000) return 1940 + Math.floor(idNum / 20000);
  if (idNum < 2000000) return 1950 + Math.floor(idNum / 40000);
  if (idNum < 3000000) return 1970 + Math.floor(idNum / 100000);
  if (idNum < 4000000) return 1990 + Math.floor(idNum / 200000);
  if (idNum < 5000000) return 2000 + Math.floor(idNum / 300000);
  return 2010 + Math.floor(idNum / 500000);
}

const sampleIds = movieIds.slice(0, 100);
const estimatedYears = sampleIds.map(id => estimateYearFromId(id));

const yearStats = {};
estimatedYears.forEach(year => {
  yearStats[year] = (yearStats[year] || 0) + 1;
});

console.log('Estimated years for sample:');
Object.keys(yearStats)
  .sort((a, b) => parseInt(a) - parseInt(b))
  .forEach(year => {
    console.log(`${year}: ${yearStats[year]} movies`);
  });

// Decade estimation for full dataset
console.log('\n🗓️ ESTIMATED DECADE DISTRIBUTION:');
console.log('=' .repeat(40));

const decadeStats = {};
movieIds.forEach(id => {
  const estimatedYear = estimateYearFromId(id);
  const decade = Math.floor(estimatedYear / 10) * 10;
  decadeStats[decade] = (decadeStats[decade] || 0) + 1;
});

Object.keys(decadeStats)
  .sort((a, b) => parseInt(a) - parseInt(b))
  .forEach(decade => {
    const count = decadeStats[decade];
    const percentage = ((count / movieIds.length) * 100).toFixed(1);
    console.log(`${decade}s: ${count.toLocaleString().padStart(8)} movies (${percentage}%)`);
  });

// Summary statistics
console.log('\n📊 SUMMARY STATISTICS:');
console.log('=' .repeat(30));
console.log(`Total Movies: ${movieIds.length.toLocaleString()}`);
console.log(`Estimated Year Range: ${Math.min(...estimatedYears)} - ${Math.max(...estimatedYears)}`);
console.log(`Estimated Decades Covered: ${Object.keys(decadeStats).length}`);
console.log(`Average Movies per Decade: ${Math.round(movieIds.length / Object.keys(decadeStats).length).toLocaleString()}`);

// Most represented decades
console.log('\n🏆 TOP 5 DECADES:');
console.log('=' .repeat(25));

const topDecades = Object.entries(decadeStats)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5);

topDecades.forEach(([decade, count], index) => {
  const percentage = ((count / movieIds.length) * 100).toFixed(1);
  console.log(`${index + 1}. ${decade}s: ${count.toLocaleString().padStart(6)} movies (${percentage}%)`);
});

// Save results
const results = {
  totalMovies: movieIds.length,
  idRangeDistribution: idRanges,
  estimatedDecadeDistribution: decadeStats,
  topDecades: topDecades,
  sampleAnalysis: {
    sampleSize: 100,
    yearDistribution: yearStats,
    estimatedYearRange: [Math.min(...estimatedYears), Math.max(...estimatedYears)]
  },
  analysisDate: new Date().toISOString(),
  note: "This is an estimation based on IMDB ID patterns. For accurate year data, run the full TMDB analysis script."
};

const outputPath = path.join(__dirname, 'quick-movie-analysis.json');
fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

console.log(`\n💾 Results saved to: ${outputPath}`);
console.log('\n✅ Quick analysis completed!');
console.log('\n📝 NOTE: This is an estimation based on IMDB ID patterns.');
console.log('   For accurate year data, run: node scripts/analyze-all-movies-by-year.js');
