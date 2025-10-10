import { NextResponse } from 'next/server';

const DOMAIN = 'https://ww1.n123movie.me';

export async function GET() {
  try {
    const lastmod = new Date().toISOString();
    
    // Generate all years (1900-2025)
    const years: { url: string; priority: string; changefreq: string }[] = [];
    
    for (let year = 1900; year <= 2025; year++) {
      // Recent years get higher priority
      const priority = year >= 2020 ? '0.8' : year >= 2010 ? '0.7' : '0.6';
      years.push({
        url: `${DOMAIN}/year/${year}`,
        priority,
        changefreq: year >= 2023 ? 'daily' : year >= 2020 ? 'weekly' : 'monthly',
      });
    }
    
    // Generate decade pages (1900s, 1910s, ..., 2020s)
    const decades: { url: string; priority: string; changefreq: string }[] = [];
    for (let decade = 1900; decade <= 2020; decade += 10) {
      const decadeString = decade === 2000 ? '2000s' : `${decade}s`;
      decades.push({
        url: `${DOMAIN}/year/${decadeString}`,
        priority: '0.7',
        changefreq: 'weekly',
      });
    }
    
    const allPages = [...years, ...decades];
    
    const urlEntries = allPages
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
    console.error('Error generating years sitemap:', error);
    return new NextResponse('Error generating years sitemap', { status: 500 });
  }
}


