import { Metadata } from 'next';
import type { Movie } from '../api/tmdb';

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

export function generateMovieSEO(movie: Movie, baseUrl: string = 'https://cineverse.com'): SEOConfig {
  const movieUrl = `${baseUrl}/movie/${movie.imdb_id}`;
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : `${baseUrl}/placeholder.svg`;

  // Generate SEO keywords
  const keywords = [
    `download ${movie.title}`,
    `watch ${movie.title}`,
    `${movie.title} online`,
    `${movie.title} free`,
    `${movie.title} streaming`,
    `${movie.title} HD`,
    `${movie.title} 720p`,
    `${movie.title} 1080p`,
    ...(movie.genres?.map(genre => genre.name) || []),
    ...(movie.release_date ? [movie.release_date.split('-')[0]] : []),
    'free movies',
    'online movies',
    'movie streaming',
    'HD movies',
    'download movies'
  ];

  return {
    title: `${movie.title} (${movie.release_date?.split('-')[0] || 'N/A'}) - Watch Online Free | CineVerse`,
    description: movie.overview || `Watch ${movie.title} online for free. Download ${movie.title} in HD quality. ${movie.genres?.map(g => g.name).join(', ')} movie from ${movie.release_date?.split('-')[0] || 'N/A'}.`,
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
      siteName: 'CineVerse',
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
      canonical: seoConfig.url,
    },
  };
}

export function generateHomePageSEO(): SEOConfig {
  return {
    title: 'CineVerse - Watch Movies Online Free | HD Movie Streaming',
    description: 'Watch thousands of movies online for free at CineVerse. Download HD movies, stream latest releases, and discover your favorite films. No registration required.',
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
    url: 'https://cineverse.com',
    type: 'website'
  };
}

export function generateSearchPageSEO(query: string): SEOConfig {
  return {
    title: `Search Results for "${query}" - CineVerse`,
    description: `Find movies related to "${query}" on CineVerse. Watch and download your favorite movies online for free.`,
    keywords: [
      `search ${query}`,
      `${query} movies`,
      `watch ${query} online`,
      `download ${query}`,
      'movie search',
      'find movies'
    ],
    url: `https://cineverse.com/search?q=${encodeURIComponent(query)}`,
    type: 'website'
  };
}
