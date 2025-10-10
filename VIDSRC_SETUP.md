# VidSrc Integration Setup

## 🎬 Overview

Ye project ab VidSrc ke complete database se integrate hai:
- **TV Series IDs:** https://vidsrc.me/ids/tv_imdb.txt (Thousands of shows)
- **Episode IDs:** https://vidsrc.me/ids/eps_imdb.txt (Lakhs of episodes)
- **Player:** VidSrc.xyz (High quality streaming)

## 📥 Step 1: Download IDs

VidSrc se saare IDs download karein:

```bash
node scripts/fetch-vidsrc-ids.js
```

Ye script:
- ✅ TV series IDs download karega → `app/data/tvSeriesIds.ts`
- ✅ Episode IDs download karega → `app/data/episodeIds.ts`
- ✅ Full episode list JSON mein save karega → `app/data/episodeIds.full.json`

## 📊 Downloaded Data

### TV Series IDs File
**Location:** `app/data/tvSeriesIds.ts`

Contains:
- Thousands of TV series IMDB IDs
- Helper functions for pagination
- Total count function

```typescript
import { getAllTvSeriesIds, getTvSeriesIdsPaginated } from '@/data/tvSeriesIds';

// Get all IDs
const allIds = getAllTvSeriesIds();

// Get paginated (100 per page)
const page1 = getTvSeriesIdsPaginated(1, 100);
```

### Episode IDs File
**Location:** `app/data/episodeIds.ts`

**Note:** Episode file contains first 1000 IDs as example because full file would be too large.

Full list available in: `app/data/episodeIds.full.json`

```typescript
import { getAllEpisodeIds, getEpisodeIdsPaginated } from '@/data/episodeIds';

// Get included IDs
const ids = getAllEpisodeIds();

// Get paginated
const page1 = getEpisodeIdsPaginated(1, 100);
```

## 🎯 Step 2: Choose Episodes

**Option A: Use Sample (1000 episodes)**
Default - already configured!

**Option B: Add Specific Episodes**
Edit `app/data/episodeIds.ts`:

```typescript
export const EPISODE_IDS = [
  'tt0959621',  // Breaking Bad S01E01
  'tt0959631',  // Breaking Bad S01E02
  // ... add specific episodes
];
```

**Option C: Import from Full List**
Read from `episodeIds.full.json` and select episodes you want.

## 🔄 Step 3: Sync to Database

Apne chosen episodes ko database mein sync karein:

```bash
node scripts/sync-episodes.js
```

Ye script:
- Episode IDs se TMDB se data fetch karega
- Series information save karega
- Episodes organize karega by series and season
- Database mein save karega

## 🎥 Player Configuration

### Current Player: VidSrc.xyz

**Episode URL Format:**
```
https://vidsrc.xyz/embed/tv/{series_imdb_id}/{season}-{episode}
```

**Example:**
```
https://vidsrc.xyz/embed/tv/tt0944947/1-1
(Game of Thrones Season 1 Episode 1)
```

### Player Features
According to [VidSrc API](https://vidsrc.me/api/):

✅ **Supported:**
- Multiple quality options
- Subtitles (auto-detected)
- Custom subtitle URL
- Default language selection
- Autoplay control
- Autonext episode

### Advanced Player Options

```html
<!-- With custom subtitles -->
https://vidsrc.xyz/embed/tv?imdb=tt0944947&season=1&episode=1&sub_url=URL&ds_lang=en

<!-- With autoplay and autonext -->
https://vidsrc.xyz/embed/tv/tt0944947/1-1?autoplay=1&autonext=1
```

## 📱 Alternative Domains

VidSrc provides multiple domains (use any):
- vidsrc.xyz (Current)
- vidsrc.in
- vidsrc.pm
- vidsrc.net

## 🔧 Customization

### Change Player Domain

Edit `app/episode/[slug]/page.tsx`:

```typescript
// Change from vidsrc.xyz to vidsrc.in
src={`https://vidsrc.in/embed/tv/${series_imdb_id}/${season}-${episode}`}
```

### Add Player Options

```typescript
const playerUrl = `https://vidsrc.xyz/embed/tv/${series_imdb_id}/${season}-${episode}`;
const withOptions = `${playerUrl}?autoplay=1&autonext=1&ds_lang=en`;
```

## 📈 Batch Processing

### Process Episodes in Batches

```javascript
// In sync script or custom script
const BATCH_SIZE = 100;
const episodeIds = getAllEpisodeIds();

for (let i = 0; i < episodeIds.length; i += BATCH_SIZE) {
  const batch = episodeIds.slice(i, i + BATCH_SIZE);
  // Process batch
  await processBatch(batch);
}
```

## 🗂️ Data Sources

### VidSrc Resources
- **TV IDs:** https://vidsrc.me/ids/tv_imdb.txt
- **Episode IDs:** https://vidsrc.me/ids/eps_imdb.txt
- **API Docs:** https://vidsrc.me/api/
- **Latest Movies:** https://vidsrc.xyz/movies/latest/page-1.json
- **Latest Shows:** https://vidsrc.xyz/tvshows/latest/page-1.json
- **Latest Episodes:** https://vidsrc.xyz/episodes/latest/page-1.json

## 💡 Tips

1. **Start Small:** First 1000 episodes se start karein
2. **Test First:** Kuch episodes sync karke test karein
3. **Monitor API:** TMDB API rate limits ka dhyan rakhein
4. **Batch Sync:** Saari episodes ek saath sync na karein
5. **Storage:** Lakhs episodes ke liye MongoDB capacity check karein

## 🐛 Troubleshooting

### Too Many IDs?
```typescript
// Use only first N episodes
export const EPISODE_IDS = ALL_EPISODE_IDS.slice(0, 5000);
```

### Specific Series Only?
Filter from full JSON:
```javascript
const breakingBadEps = fullList.filter(id => {
  // Fetch episode info and check series
});
```

### Player Not Loading?
- Check IMDB ID format
- Verify series has episodes on VidSrc
- Try alternative domain (vidsrc.in, vidsrc.pm)

## 🎯 Recommended Workflow

1. **Download IDs:** `node scripts/fetch-vidsrc-ids.js`
2. **Select Episodes:** Edit `episodeIds.ts` with desired IDs
3. **Test Sync:** Sync 10-20 episodes first
4. **Verify:** Check database and player
5. **Full Sync:** Sync remaining episodes in batches
6. **Launch:** Start serving content!

## 📞 Support

Resources:
- VidSrc API: https://vidsrc.me/api/
- TMDB API: https://www.themoviedb.org/documentation/api
- Project README: README_TV_SERIES.md

---

**Happy Streaming! 🎬🍿**


