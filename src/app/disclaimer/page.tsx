import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Disclaimer – Get Job Update',
  description: 'Legal disclaimer outlining the educational informational purpose of Get Job Update and our relationships to government departments.',
};

export default function DisclaimerPage() {
  return (
    <div className="w-full bg-[#f8fafc] dark:bg-[#030712] py-16 font-baloo">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs font-bold font-rajdhani uppercase text-slate-400 mb-2 tracking-wide">
          <Link href="/" className="hover:text-amber-500">HOME</Link>
          <span>›</span>
          <span className="text-slate-500">DISCLAIMER</span>
        </nav>

        <div className="bg-white dark:bg-[#0b0f19] border border-[var(--border)] rounded-3xl p-8 md:p-12 shadow-sm space-y-6">
          <h1 className="text-3xl md:text-4xl font-extrabold font-rajdhani text-[var(--foreground)] uppercase border-b border-[var(--border)] pb-4">
            ⚠️ Disclaimer
          </h1>
          
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
            Last updated: May 2026
          </p>

          <h2 className="text-xl md:text-2xl font-bold font-rajdhani text-[var(--foreground)] uppercase pt-4">
            1. No Affiliation with Government
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
            **Get Job Update** (https://getjobupdate.co.in) is an independent, private educational and informational news portal. We are **not affiliated, associated, authorized, endorsed by, or in any way officially connected** with the Government of India, any state government, union territory administration, or any government department, public sector enterprise, or academic institution.
          </p>

          <h2 className="text-xl md:text-2xl font-bold font-rajdhani text-[var(--foreground)] uppercase pt-4">
            2. Purpose of Information
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
            All the information provided on this website is for general informational and educational purposes only. While we make every effort to verify details and keep listings updated in real-time, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the website or the information, products, services, or related graphics contained on the website.
          </p>

          <h2 className="text-xl md:text-2xl font-bold font-rajdhani text-[var(--foreground)] uppercase pt-4">
            3. Candidates Responsibility
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
            Candidates are strongly advised to **always verify and cross-check the details from the official government websites, gazette bulletins, and recruitment portals** before applying or making any decisions. Get Job Update shall not be responsible for any loss, damage, or inconvenience caused by reliance on any information provided on this website.
          </p>
        </div>

      </div>
    </div>
  );
}
