import { MetadataRoute } from 'next';
import { getRandomMovieIds } from '@/utils/movieIds';
import { getMoviesByImdbIds } from '@/api/tmdb';
import { generateMovieUrl } from "@/lib/slug";

const DOMAIN = 'https://ww1.n123movie.me';

export default async function moviesSitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Get movies for sitemap (limit to 3000 for performance)
    const movieIds = await getRandomMovieIds(3000);
    const movies = await getMoviesByImdbIds(movieIds);
    
    // Generate movie pages with image sitemap
    const moviePages: MetadataRoute.Sitemap = movies
      .filter(movie => movie.imdb_id && movie.imdb_id.trim() !== '')
      .map((movie) => {
        const movieUrl = `${DOMAIN}${generateMovieUrl(movie.title, movie.imdb_id)}`;
        const posterUrl = movie.poster_path 
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : `${DOMAIN}/default-poster.jpg`;
        
        return {
          url: movieUrl,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
          // Note: Next.js doesn't support image sitemap directly in MetadataRoute
          // You'll need to create a custom XML sitemap for images
        };
      });

    return moviePages;
  } catch (error) {
    console.error('Error generating movies sitemap:', error);
    return [];
  }
}
