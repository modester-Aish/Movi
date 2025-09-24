import { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://ww1.n123movie.me/bulk-movies',
  },
};

export default function BulkMoviesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
