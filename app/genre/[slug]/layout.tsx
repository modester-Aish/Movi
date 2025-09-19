import { generateGenrePageSEO, generateMovieMetadata } from "../../lib/seo";

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
  
  const seoConfig = generateGenrePageSEO(genreName, `https://ww1.n123movie.me/genre/${slug}`);
  return generateMovieMetadata(seoConfig);
}

export default function GenreLayout({ children }: GenreLayoutProps) {
  return <>{children}</>;
}
