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

// Generate high-authority Rank Math SEO tags server-side for maximum search visibility
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

  // Format dynamic labels depending on post type (matching standard WordPress setup)
  let orgLabel = '🏢 Board / Department';
  let postLabel = '🔢 Total Vacancies';
  let qualLabel = '🎓 Qualification';
  let dateLabel = '📅 Deadline to Apply';

  if (post.type === 'aziz_result') {
    orgLabel = '🏢 Exam Board'; postLabel = '🔢 Exam Name'; qualLabel = '📋 Result Status'; dateLabel = '📅 Declaration Date';
  } else if (post.type === 'aziz_admit') {
    orgLabel = '🏢 Board Name'; postLabel = '🔢 Exam / Post'; qualLabel = '📄 Admit Card Status'; dateLabel = '📅 Examination Date';
  } else if (post.type === 'aziz_syllabus' || post.type === 'aziz_exam') {
    orgLabel = '🏢 Board Name'; postLabel = '🔢 Subject / Post'; qualLabel = '📝 Exam Level'; dateLabel = '📅 Last Updated';
  } else if (post.type === 'aziz_scholarship') {
    orgLabel = '🏢 Provider Name'; postLabel = '💰 Help Amount'; qualLabel = '🎓 Eligibility'; dateLabel = '📅 Submission End';
  } else if (post.type === 'aziz_yojana') {
    orgLabel = '🏢 Department'; postLabel = '📢 Scheme Name'; qualLabel = '📍 Region / State'; dateLabel = '🎁 Core Benefits';
  }

  // Format date to readable string
  const formattedDate = new Date(post.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="w-full bg-[#f8fafc] dark:bg-[#030712] py-10 font-baloo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Dynamic Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs font-bold font-rajdhani uppercase text-slate-400 mb-6 tracking-wide">
          <Link href="/" className="hover:text-amber-500">HOME</Link>
          <span>›</span>
          <Link href={`/${type}`} className="hover:text-amber-500">{type.replace('-', ' ')}</Link>
          <span>›</span>
          <span className="text-slate-500 truncate max-w-[200px]">{post.title.rendered}</span>
        </nav>

        {/* 1. Main Header Title block */}
        <div className="bg-white dark:bg-[#0b0f19] border border-[var(--border)] rounded-3xl p-6 md:p-8 shadow-sm space-y-4 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded bg-amber-400/10 px-2.5 py-0.5 text-xs font-extrabold font-rajdhani text-amber-500 uppercase tracking-wider">
              {meta.aziz_badge_type || type}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              Published on {formattedDate}
            </span>
          </div>
          
          <h1 
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-rajdhani text-[var(--foreground)] uppercase leading-tight"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />

          {meta.aziz_seo_desc && (
            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 leading-relaxed italic border-l-2 border-amber-400 pl-3">
              {meta.aziz_seo_desc}
            </p>
          )}

          {/* Glowing heartbeat badge */}
          <div className="flex items-center gap-2 text-xs font-extrabold font-rajdhani text-emerald-500 uppercase bg-emerald-500/5 border border-emerald-500/10 px-3 py-1.5 rounded-xl w-fit">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Verified recruitment bulletin active
          </div>
        </div>

        {/* 2. Four-Capsule Summary Boxes Grid (Directly below Title block) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 font-rajdhani uppercase font-extrabold">
          {/* Box 1: Organisation */}
          <div className="glass-card rounded-2xl border border-[var(--border)] p-4 space-y-1">
            <span className="text-[10px] text-slate-400 tracking-wider block">{orgLabel}</span>
            <span className="text-sm md:text-base text-[var(--foreground)] truncate block">
              {meta.aziz_department || 'Check Bulletin'}
            </span>
          </div>

          {/* Box 2: Vacancies */}
          <div className="glass-card rounded-2xl border border-[var(--border)] p-4 space-y-1">
            <span className="text-[10px] text-slate-400 tracking-wider block">{postLabel}</span>
            <span className="text-sm md:text-base text-[var(--foreground)] truncate block">
              {meta.aziz_total_posts || 'See notice'}
            </span>
          </div>

          {/* Box 3: Qualifications */}
          <div className="glass-card rounded-2xl border border-[var(--border)] p-4 space-y-1">
            <span className="text-[10px] text-slate-400 tracking-wider block">{qualLabel}</span>
            <span className="text-sm md:text-base text-[var(--foreground)] truncate block">
              {meta.aziz_qualification || 'Check Notice'}
            </span>
          </div>

          {/* Box 4: Last Date */}
          <div className="glass-card rounded-2xl border border-[var(--border)] p-4 space-y-1 border-b-2 border-b-amber-400/80">
            <span className="text-[10px] text-slate-400 tracking-wider block">{dateLabel}</span>
            <span className="text-sm md:text-base text-amber-500 dark:text-amber-400 truncate block">
              {meta.aziz_apply_end || 'Notice Date'}
            </span>
          </div>
        </div>

        {/* 3. Dynamic 3-Column Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Dynamic Sticky Left Sidebar Table of Contents (3 Columns on Desktop) */}
          <aside className="hidden lg:block lg:col-span-3 lg:sticky lg:top-24 space-y-6 self-start font-baloo">
            <div className="glass-card rounded-3xl border border-[var(--border)] p-6 space-y-5 shadow-sm">
              <span className="text-xs font-black font-rajdhani tracking-wider text-amber-500 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full uppercase">
                📋 ON THIS PAGE
              </span>
              
              {headings.length > 0 ? (
                <ul className="space-y-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 leading-normal border-l border-slate-100 dark:border-slate-800">
                  {headings.map((heading, hIdx) => (
                    <li 
                      key={hIdx}
                      style={{ paddingLeft: heading.level === 3 ? '16px' : '0px' }}
                    >
                      <a 
                        href={`#${heading.id}`} 
                        className="hover:text-amber-500 transition-colors block -ml-[1px] border-l-2 border-transparent hover:border-amber-400 pl-3.5 leading-relaxed"
                      >
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400 italic">No sections found in this post.</p>
              )}
            </div>
          </aside>

          {/* Main Article Content (50% - 6 Columns on Desktop, 12 Columns on Mobile/Tablet) */}
          <article className="lg:col-span-6 space-y-8 bg-white dark:bg-[#0b0f19] border border-[var(--border)] rounded-3xl p-6 md:p-8 shadow-sm">
            
            {/* Inline Table of Contents Box (Visible on mobile/tablet only) */}
            {headings.length > 0 && (
              <div className="block lg:hidden bg-[#f8fafc] dark:bg-slate-950/20 border border-[var(--border)] rounded-2xl p-5 space-y-3 font-baloo">
                <span className="text-sm font-extrabold font-rajdhani tracking-wider text-[var(--foreground)] uppercase block">
                  📋 Table of Contents
                </span>
                <ul className="text-xs space-y-2 text-slate-500 dark:text-slate-400 font-semibold">
                  {headings.map((heading, hIdx) => (
                    <li 
                      key={hIdx}
                      style={{ paddingLeft: heading.level === 3 ? '12px' : '0px' }}
                    >
                      <a href={`#${heading.id}`} className="hover:text-amber-500 transition-colors flex items-center gap-1.5">
                        <span>{hIdx + 1}.</span> {heading.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {type === 'syllabus' && (
              <div id="syllabus-progress-tracker" className="mt-8 space-y-4">
                <SyllabusTracker keySlug={post.slug} />
              </div>
            )}

            {/* Quick summary table matching the template */}
            <div id="summary-table-section" className="responsive-table-wrapper post-content">
              <table>
                <thead>
                  <tr>
                    <th colSpan={2}>⚡ {meta.aziz_department || 'Recruitment Summary'}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>🏢 Board Name</strong></td>
                    <td>{meta.aziz_department || 'See Official Website'}</td>
                  </tr>
                  <tr>
                    <td><strong>🔢 Total Vacancy</strong></td>
                    <td>{meta.aziz_total_posts || 'Check Notice PDF'}</td>
                  </tr>
                  <tr>
                    <td><strong>🎓 Eligibility Details</strong></td>
                    <td>{meta.aziz_qualification || 'Check Notice Details'}</td>
                  </tr>
                  <tr>
                    <td><strong>📍 Posting Location</strong></td>
                    <td>{meta.aziz_job_location || 'All India'}</td>
                  </tr>
                  {meta.aziz_age_limit && (
                    <tr>
                      <td><strong>⏳ Age Criteria</strong></td>
                      <td>{meta.aziz_age_limit}</td>
                    </tr>
                  )}
                  {meta.aziz_salary && (
                    <tr>
                      <td><strong>💰 Expected PayScale</strong></td>
                      <td>{meta.aziz_salary}</td>
                    </tr>
                  )}
                  <tr>
                    <td><strong>📅 End Date to Apply</strong></td>
                    <td><span className="text-red-500 font-bold">{meta.aziz_apply_end || 'See Details'}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <AffiliateAd tags={[type, post.type, meta.aziz_department || '', meta.aziz_qualification || '', post.title.rendered]} />

            {/* Full Content loaded from WordPress API (with responsive table wrapping) */}
            <div 
              id="full-article-content"
              className="post-content prose dark:prose-invert max-w-none text-[var(--foreground)]"
              dangerouslySetInnerHTML={{ __html: processedHtml }}
            />

            {/* Social Share Widget */}
            <ShareWidget />

            {/* Render dynamic How-To guides if registered in meta */}
            {howtos.length > 0 && (
              <div id="howto-instructions-section" className="border-t border-[var(--border)] pt-8 space-y-6">
                {howtos.map((howto, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-900/10 border border-[var(--border)] rounded-2xl p-6 space-y-5">
                    <h3 className="text-xl font-bold font-rajdhani text-[var(--foreground)] uppercase border-b border-[var(--border)] pb-3 flex items-center gap-2">
                      📝 {howto.title || 'Step-by-Step Application Guide'}
                    </h3>
                    <div className="relative pl-5 space-y-4 border-l-2 border-slate-200 dark:border-slate-800">
                      {howto.parsed?.map((step: any, sIdx: number) => (
                        <div key={sIdx} className="relative group">
                          {/* Number bullet */}
                          <span className="absolute -left-[31px] top-0.5 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-[11px] font-black text-slate-900 font-mono">
                            {sIdx + 1}
                          </span>
                          <div className="space-y-1">
                            <strong className="block text-sm text-[var(--foreground)]">{step.title}</strong>
                            {step.desc && (
                              <p className="text-xs text-slate-500 dark:text-slate-400" dangerouslySetInnerHTML={{ __html: step.desc }} />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Render dynamic FAQ accordions if registered in meta */}
            {faqs.length > 0 && (
              <div id="article-faq-section" className="border-t border-[var(--border)] pt-8 space-y-4">
                <h3 className="text-xl font-bold font-rajdhani text-[var(--foreground)] uppercase flex items-center gap-2 mb-4">
                  ❓ Important FAQs for {meta.aziz_department || 'this post'}
                </h3>
                {faqs.map((faqGroup, idx) => (
                  <FAQAccordion key={idx} items={faqGroup.parsed || []} />
                ))}
              </div>
            )}

          </article>

          {/* Sticky Quick-Action Metadata Sidebar (25% - 3 Columns) */}
          <aside className="lg:col-span-3 lg:sticky lg:top-24 space-y-6">
            
            {/* Quick Action links */}
            <div className="glass-card rounded-3xl border border-[var(--border)] p-6 space-y-5 shadow-sm">
              <span className="text-xs font-black font-rajdhani tracking-wider text-amber-500 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full uppercase">
                🔗 Quick Action Links
              </span>
              
              <div className="space-y-3 font-rajdhani font-black text-sm uppercase tracking-wider">
                {meta.aziz_apply_link && (
                  <a 
                    href={meta.aziz_apply_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 py-3.5 shadow-lg shadow-amber-400/20 transition-all hover:scale-102"
                  >
                    📝 Apply Online Direct Link
                  </a>
                )}
                {meta.aziz_notification && (
                  <a 
                    href={meta.aziz_notification} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white py-3.5 border border-slate-800 transition-all"
                  >
                    📄 Download Notification PDF
                  </a>
                )}
                {meta.aziz_official_site && (
                  <a 
                    href={meta.aziz_official_site} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-950/60 hover:bg-slate-200 dark:hover:bg-slate-950 text-slate-700 dark:text-slate-300 py-3.5 border border-[var(--border)] transition-all"
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

            {/* Support Callout */}
            <div className="rounded-3xl bg-gradient-to-tr from-[#0f172a] to-[#1e293b] p-6 text-white border border-slate-800 shadow-xl relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
              
              <div className="space-y-4 relative z-10 font-baloo">
                <span className="text-[10px] font-black font-rajdhani tracking-widest text-blue-400 uppercase bg-blue-400/10 rounded px-2.5 py-0.5">
                  Telegram Sync
                </span>
                <h4 className="text-lg font-bold font-rajdhani uppercase tracking-wide">
                  Stuck with the application?
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Join our support groups to discuss admit card release delays, syllabus changes, and key deadlines with verified expert mentors.
                </p>
                <a 
                  href="#" 
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0088cc] hover:bg-[#0088cc]/90 text-white font-rajdhani font-black text-xs py-3 tracking-wide transition-all uppercase"
                >
                  ✈️ Open Mentorship Group
                </a>
              </div>
            </div>

          </aside>

        </div>

      </div>
    </div>
  );
}
