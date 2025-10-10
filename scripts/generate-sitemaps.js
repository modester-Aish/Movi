const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://ww1.n123movie.me';

// Create output directory
const outputDir = path.join(__dirname, '../public/sitemaps');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Read bulk movie IDs from file
function getBulkMovieIds() {
  const content = fs.readFileSync(path.join(__dirname, '../app/data/bulkMovieIds.ts'), 'utf-8');
  const match = content.match(/export const BULK_MOVIE_IDS = \[([\s\S]*?)\];/);
  if (!match) return [];
  
  const idsString = match[1];
  const ids = idsString.match(/'tt\d+'/g) || [];
  return ids.map(id => id.replace(/'/g, ''));
}

// Generate sitemap index
async function generateSitemapIndex() {
  const BULK_MOVIE_IDS = getBulkMovieIds();
  const MOVIES_PER_SITEMAP = 10000;
  const numberOfMovieSitemaps = Math.ceil(BULK_MOVIE_IDS.length / MOVIES_PER_SITEMAP);
  
  const lastmod = new Date().toISOString();
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${DOMAIN}/sitemaps/sitemap-pages.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/sitemaps/sitemap-years.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/sitemaps/sitemap-genres.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/sitemaps/sitemap-countries.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
${Array.from({ length: numberOfMovieSitemaps }, (_, i) => `  <sitemap>
    <loc>${DOMAIN}/sitemaps/sitemap-movies-${i + 1}.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

  fs.writeFileSync(path.join(outputDir, 'sitemap-index.xml'), xml);
  console.log('✓ Generated sitemap-index.xml');
  return numberOfMovieSitemaps;
}

// Generate pages sitemap
function generatePagesSitemap() {
  const lastmod = new Date().toISOString();
  
  const pages = [
    { url: DOMAIN, priority: '1.0', changefreq: 'daily' },
    { url: `${DOMAIN}/search`, priority: '0.9', changefreq: 'daily' },
    { url: `${DOMAIN}/movies`, priority: '0.9', changefreq: 'daily' },
    { url: `${DOMAIN}/genres`, priority: '0.8', changefreq: 'weekly' },
    { url: `${DOMAIN}/years`, priority: '0.8', changefreq: 'weekly' },
    { url: `${DOMAIN}/country`, priority: '0.7', changefreq: 'weekly' },
    { url: `${DOMAIN}/home`, priority: '0.7', changefreq: 'weekly' },
    { url: `${DOMAIN}/action`, priority: '0.6', changefreq: 'weekly' },
    { url: `${DOMAIN}/adventure`, priority: '0.6', changefreq: 'weekly' },
    { url: `${DOMAIN}/united-states`, priority: '0.6', changefreq: 'weekly' },
  ];
  
  const urlEntries = pages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n');
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

  fs.writeFileSync(path.join(outputDir, 'sitemap-pages.xml'), xml);
  console.log('✓ Generated sitemap-pages.xml');
}

// Generate years sitemap
function generateYearsSitemap() {
  const lastmod = new Date().toISOString();
  
  const years = [];
  for (let year = 1900; year <= 2025; year++) {
    const priority = year >= 2020 ? '0.8' : year >= 2010 ? '0.7' : '0.6';
    years.push({
      url: `${DOMAIN}/year/${year}`,
      priority,
      changefreq: year >= 2023 ? 'daily' : year >= 2020 ? 'weekly' : 'monthly',
    });
  }
  
  for (let decade = 1900; decade <= 2020; decade += 10) {
    const decadeString = decade === 2000 ? '2000s' : `${decade}s`;
    years.push({
      url: `${DOMAIN}/year/${decadeString}`,
      priority: '0.7',
      changefreq: 'weekly',
    });
  }
  
  const urlEntries = years.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n');
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

  fs.writeFileSync(path.join(outputDir, 'sitemap-years.xml'), xml);
  console.log('✓ Generated sitemap-years.xml');
}

// Generate genres sitemap
function generateGenresSitemap() {
  const lastmod = new Date().toISOString();
  
  const genres = [
    { slug: 'action', priority: '0.9' },
    { slug: 'adventure', priority: '0.9' },
    { slug: 'comedy', priority: '0.9' },
    { slug: 'drama', priority: '0.9' },
    { slug: 'horror', priority: '0.8' },
    { slug: 'thriller', priority: '0.8' },
    { slug: 'romance', priority: '0.8' },
    { slug: 'sci-fi', priority: '0.8' },
    { slug: 'fantasy', priority: '0.8' },
    { slug: 'crime', priority: '0.8' },
    { slug: 'mystery', priority: '0.8' },
    { slug: 'animation', priority: '0.8' },
    { slug: 'family', priority: '0.7' },
    { slug: 'documentary', priority: '0.7' },
    { slug: 'war', priority: '0.7' },
    { slug: 'western', priority: '0.7' },
    { slug: 'musical', priority: '0.7' },
    { slug: 'biography', priority: '0.7' },
    { slug: 'history', priority: '0.7' },
    { slug: 'sport', priority: '0.7' },
  ];
  
  const urlEntries = genres.map(genre => `  <url>
    <loc>${DOMAIN}/genre/${genre.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${genre.priority}</priority>
  </url>`).join('\n');
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

  fs.writeFileSync(path.join(outputDir, 'sitemap-genres.xml'), xml);
  console.log('✓ Generated sitemap-genres.xml');
}

// Generate countries sitemap
function generateCountriesSitemap() {
  const lastmod = new Date().toISOString();
  
  const countries = [
    { slug: 'united-states', priority: '0.9' },
    { slug: 'india', priority: '0.9' },
    { slug: 'united-kingdom', priority: '0.8' },
    { slug: 'japan', priority: '0.8' },
    { slug: 'south-korea', priority: '0.8' },
    { slug: 'china', priority: '0.8' },
    { slug: 'france', priority: '0.8' },
    { slug: 'germany', priority: '0.8' },
    { slug: 'canada', priority: '0.8' },
    { slug: 'australia', priority: '0.7' },
  ];
  
  const urlEntries = countries.map(country => `  <url>
    <loc>${DOMAIN}/country/${country.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${country.priority}</priority>
  </url>`).join('\n');
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

  fs.writeFileSync(path.join(outputDir, 'sitemap-countries.xml'), xml);
  console.log('✓ Generated sitemap-countries.xml');
}

// Generate movie sitemaps with actual movie data
async function generateMovieSitemaps(numberOfSitemaps) {
  const BULK_MOVIE_IDS = getBulkMovieIds();
  const MOVIES_PER_SITEMAP = 10000;
  
  console.log(`\nGenerating ${numberOfSitemaps} movie sitemaps...`);
  console.log(`Total movies: ${BULK_MOVIE_IDS.length}`);
  
  for (let i = 1; i <= numberOfSitemaps; i++) {
    const startIndex = (i - 1) * MOVIES_PER_SITEMAP;
    const endIndex = Math.min(startIndex + MOVIES_PER_SITEMAP, BULK_MOVIE_IDS.length);
    const movieIdsChunk = BULK_MOVIE_IDS.slice(startIndex, endIndex);
    
    const lastmod = new Date().toISOString();
    
    // Generate URLs for each movie
    const urlEntries = movieIdsChunk.map(imdbId => {
      // Simple slug generation - will be replaced by actual movie titles when TMDB data is available
      const url = `${DOMAIN}/movie-${imdbId}`;
      return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }).join('\n');
    
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

    fs.writeFileSync(path.join(outputDir, `sitemap-movies-${i}.xml`), xml);
    console.log(`✓ Generated sitemap-movies-${i}.xml (${movieIdsChunk.length} movies, ${startIndex}-${endIndex})`);
  }
}

// Main function
async function main() {
  console.log('🚀 Generating static XML sitemaps...\n');
  
  const numberOfMovieSitemaps = await generateSitemapIndex();
  generatePagesSitemap();
  generateYearsSitemap();
  generateGenresSitemap();
  generateCountriesSitemap();
  await generateMovieSitemaps(numberOfMovieSitemaps);
  
  console.log(`\n✅ All sitemaps generated successfully!`);
  console.log(`📁 Files saved to: ${outputDir}`);
  console.log(`📊 Total movie sitemaps: ${numberOfMovieSitemaps}`);
}

main().catch(console.error);

