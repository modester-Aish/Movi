"use client";

import Image from "next/image";
import { getImageUrl, getFullImageUrl } from "../api/tmdb";

export default function TestImages() {

  const testPosterPath = '/kqjL17yufvn9OVLyXYpvtyrFfak.jpg'; // Known working poster path
  const testBackdropPath = '/hZkgoQYus5vegHoetLkCJzb17zJ.jpg'; // Known working backdrop path

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-white text-3xl mb-8">Image Test Page</h1>
      
      <div className="space-y-8">
        {/* Test 1: Direct TMDB URLs */}
        <div>
          <h2 className="text-white text-xl mb-4">Test 1: Direct TMDB URLs</h2>
          <div className="flex gap-4">
            <div>
              <p className="text-white mb-2">Poster (w500):</p>
              <Image
                src="https://image.tmdb.org/t/p/w500/kqjL17yufvn9OVLyXYpvtyrFfak.jpg"
                alt="Test Poster"
                width={200}
                height={300}
                className="border border-white"
              />
            </div>
            <div>
              <p className="text-white mb-2">Backdrop (original):</p>
              <Image
                src="https://image.tmdb.org/t/p/original/hZkgoQYus5vegHoetLkCJzb17zJ.jpg"
                alt="Test Backdrop"
                width={400}
                height={200}
                className="border border-white"
              />
            </div>
          </div>
        </div>

        {/* Test 2: Using our functions */}
        <div>
          <h2 className="text-white text-xl mb-4">Test 2: Using our functions</h2>
          <div className="flex gap-4">
            <div>
              <p className="text-white mb-2">Poster via getImageUrl:</p>
              <Image
                src={getImageUrl(testPosterPath)}
                alt="Test Poster"
                width={200}
                height={300}
                className="border border-white"
                onError={(e) => {
                  console.log('Poster image error:', e);
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
            </div>
            <div>
              <p className="text-white mb-2">Backdrop via getFullImageUrl:</p>
              <Image
                src={getFullImageUrl(testBackdropPath)}
                alt="Test Backdrop"
                width={400}
                height={200}
                className="border border-white"
                onError={(e) => {
                  console.log('Backdrop image error:', e);
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
            </div>
          </div>
        </div>

        {/* Test 3: Null/undefined handling */}
        <div>
          <h2 className="text-white text-xl mb-4">Test 3: Null/undefined handling</h2>
          <div className="flex gap-4">
            <div>
              <p className="text-white mb-2">Null poster path:</p>
              <Image
                src={getImageUrl(null)}
                alt="Null Poster"
                width={200}
                height={300}
                className="border border-white"
              />
            </div>
            <div>
              <p className="text-white mb-2">Undefined backdrop path:</p>
              <Image
                src={getFullImageUrl(undefined)}
                alt="Undefined Backdrop"
                width={400}
                height={200}
                className="border border-white"
              />
            </div>
          </div>
        </div>

        {/* Test 4: Placeholder */}
        <div>
          <h2 className="text-white text-xl mb-4">Test 4: Placeholder</h2>
          <Image
            src="/placeholder.svg"
            alt="Placeholder"
            width={200}
            height={300}
            className="border border-white"
          />
        </div>
      </div>
    </div>
  );
}
