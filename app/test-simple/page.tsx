"use client";

import Image from "next/image";
import { getImageUrl, getFullImageUrl, getImageUrlWithFallback } from "../api/tmdb";

export default function TestSimple() {
  // Test with a known working image
  const testPosterPath = "/kqjL17yufvn9OVLyXYpvtyrFfak.jpg"; // Fight Club poster
  const testBackdropPath = "/hZkgoQYus5vegHoetLkCJzb17zJ.jpg"; // Fight Club backdrop

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-white text-3xl mb-8">Simple Image Test</h1>
      
      <div className="space-y-8">
        {/* Test 1: Direct Next.js Image with TMDB URL */}
        <div>
          <h2 className="text-white text-xl mb-4">Test 1: Direct TMDB URL</h2>
          <div className="flex gap-4">
            <div>
              <p className="text-white mb-2">Poster (w500):</p>
              <Image
                src="https://image.tmdb.org/t/p/w500/kqjL17yufvn9OVLyXYpvtyrFfak.jpg"
                alt="Fight Club Poster"
                width={200}
                height={300}
                className="border border-white"
                onError={(e) => {
                  console.log('Direct image error:', e);
                }}
                onLoad={() => console.log('Direct image loaded successfully')}
              />
            </div>
            <div>
              <p className="text-white mb-2">Backdrop (original):</p>
              <Image
                src="https://image.tmdb.org/t/p/original/hZkgoQYus5vegHoetLkCJzb17zJ.jpg"
                alt="Fight Club Backdrop"
                width={400}
                height={200}
                className="border border-white"
                onError={(e) => {
                  console.log('Direct backdrop error:', e);
                }}
                onLoad={() => console.log('Direct backdrop loaded successfully')}
              />
            </div>
          </div>
        </div>

        {/* Test 2: Using our functions */}
        <div>
          <h2 className="text-white text-xl mb-4">Test 2: Using our functions</h2>
          <div className="flex gap-4">
            <div>
              <p className="text-white mb-2">getImageUrl:</p>
              <Image
                src={getImageUrl(testPosterPath)}
                alt="Fight Club Poster"
                width={200}
                height={300}
                className="border border-white"
                onError={(e) => {
                  console.log('getImageUrl error:', e);
                }}
                onLoad={() => console.log('getImageUrl loaded successfully')}
              />
            </div>
            <div>
              <p className="text-white mb-2">getFullImageUrl:</p>
              <Image
                src={getFullImageUrl(testBackdropPath)}
                alt="Fight Club Backdrop"
                width={400}
                height={200}
                className="border border-white"
                onError={(e) => {
                  console.log('getFullImageUrl error:', e);
                }}
                onLoad={() => console.log('getFullImageUrl loaded successfully')}
              />
            </div>
            <div>
              <p className="text-white mb-2">getImageUrlWithFallback:</p>
              <Image
                src={getImageUrlWithFallback(testPosterPath)}
                alt="Fight Club Poster"
                width={200}
                height={300}
                className="border border-white"
                onError={(e) => {
                  console.log('getImageUrlWithFallback error:', e);
                }}
                onLoad={() => console.log('getImageUrlWithFallback loaded successfully')}
              />
            </div>
          </div>
        </div>

        {/* Test 3: Null/undefined handling */}
        <div>
          <h2 className="text-white text-xl mb-4">Test 3: Null/undefined handling</h2>
          <div className="flex gap-4">
            <div>
              <p className="text-white mb-2">Null path:</p>
              <Image
                src={getImageUrlWithFallback(null)}
                alt="Null Poster"
                width={200}
                height={300}
                className="border border-white"
              />
            </div>
            <div>
              <p className="text-white mb-2">Empty string:</p>
              <Image
                src={getImageUrlWithFallback("")}
                alt="Empty Poster"
                width={200}
                height={300}
                className="border border-white"
              />
            </div>
            <div>
              <p className="text-white mb-2">Placeholder:</p>
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
      </div>
    </div>
  );
}
