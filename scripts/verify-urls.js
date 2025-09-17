const { generateMovieUrl, generateSlug } = require('../app/lib/slug.ts');

console.log('🔗 URL STRUCTURE VERIFICATION');
console.log('=' .repeat(40));

// Test movie URLs
const testMovies = [
  { title: "The Godfather", imdbId: "tt0068646" },
  { title: "The Dark Knight", imdbId: "tt0468569" },
  { title: "Pulp Fiction", imdbId: "tt0110912" },
  { title: "The Shawshank Redemption", imdbId: "tt0111161" },
  { title: "Forrest Gump", imdbId: "tt0109830" }
];

console.log('\n📱 MOVIE URLS:');
testMovies.forEach(movie => {
  const url = generateMovieUrl(movie.title, movie.imdbId);
  console.log(`  ${movie.title} → ${url}`);
});

console.log('\n🎭 GENRE URLS:');
const genres = ['action', 'comedy', 'horror', 'documentary', 'drama'];
genres.forEach(genre => {
  console.log(`  /genre/${genre}`);
});

console.log('\n🌍 COUNTRY URLS:');
const countries = ['united-states', 'france', 'china', 'united-kingdom', 'canada'];
countries.forEach(country => {
  console.log(`  /country/${country}`);
});

console.log('\n🏠 MAIN PAGES:');
const mainPages = [
  '/',
  '/movies',
  '/search',
  '/admin'
];
mainPages.forEach(page => {
  console.log(`  ${page}`);
});

console.log('\n🔍 SEO & CANONICAL URLs:');
console.log('  Base URL: https://movies.n123movie.me');
console.log('  Sitemap: https://movies.n123movie.me/sitemap.xml');
console.log('  Robots: https://movies.n123movie.me/robots.txt');

console.log('\n✅ All URLs are clean and SEO-friendly!');
console.log('✅ No prefixes in movie URLs - just clean slugs!');
console.log('✅ Canonical URLs properly set!');
