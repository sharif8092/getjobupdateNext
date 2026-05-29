import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Contact Us – Get Job Update',
  description: 'Reach out to the Get Job Update editorial office for news updates, correction requests, and support queries.',
};

export default function ContactPage() {
  return (
    <div className="w-full bg-[#f8fafc] dark:bg-[#030712] py-16 font-baloo">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs font-bold font-rajdhani uppercase text-slate-400 mb-2 tracking-wide">
          <Link href="/" className="hover:text-amber-500">HOME</Link>
          <span>›</span>
          <span className="text-slate-500">CONTACT US</span>
        </nav>

        <div className="bg-white dark:bg-[#0b0f19] border border-[var(--border)] rounded-3xl p-8 md:p-12 shadow-sm space-y-6">
          <h1 className="text-3xl md:text-4xl font-extrabold font-rajdhani text-[var(--foreground)] uppercase border-b border-[var(--border)] pb-4">
            📞 Contact Us
          </h1>
          
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base">
            Have questions regarding recent recruitment circulars? Or want to report a broken URL or typographical error? Our support desk is ready to help you.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 font-rajdhani font-black text-sm uppercase">
            <div className="glass-card rounded-2xl border border-[var(--border)] p-5 space-y-2">
              <span className="text-xl">📩</span>
              <span className="text-xs text-slate-400 block tracking-wider">EDITORIAL OFFICE</span>
              <span className="text-base text-[var(--foreground)] lowercase select-all">editor@getjobupdate.co.in</span>
            </div>
            
            <div className="glass-card rounded-2xl border border-[var(--border)] p-5 space-y-2">
              <span className="text-xl">🤝</span>
              <span className="text-xs text-slate-400 block tracking-wider">PARTNERSHIPS</span>
              <span className="text-base text-[var(--foreground)] lowercase select-all">admin@getjobupdate.co.in</span>
            </div>
          </div>

          <h2 className="text-xl md:text-2xl font-bold font-rajdhani text-[var(--foreground)] uppercase pt-4">
            📍 Corporate Office
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
            Sector 62, Noida, Uttar Pradesh, India - 201301
          </p>

          <p className="text-xs text-slate-400 bg-slate-50 dark:bg-slate-900/10 p-4 rounded-xl border border-[var(--border)]">
            <strong>⚠️ Notice:</strong> We are an independent educational news site. We do not provide physical joining letters or act as a recruitment agency. Please do not share sensitive bank information or pay money to anyone pretending to represent Get Job Update.
          </p>
        </div>

      </div>
    </div>
  );
}
