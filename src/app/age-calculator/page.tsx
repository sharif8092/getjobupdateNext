import React from 'react';
import { Metadata } from 'next';
import AgeCalculator from '@/components/AgeCalculator';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sarkari Age Calculator – Check Your Government Job Eligibility',
  description: 'Use our free smart Sarkari Age Calculator to verify if you meet the age criteria for SSC, UPSC, Railway, and state government jobs based on official cut-off dates and category relaxations.',
  keywords: 'sarkari age calculator, government job age limit, age calculator for ssc, upsc age calculator, age relaxation calculator, obc sc st age limit',
  alternates: {
    canonical: '/age-calculator',
  },
};

export default function AgeCalculatorPage() {
  return (
    <div className="flex-1 w-full flex flex-col bg-slate-50 font-sans">
      <header className="relative bg-[#0b1120] border-b border-slate-800 pt-16 pb-12 sm:pt-24 sm:pb-32 overflow-hidden font-sans shrink-0">
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at 1px 1px,white 1px,transparent 0)`, backgroundSize: '28px 28px' }} />
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container relative mx-auto max-w-7xl px-4 text-center z-10">
          <nav className="flex items-center justify-center gap-1.5 text-xs font-bold font-rajdhani uppercase text-slate-400 mb-6 tracking-wide">
            <Link href="/" className="hover:text-orange-400 transition-colors">HOME</Link>
            <span>›</span>
            <span className="text-slate-500">Age Calculator</span>
          </nav>
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-orange-500/10 border border-orange-500/20 mb-6 shadow-lg">
            <span className="text-[11px] font-black uppercase tracking-widest text-orange-400 font-rajdhani">Platform Tool</span>
          </div>
          <h1 className="text-4xl font-black text-white sm:text-6xl mb-4 tracking-tight font-rajdhani uppercase">
            Sarkari <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">Age Calculator.</span>
          </h1>
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-400 font-medium leading-relaxed">
            Welcome to the most accurate age calculator designed specifically for Indian Government job aspirants. Enter your Date of Birth and Category to instantly check your eligibility with relaxations applied.
          </p>
        </div>
      </header>

      <div className="container mx-auto max-w-7xl px-4 pb-16 sm:pb-24 flex-1 -mt-16 sm:-mt-24 relative z-20">
        {/* The Calculator Tool */}
        <div className="max-w-2xl mx-auto w-full mb-16">
          <AgeCalculator />
        </div>

        {/* SEO Content Block */}
        <article className="prose prose-slate max-w-3xl mx-auto text-sm md:text-base text-slate-600 bg-white p-8 sm:p-10 rounded-[2rem] border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-black text-slate-900 font-rajdhani uppercase tracking-tight mb-4">Why Use Our Government Job Age Calculator?</h2>
          <p className="mb-4">
            When applying for competitive exams like UPSC Civil Services, SSC CGL, RRB NTPC, or State Police, calculating your exact age on a specific "Cut-Off Date" can be confusing. Our tool simplifies this by:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-4 mb-8 marker:text-orange-500">
            <li><strong>Precision:</strong> Calculates exact years, months, and days relative to the official cut-off date provided in the recruitment gazette.</li>
            <li><strong>Automatic Relaxations:</strong> Automatically applies the standard +3 Years for OBC and +5 Years for SC/ST categories according to Govt of India norms.</li>
            <li><strong>Instant Verification:</strong> Tells you instantly if you are eligible to fill the application form or not.</li>
          </ul>

          <h3 className="text-xl font-black text-slate-900 font-rajdhani uppercase tracking-tight mt-8 mb-4">How to calculate your age for Sarkari Exams?</h3>
          <p>
            Simply select your Date of Birth from the calendar and choose your caste category. Click on "Calculate Eligibility" and the system will output your exact age. For specific job notifications, you can compare this result with the age limits (e.g., 18-27 years or 21-32 years) mentioned in the official PDF.
          </p>
        </article>
      </div>
    </div>
  );
}
