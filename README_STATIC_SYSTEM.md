# 🎬 Static TV Series System - No Database Required!

## 📋 Overview

Ye ek **completely static system** hai jo **database use nahi karta**. Aapki sheet se data le kar direct files mein store karta hai.

## 🚀 **Quick Start:**

### **Step 1: Add Your Sheet Data**
Edit `scripts/import-from-sheet.js` mein aapki actual data add karein:

```javascript
const sheetData = [
  {
    episode_imdb_id: "tt0959621",
    series_name: "Breaking Bad",
    season_number: 1,
    episode_number: 1,
    episode_name: "Pilot",
    // ... more fields
  },
  // Add all your episodes here
];
```

### **Step 2: Generate Static Files**
```bash
node scripts/import-from-sheet.js
```

### **Step 3: Browse Your Content**
```
http://localhost:3000/series-static
```

---

## 📁 **File Structure:**

```
app/
├── data/
│   └── tvSeriesStatic.ts          # Static data file (generated)
│
├── series-static/
│   ├── page.tsx                   # Series list page
│   ├── layout.tsx
│   ├── [slug]/
│   │   ├── page.tsx               # Series detail page
│   │   └── [seasonSlug]/
│   │       └── page.tsx           # Season episodes page
│
├── episode-static/
│   ├── layout.tsx
│   └── [slug]/
│       └── page.tsx               # Episode player page
│
└── scripts/
    └── import-from-sheet.js       # Data import script
```

---

## 🎯 **Key Features:**

✅ **No Database** - Pure static files  
✅ **Fast Loading** - No API calls  
✅ **Easy Management** - Edit one file, everything updates  
✅ **VidSrc Player** - Direct video streaming  
✅ **Complete Navigation** - Series → Seasons → Episodes  
✅ **Responsive Design** - Mobile, tablet, desktop  

---

## 📊 **Data Format:**

### **Episode Object:**
```typescript
{
  episode_imdb_id: "tt0959621",      // Required
  series_name: "Breaking Bad",       // Required  
  season_number: 1,                  // Required
  episode_number: 1,                 // Required
  episode_name: "Pilot",             // Required
  overview: "...",                   // Optional
  still_path: "/image.jpg",          // Optional
  air_date: "2008-01-20",           // Optional
  vote_average: 8.2,                // Optional
  runtime: 58,                      // Optional
  series_imdb_id: "tt0903747",      // Optional
  series_tmdb_id: 1396              // Optional
}
```

### **Series Object:**
```typescript
{
  series_name: "Breaking Bad",       // Required
  series_imdb_id: "tt0903747",      // Optional
  series_tmdb_id: 1396,             // Optional
  poster_path: "/poster.jpg",       // Optional
  backdrop_path: "/backdrop.jpg",   // Optional
  overview: "...",                  // Optional
  first_air_date: "2008-01-20",    // Optional
  number_of_seasons: 5,             // Optional
  episodes: [...]                   // Array of episodes
}
```

---

## 🛠️ **How to Add Your Data:**

### **Option 1: Edit Script Directly**
1. Open `scripts/import-from-sheet.js`
2. Replace `sheetData` array with your data
3. Run: `node scripts/import-from-sheet.js`

### **Option 2: CSV/Excel Import**
1. Convert your sheet to JSON format
2. Replace the data in the script
3. Run the import

### **Option 3: Manual Edit**
1. Open `app/data/tvSeriesStatic.ts`
2. Add episodes directly to `STATIC_TV_SERIES` array

---

## 🎥 **Player Integration:**

### **VidSrc Player:**
```typescript
// Episode player automatically uses:
src={`https://vidsrc.xyz/embed/tv/${series_imdb_id}/${season}-${episode}`}
```

### **Player Features:**
- ✅ Multiple quality options
- ✅ Subtitles support  
- ✅ Autoplay control
- ✅ Fullscreen support

---

## 📱 **Pages:**

### **1. Series List:** `/series-static`
- Grid of all TV series
- Episode count badges
- Hover effects

### **2. Series Detail:** `/series-static/[slug]`
- Series poster and info
- Seasons list
- Episode counts per season

### **3. Season Episodes:** `/series-static/[slug]/season-[n]`
- All episodes for a season
- Episode thumbnails
- Play buttons

### **4. Episode Player:** `/episode-static/[slug]`
- Video player
- Episode details
- Navigation to other episodes

---

## 🔧 **Customization:**

### **Add New Series:**
```typescript
// In tvSeriesStatic.ts
export const STATIC_TV_SERIES: StaticSeries[] = [
  // ... existing series
  {
    series_name: "Your New Series",
    series_tmdb_id: 1234,
    episodes: [
      // ... episodes
    ]
  }
];
```

### **Change Player:**
```typescript
// In episode player page
src={`https://your-player.com/embed/${episode_id}`}
```

### **Modify Styling:**
- Edit Tailwind classes in page components
- Global styles in `app/globals.css`

---

## 📈 **Performance:**

### **Benefits:**
- ⚡ **Fast Loading** - No database queries
- 🚀 **Instant Navigation** - All data in memory
- 💾 **Low Server Load** - Static file serving
- 🔄 **Easy Updates** - Regenerate file when needed

### **Limitations:**
- 📊 **File Size** - Large datasets increase bundle size
- 🔄 **Manual Updates** - Need to regenerate files
- 💾 **Memory Usage** - All data loaded in browser

---

## 🎯 **Best Practices:**

### **For Small Datasets (< 1000 episodes):**
- ✅ Use static system
- ✅ Fast and simple
- ✅ No server requirements

### **For Large Datasets (> 1000 episodes):**
- 📊 Consider pagination
- 📁 Split into multiple files
- 🔄 Use lazy loading

---

## 📞 **Support:**

### **Common Issues:**
1. **Page not loading?** Check if `tvSeriesStatic.ts` exists
2. **No episodes showing?** Verify data format in import script
3. **Player not working?** Check VidSrc URL format
4. **Images not loading?** Verify image paths

### **File Locations:**
- Data file: `app/data/tvSeriesStatic.ts`
- Import script: `scripts/import-from-sheet.js`
- Pages: `app/series-static/` and `app/episode-static/`

---

## ✨ **Summary:**

**Static TV Series System** = **No Database + Fast + Simple**

Perfect for:
- ✅ Small to medium TV series collections
- ✅ Fast development and deployment  
- ✅ No server-side database setup
- ✅ Easy content management

---

**Ready to use! Just add your data and go! 🚀**

