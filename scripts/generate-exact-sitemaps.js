const fs = require('fs');
const path = require('path');
const https = require('https');

const DOMAIN = 'https://ww1.n123movie.me';
const TMDB_API_KEY = 'b31d2e5f33b74ffa7b3b483ff353f760'; // From your tmdb.ts file
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const OUTPUT_DIR = path.join(__dirname, '../public/sitemaps-real');

// Create output directory
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Read bulk movie IDs
function getBulkMovieIds() {
  const content = fs.readFileSync(path.join(__dirname, '../app/data/bulkMovieIds.ts'), 'utf-8');
  const match = content.match(/export const BULK_MOVIE_IDS = \[([\s\S]*?)\];/);
  if (!match) return [];
  
  const idsString = match[1];
  const ids = idsString.match(/'tt\d+'/g) || [];
  return ids.map(id => id.replace(/'/g, ''));
}

// EXACT slug generation from your slug.ts file
function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// EXACT URL generation from your slug.ts file
function generateMovieUrl(title, imdbId) {
  const slug = generateSlug(title);
  return `${DOMAIN}/${slug}-${imdbId}`;
}

// EXACT TMDB fetch logic from your tmdb.ts file
async function getMovieByImdbId(imdbId) {
  return new Promise((resolve) => {
    const findUrl = `${TMDB_BASE_URL}/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;
    
    https.get(findUrl, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', async () => {
        try {
          const findData = JSON.parse(data);
          
          if (!findData.movie_results || findData.movie_results.length === 0) {
            resolve(null);
            return;
          }
          
          const tmdbId = findData.movie_results[0].id;
          
          // Get full movie details
          const detailsUrl = `${TMDB_BASE_URL}/movie/${tmdbId}?api_key=${TMDB_API_KEY}`;
          
          https.get(detailsUrl, (detailsRes) => {
            let detailsData = '';
            detailsRes.on('data', (chunk) => { detailsData += chunk; });
            detailsRes.on('end', () => {
              try {
                const movieData = JSON.parse(detailsData);
                
                // Only return movies with poster (same logic as your tmdb.ts)
                if (!movieData.poster_path || movieData.poster_path.trim() === '') {
                  resolve(null);
                  return;
                }
                
                resolve({
                  id: movieData.id,
                  imdb_id: imdbId,
                  title: movieData.title,
                  overview: movieData.overview,
                  poster_path: movieData.poster_path,
                  release_date: movieData.release_date,
                  url: generateMovieUrl(movieData.title, imdbId)
                });
              } catch (e) {
                resolve(null);
              }
            });
          }).on('error', () => resolve(null));
          
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

// Fetch movies in batches with rate limiting
async function fetchMoviesBatch(imdbIds, batchSize = 1000, delayMs = 500) {
  const results = [];
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < imdbIds.length; i += batchSize) {
    const batch = imdbIds.slice(i, Math.min(i + batchSize, imdbIds.length));
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(imdbIds.length / batchSize);
    
    process.stdout.write(`\r  Batch ${batchNum}/${totalBatches}: Processing... `);
    
    const promises = batch.map(id => getMovieByImdbId(id));
    const batchResults = await Promise.all(promises);
    
    // Filter out nulls and add valid movies
    batchResults.forEach(movie => {
      if (movie) {
        results.push(movie);
        successCount++;
      } else {
        failCount++;
      }
    });
    
    process.stdout.write(`✓ (${successCount} found, ${failCount} skipped)\n`);
    
    // Delay between batches
    if (i + batchSize < imdbIds.length) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  return results;
}

// Generate sitemap XML
function generateSitemapXML(movies) {
  const lastmod = new Date().toISOString();
  
  const urlEntries = movies.map(movie => `  <url>
    <loc>${movie.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

// Main function
async function main() {
  console.log('🎬 Generating REAL Movie Sitemaps (Using Your EXACT Code Logic)\n');
  
  const BULK_MOVIE_IDS = getBulkMovieIds();
  const MOVIES_PER_SITEMAP = 10000;
  
  // Process ALL movies
  const START_FROM = 0; // Start from beginning
  const TOTAL_TO_PROCESS = BULK_MOVIE_IDS.length; // ALL 95,942 movies
  
  console.log(`Total movies available: ${BULK_MOVIE_IDS.length}`);
  console.log(`Processing ALL MOVIES (0 to ${BULK_MOVIE_IDS.length})`);
  console.log(`Generating ${TOTAL_TO_PROCESS} movie URLs\n`);
  console.log(`⏰ Estimated time: 4-5 hours (Please be patient!)\n`);
  
  const moviesToProcess = BULK_MOVIE_IDS.slice(START_FROM, START_FROM + TOTAL_TO_PROCESS);
  
  console.log(`📊 Fetching movie data from TMDB (this will take a few minutes)...\n`);
  
  const movies = await fetchMoviesBatch(moviesToProcess);
  
  console.log(`\n✅ Successfully fetched ${movies.length} movies with valid data\n`);
  
  // Split into sitemap files
  const numberOfSitemaps = Math.ceil(movies.length / MOVIES_PER_SITEMAP);
  
  console.log(`📝 Generating ${numberOfSitemaps} sitemap file(s)...\n`);
  
  const allSitemapFiles = [];
  
  for (let i = 1; i <= numberOfSitemaps; i++) {
    const startIndex = (i - 1) * MOVIES_PER_SITEMAP;
    const endIndex = Math.min(startIndex + MOVIES_PER_SITEMAP, movies.length);
    const chunk = movies.slice(startIndex, endIndex);
    
    const xml = generateSitemapXML(chunk);
    const filename = `sitemap-movies-${i}.xml`;
    
    fs.writeFileSync(path.join(OUTPUT_DIR, filename), xml);
    const fileSize = (fs.statSync(path.join(OUTPUT_DIR, filename)).size / 1024).toFixed(2);
    
    console.log(`  ✓ ${filename} (${chunk.length} movies, ${fileSize} KB)`);
    allSitemapFiles.push(filename);
  }
  
  // Generate sitemap index
  const lastmod = new Date().toISOString();
  const indexXML = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allSitemapFiles.map(file => `  <sitemap>
    <loc>${DOMAIN}/sitemaps-real/${file}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;
  
  fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap-index.xml'), indexXML);
  console.log(`  ✓ sitemap-index.xml (main index)\n`);
  
  console.log('✅ Done! REAL movie URLs generated!\n');
  console.log(`📁 Location: ${OUTPUT_DIR}\n`);
  console.log('🎯 Sample URLs (exactly like your movie detail pages):');
  
  movies.slice(0, 10).forEach(movie => {
    console.log(`  ${movie.url}`);
  });
  
  console.log(`\n📊 Stats:`);
  console.log(`  Total URLs: ${movies.length}`);
  console.log(`  Sitemap files: ${allSitemapFiles.length}`);
  console.log(`\n🚀 Ready to submit to Google/Bing!`);
}

main().catch(console.error);

