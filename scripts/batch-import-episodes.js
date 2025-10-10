// Batch import script for episodes
// This will import episodes in batches to avoid overwhelming the system
// Run with: node scripts/batch-import-episodes.js [batchSize] [startIndex]

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const BATCH_SIZE = parseInt(process.argv[2]) || 50; // Default 50 episodes per batch
const START_INDEX = parseInt(process.argv[3]) || 0; // Default start from beginning
const DELAY_BETWEEN_BATCHES = 5000; // 5 seconds delay between batches

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getEpisodeIds() {
  try {
    // Read from episodeIds.ts file
    const fs = require('fs');
    const path = require('path');
    
    const filePath = path.join(__dirname, '..', 'app', 'data', 'episodeIds.ts');
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract IDs from the file (looking for 'tt' followed by numbers)
    const matches = content.match(/tt\d{7,8}/g) || [];
    const uniqueIds = [...new Set(matches)]; // Remove duplicates
    
    console.log(`📋 Found ${uniqueIds.length} unique episode IDs in episodeIds.ts`);
    return uniqueIds;
    
  } catch (error) {
    console.error('❌ Error reading episode IDs:', error.message);
    return [];
  }
}

async function syncBatch(batchIds, batchNumber, totalBatches) {
  console.log(`\n🔄 Processing Batch ${batchNumber}/${totalBatches}`);
  console.log(`   Episodes: ${batchIds.length}`);
  console.log(`   IDs: ${batchIds[0]} ... ${batchIds[batchIds.length - 1]}`);
  
  const results = {
    success: 0,
    failed: 0,
    skipped: 0,
    errors: []
  };
  
  for (let i = 0; i < batchIds.length; i++) {
    const imdbId = batchIds[i];
    
    try {
      // Check if episode already exists
      const checkResponse = await fetch(`${API_URL}/api/episodes?episode_id=${imdbId}`);
      const checkData = await checkResponse.json();
      
      if (checkData.episodes && checkData.episodes.length > 0) {
        console.log(`   ⏭️  [${i + 1}/${batchIds.length}] ${imdbId} - Already exists, skipping`);
        results.skipped++;
        continue;
      }
      
      // Fetch episode data from TMDB via our API
      const syncUrl = `${API_URL}/api/episodes/sync-single?imdb_id=${imdbId}`;
      const syncResponse = await fetch(syncUrl, { method: 'POST' });
      
      if (syncResponse.ok) {
        const data = await syncResponse.json();
        console.log(`   ✅ [${i + 1}/${batchIds.length}] ${imdbId} - ${data.series_name} S${data.season}E${data.episode}`);
        results.success++;
      } else {
        const error = await syncResponse.text();
        console.log(`   ❌ [${i + 1}/${batchIds.length}] ${imdbId} - Failed: ${error}`);
        results.failed++;
        results.errors.push(`${imdbId}: ${error}`);
      }
      
      // Small delay between individual requests
      await sleep(200);
      
    } catch (error) {
      console.log(`   ❌ [${i + 1}/${batchIds.length}] ${imdbId} - Error: ${error.message}`);
      results.failed++;
      results.errors.push(`${imdbId}: ${error.message}`);
    }
  }
  
  return results;
}

async function main() {
  console.log('🎬 Batch Episode Import\n');
  console.log(`Configuration:`);
  console.log(`  - Batch Size: ${BATCH_SIZE} episodes`);
  console.log(`  - Start Index: ${START_INDEX}`);
  console.log(`  - Delay: ${DELAY_BETWEEN_BATCHES}ms between batches`);
  console.log(`  - API URL: ${API_URL}\n`);
  
  // Get all episode IDs
  const allIds = await getEpisodeIds();
  
  if (allIds.length === 0) {
    console.log('❌ No episode IDs found. Please add IDs to app/data/episodeIds.ts');
    process.exit(1);
  }
  
  // Slice from start index
  const idsToProcess = allIds.slice(START_INDEX);
  console.log(`📊 Processing ${idsToProcess.length} episodes (from index ${START_INDEX})\n`);
  
  // Calculate number of batches
  const totalBatches = Math.ceil(idsToProcess.length / BATCH_SIZE);
  
  const overallResults = {
    totalProcessed: 0,
    totalSuccess: 0,
    totalFailed: 0,
    totalSkipped: 0,
    allErrors: []
  };
  
  // Process in batches
  for (let i = 0; i < totalBatches; i++) {
    const startIdx = i * BATCH_SIZE;
    const endIdx = Math.min(startIdx + BATCH_SIZE, idsToProcess.length);
    const batch = idsToProcess.slice(startIdx, endIdx);
    
    const batchResults = await syncBatch(batch, i + 1, totalBatches);
    
    overallResults.totalProcessed += batch.length;
    overallResults.totalSuccess += batchResults.success;
    overallResults.totalFailed += batchResults.failed;
    overallResults.totalSkipped += batchResults.skipped;
    overallResults.allErrors.push(...batchResults.errors);
    
    console.log(`\n   Batch ${i + 1} Summary:`);
    console.log(`   ✅ Success: ${batchResults.success}`);
    console.log(`   ⏭️  Skipped: ${batchResults.skipped}`);
    console.log(`   ❌ Failed: ${batchResults.failed}`);
    
    // Delay between batches (except for last batch)
    if (i < totalBatches - 1) {
      console.log(`\n   ⏳ Waiting ${DELAY_BETWEEN_BATCHES}ms before next batch...`);
      await sleep(DELAY_BETWEEN_BATCHES);
    }
  }
  
  // Final summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 FINAL SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Episodes Processed: ${overallResults.totalProcessed}`);
  console.log(`✅ Successfully Added: ${overallResults.totalSuccess}`);
  console.log(`⏭️  Skipped (Already Exists): ${overallResults.totalSkipped}`);
  console.log(`❌ Failed: ${overallResults.totalFailed}`);
  console.log(`Success Rate: ${((overallResults.totalSuccess / overallResults.totalProcessed) * 100).toFixed(1)}%`);
  
  if (overallResults.allErrors.length > 0) {
    console.log(`\n⚠️  Errors (showing first 20):`);
    overallResults.allErrors.slice(0, 20).forEach((error, idx) => {
      console.log(`  ${idx + 1}. ${error}`);
    });
    if (overallResults.allErrors.length > 20) {
      console.log(`  ... and ${overallResults.allErrors.length - 20} more errors`);
    }
  }
  
  console.log('\n✨ Batch import completed!');
  
  // Suggest next step if not all processed
  if (START_INDEX + idsToProcess.length < allIds.length) {
    const nextIndex = START_INDEX + idsToProcess.length;
    console.log(`\n💡 To continue from where you left off:`);
    console.log(`   node scripts/batch-import-episodes.js ${BATCH_SIZE} ${nextIndex}`);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});


