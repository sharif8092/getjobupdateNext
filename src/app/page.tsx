import React from 'react';
import Link from 'next/link';
import { 
  getPosts, 
  WordPressPost, 
  STATES_LIST, 
  POST_TYPE_MAP 
} from '@/lib/wordpress';
import IndiaMap from '@/components/IndiaMap';
import FAQAccordion from '@/components/FAQAccordion';
import PushNotificationCard from '@/components/PushNotificationCard';

const HOME_FAQS = [
  {
    q: 'What is Get Job Update and how does it help candidates?',
    a: 'Get Job Update is a leading portal that aggregates verified government employment opportunities across India. We save you time by organizing chaotic official notifications, admit cards, and results into a single, clean dashboard.'
  },
  {
    q: 'How frequently are job notifications updated?',
    a: 'We monitor servers of recruitment boards like SSC, RRB, UPSC, State PSCs around the clock. Our database is updated in real-time as soon as an official gazette or link is live.'
  },
  {
    q: 'Which government exams and commissions do you cover?',
    a: 'We cover all major central and state commissions including UPSC, SSC, IBPS, RRB, State Police Boards, and educational testing agencies like NTA.'
  },
  {
    q: 'Is Get Job Update free to use?',
    a: 'Absolutely. We believe that access to employment information should be open and free for all candidates preparing for their future.'
  }
];

