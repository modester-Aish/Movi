// Script to sync episodes from episodeIds.ts to MongoDB
// Run with: node scripts/sync-episodes.js

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function syncEpisodes() {
  console.log('🎬 Starting episode sync...\n');
  
  try {
    // First, get sync status
    console.log('📊 Checking sync status...');
    const statusResponse = await fetch(`${API_URL}/api/episodes/sync`);
    const status = await statusResponse.json();
    
    console.log(`Episode IDs in file: ${status.episodeIdsInFile}`);
    console.log(`Episodes in database: ${status.episodesInDatabase}`);
    console.log(`Series in database: ${status.seriesInDatabase}`);
    console.log(`Needs sync: ${status.needsSync ? 'Yes' : 'No'}\n`);
    
    if (!status.needsSync && status.episodesInDatabase > 0) {
      console.log('✅ Database is already up to date!');
      return;
    }
    
    // Start sync
    console.log('🔄 Starting sync process...\n');
    const syncResponse = await fetch(`${API_URL}/api/episodes/sync`, {
      method: 'POST'
    });
    
    const result = await syncResponse.json();
    
    console.log('\n📈 Sync Results:');
    console.log(`Total episodes processed: ${result.results.total}`);
    console.log(`✅ Successfully added: ${result.results.success}`);
    console.log(`❌ Failed: ${result.results.failed}`);
    
    if (result.results.errors.length > 0) {
      console.log('\n⚠️  Errors:');
      result.results.errors.forEach(error => console.log(`  - ${error}`));
    }
    
    console.log('\n✨ Sync completed!');
    
  } catch (error) {
    console.error('❌ Error syncing episodes:', error.message);
    process.exit(1);
  }
}

// Run the sync
syncEpisodes();


