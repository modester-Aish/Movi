import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { getBaseUrl } from "./lib/domain";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "movies123 - Watch Movies Online Free | HD Movie Streaming",
  description: "Watch thousands of movies online for free. Download HD movies, stream latest releases, and discover your favorite films. No registration required.",
  keywords: "watch movies online free, download movies HD, movie streaming, free movies online, HD movies, latest movies, movie downloads, online cinema, streaming movies, free movie site",
  authors: [{ name: "movies123" }],
  creator: "movies123",
  publisher: "movies123",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ww1.n123movie.me',
    siteName: 'movies123',
    title: 'movies123 - Watch Movies Online Free | HD Movie Streaming',
    description: 'Watch thousands of movies online for free. Download HD movies, stream latest releases, and discover your favorite films. No registration required.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'movies123 - Watch Movies Online Free | HD Movie Streaming',
    description: 'Watch thousands of movies online for free. Download HD movies, stream latest releases, and discover your favorite films. No registration required.',
  },
  alternates: {
    canonical: 'https://ww1.n123movie.me',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
