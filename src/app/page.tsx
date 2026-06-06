import React from 'react';
import Link from 'next/link';
import {
  getPosts,
  WordPressPost,
  STATES_LIST,
  POST_TYPE_MAP,
  extractPostMeta,
  getDeadlineStatus
} from '@/lib/wordpress';
import InteractiveStateBrowser from '@/components/InteractiveStateBrowser';
import FAQAccordion from '@/components/FAQAccordion';
import PushNotificationCard from '@/components/PushNotificationCard';
import AgeCalculator from '@/components/AgeCalculator';
import JobMatcher from '@/components/JobMatcher';
import LiveSearch from '@/components/LiveSearch';

const HOME_FAQS = [
  { q: 'What is Get Job Update and how does it help candidates?', a: 'Get Job Update is India\'s most trusted portal for the latest <strong>Sarkari Naukri</strong>, <strong>Free Job Alerts</strong>, and government exam updates. We aggregate official notifications, admit cards, and results into one easy-to-use platform.' },
  { q: 'How frequently are job notifications and Exam Results updated?', a: 'We monitor official recruitment boards (SSC, UPSC, RRB, State PSCs) 24/7. Our database is updated in real-time so you never miss an important <strong>Exam Result</strong> or application deadline.' },
  { q: 'Which government exams and commissions do you cover?', a: 'We cover all major central and state commissions including UPSC, SSC, IBPS, Railway Recruitment Boards (RRB), State Police Boards, and educational testing agencies like NTA.' },
  { q: 'Is Get Job Update free to use for candidates?', a: 'Yes, absolutely. We believe that access to crucial employment information and <strong>Free Job Alerts</strong> should be completely open and free for all students and job seekers.' },
  { q: 'How can I get instant alerts for new government job vacancies?', a: 'You can click the "Enable Alerts" button on our homepage for browser push notifications, or join our official Telegram and WhatsApp channels for lightning-fast updates directly to your phone.' }
];

/* ── Feed Card Component ── */
function FeedCard({
  title, typeSlug, posts, accentColor, iconBg, icon, hoverText = 'group-hover:text-orange-600',
}: {
  title: string; typeSlug: string; posts: WordPressPost[];
  accentColor: string; iconBg: string; icon: React.ReactNode; hoverText?: string;
}) {
  return (
    <div style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 350px' }} className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow duration-300">
      {/* Header */}
      <Link prefetch={false} href={`/${typeSlug}`} className="flex items-center justify-between px-5 py-3.5 bg-slate-900 group/header">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0 group-hover/header:scale-110 transition-transform`}>
            {icon}
          </div>
          <h2 className="font-black text-white text-sm tracking-wide">{title}</h2>
        </div>
        <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${accentColor} group-hover/header:translate-x-0.5 transition-transform`}>
          View All
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
        </span>
      </Link>
      {/* List */}
      <div className="flex flex-col flex-1 divide-y divide-slate-50">
        {posts.length > 0 ? posts.slice(0, 5).map(post => {
          const { dept, totalPosts, qual, lastDate } = extractPostMeta(post);
          const isNew = (Date.now() - new Date(post.modified).getTime()) < 3 * 24 * 60 * 60 * 1000;
          return (
            <Link prefetch={false} key={post.id} href={`/${typeSlug}/${post.slug}`} className="group px-4 py-3.5 hover:bg-slate-50/80 transition-colors flex flex-col gap-1.5">
              <div className="flex items-start justify-between gap-2">
                <h3 className={`text-[13px] font-semibold text-slate-800 leading-snug ${hoverText} transition-colors line-clamp-2 flex-1`} dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                {isNew && <span className="text-[9px] font-black text-white bg-rose-500 px-1.5 py-0.5 rounded-md shrink-0 uppercase tracking-wide">New</span>}
              </div>
              {(dept || totalPosts || qual || lastDate) && (
                <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 mt-1.5 text-[10px] font-medium text-slate-500 bg-slate-50/50 group-hover:bg-white p-2.5 rounded-lg border border-slate-100 group-hover:border-slate-200 transition-colors">
                  {dept && <div className="col-span-2 flex items-start gap-1"><span className="text-slate-400 font-bold shrink-0">Dept:</span> <span className="text-slate-700 font-semibold truncate">{dept}</span></div>}
                  {totalPosts && <div className="flex items-center gap-1"><span className="text-slate-400 font-bold shrink-0">Vacancies:</span> <span className="text-slate-700 font-semibold truncate">{totalPosts}</span></div>}
                  {qual && <div className="flex items-center gap-1"><span className="text-slate-400 font-bold shrink-0">Eligibility:</span> <span className="text-slate-700 font-semibold truncate">{qual}</span></div>}
                  {lastDate && (() => {
                    const status = getDeadlineStatus(lastDate);
                    return (
                      <div className={`col-span-2 flex items-center gap-1 mt-0.5 pt-1.5 border-t border-slate-200/50 group-hover:border-slate-200`}>
                        <span className={`${status.text} opacity-70 font-bold shrink-0`}>Deadline:</span> 
                        <span className={`${status.text} font-bold`}>{lastDate}</span>
                      </div>
                    );
                  })()}
                </div>
              )}
            </Link>
          );
        }) : (
          <div className="p-8 text-center text-xs text-slate-400 italic">No active updates found.</div>
        )}
      </div>
    </div>
  );
}

