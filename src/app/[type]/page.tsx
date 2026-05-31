import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPosts, CATEGORIES_LIST, POST_TYPE_MAP, REVERSE_POST_TYPE_MAP, WordPressPost, extractPostMeta } from '@/lib/wordpress';
import PushNotificationCard from '@/components/PushNotificationCard';
import AffiliateSlot from '@/components/AffiliateSlot';

interface ArchiveProps {
  params: Promise<{
    type: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: ArchiveProps): Promise<Metadata> {
  const { type } = await params;
  const wpType = REVERSE_POST_TYPE_MAP[type];
  if (!wpType) return {};

  const cat = CATEGORIES_LIST.find((c) => c.slug === type);
  const titleName = cat ? cat.name : type.replace('-', ' ');

  return {
    title: `Latest ${titleName} 2026 – Active Government Bulletins`,
    description: `Sabhi verified ${titleName} details direct official sources se. Real-time updates check karein aur application form apply online links dekhein.`,
    alternates: {
      canonical: `/${type}`,
    },
  };
}

export const revalidate = 300; // Cache archive pages for 5 minutes

export default async function ArchivePage({ params, searchParams }: ArchiveProps) {
  const { type } = await params;
  const wpType = REVERSE_POST_TYPE_MAP[type];

  if (!wpType) {
    return notFound();
  }

  const sp = searchParams ? await searchParams : undefined;
  const pageParam = sp?.page;
  const page = pageParam ? parseInt(pageParam as string, 10) : 1;

  const cat = CATEGORIES_LIST.find((c) => c.slug === type);
  const categoryTitle = cat ? cat.name : type.replace('-', ' ');
  const categoryEmoji = cat ? cat.emoji : '📂';

  // Fetch up to 40 posts to fill out the archive view beautifully
  let posts: WordPressPost[] = [];
  try {
    posts = await getPosts(type, 40, page);
  } catch (err) {
    console.error(`Failed to fetch archives for CPT type: ${type}`, err);
  }

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": `Latest ${categoryTitle} 2026`,
      "description": `Sabhi verified ${categoryTitle} details direct official sources se. Real-time updates check karein.`,
      "url": `https://getjobupdate.co.in/${type}`,
      "mainEntity": {
        "@type": "ItemList",
        "itemListElement": posts.map((post, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "url": `https://getjobupdate.co.in/${POST_TYPE_MAP[post.type] || 'jobs'}/${post.slug}`,
          "name": post.title.rendered.replace(/(<([^>]+)>)/gi, "")
        }))
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://getjobupdate.co.in/" },
        { "@type": "ListItem", "position": 2, "name": categoryTitle, "item": `https://getjobupdate.co.in/${type}` }
      ]
    }
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />
      <div className="w-full bg-slate-50 min-h-screen py-8 font-sans">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
              Home
            </Link>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="m9 18 6-6-6-6"></path></svg>
            <span className="text-slate-900 font-medium">{categoryTitle}</span>
          </nav>

          {/* Header Section */}
          <div className="mb-10 max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl flex items-center gap-3">
              <span className="text-4xl">{categoryEmoji}</span>
              {categoryTitle}
            </h1>
            <div className="mt-4 flex flex-col gap-3">
              <p className="text-lg font-medium text-slate-600 leading-relaxed">
                Find the best {categoryTitle} for 2026. We list active vacancies and updates with clear details on age, qualifications, and how to apply. Browse daily verified updates from official sources.
              </p>
              <p className="text-base text-slate-500">
                Latest {categoryTitle.toLowerCase()} notifications. Updated daily.
              </p>
            </div>
          </div>

          {/* Layout Grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
            
            {/* Left Sidebar */}
            <aside className="hidden lg:block space-y-6">
              <div className="sticky top-24 space-y-6">
                
                {/* Explore Categories */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 font-bold text-slate-900 text-sm">
                    Explore Directories
                  </div>
                  <div className="flex flex-col">
                    {CATEGORIES_LIST.filter((c) => c.slug !== type).map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/${cat.slug}`}
                        className="px-4 py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 text-slate-600 hover:text-blue-600 text-sm font-medium transition-colors flex items-center gap-3"
                      >
                        <span className="text-lg">{cat.emoji}</span>
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <PushNotificationCard />
                
                <AffiliateSlot position="sidebar" fallbackTags={['study table', 'laptop']} />

              </div>
            </aside>

            {/* Right Main Content */}
            <div className="space-y-6">
              
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-sm font-medium text-slate-600">
                  Showing <span className="font-bold text-slate-900">{posts.length}</span> active records
                </p>
                <div className="flex items-center gap-2">
                  <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2 outline-none focus:border-blue-500 cursor-pointer">
                    <option>Latest Updates</option>
                    <option>Expiring Soon</option>
                    <option>Highest Vacancies</option>
                  </select>
                </div>
              </div>

              {/* Grid of Posts */}
              {posts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map((post) => {
                    const postTypeSlug = POST_TYPE_MAP[post.type] || 'jobs';
                    const { dept, totalPosts, qual, lastDate } = extractPostMeta(post);
                    const isNew = (Date.now() - new Date(post.date).getTime()) < 3 * 24 * 60 * 60 * 1000;
                    
                    return (
                      <Link 
                        key={post.id}
                        href={`/${postTypeSlug}/${post.slug}`}
                        className="group flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all overflow-hidden h-full"
                      >
                        {/* Colored Top Banner (Instead of Image) */}
                        <div className="h-2 w-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                        
                        <div className="p-5 flex flex-col flex-1">
                          
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <span className="inline-flex items-center gap-1.5 rounded bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700">
                              {categoryTitle}
                            </span>
                            {isNew && (
                              <span className="inline-flex items-center rounded bg-rose-500 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white">
                                New
                              </span>
                            )}
                          </div>

                          <h3 
                            className="text-[15px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-3 mb-4"
                            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                          />

                          <div className="mt-auto space-y-2.5 pt-4 border-t border-slate-100">
                            {dept && (
                              <div className="flex items-start gap-2 text-xs">
                                <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                <span className="font-medium text-slate-700 line-clamp-1">{dept}</span>
                              </div>
                            )}
                            {totalPosts && (
                              <div className="flex items-start gap-2 text-xs">
                                <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                <span className="font-medium text-slate-700">{totalPosts} Posts</span>
                              </div>
                            )}
                            {qual && (
                              <div className="flex items-start gap-2 text-xs">
                                <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v6" /></svg>
                                <span className="font-medium text-slate-700 line-clamp-1">{qual}</span>
                              </div>
                            )}
                            {lastDate && (
                              <div className="flex items-start gap-2 text-xs text-rose-600 bg-rose-50 px-2 py-1.5 rounded mt-2">
                                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span className="font-bold">Deadline: {lastDate}</span>
                              </div>
                            )}
                          </div>
                          
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <div className="p-16 flex flex-col items-center justify-center text-center bg-white border border-dashed border-slate-300 rounded-2xl">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-2xl mb-4">📭</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No Active Records Found</h3>
                  <p className="text-slate-500 text-sm max-w-sm">
                    We currently don't have any active postings under this catalog. Please check back later or subscribe to notifications.
                  </p>
                </div>
              )}

              {/* Pagination */}
              {posts.length > 0 && (
                <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm mt-8">
                  {page > 1 ? (
                    <Link href={`/${type}?page=${page - 1}`} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                      &larr; Previous
                    </Link>
                  ) : (
                    <div className="px-4 py-2 border border-slate-100 rounded-lg text-sm font-medium text-slate-300 cursor-not-allowed">
                      &larr; Previous
                    </div>
                  )}
                  
                  <span className="text-sm font-bold text-slate-600">Page {page}</span>
                  
                  {posts.length === 40 ? (
                    <Link href={`/${type}?page=${page + 1}`} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                      Next &rarr;
                    </Link>
                  ) : (
                    <div className="px-4 py-2 border border-slate-100 rounded-lg text-sm font-medium text-slate-300 cursor-not-allowed">
                      Next &rarr;
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

          {/* Aspirant Guide Footer */}
          <div className="mt-16 bg-white p-8 md:p-12 rounded-2xl border border-slate-200 shadow-sm mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 border-b border-slate-100 pb-4">
              Aspirant Guide for {categoryTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">How to stay updated?</h3>
                <p className="text-slate-600 leading-relaxed">
                  We track official portals like SSC, UPSC, and State Boards daily. Bookmark this page to get the fastest updates on {categoryTitle.toLowerCase()} notifications. Every link we provide is cross-verified for accuracy.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Why choose Get Job Update?</h3>
                <p className="text-slate-600 leading-relaxed">
                  Our platform simplifies complex government notifications. We provide direct apply links, simplified eligibility summaries, and important dates in a clean dashboard format, helping you focus on your exam preparation.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
