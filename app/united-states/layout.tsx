import { generateCountryPageSEO } from "../../lib/seo";

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
  
  return generateCountryPageSEO(countryName, `https://movies.n123movie.me/country/${slug}`);
}

export default function CountryLayout({ children }: CountryLayoutProps) {
  return <>{children}</>;
}
