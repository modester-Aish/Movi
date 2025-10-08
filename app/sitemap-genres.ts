import { MetadataRoute } from 'next';

const DOMAIN = 'https://ww1.n123movie.me';

export default function genresSitemap(): Promise<MetadataRoute.Sitemap> {
  const genrePages: MetadataRoute.Sitemap = [];

  // Main genres page
  genrePages.push({
    url: `${DOMAIN}/genres`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  });

  // Popular genres
  const genres = [
    'action', 'adventure', 'comedy', 'drama', 'horror', 'romance', 'thriller',
    'sci-fi', 'fantasy', 'crime', 'mystery', 'family', 'animation', 'documentary',
    'war', 'western', 'musical', 'biography', 'history', 'sport'
  ];

  genres.forEach(genre => {
    genrePages.push({
      url: `${DOMAIN}/genre/${genre}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    });
  });

  return Promise.resolve(genrePages);
}
