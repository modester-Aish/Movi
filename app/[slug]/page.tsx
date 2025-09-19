import { getMovieByImdbId, getSimilarMovies, getYear } from "@/api/tmdb";
import type { Movie, MovieListItem } from "@/api/tmdb";
import Link from "next/link";
import Image from "next/image";
import { generateMovieSEO, generateMovieMetadata } from "@/lib/seo";
import { generateMovieUrl, extractImdbIdFromSlug, isValidMovieSlug } from "@/lib/slug";
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

interface MoviePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const { slug } = await params;
  
  let imdbId: string | null = null;
  
  // Check if it's a new slug format (e.g., "the-godfather-tt0068646")
  if (isValidMovieSlug(slug)) {
    imdbId = extractImdbIdFromSlug(slug);
  } 
  // Check if it's an old IMDB ID format (e.g., "tt0068646")
  else if (slug.match(/^tt\d{7,8}$/)) {
    imdbId = slug;
  }
  
  if (!imdbId) {
    return {
      title: 'Movie Not Found - movies123',
      description: 'The requested movie could not be found.',
    };
  }
  
  try {
    const movie = await getMovieByImdbId(imdbId);
    if (!movie) {
      return {
        title: 'Movie Not Found - movies123',
        description: 'The requested movie could not be found.',
      };
    }

    const seoConfig = generateMovieSEO(movie);
    return generateMovieMetadata(seoConfig);
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Movie Not Found - movies123',
      description: 'The requested movie could not be found.',
    };
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { slug } = await params;
  
  let imdbId: string | null = null;
  let shouldRedirect = false;
  
  // Check if it's a new slug format (e.g., "the-godfather-tt0068646")
  if (isValidMovieSlug(slug)) {
    imdbId = extractImdbIdFromSlug(slug);
  } 
  // Check if it's an old IMDB ID format (e.g., "tt0068646")
  else if (slug.match(/^tt\d{7,8}$/)) {
    imdbId = slug;
    shouldRedirect = true; // We'll redirect to the new format
  }
  
  if (!imdbId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="text-8xl mb-6">⚠️</div>
            <h1 className="text-2xl font-bold text-white mb-4">Invalid Movie URL</h1>
            <p className="text-gray-400 mb-6">The movie URL format is invalid.</p>
            <Link 
              href="/"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  let movie: Movie | null = null;
  let similarMovies: MovieListItem[] = [];
  let error: string | null = null;

  try {
    movie = await getMovieByImdbId(imdbId);
    if (movie) {
      similarMovies = await getSimilarMovies(movie.id);
      
      // If this was an old URL format, redirect to the new format
      if (shouldRedirect) {
        const newUrl = generateMovieUrl(movie.title, movie.imdb_id);
        redirect(newUrl);
      }
    } else {
      error = "Movie not found";
    }
  } catch (err) {
    console.error('Error loading movie:', err);
    error = 'Failed to load movie data';
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="text-8xl mb-6">⚠️</div>
            <h1 className="text-2xl font-bold text-white mb-4">Movie Not Found</h1>
            <p className="text-gray-400 mb-6">{error || 'This movie could not be loaded.'}</p>
            <Link 
              href="/"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* YouTube Style Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Main Content (75%) */}
          <div className="flex-1 lg:w-3/4 space-y-4">
            {/* Video Player */}
            <div className="bg-black rounded-lg overflow-hidden">
              <div className="relative pt-[56.25%]">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://vidsrc.to/embed/movie/${imdbId}`}
                  title={`${movie.title} - Movie Player`}
                  frameBorder="0"
                  referrerPolicy="no-referrer"
                  allowFullScreen
                  allow="autoplay; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Video Title */}
            <div className="space-y-3">
              <h1 className="text-xl font-medium text-gray-900 leading-tight">
                {movie.title}
              </h1>
              
              {/* Video Stats */}
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <span>1.2M views</span>
                <span>•</span>
                <span>{getYear(movie.release_date)}</span>
                <span>•</span>
                <span>{movie.runtime || 'N/A'} min</span>
                <span>•</span>
                <span>⭐ {movie.vote_average?.toFixed(1) || 'N/A'}</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>1,234 comments</span>
                  <span>•</span>
                  <span>Sort by</span>
                  <select className="bg-transparent text-gray-600 font-medium">
                    <option>Top comments</option>
                    <option>Newest first</option>
                  </select>
                </div>
                
                <p className="text-gray-800 leading-relaxed">
                  {movie.overview}
                </p>
                
                {/* Genres */}
                <div className="flex flex-wrap gap-2">
                  {movie.genres?.map((genre) => (
                    <span
                      key={genre.id}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      #{genre.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="space-y-4">
              {/* Comment Input */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xs">U</span>
                </div>
                <div className="flex-1">
                  <textarea
                    placeholder="Add a comment..."
                    className="w-full bg-transparent text-gray-900 placeholder-gray-500 border-b border-gray-300 pb-2 focus:outline-none focus:border-gray-900 resize-none"
                    rows={1}
                  />
                </div>
              </div>

              {/* Sample Comments */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs">M</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-gray-900 font-medium text-sm">MovieLover123</span>
                      <span className="text-gray-500 text-xs">2 hours ago</span>
                    </div>
                    <p className="text-gray-800 text-sm mb-2">
                      Amazing movie! The cinematography is absolutely stunning. Highly recommend watching this classic.
                    </p>
                    <div className="flex items-center space-x-4 text-gray-500 text-xs">
                      <button className="hover:text-gray-700 transition-colors">👍 12</button>
                      <button className="hover:text-gray-700 transition-colors">👎</button>
                      <button className="hover:text-gray-700 transition-colors">Reply</button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs">C</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-gray-900 font-medium text-sm">CinemaFan</span>
                      <span className="text-gray-500 text-xs">5 hours ago</span>
                    </div>
                    <p className="text-gray-800 text-sm mb-2">
                      One of the best movies I've watched this year. The story is engaging and the acting is top-notch!
                    </p>
                    <div className="flex items-center space-x-4 text-gray-500 text-xs">
                      <button className="hover:text-gray-700 transition-colors">👍 8</button>
                      <button className="hover:text-gray-700 transition-colors">👎</button>
                      <button className="hover:text-gray-700 transition-colors">Reply</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Recommended Movies (25%) */}
          <div className="w-full lg:w-1/4 space-y-4">
            {/* Filter Tabs */}
            <div className="flex items-center space-x-2 text-sm">
              <button className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full font-medium">All</button>
              <button className="text-gray-600 px-3 py-1 rounded-full hover:bg-gray-100 transition-colors">From movies123</button>
              <button className="text-gray-600 px-3 py-1 rounded-full hover:bg-gray-100 transition-colors">Related</button>
            </div>

            {/* Recommended Movies List */}
            <div className="space-y-3 max-h-screen overflow-y-auto">
              {similarMovies
                .filter((similarMovie) => similarMovie.imdb_id && similarMovie.imdb_id.trim() !== '')
                .slice(0, 8)
                .map((similarMovie, index) => (
                <Link
                  key={`${similarMovie.imdb_id}-${index}`}
                  href={generateMovieUrl(similarMovie.title, similarMovie.imdb_id || '')}
                  className="flex items-start space-x-3 group hover:bg-gray-50 p-2 rounded-lg transition-colors"
                >
                  <div className="relative w-32 h-20 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={similarMovie.poster_path ? `https://image.tmdb.org/t/p/w300${similarMovie.poster_path}` : '/placeholder.svg'}
                      alt={`${similarMovie.title} movie poster`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
                      {Math.floor(Math.random() * 60) + 90}m
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-gray-900 text-sm font-medium line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {similarMovie.title}
                    </h4>
                    <p className="text-gray-600 text-xs mt-1">movies123</p>
                    <p className="text-gray-500 text-xs">
                      {Math.floor(Math.random() * 1000) + 100}K views • {Math.floor(Math.random() * 30) + 1} days ago
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
