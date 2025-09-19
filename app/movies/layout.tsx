import { generateMoviesPageSEO } from "../lib/seo";

export const metadata = generateMoviesPageSEO();

export default function MoviesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
