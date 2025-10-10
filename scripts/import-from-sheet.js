// Script to import TV series data from your sheet
// Replace the sample data with your actual sheet data

const fs = require('fs');
const path = require('path');

function generateStaticTVSeriesFile() {
  console.log('🎬 Generating Static TV Series File\n');
  
  // TODO: Replace this with your actual sheet data
  // Format: { episode_imdb_id, series_name, season_number, episode_number, episode_name, overview, still_path, air_date, vote_average, runtime, series_imdb_id, series_tmdb_id }
  
  const sheetData = [
    // Example data - Replace with your actual data
    {
      episode_imdb_id: "tt0959621",
      series_name: "Breaking Bad",
      season_number: 1,
      episode_number: 1,
      episode_name: "Pilot",
      overview: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
      still_path: "/1yeVJx3FlMT1FBAjmet7gILaeut.jpg",
      air_date: "2008-01-20",
      vote_average: 8.2,
      runtime: 58,
      series_imdb_id: "tt0903747",
      series_tmdb_id: 1396,
      series_poster_path: "/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
      series_backdrop_path: "/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
      series_overview: "Walter White, a New Mexico chemistry teacher, is diagnosed with Stage III cancer and given a prognosis of only two years left to live.",
      series_first_air_date: "2008-01-20",
      series_number_of_seasons: 5
    },
    // Add more episodes from your sheet here...
  ];
  
  // Group episodes by series
  const seriesMap = new Map();
  
  sheetData.forEach(episode => {
    const seriesKey = episode.series_tmdb_id || episode.series_name;
    
    if (!seriesMap.has(seriesKey)) {
      seriesMap.set(seriesKey, {
        series_name: episode.series_name,
        series_imdb_id: episode.series_imdb_id,
        series_tmdb_id: episode.series_tmdb_id,
        poster_path: episode.series_poster_path,
        backdrop_path: episode.series_backdrop_path,
        overview: episode.series_overview,
        first_air_date: episode.series_first_air_date,
        number_of_seasons: episode.series_number_of_seasons,
        episodes: []
      });
    }
    
    seriesMap.get(seriesKey).episodes.push({
      episode_imdb_id: episode.episode_imdb_id,
      series_name: episode.series_name,
      season_number: episode.season_number,
      episode_number: episode.episode_number,
      episode_name: episode.episode_name,
      overview: episode.overview,
      still_path: episode.still_path,
      air_date: episode.air_date,
      vote_average: episode.vote_average,
      runtime: episode.runtime,
      series_imdb_id: episode.series_imdb_id,
      series_tmdb_id: episode.series_tmdb_id
    });
  });
  
  const seriesArray = Array.from(seriesMap.values());
  
  console.log(`📊 Processing ${sheetData.length} episodes from ${seriesArray.length} series`);
  
  // Generate the TypeScript file content
  const content = `// Static TV Series Data - No Database Required!
// Generated from your sheet data on ${new Date().toISOString()}

export interface StaticEpisode {
  episode_imdb_id: string;
  series_name: string;
  season_number: number;
  episode_number: number;
  episode_name: string;
  overview?: string;
  still_path?: string;
  air_date?: string;
  vote_average?: number;
  runtime?: number;
  series_imdb_id?: string;
  series_tmdb_id?: number;
}

export interface StaticSeries {
  series_name: string;
  series_imdb_id?: string;
  series_tmdb_id?: number;
  poster_path?: string;
  backdrop_path?: string;
  overview?: string;
  first_air_date?: string;
  number_of_seasons?: number;
  episodes: StaticEpisode[];
}

// Static TV Series Data - Generated from your sheet
export const STATIC_TV_SERIES: StaticSeries[] = [
${seriesArray.map(series => `  {
    series_name: "${series.series_name}",
    series_imdb_id: "${series.series_imdb_id || ''}",
    series_tmdb_id: ${series.series_tmdb_id || 'null'},
    poster_path: "${series.poster_path || ''}",
    backdrop_path: "${series.backdrop_path || ''}",
    overview: "${series.overview || ''}",
    first_air_date: "${series.first_air_date || ''}",
    number_of_seasons: ${series.number_of_seasons || 1},
    episodes: [
${series.episodes.map(ep => `      {
        episode_imdb_id: "${ep.episode_imdb_id}",
        series_name: "${ep.series_name}",
        season_number: ${ep.season_number},
        episode_number: ${ep.episode_number},
        episode_name: "${ep.episode_name}",
        overview: "${ep.overview || ''}",
        still_path: "${ep.still_path || ''}",
        air_date: "${ep.air_date || ''}",
        vote_average: ${ep.vote_average || 'null'},
        runtime: ${ep.runtime || 'null'},
        series_imdb_id: "${ep.series_imdb_id || ''}",
        series_tmdb_id: ${ep.series_tmdb_id || 'null'}
      }`).join(',\n')}
    ]
  }`).join(',\n')}
];

// Helper functions
export function getAllStaticSeries(): StaticSeries[] {
  return STATIC_TV_SERIES;
}

export function getStaticSeriesBySlug(slug: string): StaticSeries | null {
  const seriesId = extractTmdbIdFromSlug(slug);
  return STATIC_TV_SERIES.find(s => s.series_tmdb_id === seriesId) || null;
}

export function getAllStaticEpisodes(): StaticEpisode[] {
  return STATIC_TV_SERIES.flatMap(series => series.episodes);
}

export function getStaticEpisodesBySeries(seriesId: number): StaticEpisode[] {
  const series = STATIC_TV_SERIES.find(s => s.series_tmdb_id === seriesId);
  return series ? series.episodes : [];
}

export function getStaticEpisodesBySeason(seriesId: number, seasonNumber: number): StaticEpisode[] {
  return getStaticEpisodesBySeries(seriesId).filter(ep => ep.season_number === seasonNumber);
}

export function getStaticEpisodeByImdbId(imdbId: string): StaticEpisode | null {
  return getAllStaticEpisodes().find(ep => ep.episode_imdb_id === imdbId) || null;
}

// Helper function to extract TMDB ID from slug
function extractTmdbIdFromSlug(slug: string): number | null {
  const match = slug.match(/-(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}
`;

  // Save to file
  const filePath = path.join(__dirname, '..', 'app', 'data', 'tvSeriesStatic.ts');
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log(`✅ Generated static TV series file with:`);
  console.log(`   📺 ${seriesArray.length} series`);
  console.log(`   🎬 ${sheetData.length} episodes`);
  console.log(`   📁 Saved to: app/data/tvSeriesStatic.ts`);
  
  console.log('\n📝 Next steps:');
  console.log('1. Replace the sample data in this script with your actual sheet data');
  console.log('2. Run: node scripts/import-from-sheet.js');
  console.log('3. Visit: http://localhost:3000/series-static');
  console.log('\n💡 No database required! Everything is static files!');
}

generateStaticTVSeriesFile();

