import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostsByQualification, QUALIFICATIONS_LIST, POST_TYPE_MAP, WordPressPost } from '@/lib/wordpress';

interface QualArchiveProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: QualArchiveProps): Promise<Metadata> {
  const { slug } = await params;
  const qual = QUALIFICATIONS_LIST.find((q) => q.slug === slug);
  const qualName = qual ? qual.name : slug.replace('-', ' ');

  return {
    title: `Sarkari Jobs for ${qualName} 2026 – Apply Online List`,
    description: `Sabhi active govt vacancies eligibility matching ${qualName}. Check salary scales, age criteria, and apply online links immediately.`,
    alternates: {
      canonical: `/qualification/${slug}`,
    },
  };
}

export const revalidate = 300; // Cache qualification archives for 5 minutes

export default async function QualificationArchivePage({ params }: QualArchiveProps) {
  const { slug } = await params;
  const qualObj = QUALIFICATIONS_LIST.find((q) => q.slug === slug);

  if (!qualObj) {
    return notFound();
  }

  const qualName = qualObj.name;
  let posts: WordPressPost[] = [];
  try {
    posts = await getPostsByQualification(qualName, 30);
  } catch (err) {
    console.error(`Failed to fetch qualification posts for: ${slug}`, err);
  }

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

  return (
    <div className="w-full bg-slate-50 min-h-screen flex flex-col font-sans">
      
      {/* Brand Hero Section */}
      <div className="bg-slate-900 w-full pt-12 pb-24 md:pb-32 relative overflow-hidden">
        {/* Decorative Grid */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-1.5 text-[11px] font-black uppercase text-slate-400 mb-6 tracking-widest font-rajdhani">
            <Link href="/" className="hover:text-orange-500 transition-colors">HOME</Link>
            <span>›</span>
            <span>QUALIFICATION ARCHIVE</span>
            <span>›</span>
            <span className="text-white">{qualName}</span>
          </nav>

          <span className="inline-block text-xs font-black font-rajdhani tracking-widest text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full uppercase mb-5">
            🎓 Eligibility Directory
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-5 uppercase font-rajdhani leading-none">
            Sarkari Jobs for <span className="text-orange-500">{qualName}</span>
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-medium">
            Explore active central government vacancies and regional recruitment drives matched specifically to candidates possessing {qualName} credentials.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full -mt-12 md:-mt-20 relative z-20 pb-12">
        
        {/* Timeline Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Feed List (8 Columns) */}
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
                No active jobs categorized under **{qualName}** in our index right now.
              </div>
            )}
          </div>

          {/* Sidebar Navigation */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Quick Browse Qualifications */}
            <div className="glass-card rounded-2xl border border-[var(--border)] p-6 space-y-4">
              <h4 className="text-lg font-black font-rajdhani tracking-wider text-[var(--foreground)] uppercase border-b border-[var(--border)] pb-2.5">
                🎓 Other Qualifications
              </h4>
              <div className="flex flex-col gap-2 font-rajdhani font-black text-sm uppercase">
                {QUALIFICATIONS_LIST.filter((q) => q.slug !== slug).map((qual) => (
                  <Link
                    key={qual.slug}
                    href={`/qualification/${qual.slug}`}
                    className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-slate-50 dark:bg-slate-900/10 p-3 hover:border-amber-400 hover:text-amber-500 transition-all group"
                  >
                    <span className="flex items-center gap-2">
                      <span>{qual.emoji}</span>
                      <span>{qual.name}</span>
                    </span>
                    <span className="text-xs text-slate-400 font-mono group-hover:text-amber-500">{qual.count} Jobs ›</span>
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
