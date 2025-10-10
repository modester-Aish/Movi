const fs = require('fs');
const path = require('path');
const http = require('http');

const BASE_URL = 'http://localhost:3002';
const OUTPUT_DIR = path.join(__dirname, '../public/sitemaps-real');

// Create output directory
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Fetch and save a sitemap
function fetchSitemap(url, filename) {
  return new Promise((resolve, reject) => {
    console.log(`Fetching: ${url}`);
    
    http.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const filepath = path.join(OUTPUT_DIR, filename);
        fs.writeFileSync(filepath, data);
        const fileSize = (fs.statSync(filepath).size / 1024).toFixed(2);
        console.log(`✓ Saved: ${filename} (${fileSize} KB)`);
        resolve();
      });
    }).on('error', (err) => {
      console.error(`✗ Error fetching ${filename}:`, err.message);
      reject(err);
    });
  });
}

// Download with delay to avoid overwhelming the server
async function downloadWithDelay(url, filename, delay = 1000) {
  await fetchSitemap(url, filename);
  await new Promise(resolve => setTimeout(resolve, delay));
}

async function main() {
  console.log('🚀 Downloading real sitemaps from running server...\n');
  console.log(`Server: ${BASE_URL}`);
  console.log(`Output: ${OUTPUT_DIR}\n`);
  
  try {
    // Download sitemap index
    await downloadWithDelay(`${BASE_URL}/api/sitemap-index.xml`, 'sitemap-index.xml', 500);
    
    // Download other sitemaps
    await downloadWithDelay(`${BASE_URL}/api/sitemap-pages`, 'sitemap-pages.xml', 500);
    await downloadWithDelay(`${BASE_URL}/api/sitemap-years`, 'sitemap-years.xml', 500);
    await downloadWithDelay(`${BASE_URL}/api/sitemap-genres`, 'sitemap-genres.xml', 500);
    await downloadWithDelay(`${BASE_URL}/api/sitemap-countries`, 'sitemap-countries.xml', 500);
    
    console.log('\n📊 Downloading movie sitemaps (this may take a while)...\n');
    
    // Download movie sitemaps (1-10)
    for (let i = 1; i <= 10; i++) {
      console.log(`[${i}/10] Processing sitemap-movies-${i}.xml...`);
      await downloadWithDelay(
        `${BASE_URL}/api/sitemap-movies/${i}`, 
        `sitemap-movies-${i}.xml`,
        i === 10 ? 500 : 2000 // Longer delay between movie sitemaps
      );
    }
    
    console.log('\n✅ All sitemaps downloaded successfully!');
    console.log(`📁 Files saved to: ${OUTPUT_DIR}`);
    console.log('\n🎯 These XML files contain REAL movie URLs with actual titles!');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nMake sure the development server is running on port 3002');
    console.error('Run: npm run dev');
  }
}

main();


