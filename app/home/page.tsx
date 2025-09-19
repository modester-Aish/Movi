"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getMoviesByImdbIds } from "@/api/tmdb";
import { BULK_MOVIE_IDS } from "@/data/bulkMovieIds";
import type { Movie } from "@/api/tmdb";
import { generateMovieUrl } from "@/lib/slug";

export default function HomePage() {
  const [categories, setCategories] = useState<{[key: string]: Movie[]}>({});
  const [loading, setLoading] = useState(true);

  const categoryConfig = [
    { name: "Suggestions", startIndex: 0, count: 20 },
    { name: "Latest Movies", startIndex: 100, count: 20 },
    { name: "Trending Now", startIndex: 200, count: 20 },
    { name: "Top Rated", startIndex: 300, count: 20 },
    { name: "Action Movies", startIndex: 400, count: 20 }
  ];

  useEffect(() => {
    loadAllCategories();
  }, []);

  const loadAllCategories = async () => {
    setLoading(true);
    try {
      const categoriesData: {[key: string]: Movie[]} = {};
      
      for (const category of categoryConfig) {
        const movieIds = BULK_MOVIE_IDS.slice(category.startIndex, category.startIndex + category.count);
        const moviesData = await getMoviesByImdbIds(movieIds);
        categoriesData[category.name] = moviesData;
      }
      
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900">

      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-gray-900 to-black overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://image.tmdb.org/t/p/original/1XDDXPXGiI8id7MrUxK36ke7gkX.jpg"
            alt="Featured Movie"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Watch Movies Online
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Discover thousands of movies and TV shows. Stream in HD quality for free.
            </p>
            <div className="flex space-x-4">
              <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                Watch Now
              </button>
              <button className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                Browse Movies
              </button>
            </div>
          </div>
        </div>

        {/* Slider Dots */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {[1, 2, 3, 4, 5].map((dot) => (
            <div key={dot} className="w-2 h-2 bg-white rounded-full opacity-50"></div>
          ))}
        </div>
      </section>

      {/* Support Message */}
      <div className="bg-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-300">Like and Share our website to support us.</p>
        </div>
      </div>

      {/* Ad Banner */}
      <div className="bg-blue-900 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white">
            Ads can be a pain, but they are our only way to maintain the server. Your patience is highly appreciated and we hope our service can be worth it.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {categoryConfig.map((category, categoryIndex) => (
          <div key={category.name} className="mb-8">
            {/* Category Header */}
            <div className="flex items-center mb-6">
              <button className="bg-green-600 text-white px-6 py-2 rounded font-semibold text-lg">
                {category.name}
              </button>
            </div>
            
            {/* Movies Grid - 8 per line, 2 lines (16 total) */}
            {loading ? (
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="aspect-[2/3] bg-gray-800 rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {categories[category.name]?.map((movie, index) => (
                  <Link
                    key={`${movie.imdb_id}-${categoryIndex}-${index}`}
                    href={generateMovieUrl(movie.title, movie.imdb_id)}
                    className="group relative"
                  >
                    <div className="relative aspect-[2/3] bg-gray-800 rounded overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300">
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                      
                      {/* HD Badge */}
                      <div className="absolute top-0.5 right-0.5 bg-yellow-500 text-black text-xs font-bold px-1 py-0.5 rounded">
                        HD
                      </div>

                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 hover:scale-110 transition-all duration-200">
                          <svg className="w-3 h-3 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    {/* Title below poster */}
                    <h3 className="text-white text-xs mt-1 line-clamp-1 group-hover:text-green-400 transition-colors">
                      {movie.title}
                    </h3>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="bg-black text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="text-3xl font-bold text-gray-800">123</span>
                <span className="text-2xl font-normal text-gray-500 ml-1">MOVIES</span>
                <div className="w-6 h-6 bg-green-600 rounded ml-2 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Watch your favorite movies and TV shows online for free. 
                High quality streaming with no registration required.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">Home</Link></li>
                <li><Link href="/movies" className="text-gray-400 hover:text-white transition-colors text-sm">All Movies</Link></li>
                <li><Link href="/genres" className="text-gray-400 hover:text-white transition-colors text-sm">Genres</Link></li>
                <li><Link href="/country" className="text-gray-400 hover:text-white transition-colors text-sm">Countries</Link></li>
                <li><Link href="/search" className="text-gray-400 hover:text-white transition-colors text-sm">Search</Link></li>
              </ul>
            </div>

            {/* Popular Genres */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Popular Genres</h3>
              <ul className="space-y-2">
                <li><Link href="/genre/action" className="text-gray-400 hover:text-white transition-colors text-sm">Action</Link></li>
                <li><Link href="/genre/comedy" className="text-gray-400 hover:text-white transition-colors text-sm">Comedy</Link></li>
                <li><Link href="/genre/drama" className="text-gray-400 hover:text-white transition-colors text-sm">Drama</Link></li>
                <li><Link href="/genre/horror" className="text-gray-400 hover:text-white transition-colors text-sm">Horror</Link></li>
                <li><Link href="/genre/romance" className="text-gray-400 hover:text-white transition-colors text-sm">Romance</Link></li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 mt-8 pt-8">
            <div className="text-center">
              <div className="text-gray-500 text-sm">
                Made with ❤️ for movie lovers
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
