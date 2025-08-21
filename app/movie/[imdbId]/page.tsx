"use client";

import Image from 'next/image';
import Link from 'next/link';
import { getMovieByImdbId, getImageUrl, getFullImageUrl, getYear, getSimilarMovies, getMovieVideos } from '@/app/api/tmdb';
import { useState, useEffect } from 'react';
import { use } from 'react';

type Props = {
  params: Promise<{
    imdbId: string;
  }>;
};

export default function MoviePage({ params: paramsPromise }: Props) {
  const params = use(paramsPromise) as { imdbId: string };
  const [movie, setMovie] = useState<any>(null);
  const [similarMovies, setSimilarMovies] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'watch' | 'download'>('watch');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!params.imdbId) return;
        
        const imdbId = params.imdbId;
        const movieData = await getMovieByImdbId(imdbId);
        
        if (!movieData) {
          setLoading(false);
          return;
        }
        
        setMovie(movieData);
        
        const similarMoviesData = await getSimilarMovies(movieData.id);
        setSimilarMovies(similarMoviesData);
        
        const videosData = await getMovieVideos(movieData.id);
        setVideos(videosData);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movie data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [params]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-400 text-lg">Loading movie...</p>
        </div>
      </div>
    );
  }
  
  if (!movie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <h1 className="text-2xl font-bold mb-4 text-white">Movie not found</h1>
          <Link href="/" className="text-blue-500 hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="inline-block mb-6 text-purple-400 hover:text-purple-300 transition-colors">
          &larr; Back to Home
        </Link>
        
        {/* Movie Header */}
        <div className="bg-gray-800 rounded-lg shadow-2xl overflow-hidden mb-8">
          <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]">
            <Image 
              src={movie.poster_path ? getFullImageUrl(movie.poster_path) : '/placeholder.jpg'}
              alt={movie.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end">
              <div className="p-8 w-full">
                <div className="max-w-4xl">
                  <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                    {movie.title} <span className="text-gray-300">({getYear(movie.release_date)})</span>
                  </h1>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {movie.genres.map((genre: any) => (
                      <span 
                        key={genre.id} 
                        className="px-3 py-1 bg-purple-600 text-white text-sm rounded-full"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">
                    {movie.overview}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('watch')}
              className={`flex-1 py-3 px-6 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'watch'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              🎬 Watch Movie
            </button>
            <button
              onClick={() => setActiveTab('download')}
              className={`flex-1 py-3 px-6 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'download'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              ⬇️ Download Links
            </button>
          </div>
        </div>
        
        {/* Content Based on Active Tab */}
        {activeTab === 'watch' && (
          <div className="bg-gray-800 rounded-lg shadow-2xl overflow-hidden mb-8">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Watch {movie.title} Online</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-400 text-lg">⭐</span>
                  <span className="text-white font-semibold">
                    {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                  </span>
                </div>
              </div>
              
              {/* Video Player */}
              <div className="relative pt-[56.25%] bg-black rounded-lg overflow-hidden shadow-xl mb-6">
                {params.imdbId ? (
                  <>
                    <iframe 
                      className="absolute top-0 left-0 w-full h-full"
                      src={`https://vidsrc.me/embed/movie?imdb=${params.imdbId}`}
                      title={`${movie?.title || 'Movie Player'}`}
                      frameBorder="0"
                      referrerPolicy="origin"
                      allowFullScreen
                      allow="autoplay; fullscreen; picture-in-picture"
                      loading="lazy"
                      onError={(e) => {
                        console.error('Iframe failed to load:', e);
                      }}
                    ></iframe>
                    
                  </>
                ) : (
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900">
                    <div className="text-center">
                      <div className="text-red-400 text-6xl mb-4">⚠️</div>
                      <p className="text-white text-lg">Movie ID not found</p>
                      <p className="text-gray-400 text-sm">IMDB ID: {params.imdbId}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Player Instructions */}
              <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 mb-6">
                <h3 className="text-purple-400 font-semibold mb-2">📺 How to Watch:</h3>
                <ul className="text-gray-300 space-y-1 text-sm">
                  <li>• Click the play button 2-3 times until the movie starts</li>
                  <li>• Close any popup ads that may appear</li>
                  <li>• If the movie buffers, pause for 5-10 minutes then continue</li>
                  <li>• For best experience, use a stable internet connection</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'download' && (
          <div className="bg-gray-800 rounded-lg shadow-2xl overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Download {movie.title}</h2>
              
              {/* Download Quality Options */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* PkSpeed Links */}
                <div className="bg-gray-700 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-sm mr-2">PkSpeed</span>
                    Download Links
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-green-400 font-medium mb-2">360p Quality</h4>
                      <div className="space-y-2">
                        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                          Click To Download (Link 1 PkSpeed 360p)
                        </button>
                        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                          Click To Download (Link 2 PkSpeed 360p)
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-blue-400 font-medium mb-2">720p Quality</h4>
                      <div className="space-y-2">
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                          Click To Download (Link 1 PkSpeed 720p)
                        </button>
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                          Click To Download (Link 2 PkSpeed 720p)
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* MixDrop Links */}
                <div className="bg-gray-700 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <span className="bg-purple-500 text-white px-2 py-1 rounded text-sm mr-2">MixDrop</span>
                    Download Links
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-green-400 font-medium mb-2">360p Quality</h4>
                      <div className="space-y-2">
                        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                          Click To Download (Link 1 MixDrop 360p)
                        </button>
                        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                          Click To Download (Link 2 MixDrop 360p)
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-blue-400 font-medium mb-2">720p Quality</h4>
                      <div className="space-y-2">
                        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                          Click To Download (Link 1 MixDrop 720p)
                        </button>
                        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                          Click To Download (Link 2 MixDrop 720p)
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Additional Download Options */}
              <div className="mt-6 grid md:grid-cols-2 gap-6">
                {/* CloudVideo Links */}
                <div className="bg-gray-700 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <span className="bg-orange-500 text-white px-2 py-1 rounded text-sm mr-2">CloudVideo</span>
                    Download Links
                  </h3>
                  <div className="space-y-2">
                    <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                      Click To Download (Link 1 ClVideo 360p)
                    </button>
                    <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                      Click To Download (Link 2 ClVideo 720p)
                    </button>
                  </div>
                </div>
                
                {/* Streamtape Links */}
                <div className="bg-gray-700 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <span className="bg-teal-500 text-white px-2 py-1 rounded text-sm mr-2">Streamtape</span>
                    Download Links
                  </h3>
                  <div className="space-y-2">
                    <button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                      Click To Download (Link 1 Streamtape 360p)
                    </button>
                    <button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                      Click To Download (Link 2 Streamtape 720p)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Similar Movies */}
        {similarMovies.length > 0 && (
          <div className="bg-gray-800 rounded-lg shadow-2xl overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Similar Movies</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {similarMovies.map((similar) => (
                  <Link 
                    href={`/movie/${similar.imdb_id}`} 
                    key={similar.id}
                    className="block transition-all duration-300 hover:transform hover:scale-105 group"
                  >
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg">
                      <Image 
                        src={similar.poster_path ? getImageUrl(similar.poster_path) : '/placeholder.jpg'}
                        alt={similar.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-white truncate group-hover:text-purple-400 transition-colors">
                      {similar.title}
                    </h3>
                    <p className="text-xs text-gray-400">{getYear(similar.release_date)}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Comments Section */}
        <div className="bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Comments & Reviews</h2>
            
            {/* Comment Form */}
            <form className="mb-8 bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Leave a Comment</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email (optional)
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-300 mb-2">
                  Your Comment
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Write your comment here..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
              >
                Post Comment
              </button>
            </form>
            
            {/* Sample Comments */}
            <div className="space-y-6">
              <div className="border-b border-gray-700 pb-6">
                <div className="flex items-center mb-3">
                  <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-lg font-bold text-white">
                    K
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-white">Khurram Shahzad</h4>
                    <p className="text-xs text-gray-400">August 1, 2025 at 11:02 pm</p>
                  </div>
                </div>
                <p className="text-gray-300">Great movie! I really enjoyed the storyline and the acting was superb. Highly recommended!</p>
              </div>
              
              <div className="border-b border-gray-700 pb-6">
                <div className="flex items-center mb-3">
                  <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center text-lg font-bold text-white">
                    A
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-white">Ali Hassan</h4>
                    <p className="text-xs text-gray-400">July 28, 2025 at 6:44 pm</p>
                  </div>
                </div>
                <p className="text-gray-300">The cinematography was amazing. I would definitely recommend watching this movie!</p>
              </div>
              
              <div className="border-b border-gray-700 pb-6">
                <div className="flex items-center mb-3">
                  <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center text-lg font-bold text-white">
                    M
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-white">Malik Waqas</h4>
                    <p className="text-xs text-gray-400">July 30, 2025 at 5:39 pm</p>
                  </div>
                </div>
                <p className="text-gray-300">Excellent movie with great action sequences. The plot was engaging from start to finish.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}