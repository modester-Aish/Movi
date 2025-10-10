const { TV_SERIES_STATIC } = require('../app/data/tvSeriesStatic.ts');

// Get series with complete data
const seriesWithData = Object.entries(TV_SERIES_STATIC)
  .filter(([_, data]) => data.name && data.poster_path)
  .sort((a, b) => {
    // Sort by first_air_date (newest first)
    const dateA = new Date(a[1].first_air_date || '1900-01-01');
    const dateB = new Date(b[1].first_air_date || '1900-01-01');
    return dateB - dateA;
  });

console.log('Total series with complete data:', seriesWithData.length);
console.log('\nFirst 20 series (newest first):');
seriesWithData.slice(0, 20).forEach(([id, data], i) => {
  console.log(`${i+1}. ${data.name} (${id}) - ${data.first_air_date || 'No date'}`);
});

console.log('\nLast 20 series (oldest):');
seriesWithData.slice(-20).forEach(([id, data], i) => {
  console.log(`${seriesWithData.length - 19 + i}. ${data.name} (${id}) - ${data.first_air_date || 'No date'}`);
});
