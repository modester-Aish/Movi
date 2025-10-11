import { Metadata } from 'next';
import { getBaseUrlForBuild } from '@/lib/domain';

export const metadata: Metadata = {
  title: 'TV Episodes - Watch Episodes Online',
  description: 'Watch TV episodes online. Stream your favorite TV show episodes in HD quality.',
  alternates: {
    canonical: `${getBaseUrlForBuild()}/episode`,
  },
  openGraph: {
    title: 'TV Episodes - Watch Episodes Online',
    description: 'Watch TV episodes online. Stream your favorite TV show episodes in HD quality.',
    url: `${getBaseUrlForBuild()}/episode`,
    type: 'website',
  },
};

export default function EpisodeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}


