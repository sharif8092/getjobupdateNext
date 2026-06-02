import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostsByState, STATES_LIST, POST_TYPE_MAP, WordPressPost, extractPostMeta, getDeadlineStatus } from '@/lib/wordpress';
import PushNotificationCard from '@/components/PushNotificationCard';
import AffiliateSlot from '@/components/AffiliateSlot';

interface StateArchiveProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: StateArchiveProps): Promise<Metadata> {
  const { slug } = await params;
  const state = STATES_LIST.find((s) => s.slug === slug);
  const stateName = state ? state.name : slug.replace('-', ' ');

  return {
    title: `Sarkari Job Updates in ${stateName} 2026 – Apply Online | Get Job Update`,
    description: `${stateName} me active government jobs, admit cards, sarkari results, aur regional yojanas ki verified updates. Apply online direct links.`,
    alternates: {
      canonical: `/state/${slug}`,
    },
  };
}

export const revalidate = 300;

export default async function StateArchivePage({ params }: StateArchiveProps) {
  const { slug } = await params;
  const stateObj = STATES_LIST.find((s) => s.slug === slug);

  if (!stateObj) {
    return notFound();
  }

  const stateName = stateObj.name;
  
  let posts: WordPressPost[] = [];
  try {
    posts = await getPostsByState(slug, 30);
  } catch (err) {
    console.error(`Failed to fetch state posts for: ${slug}`, err);
  }

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": `Sarkari Job Updates in ${stateName} 2026`,
      "description": `Active government jobs, admit cards, and results for ${stateName} state.`,
      "url": `https://getjobupdate.co.in/state/${slug}`,
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
        { "@type": "ListItem", "position": 2, "name": "States", "item": "https://getjobupdate.co.in/state" },
        { "@type": "ListItem", "position": 3, "name": stateName, "item": `https://getjobupdate.co.in/state/${slug}` }
      ]
    }
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />
      <div className="w-full bg-slate-50 min-h-screen flex flex-col font-sans">
        
        {/* Brand Hero Section */}
        <div className="bg-slate-900 w-full pt-16 pb-28 md:pb-36 relative overflow-hidden">
          {/* Dot grid */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '32px 32px' }} />
          {/* Glow blobs */}
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/8 rounded-full blur-3xl pointer-events-none" />
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-1.5 text-[11px] font-black uppercase text-slate-400 mb-6 tracking-widest">
              <Link href="/" className="hover:text-orange-500 transition-colors">HOME</Link>
              <span>›</span>
              <Link href="/state" className="hover:text-orange-500 transition-colors">STATE ARCHIVE</Link>
              <span>›</span>
              <span className="text-white">{stateName}</span>
            </nav>

            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-black text-white leading-[1.1] tracking-tight mb-5 flex items-center justify-center gap-3">
              <span className="text-4xl md:text-5xl">📍</span>
              <span className="text-orange-500">{stateName} Updates</span>
            </h1>
            <p className="text-slate-400 text-sm md:text-base font-medium mb-4 max-w-2xl mx-auto leading-relaxed">
              Explore all active vacancies, government exams, result notifications, and board summaries announced under {stateName} state departments.
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
                    Browse Other States
                  </div>
                  <div className="flex flex-col">
                    {STATES_LIST.filter((s) => s.slug !== slug).slice(0, 6).map((state) => (
                      <Link
                        key={state.slug}
                        href={`/state/${state.slug}`}
                        className="px-4 py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 text-slate-600 hover:text-orange-600 text-sm font-medium transition-colors flex items-center gap-3"
                      >
                        <span className="text-lg">📍</span>
                        {state.name}
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
                  <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2 outline-none focus:border-orange-500 cursor-pointer transition-colors">
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
                              {stateName}
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

            </div>
          </div>

          {/* SEO Content Block & Popular Tags */}
          <div className="mt-16 bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-6 md:p-10 mb-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-rose-400"></div>
            <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Govt Jobs & Results in {stateName}</h2>
            <div className="prose prose-sm md:prose-base max-w-none text-slate-600 space-y-4">
              <p>Welcome to the dedicated portal for <strong>{stateName} Government Jobs</strong> and regional updates in India. At GetJobUpdate, we understand that finding roles tailored to your exact location is crucial. Our system actively categorizes state-level vacancies from {stateName} Police, State PSCs, regional banking sectors, and local boards specifically for candidates residing in or willing to work in {stateName}.</p>
              <p>Ensure you never miss a deadline by bookmarking this page. Every {stateName} vacancy listed above is cross-verified directly with official recruitment boards. Click on any job to view detailed age limits, exact eligibility criteria, syllabus, and official apply online links.</p>
            </div>
            
            <div className="mt-8 pt-8 border-t border-slate-100">
              <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-widest flex items-center gap-2">
                <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                Trending States
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {STATES_LIST.slice(0, 8).map((s) => (
                  <Link key={s.slug} href={`/state/${s.slug}`} className="inline-block px-3 py-1.5 bg-slate-50 text-slate-600 text-xs font-bold rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors border border-slate-200 hover:border-orange-200">{s.name} Jobs</Link>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
