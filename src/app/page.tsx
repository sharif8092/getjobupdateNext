import React from 'react';
import Link from 'next/link';
import { 
  getPosts, 
  WordPressPost, 
  STATES_LIST, 
  QUALIFICATIONS_LIST, 
  CATEGORIES_LIST,
  POST_TYPE_MAP 
} from '@/lib/wordpress';
import IndiaMap from '@/components/IndiaMap';
import FAQAccordion from '@/components/FAQAccordion';
import JobMatcher from '@/components/JobMatcher';
import AffiliateShowcase from '@/components/AffiliateShowcase';

// Home FAQ items for rich search snippets and organic authority
const HOME_FAQS = [
  {
    q: 'How does Get Job Update verify its notifications?',
    a: 'Every listing on our platform undergoes a rigorous 3-step verification process. Our editors audit official government gazettes, employment news bulletins, and verified department websites before publishing any link. We do not use speculative sources.'
  },
  {
    q: 'Can I filter jobs by my educational qualification?',
    a: 'Yes! Directly below our hero section, you will find the <strong>Qualification Grid</strong>. You can click on cards like 10th Pass, 12th Pass, ITI, Diploma, or Graduate to instantly check active recruitments matched to your qualification level.'
  },
  {
    q: 'Are the results and admit card links updated in real-time?',
    a: 'Absolutely. We track servers of recruitment boards like SSC, RRB, UPSC, State PSCs, and Board Exams around the clock. Once a result portal is activated, our server updates the direct action link immediately.'
  },
  {
    q: 'How can I search for jobs in my specific state?',
    a: 'Scroll down to our <strong>Interactive India SVG Map</strong>. You can hover over your region to see live statistics and click to view all updates registered under your state archives.'
  }
];

export const revalidate = 300; // Revalidate cache every 5 minutes (ISR)

