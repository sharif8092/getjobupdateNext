import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPosts, CATEGORIES_LIST, POST_TYPE_MAP, REVERSE_POST_TYPE_MAP, WordPressPost, extractPostMeta, getDeadlineStatus } from '@/lib/wordpress';
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
      <div className="w-full bg-slate-50 min-h-screen flex flex-col font-sans">
        
        {/* Brand Hero Section */}
        <div className="bg-slate-900 w-full pt-16 pb-28 md:pb-36 relative overflow-hidden z-0">
          {/* Performant dot grid */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-[-1]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '32px 32px' }} />
          {/* Optimized Glow blobs */}
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] pointer-events-none z-[-1]" style={{ background: 'radial-gradient(circle, rgba(234,88,12,0.12) 0%, rgba(234,88,12,0) 70%)' }} />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none z-[-1]" style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.1) 0%, rgba(79,70,229,0) 70%)' }} />
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-1.5 text-[11px] font-black uppercase text-slate-400 mb-6 tracking-widest">
              <Link href="/" className="hover:text-orange-500 transition-colors">HOME</Link>
              <span>›</span>
              <span className="text-white">{categoryTitle}</span>
            </nav>

            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-black text-white leading-[1.1] tracking-tight mb-5 flex items-center justify-center gap-3">
              <span className="text-4xl md:text-5xl">{categoryEmoji}</span>
              <span className="text-orange-500">{categoryTitle}</span>
            </h1>
            <p className="text-slate-400 text-sm md:text-base font-medium mb-4 max-w-2xl mx-auto leading-relaxed">
              Find the best {categoryTitle} for 2026. We list active vacancies and updates with clear details on age, qualifications, and how to apply. Browse daily verified updates from official sources.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full -mt-12 md:-mt-20 relative z-20 pb-12">
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
                        className="group flex flex-col bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:border-orange-200 transition-all duration-300 overflow-hidden h-full relative"
                      >
                        {/* Hover Gradient Accent Line */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        <div className="p-5 flex flex-col flex-1">
                          
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <span className="inline-flex items-center gap-1.5 rounded-md bg-orange-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-700 border border-orange-100">
                              {categoryTitle}
                            </span>
                            {isNew && (
                              <span className="inline-flex items-center rounded bg-rose-500 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-sm">
                                New
                              </span>
                            )}
                          </div>

                          <h3 
                            className="text-[15px] font-bold text-slate-900 group-hover:text-orange-600 transition-colors leading-snug line-clamp-3 mb-4"
                            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                          />

                          <div className="mt-auto space-y-2.5 pt-4 border-t border-slate-100">
                            {dept && (
                              <div className="flex items-start gap-2 text-xs">
                                <span className="font-bold text-slate-400 shrink-0 w-16">Dept:</span>
                                <span className="font-semibold text-slate-700 line-clamp-1">{dept}</span>
                              </div>
                            )}
                            {totalPosts && (
                              <div className="flex items-start gap-2 text-xs">
                                <span className="font-bold text-slate-400 shrink-0 w-16">Posts:</span>
                                <span className="font-semibold text-slate-700">{totalPosts} Vacancies</span>
                              </div>
                            )}
                            {qual && (
                              <div className="flex items-start gap-2 text-xs">
                                <span className="font-bold text-slate-400 shrink-0 w-16">Eligible:</span>
                                <span className="font-semibold text-slate-700 line-clamp-1">{qual}</span>
                              </div>
                            )}
                            {lastDate && (() => {
                              const status = getDeadlineStatus(lastDate);
                              return (
                                <div className={`flex items-start gap-2 text-xs px-2.5 py-1.5 rounded-lg mt-2 border ${status.bg} ${status.text} ${status.border}`}>
                                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                  <span className="font-bold">Deadline: {lastDate}</span>
                                </div>
                              );
                            })()}
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
                    <Link href={`/${type}?page=${page - 1}`} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-orange-600 transition-colors">
                      &larr; Previous
                    </Link>
                  ) : (
                    <div className="px-4 py-2 border border-slate-100 rounded-lg text-sm font-medium text-slate-300 cursor-not-allowed">
                      &larr; Previous
                    </div>
                  )}
                  
                  <span className="text-sm font-bold text-slate-600">Page {page}</span>
                  
                  {posts.length === 40 ? (
                    <Link href={`/${type}?page=${page + 1}`} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-orange-600 transition-colors">
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

          {/* SEO Content Block & Popular Tags */}
          <div className="mt-16 bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-6 md:p-10 mb-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-rose-400"></div>
            <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Why Choose GetJobUpdate for {categoryTitle}?</h2>
            <div className="prose prose-sm md:prose-base max-w-none text-slate-600 space-y-4">
              <p>Welcome to the most trusted platform for <strong>{categoryTitle}</strong> updates in India. Our dedicated research team ensures that every notification you see is cross-verified directly with official government gazettes, recruitment boards, and public service commissions.</p>
              <p>Whether you are searching for upcoming Sarkari Naukri, downloading the latest admit cards, or checking your exam results, we provide lightning-fast, highly accurate information to keep your career on track. Bookmark this page to get the fastest updates on {categoryTitle.toLowerCase()} notifications.</p>
            </div>
            
            <div className="mt-8 pt-8 border-t border-slate-100">
              <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-widest flex items-center gap-2">
                <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                Popular {categoryTitle} Searches
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {['10th Pass Jobs', 'Railway Recruitment 2026', 'Police Bharti', 'Bank PO Vacancies', 'SSC CGL Updates', 'State PSC Exams', 'Teaching Jobs'].map((tag) => (
                  <Link key={tag} href="#" className="inline-block px-3 py-1.5 bg-slate-50 text-slate-600 text-xs font-bold rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors border border-slate-200 hover:border-orange-200">{tag}</Link>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
