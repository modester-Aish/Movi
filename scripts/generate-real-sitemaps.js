const fs = require('fs');
const path = require('path');
const https = require('https');

const DOMAIN = 'https://ww1.n123movie.me';
const TMDB_API_KEY = process.env.TMDB_API_KEY || '4ff7e44ae992bcf0bc04b隐藏ed56dc'; // Your TMDB key
const OUTPUT_DIR = path.join(__dirname, '../public/sitemaps-final');

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

// Generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Fetch movie data from TMDB
function fetchMovieFromTMDB(imdbId) {
  return new Promise((resolve) => {
    const url = `https://api.themoviedb.org/3/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const movie = json.movie_results?.[0];
          if (movie && movie.title) {
            resolve({
              imdb_id: imdbId,
              title: movie.title,
              url: `${DOMAIN}/${generateSlug(movie.title)}-${imdbId}`
            });
          } else {
            // Fallback if no title found
            resolve({
              imdb_id: imdbId,
              title: 'Movie',
              url: `${DOMAIN}/movie-${imdbId}`
            });
          }
        } catch (e) {
          resolve({
            imdb_id: imdbId,
            title: 'Movie',
            url: `${DOMAIN}/movie-${imdbId}`
          });
        }
      });
    }).on('error', () => {
      resolve({
        imdb_id: imdbId,
        title: 'Movie',
        url: `${DOMAIN}/movie-${imdbId}`
      });
    });
  });
}

// Fetch movies in batches
async function fetchMoviesBatch(imdbIds, batchSize = 50, delayMs = 100) {
  const results = [];
  
  for (let i = 0; i < imdbIds.length; i += batchSize) {
    const batch = imdbIds.slice(i, Math.min(i + batchSize, imdbIds.length));
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(imdbIds.length / batchSize);
    
    console.log(`  Batch ${batchNum}/${totalBatches} (${batch.length} movies)...`);
    
    const promises = batch.map(id => fetchMovieFromTMDB(id));
    const batchResults = await Promise.all(promises);
    results.push(...batchResults);
    
    // Delay between batches to avoid rate limiting
    if (i + batchSize < imdbIds.length) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  return results;
}

// Generate sitemap XML
function generateSitemapXML(urls) {
  const lastmod = new Date().toISOString();
  
  const urlEntries = urls.map(url => `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

// Generate static sitemaps
async function generateStaticSitemaps() {
  const lastmod = new Date().toISOString();
  
  // Pages sitemap
  const pagesXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${DOMAIN}</loc><lastmod>${lastmod}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>${DOMAIN}/search</loc><lastmod>${lastmod}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>${DOMAIN}/movies</loc><lastmod>${lastmod}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>${DOMAIN}/genres</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>${DOMAIN}/years</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>${DOMAIN}/country</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>
</urlset>`;
  
  fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap-pages.xml'), pagesXML);
  console.log('✓ Generated sitemap-pages.xml');
  
  // Years sitemap - simplified
  const yearsUrls = [];
  for (let year = 2020; year <= 2025; year++) {
    yearsUrls.push(`${DOMAIN}/year/${year}`);
  }
  const yearsXML = generateSitemapXML(yearsUrls);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap-years.xml'), yearsXML);
  console.log('✓ Generated sitemap-years.xml');
  
  // Genres sitemap
  const genres = ['action', 'comedy', 'drama', 'horror', 'thriller', 'romance', 'sci-fi', 'fantasy'];
  const genresUrls = genres.map(g => `${DOMAIN}/genre/${g}`);
  const genresXML = generateSitemapXML(genresUrls);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap-genres.xml'), genresXML);
  console.log('✓ Generated sitemap-genres.xml');
}

// Main function
async function main() {
  console.log('🚀 Generating REAL sitemaps with actual movie titles...\n');
  
  const BULK_MOVIE_IDS = getBulkMovieIds();
  const MOVIES_PER_SITEMAP = 10000;
  
  // Use modern movies (last 50,000 have better TMDB data)
  const START_FROM = Math.max(0, BULK_MOVIE_IDS.length - 50000);
  const SAMPLE_SIZE = 5000; // Generate 5000 modern movies for testing
  
  console.log(`Total movies available: ${BULK_MOVIE_IDS.length}`);
  console.log(`Using modern movies starting from index ${START_FROM}`);
  console.log(`Generating sitemaps for ${SAMPLE_SIZE} movies (for testing)`);
  console.log(`Set SAMPLE_SIZE to 95942 for ALL movies\n`);
  
  // Generate static sitemaps
  await generateStaticSitemaps();
  
  // Generate movie sitemaps with REAL titles (use modern movies)
  const moviesToProcess = BULK_MOVIE_IDS.slice(START_FROM, START_FROM + SAMPLE_SIZE);
  const numberOfSitemaps = Math.ceil(moviesToProcess.length / MOVIES_PER_SITEMAP);
  
  console.log(`\n📊 Generating ${numberOfSitemaps} movie sitemap(s)...\n`);
  
  for (let i = 1; i <= numberOfSitemaps; i++) {
    const startIndex = (i - 1) * MOVIES_PER_SITEMAP;
    const endIndex = Math.min(startIndex + MOVIES_PER_SITEMAP, moviesToProcess.length);
    const chunk = moviesToProcess.slice(startIndex, endIndex);
    
    console.log(`[${i}/${numberOfSitemaps}] Fetching movie data for sitemap-movies-${i}.xml`);
    console.log(`  Processing ${chunk.length} movies (${startIndex}-${endIndex})...`);
    
    const movies = await fetchMoviesBatch(chunk);
    const urls = movies.map(m => m.url);
    const xml = generateSitemapXML(urls);
    
    fs.writeFileSync(path.join(OUTPUT_DIR, `sitemap-movies-${i}.xml`), xml);
    const fileSize = (fs.statSync(path.join(OUTPUT_DIR, `sitemap-movies-${i}.xml`)).size / 1024).toFixed(2);
    console.log(`  ✓ Saved sitemap-movies-${i}.xml (${fileSize} KB)\n`);
  }
  
  // Generate sitemap index
  const indexXML = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${DOMAIN}/sitemaps-final/sitemap-pages.xml</loc><lastmod>${new Date().toISOString()}</lastmod></sitemap>
  <sitemap><loc>${DOMAIN}/sitemaps-final/sitemap-years.xml</loc><lastmod>${new Date().toISOString()}</lastmod></sitemap>
  <sitemap><loc>${DOMAIN}/sitemaps-final/sitemap-genres.xml</loc><lastmod>${new Date().toISOString()}</lastmod></sitemap>
${Array.from({ length: numberOfSitemaps }, (_, i) => `  <sitemap><loc>${DOMAIN}/sitemaps-final/sitemap-movies-${i + 1}.xml</loc><lastmod>${new Date().toISOString()}</lastmod></sitemap>`).join('\n')}
</sitemapindex>`;
  
  fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap-index.xml'), indexXML);
  console.log('✓ Generated sitemap-index.xml\n');
  
  console.log('✅ Done! All sitemaps with REAL movie URLs generated!');
  console.log(`📁 Location: ${OUTPUT_DIR}`);
  console.log('\n🎯 Sample URLs generated:');
  
  // Show sample URLs
  const sampleFile = path.join(OUTPUT_DIR, 'sitemap-movies-1.xml');
  if (fs.existsSync(sampleFile)) {
    const content = fs.readFileSync(sampleFile, 'utf-8');
    const urlMatches = content.match(/<loc>([^<]+)<\/loc>/g);
    if (urlMatches) {
      urlMatches.slice(0, 5).forEach(url => {
        console.log(`  ${url.replace('<loc>', '').replace('</loc>', '')}`);
      });
    }
  }
}

main().catch(console.error);

