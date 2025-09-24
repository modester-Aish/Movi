// Test script to check if year API is working
const fetch = require('node-fetch');

async function testYearAPI() {
  console.log('🧪 Testing Year API...\n');
  
  try {
    // Test with a year that should have movies (based on our progress data)
    const testYear = '1932'; // This year has 179 movies according to our progress
    
    console.log(`📅 Testing year: ${testYear}`);
    
    const response = await fetch(`http://localhost:3000/api/movies/year?year=${testYear}&page=1&limit=5`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log('✅ API Response:');
    console.log(`   Year: ${data.year}`);
    console.log(`   Total movies for year: ${data.totalMoviesForYear}`);
    console.log(`   Movies returned: ${data.movies.length}`);
    console.log(`   Pagination:`, data.pagination);
    
    if (data.movies.length > 0) {
      console.log('\n🎬 Sample Movies:');
      data.movies.forEach((movie, index) => {
        console.log(`   ${index + 1}. ${movie.title} (${movie.year}) - Rating: ${movie.vote_average || 'N/A'}`);
      });
    }
    
    console.log('\n🎉 Year API is working correctly!');
    
  } catch (error) {
    console.error('❌ Error testing Year API:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure your Next.js development server is running:');
      console.log('   npm run dev');
    }
  }
}

// Run the test
testYearAPI();
