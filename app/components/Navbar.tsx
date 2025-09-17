"use client";

import Link from "next/link";
import { useState } from "react";
import SearchModal from "./SearchModal";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="bg-black/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Left */}
          <div className="flex items-center">
            <Link href="/" className="flex flex-col">
              <div className="flex items-center">
                <span className="text-3xl font-bold text-gray-800">123</span>
                <span className="text-2xl font-normal text-gray-500 ml-1">MOVIES</span>
                <div className="w-6 h-6 bg-green-600 rounded ml-2 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              <p className="text-gray-400 text-xs ml-1">Watch Your Favorite Movies Online</p>
            </Link>
          </div>
          
          {/* Navigation - Center */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link href="/" className="text-white hover:text-red-400 transition-colors font-medium">
              HOME
              </Link>
            
            {/* Genres Dropdown */}
            <div className="relative group">
              <button className="text-gray-300 hover:text-white transition-colors flex items-center">
                GENRES
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-96 bg-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Link href="/genre/action" className="block text-gray-300 hover:text-white transition-colors text-sm">Action</Link>
                      <Link href="/genre/action-adventure" className="block text-gray-300 hover:text-white transition-colors text-sm">Action & Adventure</Link>
                      <Link href="/genre/adventure" className="block text-gray-300 hover:text-white transition-colors text-sm">Adventure</Link>
                      <Link href="/genre/animation" className="block text-gray-300 hover:text-white transition-colors text-sm">Animation</Link>
                      <Link href="/genre/biography" className="block text-gray-300 hover:text-white transition-colors text-sm">Biography</Link>
                      <Link href="/genre/comedy" className="block text-gray-300 hover:text-white transition-colors text-sm">Comedy</Link>
                      <Link href="/genre/costume" className="block text-gray-300 hover:text-white transition-colors text-sm">Costume</Link>
                      <Link href="/genre/crime" className="block text-gray-300 hover:text-white transition-colors text-sm">Crime</Link>
                      <Link href="/genre/documentary" className="block text-gray-300 hover:text-white transition-colors text-sm">Documentary</Link>
                      <Link href="/genre/drama" className="block text-gray-300 hover:text-white transition-colors text-sm">Drama</Link>
                    </div>
                    <div className="space-y-2">
                      <Link href="/genre/family" className="block text-gray-300 hover:text-white transition-colors text-sm">Family</Link>
                      <Link href="/genre/fantasy" className="block text-gray-300 hover:text-white transition-colors text-sm">Fantasy</Link>
                      <Link href="/genre/film-noir" className="block text-gray-300 hover:text-white transition-colors text-sm">Film-Noir</Link>
                      <Link href="/genre/game-show" className="block text-gray-300 hover:text-white transition-colors text-sm">Game-Show</Link>
                      <Link href="/genre/history" className="block text-gray-300 hover:text-white transition-colors text-sm">History</Link>
                      <Link href="/genre/horror" className="block text-gray-300 hover:text-white transition-colors text-sm">Horror</Link>
                      <Link href="/genre/romance" className="block text-gray-300 hover:text-white transition-colors text-sm">Romance</Link>
                      <Link href="/genre/kungfu" className="block text-gray-300 hover:text-white transition-colors text-sm">Kungfu</Link>
                      <Link href="/genre/music" className="block text-gray-300 hover:text-white transition-colors text-sm">Music</Link>
                      <Link href="/genre/musical" className="block text-gray-300 hover:text-white transition-colors text-sm">Musical</Link>
                    </div>
                    <div className="space-y-2">
                      <Link href="/genre/mystery" className="block text-gray-300 hover:text-white transition-colors text-sm">Mystery</Link>
                      <Link href="/genre/mythological" className="block text-gray-300 hover:text-white transition-colors text-sm">Mythological</Link>
                      <Link href="/genre/news" className="block text-gray-300 hover:text-white transition-colors text-sm">News</Link>
                      <Link href="/genre/psychological" className="block text-gray-300 hover:text-white transition-colors text-sm">Psychological</Link>
                      <Link href="/genre/reality" className="block text-gray-300 hover:text-white transition-colors text-sm">Reality</Link>
                      <Link href="/genre/reality-tv" className="block text-gray-300 hover:text-white transition-colors text-sm">Reality-TV</Link>
                      <Link href="/genre/sci-fi" className="block text-gray-300 hover:text-white transition-colors text-sm">Sci-Fi</Link>
                      <Link href="/genre/sci-fi-fantasy" className="block text-gray-300 hover:text-white transition-colors text-sm">Sci-Fi & Fantasy</Link>
                      <Link href="/genre/science-fiction" className="block text-gray-300 hover:text-white transition-colors text-sm">Science Fiction</Link>
                      <Link href="/genre/short" className="block text-gray-300 hover:text-white transition-colors text-sm">Short</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Country Dropdown */}
            <div className="relative group">
              <button className="text-gray-300 hover:text-white transition-colors flex items-center">
                COUNTRY
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Link href="/country/united-states" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm py-1">
                        <span className="text-lg">🇺🇸</span>
                        <span>United States</span>
                      </Link>
                      <Link href="/country/united-kingdom" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm py-1">
                        <span className="text-lg">🇬🇧</span>
                        <span>United Kingdom</span>
                      </Link>
                      <Link href="/country/canada" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm py-1">
                        <span className="text-lg">🇨🇦</span>
                        <span>Canada</span>
                      </Link>
                      <Link href="/country/estonia" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm py-1">
                        <span className="text-lg">🇪🇪</span>
                        <span>Estonia</span>
                      </Link>
                    </div>
                    <div className="space-y-2">
                      <Link href="/country/france" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm py-1">
                        <span className="text-lg">🇫🇷</span>
                        <span>France</span>
                      </Link>
                      <Link href="/country/georgia" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm py-1">
                        <span className="text-lg">🇬🇪</span>
                        <span>Georgia</span>
                      </Link>
                      <Link href="/country/bulgaria" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm py-1">
                        <span className="text-lg">🇧🇬</span>
                        <span>Bulgaria</span>
                      </Link>
                      <Link href="/country/brazil" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm py-1">
                        <span className="text-lg">🇧🇷</span>
                        <span>Brazil</span>
                      </Link>
                    </div>
                    <div className="space-y-2">
                      <Link href="/country/china" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm py-1">
                        <span className="text-lg">🇨🇳</span>
                        <span>China</span>
                      </Link>
                      <Link href="/country/peru" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm py-1">
                        <span className="text-lg">🇵🇪</span>
                        <span>Peru</span>
                      </Link>
                      <Link href="/country/ireland" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm py-1">
                        <span className="text-lg">🇮🇪</span>
                        <span>Ireland</span>
                      </Link>
                      <Link href="/country/spain" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm py-1">
                        <span className="text-lg">🇪🇸</span>
                        <span>Spain</span>
                      </Link>
                      <Link href="/country/sweden" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm py-1">
                        <span className="text-lg">🇸🇪</span>
                        <span>Sweden</span>
                      </Link>
                      <Link href="/country/philippines" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm py-1">
                        <span className="text-lg">🇵🇭</span>
                        <span>Philippines</span>
                      </Link>
                      <Link href="/country/cyprus" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm py-1">
                        <span className="text-lg">🇨🇾</span>
                        <span>Cyprus</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Link href="/movies" className="text-gray-300 hover:text-white transition-colors">
              MOVIES
            </Link>
          </div>

          {/* Search Bar and Filter - Right */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search movies or series"
                className="bg-gray-800 text-white px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-700 focus:outline-none focus:border-green-500 w-64 cursor-pointer"
                onClick={() => setIsSearchOpen(true)}
                readOnly
              />
              <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
              FILTER
            </button>
          </div>

          {/* Mobile menu button - Right */}
          <div className="md:hidden absolute right-0">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none focus:text-white"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="text-white hover:text-red-400 block px-3 py-2 rounded-md text-base font-medium">
              Home
            </Link>
            <Link href="/movies" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              Movies
            </Link>
            <Link href="/genres" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              Genres
            </Link>
            <Link href="/country" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              Country
            </Link>
            <div className="pt-4 pb-3 border-t border-gray-700">
              <div className="px-3 py-2">
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="w-full bg-gray-800 text-gray-400 rounded-lg px-3 py-2 text-left hover:bg-gray-700 transition-all cursor-pointer"
                >
                  Search...
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </nav>
  );
}