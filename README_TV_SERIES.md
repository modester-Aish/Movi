# TV Series System - Complete Guide

## 🎬 Overview

Ye ek complete TV series management system hai jahan aap sirf episode IDs dete ho aur sab kuch automatically organize ho jata hai.

## 📁 Structure

```
/series                                   → All TV series list
/series/breaking-bad-1396                 → Series page (all seasons)
/series/breaking-bad-1396/season-1        → Season page (all episodes)
/episode/pilot-s01e01-tt0959621           → Episode player page
```

## 🚀 Setup Instructions

### Step 1: Episode IDs Add Karein

File: `app/data/episodeIds.ts`

```typescript
export const EPISODE_IDS = [
  'tt0959621',  // Breaking Bad S01E01 - Pilot
  'tt0959631',  // Breaking Bad S01E02
  'tt2301451',  // Game of Thrones S01E01
  // ... add more episode IMDB IDs
];
```

### Step 2: Database Sync Karein

**Option 1: Script Use Karein (Recommended)**
```bash
node scripts/sync-episodes.js
```

**Option 2: API Call Karein**
```bash
# Development server start karein
npm run dev

# Browser mein ya Postman se call karein:
POST http://localhost:3000/api/episodes/sync
```

### Step 3: Browse Your Content!

Visit:
- `http://localhost:3000/series` - All series dekhen
- Series → Seasons → Episodes automatically organized!

## 🎯 Features

### ✅ Automatic Organization
- Episode IDs se automatically:
  - Series detect hoti hai
  - Seasons group hote hain
  - Episodes organize hote hain
  
### ✅ Complete Data
System automatically TMDB se fetch karta hai:
- Series details (name, poster, overview, ratings)
- Season information
- Episode details (title, description, air date, runtime)
- Images (posters, backdrops, stills)

### ✅ Smart Navigation
- Series page → All seasons list
- Season page → All episodes with thumbnails
- Episode page → Video player with related episodes
- Breadcrumb navigation

### ✅ Beautiful UI
- YouTube-style player layout
- Responsive design (mobile, tablet, desktop)
- Hover effects and transitions
- Episode thumbnails with badges
- Rating displays

## 📊 Database Models

### TVSeries Collection
```typescript
{
  tmdb_id: number,
  imdb_id: string,
  name: string,
  poster_path: string,
  number_of_seasons: number,
  number_of_episodes: number,
  // ... more fields
}
```

### Episode Collection
```typescript
{
  episode_imdb_id: string,
  series_tmdb_id: number,
  series_name: string,
  season_number: number,
  episode_number: number,
  episode_name: string,
  // ... more fields
}
```

## 🔧 API Routes

### GET /api/episodes/sync
Check sync status
```json
{
  "episodeIdsInFile": 10,
  "episodesInDatabase": 10,
  "seriesInDatabase": 2,
  "needsSync": false
}
```

### POST /api/episodes/sync
Sync episodes from episodeIds.ts to database

### GET /api/episodes
Get episodes with filters
- `?series_id=1396` - Episodes of a series
- `?season=1` - Episodes of a season
- `?limit=20&page=1` - Pagination

### GET /api/series
Get all TV series with episode counts

## 🎥 Video Player

VidSrc player integration:
```
https://vidsrc.to/embed/tv/{series_imdb_id}/{season}/{episode}
```

Supports:
- Multiple quality options
- Subtitles
- Fullscreen
- Auto-play

## 📝 How It Works

1. **You Add Episode IDs:**
   ```typescript
   EPISODE_IDS = ['tt0959621', 'tt0959631', ...]
   ```

2. **System Fetches Data:**
   - Episode ke liye TMDB query
   - Parent series detect karta hai
   - Series details fetch karta hai
   - Database mein save karta hai

3. **Auto Organization:**
   - Episodes group by series
   - Episodes group by season within series
   - Automatic slug generation for URLs

4. **User Browses:**
   ```
   /series 
     → Breaking Bad
       → Season 1
         → Episode 1 (Play)
         → Episode 2 (Play)
       → Season 2
         → Episode 1 (Play)
   ```

## 🔍 Example Flow

1. Add episode ID: `tt0959621`

2. System automatically:
   - Detects: Breaking Bad S01E01
   - Fetches series: Breaking Bad (tmdb_id: 1396)
   - Saves episode data
   - Saves series data (if not exists)

3. URLs created:
   - Series: `/series/breaking-bad-1396`
   - Season: `/series/breaking-bad-1396/season-1`
   - Episode: `/episode/pilot-s01e01-tt0959621`

## 🎨 Customization

### Styling
- Edit Tailwind classes in page components
- Global styles in `app/globals.css`

### Player
- Change player in `app/episode/[slug]/page.tsx`
- Current: VidSrc
- Can use: Any other embed player

### Layout
- YouTube-style layout (default)
- Can modify to Netflix-style, etc.

## 🐛 Troubleshooting

### Episodes not showing?
1. Check `app/data/episodeIds.ts` has valid IMDB IDs
2. Run sync: `node scripts/sync-episodes.js`
3. Check MongoDB connection

### Invalid IMDB ID?
- Episode IDs start with `tt` followed by 7-8 digits
- Example: `tt0959621`
- NOT series ID, must be episode ID

### Series not found?
- Make sure episode ID is correct
- TMDB must have that episode
- Check console for errors

## 🌟 Best Practices

1. **Add complete seasons** for better UX
2. **Run sync** after adding new IDs
3. **Check database** after sync
4. **Test URLs** after adding new content

## 📞 Support

Issues? Check:
1. Episode IDs format (tt followed by numbers)
2. MongoDB connection
3. TMDB API access
4. Console errors

---

**Happy Streaming! 🎬🍿**


