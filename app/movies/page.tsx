"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getMoviesByImdbIds } from "@/api/tmdb";
import { BULK_MOVIE_IDS } from "@/data/bulkMovieIds";
import type { Movie } from "@/api/tmdb";
import { generateMovieUrl } from "@/lib/slug";
import Head from "next/head";

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    setLoading(true);
    try {
      // Load first 100 movies from the main movies section
      const movieIds = BULK_MOVIE_IDS.slice(10600, 10700); // Start from index 10600
      const moviesData = await getMoviesByImdbIds(movieIds);
      setMovies(moviesData);
    } catch (error) {
      console.error('Error loading movies:', error);
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>All Movies - Watch Free HD Movies Online | 123Movies</title>
        <meta name="description" content="Browse thousands of free HD movies online. Watch latest movies, classic films, and popular titles without registration. Stream movies in HD quality for free." />
        <meta name="keywords" content="all movies, watch movies online free, HD movies streaming, free movies list, latest movies online, popular movies, classic movies, movie collection, stream movies free, fmovies, putlocker, moviesflix, watch free movies online free, free movie streaming, best free movie sites, movie streaming websites, free movies no registration, HD movie streaming free, latest movies free online, new movies streaming, movie download free, watch movies HD free, streaming movies online, free movie websites, movie streaming platform, watch latest movies free, free movie site, movie streaming service, online movies free, watch movies online HD, free movie streaming sites, movie streaming free, watch free HD movies, online movie streaming free, free movies streaming, movie streaming website, watch movies free online free, free movie streaming platform, HD movies online free, streaming free movies, movie streaming sites free, watch movies online free HD, free movie streaming website, movie streaming free online, watch movies free streaming, free movies online streaming, movie streaming sites HD, watch free movies online HD, free movie streaming service, online movie streaming sites, free movies streaming sites, movie streaming platform free, watch movies free online streaming, free HD movie streaming, movie streaming websites free, watch free movies streaming, free movie streaming sites HD, online movies streaming free, movie streaming free sites, watch movies online streaming free, free movie streaming websites, movie streaming sites online, watch free movies online streaming, free movies streaming website, movie streaming platform online, watch movies streaming free, free movie streaming sites online, online movie streaming free sites, movie streaming free website, watch movies free online sites, free movie streaming platform HD, movie streaming sites free HD, watch free movies streaming HD, free movie streaming website HD, online movie streaming free HD, movie streaming free sites HD, watch movies online streaming free HD, free movie streaming websites HD, movie streaming sites online HD, watch free movies online streaming HD, free movies streaming website HD, movie streaming platform online HD, watch movies streaming free HD, free movie streaming sites online HD, online movie streaming free sites HD, movie streaming free website HD, watch movies free online sites HD, free movie streaming platform online HD, movie streaming sites free online HD, watch free movies streaming online HD, free movie streaming website online HD, online movie streaming free online HD, movie streaming free sites online HD, watch movies online streaming free online HD, free movie streaming websites online HD, movie streaming sites online online HD, watch free movies online streaming online HD, free movies streaming website online HD, movie streaming platform online online HD, watch movies streaming free online HD, free movie streaming sites online online HD, online movie streaming free sites online HD, movie streaming free website online HD, watch movies free online sites online HD, free movie streaming platform online online HD" />
        <meta property="og:title" content="All Movies - Watch Free HD Movies Online" />
        <meta property="og:description" content="Browse thousands of free HD movies online. Watch latest movies, classic films, and popular titles without registration." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="All Movies - Watch Free HD Movies Online" />
        <meta name="twitter:description" content="Browse thousands of free HD movies online. Watch latest movies, classic films, and popular titles without registration." />
        <link rel="canonical" href="https://ww1.n123movie.me/movies" />
      </Head>
      <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-3xl font-bold text-white mb-8">All Movies</h1>
        
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-3">
            {Array.from({ length: 80 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-gray-800 rounded animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-3">
            {movies.map((movie, index) => (
              <Link
                key={`${movie.imdb_id}-${index}`}
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
                  
                  <div className="absolute top-0.5 right-0.5 bg-yellow-500 text-black text-xs font-bold px-1 py-0.5 rounded">
                    HD
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 hover:scale-110 transition-all duration-200">
                      <svg className="w-3 h-3 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-white text-xs mt-1 line-clamp-1 group-hover:text-green-400 transition-colors">
                  {movie.title}
                </h3>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
