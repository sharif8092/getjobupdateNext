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
    <div className="w-full bg-[#f8fafc] dark:bg-[#030712] py-10 min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs font-bold font-rajdhani uppercase text-slate-400 mb-6 tracking-wide">
          <Link href="/" className="hover:text-blue-500">HOME</Link>
          <span>›</span>
          <span className="text-slate-500">Age Calculator</span>
        </nav>

        {/* SEO Optimized Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Sarkari <span className="text-blue-600">Age Calculator</span>
          </h1>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            Welcome to the most accurate age calculator designed specifically for Indian Government job aspirants. Enter your Date of Birth and Category to instantly check your eligibility with relaxations applied.
          </p>
        </div>

        {/* The Calculator Tool */}
        <div className="max-w-md mx-auto w-full mb-16">
          <AgeCalculator />
        </div>

        {/* SEO Content Block */}
        <article className="prose prose-slate max-w-none text-sm md:text-base text-slate-600">
          <h2 className="text-2xl font-bold text-slate-900">Why Use Our Government Job Age Calculator?</h2>
          <p>
            When applying for competitive exams like UPSC Civil Services, SSC CGL, RRB NTPC, or State Police, calculating your exact age on a specific "Cut-Off Date" can be confusing. Our tool simplifies this by:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-4 mb-8">
            <li><strong>Precision:</strong> Calculates exact years, months, and days relative to the official cut-off date provided in the recruitment gazette.</li>
            <li><strong>Automatic Relaxations:</strong> Automatically applies the standard +3 Years for OBC and +5 Years for SC/ST categories according to Govt of India norms.</li>
            <li><strong>Instant Verification:</strong> Tells you instantly if you are eligible to fill the application form or not.</li>
          </ul>

          <h3 className="text-xl font-bold text-slate-900">How to calculate your age for Sarkari Exams?</h3>
          <p>
            Simply select your Date of Birth from the calendar and choose your caste category. Click on "Calculate Eligibility" and the system will output your exact age. For specific job notifications, you can compare this result with the age limits (e.g., 18-27 years or 21-32 years) mentioned in the official PDF.
          </p>
        </article>
      </div>
    </div>
  );
}
