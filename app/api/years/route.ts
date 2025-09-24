import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Try to read from cache file first (faster)
    const cachePath = path.join(process.cwd(), 'scripts', 'years-cache.json');
    
    if (fs.existsSync(cachePath)) {
      const cacheData = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
      return NextResponse.json(cacheData);
    }
    
    // Fallback to progress file if cache doesn't exist
    const progressPath = path.join(process.cwd(), 'scripts', 'all-movies-progress.json');
    
    if (!fs.existsSync(progressPath)) {
      return NextResponse.json({
        years: [],
        decades: [],
        totalMovies: 95942,
        processedMovies: 0,
        foundMovies: 0,
        progress: '0.00',
        lastUpdate: new Date().toISOString(),
        yearStats: {},
        message: 'Movie processing has not started yet'
      });
    }

    // Read the progress file
    const progressData = JSON.parse(fs.readFileSync(progressPath, 'utf8'));
    
    // Extract years from yearStats
    const years = Object.keys(progressData.yearStats || {})
      .map(year => parseInt(year))
      .sort((a, b) => b - a); // Sort in descending order (newest first)

    // Create decades for better organization
    const decades = new Map();
    years.forEach(year => {
      const decade = Math.floor(year / 10) * 10;
      if (!decades.has(decade)) {
        decades.set(decade, []);
      }
      decades.get(decade).push(year);
    });

    // Format decades for frontend
    const decadesArray = Array.from(decades.entries())
      .sort((a, b) => b[0] - a[0]) // Sort decades in descending order
      .map(([decade, years]) => ({
        decade: `${decade}s`,
        years: years.sort((a, b) => b - a)
      }));

    return NextResponse.json({
      years: years,
      decades: decadesArray,
      totalMovies: 95942, // Total movies in bulk file
      processedMovies: progressData.processedCount || 0,
      foundMovies: progressData.foundCount || 0,
      progress: progressData.progress || '0.00',
      lastUpdate: progressData.lastUpdate,
      yearStats: progressData.yearStats || {}
    });

  } catch (error) {
    console.error('Error fetching years:', error);
    return NextResponse.json(
      { error: 'Failed to fetch years data' },
      { status: 500 }
    );
  }
}
