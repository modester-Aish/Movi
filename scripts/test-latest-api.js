// Using built-in fetch (Node.js 18+)

async function testLatestAPI() {
  console.log('🧪 Testing Latest Movies API...\n');
  
  try {
    const categories = ['suggestions', 'latest', 'trending', 'top_rated', 'action'];
    
    for (const category of categories) {
      console.log(`📅 Testing category: ${category}`);
      
      const response = await fetch(`http://localhost:3000/api/movies/latest?category=${category}&limit=3`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      console.log(`   Movies returned: ${data.movies.length}`);
      console.log(`   Total available: ${data.totalAvailable}`);
      console.log(`   Latest year: ${data.latestYear}`);
      
      if (data.movies.length > 0) {
        console.log(`   Sample movies:`);
        data.movies.forEach((movie, index) => {
          console.log(`     ${index + 1}. ${movie.title} (${movie.year}) - Rating: ${movie.vote_average || 'N/A'}`);
        });
      }
      
      console.log('');
    }
    
    console.log('🎉 Latest API is working correctly!');
    
  } catch (error) {
    console.error('❌ Error testing Latest API:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure your Next.js development server is running:');
      console.log('   npm run dev');
    }
  }
}

// Run the test
testLatestAPI();
