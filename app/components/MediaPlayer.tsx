"use client";

import { useState, useRef, useEffect } from 'react';

interface MediaPlayerProps {
  movieTitle: string;
  imdbId: string;
  className?: string;
}

export default function MediaPlayer({ movieTitle, imdbId, className = "" }: MediaPlayerProps) {
  const [activePlayer, setActivePlayer] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [playerError, setPlayerError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const playerUrls = [
    `https://vidsrc.me/embed/movie?imdb=${imdbId}`,
    `https://vidsrc.to/embed/movie/${imdbId}`,
    `https://vidsrc.xyz/embed/movie/${imdbId}`,
    `https://vidsrc.pro/embed/movie/${imdbId}`
  ];

  const getPlayerUrl = (playerNumber: number) => {
    return playerUrls[playerNumber - 1] || playerUrls[0];
  };

  const handlePlayerLoad = () => {
    setIsLoading(false);
    setPlayerError(false);
  };

  const handlePlayerError = () => {
    setIsLoading(false);
    setPlayerError(true);
  };

  const switchPlayer = (playerNumber: number) => {
    setActivePlayer(playerNumber);
    setIsLoading(true);
    setPlayerError(false);
  };

  useEffect(() => {
    // Reset loading state when player changes
    setIsLoading(true);
    setPlayerError(false);
  }, [activePlayer]);

  return (
    <div className={`bg-black rounded-lg overflow-hidden shadow-xl ${className}`}>
      {/* Player Header */}
      <div className="bg-gray-900 px-4 py-2 flex items-center justify-between">
        <h3 className="text-white font-semibold text-sm">
          {movieTitle} - Player {activePlayer}
        </h3>
        <div className="flex space-x-2">
          {playerUrls.map((_, index) => (
            <button
              key={index + 1}
              onClick={() => switchPlayer(index + 1)}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                activePlayer === index + 1
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Player {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Video Container */}
      <div className="relative pt-[56.25%] bg-gray-900">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-white text-sm">Loading Player {activePlayer}...</p>
            </div>
          </div>
        )}

        {playerError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center p-6">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <p className="text-white mb-4">Player {activePlayer} failed to load</p>
              <button
                onClick={() => switchPlayer(activePlayer === playerUrls.length ? 1 : activePlayer + 1)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors"
              >
                Try Next Player
              </button>
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          className="absolute top-0 left-0 w-full h-full"
          src={getPlayerUrl(activePlayer)}
          title={`${movieTitle} - Player ${activePlayer}`}
          frameBorder="0"
          referrerPolicy="origin"
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture"
          loading="lazy"
          onLoad={handlePlayerLoad}
          onError={handlePlayerError}
          style={{ display: isLoading || playerError ? 'none' : 'block' }}
        />
      </div>

      {/* Player Instructions */}
      <div className="bg-yellow-900/20 border-t border-yellow-500/30 p-4">
        <div className="flex items-start space-x-3">
          <div className="text-yellow-400 text-lg">💡</div>
          <div className="text-yellow-400 text-sm">
            <p className="font-semibold mb-1">How to Watch:</p>
            <ul className="space-y-1 text-xs">
              <li>• Click the play button multiple times if the movie doesn't start</li>
              <li>• Close any popup ads that appear</li>
              <li>• If buffering occurs, pause for 5-10 minutes then resume</li>
              <li>• Try different players if one doesn't work</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Player Stats */}
      <div className="bg-gray-800 px-4 py-2 text-xs text-gray-400">
        <div className="flex justify-between items-center">
          <span>Current Player: {activePlayer} of {playerUrls.length}</span>
          <span>IMDB: {imdbId}</span>
        </div>
      </div>
    </div>
  );
}
