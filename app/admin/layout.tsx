import { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://ww1.n123movie.me/admin',
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
