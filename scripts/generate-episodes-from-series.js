// Generate episode IDs from TV series
// This will fetch episodes from series we already have in database

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function getEpisodesFromSeries() {
  console.log('🎬 Generating Episodes from TV Series\n');
  
  try {
    // Get all series from our database
    const seriesResponse = await fetch(`${API_URL}/api/series`);
    const seriesData = await seriesResponse.json();
    
    console.log(`📊 Found ${seriesData.series.length} series in database`);
    
    const allEpisodeIds = [];
    
    for (const series of seriesData.series) {
      console.log(`\n🔍 Processing: ${series.name} (TMDB: ${series.tmdb_id})`);
      
      try {
        // Get episodes for this series
        const episodesResponse = await fetch(`${API_URL}/api/episodes?series_id=${series.tmdb_id}`);
        const episodesData = await episodesResponse.json();
        
        console.log(`   📺 Found ${episodesData.episodes.length} episodes`);
        
        // Add episode IDs to our list
        episodesData.episodes.forEach(episode => {
          if (episode.episode_imdb_id) {
            allEpisodeIds.push({
              imdb_id: episode.episode_imdb_id,
              series: series.name,
              season: episode.season_number,
              episode: episode.episode_number,
              title: episode.episode_name
            });
          }
        });
        
      } catch (error) {
        console.log(`   ❌ Error fetching episodes for ${series.name}: ${error.message}`);
      }
    }
    
    console.log(`\n📋 Total Episode IDs collected: ${allEpisodeIds.length}`);
    
    // Generate episodeIds.ts content
    const content = `// Episode IDs from existing series in database
// Generated: ${new Date().toISOString()}
// Total: ${allEpisodeIds.length} episodes

export const EPISODE_IDS = [
${allEpisodeIds.map(ep => `  '${ep.imdb_id}',  // ${ep.series} S${ep.season}E${ep.episode} - ${ep.title}`).join('\n')}
];

// Function to get all episode IDs
export function getAllEpisodeIds(): string[] {
  return EPISODE_IDS;
}

// Function to get paginated IDs
export function getEpisodeIdsPaginated(page: number = 1, limit: number = 100): string[] {
  const start = (page - 1) * limit;
  const end = start + limit;
  return EPISODE_IDS.slice(start, end);
}

// Get total count
export function getEpisodeCount(): number {
  return EPISODE_IDS.length;
}
`;

    // Save to file
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, '..', 'app', 'data', 'episodeIds.ts');
    fs.writeFileSync(filePath, content, 'utf8');
    
    console.log(`\n✅ Saved ${allEpisodeIds.length} episode IDs to app/data/episodeIds.ts`);
    
    // Show sample
    console.log('\n📝 Sample episodes:');
    allEpisodeIds.slice(0, 5).forEach(ep => {
      console.log(`   ${ep.imdb_id} - ${ep.series} S${ep.season}E${ep.episode} - ${ep.title}`);
    });
    
    if (allEpisodeIds.length > 5) {
      console.log(`   ... and ${allEpisodeIds.length - 5} more`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

getEpisodesFromSeries();

