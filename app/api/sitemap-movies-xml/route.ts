import { NextResponse } from 'next/server';
import { getRandomMovieIds } from '@/utils/movieIds';
import { getMoviesByImdbIds } from '@/api/tmdb';
import { generateMovieUrl } from "@/lib/slug";

const DOMAIN = 'https://ww1.n123movie.me';

export async function GET() {
  try {
    // Get movies for sitemap
    const movieIds = await getRandomMovieIds(1000);
    const movies = await getMoviesByImdbIds(movieIds);
    
    // Generate XML sitemap with images
    const xmlSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${movies
  .filter(movie => movie.imdb_id && movie.imdb_id.trim() !== '')
  .map(movie => {
    const movieUrl = `${DOMAIN}${generateMovieUrl(movie.title, movie.imdb_id)}`;
    const posterUrl = movie.poster_path 
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : `${DOMAIN}/default-poster.jpg`;
    
    return `  <url>
    <loc>${movieUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <image:image>
      <image:loc>${posterUrl}</image:loc>
      <image:title>Watch ${movie.title}</image:title>
      <image:caption>Watch ${movie.title} for free online in HD.</image:caption>
    </image:image>
  </url>`;
  })
  .join('\n')}
</urlset>`;

    return new NextResponse(xmlSitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });

  } catch (error) {
    console.error('Error generating movies XML sitemap:', error);
    
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
