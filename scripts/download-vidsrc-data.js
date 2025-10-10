const fs = require('fs');
const path = require('path');

async function downloadVidSrcData() {
  console.log('🎬 Downloading VidSrc Data...\n');

  try {
    // Download TV Series IDs
    console.log('📺 Downloading TV Series IDs...');
    const tvSeriesResponse = await fetch('https://vidsrc.me/ids/tv_imdb.txt');
    const tvSeriesData = await tvSeriesResponse.text();
    
    // Download Episode IDs
    console.log('🎬 Downloading Episode IDs...');
    const episodesResponse = await fetch('https://vidsrc.me/ids/eps_imdb.txt');
    const episodesData = await episodesResponse.text();

    // Save to files
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(path.join(dataDir, 'vidsrc-tv-series.txt'), tvSeriesData);
    fs.writeFileSync(path.join(dataDir, 'vidsrc-episodes.txt'), episodesData);

    // Parse and display stats
    const tvSeriesIds = tvSeriesData.trim().split(/\s+/);
    const episodeIds = episodesData.trim().split(/\s+/);

    console.log('✅ Downloaded successfully!');
    console.log(`📺 TV Series IDs: ${tvSeriesIds.length}`);
    console.log(`🎬 Episode IDs: ${episodeIds.length}`);
    console.log('\n📁 Files saved:');
    console.log('  - data/vidsrc-tv-series.txt');
    console.log('  - data/vidsrc-episodes.txt');

    // Show first few IDs as sample
    console.log('\n📋 Sample TV Series IDs:');
    tvSeriesIds.slice(0, 10).forEach(id => console.log(`  - ${id}`));
    
    console.log('\n📋 Sample Episode IDs:');
    episodeIds.slice(0, 10).forEach(id => console.log(`  - ${id}`));

    return {
      tvSeriesIds,
      episodeIds
    };

  } catch (error) {
    console.error('❌ Error downloading VidSrc data:', error.message);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  downloadVidSrcData()
    .then(() => {
      console.log('\n🎉 Download completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Download failed:', error.message);
      process.exit(1);
    });
}

module.exports = { downloadVidSrcData };

