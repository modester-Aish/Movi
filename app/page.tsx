import SimpleLandingPage from "./components/SimpleLandingPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://ww1.n123movie.me',
  },
};

export default function Home() {
  return <SimpleLandingPage />;
}