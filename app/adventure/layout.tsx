import { generateGenrePageSEO, generateMovieMetadata } from "@/lib/seo";
import { getBaseUrl } from "@/lib/domain";

interface GenreLayoutProps {
  children: React.ReactNode;
}

export async function generateMetadata() {
  const genreName = "Adventure";
  
  const seoConfig = generateGenrePageSEO(genreName, `${getBaseUrl()}/adventure`);
  return generateMovieMetadata(seoConfig);
}

export default function GenreLayout({ children }: GenreLayoutProps) {
  return <>{children}</>;
}
