import { NextResponse } from 'next/server';

const DOMAIN = 'https://ww1.n123movie.me';

export async function GET() {
  try {
    const lastmod = new Date().toISOString();
    
    // All countries with their priorities (popular countries get higher priority)
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
      { slug: 'italy', priority: '0.7' },
      { slug: 'spain', priority: '0.7' },
      { slug: 'brazil', priority: '0.7' },
      { slug: 'mexico', priority: '0.7' },
      { slug: 'russia', priority: '0.7' },
      { slug: 'hong-kong', priority: '0.7' },
      { slug: 'taiwan', priority: '0.7' },
      { slug: 'thailand', priority: '0.7' },
      { slug: 'turkey', priority: '0.7' },
      { slug: 'iran', priority: '0.6' },
      { slug: 'argentina', priority: '0.6' },
      { slug: 'sweden', priority: '0.6' },
      { slug: 'norway', priority: '0.6' },
      { slug: 'denmark', priority: '0.6' },
      { slug: 'finland', priority: '0.6' },
      { slug: 'netherlands', priority: '0.6' },
      { slug: 'belgium', priority: '0.6' },
      { slug: 'switzerland', priority: '0.6' },
      { slug: 'austria', priority: '0.6' },
      { slug: 'poland', priority: '0.6' },
      { slug: 'czech-republic', priority: '0.6' },
      { slug: 'ireland', priority: '0.6' },
      { slug: 'new-zealand', priority: '0.6' },
      { slug: 'south-africa', priority: '0.6' },
      { slug: 'egypt', priority: '0.6' },
      { slug: 'israel', priority: '0.6' },
      { slug: 'uae', priority: '0.6' },
      { slug: 'saudi-arabia', priority: '0.6' },
      { slug: 'pakistan', priority: '0.6' },
      { slug: 'bangladesh', priority: '0.6' },
      { slug: 'indonesia', priority: '0.6' },
      { slug: 'malaysia', priority: '0.6' },
      { slug: 'singapore', priority: '0.6' },
      { slug: 'philippines', priority: '0.6' },
      { slug: 'vietnam', priority: '0.6' },
      { slug: 'colombia', priority: '0.6' },
      { slug: 'chile', priority: '0.6' },
      { slug: 'peru', priority: '0.6' },
      { slug: 'venezuela', priority: '0.6' },
      { slug: 'greece', priority: '0.6' },
      { slug: 'portugal', priority: '0.6' },
      { slug: 'romania', priority: '0.6' },
      { slug: 'hungary', priority: '0.6' },
      { slug: 'ukraine', priority: '0.6' },
      { slug: 'nigeria', priority: '0.5' },
      { slug: 'kenya', priority: '0.5' },
      { slug: 'morocco', priority: '0.5' },
      { slug: 'algeria', priority: '0.5' },
      { slug: 'tunisia', priority: '0.5' },
      { slug: 'lebanon', priority: '0.5' },
    ];
    
    const urlEntries = countries
      .map(country => `  <url>
    <loc>${DOMAIN}/country/${country.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${country.priority}</priority>
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
    console.error('Error generating countries sitemap:', error);
    return new NextResponse('Error generating countries sitemap', { status: 500 });
  }
}


