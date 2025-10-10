const https = require('https');
const fs = require('fs');
const path = require('path');

const EPISODE_IDS_URL = 'https://vidsrc.me/ids/eps_imdb.txt';
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'vidsrc-episodes.txt');

console.log('📥 Downloading episode IDs from VidSrc...\n');

https.get(EPISODE_IDS_URL, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    // Ensure data directory exists
    const dataDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Save to file
    fs.writeFileSync(OUTPUT_FILE, data, 'utf8');
    
    const episodeIds = data.trim().split(/\s+/).filter(id => id.startsWith('tt'));
    
    console.log('✅ Episode IDs downloaded successfully!');
    console.log(`📊 Total episodes: ${episodeIds.length}`);
    console.log(`📁 Saved to: ${OUTPUT_FILE}`);
    console.log(`\n📝 Sample IDs:`);
    console.log(episodeIds.slice(0, 10).join('\n'));
  });

}).on('error', (err) => {
  console.error('❌ Error:', err.message);
});

