import { Metadata } from 'next';

interface TVYearLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: TVYearLayoutProps): Promise<Metadata> {
  const { slug } = await params;
  
  return {
    alternates: {
      canonical: `https://ww1.n123movie.me/tv-year/${slug}`,
    },
  };
}

export default function TVYearLayout({ children }: TVYearLayoutProps) {
  return children;
}
