import React from 'react';
import parse from 'html-react-parser';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug, REVERSE_POST_TYPE_MAP, processContentAndHeadings, getPosts } from '@/lib/wordpress';
import FAQAccordion from '@/components/FAQAccordion';
import SyllabusTracker from '@/components/SyllabusTracker';
import AffiliateAd from '@/components/AffiliateAd';
import RecentPosts from '@/components/RecentPosts';
import ShareWidget from '@/components/ShareWidget';
import MobileStickyCTA from '@/components/MobileStickyCTA';

interface SinglePostProps {
  params: Promise<{ type: string; slug: string }>;
}

export async function generateMetadata({ params }: SinglePostProps): Promise<Metadata> {
  const { type, slug } = await params;
  const wpType = REVERSE_POST_TYPE_MAP[type];
  if (!wpType) return {};
  const post = await getPostBySlug(type, slug);
  if (!post || !post.seo_meta) return {};
  return {
    title: `${post.seo_meta.title} – Get Job Update`,
    description: post.seo_meta.description,
    robots: post.seo_meta.robots,
    alternates: { canonical: `/${type}/${slug}` },
    openGraph: {
      title: post.seo_meta.og_title,
      description: post.seo_meta.og_description,
      url: `/${type}/${slug}`,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.modified,
      images: post.seo_meta.og_image ? [{ url: post.seo_meta.og_image }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seo_meta.twitter_title,
      description: post.seo_meta.twitter_description,
      images: post.seo_meta.twitter_image ? [post.seo_meta.twitter_image] : [],
    },
  };
}

export default async function SinglePostPage({ params }: SinglePostProps) {
  const { type, slug } = await params;
  const wpType = REVERSE_POST_TYPE_MAP[type];
  if (!wpType) return notFound();

  const post = await getPostBySlug(type, slug);
  if (!post) return notFound();

  const recentJobs = await getPosts('jobs', 5);

  const meta = post.custom_meta || {};
  const faqs = meta.faqs || [];
  const howtos = meta.howtos || [];
  const { headings, content: processedHtml } = processContentAndHeadings(post.content.rendered);

  // ─── Labels per post type ────────────────────────────────────────────────
  let orgLabel = 'Department'; let postLabel = 'Vacancies'; let qualLabel = 'Eligibility'; let dateLabel = 'Last Date';
  if (post.type === 'aziz_result')    { orgLabel = 'Board'; postLabel = 'Exam'; qualLabel = 'Status'; dateLabel = 'Declared On'; }
  else if (post.type === 'aziz_admit') { orgLabel = 'Board'; postLabel = 'Post'; qualLabel = 'Status'; dateLabel = 'Exam Date'; }
  else if (post.type === 'aziz_syllabus' || post.type === 'aziz_exam') { orgLabel = 'Board'; postLabel = 'Subject'; qualLabel = 'Level'; dateLabel = 'Updated'; }
  else if (post.type === 'aziz_scholarship') { orgLabel = 'Provider'; postLabel = 'Amount'; qualLabel = 'Eligibility'; dateLabel = 'End Date'; }
  else if (post.type === 'aziz_yojana') { orgLabel = 'Dept'; postLabel = 'Scheme'; qualLabel = 'Region'; dateLabel = 'Benefits'; }

  const publishedDate = new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const modifiedDate  = new Date(post.modified).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  // ─── Summary table rows ──────────────────────────────────────────────────
  const summaryRows = [
    { label: orgLabel,       val: meta.aziz_department    },
    { label: postLabel,      val: meta.aziz_total_posts   },
    { label: qualLabel,      val: meta.aziz_qualification },
    { label: 'Parent Body',  val: meta.aziz_department    },
    { label: 'Job Location', val: meta.aziz_job_location || 'All India' },
    { label: 'Age Limit',    val: meta.aziz_age_limit     },
    { label: 'Pay Scale',    val: meta.aziz_salary        },
    { label: 'Official Web', val: meta.aziz_official_site },
  ].filter(r => r.val);

  return (
    <div className="w-full font-sans min-h-screen bg-slate-50">

      {/* ══════════════════════════════════════════════
          HERO — dark banner with post metadata
      ══════════════════════════════════════════════ */}
      <div className="bg-[#0b1120] w-full pt-8 pb-28 relative overflow-hidden">
        {/* subtle dot grid */}
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at 1px 1px,white 1px,transparent 0)`, backgroundSize: '28px 28px' }} />
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-indigo-600/8 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="flex items-center flex-wrap gap-1.5 text-[11px] font-medium text-slate-500 mb-5">
            <Link href="/" className="hover:text-orange-400 transition-colors">Home</Link>
            <span className="text-slate-700">›</span>
            <Link href={`/${type}`} className="hover:text-orange-400 transition-colors capitalize">{type.replace(/-/g,' ')}</Link>
            <span className="text-slate-700">›</span>
            <span className="text-slate-400 line-clamp-1 max-w-xs sm:max-w-md" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
          </nav>

          {/* Category badge + live indicator */}
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-orange-500 px-2.5 py-1 text-[10px] font-black text-white uppercase tracking-widest shadow-lg shadow-orange-500/30">
              {meta.aziz_badge_type || type.replace(/-/g,' ')}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">Published · {publishedDate}</span>
            <div className="ml-auto flex items-center gap-1.5 text-[10px] font-black text-emerald-400 uppercase tracking-wider">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
              </span>
              Verified
            </div>
          </div>

          {/* H1 */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-[1.15] tracking-tight mb-4 max-w-4xl"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }} />

          {/* SEO description */}
          {meta.aziz_seo_desc && (
            <p className="text-[0.9rem] text-slate-400 leading-relaxed max-w-3xl mb-5">{meta.aziz_seo_desc}</p>
          )}

          {/* ── EEAT: Trust strip ── */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-800/60">
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-[10px] font-black flex-shrink-0">G</span>
              <span>By <strong className="text-slate-300">Get Job Update Team</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <svg className="w-3.5 h-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Last Updated: <span className="text-slate-400 font-semibold">{modifiedDate}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-500 font-semibold">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              Verified from Official Source
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          MAIN 3-COLUMN LAYOUT  [2 | 7 | 3]
      ══════════════════════════════════════════════ */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-14 pb-24 relative z-20">

        {/* ── 4 Quick-stat capsules (full width above grid) ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: orgLabel,   val: meta.aziz_department    || 'Check Bulletin', color: 'border-l-orange-500',  bg: 'bg-orange-50',   text: 'text-orange-700' },
            { label: postLabel,  val: meta.aziz_total_posts   || 'See Notice',     color: 'border-l-emerald-500', bg: 'bg-emerald-50',  text: 'text-emerald-700' },
            { label: qualLabel,  val: meta.aziz_qualification || 'Check Notice',   color: 'border-l-indigo-500',  bg: 'bg-indigo-50',   text: 'text-indigo-700' },
            { label: dateLabel,  val: meta.aziz_apply_end     || 'See Details',    color: 'border-l-rose-500',    bg: 'bg-rose-50',     text: 'text-rose-700' },
          ].map((c, i) => (
            <div key={i} className={`bg-white rounded-xl border border-slate-200 border-l-4 ${c.color} shadow-sm p-3.5 flex flex-col gap-1`}>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{c.label}</p>
              <p className={`text-sm font-black leading-tight truncate ${c.text}`}>{c.val}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* ══ LEFT SIDEBAR [col-span-2] — TOC + Quick Info ══ */}
          <aside className="hidden lg:block lg:col-span-2 sticky top-6 self-start">
            <div className="flex flex-col gap-4">

              {/* Table of Contents */}
              {headings.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-900">
                    <svg className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h7"/></svg>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Contents</span>
                  </div>
                  <nav className="p-3">
                    <ul className="space-y-0.5">
                      {headings.map((h, idx) => (
                        <li key={idx} className={h.level === 3 ? 'pl-3' : ''}>
                          <a href={`#${h.id}`}
                            className="flex items-start gap-1.5 py-1 px-1.5 rounded-lg text-[11px] font-semibold text-slate-500 hover:text-orange-600 hover:bg-orange-50/70 transition-all duration-150 group leading-snug">
                            <span className="text-orange-300 group-hover:text-orange-500 flex-shrink-0 text-[9px] font-black mt-0.5">{String(idx+1).padStart(2,'0')}</span>
                            <span>{h.text}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              )}

              {/* Quick Info panel */}
              {(meta.aziz_department || meta.aziz_qualification || meta.aziz_age_limit || meta.aziz_salary) && (
                <div className="bg-slate-900 rounded-xl border border-slate-800 p-3.5 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
                  <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest mb-2.5 flex items-center gap-1">⚡ Quick Info</p>
                  <div className="space-y-2">
                    {[
                      { emoji:'🏢', val: meta.aziz_department   },
                      { emoji:'🎓', val: meta.aziz_qualification },
                      { emoji:'⏳', val: meta.aziz_age_limit     },
                      { emoji:'💰', val: meta.aziz_salary        },
                    ].filter(i => i.val).map((inf, i) => (
                      <div key={i} className="flex items-start gap-2 py-1.5 border-b border-slate-800 last:border-0">
                        <span className="text-sm flex-shrink-0">{inf.emoji}</span>
                        <span className="text-[11px] text-slate-300 leading-snug font-medium">{inf.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </aside>

          {/* ══ CENTER ARTICLE [col-span-7] ══ */}
          <article className="lg:col-span-7 space-y-5 min-w-0">
            
            {/* Share Widget Moved to Top */}
            <ShareWidget />

            {/* Mobile TOC */}
            {headings.length > 0 && (
              <div className="lg:hidden bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-900">
                  <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h7"/></svg>
                  <span className="text-[11px] font-black text-white uppercase tracking-widest">Table of Contents</span>
                </div>
                <ul className="p-3 space-y-1 columns-2">
                  {headings.map((h, idx) => (
                    <li key={idx} className={h.level === 3 ? 'pl-3' : ''}>
                      <a href={`#${h.id}`} className="flex items-start gap-1.5 py-1 text-[11px] font-semibold text-slate-500 hover:text-orange-600 transition-colors leading-snug">
                        <span className="text-orange-300 text-[9px] flex-shrink-0 mt-0.5">{idx+1}.</span>
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Mobile quick action CTA */}
            {(meta.aziz_apply_link || meta.aziz_notification) && (
              <div className="lg:hidden flex gap-2">
                {meta.aziz_apply_link && (
                  <a href={meta.aziz_apply_link} target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white px-3 py-3 font-bold text-sm transition-all shadow-md shadow-orange-500/20">
                    ✍️ Apply Online
                  </a>
                )}
                {meta.aziz_notification && (
                  <a href={meta.aziz_notification} target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white px-3 py-3 font-bold text-sm transition-all border border-slate-700">
                    📄 Official PDF
                  </a>
                )}
              </div>
            )}

            {/* Syllabus tracker (only for syllabus type) */}
            {type === 'syllabus' && (
              <div id="syllabus-progress-tracker">
                <SyllabusTracker keySlug={post.slug} />
              </div>
            )}

            {/* ── Recruitment Summary Table ── */}
            {summaryRows.length > 0 && (
              <div id="summary-table-section" className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Card header */}
                <div className="px-5 py-3 bg-slate-900 flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Recruitment Summary</p>
                    <p className="text-sm font-black text-white leading-tight mt-0.5">{meta.aziz_department || 'Official Notification'}</p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <tbody>
                      {summaryRows.map((row, i) => (
                        <tr key={i} className={`border-b border-slate-100 transition-colors hover:bg-amber-50/40 ${i % 2 === 1 ? 'bg-slate-50/70' : 'bg-white'}`}>
                          <td className="px-5 py-3 text-slate-500 font-semibold w-[42%] text-sm">{row.label}</td>
                          <td className="px-5 py-3 text-slate-800 font-bold text-sm">{row.val}</td>
                        </tr>
                      ))}
                      {/* Last date — highlighted row */}
                      <tr className="bg-rose-50 hover:bg-rose-100/60 transition-colors">
                        <td className="px-5 py-3.5 text-rose-700 font-black text-sm">📅 Last Date</td>
                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center gap-2 font-black text-rose-700 bg-rose-100 border border-rose-200 rounded-lg px-3 py-1 text-sm">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>
                            </span>
                            {meta.aziz_apply_end || 'Check Notification'}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── Full Article Body ── */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2.5 px-5 py-3 border-b border-slate-100">
                <span className="block w-1 h-5 bg-orange-500 rounded-full flex-shrink-0"></span>
                <span className="text-sm font-black text-slate-800">Detailed Information</span>
              </div>
              <div className="px-5 py-6 md:px-8 md:py-8">
                <div id="full-article-content" className="post-content prose prose-slate max-w-none text-slate-700">
                  {parse(processedHtml)}
                </div>
              </div>
            </div>

            {/* ── EEAT: Author & Trust Box ── */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-black text-lg flex-shrink-0 shadow-md shadow-orange-500/25">G</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-slate-900">Get Job Update Editorial Team</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Verified Government Job Analysts · Updated {modifiedDate}</p>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    This article is researched and verified by the Get Job Update editorial team. All information is sourced directly from official government gazettes, recruitment portals, and press releases. We cross-check all dates, vacancies, and eligibility criteria before publishing.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {['Verified Source', '100% Accurate', 'Daily Updated'].map(badge => (
                      <span key={badge} className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* ══ RIGHT SIDEBAR [col-span-3] ══ */}
          <aside className="lg:col-span-3 sticky top-6 self-start">
            <div className="flex flex-col gap-4">

              {/* Important Links */}
              {(meta.aziz_apply_link || meta.aziz_notification || meta.aziz_official_site) && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="flex items-center gap-2.5 px-4 py-3 bg-slate-900">
                    <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/>
                    </svg>
                    <span className="text-[11px] font-black text-white uppercase tracking-widest">Important Links</span>
                  </div>
                  <div className="p-3 space-y-2">
                    {meta.aziz_apply_link && (
                      <a href={meta.aziz_apply_link} target="_blank" rel="noopener noreferrer"
                        className="w-full flex items-center justify-between gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 font-bold text-[13px] transition-all shadow-md shadow-orange-500/20 hover:-translate-y-0.5 group">
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"/></svg>
                          Apply Online
                        </span>
                        <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
                      </a>
                    )}
                    {meta.aziz_notification && (
                      <a href={meta.aziz_notification} target="_blank" rel="noopener noreferrer"
                        className="w-full flex items-center justify-between gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 font-bold text-[13px] transition-all border border-slate-700 hover:-translate-y-0.5 group">
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>
                          Official Notification
                        </span>
                        <svg className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/></svg>
                      </a>
                    )}
                    {meta.aziz_official_site && (
                      <a href={meta.aziz_official_site} target="_blank" rel="noopener noreferrer"
                        className="w-full flex items-center justify-between gap-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 px-4 py-2.5 font-bold text-[13px] transition-all border border-slate-200 hover:-translate-y-0.5 group">
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582"/></svg>
                          Official Website
                        </span>
                        <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Recent Posts Widget */}
              <RecentPosts posts={recentJobs} />

              {/* Affiliate Ad (moved to sidebar) */}
              <AffiliateAd tags={[type, post.type, meta.aziz_department||'', meta.aziz_qualification||'', post.title.rendered]} />

              {/* Community Channels */}
              <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 text-white relative overflow-hidden">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="relative z-10">
                  <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest mb-1">Stay Ahead</p>
                  <p className="text-sm font-black text-white mb-1">Get Instant Alerts</p>
                  <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">Join our channels for real-time govt job & result updates.</p>
                  <div className="space-y-2">
                    <a href="https://t.me/getjobupdatefree" target="_blank" rel="noopener noreferrer"
                      className="w-full flex items-center justify-between gap-2 rounded-xl bg-[#0088cc] hover:bg-[#007ab8] text-white px-3.5 py-2.5 font-bold text-xs transition-all hover:-translate-y-0.5 group">
                      <span className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.94-4.22 2.78-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.37.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .24z"/></svg>
                        Telegram Channel
                      </span>
                      <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
                    </a>
                    <a href="https://whatsapp.com/channel/0029VbCi7hW9RZAO5fRVKO0W" target="_blank" rel="noopener noreferrer"
                      className="w-full flex items-center justify-between gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2.5 font-bold text-xs transition-all hover:-translate-y-0.5 group">
                      <span className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                        WhatsApp Channel
                      </span>
                      <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Disclaimer note */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-[11px] text-amber-800 leading-relaxed">
                <p className="font-black text-amber-900 mb-1 flex items-center gap-1.5">⚠️ Disclaimer</p>
                <p>Get Job Update is an independent portal. We are not affiliated with any government body. Always verify details from the official website before applying.</p>
              </div>

            </div>
          </aside>

        </div>
      </div>

      {/* Mobile Sticky Apply CTA */}
      <MobileStickyCTA
        applyLink={meta.aziz_apply_link}
        pdfLink={meta.aziz_notification}
      />
    </div>
  );
}
