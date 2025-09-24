// Test script to check if sections API is working with unique movies

async function testSectionsAPI() {
  console.log('🧪 Testing Sections API (Unique Movies)...\n');
  
  try {
    const response = await fetch('http://localhost:3000/api/movies/sections?limit=5');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log('✅ Sections API Response:');
    console.log(`   Total movies available: ${data.totalAvailable}`);
    console.log(`   Latest year: ${data.latestYear}`);
    console.log(`   Unique movies used: ${data.uniqueMoviesUsed}\n`);
    
    const sections = ['suggestions', 'trending', 'top_rated', 'top_imdb', 'action'];
    const allMovieIds = new Set();
    
    sections.forEach(section => {
      if (data.sections[section]) {
        const movies = data.sections[section];
        console.log(`📽️ ${section.toUpperCase()}:`);
        console.log(`   Movies: ${movies.length}`);
        
        movies.forEach((movie, index) => {
          console.log(`     ${index + 1}. ${movie.title} (${movie.year}) - Rating: ${movie.vote_average || 'N/A'}`);
          allMovieIds.add(movie.imdb_id);
        });
        
        console.log('');
      }
    });
    
    console.log(`🎯 UNIQUENESS CHECK:`);
    console.log(`   Total unique movies: ${allMovieIds.size}`);
    console.log(`   Expected (5 sections × 5 movies): 25`);
    console.log(`   All movies unique: ${allMovieIds.size === 25 ? '✅ YES' : '❌ NO'}`);
    
    if (allMovieIds.size === 25) {
      console.log('\n🎉 Perfect! All sections have unique movies!');
    } else {
      console.log('\n⚠️ Some movies are repeated across sections.');
    }
    
  } catch (error) {
    console.error('❌ Error testing Sections API:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure your Next.js development server is running:');
      console.log('   npm run dev');
    }
  }
}

// Run the test
testSectionsAPI();
