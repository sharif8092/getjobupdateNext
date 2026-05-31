import React from 'react';
import Link from 'next/link';
import { getTotalPostCount } from '@/lib/wordpress';

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const activeUpdatesCount = await getTotalPostCount();

  return (
    <footer className="w-full bg-slate-900 text-slate-400 border-t border-slate-800 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Column 1: Brand Info & office */}
          <div className="lg:col-span-1 space-y-4">
            
            {/* Logo Text */}
            <div className="flex items-baseline gap-1.5 font-black text-2xl tracking-wide uppercase leading-none mb-2">
              <span className="text-white">GETJOB</span>
              <span className="text-orange-500">UPDATE</span>
            </div>
            
            <p className="text-sm leading-relaxed text-slate-400">
              Get Job Update is India&apos;s leading platform providing 100% verified, ultra-fast notifications for latest government jobs, results, admit cards, and schemes directly from official gazettes.
            </p>
            <div className="pt-4 mt-2 text-xs text-slate-500 border-t border-slate-800/60">
              <strong className="block text-slate-300 mb-1.5 uppercase tracking-widest font-bold">📍 REGIONAL OFFICE</strong>
              Sector 62, Noida, Uttar Pradesh, India - 201301
            </div>
          </div>

          {/* Column 2: Latest Updates */}
          <div>
            <h4 className="text-white font-black text-[14px] tracking-wider uppercase mb-5 border-l-2 border-orange-500 pl-3">
              LATEST UPDATES
            </h4>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <Link href="/jobs" className="hover:text-orange-400 text-slate-400 transition-colors flex items-center gap-2 group">
                  <span className="text-orange-500/50 group-hover:text-orange-500 group-hover:translate-x-1 transition-all">→</span> Latest Govt Jobs
                </Link>
              </li>
              <li>
                <Link href="/results" className="hover:text-orange-400 text-slate-400 transition-colors flex items-center gap-2 group">
                  <span className="text-orange-500/50 group-hover:text-orange-500 group-hover:translate-x-1 transition-all">→</span> Sarkari Result 2026
                </Link>
              </li>
              <li>
                <Link href="/admit-cards" className="hover:text-orange-400 text-slate-400 transition-colors flex items-center gap-2 group">
                  <span className="text-orange-500/50 group-hover:text-orange-500 group-hover:translate-x-1 transition-all">→</span> Exam Admit Cards
                </Link>
              </li>
              <li>
                <Link href="/answer-keys" className="hover:text-orange-400 text-slate-400 transition-colors flex items-center gap-2 group">
                  <span className="text-orange-500/50 group-hover:text-orange-500 group-hover:translate-x-1 transition-all">→</span> Answer Keys
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Exam Resources */}
          <div>
            <h4 className="text-white font-black text-[14px] tracking-wider uppercase mb-5 border-l-2 border-orange-500 pl-3">
              SMART TOOLS
            </h4>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <Link href="/age-calculator" className="hover:text-orange-400 text-slate-400 transition-colors flex items-center gap-2 group">
                  <span className="text-orange-500/50 group-hover:text-orange-500 group-hover:translate-x-1 transition-all">→</span> Age Calculator
                </Link>
              </li>
              <li>
                <Link href="/job-matcher" className="hover:text-orange-400 text-slate-400 transition-colors flex items-center gap-2 group">
                  <span className="text-orange-500/50 group-hover:text-orange-500 group-hover:translate-x-1 transition-all">→</span> AI Job Matcher
                </Link>
              </li>
              <li>
                <Link href="/sarkari-yojana" className="hover:text-orange-400 text-slate-400 transition-colors flex items-center gap-2 group">
                  <span className="text-orange-500/50 group-hover:text-orange-500 group-hover:translate-x-1 transition-all">→</span> Govt Yojana Schemes
                </Link>
              </li>
              <li>
                <Link href="/exams" className="hover:text-orange-400 text-slate-400 transition-colors flex items-center gap-2 group">
                  <span className="text-orange-500/50 group-hover:text-orange-500 group-hover:translate-x-1 transition-all">→</span> Exam Guide
                </Link>
              </li>
              <li>
                <Link href="/syllabus" className="hover:text-orange-400 text-slate-400 transition-colors flex items-center gap-2 group">
                  <span className="text-orange-500/50 group-hover:text-orange-500 group-hover:translate-x-1 transition-all">→</span> Exam Syllabus
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Directory */}
          <div>
            <h4 className="text-white font-black text-[14px] tracking-wider uppercase mb-5 border-l-2 border-orange-500 pl-3">
              DIRECTORY
            </h4>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <Link href="/#state-map-section" className="hover:text-orange-400 text-slate-400 transition-colors flex items-center gap-2 group">
                  <span className="text-orange-500/50 group-hover:text-orange-500 group-hover:translate-x-1 transition-all">→</span> Browse Jobs by State
                </Link>
              </li>
              <li>
                <Link href="/#qualifications-section" className="hover:text-orange-400 text-slate-400 transition-colors flex items-center gap-2 group">
                  <span className="text-orange-500/50 group-hover:text-orange-500 group-hover:translate-x-1 transition-all">→</span> Jobs by Qualification
                </Link>
              </li>
              <li>
                <span className="text-[12px] bg-slate-800 text-slate-300 py-1.5 px-3 rounded-lg border border-slate-700/80 inline-block mt-2 font-bold shadow-sm">
                  Active Updates: {activeUpdatesCount.toLocaleString()}+
                </span>
              </li>
            </ul>
          </div>

          {/* Column 5: Company Pages */}
          <div>
            <h4 className="text-white font-black text-[14px] tracking-wider uppercase mb-5 border-l-2 border-orange-500 pl-3">
              LEGAL & COMPANY
            </h4>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <Link href="/about" className="hover:text-orange-400 text-slate-400 transition-colors flex items-center gap-2 group">
                  <span className="text-orange-500/50 group-hover:text-orange-500 group-hover:translate-x-1 transition-all">→</span> About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-orange-400 text-slate-400 transition-colors flex items-center gap-2 group">
                  <span className="text-orange-500/50 group-hover:text-orange-500 group-hover:translate-x-1 transition-all">→</span> Contact Support
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-orange-400 text-slate-400 transition-colors flex items-center gap-2 group">
                  <span className="text-orange-500/50 group-hover:text-orange-500 group-hover:translate-x-1 transition-all">→</span> Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-orange-400 text-slate-400 transition-colors flex items-center gap-2 group">
                  <span className="text-orange-500/50 group-hover:text-orange-500 group-hover:translate-x-1 transition-all">→</span> Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-orange-400 text-slate-400 transition-colors flex items-center gap-2 group">
                  <span className="text-orange-500/50 group-hover:text-orange-500 group-hover:translate-x-1 transition-all">→</span> Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" className="hover:text-orange-400 text-slate-400 transition-colors flex items-center gap-2 group" target="_blank" prefetch={false}>
                  <span className="text-orange-500/50 group-hover:text-orange-500 group-hover:translate-x-1 transition-all">→</span> XML Sitemap
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 my-8"></div>

        {/* Bottom Bar: Copyright & Verified Badge */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <p className="text-xs text-slate-500 font-medium">
              © {currentYear} Get Job Update. All rights reserved.
            </p>
            {/* Social Media SVG Links */}
            <div className="flex justify-center md:justify-start gap-4 pt-2">
              <a href="#" className="text-slate-500 hover:text-white transition-colors" title="Facebook" aria-label="Visit our Facebook page">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                </svg>
              </a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors" title="X (Twitter)" aria-label="Visit our Twitter page">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors" title="Telegram" aria-label="Join our Telegram channel">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.94-4.22 2.78-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.37.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .24z"/>
                </svg>
              </a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors" title="YouTube" aria-label="Subscribe to our YouTube channel">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Trusted Platform Badge */}
          <div className="flex-shrink-0">
            <div className="flex items-center gap-3 bg-slate-900/50 border border-slate-800 px-4 py-2.5 rounded-2xl shadow-xl hover:border-orange-500/50 transition-colors">
              <div className="w-8 h-8 flex items-center justify-center shrink-0 text-orange-500">
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <div>
                <div className="text-[12px] font-black tracking-wider text-orange-400 leading-none">
                  FAST & RELIABLE
                </div>
                <div className="text-[10px] text-slate-400 font-bold tracking-wide mt-1">
                  LATEST JOB UPDATES 24/7
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
