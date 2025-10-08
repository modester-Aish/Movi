import { NextResponse } from 'next/server';
import { getRandomMovieIds } from '@/utils/movieIds';
import { getMoviesByImdbIds } from '@/api/tmdb';
import { generateMovieUrl } from "@/lib/slug";

// Dedicated sitemap for ww1.n123movie.me domain
const DOMAIN = 'https://ww1.n123movie.me';

export async function GET() {
  try {
    // Static pages for ww1.n123movie.me
    const staticPages = [
      {
        url: DOMAIN,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${DOMAIN}/search`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: `${DOMAIN}/genres`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${DOMAIN}/years`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${DOMAIN}/movies`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${DOMAIN}/admin`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: 0.3,
      },
    ];

    // Get a sample of movie IDs for sitemap (limit to 2000 for better coverage)
    const movieIds = await getRandomMovieIds(2000);
    const movies = await getMoviesByImdbIds(movieIds);
    
    // Generate movie pages with new URL structure (no /movie/ prefix)
    const moviePages = movies
      .filter(movie => movie.imdb_id && movie.imdb_id.trim() !== '')
      .map((movie) => ({
        url: `${DOMAIN}${generateMovieUrl(movie.title, movie.imdb_id)}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.7,
      }));

    const allPages = [...staticPages, ...moviePages];

    // Generate XML sitemap
    const xmlSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return new NextResponse(xmlSitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });

  } catch (error) {
    console.error('Error generating sitemap for ww1.n123movie.me:', error);
    
    // Return basic sitemap if there's an error
    const basicXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${DOMAIN}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1</priority>
  </url>
</urlset>`;

    return new NextResponse(basicXml, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  }
}
