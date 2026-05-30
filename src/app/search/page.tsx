import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { searchPosts, POST_TYPE_MAP, CATEGORIES_LIST, STATES_LIST } from '@/lib/wordpress';

export const metadata: Metadata = {
  title: 'Search Results – Get Job Update',
  description: 'Search for the latest government job notifications, admit cards, and results.',
};

interface SearchProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Format category badge styling
const getBadgeStyles = (postType: string) => {
  switch (postType) {
    case 'aziz_job':
      return { bg: 'bg-[var(--color-brand-blue)]/10 text-[var(--color-brand-blue)] border-[var(--color-brand-blue)]/20', text: 'Job', emoji: '💼' };
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

export default async function SearchPage({ searchParams }: SearchProps) {
  const params = await searchParams;
  const q = typeof params.q === 'string' ? params.q : '';
  const stateParam = typeof params.state === 'string' ? params.state : '';

  // Get state name if state filter is applied
  const selectedState = STATES_LIST.find(s => s.slug === stateParam);

  // Fetch search results from global search
  let posts = await searchPosts(q, 40);

  // Filter by state if applicable
  if (selectedState) {
    posts = posts.filter((post) => {
      // Very basic local filter: check if state name is in title or if location matches
      const titleMatches = post.title.rendered.toLowerCase().includes(selectedState.name.toLowerCase());
      const locationMatches = post.custom_meta?.aziz_job_location?.toLowerCase().includes(selectedState.name.toLowerCase());
      return titleMatches || locationMatches;
    });
  }

  return (
    <div className="w-full bg-[#f8fafc] dark:bg-[#030712] py-10 font-baloo min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs font-bold font-rajdhani uppercase text-slate-400 mb-6 tracking-wide">
          <Link href="/" className="hover:text-[var(--color-brand-blue)]">HOME</Link>
          <span>›</span>
          <span className="text-slate-500">Search Results</span>
        </nav>

        {/* Header Hero card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#030712] text-white p-8 md:p-12 border border-slate-900 shadow-sm mb-10">
          <div className="absolute right-0 top-0 w-64 h-64 bg-[var(--color-brand-blue)]/10 rounded-full blur-3xl animate-pulse-slow"></div>
          
          <div className="space-y-4 relative z-10 max-w-2xl">
            <span className="text-xs font-black font-rajdhani tracking-widest text-[var(--color-brand-blue)] bg-[var(--color-brand-blue)]/10 px-3 py-1 rounded-full uppercase">
              Global Search
            </span>
            <h1 className="text-3xl md:text-5xl font-black font-rajdhani uppercase tracking-tight leading-none">
              Search Results
            </h1>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              Showing results for: <strong className="text-white">"{q || 'All'}"</strong>
              {selectedState && <span> in <strong className="text-white">{selectedState.name}</strong></span>}
            </p>
          </div>
        </div>

        {/* 2-Column Responsive Archive View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Main list Feed (8 Columns) */}
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
                    className="glass-card flex flex-col md:flex-row gap-4 items-start md:items-center justify-between p-5 rounded-2xl border border-[var(--border)] hover:border-[var(--color-brand-blue)] transition-all duration-300 hover:shadow-md group bg-white dark:bg-slate-900/50"
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
                        className="block text-base md:text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--color-brand-blue)] dark:group-hover:text-[var(--color-brand-blue)] transition-colors"
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
                      className="w-full md:w-auto flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-[var(--color-brand-blue)] dark:hover:bg-[var(--color-brand-blue)] hover:text-white text-white px-5 py-2.5 text-xs font-black font-rajdhani tracking-wider uppercase transition-colors shadow-sm"
                    >
                      Details
                      <span>→</span>
                    </Link>
                  </div>
                )
              })
            ) : (
              <div className="p-12 text-center border-2 border-dashed border-[var(--border)] rounded-2xl text-slate-400 bg-white dark:bg-transparent">
                No matching results found for <strong>"{q}"</strong> {selectedState ? `in ${selectedState.name}` : ''}. Please try a different keyword.
              </div>
            )}
          </div>

          {/* Right Sidebar navigation support (4 Columns) */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Quick Browse Badge directory */}
            <div className="glass-card rounded-2xl border border-[var(--border)] bg-white dark:bg-slate-900/50 p-6 space-y-4">
              <h4 className="text-lg font-black font-rajdhani tracking-wider text-[var(--foreground)] uppercase border-b border-[var(--border)] pb-2.5">
                📁 Browse Categories
              </h4>
              <div className="flex flex-col gap-2 font-rajdhani font-black text-sm uppercase">
                {CATEGORIES_LIST.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/${cat.slug}`}
                    className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-slate-50 dark:bg-slate-900/10 p-3 hover:border-[var(--color-brand-blue)] hover:text-[var(--color-brand-blue)] dark:hover:text-[var(--color-brand-blue)] transition-all group"
                  >
                    <span className="flex items-center gap-2">
                      <span>{cat.emoji}</span>
                      <span>{cat.name}</span>
                    </span>
                    <span className="text-xs text-slate-400 group-hover:text-[var(--color-brand-blue)] font-mono">→</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Support strip */}
            <div className="rounded-2xl bg-gradient-to-tr from-[#020617] to-[#0f172a] p-5 text-white border border-slate-800 shadow-md">
              <h5 className="font-rajdhani font-black tracking-wide uppercase text-sm mb-2 text-[var(--color-brand-blue)]">
                📩 Real-Time Bulletins
              </h5>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                We push verified recruitment drives via social alert services. Register below to save your seats.
              </p>
              <a 
                href="#" 
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-rajdhani font-black text-xs py-2.5 transition-all"
              >
                💬 JOIN WHATSAPP DISCUSSIONS
              </a>
            </div>

          </aside>

        </div>

      </div>
    </div>
  );
}
