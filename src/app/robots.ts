import { MetadataRoute } from 'next';

const SITE_URL = 'https://getjobupdate.co.in';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/private/',
        '/search?*', // Do not index search query pages (crawl trap prevention)
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
