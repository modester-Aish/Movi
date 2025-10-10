import { NextResponse } from 'next/server';

const DOMAIN = 'https://ww1.n123movie.me';

export async function GET() {
  try {
    const lastmod = new Date().toISOString();
    
    // All genres with their priorities
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
      { slug: 'music', priority: '0.7' },
      { slug: 'tv-movie', priority: '0.6' },
      { slug: 'news', priority: '0.6' },
      { slug: 'short', priority: '0.6' },
      { slug: 'reality-tv', priority: '0.6' },
      { slug: 'game-show', priority: '0.6' },
      { slug: 'talk-show', priority: '0.6' },
      { slug: 'adult', priority: '0.5' },
    ];
    
    const urlEntries = genres
      .map(genre => `  <url>
    <loc>${DOMAIN}/genre/${genre.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${genre.priority}</priority>
  </url>`)
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
    console.error('Error generating genres sitemap:', error);
    return new NextResponse('Error generating genres sitemap', { status: 500 });
  }
}


