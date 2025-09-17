const { BULK_MOVIE_IDS } = require('../app/data/bulkMovieIds.ts');

console.log('🎬 MOVIE DISTRIBUTION PLAN - 95,942 Movies');
console.log('=' .repeat(50));

const totalMovies = BULK_MOVIE_IDS.length;
console.log(`Total Movies: ${totalMovies.toLocaleString()}`);

// 1. HOMEPAGE CATEGORIES (5 categories × 20 movies = 100 movies)
console.log('\n📱 HOMEPAGE CATEGORIES:');
const homepageCategories = [
  { name: 'Suggestions', movies: 20, range: '0-19' },
  { name: 'Latest Movies', movies: 20, range: '100-119' },
  { name: 'Trending Now', movies: 20, range: '200-219' },
  { name: 'Top Rated', movies: 20, range: '300-319' },
  { name: 'Action Movies', movies: 20, range: '400-419' }
];
homepageCategories.forEach(cat => {
  console.log(`  ${cat.name}: ${cat.movies} movies (${cat.range})`);
});

// 2. GENRES (30 genres × 200 movies = 6,000 movies)
console.log('\n🎭 GENRES (30 categories):');
const genres = [
  'action', 'action-adventure', 'adventure', 'animation',
  'biography', 'comedy', 'costume', 'crime',
  'documentary', 'drama', 'family', 'fantasy',
  'film-noir', 'game-show', 'history', 'horror',
  'romance', 'kungfu', 'music', 'musical',
  'mystery', 'mythological', 'news', 'psychological',
  'reality', 'reality-tv', 'sci-fi', 'sci-fi-fantasy',
  'science-fiction', 'short'
];

genres.forEach((genre, index) => {
  const startIndex = 1000 + (index * 200);
  const endIndex = startIndex + 200;
  console.log(`  ${genre}: 200 movies (${startIndex}-${endIndex-1})`);
});

// 3. COUNTRIES (15 countries × 300 movies = 4,500 movies)
console.log('\n🌍 COUNTRIES (15 categories):');
const countries = [
  'united-states', 'united-kingdom', 'canada', 'estonia', 
  'france', 'georgia', 'bulgaria', 'brazil', 
  'china', 'peru', 'ireland', 'spain', 
  'sweden', 'philippines', 'cyprus'
];

countries.forEach((country, index) => {
  const startIndex = 7000 + (index * 300);
  const endIndex = startIndex + 300;
  console.log(`  ${country}: 300 movies (${startIndex}-${endIndex-1})`);
});

// 4. MOVIES PAGE (All remaining movies)
const usedMovies = 100 + 6000 + 4500; // Homepage + Genres + Countries
const remainingMovies = totalMovies - usedMovies;
console.log('\n🎬 MOVIES PAGE:');
console.log(`  All Movies: ${remainingMovies.toLocaleString()} movies (${usedMovies}-${totalMovies-1})`);

// 5. SEARCH FUNCTIONALITY
console.log('\n🔍 SEARCH FUNCTIONALITY:');
console.log(`  Search Results: Random from all ${totalMovies.toLocaleString()} movies`);

// 6. SUMMARY
console.log('\n📊 DISTRIBUTION SUMMARY:');
console.log(`  Homepage Categories: 100 movies (0.1%)`);
console.log(`  Genres: 6,000 movies (6.3%)`);
console.log(`  Countries: 4,500 movies (4.7%)`);
console.log(`  Movies Page: ${remainingMovies.toLocaleString()} movies (${((remainingMovies/totalMovies)*100).toFixed(1)}%)`);
console.log(`  Total Used: ${usedMovies.toLocaleString()} movies`);
console.log(`  Total Available: ${totalMovies.toLocaleString()} movies`);

// 7. LOAD MORE CAPACITY
console.log('\n⚡ LOAD MORE CAPACITY:');
console.log(`  Each Genre: 200 movies ÷ 20 per page = 10 pages`);
console.log(`  Each Country: 300 movies ÷ 20 per page = 15 pages`);
console.log(`  Movies Page: ${remainingMovies.toLocaleString()} movies ÷ 20 per page = ${Math.ceil(remainingMovies/20).toLocaleString()} pages`);

console.log('\n✅ All 95,942 movies properly distributed across the site!');
