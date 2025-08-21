# Movie IDs Google Sheets Template

## 📊 Google Sheets Setup for 90k Movie IDs

### Step 1: Create Google Sheets
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it: "CineVerse Movie IDs Database"

### Step 2: Setup Columns
Create the following columns in your spreadsheet:

| Column A | Column B | Column C | Column D | Column E |
|----------|----------|----------|----------|----------|
| **Movie ID** | **Title** | **Year** | **Genre** | **Category** |
| tt0111161 | The Shawshank Redemption | 1994 | Drama | FEATURED |
| tt0068646 | The Godfather | 1972 | Crime/Drama | TOP_RATED |
| tt0071562 | The Godfather Part II | 1974 | Crime/Drama | TOP_RATED |
| tt0468569 | The Dark Knight | 2008 | Action/Drama | TRENDING |
| tt0050083 | 12 Angry Men | 1957 | Drama | FEATURED |

### Step 3: Column Descriptions

**Column A - Movie ID:**
- Format: `ttXXXXXXXXX` (where X are numbers)
- Example: `tt0111161`, `tt0068646`
- This is the IMDB ID format

**Column B - Title:**
- Movie title (optional, for reference)
- Example: "The Shawshank Redemption"

**Column C - Year:**
- Release year (optional, for reference)
- Example: 1994

**Column D - Genre:**
- Primary genre (optional, for reference)
- Example: "Drama", "Action", "Comedy"

**Column E - Category:**
- Assign to one of these categories:
  - `FEATURED` - Hand-picked best movies
  - `TRENDING` - Most popular movies
  - `NEW_RELEASES` - Latest releases
  - `TOP_RATED` - Highest rated movies
  - `ACTION` - Action movies
  - `DRAMA` - Drama movies
  - `COMEDY` - Comedy movies
  - `THRILLER` - Thriller movies
  - `HORROR` - Horror movies
  - `ROMANCE` - Romance movies
  - `SCI_FI` - Science fiction movies
  - `ANIMATION` - Animated movies
  - `DOCUMENTARY` - Documentary films
  - `FAMILY` - Family-friendly movies

### Step 4: Add Your 90k Movie IDs

1. **Copy your movie IDs** into Column A
2. **Fill in other columns** as needed (optional)
3. **Categorize movies** in Column E

### Step 5: Export for Website

Once you have all your movie IDs:

1. **Select Column A** (Movie IDs only)
2. **Copy the data**
3. **Paste into** `app/data/bulkMovieIds.ts`:

```typescript
export const BULK_MOVIE_IDS = [
  // Paste your movie IDs here
  'tt0111161',
  'tt0068646',
  'tt0071562',
  // ... continue with all your IDs
];
```

### Step 6: Share Google Sheets Link

After setting up your Google Sheets:

1. **Click "Share"** button
2. **Set permissions** to "Anyone with the link can view"
3. **Copy the link** and share it

### Example Google Sheets Structure:

```
A1: Movie ID    | B1: Title                    | C1: Year | D1: Genre | E1: Category
A2: tt0111161   | B2: The Shawshank Redemption | C2: 1994 | D2: Drama | E2: FEATURED
A3: tt0068646   | B3: The Godfather            | C3: 1972 | D3: Crime | E3: TOP_RATED
A4: tt0071562   | B4: The Godfather Part II    | C4: 1974 | D4: Crime | E4: TOP_RATED
A5: tt0468569   | B5: The Dark Knight          | C5: 2008 | D5: Action| E5: TRENDING
```

### Tips:

1. **Start with popular movies** in FEATURED category
2. **Use TRENDING** for recent popular movies
3. **Use NEW_RELEASES** for movies from last 2-3 years
4. **Use TOP_RATED** for movies with high ratings
5. **Distribute remaining movies** across genre categories

### Quick Import Script:

You can also create a script to automatically import from Google Sheets:

```javascript
// Google Apps Script to export movie IDs
function exportMovieIds() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getRange("A2:A" + sheet.getLastRow()).getValues();
  const movieIds = data.map(row => `'${row[0]}'`).join(',\n');
  
  console.log('Copy this to bulkMovieIds.ts:');
  console.log('export const BULK_MOVIE_IDS = [');
  console.log(movieIds);
  console.log('];');
}
```

---

**Note:** Make sure all your movie IDs are in the correct IMDB format (`ttXXXXXXXXX`) before importing to the website.
