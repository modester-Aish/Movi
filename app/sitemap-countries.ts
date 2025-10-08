import { MetadataRoute } from 'next';

const DOMAIN = 'https://ww1.n123movie.me';

export default function countriesSitemap(): Promise<MetadataRoute.Sitemap> {
  const countryPages: MetadataRoute.Sitemap = [];

  // Main country page
  countryPages.push({
    url: `${DOMAIN}/country`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  });

  // Popular countries
  const countries = [
    'united-states', 'india', 'china', 'japan', 'south-korea', 'united-kingdom',
    'france', 'germany', 'italy', 'spain', 'canada', 'australia', 'brazil',
    'mexico', 'russia', 'turkey', 'iran', 'thailand', 'hong-kong', 'taiwan'
  ];

  countries.forEach(country => {
    countryPages.push({
      url: `${DOMAIN}/country/${country}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    });
  });

  return Promise.resolve(countryPages);
}
