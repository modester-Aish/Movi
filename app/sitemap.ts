import { MetadataRoute } from 'next';
import { getRandomMovieIds } from '@/utils/movieIds';
import { getMoviesByImdbIds } from '@/api/tmdb';
import { generateMovieUrl } from "@/lib/slug";

// Fixed domain for ww1.n123movie.me
const DOMAIN = 'https://ww1.n123movie.me';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Main static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: DOMAIN,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${DOMAIN}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${DOMAIN}/genres`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${DOMAIN}/years`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${DOMAIN}/movies`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${DOMAIN}/country`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${DOMAIN}/action`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${DOMAIN}/adventure`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${DOMAIN}/united-states`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${DOMAIN}/admin`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // Generate all years (1900-2025)
  const yearsPages: MetadataRoute.Sitemap = [];
  for (let year = 1900; year <= 2025; year++) {
    yearsPages.push({
      url: `${DOMAIN}/year/${year}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    });
  }

  // Generate decade pages
  const decadePages: MetadataRoute.Sitemap = [];
  for (let decade = 1900; decade <= 2020; decade += 10) {
    decadePages.push({
      url: `${DOMAIN}/year/${decade}s`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    });
  }

  // Popular genres
  const genrePages: MetadataRoute.Sitemap = [
    { url: `${DOMAIN}/genre/action`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${DOMAIN}/genre/adventure`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${DOMAIN}/genre/comedy`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${DOMAIN}/genre/drama`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${DOMAIN}/genre/horror`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${DOMAIN}/genre/romance`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${DOMAIN}/genre/thriller`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${DOMAIN}/genre/sci-fi`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${DOMAIN}/genre/fantasy`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${DOMAIN}/genre/crime`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${DOMAIN}/genre/mystery`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${DOMAIN}/genre/family`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${DOMAIN}/genre/animation`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${DOMAIN}/genre/documentary`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${DOMAIN}/genre/war`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${DOMAIN}/genre/western`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${DOMAIN}/genre/musical`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${DOMAIN}/genre/biography`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${DOMAIN}/genre/history`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${DOMAIN}/genre/sport`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ];

  // Popular countries
  const countryPages: MetadataRoute.Sitemap = [
    { url: `${DOMAIN}/country/united-states`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${DOMAIN}/country/india`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${DOMAIN}/country/china`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${DOMAIN}/country/japan`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${DOMAIN}/country/south-korea`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${DOMAIN}/country/united-kingdom`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${DOMAIN}/country/france`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${DOMAIN}/country/germany`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${DOMAIN}/country/italy`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${DOMAIN}/country/spain`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${DOMAIN}/country/canada`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${DOMAIN}/country/australia`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${DOMAIN}/country/brazil`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${DOMAIN}/country/mexico`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${DOMAIN}/country/russia`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${DOMAIN}/country/turkey`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${DOMAIN}/country/iran`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${DOMAIN}/country/thailand`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${DOMAIN}/country/hong-kong`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${DOMAIN}/country/taiwan`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ];

  try {
    // Get movies for sitemap (limit to 5000 for comprehensive coverage)
    const movieIds = await getRandomMovieIds(5000);
    const movies = await getMoviesByImdbIds(movieIds);
    
    // Generate movie pages
    const moviePages: MetadataRoute.Sitemap = movies
      .filter(movie => movie.imdb_id && movie.imdb_id.trim() !== '')
      .map((movie) => ({
        url: `${DOMAIN}${generateMovieUrl(movie.title, movie.imdb_id)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));

    return [
      ...staticPages,
      ...yearsPages,
      ...decadePages,
      ...genrePages,
      ...countryPages,
      ...moviePages
    ];
  } catch (error) {
    console.error('Error generating comprehensive sitemap:', error);
    // Return static pages if movie data fails
    return [
      ...staticPages,
      ...yearsPages,
      ...decadePages,
      ...genrePages,
      ...countryPages
    ];
  }
}