import { Metadata } from "next";

export const metadata: Metadata = {
  title: '123Movies - Watch Movies & TV Shows Online Free',
  description: 'Watch thousands of movies and TV shows online for free. Stream the latest releases, classic films, and binge-worthy TV series in HD quality.',
  keywords: 'watch movies online free, watch TV shows online, HD streaming, free movies, TV series, latest movies, movie streaming',
  alternates: {
    canonical: 'https://ww1.n123movie.me/home',
  },
  openGraph: {
    title: '123Movies - Watch Movies & TV Shows Online Free',
    description: 'Watch thousands of movies and TV shows online for free. Stream the latest releases, classic films, and binge-worthy TV series in HD quality.',
    url: 'https://ww1.n123movie.me/home',
    type: 'website',
    siteName: '123Movies',
  },
  twitter: {
    card: 'summary_large_image',
    title: '123Movies - Watch Movies & TV Shows Online Free',
    description: 'Watch thousands of movies and TV shows online for free. Stream the latest releases, classic films, and binge-worthy TV series in HD quality.',
  },
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
