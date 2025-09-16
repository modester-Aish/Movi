import { MetadataRoute } from 'next';
import { getRandomMovieIds } from './utils/movieIds';
import { getMoviesByImdbIds } from './api/tmdb';
import { generateMovieUrl } from './lib/slug';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://movies.n123movie.me';
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/admin`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.3,
    },
  ];

  try {
    // Get a sample of movie IDs for sitemap (limit to 1000 for performance)
    const movieIds = await getRandomMovieIds(1000);
    const movies = await getMoviesByImdbIds(movieIds);
    
    // Generate movie pages with new URL structure (no /movie/ prefix)
    const moviePages: MetadataRoute.Sitemap = movies
      .filter(movie => movie.imdb_id && movie.imdb_id.trim() !== '')
      .map((movie) => ({
        url: `${baseUrl}${generateMovieUrl(movie.title, movie.imdb_id)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));

    return [...staticPages, ...moviePages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return only static pages if movie data fails
    return staticPages;
  }
}
