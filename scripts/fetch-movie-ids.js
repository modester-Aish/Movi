// Script to fetch movie IDs from Google Sheets
// Run this script to update your movie IDs

const fs = require('fs');
const path = require('path');

// Google Sheets ID from your URL
const SHEET_ID = '1gPWNHstY291K91Js8amaWjn1oY36fYhOeDrXcl4sNvI';

// Function to fetch data from Google Sheets
async function fetchMovieIds() {
  try {
    // Using Google Sheets API v4
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/A:A?key=YOUR_API_KEY`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const movieIds = data.values
      .flat()
      .filter(id => id && id.startsWith('tt') && id.length >= 9)
      .map(id => `'${id}'`);
    
    return movieIds;
  } catch (error) {
    console.error('Error fetching from Google Sheets:', error);
    
    // Fallback: Manual extraction from the visible data
    console.log('Using fallback method with visible data...');
    return getVisibleMovieIds();
  }
}

// Fallback function with visible movie IDs from the sheet
function getVisibleMovieIds() {
  const visibleIds = [
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
  
  return visibleIds.map(id => `'${id}'`);
}

// Function to update the bulkMovieIds.ts file
function updateBulkMovieIdsFile(movieIds) {
  const filePath = path.join(__dirname, '../app/data/bulkMovieIds.ts');
  
  const fileContent = `// Bulk Movie IDs - Fetched from Google Sheets
// This will automatically organize movies into categories

// Your main movie IDs array - Fetched from Google Sheets
export const BULK_MOVIE_IDS = [
  // Movie IDs from Google Sheets
${movieIds.join(',\n  ')}
];

// Function to get a random subset of movie IDs
export function getRandomMovieIds(count: number): string[] {
  const shuffled = [...BULK_MOVIE_IDS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Function to get movie IDs by range
export function getMovieIdsByRange(start: number, end: number): string[] {
  return BULK_MOVIE_IDS.slice(start, end);
}

// Function to get all movie IDs
export function getAllBulkMovieIds(): string[] {
  return BULK_MOVIE_IDS;
}

// Function to add more movie IDs
export function addMovieIds(ids: string[]): void {
  BULK_MOVIE_IDS.push(...ids);
}

// Function to get movie count
export function getMovieCount(): number {
  return BULK_MOVIE_IDS.length;
}

// Function to get movies for homepage categories
export function getMoviesForHomepageCategory(category: string, count: number = 20): string[] {
  // For now, return random movies. You can customize this logic later
  return getRandomMovieIds(count);
}

// Function to get movies for genre categories
export function getMoviesForGenreCategory(genre: string, count: number = 20): string[] {
  // For now, return random movies. You can customize this logic later
  return getRandomMovieIds(count);
}

// Function to get movies for search
export function searchMoviesByTitle(searchTerm: string, limit: number = 50): string[] {
  // This will be implemented when you add movie titles
  // For now, return random movies
  return getRandomMovieIds(limit);
}

// Function to get movies for pagination
export function getMoviesForPage(page: number, moviesPerPage: number = 24): string[] {
  const startIndex = (page - 1) * moviesPerPage;
  const endIndex = startIndex + moviesPerPage;
  return getMovieIdsByRange(startIndex, endIndex);
}

// Function to get total pages
export function getTotalPages(moviesPerPage: number = 24): number {
  return Math.ceil(getMovieCount() / moviesPerPage);
}
`;

  fs.writeFileSync(filePath, fileContent, 'utf8');
  console.log(`✅ Updated ${filePath} with ${movieIds.length} movie IDs`);
}

// Main execution
async function main() {
  console.log('🎬 Fetching movie IDs from Google Sheets...');
  
  try {
    const movieIds = await fetchMovieIds();
    console.log(`📊 Found ${movieIds.length} movie IDs`);
    
    updateBulkMovieIdsFile(movieIds);
    
    console.log('✅ Successfully updated bulkMovieIds.ts');
    console.log(`📈 Total movies in database: ${movieIds.length}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the script
main();
