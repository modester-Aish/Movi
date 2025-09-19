import { generateCountryPageSEO, generateMovieMetadata } from "../../lib/seo";
import { getBaseUrl } from "../../lib/domain";

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
  
  const seoConfig = generateCountryPageSEO(countryName, `${getBaseUrl()}/${slug}`);
  return generateMovieMetadata(seoConfig);
}

export default function CountryLayout({ children }: CountryLayoutProps) {
  return <>{children}</>;
}
