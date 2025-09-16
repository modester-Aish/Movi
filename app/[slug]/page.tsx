import { getMovieByImdbId, getSimilarMovies, getYear } from "../api/tmdb";
import type { Movie, MovieListItem } from "../api/tmdb";
import Link from "next/link";
import Image from "next/image";
import { generateMovieSEO, generateMovieMetadata } from "../lib/seo";
import { generateMovieUrl, extractImdbIdFromSlug, isValidMovieSlug } from "../lib/slug";
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

    const seoConfig = generateMovieSEO(movie, 'https://movies.n123movie.me');
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Movie Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Movie Poster */}
            <div className="lg:w-1/3">
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-xl">
                <Image
                  src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder.svg'}
                  alt={`${movie.title} movie poster`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Movie Info */}
            <div className="lg:w-2/3">
              <h1 className="text-4xl font-bold text-white mb-4">{movie.title}</h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-gray-400">{getYear(movie.release_date)}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-400">{movie.runtime || 'N/A'} min</span>
                <span className="text-gray-400">•</span>
                <div className="flex items-center">
                  <span className="text-yellow-400 mr-1">⭐</span>
                  <span className="text-white">{movie.vote_average?.toFixed(1) || 'N/A'}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres?.map((genre) => (
                  <span
                    key={genre.id}
                    className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                {movie.overview}
              </p>

              <div className="grid grid-cols-2 gap-4 text-gray-400 text-sm">
                {movie.original_language && (
                  <p><span className="text-white">Language:</span> {movie.original_language.toUpperCase()}</p>
                )}
                {movie.status && (
                  <p><span className="text-white">Status:</span> {movie.status}</p>
                )}
                {movie.budget && movie.budget > 0 && (
                  <p><span className="text-white">Budget:</span> ${movie.budget.toLocaleString()}</p>
                )}
                {movie.revenue && movie.revenue > 0 && (
                  <p><span className="text-white">Revenue:</span> ${movie.revenue.toLocaleString()}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Video Player */}
        <div className="mb-8">
          <div className="bg-black rounded-lg overflow-hidden shadow-xl">
            {/* Player Header */}
            <div className="bg-gray-900 px-4 py-2">
              <h3 className="text-white font-semibold text-sm">
                {movie.title} - VidSrc Player
              </h3>
            </div>

            {/* Video Container */}
            <div className="relative pt-[56.25%] bg-gray-900">
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

            {/* Player Instructions */}
            <div className="bg-yellow-900/20 border-t border-yellow-500/30 p-4">
              <div className="flex items-start space-x-3">
                <div className="text-yellow-400 text-lg">💡</div>
                <div className="text-yellow-400 text-sm">
                  <p className="font-semibold mb-1">How to Watch:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Close any popup ads that appear</li>
                    <li>• Click the play button to start the movie</li>
                    <li>• If buffering occurs, wait a moment then resume</li>
                    <li>• Use fullscreen for better viewing experience</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Download Links Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Download Links</h2>
          
          {/* Quality Sections */}
          {['720p', '480p', '360p'].map((quality) => (
            <div key={quality} className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">{quality} Quality Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {['PkSpeed', 'MixDrop', 'CloudVideo', 'Streamtape'].map((host) => (
                  <a
                    key={host}
                    href="#"
                    className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded-lg text-center transition-all duration-200 border border-gray-700 hover:border-purple-500"
                  >
                    <div className="font-medium">{host}</div>
                    <div className="text-sm text-gray-400">{quality}</div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Movie Details */}
        <div className="mb-12">
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Movie Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
              <div>
                <p><strong>Title:</strong> {movie.title}</p>
                <p><strong>Release Date:</strong> {movie.release_date}</p>
                <p><strong>Runtime:</strong> {movie.runtime || 'N/A'} minutes</p>
                <p><strong>Rating:</strong> {movie.vote_average?.toFixed(1) || 'N/A'}/10</p>
              </div>
              <div>
                <p><strong>Language:</strong> {movie.original_language?.toUpperCase() || 'N/A'}</p>
                <p><strong>Status:</strong> {movie.status || 'N/A'}</p>
                <p><strong>Budget:</strong> {movie.budget ? `$${movie.budget.toLocaleString()}` : 'N/A'}</p>
                <p><strong>Revenue:</strong> {movie.revenue ? `$${movie.revenue.toLocaleString()}` : 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Movies */}
        {similarMovies.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Similar Movies</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {similarMovies
                .filter((similarMovie) => similarMovie.imdb_id && similarMovie.imdb_id.trim() !== '')
                .slice(0, 12)
                .map((similarMovie, index) => (
                <Link
                  key={`${similarMovie.imdb_id}-${index}`}
                  href={generateMovieUrl(similarMovie.title, similarMovie.imdb_id || '')}
                  className="group block transition-all duration-300 hover:transform hover:scale-105"
                >
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300">
                    <Image
                      src={similarMovie.poster_path ? `https://image.tmdb.org/t/p/w500${similarMovie.poster_path}` : '/placeholder.svg'}
                      alt={`${similarMovie.title} movie poster`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-white font-semibold text-sm mb-1 truncate">{similarMovie.title}</h3>
                      <div className="flex items-center justify-between text-xs text-gray-300">
                        <span>{getYear(similarMovie.release_date)}</span>
                        <div className="flex items-center">
                          <span className="text-yellow-400">⭐</span>
                          <span className="ml-1">{similarMovie.vote_average?.toFixed(1) || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="text-center py-8 border-t border-gray-700">
          <p className="text-gray-400 text-sm">
            © 2024 movies123 - Watch Online Movies. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Disclaimer: All content is provided by third-party sources. We do not host any content.
          </p>
        </div>
      </div>
    </div>
  );
}
