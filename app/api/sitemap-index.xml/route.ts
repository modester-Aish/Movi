import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb-client';

const DOMAIN = 'https://ww1.n123movie.me';
const ITEMS_PER_SITEMAP = 1000; // 1k per sitemap

export async function GET() {
  try {
    // Import bulk movie IDs to calculate number of sitemaps needed
    const { BULK_MOVIE_IDS } = await import('@/data/bulkMovieIds');
    
    const totalMovies = BULK_MOVIE_IDS.length;
    const numberOfMovieSitemaps = Math.ceil(totalMovies / ITEMS_PER_SITEMAP);
    
    // Get total series count from MongoDB
    let totalSeries = 0;
    let numberOfSeriesSitemaps = 0;
    
    try {
      const client = await clientPromise;
      const db = client.db('moviesDB');
      const seriesCollection = db.collection('tvSeries');
      totalSeries = await seriesCollection.countDocuments();
      numberOfSeriesSitemaps = Math.ceil(totalSeries / ITEMS_PER_SITEMAP);
    } catch (error) {
      console.error('Error fetching series count:', error);
    }
    
    console.log(`Total movies: ${totalMovies}, Number of movie sitemaps: ${numberOfMovieSitemaps}`);
    console.log(`Total series: ${totalSeries}, Number of series sitemaps: ${numberOfSeriesSitemaps}`);
    
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
${Array.from({ length: numberOfSeriesSitemaps }, (_, i) => `  <sitemap>
    <loc>${DOMAIN}/api/sitemap-series/${i + 1}</loc>
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

