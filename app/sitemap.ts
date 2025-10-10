import { MetadataRoute } from 'next';

// Fixed domain for ww1.n123movie.me
const DOMAIN = 'https://ww1.n123movie.me';

/**
 * Main sitemap - redirects to sitemap index
 * For the full sitemap structure, visit /api/sitemap-index.xml
 * 
 * This provides a basic fallback sitemap with essential pages
 * The complete sitemap with all 95k+ movies is available via the sitemap index
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Main static pages - basic fallback
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
      priority: 0.9,
    },
    {
      url: `${DOMAIN}/movies`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
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
      url: `${DOMAIN}/country`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  return staticPages;
}