const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

async function populateBulkMovieIds() {
  const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/movies');
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('movies');
    const moviesCollection = db.collection('movies');
    
    // Get all movie IDs from database
    const movies = await moviesCollection.find({}, { projection: { imdbId: 1, _id: 0 } }).toArray();
    const movieIds = movies.map(movie => movie.imdbId).filter(id => id && id.trim() !== '');
    
    console.log(`Found ${movieIds.length} movies in database`);
    
    // Generate the bulk movie IDs file
    const fileContent = `// Bulk Movie IDs - ALL movies from MongoDB Database
// Generated on: ${new Date().toISOString()}
// Total movies: ${movieIds.length}

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
    
  } catch (error) {
    console.error('Error populating bulk movie IDs:', error);
  } finally {
    await client.close();
  }
}

populateBulkMovieIds();
