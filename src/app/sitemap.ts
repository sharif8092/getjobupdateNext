import { MetadataRoute } from 'next';
import { getPosts, CATEGORIES_LIST, POST_TYPE_MAP } from '@/lib/wordpress';

const SITE_URL = 'https://getjobupdate.co.in';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/age-calculator`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/job-matcher`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/disclaimer`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  // Add category archives
  CATEGORIES_LIST.forEach((cat) => {
    routes.push({
      url: `${SITE_URL}/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    });
  });

  // Add Web Stories index
  routes.push({
    url: `${SITE_URL}/web-stories`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  });

  // Fetch all posts from major types to add to sitemap
  // We automatically fetch up to 500 recent posts per category
  const targetTypes = ['aziz_job', 'aziz_result', 'aziz_admit', 'aziz_answerkey', 'aziz_yojana'];
  
  for (const type of targetTypes) {
    try {
      let allPosts: any[] = [];
      const categorySlug = POST_TYPE_MAP[type] || 'jobs';
      
      // Auto-paginate up to 5 pages (100 posts per page = 500 max per category)
      for (let page = 1; page <= 5; page++) {
        const posts = await getPosts(type, 100, page);
        if (!posts || posts.length === 0) break;
        
        allPosts = allPosts.concat(posts);
        
        // If we got less than 100, it means we reached the last page
        if (posts.length < 100) break;
      }
      
      allPosts.forEach((post) => {
        routes.push({
          url: `${SITE_URL}/${categorySlug}/${post.slug}`,
          lastModified: new Date(post.modified || post.date),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
        
        // Auto-generated Web Story for Jobs
        if (type === 'aziz_job') {
          routes.push({
            url: `${SITE_URL}/web-stories/${post.slug}`,
            lastModified: new Date(post.modified || post.date),
            changeFrequency: 'weekly',
            priority: 0.6,
          });
        }
      });
    } catch (e /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
      console.error(`Failed to fetch sitemap posts for type: ${type}`);
    }
  }

  return routes;
}
