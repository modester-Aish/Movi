import { generateCountryPageSEO, generateMovieMetadata } from "../../lib/seo";

interface CountryLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: CountryLayoutProps) {
  const { slug } = await params;
  const countryName = slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  const seoConfig = generateCountryPageSEO(countryName, `https://ww1.n123movie.me/country/${slug}`);
  return generateMovieMetadata(seoConfig);
}

export default function CountryLayout({ children }: CountryLayoutProps) {
  return <>{children}</>;
}
