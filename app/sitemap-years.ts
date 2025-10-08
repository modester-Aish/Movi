import { MetadataRoute } from 'next';

const DOMAIN = 'https://ww1.n123movie.me';

export default function yearsSitemap(): Promise<MetadataRoute.Sitemap> {
  const yearsPages: MetadataRoute.Sitemap = [];
  
  // Main years page
  yearsPages.push({
    url: `${DOMAIN}/years`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  });

  // Individual years (1900-2025)
  for (let year = 1900; year <= 2025; year++) {
    yearsPages.push({
      url: `${DOMAIN}/year/${year}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    });
  }

  // Decade pages (1900s, 1910s, etc.)
  for (let decade = 1900; decade <= 2020; decade += 10) {
    yearsPages.push({
      url: `${DOMAIN}/year/${decade}s`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    });
  }

  return Promise.resolve(yearsPages);
}
