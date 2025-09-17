import { generateMoviesPageSEO } from "../lib/seo";

export const metadata = generateMoviesPageSEO('https://movies.n123movie.me/movies');

export default function MoviesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
