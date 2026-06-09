import React from 'react';
import parse, { domToReact } from 'html-react-parser';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getPostBySlug, REVERSE_POST_TYPE_MAP, processContentAndHeadings, getPosts, getAffiliateSettings, getDeadlineStatus } from '@/lib/wordpress';
import dynamic from 'next/dynamic';
import Script from 'next/script';

// Static Server Components (Keep static)
import AffiliateSlot from '@/components/AffiliateSlot';
import AffiliateAd from '@/components/AffiliateAd';
import RecentPosts from '@/components/RecentPosts';
import RelatedJobs from '@/components/RelatedJobs';
import Breadcrumbs from '@/components/Breadcrumbs';

// Heavy Client Components (Lazy loaded)
const FAQAccordion = dynamic(() => import('@/components/FAQAccordion'));
const SyllabusTracker = dynamic(() => import('@/components/SyllabusTracker'));
const PushNotificationCard = dynamic(() => import('@/components/PushNotificationCard'));
const LanguageSwitcher = dynamic(() => import('@/components/LanguageSwitcher'));
const ShareWidget = dynamic(() => import('@/components/ShareWidget'));
const MobileStickyCTA = dynamic(() => import('@/components/MobileStickyCTA'));
const TableOfContents = dynamic(() => import('@/components/TableOfContents'));
const Comments = dynamic(() => import('@/components/Comments'));
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

  // Fetch all sidebar/footer data in parallel to significantly reduce network wait time
  const [recentJobs, recentResults, recentAdmitCards, affiliateSettings] = await Promise.all([
    getPosts('aziz_job', 5),
    getPosts('aziz_result', 5),
    getPosts('aziz_admit', 5),
    getAffiliateSettings()
  ]);

  const globalAmazonId = affiliateSettings?.amazon_id || '';

  const meta = post.custom_meta || {};
  
  // ─── Position Validation Helper ──────────────────────────────────────────
  // Validate and return position with fallback protection
  const validatePosition = (
    position: string | undefined,
    defaultPosition: string,
    validPositions: string[]
  ): string => {
    if (!position) return defaultPosition;
    if (validPositions.includes(position)) return position;
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Invalid position "${position}". Using default "${defaultPosition}"`);
    }
    return defaultPosition;
  };

  // Valid positions for FAQ and HowTo
  const FAQ_VALID_POSITIONS = [
    'before_content',
    'after_content',
    'before_related_posts',
    'after_related_posts',
    'before_faq',
    'after_faq',
    'sidebar',
    'hidden',
    'inline'
  ];

  const HOWTO_VALID_POSITIONS = [
    'before_content',
    'after_content',
    'before_related_posts',
    'after_related_posts',
    'before_faq',
    'after_faq',
    'sidebar',
    'hidden',
    'inline'
  ];

  // ─── FAQ & HowTo Data Extraction with Fallback Support ─────────────────────
  // Support BOTH data sources:
  // 1. New API structure: post.faq?.blocks, post.howto?.blocks (Array of block objects with IDs)
  // 2. Old API structure: post.faq?.items (Array of questions)
  // 3. Custom meta properties: post.custom_meta.faqs, post.custom_meta.howtos
  
  let faqs = ((post.faq as any)?.blocks && Array.isArray((post.faq as any).blocks) && (post.faq as any).blocks.length > 0)
    ? (post.faq as any).blocks
    : ((post.faq?.items && Array.isArray(post.faq.items) && post.faq.items.length > 0)
      ? [{ parsed: post.faq.items }]
      : (Array.isArray(meta.faqs) && meta.faqs.length > 0 ? [{ parsed: meta.faqs }] : []));
  
  const howtos = ((post.howto as any)?.blocks && Array.isArray((post.howto as any).blocks) && (post.howto as any).blocks.length > 0)
    ? (post.howto as any).blocks
    : (((post.howto as any)?.items && Array.isArray((post.howto as any).items) && (post.howto as any).items.length > 0)
      ? [{ parsed: (post.howto as any).items }]
      : (Array.isArray(meta.howtos) && meta.howtos.length > 0 ? [{ parsed: meta.howtos }] : []));
  
  const hasRankMathToc = !!meta.rank_math_toc_html;
  const { headings, content: processedHtml } = processContentAndHeadings(post.content.rendered, post.title.rendered.replace(/<[^>]*>?/gm, ''));

  let contentHasInlineFaq = false;
  let contentHasInlineHowTo = false;

  let finalHtml = processedHtml;
  
  // Auto Extract FAQs from RankMath / Yoast blocks if faqs is empty
  if (faqs.length === 0) {
    const qRegex = /<[^>]+class="[^"]*(?:question|schema-faq-question|rank-math-question)[^"]*"[^>]*>([\s\S]*?)<\/[^>]+>/gi;
    const aRegex = /<[^>]+class="[^"]*(?:answer|schema-faq-answer|rank-math-answer)[^"]*"[^>]*>([\s\S]*?)<\/(?:div|p)>/gi;
    
    const qMatches = [...finalHtml.matchAll(qRegex)];
    const aMatches = [...finalHtml.matchAll(aRegex)];
    
    if (qMatches.length > 0 && aMatches.length > 0) {
      const parsedFaqs = [];
      const len = Math.min(qMatches.length, aMatches.length);
      for (let i = 0; i < len; i++) {
        parsedFaqs.push({
          q: qMatches[i][1].replace(/<[^>]+>/g, '').trim(),
          a: aMatches[i][1].trim() // Keep HTML for answers
        });
      }
      if (parsedFaqs.length > 0) {
        faqs = [{ title: "Frequently Asked Questions", parsed: parsedFaqs }];
        
        // Inject placeholder before the first block
        finalHtml = finalHtml.replace(/(<div[^>]*class="[^"]*(?:wp-block-yoast-faq-block|rank-math-faq)[^"]*"[^>]*>)/i, '<div id="react-faq-placeholder"></div>$1');
        finalHtml = finalHtml.replace(/(<div[^>]*id="rank-math-faq"[^>]*>)/i, '<div id="react-faq-placeholder"></div>$1');
        
        // Hide original blocks so they don't show up twice
        finalHtml = finalHtml.replace(/class="([^"]*rank-math-faq[^"]*)"/g, 'class="$1 hidden"')
                             .replace(/id="rank-math-faq"/g, 'id="rank-math-faq" class="hidden"')
                             .replace(/class="([^"]*wp-block-yoast-faq-block[^"]*)"/g, 'class="$1 hidden"');
      }
    }
  }
  
  if (/\[smart_faq[^\]]*\]/gi.test(finalHtml)) {
    contentHasInlineFaq = true;
    finalHtml = finalHtml.replace(/\[smart_faq[^\]]*\]/gi, '<div id="react-faq-placeholder"></div>');
  } else if (/<div[^>]*data-schema="faq"[^>]*>/gi.test(finalHtml) || /wp-block-yoast-faq-block|schema-faq|rank-math-faq/i.test(finalHtml) || finalHtml.includes('react-faq-placeholder')) {
    contentHasInlineFaq = true;
  }
  
  if (/\[smart_howto[^\]]*\]/gi.test(finalHtml)) {
    contentHasInlineHowTo = true;
    finalHtml = finalHtml.replace(/\[smart_howto[^\]]*\]/gi, '<div id="react-howto-placeholder"></div>');
  } else if (/<div[^>]*data-schema="howto"[^>]*>/gi.test(finalHtml) || /schema-how-to|rank-math-howto-block|wp-block-yoast-how-to-block/i.test(finalHtml)) {
    contentHasInlineHowTo = true;
  }

  // ─── Auto Internal Linking Engine ──────────────────────────────────────────
  const internalLinks = [
    { word: 'Sarkari Result', link: '/results' },
    { word: 'Admit Card', link: '/admit-cards' },
    { word: 'Syllabus', link: '/syllabus' },
    { word: 'Answer Key', link: '/answer-keys' },
    { word: 'Latest Jobs', link: '/jobs' },
    { word: 'Govt Jobs', link: '/jobs' },
    { word: 'Government Jobs', link: '/jobs' },
  ];
  
  // Safe O(N) HTML parsing to avoid Regex Denial of Service (ReDoS) which caused 503 Timeouts
  const parts = finalHtml.split(/(<a[^>]*>|<\/a>|<[^>]*>)/i);
  
  internalLinks.forEach(item => {
    let replaced = false;
    let inAnchor = false;
    const regex = new RegExp(`\\b(${item.word})\\b`, 'i');
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!part) continue;
      
      const lowerPart = part.toLowerCase();
      if (lowerPart.startsWith('<a ') || lowerPart === '<a>') {
        inAnchor = true;
      } else if (lowerPart === '</a>') {
        inAnchor = false;
      } else if (!part.startsWith('<')) { // Text node
        if (!inAnchor && !replaced && regex.test(part)) {
          parts[i] = part.replace(regex, `<a href="${item.link}" class="text-blue-600 hover:text-blue-800 hover:underline font-semibold" title="${item.word}">$1</a>`);
          replaced = true;
        }
      }
    }
  });
  
  finalHtml = parts.join('');

  // ─── Position Extraction with Fallback Support & Debug Logging ──────────────
  // Support BOTH data sources with comprehensive fallback chain:
  // 1. Inline shortcodes (highest priority)
  // 2. Root-level properties: post.faq?.position, post.howto?.position
  // 3. Custom meta properties: post.custom_meta.faq_position, post.custom_meta.howto_position
  // 4. Default positions (lowest priority) with fallback protection
  
  const rawFaqPosition = contentHasInlineFaq 
    ? 'inline' 
    : (post.faq?.position || meta.faq_position || 'before_related_posts');
  
  const rawHowtoPosition = contentHasInlineHowTo 
    ? 'inline' 
    : (post.howto?.position || meta.howto_position || 'after_content');

  // Apply position validation with fallback protection
  const faqPosition = validatePosition(rawFaqPosition, 'before_related_posts', FAQ_VALID_POSITIONS);
  const howtoPosition = validatePosition(rawHowtoPosition, 'after_content', HOWTO_VALID_POSITIONS);

  // Development debugging
  if (process.env.NODE_ENV === 'development') {
    console.log('═══ FAQ/HowTo Position Debug ═══');
    console.log('FAQ Position:', { raw: rawFaqPosition, validated: faqPosition, hasData: faqs.length > 0, inlineDetected: contentHasInlineFaq });
    console.log('HowTo Position:', { raw: rawHowtoPosition, validated: howtoPosition, hasData: howtos.length > 0, inlineDetected: contentHasInlineHowTo });
    console.log('FAQ Data Source:', post.faq?.position ? 'post.faq.position' : (meta.faq_position ? 'meta.faq_position' : 'default'));
    console.log('HowTo Data Source:', post.howto?.position ? 'post.howto.position' : (meta.howto_position ? 'meta.howto_position' : 'default'));
    console.log('Post FAQ:', post.faq);
    console.log('Post HowTo:', post.howto);
    console.log('═════════════════════════════════');
  }

  const isResult = post.type === 'aziz_result';

  // ─── Dynamic Layout Positions ────────────────────────────────────────────
  const affiliateSlots = meta.affiliate_slots || [];

  // ─── Dates ──────────────────────────────────────────────────────────────
  const publishedDate = new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const modifiedDate  = new Date(post.modified).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  // Extract Featured Image if available
  const featuredMedia = (post as any)._embedded?.['wp:featuredmedia']?.[0];
  const featuredImageUrl = featuredMedia?.source_url || null;

  // Helper to clean up corrupted text fields and strip HTML tags
  const cleanText = (text: any) => {
    if (typeof text !== 'string') return text;
    let cleaned = text;
    if (cleaned.includes('","level":')) {
      cleaned = cleaned.split('","level":')[0].replace(/["{}]/g, '');
    }
    // Remove HTML tags completely so UI doesn't break
    cleaned = cleaned.replace(/<[^>]*>?/gm, '').trim();
    // Convert entities so we can strip them
    cleaned = cleaned.replace(/&quot;/gi, '"').replace(/&gt;/gi, '>').replace(/&lt;/gi, '<');
    // Remove lingering HTML attribute artifacts and punctuation (like /">, ">, or leading commas/hyphens)
    cleaned = cleaned.replace(/^[\/\"\>\,\-\s]+/, '');
    // Replace non-breaking spaces
    cleaned = cleaned.replace(/&nbsp;/g, ' ').trim();
    return cleaned;
  };

  const ensureAbsoluteUrl = (url: any) => {
    if (!url || typeof url !== 'string') return '';
    let cleaned = cleanText(url).trim();
    if (!cleaned) return '';
    if (!/^https?:\/\//i.test(cleaned) && !cleaned.startsWith('#') && !cleaned.startsWith('/')) {
      cleaned = 'https://' + cleaned;
    }
    return cleaned;
  };

  const applyLink = ensureAbsoluteUrl(meta.aziz_apply_link);
  const notificationLink = ensureAbsoluteUrl(meta.aziz_notification);
  const officialSiteLink = ensureAbsoluteUrl(meta.aziz_official_site);

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

  const renderFaq = (isInline = false, id: string | null = null) => {
    const currentFaqs = id ? faqs.filter((f: any) => f.id === id) : faqs;
    
    // DEBUG: If faqs is empty, show a debug block instead of returning null
    if (currentFaqs.length === 0) {
      if (!isInline && contentHasInlineFaq) return null;
      return (
        <div className="p-4 bg-red-100 text-red-800 rounded-lg border border-red-300 my-4 not-prose">
          <p className="font-bold">Next.js Debug: FAQ Intercepted but Data is Empty!</p>
          <p>Please provide FAQ data via the WordPress meta field.</p>
        </div>
      );
    }

    // If the shortcode is in the content, ONLY render inline, not in layout zones
    if (!isInline && contentHasInlineFaq) return null;

    return (
      <div id="article-faq-section" className={`mb-8 overflow-hidden not-prose ${isInline ? 'mt-8' : ''}`}>
        <AffiliateSlot position="before_faq" slots={affiliateSlots} fallbackTags={['laptop', 'study-table']} department={meta.aziz_department} postType={post.type} />
        <div className="mb-6 mt-10">
          <div className="text-center">
            <div role="heading" aria-level={2} className="text-2xl md:text-[28px] font-black text-slate-900 tracking-tight">
              Frequently Asked <span className="text-orange-600">Questions</span>
            </div>
          </div>
        </div>

        <div className="space-y-0">
          {currentFaqs.map((faqGroup: any, idx: number) => (
            <FAQAccordion key={idx} items={faqGroup.parsed || []} />
          ))}
        </div>
        
        <AffiliateSlot position="after_faq" slots={affiliateSlots} department={meta.aziz_department} postType={post.type} />
      </div>
    );
  };

  const renderHowTo = (isInline = false, id: string | null = null) => {
    const currentHowtos = id ? howtos.filter((h: any) => h.id === id) : howtos;
    if (currentHowtos.length === 0) return null;
    // If shortcode in content, ONLY render inline
    if (!isInline && contentHasInlineHowTo) return null;

    return (
      <div id="howto-instructions-section" className="mb-6 not-prose">
        <div className="space-y-4 mt-2">
          {currentHowtos.map((howto: any, idx: number) => (
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

  // ─── Schemas (Advanced Technical SEO) ────────────────────────
  const schemas: any[] = [];

  // 1. Article Schema
  schemas.push({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.seo_meta?.title || post.title.rendered.replace(/<[^>]*>?/gm, ''),
    "image": post.seo_meta?.og_image ? [post.seo_meta.og_image] : [],
    "datePublished": post.date,
    "dateModified": post.modified,
    "author": [{
        "@type": "Organization",
        "name": "Get Job Update",
        "url": "https://getjobupdate.co.in"
    }],
    "publisher": {
      "@type": "Organization",
      "name": "Get Job Update",
      "logo": {
        "@type": "ImageObject",
        "url": "https://getjobupdate.co.in/icon.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://getjobupdate.co.in/${type}/${slug}`
    }
  });

  // 2. BreadcrumbList Schema
  schemas.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://getjobupdate.co.in/" },
      { "@type": "ListItem", "position": 2, "name": type.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()), "item": `https://getjobupdate.co.in/${type}` },
      { "@type": "ListItem", "position": 3, "name": post.title.rendered.replace(/<[^>]*>?/gm, ''), "item": `https://getjobupdate.co.in/${type}/${slug}` }
    ]
  });

  // 3. FAQPage Schema
  if (faqs && faqs.length > 0) {
    const faqEntities: any[] = [];
    faqs.forEach((group: any) => {
      if (group.parsed) {
        group.parsed.forEach((faq: any) => {
          if (faq.q && faq.a) {
            const cleanQ = faq.q.replace(/<[^>]*>?/gm, '').trim();
            const cleanA = faq.a.replace(/<[^>]*>?/gm, '').trim();
            if (cleanQ && cleanA) {
              faqEntities.push({
                "@type": "Question",
                "name": cleanQ,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": cleanA
                }
              });
            }
          }
        });
      }
    });
    if (faqEntities.length > 0) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqEntities
      });
    }
  }

  // 4. HowTo Schema
  if (howtos && howtos.length > 0) {
    const mainHowto = howtos[0];
    if (mainHowto.parsed && mainHowto.parsed.length > 0) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": mainHowto.title || `How to apply for ${post.title.rendered.replace(/<[^>]*>?/gm, '')}`,
        "step": mainHowto.parsed.map((step: any, idx: number) => ({
          "@type": "HowToStep",
          "name": step.title ? step.title.replace(/<[^>]*>?/gm, '') : `Step ${idx + 1}`,
          "text": step.desc ? step.desc.replace(/<[^>]*>?/gm, '') : ''
        }))
      });
    }
  }

  // 5. JobPosting Schema (Only for Jobs)
  if (post.type === 'aziz_job') {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "JobPosting",
      "title": post.title.rendered.replace(/<[^>]*>?/gm, ''),
      "description": post.seo_meta?.description || post.title.rendered.replace(/<[^>]*>?/gm, ''),
      "datePosted": post.date,
      "validThrough": (() => {
         if (!meta.aziz_apply_end) return new Date(new Date(post.date).getTime() + 30*24*60*60*1000).toISOString();
         const d = new Date(cleanText(meta.aziz_apply_end));
         return isNaN(d.getTime()) ? new Date(new Date(post.date).getTime() + 30*24*60*60*1000).toISOString() : d.toISOString();
      })(),
      "employmentType": meta.job_type ? (meta.job_type.toUpperCase().includes('PART') ? 'PART_TIME' : 'FULL_TIME') : "FULL_TIME",
      "hiringOrganization": {
        "@type": "Organization",
        "name": cleanText(meta.aziz_department) || "Government Organization",
        "sameAs": "https://getjobupdate.co.in"
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "IN"
        }
      },
      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": "INR",
        "value": {
          "@type": "QuantitativeValue",
          "value": cleanText(meta.aziz_salary) || "Not Disclosed",
          "unitText": "MONTH"
        }
      }
    });
  }
  // --- Smart Tags Generation ---
  const generatedTags = new Set<string>();
  if (post.type === 'aziz_job') generatedTags.add('Latest Govt Jobs');
  else if (post.type === 'aziz_result') generatedTags.add('Sarkari Result');
  else if (post.type === 'aziz_admit') generatedTags.add('Admit Card');
  else if (post.type === 'aziz_answerkey') generatedTags.add('Answer Key');
  else if (post.type === 'aziz_syllabus') generatedTags.add('Syllabus');
  else if (post.type === 'aziz_admission') generatedTags.add('Admission');
  
  generatedTags.add('Get Job Update');
  const finalTagsList = Array.from(generatedTags).slice(0, 5).filter(Boolean);

  return (
    <div className="w-full font-sans min-h-screen bg-slate-50">
      
      <Script id="article-schemas" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />

      {/* ══════════════════════════════════════════════
          PREMIUM HERO SECTION
      ══════════════════════════════════════════════ */}
      <div className="bg-[#0b1120] w-full py-8 relative overflow-hidden z-0">
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none z-[-1]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px,white 1px,transparent 0)`, backgroundSize: '28px 28px' }} />
        <div className="absolute -top-20 -left-20 w-[400px] h-[400px] pointer-events-none z-[-1]" style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, rgba(37,99,235,0) 70%)' }} />
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] pointer-events-none z-[-1]" style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.1) 0%, rgba(79,70,229,0) 70%)' }} />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Breadcrumb */}
          <Breadcrumbs items={[
            { name: type.replace(/-/g,' ').replace(/\b\w/g, (c: string) => c.toUpperCase()), url: `/${type}` },
            { name: post.title.rendered.replace(/<[^>]*>?/gm, ''), url: `/${type}/${slug}` }
          ]} />

          {/* Highlight Badge, Verification & Language Switcher */}
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
            
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Updated: {modifiedDate}
              </div>
            </div>
          </div>

          {/* H1 Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-snug tracking-tight mb-6 max-w-4xl break-words"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }} />

          {/* Hero Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-6 mb-6 p-5 bg-white/5 border border-white/10 rounded-2xl max-w-4xl">
            {post.type === 'aziz_admit' && (
              <>
                <div className="flex flex-col min-w-0">
                  <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1.5 shrink-0">🏢 Department</span>
                  <span className="text-white font-black text-sm break-words leading-snug line-clamp-3" title={cleanText(meta.aziz_department)}>{cleanText(meta.aziz_department) || '-'}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1.5 shrink-0">📝 Exam Name</span>
                  <span className="text-orange-400 font-black text-sm break-words leading-snug line-clamp-3" title={cleanText(meta.aziz_exam_name)}>{cleanText(meta.aziz_exam_name) || '-'}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1.5 shrink-0">📅 Exam Date</span>
                  <span className="text-blue-400 font-black text-sm break-words leading-snug line-clamp-3" title={cleanText(meta.aziz_exam_date)}>{cleanText(meta.aziz_exam_date) || '-'}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1.5 shrink-0">🎫 Admit Card Status</span>
                  <span className="text-emerald-400 font-black text-sm break-words leading-snug line-clamp-3" title={cleanText(meta.aziz_admit_status)}>{cleanText(meta.aziz_admit_status) || '-'}</span>
                </div>
                <div className="flex flex-col min-w-0 col-span-1 sm:col-span-2 md:col-span-4">
                  <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1.5 shrink-0">📅 Release Date</span>
                  <span className="text-purple-400 font-black text-sm break-words leading-snug line-clamp-3" title={cleanText(meta.aziz_admit_release_date)}>{cleanText(meta.aziz_admit_release_date) || '-'}</span>
                </div>
              </>
            )}

            {post.type === 'aziz_result' && (
              <>
                <div className="flex flex-col min-w-0">
                  <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1.5 shrink-0">🏢 Department</span>
                  <span className="text-white font-black text-sm break-words leading-snug line-clamp-3" title={cleanText(meta.aziz_department)}>{cleanText(meta.aziz_department) || '-'}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1.5 shrink-0">📝 Exam Name</span>
                  <span className="text-orange-400 font-black text-sm break-words leading-snug line-clamp-3" title={cleanText(meta.aziz_exam_name)}>{cleanText(meta.aziz_exam_name) || '-'}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1.5 shrink-0">📅 Exam Date</span>
                  <span className="text-blue-400 font-black text-sm break-words leading-snug line-clamp-3" title={cleanText(meta.aziz_exam_date)}>{cleanText(meta.aziz_exam_date) || '-'}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1.5 shrink-0">📢 Result Status</span>
                  <span className="text-emerald-400 font-black text-sm break-words leading-snug line-clamp-3" title={cleanText(meta.aziz_result_status)}>{cleanText(meta.aziz_result_status) || '-'}</span>
                </div>
                <div className="flex flex-col min-w-0 col-span-1 sm:col-span-2 md:col-span-4">
                  <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1.5 shrink-0">📅 Result Date</span>
                  <span className="text-purple-400 font-black text-sm break-words leading-snug line-clamp-3" title={cleanText(meta.aziz_result_date)}>{cleanText(meta.aziz_result_date) || '-'}</span>
                </div>
              </>
            )}

            {post.type === 'aziz_answerkey' && (
              <>
                <div className="flex flex-col min-w-0">
                  <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1.5 shrink-0">🏢 Department</span>
                  <span className="text-white font-black text-sm break-words leading-snug line-clamp-3" title={cleanText(meta.aziz_department)}>{cleanText(meta.aziz_department) || '-'}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1.5 shrink-0">📝 Exam Name</span>
                  <span className="text-orange-400 font-black text-sm break-words leading-snug line-clamp-3" title={cleanText(meta.aziz_exam_name)}>{cleanText(meta.aziz_exam_name) || '-'}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1.5 shrink-0">📅 Exam Date</span>
                  <span className="text-blue-400 font-black text-sm break-words leading-snug line-clamp-3" title={cleanText(meta.aziz_exam_date)}>{cleanText(meta.aziz_exam_date) || '-'}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1.5 shrink-0">📢 Status</span>
                  <span className="text-emerald-400 font-black text-sm break-words leading-snug line-clamp-3" title={cleanText(meta.aziz_answerkey_status)}>{cleanText(meta.aziz_answerkey_status) || '-'}</span>
                </div>
                <div className="flex flex-col min-w-0 col-span-1 sm:col-span-2 md:col-span-4">
                  <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1.5 shrink-0">📅 Objection Last Date</span>
                  <span className="text-purple-400 font-black text-sm break-words leading-snug line-clamp-3" title={cleanText(meta.aziz_objection_last_date)}>{cleanText(meta.aziz_objection_last_date) || '-'}</span>
                </div>
              </>
            )}

            {post.type === 'aziz_yojana' && (
              <>
                <div className="flex flex-col min-w-0">
                  <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1.5 shrink-0">🏢 Ministry/Dept</span>
                  <span className="text-white font-black text-sm break-words leading-snug line-clamp-3" title={cleanText(meta.aziz_department)}>{cleanText(meta.aziz_department) || '-'}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1.5 shrink-0">🏛 Scheme Name</span>
                  <span className="text-orange-400 font-black text-sm break-words leading-snug line-clamp-3" title={cleanText(meta.aziz_scheme_name)}>{cleanText(meta.aziz_scheme_name) || '-'}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1.5 shrink-0">👨‍👩‍👧‍👦 Beneficiaries</span>
                  <span className="text-blue-400 font-black text-sm break-words leading-snug line-clamp-3" title={cleanText(meta.aziz_beneficiaries)}>{cleanText(meta.aziz_beneficiaries) || '-'}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1.5 shrink-0">💰 Benefit Amount</span>
                  <span className="text-emerald-400 font-black text-sm break-words leading-snug line-clamp-3" title={cleanText(meta.aziz_benefit_amount)}>{cleanText(meta.aziz_benefit_amount) || '-'}</span>
                </div>
                <div className="flex flex-col min-w-0 col-span-1 sm:col-span-2 md:col-span-4">
                  <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1.5 shrink-0">📅 Last Date</span>
                  <span className="text-purple-400 font-black text-sm break-words leading-snug line-clamp-3" title={cleanText(meta.aziz_apply_end)}>{cleanText(meta.aziz_apply_end) || '-'}</span>
                </div>
              </>
            )}

            {post.type === 'aziz_syllabus' && (
              <>
                <div className="flex flex-col min-w-0">
                  <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1.5 shrink-0">🏢 Department</span>
                  <span className="text-white font-black text-sm break-words leading-snug line-clamp-3" title={cleanText(meta.aziz_department)}>{cleanText(meta.aziz_department) || '-'}</span>
                </div>
                <div className="flex flex-col min-w-0 col-span-1 sm:col-span-3">
                  <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1.5 shrink-0">📝 Exam Name</span>
                  <span className="text-orange-400 font-black text-sm break-words leading-snug line-clamp-3" title={cleanText(meta.aziz_exam_name)}>{cleanText(meta.aziz_exam_name) || '-'}</span>
                </div>
              </>
            )}

            {(post.type === 'aziz_job' || post.type === 'post') && (
              <>
                <div className="flex flex-col min-w-0">
                  <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1.5 shrink-0">🏢 Department</span>
                  <span className="text-white font-black text-sm break-words leading-snug line-clamp-3" title={cleanText(meta.aziz_department)}>{cleanText(meta.aziz_department) || '-'}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1.5 shrink-0">📋 Vacancy</span>
                  <span className="text-orange-400 font-black text-sm break-words leading-snug line-clamp-3" title={cleanText(meta.aziz_total_posts)}>{cleanText(meta.aziz_total_posts) || '-'}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1.5 shrink-0">🎓 Qualification</span>
                  <span className="text-blue-400 font-black text-sm break-words leading-snug line-clamp-3" title={cleanText(meta.aziz_qualification)}>{cleanText(meta.aziz_qualification) || '-'}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1.5 shrink-0">💰 Salary</span>
                  <span className="text-emerald-400 font-black text-sm break-words leading-snug line-clamp-3" title={cleanText(meta.aziz_salary)}>{cleanText(meta.aziz_salary) || '-'}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1.5 shrink-0">⚡ Job Type</span>
                  <span className="text-indigo-400 font-black text-sm break-words leading-snug line-clamp-3" title={cleanText(meta.job_type)}>{cleanText(meta.job_type) || 'Permanent / Govt'}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1.5 shrink-0">💻 App Mode</span>
                  <span className="text-purple-400 font-black text-sm break-words leading-snug line-clamp-3" title={cleanText(meta.application_mode)}>{cleanText(meta.application_mode) || 'Online Form'}</span>
                </div>
                <div className="flex flex-col min-w-0 col-span-1 sm:col-span-2 md:col-span-2">
                  <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1.5 shrink-0">📅 Last Date / Status</span>
                  {(() => {
                    const deadlineStr = cleanText(meta.aziz_apply_end);
                    if (isResult) return <span className="text-emerald-400 font-black text-sm break-words leading-snug line-clamp-3">Result Declared</span>;
                    if (!deadlineStr) return <span className="text-slate-300 font-black text-sm break-words leading-snug line-clamp-3">-</span>;
                    const status = getDeadlineStatus(deadlineStr);
                    const colorClass = status.color === 'green' ? 'text-emerald-400' : status.color === 'yellow' ? 'text-amber-400' : 'text-rose-400';
                    return <span className={`${colorClass} font-black text-sm break-words leading-snug line-clamp-3`} title={deadlineStr}>{deadlineStr}</span>;
                  })()}
                </div>
              </>
            )}
            
            {/* Fallback for other unmapped types */}
            {(!['aziz_admit', 'aziz_result', 'aziz_answerkey', 'aziz_yojana', 'aziz_syllabus', 'aziz_job', 'post'].includes(post.type)) && (
              <>
                <div className="flex flex-col min-w-0">
                  <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1.5 shrink-0">🏢 Department</span>
                  <span className="text-white font-black text-sm break-words leading-snug line-clamp-3" title={cleanText(meta.aziz_department)}>{cleanText(meta.aziz_department) || '-'}</span>
                </div>
                <div className="flex flex-col min-w-0 col-span-1 sm:col-span-3">
                  <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1.5 shrink-0">📅 Last Date / Status</span>
                  <span className="text-purple-400 font-black text-sm break-words leading-snug line-clamp-3" title={cleanText(meta.aziz_apply_end)}>{cleanText(meta.aziz_apply_end) || '-'}</span>
                </div>
              </>
            )}
          </div>

          {/* Smart Tags (State, Qualification, Category, etc.) */}
          {finalTagsList && finalTagsList.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8 max-w-4xl">
              {finalTagsList.map((tag, idx) => (
                <span key={idx} className="bg-white/10 hover:bg-white/15 transition-colors cursor-default text-white/90 text-[11px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-full border border-white/10 shadow-sm backdrop-blur-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Hero CTAs */}
          <div className="flex flex-wrap gap-3 items-center">
             {applyLink && (
                <a href={applyLink} target="_blank" rel="noopener noreferrer" 
                   className={`${isResult ? 'bg-green-600 hover:bg-green-700 shadow-green-600/30' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30'} w-full sm:w-auto text-base text-white font-black px-8 py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2`}>
                  {isResult ? '🚀 Check Result Online' : 'Apply Now Online'}
                </a>
             )}
             {notificationLink && (
                <a href={notificationLink} target="_blank" rel="noopener noreferrer" className="bg-slate-800 text-white font-bold px-6 py-4 rounded-xl hover:bg-slate-700 transition-all border border-slate-700 flex items-center justify-center gap-2 text-sm w-full sm:w-auto">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/></svg>
                  Download Notification
                </a>
             )}
             {officialSiteLink && (
                <a href={officialSiteLink} target="_blank" rel="noopener noreferrer" className="bg-transparent text-slate-300 font-bold px-6 py-4 rounded-xl hover:bg-white/5 hover:text-white transition-all border border-slate-700 flex items-center justify-center gap-2 text-sm w-full sm:w-auto">
                  Official Website
                </a>
             )}
          </div>

        </div>
      </div>

      {/* ══════════════════════════════════════════════
          MAIN 8-4 LAYOUT
      ══════════════════════════════════════════════ */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ══ CENTER ARTICLE [col-span-8] ══ */}
          <article className="lg:col-span-8 space-y-0 min-w-0">
            
            {/* Share Widget */}
            <div className="mb-6"><ShareWidget /></div>

            {/* Top Affiliate Slot */}
            <AffiliateSlot position="before_content" slots={affiliateSlots} fallbackTags={['laptop', 'study-table', 'printer']} department={meta.aziz_department} postType={post.type} />




            {/* Table of Contents (Rank Math Fallback) */}
            {hasRankMathToc ? (
              <div className="mb-6 bg-white p-6 rounded-xl shadow-sm border border-slate-200 toc-container" dangerouslySetInnerHTML={{ __html: meta.rank_math_toc_html! }} />
            ) : (
              <TableOfContents headings={headings} />
            )}

            {/* Syllabus tracker */}
            {type === 'syllabus' && (
              <div id="syllabus-progress-tracker" className="mb-6 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <SyllabusTracker keySlug={post.slug} />
              </div>
            )}

            {/* Dynamic Zone: Before Content */}
            {faqPosition === 'before_content' && renderFaq()}
            {howtoPosition === 'before_content' && renderHowTo()}

            {/* Full Article Body */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
              
              {/* Featured Image (if available) */}
              {featuredImageUrl && (
                <div className="w-full border-b border-slate-200 bg-slate-50 relative flex justify-center">
                  <Image 
                    src={featuredImageUrl} 
                    alt={post.title.rendered.replace(/<[^>]*>?/gm, '')} 
                    width={1200}
                    height={500}
                    className="w-full max-h-[500px] object-contain" 
                    priority={true}
                  />
                </div>
              )}

              <div className="px-6 py-6 md:px-8 md:py-8">
                <div id="full-article-content" className="post-content prose prose-slate max-w-none text-slate-700 text-[17px] leading-8 prose-headings:font-bold prose-h2:text-2xl">
                  {parse(finalHtml, {
                    replace: (domNode: any) => {
                      // Optimize WordPress images automatically with Next.js Image component
                      if (domNode.name === 'img' && domNode.attribs && domNode.attribs.src) {
                        return (
                          <Image
                            src={domNode.attribs.src}
                            alt={domNode.attribs.alt || ''}
                            width={domNode.attribs.width ? parseInt(domNode.attribs.width, 10) : 800}
                            height={domNode.attribs.height ? parseInt(domNode.attribs.height, 10) : 450}
                            style={{ width: '100%', height: 'auto' }}
                            className={domNode.attribs.class || 'rounded-xl shadow-sm my-6 mx-auto'}
                            loading="lazy"
                          />
                        );
                      }
                      if (domNode.attribs && domNode.attribs['data-schema'] === 'faq') {
                        return renderFaq(true, domNode.attribs['data-id']);
                      }
                      if (domNode.attribs && domNode.attribs['data-schema'] === 'howto') {
                        return renderHowTo(true, domNode.attribs['data-id']);
                      }
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
                      
                      // Inject Global Amazon Affiliate ID into any existing Amazon links in content
                      if (domNode.name === 'a' && domNode.attribs && domNode.attribs.href && globalAmazonId) {
                        const href = domNode.attribs.href;
                        if (href.includes('amazon.') || href.includes('amzn.to')) {
                           let finalLink = href.replace(/([?&])tag=[^&]+(&|$)/, '$1');
                           finalLink = finalLink.replace(/[?&]$/, '');
                           finalLink += (finalLink.includes('?') ? '&' : '?') + 'tag=' + encodeURIComponent(globalAmazonId);
                           domNode.attribs.href = finalLink;
                           return domNode;
                        }
                      }
                      
                      // Make tables responsive on mobile by wrapping them in a scrollable container
                      if (domNode.name === 'table') {
                        // We do a simple React element creation to avoid infinite recursion
                        // We map basic attributes manually (class -> className, etc)
                        const props: any = {};
                        if (domNode.attribs) {
                          for (const key in domNode.attribs) {
                             if (key === 'class') props.className = domNode.attribs[key];
                             else if (key === 'colspan') props.colSpan = domNode.attribs[key];
                             else if (key === 'rowspan') props.rowSpan = domNode.attribs[key];
                             else props[key] = domNode.attribs[key];
                          }
                        }
                        // We want to process the children normally, so we don't pass 'replace' again to avoid complexity.
                        // For tables, domToReact is usually fine without recursive replacements inside.
                        return (
                          <div className="responsive-table-wrapper">
                            <table {...props}>
                              {domToReact(domNode.children as any)}
                            </table>
                          </div>
                        );
                      }
                    }
                  })}

                  {/* If position is after_content, integrate them seamlessly at the end of the article text */}
                  {faqPosition === 'after_content' && renderFaq(true)}
                  {howtoPosition === 'after_content' && renderHowTo(true)}

                  {/* Smart Tags Section */}
                  {finalTagsList.length > 0 && (
                    <div className="mt-10 pt-8 border-t border-slate-100">
                      <div className="flex items-center gap-2 mb-4">
                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest">Related Tags</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {finalTagsList.map((tag, idx) => (
                          <span key={idx} className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors cursor-default">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
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

            {/* Dynamic Zone: Before FAQ */}
            {faqPosition === 'before_faq' && renderFaq()}
            {howtoPosition === 'before_faq' && renderHowTo()}

            {/* Dynamic Zone: Before Related Posts */}
            <AffiliateSlot position="before_related_posts" slots={affiliateSlots} fallbackTags={['study table', 'laptop']} department={meta.aziz_department} postType={post.type} />
            {faqPosition === 'before_related_posts' && renderFaq()}
            {howtoPosition === 'before_related_posts' && renderHowTo()}

            {/* Dynamic Zone: After FAQ */}
            {faqPosition === 'after_faq' && renderFaq()}
            {howtoPosition === 'after_faq' && renderHowTo()}

            {/* Related Jobs / Results */}
            <RelatedJobs department={meta.aziz_department} qualification={meta.aziz_qualification} postType={post.type} />

            {/* Dynamic Zone: After Related Posts */}
            {faqPosition === 'after_related_posts' && renderFaq()}

            {/* Comments Section */}
            <Comments postId={post.id} />

          </article>

          {/* ══ RIGHT SIDEBAR [col-span-4] ══ */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 self-start space-y-6 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto sidebar-scroll pr-2 pb-4">

            {/* Affiliate Ad Slot (Replaced Important Links Buttons) */}
            <AffiliateSlot position="sidebar" slots={affiliateSlots} fallbackTags={['study table', 'laptop']} department={meta.aziz_department} postType={post.type} />
            
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
            {howtoPosition === 'sidebar' && renderHowTo()}

            {/* Disclaimer note */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-xs text-amber-800 leading-relaxed mt-6">
              <p className="font-black text-amber-900 mb-1.5 flex items-center gap-1.5 text-sm">⚠️ Disclaimer</p>
              <p>Get Job Update is an independent educational portal. We are not affiliated with any government body. Always verify details from the official website before applying.</p>
            </div>

          </aside>

        </div>
      </div>

      {/* JSON-LD Schema Scripts */}
      <Script
        id="schema-main"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            post.type === 'aziz_job'
              ? {
                  "@context": "https://schema.org",
                  "@type": "JobPosting",
                  "title": post.title.rendered.replace(/<[^>]+>/g, '').trim(),
                  "description": post.seo_meta?.description || post.title.rendered.replace(/<[^>]+>/g, '').trim(),
                  "datePosted": post.date,
                  "validThrough": (() => {
                    const fallback = new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString();
                    if ((meta as any).aziz_apply_end) {
                      const d = new Date((meta as any).aziz_apply_end);
                      return isNaN(d.getTime()) ? fallback : d.toISOString();
                    }
                    return fallback;
                  })(),
                  "employmentType": "FULL_TIME",
                  "hiringOrganization": {
                    "@type": "Organization",
                    "name": meta.aziz_department || "Government Organization",
                    "sameAs": "https://getjobupdate.co.in"
                  },
                  "jobLocation": {
                    "@type": "Place",
                    "address": {
                      "@type": "PostalAddress",
                      "addressCountry": "IN"
                    }
                  }
                }
              : {
                  "@context": "https://schema.org",
                  "@type": "Article",
                  "headline": post.title.rendered.replace(/<[^>]+>/g, '').trim(),
                  "description": post.seo_meta?.description || post.title.rendered.replace(/<[^>]+>/g, '').trim(),
                  "image": post.seo_meta?.og_image || "https://getjobupdate.co.in/logo.png",
                  "datePublished": post.date,
                  "dateModified": post.modified,
                  "author": [{
                    "@type": "Person",
                    "name": "Get Job Update",
                    "url": "https://getjobupdate.co.in"
                  }]
                }
          )
        }}
      />
      {faqs && faqs.length > 0 && (
        <Script
          id="schema-faq"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": faqs.map((f: any) => ({
                "@type": "Question",
                "name": f.q?.replace(/<[^>]+>/g, '').trim() || '',
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": f.a?.replace(/<[^>]+>/g, '').trim() || ''
                }
              }))
            })
          }}
        />
      )}

      {/* Mobile Sticky Apply CTA */}
      <MobileStickyCTA
        applyLink={applyLink}
        pdfLink={notificationLink}
        officialLink={officialSiteLink}
        isResult={isResult}
      />
    </div>
  );
}
