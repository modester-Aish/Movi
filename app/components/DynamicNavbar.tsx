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
    // TV pages should show TV navbar
    else if (pathname.startsWith('/series') || pathname.startsWith('/tv-genre') || pathname.startsWith('/tv-year') || pathname.startsWith('/episode')) {
      setCurrentMode('tv');
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
