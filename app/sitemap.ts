import { MetadataRoute } from 'next';
import { getRandomMovieIds } from '@/utils/movieIds';
import { getMoviesByImdbIds } from '@/api/tmdb';
import { generateMovieUrl } from "@/lib/slug";

// Fixed domain for ww1.n123movie.me
const DOMAIN = 'https://ww1.n123movie.me';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages for ww1.n123movie.me (only existing pages)
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: DOMAIN,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${DOMAIN}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${DOMAIN}/genres`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${DOMAIN}/years`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${DOMAIN}/movies`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${DOMAIN}/country`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${DOMAIN}/action`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${DOMAIN}/adventure`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${DOMAIN}/united-states`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${DOMAIN}/admin`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  try {
    // Get a sample of movie IDs for sitemap (limit to 2000 for better coverage)
    const movieIds = await getRandomMovieIds(2000);
    const movies = await getMoviesByImdbIds(movieIds);
    
    // Generate movie pages with new URL structure (no /movie/ prefix)
    const moviePages: MetadataRoute.Sitemap = movies
      .filter(movie => movie.imdb_id && movie.imdb_id.trim() !== '')
      .map((movie) => ({
        url: `${DOMAIN}${generateMovieUrl(movie.title, movie.imdb_id)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));

    return [...staticPages, ...moviePages];
  } catch (error) {
    console.error('Error generating sitemap for ww1.n123movie.me:', error);
    // Return only static pages if movie data fails
    return staticPages;
  }
}
