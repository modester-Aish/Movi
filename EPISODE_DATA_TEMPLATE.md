# Episode Data Template

## How to Add Episodes to tvSeriesStatic.ts

Open `app/data/tvSeriesStatic.ts` and add your series data in this format:

```typescript
export const TV_SERIES_STATIC: TVSeriesStatic = {
  // Example: Breaking Bad (tt0903747)
  "tt0903747": {
    tmdb_id: 1396,
    name: "Breaking Bad",
    seasons: [
      {
        season_number: 1,
        episodes: [
          { episode_number: 1, episode_imdb_id: "tt0959621", episode_name: "Pilot" },
          { episode_number: 2, episode_imdb_id: "tt0959337", episode_name: "Cat's in the Bag..." },
          { episode_number: 3, episode_imdb_id: "tt1054724", episode_name: "...And the Bag's in the River" },
          // ... more episodes
        ]
      },
      {
        season_number: 2,
        episodes: [
          { episode_number: 1, episode_imdb_id: "tt1232248", episode_name: "Seven Thirty-Seven" },
          // ... more episodes
        ]
      }
      // ... more seasons
    ]
  },
  
  // Add more series here...
  "tt0944947": {
    tmdb_id: 1399,
    name: "Game of Thrones",
    seasons: [
      // ... seasons data
    ]
  }
};
```

## Required Fields:

### Series Level (each IMDB ID entry):
- **tmdb_id**: TMDB ID of the series (number)
- **name**: Series name (string) - optional but recommended
- **seasons**: Array of season objects

### Season Level:
- **season_number**: Season number (1, 2, 3, etc.)
- **episodes**: Array of episode objects

### Episode Level:
- **episode_number**: Episode number within the season (1, 2, 3, etc.)
- **episode_imdb_id**: IMDB ID of the episode (e.g., "tt0959621")
- **episode_name**: Name of the episode (optional)

## Steps to Add Your Data:

1. Open `app/data/tvSeriesStatic.ts`
2. Find the series IMDB ID from `app/data/tvSeriesIds.ts`
3. Add the series object with all seasons and episodes
4. Save the file
5. Test by visiting: `/series/series-name-{tmdb_id}`

## Example Entry:

```typescript
"tt0903747": {
  tmdb_id: 1396,
  name: "Breaking Bad",
  seasons: [
    {
      season_number: 1,
      episodes: [
        { episode_number: 1, episode_imdb_id: "tt0959621", episode_name: "Pilot" }
      ]
    }
  ]
}
```

## Note:
- **TMDB ID** is required for fetching series details from TMDB API
- **Episode IMDB IDs** are required for the VidSrc player to work
- You can get TMDB IDs from: https://www.themoviedb.org/
- Episode names are optional - system will use "Episode X" as fallback

