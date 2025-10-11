import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb-client';

const DOMAIN = 'https://ww1.n123movie.me';
const SERIES_PER_SITEMAP = 1000; // 1k per sitemap batch

// Helper function to create series slug
function createSeriesSlug(name: string, id: string | number): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${slug}-${id}`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sitemapNumber = parseInt(id, 10);
    
    if (isNaN(sitemapNumber) || sitemapNumber < 1) {
      return new NextResponse('Invalid sitemap number', { status: 400 });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('moviesDB');
    const seriesCollection = db.collection('tvSeries');
    
    // Calculate start and end indices for this sitemap
    const startIndex = (sitemapNumber - 1) * SERIES_PER_SITEMAP;
    
    // Check total count
    const totalSeries = await seriesCollection.countDocuments();
    
    // Check if sitemap number is valid
    if (startIndex >= totalSeries) {
      return new NextResponse('Sitemap not found', { status: 404 });
    }
    
    // Get series for this chunk with pagination
    const seriesList = await seriesCollection
      .find({}, { projection: { name: 1, tmdb_id: 1, imdb_id: 1 } })
      .sort({ tmdb_id: 1 })
      .skip(startIndex)
      .limit(SERIES_PER_SITEMAP)
      .toArray();
    
    console.log(`Generating series sitemap ${sitemapNumber}: Series ${startIndex}-${startIndex + seriesList.length} (${seriesList.length} series)`);
    
    const lastmod = new Date().toISOString();
    
    // Generate sitemap XML
    const urlEntries = seriesList
      .filter(series => series.name && (series.tmdb_id || series.imdb_id))
      .map(series => {
        const slug = createSeriesSlug(series.name, series.tmdb_id || series.imdb_id);
        return `  <url>
    <loc>${DOMAIN}/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      })
      .join('\n');
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
    
  } catch (error) {
    console.error('Error generating series sitemap:', error);
    return new NextResponse('Error generating series sitemap', { status: 500 });
  }
}