/* ── Section Header ── */
function SectionHeader({ label, title, accent, sub }: { label: string; title: React.ReactNode; accent?: string; sub?: string }) {
  return (
    <div className="text-center mb-12">
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-widest mb-4">
        {label}
      </span>
      <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{title}</h2>
      {sub && <p className="text-slate-500 mt-3 font-medium max-w-2xl mx-auto text-[15px]">{sub}</p>}
    </div>
  );
}

export const revalidate = 300;

export default async function HomePage() {
  let jobs: WordPressPost[] = [];
  let results: WordPressPost[] = [];
  let admits: WordPressPost[] = [];
  let yojanas: WordPressPost[] = [];
  let syllabus: WordPressPost[] = [];
  let exams: WordPressPost[] = [];
  let answerkeys: WordPressPost[] = [];

  try {
    const data = await Promise.all([
      getPosts('aziz_job', 6), getPosts('aziz_result', 6),
      getPosts('aziz_admit', 6), getPosts('aziz_yojana', 6),
      getPosts('aziz_syllabus', 6), getPosts('aziz_exam', 4),
      getPosts('aziz_answerkey', 6)
    ]);
    [jobs, results, admits, yojanas, syllabus, exams, answerkeys] = data;
  } catch (err) { console.error('Failed to fetch posts', err); }

  const latestNotifications = [...jobs, ...results, ...admits, ...yojanas]
    .map(p => ({ ...p, routePrefix: POST_TYPE_MAP[p.type] || 'blog' }))
    .sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime())
    .slice(0, 6);

  const examGuideUpdates = [...exams]
    .map(p => ({ ...p, routePrefix: POST_TYPE_MAP[p.type] || 'blog' }))
    .sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime())
    .slice(0, 5);

  const categories = [
    { href: '/jobs', label: 'NEW OPENINGS', name: 'Sarkari Naukri', iconBg: 'bg-orange-100 text-orange-600', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" /></svg> },
    { href: '/results', label: 'CHECK SCORES', name: 'Exam Result', iconBg: 'bg-emerald-100 text-emerald-600', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" /></svg> },
    { href: '/admit-cards', label: 'HALL TICKETS', name: 'Admit Card', iconBg: 'bg-rose-100 text-rose-600', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" /></svg> },
    { href: '/syllabus', label: 'EXAM GUIDE', name: 'Syllabus', iconBg: 'bg-indigo-100 text-[var(--color-brand-blue)]', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.56 2.25h-3.12a2.25 2.25 0 00-2.104 1.638m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184m-7.332 0h7.332M8.25 8.25h7.5m-7.5 4.5h7.5m-7.5 4.5h7.5" /></svg> },
    { href: '/sarkari-yojana', label: 'SCHEMES', name: 'Sarkari Yojana', iconBg: 'bg-amber-100 text-amber-600', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg> },
    { href: '/exams', label: 'PREPARATION', name: 'Exam Guide', iconBg: 'bg-purple-100 text-purple-600', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg> },
  ];

  const pathways = [
    { t: 'SSC & Railway', d: 'CGL, CHSL, NTPC, Group D. Complete updates on clerical and non-technical roles.', iconBg: 'bg-orange-100 text-orange-600', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6.75h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" /></svg> },
    { t: 'UPSC & Civil Services', d: 'CSE, IES, IFS. Official notifications for India\'s top administrative roles.', iconBg: 'bg-indigo-100 text-[var(--color-brand-blue)]', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" /></svg> },
    { t: 'Banking & Insurance', d: 'SBI PO, IBPS Clerk, LIC, NABARD. High-growth finance and banking careers.', iconBg: 'bg-emerald-100 text-emerald-600', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 8.25H9m6 3H9m3 6l-3-3h1.5a3 3 0 100-6M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { t: 'Defence & Police', d: 'Army, Navy, CAPF, State Police. Serve the nation in frontline roles.', iconBg: 'bg-amber-100 text-amber-600', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg> },
    { t: 'Teaching & Education', d: 'CTET, KVS, NVS, UGC NET. Verified opportunities for educators.', iconBg: 'bg-fuchsia-100 text-fuchsia-600', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" /></svg> },
    { t: 'Medical & Healthcare', d: 'NEET, AIIMS, Nursing Officer. Critical healthcare infrastructure recruitment.', iconBg: 'bg-rose-100 text-rose-600', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg> },
    { t: 'Engineering & Tech', d: 'GATE, PSU, State AE/JE. Core engineering and technical supervisor vacancies.', iconBg: 'bg-cyan-100 text-cyan-600', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.83M11.42 15.17l-.496-.496c-.223-.223-.393-.483-.497-.763l-.427-1.152a2.316 2.316 0 01.378-2.222l1.603-1.996m-4.56-4.56l-1.996 1.603a2.316 2.316 0 00-2.222.378l-1.152.427c-.28.104-.54.274-.763.497l-.496.496m4.56-4.56l.496.496c.223.223.483.393.763.497l1.152.427a2.316 2.316 0 002.222-.378l1.996-1.603" /></svg> },
    { t: 'Law & Judiciary', d: 'Civil Judge, APO, Supreme Court Assistants. Premium legal sector bodies.', iconBg: 'bg-purple-100 text-purple-600', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" /></svg> },
  ];

  const trustPoints = [
    { t: 'Fastest Free Job Alert', d: 'Real-time alerts for official Exam results and upcoming recruitment drives across India.', iconBg: 'bg-orange-100 text-orange-600', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { t: '100% Verified Govt Info', d: 'Every update is cross-verified from official gazettes and government portals for authenticity.', iconBg: 'bg-emerald-100 text-emerald-600', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg> },
    { t: 'Complete Exam Resources', d: 'Syllabus guides, detailed exam patterns, answer keys, and previous papers all in one place.', iconBg: 'bg-indigo-100 text-[var(--color-brand-blue)]', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg> },
    { t: 'Yojana & Welfare Schemes', d: 'Stay updated with central and state welfare programs, sarkari yojana, and scholarship opportunities.', iconBg: 'bg-amber-100 text-amber-600', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg> },
  ];

  return (
    <div className="w-full flex flex-col font-sans bg-slate-50">

      {/* ════════════════════════════════
          1. HERO
      ════════════════════════════════ */}
      <div className="bg-slate-900 w-full pt-16 pb-36 relative overflow-hidden">
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '32px 32px' }} />
        {/* Glow blobs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/8 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-orange-400"></span></span>
            <span className="text-[11px] font-black text-orange-400 uppercase tracking-widest">Live Updates · Verified Daily</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-black text-white mb-5 leading-[1.1] tracking-tight">
            No. 1 <span className="text-orange-500">Exam Result</span> &amp; Free Job Alert Portal
          </h1>
          <p className="text-slate-400 text-sm md:text-base font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
            Get lightning-fast updates for the latest Sarkari Naukri, Govt Jobs, Admit Cards, and Answer Keys across India. Your trusted platform for career success.
          </p>

          {/* Search Bar */}
          <LiveSearch />

          {/* Trending */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            <span className="text-slate-400 text-xs font-semibold">Trending:</span>
            {['SSC CGL', 'UPSC CSE', 'Railway NTPC', 'SBI PO'].map(t => (
              <Link prefetch={false} key={t} href="#" className="bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl px-4 py-1.5 text-xs font-semibold border border-white/10 hover:border-white/20 transition-all">{t}</Link>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════
          2. CATEGORY QUICK LINKS
      ════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-14 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <Link prefetch={false} key={i} href={cat.href} className="bg-white rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-slate-100 flex items-center gap-3 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.1)] transition-all duration-200 group">
              <div className={`w-10 h-10 rounded-xl ${cat.iconBg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                {cat.icon}
              </div>
              <div>
                <p className="text-slate-900 font-bold text-sm leading-tight">{cat.name}</p>
                <p className="text-slate-400 font-black text-[10px] uppercase tracking-wider mt-0.5">{cat.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════
          3. MAIN FEEDS
      ════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 3x2 Feed Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <FeedCard title="Government Job" typeSlug="jobs" posts={jobs} accentColor="text-orange-400"
              iconBg="bg-orange-500" hoverText="group-hover:text-orange-600"
              icon={<svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" /></svg>}
            />
            <FeedCard title="Latest Results" typeSlug="results" posts={results} accentColor="text-emerald-400"
              iconBg="bg-emerald-500" hoverText="group-hover:text-emerald-600"
              icon={<svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12" /></svg>}
            />
            <FeedCard title="Admit Card" typeSlug="admit-cards" posts={admits} accentColor="text-rose-400"
              iconBg="bg-rose-500" hoverText="group-hover:text-rose-600"
              icon={<svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" /></svg>}
            />
            <FeedCard title="Sarkari Yojana" typeSlug="sarkari-yojana" posts={yojanas} accentColor="text-purple-400"
              iconBg="bg-purple-500" hoverText="group-hover:text-purple-600"
              icon={<svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>}
            />
            <FeedCard title="Answer Keys" typeSlug="answer-keys" posts={answerkeys} accentColor="text-cyan-400"
              iconBg="bg-cyan-500" hoverText="group-hover:text-cyan-600"
              icon={<svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg>}
            />
            <FeedCard title="Syllabus" typeSlug="syllabus" posts={syllabus} accentColor="text-[var(--color-brand-blue)]"
              iconBg="bg-indigo-500" hoverText="group-hover:text-indigo-600"
              icon={<svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>}
            />
            </div>

            {/* Smart Age Calculator Tool to balance left column space */}
            <div className="mt-8">
              <AgeCalculator />
            </div>

          </div>

          {/* Right column */}
          <div className="lg:col-span-4 space-y-6">

            {/* Latest Notifications */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>
                  </div>
                  <h3 className="font-black text-white text-sm">Latest Notifications</h3>
                </div>
                <Link prefetch={false} href="/jobs" className="text-[10px] font-black text-orange-400 uppercase tracking-widest flex items-center gap-1 hover:text-orange-300 transition-colors">
                  All <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                </Link>
              </div>
              <div className="p-4 space-y-1">
                {latestNotifications.length > 0 ? latestNotifications.map((post, idx) => {
                  const { dept, totalPosts, qual, lastDate } = extractPostMeta(post);
                  return (
                    <Link prefetch={false} key={post.id} href={`/${post.routePrefix}/${post.slug}`} className="flex gap-3 items-start group hover:bg-slate-50 px-3 py-3 -mx-1 rounded-xl transition-colors">
                      <span className="text-lg font-black text-slate-100 group-hover:text-orange-200 transition-colors leading-none w-6 shrink-0 text-center">{idx + 1}</span>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-[13px] font-semibold text-slate-700 leading-snug group-hover:text-orange-600 transition-colors line-clamp-2" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                        {(dept || totalPosts || qual || lastDate) && (
                          <div className="mt-2 text-[9px] font-medium text-slate-500 bg-white group-hover:bg-slate-50 p-2 rounded border border-slate-100 transition-colors space-y-1">
                            {dept && <div className="flex gap-1"><span className="text-slate-400 font-bold shrink-0">Dept:</span> <span className="text-slate-700 truncate">{dept}</span></div>}
                            {totalPosts && <div className="flex gap-1"><span className="text-slate-400 font-bold shrink-0">Vacancies:</span> <span className="text-slate-700 truncate">{totalPosts}</span></div>}
                            {qual && <div className="flex gap-1"><span className="text-slate-400 font-bold shrink-0">Eligibility:</span> <span className="text-slate-700 truncate">{qual}</span></div>}
                            {lastDate && (() => {
                              const status = getDeadlineStatus(lastDate);
                              return (
                                <div className="flex gap-1 pt-1 mt-1 border-t border-slate-100">
                                  <span className={`${status.text} opacity-80 font-bold shrink-0`}>Deadline:</span> 
                                  <span className={`${status.text} font-bold`}>{lastDate}</span>
                                </div>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                }) : <div className="text-xs text-slate-400 italic text-center py-4">No recent updates.</div>}
              </div>
            </div>

            {/* Exam Guide */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                  </div>
                  <h3 className="font-black text-white text-sm">Exam Guide</h3>
                </div>
                <Link prefetch={false} href="/exams" className="text-[10px] font-black text-orange-400 uppercase tracking-widest flex items-center gap-1 hover:text-orange-300 transition-colors">
                  All <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                </Link>
              </div>
              <div className="p-4 space-y-1">
                {examGuideUpdates.length > 0 ? examGuideUpdates.map((post, idx) => {
                  const { dept, totalPosts, qual, lastDate } = extractPostMeta(post);
                  return (
                  <Link prefetch={false} key={post.id} href={`/${post.routePrefix}/${post.slug}`} className="flex gap-3 items-start group hover:bg-orange-50/80 px-3 py-3 -mx-1 rounded-xl transition-colors">
                    <span className="text-lg font-black text-slate-100 group-hover:text-orange-200 transition-colors leading-none w-6 shrink-0 text-center">{idx + 1}</span>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-[13px] font-semibold text-slate-700 leading-snug group-hover:text-orange-600 transition-colors line-clamp-2" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                      <div className="flex gap-2 items-center mt-1.5 mb-1.5">
                        <span className="text-[9px] font-black text-orange-700 bg-orange-100 px-1.5 py-0.5 rounded-md uppercase tracking-wider inline-block">Exam Guide</span>
                      </div>
                      {(dept || totalPosts || qual || lastDate) && (
                        <div className="text-[9px] font-medium text-slate-500 bg-white group-hover:bg-orange-50/50 p-2 rounded border border-slate-100 transition-colors space-y-1">
                            {dept && <div className="flex gap-1"><span className="text-slate-400 font-bold shrink-0">Dept:</span> <span className="text-slate-700 truncate">{dept}</span></div>}
                            {totalPosts && <div className="flex gap-1"><span className="text-slate-400 font-bold shrink-0">Vacancies:</span> <span className="text-slate-700 truncate">{totalPosts}</span></div>}
                            {qual && <div className="flex gap-1"><span className="text-slate-400 font-bold shrink-0">Eligibility:</span> <span className="text-slate-700 truncate">{qual}</span></div>}
                            {lastDate && (() => {
                              const status = getDeadlineStatus(lastDate);
                              return (
                                <div className="flex gap-1 pt-1 mt-1 border-t border-slate-100">
                                  <span className={`${status.text} opacity-80 font-bold shrink-0`}>Deadline:</span> 
                                  <span className={`${status.text} font-bold`}>{lastDate}</span>
                                </div>
                              );
                            })()}
                        </div>
                      )}
                    </div>
                  </Link>
                )}) : <div className="text-xs text-slate-400 italic text-center py-4">No recent updates.</div>}
              </div>
            </div>

            {/* Join Community */}
            <div className="bg-slate-900 rounded-2xl overflow-hidden relative">
              <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '20px 20px' }} />
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-orange-500/15 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10 p-5 space-y-4">
                <div>
                  <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Stay Connected</p>
                  <h3 className="font-black text-white text-base">Join Our Community</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">Get lightning-fast alerts on your favorite platforms.</p>
                </div>
                <div className="space-y-2.5">
                  <a href="https://t.me/getjobupdatefree" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-4 py-3 bg-[#0088cc] hover:bg-[#0077b5] text-white rounded-xl text-xs font-bold transition-all hover:-translate-y-0.5 group">
                    <span className="flex items-center gap-2"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.94-4.22 2.78-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.37.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .24z"/></svg>Telegram Channel</span>
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                  </a>
                  <a href="https://whatsapp.com/channel/0029VbCi7hW9RZAO5fRVKO0W" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all hover:-translate-y-0.5 group">
                    <span className="flex items-center gap-2"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>WhatsApp Channel</span>
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                  </a>
                </div>
              </div>
            </div>

            <PushNotificationCard />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          4. CAREER PATHWAY DIRECTORY
      ════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader label="Career Pathway Directory" title={<>Sarkari <span className="text-orange-600">Resource</span> Center</>} sub="Your central hub for navigating India's vast recruitment landscape. We hand-categorize official notifications into definitive, high-growth career pathways." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pathways.map((p, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-200 group cursor-pointer relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-400/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <div className={`w-11 h-11 rounded-xl ${p.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 flex-shrink-0`}>{p.icon}</div>
                <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">{p.t}</h3>
                <p className="text-sm text-slate-500 leading-relaxed flex-1">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          5. STATE BROWSER
      ════════════════════════════════ */}
      <section id="state-map-section" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InteractiveStateBrowser />
        </div>
      </section>

      {/* ════════════════════════════════
          6. WHY CHOOSE US
      ════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-widest">
                Why Get Job Update?
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Empowering Candidates with <span className="text-orange-600">Verified Sarkari Naukri &amp; Govt Job Updates.</span>
              </h2>
              <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                Welcome to Get Job Update, India&apos;s most trusted digital platform dedicated to bringing you the fastest, most verified updates regarding <strong className="text-slate-700">Sarkari Naukri</strong>, <strong className="text-slate-700">Free Job Alerts</strong>, and government employment opportunities. Whether you are actively preparing for a competitive exam or tracking multiple recruitment phases like <strong className="text-slate-700">Exam Result</strong> and Admit Cards, our platform simplifies the complex ecosystem.
              </p>
              <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                We manually verify and aggregate data from official gazettes and top commissions such as UPSC, SSC, and RRB. By eliminating clutter and providing high-fidelity information, candidates save valuable time which they can instead channel into their preparation strategies.
              </p>
            </div>
            <div className="space-y-4">
              {trustPoints.map((ft, i) => (
                <div key={i} className="flex gap-4 p-5 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] bg-white hover:border-orange-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 transition-all duration-200 group">
                  <div className={`w-11 h-11 shrink-0 rounded-xl ${ft.iconBg} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>{ft.icon}</div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-orange-600 transition-colors">{ft.t}</h3>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">{ft.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          7. TOOLS — JOB MATCHER + FAQ + AGE CALC
      ════════════════════════════════ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader label="Smart Tools" title={<>Candidate <span className="text-orange-600">Utility Tools</span></>} sub="Use our free smart tools to calculate your exact age for form submissions and find matching jobs instantly." />
          <div className="mb-16"><JobMatcher /></div>

          <div className="max-w-4xl mx-auto pt-10">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                Frequently Asked <span className="text-orange-600">Questions</span>
              </h2>
            </div>
            <div className="w-full">
              <FAQAccordion items={HOME_FAQS} />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
