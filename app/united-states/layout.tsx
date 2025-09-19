import { generateCountryPageSEO, generateMovieMetadata } from "@/lib/seo";
import { getBaseUrl } from "@/lib/domain";

interface CountryLayoutProps {
  children: React.ReactNode;
}

export async function generateMetadata() {
  const countryName = "United States";
  
  const seoConfig = generateCountryPageSEO(countryName, `${getBaseUrl()}/united-states`);
  return generateMovieMetadata(seoConfig);
}

export default function CountryLayout({ children }: CountryLayoutProps) {
  return <>{children}</>;
}
