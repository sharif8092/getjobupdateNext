import React from 'react';
import parse from 'html-react-parser';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug, POST_TYPE_MAP, REVERSE_POST_TYPE_MAP, processContentAndHeadings } from '@/lib/wordpress';
import FAQAccordion from '@/components/FAQAccordion';
import AgeCalculator from '@/components/AgeCalculator';
import SyllabusTracker from '@/components/SyllabusTracker';
import AffiliateAd from '@/components/AffiliateAd';
import ShareWidget from '@/components/ShareWidget';

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

  const meta = post.custom_meta || {};
  const faqs = meta.faqs || [];
  const howtos = meta.howtos || [];
  const { headings, content: processedHtml } = processContentAndHeadings(post.content.rendered);

  let orgLabel = 'Department';
  let postLabel = 'Vacancies';
  let qualLabel = 'Eligibility';
  let dateLabel = 'Deadline';

  if (post.type === 'aziz_result') {
    orgLabel = 'Board'; postLabel = 'Exam'; qualLabel = 'Status'; dateLabel = 'Declaration';
  } else if (post.type === 'aziz_admit') {
    orgLabel = 'Board'; postLabel = 'Post'; qualLabel = 'Status'; dateLabel = 'Exam Date';
  } else if (post.type === 'aziz_syllabus' || post.type === 'aziz_exam') {
    orgLabel = 'Board'; postLabel = 'Subject'; qualLabel = 'Level'; dateLabel = 'Updated';
  } else if (post.type === 'aziz_scholarship') {
    orgLabel = 'Provider'; postLabel = 'Amount'; qualLabel = 'Eligibility'; dateLabel = 'End Date';
  } else if (post.type === 'aziz_yojana') {
    orgLabel = 'Dept'; postLabel = 'Scheme'; qualLabel = 'Region'; dateLabel = 'Benefits';
  }

  const formattedDate = new Date(post.date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const capsules = [
    {
      label: orgLabel,
      val: meta.aziz_department || 'Check Bulletin',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
        </svg>
      ),
      iconBg: 'bg-orange-100 text-orange-600',
      valColor: 'text-orange-700',
    },
    {
      label: postLabel,
      val: meta.aziz_total_posts || 'See Notice',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      ),
      iconBg: 'bg-emerald-100 text-emerald-600',
      valColor: 'text-emerald-700',
    },
    {
      label: qualLabel,
      val: meta.aziz_qualification || 'Check Notice',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
        </svg>
      ),
      iconBg: 'bg-indigo-100 text-[var(--color-brand-blue)]',
      valColor: 'text-[var(--color-brand-blue)]',
    },
    {
      label: dateLabel,
      val: meta.aziz_apply_end || 'Notice Date',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      ),
      iconBg: 'bg-rose-100 text-rose-600',
      valColor: 'text-rose-700',
    },
  ];

  return (
    <div className="w-full font-sans min-h-screen bg-[var(--background)]">

      {/* ════════════════ HERO ════════════════ */}
      <div className="bg-[#0b1120] w-full pt-10 pb-32 relative overflow-hidden">
        {/* Mesh pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
        {/* Glow blobs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 right-0 w-80 h-80 bg-indigo-600/8 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Breadcrumbs */}
          <nav aria-label="breadcrumb" className="flex items-center flex-wrap gap-1.5 text-[11px] font-semibold uppercase tracking-widest mb-7">
            <Link href="/" className="text-white/40 hover:text-orange-400 transition-colors">Home</Link>
            <svg className="w-3 h-3 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
            <Link href={`/${type}`} className="text-white/40 hover:text-orange-400 transition-colors capitalize">{type.replace(/-/g, ' ')}</Link>
            <svg className="w-3 h-3 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
            <span className="text-white/60 truncate max-w-[160px] sm:max-w-sm" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
          </nav>

          {/* Tags row */}
          <div className="flex flex-wrap items-center gap-2.5 mb-6">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-1 text-[10px] font-black text-white uppercase tracking-widest shadow-md shadow-orange-500/30">
              {meta.aziz_badge_type || type}
            </span>
            <span className="text-[10px] font-semibold text-white/40 tracking-wider">
              Published · {formattedDate}
            </span>
            <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-300 uppercase tracking-wider ml-auto">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              Verified &amp; Updated
            </div>
          </div>

          {/* Title */}
          <h1
            className="text-3xl sm:text-4xl md:text-[2.75rem] font-black text-white uppercase leading-[1.1] tracking-tight mb-5 max-w-5xl"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />

          {/* SEO description */}
          {meta.aziz_seo_desc && (
            <p className="text-sm md:text-[0.95rem] text-white/55 leading-relaxed max-w-3xl font-medium">
              {meta.aziz_seo_desc}
            </p>
          )}
        </div>
      </div>

      {/* ════════════════ CONTENT ════════════════ */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-20 -mt-16 pb-24">

        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {capsules.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-slate-100 p-4 flex items-start gap-3 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.1)] transition-all duration-200 group"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.iconBg} group-hover:scale-110 transition-transform duration-200`}>
                {item.icon}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{item.label}</p>
                <p className={`text-sm font-black leading-tight truncate ${item.valColor}`}>{item.val}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── 3-Column Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ════ LEFT: TOC Sidebar ════ */}
          <aside className="hidden lg:block lg:col-span-2 lg:sticky lg:top-24 self-start">
            <div className="flex flex-col gap-4 max-h-[calc(100vh-7rem)] overflow-y-auto sidebar-scroll pr-1">

            {/* Table of Contents */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="px-4 py-3 bg-slate-900 flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                <span className="text-[10px] font-black text-white uppercase tracking-widest">On This Page</span>
              </div>
              <div className="p-4">
                {headings.length > 0 ? (
                  <ul className="space-y-1.5">
                    {headings.map((heading, hIdx) => (
                      <li key={hIdx} style={{ paddingLeft: heading.level === 3 ? '12px' : '0px' }}>
                        <a
                          href={`#${heading.id}`}
                          className="text-[11px] font-semibold text-slate-500 hover:text-orange-600 transition-colors flex items-start gap-2 leading-relaxed group py-0.5"
                        >
                          <span className="text-slate-300 group-hover:text-orange-300 shrink-0 text-[10px] mt-0.5">{hIdx + 1}.</span>
                          <span className="group-hover:translate-x-0.5 transition-transform duration-150">{heading.text}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400 italic">No sections.</p>
                )}
              </div>
            </div>

            {/* Quick Info */}
            {(meta.aziz_department || meta.aziz_qualification || meta.aziz_age_limit || meta.aziz_salary) && (
              <div className="bg-slate-900 rounded-2xl p-4 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '20px 20px' }} />
                <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/20 rounded-full blur-2xl pointer-events-none" />
                <div className="relative z-10 space-y-3">
                  <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest">⚡ Quick Info</p>
                  <div className="space-y-2">
                    {meta.aziz_department && (
                      <div className="flex items-start gap-2">
                        <span className="text-slate-500 shrink-0 text-xs mt-0.5">🏢</span>
                        <span className="text-white/75 text-[11px] leading-snug">{meta.aziz_department}</span>
                      </div>
                    )}
                    {meta.aziz_qualification && (
                      <div className="flex items-start gap-2">
                        <span className="text-slate-500 shrink-0 text-xs mt-0.5">🎓</span>
                        <span className="text-white/75 text-[11px] leading-snug">{meta.aziz_qualification}</span>
                      </div>
                    )}
                    {meta.aziz_age_limit && (
                      <div className="flex items-start gap-2">
                        <span className="text-slate-500 shrink-0 text-xs mt-0.5">⏳</span>
                        <span className="text-white/75 text-[11px] leading-snug">{meta.aziz_age_limit}</span>
                      </div>
                    )}
                    {meta.aziz_salary && (
                      <div className="flex items-start gap-2">
                        <span className="text-slate-500 shrink-0 text-xs mt-0.5">💰</span>
                        <span className="text-white/75 text-[11px] leading-snug">{meta.aziz_salary}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            </div>
          </aside>

          {/* ════ CENTER: Article ════ */}
          <article className="lg:col-span-7 space-y-6">

            {/* Mobile TOC */}
            {headings.length > 0 && (
              <div className="block lg:hidden bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="px-4 py-3 bg-slate-900 flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Table of Contents</span>
                </div>
                <ul className="p-4 space-y-2">
                  {headings.map((heading, hIdx) => (
                    <li key={hIdx} style={{ paddingLeft: heading.level === 3 ? '14px' : '0px' }}>
                      <a href={`#${heading.id}`} className="text-xs font-semibold text-slate-500 hover:text-orange-600 transition-colors flex items-start gap-2">
                        <span className="text-slate-300 shrink-0">{hIdx + 1}.</span>
                        <span>{heading.text}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {type === 'syllabus' && (
              <div id="syllabus-progress-tracker">
                <SyllabusTracker keySlug={post.slug} />
              </div>
            )}



            {/* ── Recruitment Summary Table ── */}
            <div id="summary-table-section" className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="px-5 py-4 bg-slate-900 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Recruitment Summary</p>
                  <h3 className="text-sm font-black text-white">{meta.aziz_department || 'Official Notification Details'}</h3>
                </div>
              </div>
              <table className="w-full text-left text-sm">
                <tbody>
                  {[
                    { label: '🏢 Board / Dept', val: meta.aziz_department || 'See Official Website' },
                    { label: '🔢 Total Vacancy', val: meta.aziz_total_posts || 'Check Notice PDF' },
                    { label: '🎓 Qualification', val: meta.aziz_qualification || 'Check Notice Details' },
                    { label: '📍 Job Location', val: meta.aziz_job_location || 'All India' },
                    ...(meta.aziz_age_limit ? [{ label: '⏳ Age Limit', val: meta.aziz_age_limit }] : []),
                    ...(meta.aziz_salary ? [{ label: '💰 Pay Scale', val: meta.aziz_salary }] : []),
                  ].map((row, i) => (
                    <tr key={i} className={`border-b border-slate-50 hover:bg-orange-50/50 transition-colors group ${i % 2 === 1 ? 'bg-slate-50/50' : ''}`}>
                      <td className="px-5 py-3.5 text-slate-500 font-semibold w-2/5 text-sm">{row.label}</td>
                      <td className="px-5 py-3.5 text-slate-800 font-bold text-sm group-hover:text-orange-700 transition-colors">{row.val}</td>
                    </tr>
                  ))}
                  {/* Last date — highlighted */}
                  <tr className="bg-rose-50/60 hover:bg-rose-50 transition-colors">
                    <td className="px-5 py-3.5 text-rose-700 font-black text-sm">📅 Last Date</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-2 font-black text-rose-700 bg-rose-100 border border-rose-200 rounded-xl px-3 py-1.5 text-sm">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                        </span>
                        {meta.aziz_apply_end || 'See Details'}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <AffiliateAd tags={[type, post.type, meta.aziz_department || '', meta.aziz_qualification || '', post.title.rendered]} />

            {/* ── Full Article Content ── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-6 md:p-10">
              <div
                id="full-article-content"
                className="post-content prose prose-slate max-w-none text-slate-700"
              >
                {parse(processedHtml, {
                  replace: (domNode: any) => {
                    if (domNode.type === 'tag' && domNode.attribs && domNode.attribs.class) {
                      const className = domNode.attribs.class;
                      
                      // Inject HowTo Component exactly where the WP HowTo block was
                      if (className.includes('premium-howto-section') && howtos.length > 0) {
                        return (
                          <div id="howto-instructions-section" className="my-10 bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] overflow-hidden">
                            <div className="px-5 py-4 bg-slate-900 flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Application Process</p>
                                <h3 className="text-sm font-black text-white">Step-by-Step Guide</h3>
                              </div>
                            </div>
                            <div className="p-6 md:p-8 space-y-8">
                              {howtos.map((howto, idx) => (
                                <div key={idx} className="space-y-4">
                                  {howto.title && (
                                    <p className="text-xs font-black text-orange-600 uppercase tracking-widest border-b border-orange-100 pb-2">{howto.title}</p>
                                  )}
                                  <div className="space-y-3">
                                    {howto.parsed?.map((step: { title: string; desc?: string }, sIdx: number) => (
                                      <div key={sIdx} className="flex gap-4 group">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-md shadow-slate-900/20 group-hover:scale-105 transition-transform duration-200">
                                          <span className="text-sm font-black text-white">{sIdx + 1}</span>
                                        </div>
                                        <div className="flex-1 bg-slate-50 rounded-xl border border-slate-100 p-4 group-hover:border-orange-200 group-hover:bg-orange-50/40 transition-all duration-200">
                                          <div className="text-[0.95rem] font-bold text-slate-800 leading-relaxed">
                                            {step.title && <span className="text-slate-900 font-black uppercase tracking-wide mr-2">{step.title}</span>}
                                            {step.desc && <span dangerouslySetInnerHTML={{ __html: step.desc }} />}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      
                      // Inject FAQ Component exactly where the WP FAQ block was
                      if (className.includes('premium-faq-section') && faqs.length > 0) {
                        return (
                          <div id="article-faq-section" className="my-10 bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] overflow-hidden">
                            <div className="px-5 py-4 bg-amber-500 flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-amber-100 uppercase tracking-widest">Common Queries</p>
                                <h3 className="text-sm font-black text-white">Frequently Asked Questions</h3>
                              </div>
                            </div>
                            <div className="p-5 space-y-3">
                              {faqs.map((faqGroup, idx) => (
                                <FAQAccordion key={idx} items={faqGroup.parsed || []} />
                              ))}
                            </div>
                          </div>
                        );
                      }
                    }
                  }
                })}
              </div>
            </div>

            <ShareWidget />




          </article>

          {/* ════ RIGHT: Action Sidebar ════ */}
          <aside className="lg:col-span-3 lg:sticky lg:top-24 self-start">
            <div className="flex flex-col gap-5 max-h-[calc(100vh-7rem)] overflow-y-auto sidebar-scroll pr-1">

            {/* Action Buttons */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="px-5 py-3.5 bg-slate-900 flex items-center gap-2">
                <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Important Links</span>
              </div>
              <div className="p-4 space-y-2.5">
                {meta.aziz_apply_link && (
                  <a
                    href={meta.aziz_apply_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between gap-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 font-bold text-sm transition-all hover:-translate-y-0.5 shadow-md shadow-orange-600/25 group"
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                      Apply Online
                    </span>
                    <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                  </a>
                )}
                {meta.aziz_notification && (
                  <a
                    href={meta.aziz_notification}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between gap-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white px-4 py-3 font-bold text-sm transition-all hover:-translate-y-0.5 border border-slate-700 group"
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                      Download PDF
                    </span>
                    <svg className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                  </a>
                )}
                {meta.aziz_official_site && (
                  <a
                    href={meta.aziz_official_site}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between gap-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 px-4 py-3 font-bold text-sm transition-all hover:-translate-y-0.5 border border-slate-200 group"
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>
                      Official Website
                    </span>
                    <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                  </a>
                )}
              </div>
            </div>

            {/* Age Calculator */}
            <AgeCalculator
              applyEnd={meta.aziz_apply_end || ''}
              ageLimitStr={meta.aziz_age_limit || '18-30 Years'}
              department={meta.aziz_department || 'this post'}
            />

            {/* Telegram Support */}
            <div className="rounded-2xl bg-slate-900 p-5 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '20px 20px' }} />
              <div className="absolute -top-8 -right-8 w-28 h-28 bg-orange-500/15 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.94-4.22 2.78-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.37.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .24z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Support</p>
                    <p className="text-sm font-black text-white">Telegram Mentorship</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Get help with application, admit card delays, syllabus changes and key deadlines from our community.
                </p>
                <a
                  href="#"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-3 transition-all uppercase tracking-widest shadow-md shadow-orange-600/30 hover:-translate-y-0.5"
                >
                  <span>✈️</span> Join Now — Free
                </a>
              </div>
            </div>

            {/* Community */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="px-5 py-3.5 bg-slate-900 flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Join Community</span>
              </div>
              <div className="p-4 space-y-2.5">
                <a href="#" className="flex items-center justify-between px-4 py-3 bg-[#0088cc] hover:bg-[#0077b5] text-white rounded-xl text-xs font-bold transition-all hover:-translate-y-0.5 shadow-sm group">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.94-4.22 2.78-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.37.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .24z"/></svg>
                    Telegram Channel
                  </span>
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                </a>
                <a href="#" className="flex items-center justify-between px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all hover:-translate-y-0.5 shadow-sm group">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                    WhatsApp Channel
                  </span>
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                </a>
              </div>
            </div>

            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
