import { NextResponse } from 'next/server';

const DOMAIN = 'https://ww1.n123movie.me';
const MOVIES_PER_SITEMAP = 10000;

export async function GET() {
  try {
    // Import bulk movie IDs to calculate number of sitemaps needed
    const { BULK_MOVIE_IDS } = await import('@/data/bulkMovieIds');
    
    const totalMovies = BULK_MOVIE_IDS.length;
    const numberOfMovieSitemaps = Math.ceil(totalMovies / MOVIES_PER_SITEMAP);
    
    console.log(`Total movies: ${totalMovies}, Number of movie sitemaps: ${numberOfMovieSitemaps}`);
    
    const lastmod = new Date().toISOString();
    
    // Generate sitemap index XML with all sub-sitemaps
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${DOMAIN}/api/sitemap-pages</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/api/sitemap-years</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/api/sitemap-genres</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/api/sitemap-countries</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
${Array.from({ length: numberOfMovieSitemaps }, (_, i) => `  <sitemap>
    <loc>${DOMAIN}/api/sitemap-movies/${i + 1}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

    return new Response(sitemapIndex, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
    
  } catch (error) {
    console.error('Error generating sitemap index:', error);
    return new NextResponse('Error generating sitemap index', { status: 500 });
  }
}

