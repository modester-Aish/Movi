import { NextRequest, NextResponse } from 'next/server';
import { generateMovieUrl } from '@/lib/slug';
import { getMovieByImdbId } from '@/api/tmdb';

const DOMAIN = 'https://ww1.n123movie.me';
const MOVIES_PER_SITEMAP = 1000; // 1k per sitemap batch

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

    // Import bulk movie IDs
    const { BULK_MOVIE_IDS } = await import('@/data/bulkMovieIds');
    
    // Calculate start and end indices for this sitemap
    const startIndex = (sitemapNumber - 1) * MOVIES_PER_SITEMAP;
    const endIndex = Math.min(startIndex + MOVIES_PER_SITEMAP, BULK_MOVIE_IDS.length);
    
    // Check if sitemap number is valid
    if (startIndex >= BULK_MOVIE_IDS.length) {
      return new NextResponse('Sitemap not found', { status: 404 });
    }
    
    // Get movie IDs for this chunk
    const movieIdsChunk = BULK_MOVIE_IDS.slice(startIndex, endIndex);
    
    console.log(`Generating sitemap ${sitemapNumber}: Movies ${startIndex}-${endIndex} (${movieIdsChunk.length} movies)`);
    
    // Generate sitemap XML directly from movie IDs (without TMDB API call for speed)
    const lastmod = new Date().toISOString();
    
    // Generate sitemap XML with actual movie URLs (title-slug format)
    const urlEntries = await Promise.all(
      movieIdsChunk
        .filter(imdbId => imdbId && imdbId.trim() !== '')
        .map(async (imdbId) => {
          try {
            // Get movie details to generate proper URL
            const movie = await getMovieByImdbId(imdbId);
            if (movie && movie.title) {
              // Generate URL using the same logic as movie pages
              const url = generateMovieUrl(movie.title, movie.imdb_id);
              return `  <url>
    <loc>${DOMAIN}${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
            } else {
              // Fallback to IMDB ID format if movie not found
              return `  <url>
    <loc>${DOMAIN}/${imdbId}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
            }
          } catch (error) {
            console.error(`Error processing movie ${imdbId}:`, error);
            // Fallback to IMDB ID format
            return `  <url>
    <loc>${DOMAIN}/${imdbId}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
          }
        })
    );
    
    const urlEntriesString = urlEntries.join('\n');
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntriesString}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
    
  } catch (error) {
    console.error('Error generating movie sitemap:', error);
    return new NextResponse('Error generating movie sitemap', { status: 500 });
  }
}


