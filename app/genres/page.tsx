"use client";

import Link from "next/link";
import Head from "next/head";

export default function GenresPage() {
  const genres = [
    { name: "Action", slug: "action", count: "2,500+" },
    { name: "Comedy", slug: "comedy", count: "1,800+" },
    { name: "Drama", slug: "drama", count: "3,200+" },
    { name: "Horror", slug: "horror", count: "1,200+" },
    { name: "Sci-Fi", slug: "sci-fi", count: "900+" },
    { name: "Thriller", slug: "thriller", count: "1,500+" },
    { name: "Romance", slug: "romance", count: "1,100+" },
    { name: "Adventure", slug: "adventure", count: "1,300+" },
    { name: "Crime", slug: "crime", count: "1,400+" },
    { name: "Fantasy", slug: "fantasy", count: "800+" },
    { name: "Animation", slug: "animation", count: "600+" },
    { name: "Documentary", slug: "documentary", count: "700+" }
  ];

  return (
    <>
      <Head>
        <link rel="canonical" href="https://ww1.n123movie.me/genres" />
      </Head>
      <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-3xl font-bold text-white mb-8">Movie Genres</h1>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {genres.map((genre) => (
            <Link
              key={genre.slug}
              href={`/genre/${genre.slug}`}
              className="group bg-gray-800 hover:bg-gray-700 rounded-lg p-6 text-center transition-all duration-300 hover:scale-105"
            >
              <h3 className="text-white text-lg font-semibold mb-2 group-hover:text-green-400 transition-colors">
                {genre.name}
              </h3>
              <p className="text-gray-400 text-sm">
                {genre.count} movies
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
