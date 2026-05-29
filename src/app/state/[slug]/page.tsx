import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostsByState, STATES_LIST, POST_TYPE_MAP, WordPressPost } from '@/lib/wordpress';

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
    title: `Sarkari Job Updates in ${stateName} 2026 – Apply Online`,
    description: `${stateName} me active government jobs, admit cards, sarkari results, aur regional yojanas ki verified updates. Apply online direct links.`,
    alternates: {
      canonical: `/state/${slug}`,
    },
  };
}

export const revalidate = 300; // Cache state pages for 5 minutes

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

  const getBadgeStyles = (postType: string) => {
    switch (postType) {
      case 'aziz_job':
        return { bg: 'bg-blue-500/10 text-blue-500 border-blue-500/20', text: 'Job', emoji: '💼' };
      case 'aziz_result':
        return { bg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', text: 'Result', emoji: '🏆' };
      case 'aziz_admit':
        return { bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20', text: 'Admit Card', emoji: '🎟️' };
      case 'aziz_yojana':
        return { bg: 'bg-rose-500/10 text-rose-500 border-rose-500/20', text: 'Yojana', emoji: '🇮🇳' };
      default:
        return { bg: 'bg-slate-500/10 text-slate-500 border-slate-500/20', text: 'Update', emoji: '📢' };
    }
  };

  return (
    <div className="w-full bg-[#f8fafc] dark:bg-[#030712] py-10 font-baloo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs font-bold font-rajdhani uppercase text-slate-400 mb-6 tracking-wide">
          <Link href="/" className="hover:text-amber-500">HOME</Link>
          <span>›</span>
          <span>STATE ARCHIVE</span>
          <span>›</span>
          <span className="text-slate-500">{stateName}</span>
        </nav>

        {/* State Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#030712] text-white p-8 md:p-12 border border-slate-900 shadow-sm mb-10">
          <div className="absolute right-0 top-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
          
          <div className="space-y-4 relative z-10 max-w-2xl">
            <span className="text-xs font-black font-rajdhani tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full uppercase">
              📍 State Specific Bulletin
            </span>
            <h1 className="text-3xl md:text-5xl font-black font-rajdhani uppercase tracking-tight leading-none">
              Sarkari Jobs in {stateName}
            </h1>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              Explore all active vacancies, government exams, result notifications, and board summaries announced under **{stateName}** state departments.
            </p>
          </div>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Feed list */}
          <div className="lg:col-span-8 space-y-4">
            {posts.length > 0 ? (
              posts.map((post) => {
                const badge = getBadgeStyles(post.type);
                const postTypeSlug = POST_TYPE_MAP[post.type] || 'jobs';
                const totalPosts = post.custom_meta?.aziz_total_posts;
                const deadline = post.custom_meta?.aziz_apply_end;
                const department = post.custom_meta?.aziz_department;
                
                return (
                  <div 
                    key={post.id}
                    className="glass-card flex flex-col md:flex-row gap-4 items-start md:items-center justify-between p-5 rounded-2xl border border-[var(--border)] hover:border-amber-400/40 transition-all duration-300 hover:shadow-md group"
                  >
                    <div className="flex-1 space-y-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-black uppercase font-rajdhani ${badge.bg}`}>
                          <span>{badge.emoji}</span>
                          <span>{badge.text}</span>
                        </span>
                        {department && (
                          <span className="text-[11px] font-semibold text-slate-400">
                            🏢 {department}
                          </span>
                        )}
                      </div>

                      <Link 
                        href={`/${postTypeSlug}/${post.slug}`}
                        className="block text-base md:text-lg font-bold text-[var(--foreground)] group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors"
                        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                      />

                      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-slate-500 font-medium">
                        {totalPosts && (
                          <span className="flex items-center gap-1">
                            <strong>🔢 Posts:</strong> {totalPosts}
                          </span>
                        )}
                        {deadline && (
                          <span className="flex items-center gap-1">
                            <strong>📅 Last Date:</strong> {deadline}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <strong>📍 Location:</strong> {post.custom_meta?.aziz_job_location || 'All India'}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/${postTypeSlug}/${post.slug}`}
                      className="w-full md:w-auto flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-amber-400 dark:hover:bg-amber-400 hover:text-slate-900 text-white px-5 py-2.5 text-xs font-black font-rajdhani tracking-wider uppercase transition-colors"
                    >
                      Details
                      <span>→</span>
                    </Link>
                  </div>
                )
              })
            ) : (
              <div className="p-12 text-center border-2 border-dashed border-[var(--border)] rounded-2xl text-slate-400">
                No regional jobs indexed for **{stateName}** under our active filters today.
              </div>
            )}
          </div>

          {/* Sidebar (4 Columns) */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Quick Browse State badges */}
            <div className="glass-card rounded-2xl border border-[var(--border)] p-6 space-y-4">
              <h4 className="text-lg font-black font-rajdhani tracking-wider text-[var(--foreground)] uppercase border-b border-[var(--border)] pb-2.5">
                🗺️ Other Active States
              </h4>
              <div className="flex flex-col gap-2 font-rajdhani font-black text-sm uppercase">
                {STATES_LIST.filter((s) => s.slug !== slug).slice(0, 10).map((state) => (
                  <Link
                    key={state.slug}
                    href={`/state/${state.slug}`}
                    className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-slate-50 dark:bg-slate-900/10 p-3 hover:border-amber-400 hover:text-amber-500 transition-all group"
                  >
                    <span className="flex items-center gap-2">
                      <span>📍</span>
                      <span>{state.name}</span>
                    </span>
                    <span className="text-xs text-slate-400 font-mono group-hover:text-amber-500">{state.count} Posts ›</span>
                  </Link>
                ))}
              </div>
            </div>

          </aside>

        </div>

      </div>
    </div>
  );
}
