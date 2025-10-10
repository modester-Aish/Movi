const fs = require('fs');
const path = require('path');

async function splitStaticData() {
  console.log('📦 Splitting Static Data into Chunks...\n');

  try {
    // Read the large static file
    const staticFilePath = path.join(__dirname, '..', 'app', 'data', 'tvSeriesStatic.ts');
    
    if (!fs.existsSync(staticFilePath)) {
      throw new Error('Static file not found. Run generate-all-vidsrc-data.js first.');
    }

    const content = fs.readFileSync(staticFilePath, 'utf8');
    
    // Extract the JSON data
    const jsonMatch = content.match(/export const STATIC_TV_SERIES: StaticSeries\[\] = (\[[\s\S]*?\]);/);
    if (!jsonMatch) {
      throw new Error('Could not extract JSON data from static file.');
    }

    const seriesData = JSON.parse(jsonMatch[1]);
    console.log(`📊 Total series: ${seriesData.length.toLocaleString()}`);

    // Split into chunks of 500 series each
    const CHUNK_SIZE = 500;
    const chunks = [];
    
    for (let i = 0; i < seriesData.length; i += CHUNK_SIZE) {
      chunks.push(seriesData.slice(i, i + CHUNK_SIZE));
    }

    console.log(`📦 Splitting into ${chunks.length} chunks of ~${CHUNK_SIZE} series each\n`);

    // Create chunks directory
    const chunksDir = path.join(__dirname, '..', 'app', 'data', 'tv-chunks');
    if (!fs.existsSync(chunksDir)) {
      fs.mkdirSync(chunksDir, { recursive: true });
    }

    // Write each chunk
    chunks.forEach((chunk, index) => {
      const chunkFilePath = path.join(chunksDir, `chunk-${index}.ts`);
      const chunkContent = `// TV Series Chunk ${index + 1} of ${chunks.length}
// Contains ${chunk.length} series

export interface StaticEpisode {
  episode_imdb_id: string;
  series_name: string;
  season_number: number;
  episode_number: number;
  episode_name: string;
  overview: string;
  still_path: string | null;
  air_date: string;
  vote_average: number;
  runtime: number;
  series_imdb_id: string;
  series_tmdb_id: number;
}

export interface StaticSeries {
  series_name: string;
  series_imdb_id: string;
  series_tmdb_id: number;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  first_air_date: string;
  number_of_seasons: number;
  episodes: StaticEpisode[];
}

export const CHUNK_${index}: StaticSeries[] = ${JSON.stringify(chunk, null, 2)};
`;

      fs.writeFileSync(chunkFilePath, chunkContent);
      const stats = fs.statSync(chunkFilePath);
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      console.log(`✅ Chunk ${index + 1}/${chunks.length}: ${chunk.length} series (${sizeMB} MB)`);
    });

    // Create index file
    const indexFilePath = path.join(chunksDir, 'index.ts');
    const indexContent = `// TV Series Chunks Index
// Total: ${seriesData.length.toLocaleString()} series in ${chunks.length} chunks

${chunks.map((_, i) => `export { CHUNK_${i}, type StaticSeries, type StaticEpisode } from './chunk-${i}';`).join('\n')}

// Lazy load function - loads chunks on demand
export async function loadSeriesChunk(chunkIndex: number): Promise<any> {
  const module = await import(\`./chunk-\${chunkIndex}\`);
  return module[\`CHUNK_\${chunkIndex}\`];
}

// Get total chunk count
export const TOTAL_CHUNKS = ${chunks.length};
export const CHUNK_SIZE = ${CHUNK_SIZE};
export const TOTAL_SERIES = ${seriesData.length};
`;

    fs.writeFileSync(indexFilePath, indexContent);

    console.log(`\n✅ Successfully split data into ${chunks.length} chunks!`);
    console.log(`📁 Chunks saved to: ${chunksDir}`);
    console.log(`📊 Total: ${seriesData.length.toLocaleString()} series`);
    console.log(`\n🚀 Now update your pages to use chunked data!`);

  } catch (error) {
    console.error('❌ Error splitting data:', error.message);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  splitStaticData()
    .then(() => {
      console.log('\n🎉 Data split completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Split failed:', error.message);
      process.exit(1);
    });
}

module.exports = { splitStaticData };
