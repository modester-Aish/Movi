import { Metadata } from 'next';
import { getBaseUrlForBuild } from '@/lib/domain';

export const metadata: Metadata = {
  title: 'TV Series - Watch TV Shows Online',
  description: 'Browse and watch thousands of TV series online. Stream your favorite TV shows in HD quality.',
  alternates: {
    canonical: `${getBaseUrlForBuild()}/series`,
  },
  openGraph: {
    title: 'TV Series - Watch TV Shows Online',
    description: 'Browse and watch thousands of TV series online. Stream your favorite TV shows in HD quality.',
    url: `${getBaseUrlForBuild()}/series`,
    type: 'website',
  },
};

export default function SeriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}


