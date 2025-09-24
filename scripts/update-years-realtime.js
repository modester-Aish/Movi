const fs = require('fs');
const path = require('path');

// This script monitors the progress file and updates a years cache file
// that the API can read more efficiently

const PROGRESS_FILE = path.join(__dirname, 'all-movies-progress.json');
const YEARS_CACHE_FILE = path.join(__dirname, 'years-cache.json');
const BATCH_RESULTS_DIR = __dirname;

function updateYearsCache() {
  try {
    // Check if progress file exists
    if (!fs.existsSync(PROGRESS_FILE)) {
      console.log('📁 Progress file not found, creating empty cache...');
      const emptyCache = {
        years: [],
        decades: [],
        totalMovies: 95942,
        processedMovies: 0,
        foundMovies: 0,
        progress: '0.00',
        lastUpdate: new Date().toISOString(),
        yearStats: {}
      };
      fs.writeFileSync(YEARS_CACHE_FILE, JSON.stringify(emptyCache, null, 2));
      return;
    }

    // Read current progress
    const progressData = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
    
    // Collect all years from batch result files
    const allYears = new Set();
    let totalMoviesFound = progressData.foundCount || 0;
    
    // Get all batch result files
    const batchFiles = fs.readdirSync(BATCH_RESULTS_DIR)
      .filter(file => file.startsWith('batch-') && file.endsWith('-results.json'))
      .sort((a, b) => {
        const aNum = parseInt(a.match(/batch-(\d+)-results\.json/)?.[1] || '0');
        const bNum = parseInt(b.match(/batch-(\d+)-results\.json/)?.[1] || '0');
        return bNum - aNum;
      });

    // Process each batch file
    for (const batchFile of batchFiles) {
      try {
        const batchPath = path.join(BATCH_RESULTS_DIR, batchFile);
        const batchData = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
        
        batchData.forEach(movie => {
          if (movie.year) {
            allYears.add(movie.year);
          }
        });
      } catch (error) {
        console.error(`Error reading batch file ${batchFile}:`, error);
      }
    }

    // Also add years from progress file yearStats
    Object.keys(progressData.yearStats || {}).forEach(year => {
      allYears.add(parseInt(year));
    });

    // Convert to sorted array (newest first)
    const yearsArray = Array.from(allYears).sort((a, b) => b - a);

    // Create decades
    const decades = new Map();
    yearsArray.forEach(year => {
      const decade = Math.floor(year / 10) * 10;
      if (!decades.has(decade)) {
        decades.set(decade, []);
      }
      decades.get(decade).push(year);
    });

    // Format decades
    const decadesArray = Array.from(decades.entries())
      .sort((a, b) => b[0] - a[0])
      .map(([decade, years]) => ({
        decade: `${decade}s`,
        years: years.sort((a, b) => b - a)
      }));

    // Create cache object
    const cacheData = {
      years: yearsArray,
      decades: decadesArray,
      totalMovies: 95942,
      processedMovies: progressData.processedCount || 0,
      foundMovies: totalMoviesFound,
      progress: progressData.progress || '0.00',
      lastUpdate: new Date().toISOString(),
      yearStats: progressData.yearStats || {},
      batchCount: batchFiles.length,
      totalYears: yearsArray.length
    };

    // Write cache file
    fs.writeFileSync(YEARS_CACHE_FILE, JSON.stringify(cacheData, null, 2));
    
    console.log(`✅ Years cache updated: ${yearsArray.length} years, ${decadesArray.length} decades, ${totalMoviesFound.toLocaleString()} movies found`);
    
  } catch (error) {
    console.error('❌ Error updating years cache:', error);
  }
}

// Update cache immediately
updateYearsCache();

// Watch for changes to progress file and batch result files
console.log('👀 Watching for changes to movie processing files...');

let lastProgressUpdate = 0;
let lastBatchCount = 0;

const watchInterval = setInterval(() => {
  try {
    // Check if progress file has been updated
    if (fs.existsSync(PROGRESS_FILE)) {
      const stats = fs.statSync(PROGRESS_FILE);
      const currentProgressUpdate = stats.mtime.getTime();
      
      // Check if new batch files have been created
      const currentBatchFiles = fs.readdirSync(BATCH_RESULTS_DIR)
        .filter(file => file.startsWith('batch-') && file.endsWith('-results.json'));
      
      const currentBatchCount = currentBatchFiles.length;
      
      // Update cache if progress file changed or new batch files were created
      if (currentProgressUpdate !== lastProgressUpdate || currentBatchCount !== lastBatchCount) {
        updateYearsCache();
        lastProgressUpdate = currentProgressUpdate;
        lastBatchCount = currentBatchCount;
      }
    }
  } catch (error) {
    console.error('Error in watch loop:', error);
  }
}, 5000); // Check every 5 seconds

// Cleanup on exit
process.on('SIGINT', () => {
  console.log('\n👋 Stopping years cache updater...');
  clearInterval(watchInterval);
  process.exit(0);
});

console.log('🚀 Years cache updater started. Press Ctrl+C to stop.');
