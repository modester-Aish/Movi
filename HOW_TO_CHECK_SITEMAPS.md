# How to Check Sitemaps Locally

## ✅ Generated Files Location

```
public/sitemaps-real/
├── sitemap-index.xml      (Main index)
└── sitemap-movies-1.xml   (1,864 movie URLs)
```

## 🔍 Method 1: Open in Browser

### Windows Chrome:
```
file:///C:/Users/HUSSNAIN.COM/OneDrive/Desktop/movies/public/sitemaps-real/sitemap-movies-1.xml
```

### Or use command:
```bash
start chrome "public\sitemaps-real\sitemap-movies-1.xml"
```

## 🔍 Method 2: View in Text Editor

```bash
notepad public\sitemaps-real\sitemap-movies-1.xml
```

Or VS Code:
```bash
code public\sitemaps-real\sitemap-movies-1.xml
```

## 🔍 Method 3: Check via PowerShell

### See first 20 URLs:
```powershell
Get-Content public\sitemaps-real\sitemap-movies-1.xml | Select-String '<loc>' | Select-Object -First 20
```

### Count total URLs:
```powershell
(Get-Content public\sitemaps-real\sitemap-movies-1.xml | Select-String '<loc>').Count
```

### Verify URLs format:
```powershell
Get-Content public\sitemaps-real\sitemap-movies-1.xml | Select-String '<loc>https://ww1.n123movie.me/.*-tt\d+</loc>' | Select-Object -First 10
```

## ✅ What to Check

1. **File exists?** ✓
2. **URLs have movie titles?** ✓ (e.g., `/one-piece-film-red-tt16183464`)
3. **URLs match your movie pages?** ✓
4. **Valid XML format?** ✓

## 📊 Current Status

- ✅ File: `sitemap-movies-1.xml`
- ✅ Size: 364 KB
- ✅ URLs: 1,864
- ✅ Format: `https://ww1.n123movie.me/movie-title-tt1234567`

## 🎯 Sample URLs in File

```xml
<url>
  <loc>https://ww1.n123movie.me/the-smell-of-money-tt16166918</loc>
  <lastmod>2025-10-08T20:42:36.443Z</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>
<url>
  <loc>https://ww1.n123movie.me/one-piece-film-red-tt16183464</loc>
  <lastmod>2025-10-08T20:42:36.443Z</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>
```

## 🚀 Next Steps

1. ✅ Files generated successfully
2. ✅ URLs are real and match movie detail pages
3. ⏳ **Choose:**
   - Generate more movies (95K total)
   - Use API routes (already working)
4. 📤 Deploy and submit to Google/Bing

## 💡 Tips

- XML files browser mein colorful dikhti hain (syntax highlighting)
- Agar errors hain to browser mein red highlight hogi
- Valid XML = No red errors in browser
- Your file is ✅ VALID!


