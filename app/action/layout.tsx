import { generateGenrePageSEO, generateMovieMetadata } from "@/lib/seo";
import { getBaseUrl } from "@/lib/domain";

interface GenreLayoutProps {
  children: React.ReactNode;
}

export async function generateMetadata() {
  const genreName = "Action";
  
  const seoConfig = generateGenrePageSEO(genreName, `https://ww1.n123movie.me/action`);
  return generateMovieMetadata(seoConfig);
}

export default function GenreLayout({ children }: GenreLayoutProps) {
  return <>{children}</>;
}
