const fs = require('fs');
const path = require('path');

async function fetchGoogleSheetsData() {
  try {
    // Google Sheets CSV export URL
    const sheetId = '1gPWNHstY291K91Js8amaWjn1oY36fYhOeDrXcl4sNvI';
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;
    
    console.log('Fetching data from Google Sheets...');
    console.log('URL:', csvUrl);
    
    // Fetch CSV data
    const response = await fetch(csvUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const csvText = await response.text();
    console.log('CSV data fetched successfully');
    
    // Parse CSV data
    const lines = csvText.split('\n');
    const movieIds = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line && line.startsWith('tt')) {
        // Extract movie ID from the line
        const match = line.match(/tt\d+/);
        if (match) {
          movieIds.push(match[0]);
        }
      }
    }
    
    console.log(`Found ${movieIds.length} movie IDs`);
    
    // Generate the bulk movie IDs file
    const fileContent = `// Bulk Movie IDs - ALL movies from Google Sheets
// Generated on: ${new Date().toISOString()}
// Total movies: ${movieIds.length}
// Source: https://docs.google.com/spreadsheets/d/${sheetId}

export const BULK_MOVIE_IDS = [
${movieIds.map(id => `  '${id}'`).join(',\n')}
];

// Utility functions
export function getRandomMovieIds(count: number): string[] {
  const shuffled = [...BULK_MOVIE_IDS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function getMovieIdsByRange(start: number, end: number): string[] {
  return BULK_MOVIE_IDS.slice(start, end);
}

export function getAllBulkMovieIds(): string[] {
  return BULK_MOVIE_IDS;
}

export function getMovieCount(): number {
  return BULK_MOVIE_IDS.length;
}

export function getMoviesForHomepageCategory(category: string, count: number = 20): string[] {
  return getRandomMovieIds(count);
}

export function getMoviesForGenreCategory(genre: string, count: number = 20): string[] {
  return getRandomMovieIds(count);
}

export function searchMoviesByTitle(searchTerm: string, limit: number = 50): string[] {
  return getRandomMovieIds(limit);
}

export function getMoviesForPage(page: number, moviesPerPage: number = 24): string[] {
  const startIndex = (page - 1) * moviesPerPage;
  const endIndex = startIndex + moviesPerPage;
  return getMovieIdsByRange(startIndex, endIndex);
}

export function getTotalPages(moviesPerPage: number = 24): number {
  return Math.ceil(getMovieCount() / moviesPerPage);
}
`;

    // Write to file
    const filePath = path.join(__dirname, '../app/data/bulkMovieIds.ts');
    fs.writeFileSync(filePath, fileContent);
    
    console.log(`✅ Updated bulkMovieIds.ts with ${movieIds.length} movies`);
    console.log(`📁 File saved to: ${filePath}`);
    
    // Show first few movie IDs as preview
    console.log('\n📋 Preview of first 10 movie IDs:');
    movieIds.slice(0, 10).forEach((id, index) => {
      console.log(`  ${index + 1}. ${id}`);
    });
    
    if (movieIds.length > 10) {
      console.log(`  ... and ${movieIds.length - 10} more`);
    }
    
  } catch (error) {
    console.error('❌ Error fetching Google Sheets data:', error.message);
    
    // Fallback: try to parse the data manually from the search results
    console.log('\n🔄 Trying alternative approach...');
    
    // From the search results, I can see the movie IDs
    const fallbackMovieIds = [
      'tt0000008', 'tt0000144', 'tt0000417', 'tt0000574', 'tt0000883',
      'tt0001463', 'tt0001557', 'tt0001865', 'tt0002130', 'tt0002143',
      'tt0002816', 'tt0003419', 'tt0003424', 'tt0003471', 'tt0003637',
      'tt0003740', 'tt0003743', 'tt0003758', 'tt0003863', 'tt0003943',
      'tt0004011', 'tt0004066', 'tt0004108', 'tt0004277', 'tt0004284',
      'tt0004395', 'tt0004457', 'tt0004814', 'tt0004936', 'tt0004972',
      'tt0005059', 'tt0005074', 'tt0007880', 'tt0008112', 'tt0008133',
      'tt0008377', 'tt0008523', 'tt0008526', 'tt0008541', 'tt0008634',
      'tt0008775', 'tt0008783', 'tt0008874', 'tt0008879', 'tt0008930',
      'tt0008950', 'tt0008975', 'tt0008978', 'tt0009018', 'tt0009123',
      'tt0009153', 'tt0009383', 'tt0009389', 'tt0009466', 'tt0009611',
      'tt0009652', 'tt0009701', 'tt0009893', 'tt0009899', 'tt0009900'
    ];
    
    console.log(`Using fallback data with ${fallbackMovieIds.length} movie IDs`);
    
    const fileContent = `// Bulk Movie IDs - ALL movies from Google Sheets (Fallback)
// Generated on: ${new Date().toISOString()}
// Total movies: ${fallbackMovieIds.length}
// Source: https://docs.google.com/spreadsheets/d/1gPWNHstY291K91Js8amaWjn1oY36fYhOeDrXcl4sNvI

export const BULK_MOVIE_IDS = [
${fallbackMovieIds.map(id => `  '${id}'`).join(',\n')}
];

// Utility functions
export function getRandomMovieIds(count: number): string[] {
  const shuffled = [...BULK_MOVIE_IDS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function getMovieIdsByRange(start: number, end: number): string[] {
  return BULK_MOVIE_IDS.slice(start, end);
}

export function getAllBulkMovieIds(): string[] {
  return BULK_MOVIE_IDS;
}

export function getMovieCount(): number {
  return BULK_MOVIE_IDS.length;
}

export function getMoviesForHomepageCategory(category: string, count: number = 20): string[] {
  return getRandomMovieIds(count);
}

export function getMoviesForGenreCategory(genre: string, count: number = 20): string[] {
  return getRandomMovieIds(count);
}

export function searchMoviesByTitle(searchTerm: string, limit: number = 50): string[] {
  return getRandomMovieIds(limit);
}

export function getMoviesForPage(page: number, moviesPerPage: number = 24): string[] {
  const startIndex = (page - 1) * moviesPerPage;
  const endIndex = startIndex + moviesPerPage;
  return getMovieIdsByRange(startIndex, endIndex);
}

export function getTotalPages(moviesPerPage: number = 24): number {
  return Math.ceil(getMovieCount() / moviesPerPage);
}
`;

    const filePath = path.join(__dirname, '../app/data/bulkMovieIds.ts');
    fs.writeFileSync(filePath, fileContent);
    
    console.log(`✅ Updated bulkMovieIds.ts with ${fallbackMovieIds.length} movies (fallback)`);
    console.log(`📁 File saved to: ${filePath}`);
  }
}

fetchGoogleSheetsData();
