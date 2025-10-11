# Sitemap Structure Summary

## Overview
- **Total Movies:** ~95,942 (will create ~96 sitemaps)
- **Total Series:** ~17,000+ (will create ~18 sitemaps)
- **Items per sitemap:** 1,000

---

## Sitemap Index XML
**URL:** `https://ww1.n123movie.me/api/sitemap-index.xml`

### Structure:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  
  <!-- Static Pages -->
  <sitemap>
    <loc>https://ww1.n123movie.me/api/sitemap-pages</loc>
    <lastmod>2025-10-11T...</lastmod>
  </sitemap>
  
  <sitemap>
    <loc>https://ww1.n123movie.me/api/sitemap-years</loc>
    <lastmod>2025-10-11T...</lastmod>
  </sitemap>
  
  <sitemap>
    <loc>https://ww1.n123movie.me/api/sitemap-genres</loc>
    <lastmod>2025-10-11T...</lastmod>
  </sitemap>
  
  <sitemap>
    <loc>https://ww1.n123movie.me/api/sitemap-countries</loc>
    <lastmod>2025-10-11T...</lastmod>
  </sitemap>
  
  <!-- Movies (96 sitemaps - 1k each) -->
  <sitemap>
    <loc>https://ww1.n123movie.me/api/sitemap-movies/1</loc>
    <lastmod>2025-10-11T...</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://ww1.n123movie.me/api/sitemap-movies/2</loc>
    <lastmod>2025-10-11T...</lastmod>
  </sitemap>
  ... (up to 96)
  
  <!-- Series (18 sitemaps - 1k each) -->
  <sitemap>
    <loc>https://ww1.n123movie.me/api/sitemap-series/1</loc>
    <lastmod>2025-10-11T...</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://ww1.n123movie.me/api/sitemap-series/2</loc>
    <lastmod>2025-10-11T...</lastmod>
  </sitemap>
  ... (up to 18)
  
</sitemapindex>
```

---

## Movie Sitemap Example
**URL:** `https://ww1.n123movie.me/api/sitemap-movies/1`

### Structure:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  
  <url>
    <loc>https://ww1.n123movie.me/the-godfather-tt0068646</loc>
    <lastmod>2025-10-11T...</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>https://ww1.n123movie.me/the-shawshank-redemption-tt0111161</loc>
    <lastmod>2025-10-11T...</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- ... 1000 movies total per sitemap -->
  
</urlset>
```

**Movie URL Format:** `/movie-name-tt1234567`
- Clean, SEO-friendly slugs
- IMDB ID at the end for uniqueness

---

## Series Sitemap Example
**URL:** `https://ww1.n123movie.me/api/sitemap-series/1`

### Structure:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  
  <url>
    <loc>https://ww1.n123movie.me/breaking-bad-1396</loc>
    <lastmod>2025-10-11T...</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>https://ww1.n123movie.me/game-of-thrones-1399</loc>
    <lastmod>2025-10-11T...</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- ... 1000 series total per sitemap -->
  
</urlset>
```

**Series URL Format:** `/series-name-1234`
- Clean, SEO-friendly slugs (NO /series/ prefix)
- TMDB ID at the end for uniqueness

---

## Summary of Changes

### ✅ What Changed:
1. **Movies:** Changed from 10k to 1k per sitemap
2. **Series:** New separate sitemaps created (1k each)
3. **Index:** Updated to include both movie and series sitemaps

### ✅ What Stayed Same:
- All other functionality remains unchanged
- No impact on existing routes or pages
- Database structure unchanged
- All other API endpoints unchanged

---

## Sitemap Endpoints

### Main Index:
- `/api/sitemap-index.xml` - Master sitemap index

### Movie Sitemaps:
- `/api/sitemap-movies/1` (Movies 1-1000)
- `/api/sitemap-movies/2` (Movies 1001-2000)
- ...
- `/api/sitemap-movies/96` (Movies 95001-95942)

### Series Sitemaps:
- `/api/sitemap-series/1` (Series 1-1000)
- `/api/sitemap-series/2` (Series 1001-2000)
- ...
- `/api/sitemap-series/18` (Series 17001-17000+)

---

## Testing URLs (Local):
- http://localhost:3000/api/sitemap-index.xml
- http://localhost:3000/api/sitemap-movies/1
- http://localhost:3000/api/sitemap-series/1

## Production URLs:
- https://ww1.n123movie.me/api/sitemap-index.xml
- https://ww1.n123movie.me/api/sitemap-movies/1
- https://ww1.n123movie.me/api/sitemap-series/1

