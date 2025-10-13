import Link from 'next/link';
import Image from 'next/image';

interface RelatedMovie {
  imdb_id: string;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
}

interface RelatedContentProps {
  movies: RelatedMovie[];
  title: string;
  baseUrl: string;
}

export default function RelatedContent({ movies, title, baseUrl }: RelatedContentProps) {
  if (movies.length === 0) return null;

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {movies.slice(0, 12).map((movie, index) => (
          <Link
            key={`${movie.imdb_id}-${index}`}
            href={`${baseUrl}/${movie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}-${movie.imdb_id}`}
            className="group relative"
          >
            <div className="relative aspect-[2/3] bg-gray-700 rounded overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300">
              <Image
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : '/placeholder.svg'}
                alt={`${movie.title} movie poster`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
              />
              
              {movie.vote_average > 0 && (
                <div className="absolute top-1 right-1 bg-yellow-500 text-black text-xs font-bold px-1 py-0.5 rounded">
                  {movie.vote_average.toFixed(1)}
                </div>
              )}

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 hover:scale-110 transition-all duration-200">
                  <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <h3 className="text-white text-xs mt-1 line-clamp-1 group-hover:text-green-400 transition-colors">
              {movie.title}
            </h3>
            <p className="text-gray-400 text-xs">
              {new Date(movie.release_date).getFullYear()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
