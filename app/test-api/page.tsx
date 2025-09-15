"use client";

import { useState, useEffect } from "react";

export default function TestAPI() {
  const [apiTest, setApiTest] = useState<{
    status?: number;
    data?: {
      title?: string;
      poster_path?: string | null;
      backdrop_path?: string | null;
      [key: string]: unknown;
    };
    posterUrl?: string | null;
    backdropUrl?: string | null;
    error?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testAPI = async () => {
      try {
        // Test TMDB API directly
        const response = await fetch('https://api.themoviedb.org/3/movie/550?api_key=b31d2e5f33b74ffa7b3b483ff353f760');
        const data = await response.json();
        
        console.log('TMDB API Response:', data);
        setApiTest({
          status: response.status,
          data: data,
          posterUrl: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : null,
          backdropUrl: data.backdrop_path ? `https://image.tmdb.org/t/p/original${data.backdrop_path}` : null
        });
      } catch (error) {
        console.error('API Test Error:', error);
        setApiTest({ error: error instanceof Error ? error.message : 'Unknown error' });
      } finally {
        setLoading(false);
      }
    };

    testAPI();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Testing API...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-white text-3xl mb-8">TMDB API Test</h1>
      
      {apiTest?.error ? (
        <div className="bg-red-800 p-6 rounded-lg">
          <h2 className="text-white text-xl mb-4">API Error</h2>
          <p className="text-red-200">{apiTest.error}</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-white text-xl mb-4">API Response Status: {apiTest?.status}</h2>
            <div className="text-white space-y-2">
              <p><strong>Movie Title:</strong> {apiTest?.data?.title}</p>
              <p><strong>Poster Path:</strong> {apiTest?.data?.poster_path || 'null'}</p>
              <p><strong>Backdrop Path:</strong> {apiTest?.data?.backdrop_path || 'null'}</p>
              <p><strong>Poster URL:</strong> {apiTest?.posterUrl || 'null'}</p>
              <p><strong>Backdrop URL:</strong> {apiTest?.backdropUrl || 'null'}</p>
            </div>
          </div>

          {apiTest?.posterUrl && (
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-white text-lg mb-4">Test Poster Image:</h3>
              <img 
                src={apiTest.posterUrl} 
                alt="Test Poster" 
                className="w-48 h-72 object-cover border border-white"
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  console.log('Direct image load error:', e);
                  e.currentTarget.src = '/placeholder.svg';
                }}
                onLoad={() => console.log('Direct image loaded successfully')}
              />
            </div>
          )}

          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-white text-lg mb-4">Raw API Response:</h3>
            <pre className="bg-gray-700 p-4 rounded text-green-400 text-sm overflow-auto max-h-96">
              {JSON.stringify(apiTest, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
