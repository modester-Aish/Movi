// Check database status and show summary
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function checkDatabaseStatus() {
  console.log('📊 TV Series Database Status Check\n');
  
  try {
    // Get series count
    const seriesResponse = await fetch(`${API_URL}/api/series`);
    const seriesData = await seriesResponse.json();
    
    console.log(`📺 TV Series: ${seriesData.series.length}`);
    
    // Get episodes count
    const episodesResponse = await fetch(`${API_URL}/api/episodes`);
    const episodesData = await episodesResponse.json();
    
    console.log(`🎬 Episodes: ${episodesData.episodes.length}`);
    
    // Show series breakdown
    console.log('\n📋 Series Breakdown:');
    for (const series of seriesData.series) {
      const seriesEpisodes = await fetch(`${API_URL}/api/episodes?series_id=${series.tmdb_id}`);
      const episodes = await seriesEpisodes.json();
      
      console.log(`   ${series.name}: ${episodes.episodes.length} episodes`);
    }
    
    // Show sample episodes
    console.log('\n🎯 Sample Episodes:');
    episodesData.episodes.slice(0, 10).forEach(ep => {
      console.log(`   ${ep.series_name} S${ep.season_number}E${ep.episode_number} - ${ep.episode_name}`);
    });
    
    if (episodesData.episodes.length > 10) {
      console.log(`   ... and ${episodesData.episodes.length - 10} more episodes`);
    }
    
    console.log('\n✅ Database Status: READY FOR BROWSING!');
    console.log(`🌐 Visit: http://localhost:3000/series`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkDatabaseStatus();

