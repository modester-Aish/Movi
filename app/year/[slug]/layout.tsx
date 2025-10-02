import { Metadata } from 'next';

interface YearLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: YearLayoutProps): Promise<Metadata> {
  const { slug } = await params;
  
  return {
    alternates: {
      canonical: `https://ww1.n123movie.me/year/${slug}`,
    },
  };
}

export default function YearLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
