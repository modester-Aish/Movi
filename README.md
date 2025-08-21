# CineVerse - Movie Collection Website

A modern movie website built with Next.js, TypeScript, and Tailwind CSS, featuring TMDB API integration and a massive collection of 80k-90k movies.

## Features

- 🎬 **TMDB API Integration** - Fetch movie data using your API key
- 🎥 **Video Player** - Watch movies using vidsrc.me iframe integration
- 📱 **Responsive Design** - Works on all devices
- 🔍 **Advanced Search** - Search through your entire movie collection
- 🏷️ **Category System** - Organized by genres and featured collections
- 🎨 **Modern UI** - Beautiful purple theme design
- ⬇️ **Download Links** - Multiple download options for each movie
- 💬 **Comments Section** - User interaction features
- 📊 **Massive Collection** - Handle 80k-90k movies efficiently
- 📊 **Google Sheets Integration** - Easy management of movie IDs

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- TMDB API key

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd movies
```

2. Install dependencies:
```bash
npm install
```

3. Add your TMDB API key to `app/api/tmdb.ts`:
```typescript
const TMDB_API_KEY = 'your-api-key-here';
```

4. Add your 80k-90k movie IDs to `app/data/bulkMovieIds.ts`:
```typescript
export const BULK_MOVIE_IDS = [
  'tt0111161', // The Shawshank Redemption
  'tt0068646', // The Godfather
  // ... paste all your 80k-90k IDs here
  // Make sure each ID is in the format: 'ttXXXXXXXXX'
];
```

**Or use Google Sheets:** See `MOVIE_IDS_TEMPLATE.md` for Google Sheets setup instructions.

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Adding Your Movie IDs

### Step 1: Prepare Your Movie IDs
Make sure your movie IDs are in the correct format:
- Each ID should start with `tt` followed by 7-8 digits
- Example: `tt0111161`, `tt0068646`, etc.

### Step 2: Add to bulkMovieIds.ts
Open `app/data/bulkMovieIds.ts` and replace the example IDs with your actual movie IDs:

```typescript
export const BULK_MOVIE_IDS = [
  // Paste your 80k-90k movie IDs here
  'tt0111161',
  'tt0068646',
  'tt0071562',
  // ... continue with all your IDs
];
```

### Step 3: Automatic Organization
The system will automatically:
- Organize movies into categories
- Create featured collections
- Handle pagination efficiently
- Enable search functionality

## Category System

The website automatically organizes your movies into categories:

### Homepage Categories
- **Featured Movies** - Hand-picked best movies
- **Trending Now** - Most popular movies right now
- **New Releases** - Latest movie releases
- **Top Rated** - Highest rated movies

### Genre Categories
- **Action** - Action and adventure movies
- **Drama** - Dramatic and emotional stories
- **Comedy** - Funny and entertaining movies
- **Thriller** - Suspenseful and thrilling movies
- **Horror** - Scary and horror movies
- **Romance** - Love and romantic stories
- **Sci-Fi** - Science fiction movies
- **Animation** - Animated movies and cartoons
- **Documentary** - Documentary films
- **Family** - Family-friendly movies

## Pages

### Homepage (`/`)
- Hero section with featured movies
- Category navigation (Featured/Trending/New/Top Rated)
- Genre browsing with toggle
- Movie grid with hover effects
- Load more functionality
- Search modal for quick access

### Movie Detail Page (`/movie/[imdbId]`)
- Movie information and poster
- Video player using vidsrc.me iframe
- Download links (PkSpeed, MixDrop, CloudVideo, Streamtape)
- Similar movies recommendations
- Comments section

## Search Functionality

- **Global Search** - Search through all movies from the navbar
- **Real-time Results** - Instant search with debouncing
- **Movie Details** - Shows poster, title, year, and rating
- **Direct Navigation** - Click to go directly to movie page

## API Integration

The website uses TMDB API to fetch:
- Movie details (title, overview, poster, genres)
- Movie ratings and release dates
- Similar movies
- Movie videos/trailers

### API Functions
- `getMovieByImdbId(imdbId)` - Get movie details by IMDB ID
- `getMoviesByImdbIds(imdbIds)` - Get multiple movies by IMDB IDs
- `getSimilarMovies(movieId)` - Get similar movies
- `getMovieVideos(movieId)` - Get movie videos/trailers

## Video Player Integration

The website uses vidsrc.me for video streaming:
```html
<iframe src="https://vidsrc.me/embed/movie?imdb=tt0000008" 
        style="width: 100%; height: 100%;" 
        frameborder="0" 
        referrerpolicy="origin" 
        allowfullscreen>
</iframe>
```

## Download Links

Each movie page includes download links for:
- **PkSpeed** - 360p and 720p quality
- **MixDrop** - 360p and 720p quality  
- **CloudVideo** - 360p and 720p quality
- **Streamtape** - 360p and 720p quality

## Performance Optimization

- **Lazy Loading** - Movies load as needed
- **Caching** - Movie data cached to reduce API calls
- **Pagination** - Efficient handling of large datasets
- **Image Optimization** - Next.js Image component
- **Debounced Search** - Prevents excessive API calls

## Customization

### Styling
- Uses Tailwind CSS for styling
- Dark theme with gradient backgrounds
- Hover effects and animations
- Responsive grid layouts

### Components
- `Navbar` - Navigation with search modal
- `SearchModal` - Advanced search functionality
- Movie cards with hover effects
- Video player with instructions
- Download links with different providers

## Deployment

1. Build the project:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

Or deploy to Vercel:
```bash
npm install -g vercel
vercel
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue on GitHub or contact the maintainer.

---

**Note**: Make sure to respect TMDB's terms of service and rate limits when using their API. The video player integration is for demonstration purposes only.
