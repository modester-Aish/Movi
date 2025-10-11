import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DynamicNavbar from "./components/DynamicNavbar";
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
  title: "123Movies - Watch Movies Online Free | HD Movie Streaming",
  description: "Watch thousands of movies online for free. Download HD movies, stream latest releases, and discover your favorite films. No registration required.",
  keywords: "watch movies online free, download movies HD, movie streaming, free movies online, HD movies, latest movies, movie downloads, online cinema, streaming movies, free movie site",
  authors: [{ name: "123Movies" }],
  creator: "123Movies",
  publisher: "123Movies",
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
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
    url: getBaseUrl(),
    siteName: '123Movies',
    title: '123Movies - Watch Movies Online Free | HD Movie Streaming',
    description: 'Watch thousands of movies online for free. Download HD movies, stream latest releases, and discover your favorite films. No registration required.',
  },
  twitter: {
    card: 'summary_large_image',
    title: '123Movies - Watch Movies Online Free | HD Movie Streaming',
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
      <head>
        <meta name="google-site-verification" content="lpmRdQ218vRv4F_8c0Pb6kE7fRS1y-EHP_94UH-avlQ" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <DynamicNavbar />
        {children}
      </body>
    </html>
  );
}
