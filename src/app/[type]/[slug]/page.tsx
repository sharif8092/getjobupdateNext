import React from 'react';
import parse from 'html-react-parser';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug, REVERSE_POST_TYPE_MAP, processContentAndHeadings, getPosts } from '@/lib/wordpress';
import FAQAccordion from '@/components/FAQAccordion';
import SyllabusTracker from '@/components/SyllabusTracker';
import AffiliateSlot from '@/components/AffiliateSlot';
import AffiliateAd from '@/components/AffiliateAd';
import RecentPosts from '@/components/RecentPosts';
import ShareWidget from '@/components/ShareWidget';
import MobileStickyCTA from '@/components/MobileStickyCTA';
import TableOfContents from '@/components/TableOfContents';
import RelatedJobs from '@/components/RelatedJobs';
import Script from 'next/script';

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
    alternates: { canonical: `https://getjobupdate.co.in/${type}/${slug}` },
    openGraph: {
      title: post.seo_meta.og_title,
      description: post.seo_meta.og_description,
      url: `https://getjobupdate.co.in/${type}/${slug}`,
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

  const recentJobs = await getPosts('aziz_job', 5);
  const recentResults = await getPosts('aziz_result', 5);
  const recentAdmitCards = await getPosts('aziz_admit', 5);

  const meta = post.custom_meta || {};
  const faqs = meta.faqs || [];
  const howtos = meta.howtos || [];
  
  const hasRankMathToc = !!meta.rank_math_toc_html;
  const { headings, content: processedHtml } = processContentAndHeadings(post.content.rendered);

  // Check if user manually placed shortcodes inside the content
  let contentHasInlineFaq = false;
  let contentHasInlineHowTo = false;

  let finalHtml = processedHtml;
  
  if (/\[smart_faq[^\]]*\]/gi.test(finalHtml) || /wp-block-yoast-faq-block|schema-faq|rank-math-faq/i.test(finalHtml)) {
    contentHasInlineFaq = true;
    finalHtml = finalHtml.replace(/\[smart_faq[^\]]*\]/gi, '<div id="react-faq-placeholder"></div>');
  }
  
  if (/\[smart_howto[^\]]*\]/gi.test(finalHtml) || /schema-how-to|rank-math-howto-block|wp-block-yoast-how-to-block/i.test(finalHtml)) {
    contentHasInlineHowTo = true;
    finalHtml = finalHtml.replace(/\[smart_howto[^\]]*\]/gi, '<div id="react-howto-placeholder"></div>');
  }

  // ACF Positioning (with override if inline shortcode is detected)
  const faqPosition = contentHasInlineFaq ? 'inline' : (meta.faq_position || 'before_related_posts');
  const howtoPosition = contentHasInlineHowTo ? 'inline' : (meta.howto_position || 'after_content');

  const isResult = post.type === 'aziz_result';

  // ─── Dynamic Layout Positions ────────────────────────────────────────────
  const affiliateSlots = meta.affiliate_slots || [];

  // ─── Dates ──────────────────────────────────────────────────────────────
  const publishedDate = new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const modifiedDate  = new Date(post.modified).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  // Extract Featured Image if available
  const featuredMedia = (post as any)._embedded?.['wp:featuredmedia']?.[0];
  const featuredImageUrl = featuredMedia?.source_url || null;

  // Helper to clean up corrupted text fields (e.g. RankMath JSON leaking into strings)
  const cleanText = (text: any) => {
    if (typeof text !== 'string') return text;
    if (text.includes('","level":')) {
      return text.split('","level":')[0].replace(/["{}]/g, '');
    }
    return text;
  };

  // ─── Render Functions for Dynamic Placement ──────────────────────────────
  // Function to render an inline affiliate ad from custom plugin data
  const renderInlineAffiliate = (data: any) => {
    const title = data['data-title'] || data.title;
    const link = data['data-link'] || data.link;

    if (!title || !link) return null;
    
    const product = {
      id: Math.random().toString(36).substr(2, 9),
      title: title,
      price: data['data-price'] || data.price || '',
      originalPrice: data['data-originalprice'] || data.originalprice || '',
      rating: parseFloat(data['data-rating'] || data.rating) || 4.5,
      buyLink: link,
      image: data['data-image'] || data.image || '📚',
      discountBadge: data['data-discount'] || data.discount || '',
      categoryTags: [],
      author: '',
      description: ''
    };

    return (
      <div className="my-8 not-prose">
        <AffiliateAd customProduct={product} />
      </div>
    );
  };

  const renderFaq = (isInline = false) => {
    if (faqs.length === 0) return null;
    // If the shortcode is in the content, ONLY render inline, not in layout zones
    if (!isInline && contentHasInlineFaq) return null;

    return (
      <div id="article-faq-section" className={`mb-6 overflow-hidden not-prose ${isInline ? 'mt-8 pt-6 border-t border-slate-100' : 'bg-white rounded-xl border border-slate-200 shadow-sm'}`}>
        <AffiliateSlot position="before_faq" slots={affiliateSlots} fallbackTags={['laptop', 'study-table']} department={meta.aziz_department} postType={post.type} />
        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"/></svg>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">People Also Ask</p>
            <p className="text-xl font-black text-slate-800">Frequently Asked Questions</p>
          </div>
        </div>
        <div className="p-6 md:p-8 space-y-2">
          {faqs.map((faqGroup: any, idx: number) => (
            <FAQAccordion key={idx} items={faqGroup.parsed || []} />
          ))}
        </div>
        <AffiliateSlot position="after_faq" slots={affiliateSlots} department={meta.aziz_department} postType={post.type} />
      </div>
    );
  };

  const renderHowTo = (isInline = false) => {
    if (howtos.length === 0) return null;
    // If shortcode in content, ONLY render inline
    if (!isInline && contentHasInlineHowTo) return null;

    return (
      <div id="howto-instructions-section" className={`mb-6 overflow-hidden not-prose ${isInline ? 'mt-8 pt-6 border-t border-slate-100' : 'bg-white rounded-xl border border-slate-200 shadow-sm'}`}>
        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75z"/></svg>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">How To Apply</p>
            <p className="text-xl font-black text-slate-800">Step-by-Step Guide</p>
          </div>
        </div>
        <div className="p-6 md:p-8 space-y-4">
          {howtos.map((howto: any, idx: number) => (
            <div key={idx} className="space-y-4">
              {howto.title && <p className="text-sm font-black text-orange-600 uppercase tracking-widest border-b border-slate-100 pb-2">{howto.title}</p>}
              <div className="space-y-3">
                {howto.parsed?.map((step: { title: string; desc?: string }, sIdx: number) => (
                  <div key={sIdx} className="flex gap-4 group">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-orange-500 group-hover:text-white flex items-center justify-center transition-colors text-slate-600">
                      <span className="text-sm font-black">{sIdx+1}</span>
                    </div>
                    <div className="flex-1 bg-slate-50 rounded-xl border border-slate-200 px-5 py-4 group-hover:border-orange-200 group-hover:bg-orange-50/50 transition-all text-[15px] text-slate-700 leading-relaxed">
                      {step.title && <div className="font-black text-slate-900 uppercase text-xs tracking-wider mb-1">{step.title}</div>}
                      {step.desc  && <div dangerouslySetInnerHTML={{ __html: step.desc }} />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ─── Schemas ──────────────────────────────────────────────────
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.seo_meta?.title || post.title.rendered,
    "image": post.seo_meta?.og_image ? [post.seo_meta.og_image] : [],
    "datePublished": post.date,
    "dateModified": post.modified,
    "author": [{
        "@type": "Organization",
        "name": "Get Job Update",
        "url": "https://getjobupdate.co.in"
    }]
  };

  return (
    <div className="w-full font-sans min-h-screen bg-slate-50">
      
      <Script id="article-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      {/* ══════════════════════════════════════════════
          PREMIUM HERO SECTION
      ══════════════════════════════════════════════ */}
      <div className="bg-[#0b1120] w-full py-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at 1px 1px,white 1px,transparent 0)`, backgroundSize: '28px 28px' }} />
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-indigo-600/8 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="flex items-center flex-wrap gap-1.5 text-[11px] font-medium text-slate-500 mb-5">
            <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
            <span className="text-slate-700">›</span>
            <Link href={`/${type}`} className="hover:text-blue-400 transition-colors capitalize">{type.replace(/-/g,' ')}</Link>
            <span className="text-slate-700">›</span>
            <span className="text-slate-400 line-clamp-1 max-w-xs sm:max-w-md" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
          </nav>

          {/* Highlight Badge & Verification */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[10px] font-black text-white uppercase tracking-widest shadow-lg ${isResult ? 'bg-green-600 shadow-green-600/30' : 'bg-blue-600 shadow-blue-600/30'}`}>
                {meta.highlight_text || (isResult ? 'RESULT DECLARED' : (meta.aziz_badge_type || type.replace(/-/g,' ')))}
              </span>
              <div className="flex items-center gap-1.5 text-[11px] font-black text-emerald-400 uppercase tracking-wider">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                Verified Source
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
               <span className="flex items-center gap-1 hidden sm:flex"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Updated: {modifiedDate}</span>
            </div>
          </div>

          {/* H1 Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-[1.15] tracking-tight mb-6 max-w-4xl"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }} />

          {/* Hero Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-5 bg-white/5 border border-white/10 rounded-2xl max-w-4xl">
             <div className="flex flex-col">
               <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1">🏢 Department</span>
               <span className="text-white font-black text-sm">{cleanText(meta.aziz_department) || '-'}</span>
             </div>
             <div className="flex flex-col">
               <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1">📋 Vacancy</span>
               <span className="text-orange-400 font-black text-sm">{cleanText(meta.aziz_total_posts) || '-'}</span>
             </div>
             <div className="flex flex-col">
               <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1">🎓 Qualification</span>
               <span className="text-blue-400 font-black text-sm">{cleanText(meta.aziz_qualification) || '-'}</span>
             </div>
             <div className="flex flex-col">
               <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1">💰 Salary</span>
               <span className="text-emerald-400 font-black text-sm">{cleanText(meta.aziz_salary) || '-'}</span>
             </div>
             <div className="flex flex-col">
               <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1">⚡ Job Type</span>
               <span className="text-indigo-400 font-black text-sm">{cleanText(meta.job_type) || 'Permanent / Govt'}</span>
             </div>
             <div className="flex flex-col">
               <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1">💻 App Mode</span>
               <span className="text-purple-400 font-black text-sm">{cleanText(meta.application_mode) || 'Online Form'}</span>
             </div>
             <div className="flex flex-col col-span-2 md:col-span-2">
               <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1">📅 Last Date / Status</span>
               <span className="text-rose-400 font-black text-sm">{isResult ? 'Result Declared' : cleanText(meta.aziz_apply_end) || '-'}</span>
             </div>
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-wrap gap-3 items-center">
             {meta.aziz_apply_link && (
                <a href={meta.aziz_apply_link} target="_blank" rel="noopener noreferrer" 
                   className={`${isResult ? 'bg-green-600 hover:bg-green-700 shadow-green-600/30 w-full sm:w-auto text-base' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30 text-base'} text-white font-black px-8 py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2`}>
                  {isResult ? '🚀 Check Result Online' : 'Apply Now Online'}
                </a>
             )}
             {meta.aziz_notification && (
                <a href={meta.aziz_notification} target="_blank" rel="noopener noreferrer" className="bg-slate-800 text-white font-bold px-6 py-4 rounded-xl hover:bg-slate-700 transition-all border border-slate-700 flex items-center justify-center gap-2 text-sm w-full sm:w-auto">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/></svg>
                  Download Notification
                </a>
             )}
             {meta.aziz_official_site && (
                <a href={meta.aziz_official_site} target="_blank" rel="noopener noreferrer" className="bg-transparent text-slate-300 font-bold px-6 py-4 rounded-xl hover:bg-white/5 hover:text-white transition-all border border-slate-700 flex items-center justify-center gap-2 text-sm w-full sm:w-auto">
                  Official Website
                </a>
             )}
          </div>

        </div>
      </div>

      {/* ══════════════════════════════════════════════
          MAIN 8-4 LAYOUT
      ══════════════════════════════════════════════ */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ══ CENTER ARTICLE [col-span-8] ══ */}
          <article className="lg:col-span-8 space-y-0 min-w-0">
            
            {/* Share Widget */}
            <div className="mb-6"><ShareWidget /></div>

            {/* Quick Overview Card (Premium Summary) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
              <div className="px-5 py-4 bg-slate-900 flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-none">Quick Overview</p>
                    <p className="text-base font-black text-white leading-tight mt-0.5">Recruitment Summary</p>
                  </div>
              </div>
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex flex-col border-b sm:border-b-0 border-slate-100 pb-3 sm:pb-0">
                  <span className="text-slate-500 font-semibold mb-1">Organization</span>
                  <span className="font-bold text-slate-900">{cleanText(meta.aziz_department) || '-'}</span>
                </div>
                <div className="flex flex-col border-b sm:border-b-0 border-slate-100 pb-3 sm:pb-0">
                  <span className="text-slate-500 font-semibold mb-1">Vacancy</span>
                  <span className="font-bold text-slate-900">{cleanText(meta.aziz_total_posts) || '-'}</span>
                </div>
                <div className="flex flex-col border-b border-slate-100 pb-3">
                  <span className="text-slate-500 font-semibold mb-1">Qualification</span>
                  <span className="font-bold text-slate-900">{cleanText(meta.aziz_qualification) || '-'}</span>
                </div>
                <div className="flex flex-col border-b border-slate-100 pb-3">
                  <span className="text-slate-500 font-semibold mb-1">Age Limit</span>
                  <span className="font-bold text-slate-900">{cleanText(meta.aziz_age_limit) || '-'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-500 font-semibold mb-1">Salary</span>
                  <span className="font-bold text-slate-900">{cleanText(meta.aziz_salary) || '-'}</span>
                </div>
                <div className="flex flex-col bg-rose-50 rounded-lg p-2.5 border border-rose-100 items-start justify-center">
                  <span className="text-rose-700 font-semibold text-xs uppercase tracking-wider mb-1">Last Date</span>
                  <span className="font-black text-rose-700 text-base">{cleanText(meta.aziz_apply_end) || '-'}</span>
                </div>
              </div>
            </div>

            <AffiliateSlot position="after_summary" slots={affiliateSlots} fallbackTags={['books', 'exam-prep']} department={meta.aziz_department} postType={post.type} />

            {/* Table of Contents (Rank Math Fallback) */}
            {hasRankMathToc ? (
              <div className="mb-6 bg-white p-6 rounded-xl shadow-sm border border-slate-200 toc-container" dangerouslySetInnerHTML={{ __html: meta.rank_math_toc_html! }} />
            ) : (
              <div className="mb-6 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <TableOfContents headings={headings} />
              </div>
            )}

            {/* Syllabus tracker */}
            {type === 'syllabus' && (
              <div id="syllabus-progress-tracker" className="mb-6 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <SyllabusTracker keySlug={post.slug} />
              </div>
            )}

            {/* Dynamic Zone: Before Content */}
            <AffiliateSlot position="before_content" slots={affiliateSlots} department={meta.aziz_department} postType={post.type} />
            {faqPosition === 'before_content' && renderFaq()}
            {howtoPosition === 'before_content' && renderHowTo()}

            {/* Full Article Body */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
              
              {/* Featured Image (if available) */}
              {featuredImageUrl && (
                <div className="w-full border-b border-slate-200 bg-slate-50">
                  <img 
                    src={featuredImageUrl} 
                    alt={post.title.rendered.replace(/<[^>]*>?/gm, '')} 
                    className="w-full max-h-[500px] object-contain" 
                    loading="eager"
                  />
                </div>
              )}

              <div className="px-6 py-6 md:px-8 md:py-8">
                <div id="full-article-content" className="post-content prose prose-slate max-w-none text-slate-700 text-[17px] leading-8 prose-headings:font-bold prose-h2:text-2xl">
                  {parse(finalHtml, {
                    replace: (domNode: any) => {
                      if (domNode.attribs && domNode.attribs.id === 'react-faq-placeholder') {
                        return renderFaq(true);
                      }
                      if (domNode.attribs && domNode.attribs.id === 'react-howto-placeholder') {
                        return renderHowTo(true);
                      }
                      if (domNode.attribs && domNode.attribs.class && domNode.attribs.class.includes('react-affiliate-placeholder')) {
                        return renderInlineAffiliate(domNode.attribs);
                      }
                      
                      // Intercept raw Gutenberg SEO blocks and replace them with our premium React components inline
                      if (domNode.attribs) {
                        const classes = domNode.attribs.class || '';
                        const id = domNode.attribs.id || '';
                        
                        if (classes.includes('wp-block-yoast-faq-block') || classes.includes('schema-faq') || id === 'rank-math-faq' || classes.includes('rank-math-faq')) {
                          return renderFaq(true);
                        }
                        if (classes.includes('schema-how-to') || classes.includes('rank-math-howto-block') || classes.includes('wp-block-yoast-how-to-block')) {
                          return renderHowTo(true);
                        }
                      }
                    }
                  })}

                  {/* If position is after_content, integrate them seamlessly at the end of the article text */}
                  {faqPosition === 'after_content' && renderFaq(true)}
                  {howtoPosition === 'after_content' && renderHowTo(true)}
                </div>
              </div>
            </div>

            {/* Dynamic Zone: After Content */}
            <AffiliateSlot position="after_content" slots={affiliateSlots} department={meta.aziz_department} postType={post.type} />

            {/* Trust Signals & Premium Author Box */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6 p-6 md:p-8">
              <div className="flex flex-wrap md:flex-nowrap items-start gap-6">
                <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-slate-900/20">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-black uppercase tracking-widest text-emerald-600 mb-1">Reviewed By</p>
                  <p className="text-xl font-black text-slate-900">Get Job Update Editorial Team</p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mt-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                      </div>
                      <span className="text-xs font-bold text-slate-600">Official Notification Verified</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                      </div>
                      <span className="text-xs font-bold text-slate-600">Official Link Verified</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center gap-4">
                    <div className="text-xs font-medium text-slate-500">
                      <span className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Published On</span>
                      {publishedDate}
                    </div>
                    <div className="w-px h-8 bg-slate-200"></div>
                    <div className="text-xs font-medium text-slate-500">
                      <span className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Last Updated</span>
                      {modifiedDate}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Zone: Before Related Posts */}
            <AffiliateSlot position="before_related_posts" slots={affiliateSlots} department={meta.aziz_department} postType={post.type} />
            {faqPosition === 'before_related_posts' && renderFaq()}
            {howtoPosition === 'before_related_posts' && renderHowTo()}

            {/* Related Jobs / Results */}
            <RelatedJobs department={meta.aziz_department} qualification={meta.aziz_qualification} postType={post.type} />

            {/* Dynamic Zone: After Related Posts */}
            {faqPosition === 'after_related_posts' && renderFaq()}

          </article>

          {/* ══ RIGHT SIDEBAR [col-span-4] ══ */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 self-start space-y-6 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto sidebar-scroll pr-2 pb-4">

            {/* Important Links Widget (Card format) */}
            {(meta.aziz_apply_link || meta.aziz_notification || meta.aziz_official_site) && (
              <div className="space-y-4">
                  {meta.aziz_apply_link && (
                    <a href={meta.aziz_apply_link} target="_blank" rel="noopener noreferrer"
                      className={`w-full flex items-center justify-center gap-2 rounded-xl text-white px-5 py-4 font-black text-base transition-all shadow-md hover:-translate-y-0.5 border-b-[5px] active:border-b-0 active:translate-y-1 ${isResult ? 'bg-green-600 border-green-800 hover:bg-green-500 shadow-green-600/30' : 'bg-blue-600 border-blue-800 hover:bg-blue-500 shadow-blue-600/30'}`}>
                      {isResult ? 'Check Result Now' : 'Apply Now Online'}
                    </a>
                  )}
                  {meta.aziz_official_site && (
                    <a href={meta.aziz_official_site} target="_blank" rel="noopener noreferrer"
                      className="w-full flex items-center justify-between gap-2 rounded-xl bg-white text-slate-700 px-5 py-4 font-bold text-[15px] transition-all border-2 border-slate-200 hover:border-blue-500 hover:text-blue-600 shadow-sm hover:-translate-y-0.5 group">
                      Official Website
                      <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582"/></svg>
                    </a>
                  )}
                  {meta.aziz_notification && (
                    <a href={meta.aziz_notification} target="_blank" rel="noopener noreferrer"
                      className="w-full flex items-center justify-between gap-2 rounded-xl bg-white text-slate-700 px-5 py-4 font-bold text-[15px] transition-all border-2 border-slate-200 hover:border-rose-500 hover:text-rose-600 shadow-sm hover:-translate-y-0.5 group">
                      Download Notice
                      <svg className="w-5 h-5 text-slate-400 group-hover:text-rose-500 transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>
                    </a>
                  )}
              </div>
            )}

            {/* Sidebar Ordering: Jobs -> Results -> Admits */}
            {recentJobs.length > 0 && <RecentPosts posts={recentJobs} title="Latest Jobs" />}
            {recentResults.length > 0 && <RecentPosts posts={recentResults} title="Latest Results" icon="🏆" />}
            {recentAdmitCards.length > 0 && <RecentPosts posts={recentAdmitCards} title="Admit Cards" icon="🎫" />}

            {/* Community Channels */}
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 text-white relative overflow-hidden">
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1.5">Stay Ahead</p>
                <p className="text-base font-black text-white mb-1.5">Get Instant Alerts</p>
                <p className="text-[13px] text-slate-400 mb-4 leading-relaxed">Join our channels for real-time govt job & result updates.</p>
                <div className="space-y-3">
                  <a href="https://t.me/getjobupdatefree" target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-between gap-2 rounded-xl bg-[#0088cc] hover:bg-[#007ab8] text-white px-4 py-3 font-bold text-[13px] transition-all hover:-translate-y-0.5 group">
                    <span className="flex items-center gap-2.5">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.94-4.22 2.78-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.37.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .24z"/></svg>
                      Telegram Channel
                    </span>
                    <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
                  </a>
                  <a href="https://whatsapp.com/channel/0029VbCi7hW9RZAO5fRVKO0W" target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-between gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 font-bold text-[13px] transition-all hover:-translate-y-0.5 group">
                    <span className="flex items-center gap-2.5">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                      WhatsApp Channel
                    </span>
                    <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Affiliate Ad (Sidebar Placement) */}
            <AffiliateSlot position="sidebar" slots={affiliateSlots} fallbackTags={[type, post.type, meta.aziz_department||'', meta.aziz_qualification||'']} department={meta.aziz_department} postType={post.type} />
            {faqPosition === 'sidebar' && renderFaq()}

            {/* Disclaimer note */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-xs text-amber-800 leading-relaxed mt-6">
              <p className="font-black text-amber-900 mb-1.5 flex items-center gap-1.5 text-sm">⚠️ Disclaimer</p>
              <p>Get Job Update is an independent educational portal. We are not affiliated with any government body. Always verify details from the official website before applying.</p>
            </div>

          </aside>

        </div>
      </div>

      {/* Mobile Sticky Apply CTA */}
      <MobileStickyCTA
        applyLink={meta.aziz_apply_link}
        pdfLink={meta.aziz_notification}
        officialLink={meta.aziz_official_site}
        isResult={isResult}
      />
    </div>
  );
}