export default async function HomePage() {
  // Fetch latest updates across different custom post types in parallel
  let posts: WordPressPost[] = [];
  try {
    const [jobs, results, admits, yojanas] = await Promise.all([
      getPosts('aziz_job', 15),
      getPosts('aziz_result', 10),
      getPosts('aziz_admit', 10),
      getPosts('aziz_yojana', 5)
    ]);
    
    // Merge all posts and sort by date descending
    posts = [...jobs, ...results, ...admits, ...yojanas]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 30); // Grab the top 30 to perfectly balance the long sidebar
  } catch (err) {
    console.error('Failed to fetch posts on server, loading fallback mocks', err);
  }

  // Format category badge styling HSL colors based on key for maximum premium aesthetics
  const getBadgeStyles = (type: string) => {
    switch (type) {
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
    <div className="w-full flex flex-col font-baloo">
      {/* 1. Modern Glowing Hero Section */}
      <section className="relative overflow-hidden bg-[#030712] text-white py-20 border-b border-slate-900">
        {/* Premium animated organic mesh background */}
        <div className="mesh-gradient-container">
          <div className="mesh-blob-1"></div>
          <div className="mesh-blob-2"></div>
          <div className="mesh-blob-3"></div>
        </div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          {/* Quick stats tags */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/15 border border-blue-500/20 px-3.5 py-1 text-xs font-black font-rajdhani uppercase tracking-wider text-blue-400">
              ⚡ 2,450+ Active Updates
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/20 px-3.5 py-1 text-xs font-black font-rajdhani uppercase tracking-wider text-emerald-400">
              🛡️ 100% Verified Gazette Info
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-rajdhani leading-none tracking-tight uppercase">
            SABSE TEJ, BILKUL VERIFIED <br />
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-blue-400 bg-clip-text text-transparent drop-shadow-sm">
              SARKARI UPDATE CENTER
            </span>
          </h1>

          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Get instant server-side notifications for Government Jobs, Sarkari Results, Admit Cards, and Yojana details directly from verified official gazettes.
          </p>

          {/* Social links grid strip */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 max-w-md mx-auto">
            <a 
              href="#" 
              className="flex-1 min-w-[140px] flex items-center justify-center gap-2 rounded-xl bg-[#0088cc] hover:bg-[#0088cc]/90 text-white font-rajdhani font-black tracking-wide text-sm py-3 px-4 shadow-lg shadow-[#0088cc]/20 transition-all hover:scale-102"
            >
              <span>✈️</span> JOIN TELEGRAM
            </a>
            <a 
              href="#" 
              className="flex-1 min-w-[140px] flex items-center justify-center gap-2 rounded-xl bg-[#25d366] hover:bg-[#25d366]/90 text-[#0f172a] font-rajdhani font-black tracking-wide text-sm py-3 px-4 shadow-lg shadow-[#25d366]/20 transition-all hover:scale-102"
            >
              <span>💬</span> JOIN WHATSAPP
            </a>
          </div>
        </div>
      </section>

      {/* 2. Premium Qualification Selection Cards Grid */}
      <section id="qualifications-section" className="w-full py-12 bg-slate-50 dark:bg-slate-950/20 border-b border-[var(--border)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold font-rajdhani text-[var(--foreground)] uppercase tracking-wide">
              🎯 Apni Qualification Chunein — Jobs Dhundein
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Select your academic background to find corresponding active career openings immediately.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {QUALIFICATIONS_LIST.map((qual, index) => {
              // Stable pastel themes for the emoji background box based on index
              const colorThemes = [
                'bg-pink-100 dark:bg-pink-950/40 text-pink-700 dark:text-pink-400',
                'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400',
                'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400',
                'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400',
                'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400',
                'bg-teal-100 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400',
                'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400',
                'bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400'
              ];
              const theme = colorThemes[index % colorThemes.length];

              return (
                <Link 
                  key={qual.slug} 
                  href={`/qualification/${qual.slug}`}
                  className="glass-card flex flex-col items-center justify-center p-6 text-center rounded-2xl border border-[var(--border)] transition-all duration-300 hover:scale-105 hover:rotate-1 hover:border-amber-400/80 group"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm mb-3 group-hover:scale-110 transition-transform ${theme}`}>
                    {qual.emoji}
                  </div>
                  <h3 className="font-rajdhani font-black text-lg text-[var(--foreground)] leading-tight uppercase group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                    {qual.name}
                  </h3>
                  <span className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wide">
                    {qual.count} Open Jobs
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Categories Badges Strip */}
      <section className="w-full py-6 border-b border-[var(--border)] bg-white dark:bg-[#0b0f19]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-none flex gap-3.5 py-1 justify-start md:justify-center items-center">
          <span className="text-xs font-black font-rajdhani uppercase tracking-wider text-slate-400 flex-shrink-0">
            📌 QUICK NAV:
          </span>
          {CATEGORIES_LIST.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-4 py-1.5 text-xs font-extrabold font-rajdhani text-[var(--foreground)] bg-slate-50 dark:bg-slate-900/10 hover:bg-amber-400 hover:border-amber-400 hover:text-slate-900 transition-all uppercase whitespace-nowrap"
            >
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Sarkari Eligibility Personalized Job Matcher */}
      <JobMatcher />

      {/* 4. Main Timeline Container & Sidebar Workspace */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Block: 30 Stacked Feed Cards (8 Columns) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="border-b border-[var(--border)] pb-4">
              <h3 className="text-xl font-bold font-rajdhani tracking-wide text-[var(--foreground)] uppercase flex items-center gap-2">
                🚀 LATEST BULLETINS & ACTIVE EXAM CARDS
              </h3>
              <p className="text-xs text-slate-400">
                Pre-rendered dynamic catalog. Live updates refresh automatically.
              </p>
            </div>

            {posts.length > 0 ? (
              <div className="space-y-4">
                {posts.map((post) => {
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
                        {/* Badges and metadata */}
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

                        {/* Title linking to slug */}
                        <Link 
                          href={`/${postTypeSlug}/${post.slug}`}
                          className="block text-base md:text-lg font-bold text-[var(--foreground)] group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors"
                          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                        />

                        {/* Mini statistics strip */}
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-slate-500 font-medium">
                          {totalPosts && (
                            <span className="flex items-center gap-1">
                              <strong>🔢 Posts:</strong> {totalPosts}
                            </span>
                          )}
                          {deadline && (
                            <span className="flex items-center gap-1">
                              <strong>📅 Closing:</strong> {deadline}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <strong>📍 Location:</strong> {post.custom_meta?.aziz_job_location || 'All India'}
                          </span>
                        </div>
                      </div>

                      {/* Action CTA Button */}
                      <Link
                        href={`/${postTypeSlug}/${post.slug}`}
                        className="w-full md:w-auto flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-amber-400 dark:hover:bg-amber-400 hover:text-slate-900 text-white px-5 py-2.5 text-xs font-black font-rajdhani tracking-wider uppercase transition-colors"
                      >
                        Details
                        <span>→</span>
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center border-2 border-dashed border-[var(--border)] rounded-2xl text-slate-400">
                No bulletins active in the API cache right now. Check back soon.
              </div>
            )}
          </div>

          {/* Right Block: Sidebar Widgets (4 Columns) */}
          <aside className="lg:col-span-4 space-y-8">
            
            {/* Sidebar Telegram & WhatsApp Glow Card */}
            <div className="rounded-3xl bg-gradient-to-tr from-[#020617] to-[#0f172a] p-6 text-white border border-slate-800 shadow-xl relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl"></div>
              
              <div className="space-y-4 relative z-10">
                <span className="text-[10px] font-black font-rajdhani tracking-widest text-amber-400 uppercase bg-amber-400/10 rounded px-2.5 py-0.5">
                  Live Notifications
                </span>
                <h4 className="text-xl font-bold font-rajdhani uppercase tracking-wide">
                  Join Social Update Channels
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Join 1M+ aspirants receiving real-time government job PDF files and direct portal URLs daily.
                </p>
                <div className="space-y-2 pt-2">
                  <a 
                    href="#" 
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0088cc] hover:bg-[#0088cc]/90 text-white font-rajdhani font-black text-xs py-3 tracking-wide transition-all"
                  >
                    ✈️ TELEGRAM CHANNEL (FREE)
                  </a>
                  <a 
                    href="#" 
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-[#0f172a] font-rajdhani font-black text-xs py-3 tracking-wide transition-all"
                  >
                    💬 WHATSAPP GROUP LINKS
                  </a>
                </div>
              </div>
            </div>

            {/* Sidebar Widget 2: Qualification list (Aesthetic 2-column list with truncation) */}
            <div className="glass-card rounded-2xl border border-[var(--border)] p-6 space-y-4">
              <h4 className="text-lg font-black font-rajdhani tracking-wider text-[var(--foreground)] uppercase border-b border-[var(--border)] pb-2.5 flex items-center gap-2">
                🎓 Qualification Filter
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold font-rajdhani">
                {QUALIFICATIONS_LIST.map((qual) => (
                  <Link
                    key={qual.slug}
                    href={`/qualification/${qual.slug}`}
                    className="rounded-lg border border-[var(--border)] bg-slate-50 dark:bg-slate-900/15 p-2.5 hover:border-amber-400 hover:text-amber-500 transition-colors uppercase whitespace-nowrap overflow-hidden text-ellipsis block text-center"
                    title={qual.name}
                  >
                    {qual.emoji} {qual.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Sidebar Widget 3: Jobs by State (Aesthetic 2-column state pills with truncation) */}
            <div className="glass-card rounded-2xl border border-[var(--border)] p-6 space-y-4">
              <h4 className="text-lg font-black font-rajdhani tracking-wider text-[var(--foreground)] uppercase border-b border-[var(--border)] pb-2.5 flex items-center gap-2">
                🗺️ Jobs by State
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold font-rajdhani">
                {STATES_LIST.slice(0, 14).map((state) => (
                  <Link
                    key={state.slug}
                    href={`/state/${state.slug}`}
                    className="rounded-lg border border-[var(--border)] bg-slate-50 dark:bg-slate-900/15 p-2.5 hover:border-amber-400 hover:text-amber-500 transition-colors uppercase whitespace-nowrap overflow-hidden text-ellipsis block text-center"
                    title={state.name}
                  >
                    📍 {state.name}
                  </Link>
                ))}
              </div>
            </div>

          </aside>

        </div>
      </section>

      <AffiliateShowcase />

      {/* 5. SVG India Map Component (Below workspace container) */}
      <IndiaMap />

      {/* 6. Rich SEO Directory Text folder & FAQ Accordion Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 border-t border-[var(--border)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* SEO Rich Text Section (Left 5 Columns) */}
          <div className="lg:col-span-5 space-y-5 prose prose-slate dark:prose-invert">
            <h3 className="text-2xl font-black font-rajdhani text-[var(--foreground)] uppercase tracking-wide">
              🇮🇳 Sarkari Result & Latest Jobs Portal
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Welcome to **Get Job Update**, India&apos;s digital notification center for daily employment news, sarkari updates, competitive results, and exam resources. We understand the value of quick, authentic notifications when you are preparing for central and state-level exams.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Our advanced data-parsing engine integrates directly with standard administrative REST configurations to aggregate updates from organizations including **UPSC, SSC, Railway Recruitment Boards (RRB), Public Sector Banks (IBPS)**, and various state-level civil service commissions. From 10th pass recruitments to specialized postgraduate research fellowships, explore fully customized directory listings.
            </p>
            <div className="pt-2">
              <span className="text-[11px] font-black font-rajdhani tracking-widest text-blue-500 dark:text-blue-400 uppercase bg-blue-500/15 border border-blue-500/20 px-3.5 py-1.5 rounded-md">
                Verified Authority Number: SECURE-GJ-2026
              </span>
            </div>
          </div>

          {/* High-Fidelity FAQs Section (Right 7 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-2xl font-black font-rajdhani text-[var(--foreground)] uppercase tracking-wide text-center lg:text-left mb-6">
              ❓ Frequently Asked Questions
            </h3>
            <FAQAccordion items={HOME_FAQS} />
          </div>

        </div>
      </section>
    </div>
  );
}
