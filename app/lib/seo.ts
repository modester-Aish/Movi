import { Metadata } from 'next';
import type { Movie } from '../api/tmdb';
import { getBaseUrl } from './domain';

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'video.movie';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
}

export function generateMovieSEO(movie: Movie, baseUrl?: string): SEOConfig {
  // Use ww1.n123movie.me domain for canonical URL
  const currentBaseUrl = 'https://ww1.n123movie.me';
  const movieUrl = `${currentBaseUrl}/${movie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}-${movie.imdb_id}`;
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : `${currentBaseUrl}/placeholder.svg`;

  // Generate comprehensive SEO keywords
  const keywords = [
    `watch ${movie.title} online`,
    `download ${movie.title}`,
    `${movie.title} free streaming`,
    `${movie.title} HD`,
    `${movie.title} 720p`,
    `${movie.title} 1080p`,
    `${movie.title} online free`,
    `${movie.title} streaming`,
    `${movie.title} watch online`,
    `${movie.title} download free`,
    ...(movie.genres?.map(genre => genre.name) || []),
    ...(movie.release_date ? [movie.release_date.split('-')[0]] : []),
    'free movies online',
    'watch movies online',
    'download movies HD',
    'movie streaming free',
    'online cinema',
    'HD movies free'
  ];

  // Create SEO-optimized description
  const description = movie.overview 
    ? `${movie.overview} Watch ${movie.title} online for free. Download ${movie.title} in HD quality. ${movie.genres?.map(g => g.name).join(', ')} movie from ${movie.release_date?.split('-')[0] || 'N/A'}.`
    : `Watch ${movie.title} online for free. Download ${movie.title} in HD quality. ${movie.genres?.map(g => g.name).join(', ')} movie from ${movie.release_date?.split('-')[0] || 'N/A'}. Free streaming available.`;

  return {
    title: `${movie.title} (${movie.release_date?.split('-')[0] || 'N/A'}) - Watch Online Free | 123Movies`,
    description: description,
    keywords,
    image: posterUrl,
    url: movieUrl,
    type: 'video.movie',
    publishedTime: movie.release_date,
    modifiedTime: new Date().toISOString(),
    tags: movie.genres?.map(genre => genre.name) || []
  };
}

export function generateMovieMetadata(seoConfig: SEOConfig): Metadata {
  return {
    title: seoConfig.title,
    description: seoConfig.description,
    keywords: seoConfig.keywords.join(', '),
    authors: seoConfig.authors?.map(author => ({ name: author })),
    openGraph: {
      title: seoConfig.title,
      description: seoConfig.description,
      url: seoConfig.url,
      siteName: '123Movies',
      images: seoConfig.image ? [
        {
          url: seoConfig.image,
          width: 500,
          height: 750,
          alt: seoConfig.title,
        }
      ] : [],
      locale: 'en_US',
      type: seoConfig.type || 'website',
      publishedTime: seoConfig.publishedTime,
      modifiedTime: seoConfig.modifiedTime,
      section: seoConfig.section,
      tags: seoConfig.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: seoConfig.title,
      description: seoConfig.description,
      images: seoConfig.image ? [seoConfig.image] : [],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: seoConfig.url || 'https://ww1.n123movie.me',
    },
    // Ensure no external canonical URLs
    other: {
      'og:url': seoConfig.url || getBaseUrl(),
      'twitter:url': seoConfig.url || getBaseUrl(),
    },
  };
}

export function generateHomePageSEO(): SEOConfig {
  return {
    title: '123Movies - Watch Movies Online Free | HD Movie Streaming',
    description: 'Watch thousands of movies online for free. Download HD movies, stream latest releases, and discover your favorite films. No registration required.',
    keywords: [
      'watch movies online free',
      'download movies HD',
      'movie streaming',
      'free movies online',
      'HD movies',
      'latest movies',
      'movie downloads',
      'online cinema',
      'streaming movies',
      'free movie site'
    ],
    url: getBaseUrl(),
    type: 'website'
  };
}

export function generateSearchPageSEO(query: string): SEOConfig {
  return {
    title: `Search Results for "${query}" - 123Movies`,
    description: `Find movies related to "${query}". Watch and download your favorite movies online for free.`,
    keywords: [
      `search ${query}`,
      `${query} movies`,
      `watch ${query} online`,
      `download ${query}`,
      'movie search',
      'find movies'
    ],
    url: `${getBaseUrl()}/search?q=${encodeURIComponent(query)}`,
    type: 'website'
  };
}

export function generateGenrePageSEO(genreName: string, baseUrl?: string): SEOConfig {
  return {
    title: `${genreName} Movies | Watch ${genreName} Movies Online Free | 123Movies`,
    description: `Watch the best ${genreName.toLowerCase()} movies online for free. Discover top-rated ${genreName.toLowerCase()} films, latest releases, and classic favorites.`,
    keywords: [`${genreName.toLowerCase()} movies`, 'watch movies online', 'free movies', 'movie streaming', `${genreName.toLowerCase()} films`],
    url: baseUrl || 'https://ww1.n123movie.me',
    type: 'website',
  };
}

export function generateCountryPageSEO(countryName: string, baseUrl?: string): SEOConfig {
  return {
    title: `${countryName} Movies | Watch ${countryName} Movies Online Free | 123Movies`,
    description: `Watch the best ${countryName} movies online for free. Discover top-rated films from ${countryName}, latest releases, and classic favorites.`,
    keywords: [`${countryName} movies`, 'watch movies online', 'free movies', 'movie streaming', `${countryName} films`],
    url: baseUrl || 'https://ww1.n123movie.me',
    type: 'website',
  };
}

export function generateMoviesPageSEO(baseUrl?: string): SEOConfig {
  return {
    title: 'All Movies | Watch Movies Online Free | 123Movies',
    description: 'Browse thousands of movies online for free. Watch latest releases, classic films, and discover your favorite movies. No registration required.',
    keywords: ['all movies', 'watch movies online', 'free movies', 'movie streaming', 'browse movies', 'movie collection'],
    url: baseUrl || 'https://ww1.n123movie.me',
    type: 'website',
  };
}
