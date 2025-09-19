import { generateGenrePageSEO, generateMovieMetadata } from "../../lib/seo";
import { getBaseUrl } from "../../lib/domain";

interface GenreLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: GenreLayoutProps) {
  const { slug } = await params;
  const genreName = slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  const seoConfig = generateGenrePageSEO(genreName, `${getBaseUrl()}/${slug}`);
  return generateMovieMetadata(seoConfig);
}

export default function GenreLayout({ children }: GenreLayoutProps) {
  return <>{children}</>;
}
