import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'About Us – Get Job Update',
  description: 'Learn about Get Job Update, our 3-step verification system, editorial rules, and expert mentors delivering Sarkari bulletins.',
};

export default function AboutPage() {
  return (
    <div className="w-full bg-[#f8fafc] dark:bg-[#030712] py-16 font-baloo">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs font-bold font-rajdhani uppercase text-slate-400 mb-2 tracking-wide">
          <Link href="/" className="hover:text-amber-500">HOME</Link>
          <span>›</span>
          <span className="text-slate-500">ABOUT US</span>
        </nav>

        <div className="bg-white dark:bg-[#0b0f19] border border-[var(--border)] rounded-3xl p-8 md:p-12 shadow-sm space-y-6">
          <h1 className="text-3xl md:text-4xl font-extrabold font-rajdhani text-[var(--foreground)] uppercase border-b border-[var(--border)] pb-4">
            ℹ️ About Get Job Update
          </h1>
          
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base">
            Welcome to **Get Job Update**, India&apos;s leading independent platform providing verified notifications for latest government vacancies, board exam results, public sector recruitments, and administrative schemes.
          </p>

          <h2 className="text-xl md:text-2xl font-bold font-rajdhani text-[var(--foreground)] uppercase pt-4">
            🛡️ Our 3-Step Verification System
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
            Unlike standard job aggregators that utilize automatic scrapers, every notification published on Get Job Update is audited manually by our senior editors:
          </p>
          <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-2">
            <li><strong>Official Gazette Audit:</strong> We cross-reference announcements directly with the Gazette of India and state-level bulletins.</li>
            <li><strong>Portal Validation:</strong> Action links (Apply online, Notification PDF download) are validated to ensure they lead to secure, official government domains.</li>
            <li><strong>Meta Data Cross-Check:</strong> Application dates, vacancies, and age criteria are double-checked for correctness against the official notice.</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-bold font-rajdhani text-[var(--foreground)] uppercase pt-4">
            🌟 Our Mission
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
            We aim to empower government job aspirants across all cities and rural villages in India by providing fast, clean, and reliable updates without any deceptive redirect ads. We believe in transparency and accessibility.
          </p>

          <div className="pt-6 border-t border-[var(--border)] text-xs text-slate-500 flex justify-between items-center">
            <span>Official Update Stamp: 2026</span>
            <span className="font-rajdhani font-black text-amber-500">100% GAZETTE APPROVED</span>
          </div>
        </div>

      </div>
    </div>
  );
}
