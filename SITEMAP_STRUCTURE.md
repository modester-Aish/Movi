# Sitemap Structure Documentation

## Overview
Complete sitemap system with **95,000+ movie URLs** organized in a sitemap index structure.

## Main Sitemap Index
**URL:** `https://ww1.n123movie.me/api/sitemap-index.xml`

This is the main entry point that lists all sub-sitemaps:

### Sub-Sitemaps

1. **Static Pages Sitemap**
   - URL: `/api/sitemap-pages`
   - Contains: Main static pages (home, search, movies, genres, years, country pages)
   - Total: ~11 URLs

2. **Years Sitemap**
   - URL: `/api/sitemap-years`
   - Contains: All years from 1900-2025 + decade pages (1900s, 1910s, etc.)
   - Total: ~139 URLs (126 years + 13 decades)

3. **Genres Sitemap**
   - URL: `/api/sitemap-genres`
   - Contains: All genre pages (action, adventure, comedy, drama, horror, etc.)
   - Total: ~28 URLs

4. **Countries Sitemap**
   - URL: `/api/sitemap-countries`
   - Contains: All country pages (USA, India, UK, Japan, South Korea, etc.)
   - Total: ~60 URLs

5. **Movies Sitemaps (Multiple)**
   - URLs: `/api/sitemap-movies/1`, `/api/sitemap-movies/2`, ... `/api/sitemap-movies/10`
   - Contains: All 95,942 movies split into chunks of 10,000 each
   - Total: 10 movie sitemaps
   - Each sitemap contains up to 10,000 movie URLs

## Total URLs
- Static Pages: ~11
- Years: ~139
- Genres: ~28
- Countries: ~60
- Movies: ~95,942
- **Grand Total: ~96,180 URLs**

## URL Structure Examples

### Movie URLs
```
https://ww1.n123movie.me/the-shawshank-redemption-tt0111161
https://ww1.n123movie.me/the-godfather-tt0068646
```

### Year URLs
```
https://ww1.n123movie.me/year/2024
https://ww1.n123movie.me/year/2020s
```

### Genre URLs
```
https://ww1.n123movie.me/genre/action
https://ww1.n123movie.me/genre/comedy
```

### Country URLs
```
https://ww1.n123movie.me/country/united-states
https://ww1.n123movie.me/country/india
```

## Robots.txt Configuration
The robots.txt file points to both:
- `/sitemap.xml` (basic fallback)
- `/api/sitemap-index.xml` (complete sitemap index with all 95k+ movies)

## Testing

### Test Sitemap Index:
```bash
curl http://localhost:3000/api/sitemap-index.xml
```

### Test Individual Sitemaps:
```bash
# Pages
curl http://localhost:3000/api/sitemap-pages

# Years
curl http://localhost:3000/api/sitemap-years

# Genres
curl http://localhost:3000/api/sitemap-genres

# Countries
curl http://localhost:3000/api/sitemap-countries

# Movies (first chunk)
curl http://localhost:3000/api/sitemap-movies/1

# Movies (second chunk)
curl http://localhost:3000/api/sitemap-movies/2
```

## Submission to Search Engines

### Google Search Console
1. Go to Google Search Console
2. Submit: `https://ww1.n123movie.me/api/sitemap-index.xml`

### Bing Webmaster Tools
1. Go to Bing Webmaster Tools
2. Submit: `https://ww1.n123movie.me/api/sitemap-index.xml`

## Benefits

1. **Complete Coverage**: All 95,942 movies are included
2. **SEO Optimized**: Proper priority and change frequency for each type of page
3. **Scalable**: Easy to add more movies or pages
4. **Fast**: Static XML generation with caching
5. **Search Engine Friendly**: Follows sitemap protocol standards

## Cache Configuration
All sitemaps are cached for 24 hours (86400 seconds) for optimal performance.

## Notes
- Movie sitemaps are split into chunks of 10,000 to stay within sitemap limits
- Each sitemap is generated dynamically but cached for performance
- Movie data is fetched from TMDB API based on bulk movie IDs
- All URLs use proper slugification for SEO