// Helper to render feed boxes
function FeedBox({ title, typeSlug, posts, colorClass, linkColorClass }: { title: string, typeSlug: string, posts: WordPressPost[], colorClass: string, linkColorClass: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden flex flex-col h-full">
      {/* Box Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-1 rounded-full ${colorClass}`}></div>
          <h3 className="font-bold text-slate-800 tracking-wide text-sm md:text-base">{title}</h3>
        </div>
        <Link href={`/${typeSlug}`} className={`text-[10px] font-bold uppercase tracking-widest hover:underline ${linkColorClass}`}>
          VIEW ALL →
        </Link>
      </div>
      
      {/* Box Content List */}
      <div className="flex flex-col divide-y divide-slate-50 flex-1">
        {posts.length > 0 ? (
          posts.slice(0, 5).map(post => {
            const loc = post.custom_meta?.aziz_job_location || 'Central';
            const dept = post.custom_meta?.aziz_department || 'Govt';
            const isNew = (Date.now() - new Date(post.date).getTime()) < 3 * 24 * 60 * 60 * 1000; // 3 days
            
            return (
              <Link 
                key={post.id} 
                href={`/${typeSlug}/${post.slug}`}
                className="group p-4 hover:bg-slate-50 transition-colors flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 
                    className="text-sm font-semibold text-slate-700 leading-snug group-hover:text-[var(--color-brand-primary)] transition-colors line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                  />
                  {isNew && (
                    <span className="text-[9px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200 shrink-0">NEW</span>
                  )}
                </div>
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  <span>{loc}</span>
                  <span className="text-right truncate max-w-[50%]">{dept}</span>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="p-8 text-center text-xs text-slate-400 font-medium italic">
            No active updates found.
          </div>
        )}
      </div>
    </div>
  );
}

export const revalidate = 300; 

export default async function HomePage() {
  let jobs: WordPressPost[] = [];
  let results: WordPressPost[] = [];
  let admits: WordPressPost[] = [];
  let yojanas: WordPressPost[] = [];

  try {
    const data = await Promise.all([
      getPosts('aziz_job', 6),
      getPosts('aziz_result', 6),
      getPosts('aziz_admit', 6),
      getPosts('aziz_yojana', 6)
    ]);
    jobs = data[0];
    results = data[1];
    admits = data[2];
    yojanas = data[3];
  } catch (err) {
    console.error('Failed to fetch posts', err);
  }

  return (
    <div className="w-full flex flex-col font-sans bg-[var(--background)]">
      
      {/* 1. HERO SECTION (Search & Trending) */}
      <div className="bg-[#0b1120] w-full pt-16 pb-32 relative">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-white mb-5 leading-[1.1] tracking-tight">
            Find Your Dream <span className="text-[var(--color-brand-accent)]">Sarkari Job</span>
          </h1>
          <p className="text-blue-100 text-sm md:text-base font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
            Direct access to latest government notifications, results, and welfare schemes across India.
          </p>
          
          {/* Search Bar Container */}
          <div className="bg-white rounded-2xl md:rounded-full p-2 flex flex-col md:flex-row items-center shadow-2xl mx-auto max-w-3xl gap-2 md:gap-0">
            <div className="w-full md:flex-1 flex items-center px-4 py-1 md:border-r border-slate-200">
              <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="text" placeholder="Search job title or organization..." className="w-full px-3 py-2.5 outline-none text-slate-800 bg-transparent text-sm font-medium placeholder:text-slate-400" />
            </div>
            <div className="hidden sm:flex items-center px-4 w-44 border-r border-slate-200 cursor-pointer">
              <svg className="w-4 h-4 text-slate-400 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <select className="bg-transparent text-slate-700 outline-none w-full text-sm font-bold cursor-pointer appearance-none">
                <option>All States</option>
              </select>
              <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
            <button className="w-full md:w-auto bg-blue-700 hover:bg-blue-800 text-white rounded-xl md:rounded-full px-7 py-3 font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-md">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              Search Jobs
            </button>
          </div>
          
          {/* Trending Links */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm">
            <span className="text-white/80 font-medium">Trending:</span>
            <Link href="#" className="bg-white/10 hover:bg-white/20 text-white rounded-full px-5 py-1.5 text-xs font-semibold border border-white/20 transition-colors">SSC CGL</Link>
            <Link href="#" className="bg-white/10 hover:bg-white/20 text-white rounded-full px-5 py-1.5 text-xs font-semibold border border-white/20 transition-colors">UPSC CSE</Link>
            <Link href="#" className="bg-white/10 hover:bg-white/20 text-white rounded-full px-5 py-1.5 text-xs font-semibold border border-white/20 transition-colors">Railway NTPC</Link>
          </div>
        </div>
      </div>

      {/* 2. CATEGORY QUICK LINKS (Overlapping Grid) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-16 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          
          <Link href="/jobs" className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-5 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] border border-slate-100 flex items-center gap-2 md:gap-3 hover:-translate-y-1 transition-transform group">
            <div className="text-3xl md:text-4xl drop-shadow-sm group-hover:scale-110 transition-transform">🏛️</div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-slate-900 font-bold text-xs md:text-sm leading-tight truncate">Sarkari<br/>Naukri</span>
              <span className="text-slate-400 font-black text-[9px] md:text-[10px] uppercase mt-1 tracking-wider truncate">NEW OPENINGS</span>
            </div>
          </Link>
          
          <Link href="/results" className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-5 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] border border-slate-100 flex items-center gap-2 md:gap-3 hover:-translate-y-1 transition-transform group">
            <div className="text-3xl md:text-4xl text-amber-500 drop-shadow-sm group-hover:scale-110 transition-transform">🏆</div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-slate-900 font-bold text-xs md:text-sm leading-tight truncate">Results<br/>2026</span>
              <span className="text-slate-400 font-black text-[9px] md:text-[10px] uppercase mt-1 tracking-wider truncate">CHECK SCORES</span>
            </div>
          </Link>
          
          <Link href="/admit-card" className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-5 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] border border-slate-100 flex items-center gap-2 md:gap-3 hover:-translate-y-1 transition-transform group">
            <div className="text-3xl md:text-4xl text-slate-300 drop-shadow-sm group-hover:scale-110 transition-transform">📄</div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-slate-900 font-bold text-xs md:text-sm leading-tight truncate">Admit<br/>Card</span>
              <span className="text-slate-400 font-black text-[9px] md:text-[10px] uppercase mt-1 tracking-wider truncate">HALL TICKETS</span>
            </div>
          </Link>
          
          <Link href="/syllabus" className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-5 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] border border-slate-100 flex items-center gap-2 md:gap-3 hover:-translate-y-1 transition-transform group">
            <div className="text-3xl md:text-4xl drop-shadow-sm group-hover:scale-110 transition-transform">📝</div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-slate-900 font-bold text-xs md:text-sm leading-tight truncate">Syllabus &<br/>Pattern</span>
              <span className="text-slate-400 font-black text-[9px] md:text-[10px] uppercase mt-1 tracking-wider truncate">EXAM GUIDE</span>
            </div>
          </Link>
          
          <Link href="/yojana" className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-5 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] border border-slate-100 flex items-center gap-2 md:gap-3 hover:-translate-y-1 transition-transform group">
            <div className="text-3xl md:text-4xl text-red-500 drop-shadow-sm group-hover:scale-110 transition-transform">📢</div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-slate-900 font-bold text-xs md:text-sm leading-tight truncate">Sarkari<br/>Yojana</span>
              <span className="text-slate-400 font-black text-[9px] md:text-[10px] uppercase mt-1 tracking-wider truncate">SCHEMES</span>
            </div>
          </Link>
          
          <Link href="/exam-guide" className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-5 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] border border-slate-100 flex items-center gap-2 md:gap-3 hover:-translate-y-1 transition-transform group">
            <div className="text-3xl md:text-4xl drop-shadow-sm group-hover:scale-110 transition-transform">📚</div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-slate-900 font-bold text-xs md:text-sm leading-tight truncate">Exam<br/>Guide</span>
              <span className="text-slate-400 font-black text-[9px] md:text-[10px] uppercase mt-1 tracking-wider truncate">PREPARATION</span>
            </div>
          </Link>

        </div>
      </div>

      {/* 3. CORE SARKARI FEEDS (Multi-Column Layout) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Latest Jobs Box */}
          <FeedBox 
            title="Latest Sarkari Job" 
            typeSlug="jobs" 
            posts={jobs} 
            colorClass="bg-blue-600" 
            linkColorClass="text-blue-600"
          />

          {/* Results Box */}
          <FeedBox 
            title="Latest Result" 
            typeSlug="results" 
            posts={results} 
            colorClass="bg-emerald-500" 
            linkColorClass="text-emerald-600"
          />

          {/* Right Column Stack */}
          <div className="space-y-6 flex flex-col">
            {/* Notifications / Updates Style Box */}
            <div className="bg-white rounded-2xl shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-1 rounded-full bg-blue-500"></div>
                  <h3 className="font-bold text-slate-800 tracking-wide text-sm md:text-base">Notification</h3>
                </div>
                <Link href="/jobs" className="text-[10px] font-bold uppercase tracking-widest hover:underline text-blue-600">ALL UPDATES →</Link>
              </div>
              <div className="p-4 space-y-4">
                {[1, 2, 3, 4].map((num) => (
                  <div key={num} className="flex gap-4 items-start group">
                    <span className="text-2xl font-black text-slate-100 group-hover:text-blue-100 transition-colors leading-none">{num}</span>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-700 leading-snug group-hover:text-[var(--color-brand-primary)]">
                        {num === 1 ? 'NEET UG 2026 Live: NTA Exam Ends, Result Key News' : `Notification Update ${num}: Direct Link Active`}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium uppercase mt-1 truncate max-w-[200px]">NTA EXAM BOARD</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Box */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-center">
              <h3 className="font-bold text-slate-800 text-lg mb-2">Join Community</h3>
              <p className="text-sm text-slate-500 mb-6">Get lightning-fast alerts on your favorite platforms.</p>
              <div className="space-y-3">
                <a href="#" className="flex items-center justify-between px-5 py-3.5 bg-[#0088cc] hover:bg-[#0077b3] text-white rounded-xl text-sm font-bold transition-colors shadow-sm">
                  <span className="flex items-center gap-2"><span className="text-lg">✈️</span> Telegram Channel</span>
                  <span>↗</span>
                </a>
                <a href="#" className="flex items-center justify-between px-5 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold transition-colors shadow-sm">
                  <span className="flex items-center gap-2"><span className="text-lg">💬</span> WhatsApp Channel</span>
                  <span>↗</span>
                </a>
              </div>
            </div>

            {/* Push Notification Card */}
            <PushNotificationCard />
          </div>

          {/* Row 2: Admit Card & Syllabus */}
          <FeedBox 
            title="Admit Card" 
            typeSlug="admit-cards" 
            posts={admits} 
            colorClass="bg-rose-500" 
            linkColorClass="text-rose-600"
          />

          <FeedBox 
            title="Sarkari Yojana" 
            typeSlug="sarkari-yojana" 
            posts={yojanas} 
            colorClass="bg-purple-500" 
            linkColorClass="text-purple-600"
          />
          
        </div>
      </section>

      {/* 4. CAREER PATHWAY DIRECTORY (Resource Center Grid) */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-widest mb-4">
              👨‍🎓 Career Pathway Directory
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Sarkari <span className="text-[var(--color-brand-primary)]">Resource</span> Center
            </h2>
            <p className="text-slate-500 mt-3 font-medium max-w-2xl mx-auto">
              Your central hub for navigating India&apos;s vast recruitment landscape. We hand-categorize official notifications into definitive, high-growth career pathways.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { t: 'SSC & Railway', d: 'CGL, CHSL, NTPC, Group D. Complete updates on clerical and non-technical roles.', i: '🚂' },
              { t: 'UPSC & Civil Services', d: 'CSE, IES, IFS. Official notifications for India\'s top administrative roles.', i: '🏛️' },
              { t: 'Banking & Insurance', d: 'SBI PO, IBPS Clerk, LIC, NABARD. High-growth finance and banking careers.', i: '🏦' },
              { t: 'Defence & Police', d: 'Army, Navy, CAPF, State Police. Serve the nation in frontline roles.', i: '🛡️' },
              { t: 'Teaching & Education', d: 'CTET, KVS, NVS, UGC NET. Verified opportunities for educators.', i: '📖' },
              { t: 'Medical & Healthcare', d: 'NEET, AIIMS, Nursing Officer. Critical healthcare infrastructure recruitment.', i: '❤️' },
              { t: 'Engineering & Tech', d: 'GATE, PSU, State AE/JE. Core engineering and technical supervisor vacancies.', i: '🏗️' },
              { t: 'Law & Judiciary', d: 'Civil Judge, APO, Supreme Court Assistants. Premium legal sector bodies.', i: '⚖️' }
            ].map((cat, idx) => (
              <div key={idx} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all group cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  {cat.i}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{cat.t}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{cat.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. BROWSE BY STATE (Clean Split Layout) */}
      <section id="state-map-section" className="w-full py-20 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            {/* Left Column: Text and Pills */}
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-4xl md:text-[56px] font-black text-slate-900 tracking-tight leading-[1.1]">
                Browse by <span className="text-[#1d4ed8]">State</span>
              </h2>
              <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-md font-medium">
                Find specific government opportunities within your home state or preferred region across India.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-6">
                <Link href="/state/central" className="flex items-center gap-3 bg-white border border-slate-200 rounded-full py-2.5 px-5 hover:border-blue-400 hover:shadow-md transition-all shadow-sm">
                  <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-[11px] font-black tracking-wider">IN</span>
                  <span className="text-[15px] font-bold text-slate-800">Central Government</span>
                </Link>
                {STATES_LIST.slice(0, 7).map((state) => (
                  <Link key={state.slug} href={`/state/${state.slug}`} className="flex items-center gap-3 bg-white border border-slate-200 rounded-full py-2.5 px-5 hover:border-blue-400 hover:shadow-md transition-all shadow-sm">
                    <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-[11px] font-black tracking-wider">{state.name.substring(0,2).toUpperCase()}</span>
                    <span className="text-[15px] font-bold text-slate-800">{state.name}</span>
                  </Link>
                ))}
                <Link href="/states" className="flex items-center gap-2 bg-[#eff6ff] border border-blue-100 rounded-full py-3 px-6 hover:bg-blue-100 transition-all shadow-sm">
                  <span className="text-[15px] font-bold text-blue-700">View All States <span className="ml-1 text-lg leading-none">→</span></span>
                </Link>
              </div>
            </div>

            {/* Right Column: Map */}
            <div className="lg:col-span-7 relative flex items-center justify-center min-h-[500px]">
                 <IndiaMap />
            </div>

          </div>
        </div>
      </section>

      {/* 6. TRUST & ABOUT SECTION (Why Choose Us) */}
      <section className="bg-white py-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-6">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Empowering Candidates with <span className="text-[var(--color-brand-primary)]">Verified Information.</span>
              </h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                Welcome to Get Job Update, India&apos;s most trusted digital platform dedicated to bringing you the fastest, most verified updates regarding government employment opportunities. Whether you are actively preparing for a competitive examination or tracking multiple recruitment phases, our platform simplifies the complex ecosystem.
              </p>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                We manually verify and aggregate data from official gazettes and top commissions such as UPSC, SSC, and RRB. By eliminating clutter and providing high-fidelity information, candidates save valuable time which they can instead channel into their preparation strategies.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { t: 'Fastest Notification', d: 'Real-time alerts for official results and upcoming recruitment drives across India.', i: '⏱️' },
                { t: '100% Verified Info', d: 'Every update is cross-verified from official gazettes and government portals.', i: '🛡️' },
                { t: 'Complete Resources', d: 'Syllabus guides, detailed patterns, and previous papers all in one place.', i: '📚' },
                { t: 'Welfare Schemes', d: 'Stay updated with central and state welfare programs and scholarship opportunities.', i: '🌟' }
              ].map((ft, idx) => (
                <div key={idx} className="flex gap-4 p-5 rounded-2xl border border-slate-200 bg-white shadow-sm hover:border-blue-300 transition-colors">
                  <div className="w-12 h-12 shrink-0 rounded-full bg-blue-50 flex items-center justify-center text-xl">
                    {ft.i}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{ft.t}</h4>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">{ft.d}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 7. FAQs */}
      <section className="bg-[#f8fafc] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Frequently Asked <span className="text-[var(--color-brand-primary)]">Questions</span>
            </h2>
          </div>
          <div className="bg-white rounded-3xl p-2 sm:p-6 border border-slate-200 shadow-sm">
             <FAQAccordion items={HOME_FAQS} />
          </div>
        </div>
      </section>

    </div>
  );
}
