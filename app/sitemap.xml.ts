import { MetadataRoute } from 'next';

const DOMAIN = 'https://ww1.n123movie.me';

export default function sitemapIndex(): MetadataRoute.Sitemap {
  return [
    {
      url: `${DOMAIN}/sitemap-pages.xml`,
      lastModified: new Date(),
    },
    {
      url: `${DOMAIN}/sitemap-movies.xml`,
      lastModified: new Date(),
    },
    {
      url: `${DOMAIN}/sitemap-genres.xml`,
      lastModified: new Date(),
    },
    {
      url: `${DOMAIN}/sitemap-years.xml`,
      lastModified: new Date(),
    },
    {
      url: `${DOMAIN}/sitemap-countries.xml`,
      lastModified: new Date(),
    },
  ];
}
