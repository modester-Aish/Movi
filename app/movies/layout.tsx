import { generateMoviesPageSEO } from "../lib/seo";

export const metadata = generateMoviesPageSEO('https://ww1.n123movie.me/movies');

export default function MoviesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
