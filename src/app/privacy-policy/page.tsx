import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy – Get Job Update',
  description: 'Privacy policy describing our practices regarding data collection, cookies, and candidate privacy.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full bg-[#f8fafc] dark:bg-[#030712] py-16 font-baloo">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs font-bold font-rajdhani uppercase text-slate-400 mb-2 tracking-wide">
          <Link href="/" className="hover:text-amber-500">HOME</Link>
          <span>›</span>
          <span className="text-slate-500">PRIVACY POLICY</span>
        </nav>

        <div className="bg-white dark:bg-[#0b0f19] border border-[var(--border)] rounded-3xl p-8 md:p-12 shadow-sm space-y-6">
          <h1 className="text-3xl md:text-4xl font-extrabold font-rajdhani text-[var(--foreground)] uppercase border-b border-[var(--border)] pb-4">
            🔒 Privacy Policy
          </h1>
          
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
            Last updated: May 2026
          </p>

          <h2 className="text-xl md:text-2xl font-bold font-rajdhani text-[var(--foreground)] uppercase pt-4">
            1. Information Collection
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
            We collect minimal non-personally identifiable information like browser type, operating system, and IP address to analyze site-wide traffic and optimize loading performance. We do not require visitors to register or provide phone/email details to browse govt bulletins.
          </p>

          <h2 className="text-xl md:text-2xl font-bold font-rajdhani text-[var(--foreground)] uppercase pt-4">
            2. Cookies & Advertising
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
            We utilize standard cookies to remember preference configurations (like dark mode toggles) and serve premium, non-obtrusive programmatic advertisements via Google AdSense. Third-party advertising networks use cookies to serve personalized advertisements based on visitor search histories.
          </p>

          <h2 className="text-xl md:text-2xl font-bold font-rajdhani text-[var(--foreground)] uppercase pt-4">
            3. Data Security
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
            We are committed to candidate safety. Our platform utilizes advanced SSL/TLS encryption. We do not sell or trade candidate metrics to third-party databases.
          </p>
        </div>

      </div>
    </div>
  );
}
