import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms & Conditions – Get Job Update',
  description: 'Terms and conditions outlining rules for using the Get Job Update portal.',
};

export default function TermsPage() {
  return (
    <div className="w-full bg-[#f8fafc] dark:bg-[#030712] py-16 font-baloo">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs font-bold font-rajdhani uppercase text-slate-400 mb-2 tracking-wide">
          <Link href="/" className="hover:text-amber-500">HOME</Link>
          <span>›</span>
          <span className="text-slate-500">TERMS & CONDITIONS</span>
        </nav>

        <div className="bg-white dark:bg-[#0b0f19] border border-[var(--border)] rounded-3xl p-8 md:p-12 shadow-sm space-y-6">
          <h1 className="text-3xl md:text-4xl font-extrabold font-rajdhani text-[var(--foreground)] uppercase border-b border-[var(--border)] pb-4">
            📜 Terms & Conditions
          </h1>
          
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
            Last updated: May 2026
          </p>

          <h2 className="text-xl md:text-2xl font-bold font-rajdhani text-[var(--foreground)] uppercase pt-4">
            1. Acceptance of Terms
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
            By visiting and using Get Job Update (https://getjobupdate.co.in), you acknowledge that you have read, understood, and agreed to be bound by these Terms and Conditions and our Disclaimer. If you do not agree, please do not use our services.
          </p>

          <h2 className="text-xl md:text-2xl font-bold font-rajdhani text-[var(--foreground)] uppercase pt-4">
            2. Intellectual Property
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
            Our unique logo branding, codebases, custom SVG India map implementations, and custom-written educational summary blocks are the exclusive intellectual property of Get Job Update. Unauthorized scraping or commercial duplication of our content lists is strictly prohibited.
          </p>

          <h2 className="text-xl md:text-2xl font-bold font-rajdhani text-[var(--foreground)] uppercase pt-4">
            3. Third-Party Links
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
            Our articles contain outbound hyperlinks to government databases, recruitment portals, and PDF attachments. We have no control over the nature, content, security protocols, or availability of those third-party sites. Inclusion of any links does not imply a recommendation or endorsement of the views expressed within them.
          </p>
        </div>

      </div>
    </div>
  );
}
