// Script to fetch TV and Episode IDs from VidSrc
// Run with: node scripts/fetch-vidsrc-ids.js

const fs = require('fs');
const path = require('path');

const TV_IDS_URL = 'https://vidsrc.me/ids/tv_imdb.txt';
const EPISODE_IDS_URL = 'https://vidsrc.me/ids/eps_imdb.txt';

async function fetchIds(url, label) {
  console.log(`\n📥 Fetching ${label} from ${url}...`);
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const text = await response.text();
    
    // Split by whitespace and filter valid IMDB IDs
    const ids = text
      .split(/\s+/)
      .filter(id => id.match(/^tt\d{7,8}$/))
      .filter((id, index, self) => self.indexOf(id) === index); // Remove duplicates
    
    console.log(`✅ Found ${ids.length} unique ${label}`);
    return ids;
    
  } catch (error) {
    console.error(`❌ Error fetching ${label}:`, error.message);
    return [];
  }
}

async function saveTvSeriesIds(ids) {
  const content = `// TV Series IDs from VidSrc
// Total: ${ids.length} series
// Source: https://vidsrc.me/ids/tv_imdb.txt
// Last updated: ${new Date().toISOString()}

export const TV_SERIES_IDS = [
${ids.map(id => `  '${id}',`).join('\n')}
];

// Function to get all TV series IDs
export function getAllTvSeriesIds(): string[] {
  return TV_SERIES_IDS;
}

// Function to get paginated IDs
export function getTvSeriesIdsPaginated(page: number = 1, limit: number = 100): string[] {
  const start = (page - 1) * limit;
  const end = start + limit;
  return TV_SERIES_IDS.slice(start, end);
}

// Get total count
export function getTvSeriesCount(): number {
  return TV_SERIES_IDS.length;
}
`;

  const filePath = path.join(__dirname, '..', 'app', 'data', 'tvSeriesIds.ts');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Saved ${ids.length} TV series IDs to app/data/tvSeriesIds.ts`);
}

async function saveEpisodeIds(ids) {
  const content = `// Episode IDs from VidSrc
// Total: ${ids.length} episodes
// Source: https://vidsrc.me/ids/eps_imdb.txt
// Last updated: ${new Date().toISOString()}

// Note: This file contains ALL episode IDs from VidSrc
// You can modify EPISODE_IDS array to only include episodes you want

export const ALL_EPISODE_IDS = [
${ids.slice(0, 1000).map(id => `  '${id}',`).join('\n')}
  // ... and ${ids.length - 1000} more
  // Full list is too large, import in batches or modify this file
];

// For now, using first 1000 episodes as example
export const EPISODE_IDS = ALL_EPISODE_IDS;

// Function to get all episode IDs
export function getAllEpisodeIds(): string[] {
  return EPISODE_IDS;
}

// Function to get paginated IDs
export function getEpisodeIdsPaginated(page: number = 1, limit: number = 100): string[] {
  const start = (page - 1) * limit;
  const end = start + limit;
  return EPISODE_IDS.slice(start, end);
}

// Get total count
export function getEpisodeCount(): number {
  return EPISODE_IDS.length;
}

// NOTE: Complete list available in episodeIds.full.json
`;

  const filePath = path.join(__dirname, '..', 'app', 'data', 'episodeIds.ts');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Saved episode IDs to app/data/episodeIds.ts`);
  
  // Save full list as JSON for reference
  const jsonPath = path.join(__dirname, '..', 'app', 'data', 'episodeIds.full.json');
  fs.writeFileSync(jsonPath, JSON.stringify(ids, null, 2), 'utf8');
  console.log(`✅ Saved full list (${ids.length} episodes) to app/data/episodeIds.full.json`);
}

async function main() {
  console.log('🎬 VidSrc ID Fetcher\n');
  console.log('This will download all TV series and episode IDs from VidSrc');
  console.log('and save them to your app/data directory.\n');
  
  // Fetch TV Series IDs
  const tvIds = await fetchIds(TV_IDS_URL, 'TV Series IDs');
  if (tvIds.length > 0) {
    await saveTvSeriesIds(tvIds);
  }
  
  // Fetch Episode IDs
  const episodeIds = await fetchIds(EPISODE_IDS_URL, 'Episode IDs');
  if (episodeIds.length > 0) {
    await saveEpisodeIds(episodeIds);
  }
  
  console.log('\n✨ Done! IDs have been saved.');
  console.log('\n📝 Next steps:');
  console.log('1. Review app/data/tvSeriesIds.ts and app/data/episodeIds.ts');
  console.log('2. Modify EPISODE_IDS array to include episodes you want');
  console.log('3. Run: node scripts/sync-episodes.js');
  console.log('4. Start your dev server: npm run dev');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});


