const { BULK_MOVIE_IDS } = require('../app/data/bulkMovieIds.ts');

console.log('Total movies:', BULK_MOVIE_IDS.length);
console.log('\nCountry distribution:');

const countries = [
  'united-states', 'united-kingdom', 'canada', 'estonia', 
  'france', 'georgia', 'bulgaria', 'brazil', 
  'china', 'peru', 'ireland', 'spain', 
  'sweden', 'philippines', 'cyprus'
];

countries.forEach((country, index) => {
  const startIndex = index * 300;
  const endIndex = startIndex + 20;
  const movieIds = BULK_MOVIE_IDS.slice(startIndex, endIndex);
  console.log(`${country}: ${movieIds.length} movies (range: ${startIndex}-${endIndex-1})`);
});

console.log('\nGenre distribution:');
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
  const startIndex = index * 200;
  const endIndex = startIndex + 20;
  const movieIds = BULK_MOVIE_IDS.slice(startIndex, endIndex);
  console.log(`${genre}: ${movieIds.length} movies (range: ${startIndex}-${endIndex-1})`);
});
