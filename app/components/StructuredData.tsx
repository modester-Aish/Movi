import { Movie } from '@/api/tmdb';

interface StructuredDataProps {
  movie?: Movie;
  series?: any;
  type: 'movie' | 'series' | 'website';
}

export default function StructuredData({ movie, series, type }: StructuredDataProps) {
  const baseUrl = 'https://ww1.n123movie.me';

  const generateMovieStructuredData = (movie: Movie) => {
    return {
      "@context": "https://schema.org",
      "@type": "Movie",
      "name": movie.title,
      "description": movie.overview,
      "image": movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : undefined,
      "url": `${baseUrl}/${movie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}-${movie.imdb_id}`,
      "datePublished": movie.release_date,
      "genre": movie.genres?.map(genre => genre.name),
      "duration": movie.runtime ? `PT${movie.runtime}M` : undefined,
      "aggregateRating": movie.vote_average ? {
        "@type": "AggregateRating",
        "ratingValue": movie.vote_average,
        "bestRating": 10,
        "ratingCount": 0
      } : undefined,
      "actor": [], // Will be populated when we have cast data
      "director": [], // Will be populated when we have crew data
      "productionCompany": [], // Will be populated when we have production data
      "sameAs": movie.imdb_id ? `https://www.imdb.com/title/${movie.imdb_id}/` : undefined,
      "potentialAction": {
        "@type": "WatchAction",
        "target": `${baseUrl}/${movie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}-${movie.imdb_id}`,
        "object": {
          "@type": "Movie",
          "name": movie.title
        }
      }
    };
  };

  const generateSeriesStructuredData = (series: any) => {
    return {
      "@context": "https://schema.org",
      "@type": "TVSeries",
      "name": series.name,
      "description": series.overview,
      "image": series.poster_path ? `https://image.tmdb.org/t/p/w500${series.poster_path}` : undefined,
      "url": `${baseUrl}/${series.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}-${series.id}`,
      "datePublished": series.first_air_date,
      "genre": series.genres?.map((genre: any) => genre.name),
      "numberOfSeasons": series.number_of_seasons,
      "numberOfEpisodes": series.number_of_episodes,
      "aggregateRating": series.vote_average ? {
        "@type": "AggregateRating",
        "ratingValue": series.vote_average,
        "bestRating": 10,
        "ratingCount": 0
      } : undefined,
      "sameAs": series.external_ids?.imdb_id ? `https://www.imdb.com/title/${series.external_ids.imdb_id}/` : undefined,
      "potentialAction": {
        "@type": "WatchAction",
        "target": `${baseUrl}/${series.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}-${series.id}`,
        "object": {
          "@type": "TVSeries",
          "name": series.name
        }
      }
    };
  };

  const generateWebsiteStructuredData = () => {
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "123Movies",
      "alternateName": "n123movie",
      "url": baseUrl,
      "description": "Watch thousands of movies online for free. Download HD movies, stream latest releases, and discover your favorite films.",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${baseUrl}/search?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      },
      "publisher": {
        "@type": "Organization",
        "name": "123Movies",
        "url": baseUrl
      }
    };
  };

  let structuredData;

  switch (type) {
    case 'movie':
      if (movie) {
        structuredData = generateMovieStructuredData(movie);
      }
      break;
    case 'series':
      if (series) {
        structuredData = generateSeriesStructuredData(series);
      }
      break;
    case 'website':
      structuredData = generateWebsiteStructuredData();
      break;
  }

  if (!structuredData) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  );
}
