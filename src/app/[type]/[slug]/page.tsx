import React from 'react';
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
  params: Promise<{
    type: string;
    slug: string;
  }>;
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
    alternates: {
      canonical: `/${type}/${slug}`,
    },
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
  
  if (!wpType) {
    return notFound();
  }

  const post = await getPostBySlug(type, slug);

  if (!post) {
    return notFound();
  }

  const meta = post.custom_meta || {};
  const faqs = meta.faqs || [];
  const howtos = meta.howtos || [];
  const { headings, content: processedHtml } = processContentAndHeadings(post.content.rendered);

  let orgLabel = '🏢 Department';
  let postLabel = '🔢 Vacancies';
  let qualLabel = '🎓 Eligibility';
  let dateLabel = '📅 Deadline';

  if (post.type === 'aziz_result') {
    orgLabel = '🏢 Board'; postLabel = '🔢 Exam'; qualLabel = '📋 Status'; dateLabel = '📅 Declaration';
  } else if (post.type === 'aziz_admit') {
    orgLabel = '🏢 Board'; postLabel = '🔢 Post'; qualLabel = '📄 Status'; dateLabel = '📅 Exam Date';
  } else if (post.type === 'aziz_syllabus' || post.type === 'aziz_exam') {
    orgLabel = '🏢 Board'; postLabel = '🔢 Subject'; qualLabel = '📝 Level'; dateLabel = '📅 Updated';
  } else if (post.type === 'aziz_scholarship') {
    orgLabel = '🏢 Provider'; postLabel = '💰 Amount'; qualLabel = '🎓 Eligibility'; dateLabel = '📅 End Date';
  } else if (post.type === 'aziz_yojana') {
    orgLabel = '🏢 Dept'; postLabel = '📢 Scheme'; qualLabel = '📍 Region'; dateLabel = '🎁 Benefits';
  }

  const formattedDate = new Date(post.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="w-full bg-[#f8fafc] text-slate-800 py-10 font-sans min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Dynamic Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold font-sans uppercase text-slate-500 mb-6 tracking-widest">
          <Link href="/" className="hover:text-blue-600 transition-colors">HOME</Link>
          <span className="text-slate-400">›</span>
          <Link href={`/${type}`} className="hover:text-blue-600 transition-colors">{type.replace('-', ' ')}</Link>
          <span className="text-slate-400">›</span>
          <span className="text-slate-700 truncate max-w-[150px] sm:max-w-[200px]">{post.title.rendered}</span>
        </nav>

        {/* 1. Main Header Title block - Clean Light Theme */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm mb-8 relative overflow-hidden">
          {/* Subtle top accent line */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-emerald-500 to-amber-500"></div>
          
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 border border-blue-200 px-2.5 py-1 text-[10px] font-black font-sans text-blue-700 uppercase tracking-widest">
              {meta.aziz_badge_type || type}
            </span>
            <span className="text-[10px] font-bold font-sans text-slate-500 tracking-wider bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
              PUB: {formattedDate}
            </span>
            <div className="flex items-center gap-1.5 text-[10px] font-black font-sans text-emerald-700 uppercase bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg ml-auto">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Verified
            </div>
          </div>
          
          <h1 
            className="text-2xl sm:text-3xl md:text-5xl font-black font-sans text-slate-900 uppercase leading-[1.1] tracking-tight mb-4"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />

          {meta.aziz_seo_desc && (
            <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium max-w-4xl border-l-4 border-blue-500 pl-4 bg-blue-50/50 py-2 rounded-r-lg">
              {meta.aziz_seo_desc}
            </p>
          )}
        </div>

        {/* 2. Four-Capsule Summary Boxes Grid (Clean Cards) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: orgLabel, val: meta.aziz_department || 'Check Bulletin', color: 'bg-blue-50 text-blue-700 border-blue-200' },
            { label: postLabel, val: meta.aziz_total_posts || 'See notice', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
            { label: qualLabel, val: meta.aziz_qualification || 'Check Notice', color: 'bg-purple-50 text-purple-700 border-purple-200' },
            { label: dateLabel, val: meta.aziz_apply_end || 'Notice Date', color: 'bg-rose-50 text-rose-700 border-rose-200' }
          ].map((item, i) => (
            <div key={i} className={`flex flex-col gap-1 rounded-2xl border p-4 hover:shadow-md transition-shadow ${item.color}`}>
              <span className="text-[10px] font-bold font-sans tracking-widest uppercase opacity-70">{item.label}</span>
              <span className="text-base md:text-lg font-black font-sans uppercase tracking-wide truncate">
                {item.val}
              </span>
            </div>
          ))}
        </div>

        {/* 3. Dynamic 3-Column Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sticky TOC */}
          <aside className="hidden lg:block lg:col-span-3 lg:sticky lg:top-24 space-y-6 self-start">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                <span className="text-sm font-black font-sans tracking-widest text-slate-800 uppercase">
                  📋 ON THIS PAGE
                </span>
              </div>
              
              {headings.length > 0 ? (
                <ul className="space-y-3 text-xs font-bold font-sans tracking-wide text-slate-500">
                  {headings.map((heading, hIdx) => (
                    <li 
                      key={hIdx}
                      style={{ paddingLeft: heading.level === 3 ? '16px' : '0px' }}
                    >
                      <a 
                        href={`#${heading.id}`} 
                        className="hover:text-blue-600 transition-colors block leading-relaxed hover:translate-x-1 duration-200"
                      >
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400 italic">No sections found.</p>
              )}
            </div>
          </aside>

          {/* Main Article Content */}
          <article className="lg:col-span-6 space-y-8 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
            
            {/* Mobile TOC */}
            {headings.length > 0 && (
              <div className="block lg:hidden bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 mb-6">
                <span className="text-sm font-black font-sans tracking-widest text-slate-800 uppercase flex items-center gap-2">
                  📋 Table of Contents
                </span>
                <ul className="text-xs space-y-3 text-slate-600 font-bold font-sans tracking-wide">
                  {headings.map((heading, hIdx) => (
                    <li key={hIdx} style={{ paddingLeft: heading.level === 3 ? '16px' : '0px' }}>
                      <a href={`#${heading.id}`} className="hover:text-blue-600 transition-colors flex items-start gap-2">
                        <span className="text-slate-400 mt-0.5">{hIdx + 1}.</span> {heading.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {type === 'syllabus' && (
              <div id="syllabus-progress-tracker" className="mt-6 space-y-4">
                <SyllabusTracker keySlug={post.slug} />
              </div>
            )}

            {/* Quick summary table matching the template - Clean Light Table */}
            <div id="summary-table-section" className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left text-sm font-medium">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th colSpan={2} className="px-5 py-3 font-black font-sans text-base text-slate-800 uppercase tracking-wider">
                      ⚡ {meta.aziz_department || 'Recruitment Summary'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 text-slate-500 w-1/3">🏢 Board Name</td>
                    <td className="px-5 py-3 text-slate-900 font-bold">{meta.aziz_department || 'See Official Website'}</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 text-slate-500">🔢 Total Vacancy</td>
                    <td className="px-5 py-3 text-slate-900 font-bold">{meta.aziz_total_posts || 'Check Notice PDF'}</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 text-slate-500">🎓 Eligibility Details</td>
                    <td className="px-5 py-3 text-slate-900 font-bold">{meta.aziz_qualification || 'Check Notice Details'}</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 text-slate-500">📍 Posting Location</td>
                    <td className="px-5 py-3 text-slate-900 font-bold">{meta.aziz_job_location || 'All India'}</td>
                  </tr>
                  {meta.aziz_age_limit && (
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3 text-slate-500">⏳ Age Criteria</td>
                      <td className="px-5 py-3 text-slate-900 font-bold">{meta.aziz_age_limit}</td>
                    </tr>
                  )}
                  {meta.aziz_salary && (
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3 text-slate-500">💰 Expected PayScale</td>
                      <td className="px-5 py-3 text-slate-900 font-bold">{meta.aziz_salary}</td>
                    </tr>
                  )}
                  <tr className="bg-rose-50/50 hover:bg-rose-50 transition-colors">
                    <td className="px-5 py-3 text-slate-600 font-bold">📅 End Date to Apply</td>
                    <td className="px-5 py-3"><span className="text-rose-700 font-black px-2.5 py-1 bg-rose-100 rounded border border-rose-200">{meta.aziz_apply_end || 'See Details'}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <AffiliateAd tags={[type, post.type, meta.aziz_department || '', meta.aziz_qualification || '', post.title.rendered]} />

            {/* Full Content loaded from WordPress API (Prose styled cleanly) */}
            <div 
              id="full-article-content"
              className="post-content prose prose-slate max-w-none prose-headings:font-black prose-headings:font-sans prose-headings:uppercase prose-headings:tracking-wide prose-headings:text-slate-800 prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-a:no-underline prose-a:border-b-2 prose-a:border-blue-200 hover:prose-a:border-blue-500 transition-all prose-table:rounded-xl prose-table:overflow-hidden prose-table:border prose-table:border-slate-200 prose-th:bg-slate-50 prose-th:text-slate-800 prose-td:border-t prose-td:border-slate-100 text-slate-700"
              dangerouslySetInnerHTML={{ __html: processedHtml }}
            />

            <ShareWidget />

            {/* Render dynamic How-To guides */}
            {howtos.length > 0 && (
              <div id="howto-instructions-section" className="pt-8 border-t border-slate-200 space-y-6">
                {howtos.map((howto, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-5">
                    <h3 className="text-xl font-black font-sans text-slate-800 uppercase border-b border-slate-200 pb-3 flex items-center gap-2">
                      📝 {howto.title || 'Step-by-Step Application Guide'}
                    </h3>
                    <div className="relative pl-5 space-y-6 border-l-2 border-slate-200">
                      {howto.parsed?.map((step: any, sIdx: number) => (
                        <div key={sIdx} className="relative group">
                          {/* Number bullet */}
                          <div className="absolute -left-[31px] top-0 w-5 h-5 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center z-10">
                            <span className="text-[10px] font-black text-blue-700">{sIdx + 1}</span>
                          </div>
                          <div className="space-y-1.5 pt-0.5">
                            <strong className="block text-sm font-bold text-slate-800">{step.title}</strong>
                            {step.desc && (
                              <p className="text-sm text-slate-600 leading-relaxed bg-white p-3 rounded-lg border border-slate-100 shadow-sm" dangerouslySetInnerHTML={{ __html: step.desc }} />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Render dynamic FAQ accordions */}
            {faqs.length > 0 && (
              <div id="article-faq-section" className="pt-8 border-t border-slate-200 space-y-5">
                <h3 className="text-xl font-black font-sans text-slate-800 uppercase flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                  ❓ Important FAQs
                </h3>
                {faqs.map((faqGroup, idx) => (
                  <FAQAccordion key={idx} items={faqGroup.parsed || []} />
                ))}
              </div>
            )}

          </article>

          {/* Sticky Quick-Action Metadata Sidebar */}
          <aside className="lg:col-span-3 lg:sticky lg:top-24 space-y-6">
            
            {/* Quick Action links */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <h4 className="text-sm font-black font-sans tracking-widest text-slate-800 uppercase border-b border-slate-100 pb-2">
                🔗 Action Links
              </h4>
              
              <div className="space-y-3 font-sans font-black text-sm uppercase tracking-wider">
                {meta.aziz_apply_link && (
                  <a 
                    href={meta.aziz_apply_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-3 shadow-md transition-all hover:-translate-y-0.5"
                  >
                    📝 Apply Online Direct Link
                  </a>
                )}
                {meta.aziz_notification && (
                  <a 
                    href={meta.aziz_notification} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white py-3 border border-slate-700 transition-all hover:-translate-y-0.5 shadow-sm"
                  >
                    📄 Download Notification
                  </a>
                )}
                {meta.aziz_official_site && (
                  <a 
                    href={meta.aziz_official_site} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 py-3 border border-slate-200 transition-all hover:-translate-y-0.5"
                  >
                    🌐 Visit Official Website
                  </a>
                )}
              </div>
            </div>

            <AgeCalculator 
              applyEnd={meta.aziz_apply_end || ''} 
              ageLimitStr={meta.aziz_age_limit || '18-30 Years'}
              department={meta.aziz_department || 'this post'}
            />

            {/* Support Callout Light Theme */}
            <div className="rounded-2xl bg-gradient-to-br from-[#0088cc] to-[#006699] p-6 text-white border border-blue-800 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
              
              <div className="space-y-3 relative z-10 font-sans">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold font-sans tracking-widest text-[#0088cc] uppercase bg-white rounded-full px-2.5 py-1">
                  Telegram Sync
                </span>
                <h4 className="text-xl font-bold font-sans uppercase tracking-wide leading-tight">
                  Stuck with the application?
                </h4>
                <p className="text-xs text-blue-100 leading-relaxed font-medium">
                  Join our support groups to discuss admit card release delays, syllabus changes, and key deadlines.
                </p>
                <a 
                  href="#" 
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-slate-50 text-[#0088cc] font-sans font-bold text-xs py-3 tracking-widest transition-all uppercase mt-2 shadow-sm"
                >
                  <span className="text-base">✈️</span> Open Mentorship
                </a>
              </div>
            </div>

          </aside>

        </div>

      </div>
    </div>
  );
}
