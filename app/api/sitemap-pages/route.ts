import { NextResponse } from 'next/server';

const DOMAIN = 'https://ww1.n123movie.me';

export async function GET() {
  try {
    const lastmod = new Date().toISOString();
    
    // Static pages
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
      { url: `${DOMAIN}/admin`, priority: '0.3', changefreq: 'monthly' },
    ];
    
    const urlEntries = pages
      .map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
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
    console.error('Error generating pages sitemap:', error);
    return new NextResponse('Error generating pages sitemap', { status: 500 });
  }
}


