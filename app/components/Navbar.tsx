"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import SearchModal from "./SearchModal";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [years, setYears] = useState<number[]>([]);
  const [decades, setDecades] = useState<Array<{decade: string, years: number[]}>>([]);
  const [progress, setProgress] = useState({processedMovies: 0, totalMovies: 95942, foundMovies: 0});
  const [isLoadingYears, setIsLoadingYears] = useState(true);

  // Fetch years data from API
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await fetch('/api/years');
        const data = await response.json();
        
        if (data.years) {
          setYears(data.years);
          setDecades(data.decades || []);
          setProgress({
            processedMovies: data.processedMovies || 0,
            totalMovies: data.totalMovies || 95942,
            foundMovies: data.foundMovies || 0
          });
        }
      } catch (error) {
        console.error('Error fetching years:', error);
        // Fallback to static years if API fails
        setYears([2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000]);
      } finally {
        setIsLoadingYears(false);
      }
    };

    fetchYears();
    
    // Auto-refresh every 30 seconds to get new years as they're processed
    const interval = setInterval(fetchYears, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="bg-black/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Left */}
          <div className="flex items-center">
            <Link href="/" className="flex flex-col">
              <div className="flex items-center">
                <span className="text-2xl md:text-3xl font-bold text-gray-800">123</span>
                <span className="text-lg md:text-2xl font-normal text-gray-500 ml-1">MOVIES</span>
                <div className="w-5 h-5 md:w-6 md:h-6 bg-green-600 rounded ml-2 flex items-center justify-center">
                  <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              <p className="text-gray-400 text-xs ml-1 hidden sm:block">Watch Your Favorite Movies Online</p>
            </Link>
          </div>
          
          {/* Navigation - Center */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/home" className="text-white hover:text-red-400 transition-colors font-medium">
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

            {/* Years Dropdown - Dynamic */}
            <div className="relative group">
              <button className="text-gray-300 hover:text-white transition-colors flex items-center">
                YEARS
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {isLoadingYears && (
                  <div className="ml-2 w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                )}
              </button>
              <div className="absolute top-full left-0 mt-2 w-96 bg-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-4">
                  {/* Progress indicator */}
                  {progress.processedMovies > 0 && (
                    <div className="mb-4 p-3 bg-gray-700 rounded-lg">
                      <div className="text-xs text-gray-300 mb-2">
                        Processing: {progress.processedMovies.toLocaleString()}/{progress.totalMovies.toLocaleString()} movies
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${(progress.processedMovies / progress.totalMovies) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-green-400 mt-1">
                        Found: {progress.foundMovies.toLocaleString()} movies with year data
                      </div>
                    </div>
                  )}
                  
                  {/* Years organized by decades */}
                  {decades.length > 0 ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {decades.map(({decade, years}) => (
                        <div key={decade}>
                          <h3 className="text-sm font-semibold text-gray-400 mb-2 border-b border-gray-600 pb-1">
                            {decade}
                          </h3>
                          <div className="grid grid-cols-5 gap-1">
                            {years.map(year => (
                              <Link 
                                key={year} 
                                href={`/year/${year}`} 
                                className="text-gray-300 hover:text-white transition-colors text-sm py-1 px-2 text-center rounded hover:bg-gray-700"
                              >
                                {year}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      {isLoadingYears ? (
                        <div className="text-gray-400">Loading years...</div>
                      ) : (
                        <div className="text-gray-400">
                          <div>No years found yet</div>
                          <div className="text-xs mt-1">Movie processing may not have started</div>
                        </div>
                      )}
                  </div>
                  )}
                </div>
              </div>
            </div>

            <Link href="/movies" className="text-gray-300 hover:text-white transition-colors">
              MOVIES
            </Link>
          </div>

          {/* Search Bar - Right (Hidden on mobile) */}
          <div className="hidden md:flex items-center space-x-3">
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
          </div>

          {/* Mobile menu button - Right */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none focus:text-white p-2"
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
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link 
              href="/home" 
              className="text-white hover:text-red-400 block px-3 py-2 rounded-md text-base font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/movies" 
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Movies
            </Link>
            <Link 
              href="/genres" 
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Genres
            </Link>
            <Link 
              href="/country" 
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Country
            </Link>
            <Link 
              href="/years" 
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Years
            </Link>
            <div className="pt-4 pb-3 border-t border-gray-700">
              <div className="px-3 py-2">
                <button
                  onClick={() => {
                    setIsSearchOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-gray-800 text-gray-400 rounded-lg px-3 py-2 text-left hover:bg-gray-700 transition-all cursor-pointer"
                >
                  Search movies or series...
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