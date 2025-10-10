# 🚀 Quick Start Guide - TV Series System

## 📋 Complete Setup in 3 Steps

### Step 1: Download Episode IDs from VidSrc ⬇️

```bash
node scripts/fetch-vidsrc-ids.js
```

**Kya hoga:**
- ✅ Thousands of TV series IDs download hongi
- ✅ Lakhs of episode IDs download hongi  
- ✅ Files `app/data/` mein save hongi

**Files created:**
- `app/data/tvSeriesIds.ts` - TV series IDs
- `app/data/episodeIds.ts` - Episode IDs (first 1000 as sample)
- `app/data/episodeIds.full.json` - Complete list (JSON format)

---

### Step 2: Select Your Episodes 📝

**Option A: Use Sample (Quick Test)**
```typescript
// app/data/episodeIds.ts already has first 1000 episodes
// Just proceed to Step 3!
```

**Option B: Add Specific Shows**
```typescript
// Edit app/data/episodeIds.ts
export const EPISODE_IDS = [
  'tt0959621',  // Breaking Bad S01E01
  'tt0959631',  // Breaking Bad S01E02
  'tt2301451',  // Game of Thrones S01E01
  // Add your episodes here
];
```

**Option C: Import from Full List**
```javascript
// Read episodeIds.full.json and select episodes you want
const fs = require('fs');
const allIds = JSON.parse(fs.readFileSync('app/data/episodeIds.full.json'));
// Filter or select specific IDs
```

---

### Step 3: Sync to Database 🔄

**Option A: Sync All at Once** (For small lists)
```bash
node scripts/sync-episodes.js
```

**Option B: Batch Import** (Recommended for large lists)
```bash
# Import 50 episodes at a time (default)
node scripts/batch-import-episodes.js

# Custom batch size (e.g., 100 episodes per batch)
node scripts/batch-import-episodes.js 100

# Resume from specific index (e.g., start from episode 500)
node scripts/batch-import-episodes.js 50 500
```

**Kya hoga:**
- ✅ TMDB se episode details fetch hongi
- ✅ Series automatically detect hogi
- ✅ Database mein organized ho kar save hoga
- ✅ Episodes season ke hisaab se group hongi

---

## 🎬 Step 4: Start & Browse!

```bash
npm run dev
```

**Visit:**
- `http://localhost:3000/series` - Browse all TV series
- Click series → See all seasons  
- Click season → See all episodes
- Click episode → Watch!

---

## 📊 Project Structure

```
app/
├── data/
│   ├── episodeIds.ts          # Your episode IDs (edit this!)
│   ├── episodeIds.full.json   # Complete VidSrc list
│   └── tvSeriesIds.ts         # TV series IDs
│
├── models/
│   ├── TVSeries.ts            # Series database model
│   └── Episode.ts             # Episode database model
│
├── api/
│   ├── tmdb-tv.ts             # TMDB API functions
│   ├── episodes/
│   │   ├── route.ts           # Get episodes
│   │   ├── sync/route.ts      # Sync all episodes
│   │   └── sync-single/       # Sync one episode
│   └── series/route.ts        # Get series
│
├── series/
│   ├── page.tsx               # Series list
│   ├── [slug]/
│   │   ├── page.tsx           # Series detail (seasons)
│   │   └── [seasonSlug]/
│   │       └── page.tsx       # Season episodes
│
└── episode/
    └── [slug]/
        └── page.tsx           # Episode player
```

---

## 🎯 Common Tasks

### Check Sync Status
```bash
# Visit in browser or curl
curl http://localhost:3000/api/episodes/sync
```

### Add More Episodes
```typescript
// 1. Edit app/data/episodeIds.ts
export const EPISODE_IDS = [
  ...EPISODE_IDS,
  'tt1234567',  // New episode
];

// 2. Run sync
node scripts/sync-episodes.js
```

### Import Specific Series
```bash
# 1. Find series episodes in episodeIds.full.json
# 2. Add to episodeIds.ts
# 3. Sync
```

### Resume Interrupted Import
```bash
# If batch import stopped at episode 250
node scripts/batch-import-episodes.js 50 250
```

---

## 🔍 Testing

### Test with Few Episodes First
```typescript
// app/data/episodeIds.ts
export const EPISODE_IDS = [
  'tt0959621',  // Breaking Bad S01E01
  'tt2301451',  // Game of Thrones S01E01
];
```

### Verify Database
```bash
# MongoDB connection
mongo
use your_database
db.episodes.count()
db.tvseries.count()
```

### Test Player
- Visit episode page
- Check if video loads
- Try different episodes

---

## 📝 Environment Variables

Create `.env.local`:
```env
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## 🐛 Troubleshooting

### Episodes Not Syncing?
1. Check MongoDB connection
2. Verify IMDB IDs format (tt followed by 7-8 digits)
3. Check TMDB API access
4. Look at console errors

### Player Not Working?
1. Check IMDB ID is valid
2. Try alternative VidSrc domain (vidsrc.in, vidsrc.pm)
3. Verify episode exists on VidSrc

### Too Many Episodes?
```typescript
// Reduce the list
export const EPISODE_IDS = ALL_EPISODE_IDS.slice(0, 100);
```

---

## 📚 Full Documentation

- **TV Series System:** [README_TV_SERIES.md](README_TV_SERIES.md)
- **VidSrc Integration:** [VIDSRC_SETUP.md](VIDSRC_SETUP.md)
- **Main README:** [README.md](README.md)

---

## 🎉 You're Ready!

1. ✅ Download IDs
2. ✅ Choose episodes
3. ✅ Sync to database
4. ✅ Start server
5. ✅ Browse & watch!

**Happy Streaming! 🍿**


