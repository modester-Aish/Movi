"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import TVNavbar from "./TVNavbar";

export default function DynamicNavbar() {
  const pathname = usePathname();
  const [currentMode, setCurrentMode] = useState<'movies' | 'tv'>('movies');

  useEffect(() => {
    // Landing page should ALWAYS show movies navbar
    if (pathname === '/') {
      setCurrentMode('movies');
      localStorage.setItem('homepageMode', 'movies'); // Reset to movies on landing
    } 
    // Check if we're on /home and get mode from localStorage
    else if (pathname === '/home') {
      const savedMode = localStorage.getItem('homepageMode') as 'movies' | 'tv' | null;
      if (savedMode) {
        setCurrentMode(savedMode);
      } else {
        setCurrentMode('movies'); // Default to movies
      }
    } 
    // TV pages should show TV navbar (series, tv-genre, tv-year, episode pages)
    else if (pathname.startsWith('/series') || pathname.startsWith('/tv-genre') || pathname.startsWith('/tv-year') || pathname.startsWith('/episode') || pathname.startsWith('/tv-')) {
      setCurrentMode('tv');
    } 
    // Check if we're on a season page FIRST (format: /slug-123/season-1)
    // This must come before the series detail check
    else if (pathname.match(/^\/[^\/]+-\d+\/season-\d+$/)) {
      setCurrentMode('tv');
    }
    // Check if we're on a series detail page (format: /slug-123, NOT ending with tt1234567)
    // Movies end with tt1234567, TV series end with just numbers
    else if (pathname.match(/^\/[^\/]+-\d+$/) && !pathname.match(/tt\d{7,8}$/)) {
      setCurrentMode('tv');
    }
    // Movie pages end with IMDB ID (tt1234567)
    else if (pathname.match(/tt\d{7,8}$/)) {
      setCurrentMode('movies');
    }
    // All other pages show movies navbar
    else {
      setCurrentMode('movies');
    }
  }, [pathname]);

  // Listen for mode changes from homepage
  useEffect(() => {
    const handleModeChange = (event: CustomEvent) => {
      setCurrentMode(event.detail.mode);
      localStorage.setItem('homepageMode', event.detail.mode);
    };

    window.addEventListener('homepageModeChange', handleModeChange as EventListener);
    
    return () => {
      window.removeEventListener('homepageModeChange', handleModeChange as EventListener);
    };
  }, []);

  // Return appropriate navbar based on current mode
  return currentMode === 'tv' ? <TVNavbar /> : <Navbar />;
}
