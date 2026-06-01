import React from 'react';
import { Metadata } from 'next';
import JobMatcher from '@/components/JobMatcher';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Government Job Eligibility Matcher – Find Jobs by Qualification',
  description: 'Enter your qualification, age, and state to instantly discover perfectly matching government jobs and recruitment bulletins currently active across India.',
  keywords: 'job matcher, government job eligibility checker, find govt jobs by qualification, 10th pass jobs, graduate jobs search',
  alternates: {
    canonical: '/job-matcher',
  },
};

export default function JobMatcherPage() {
  return (
    <div className="w-full bg-slate-50 min-h-screen flex flex-col font-sans">
      
      {/* Brand Hero Section */}
      <div className="bg-slate-900 w-full pt-12 pb-32 relative overflow-hidden">
        {/* Decorative Grid */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Breadcrumbs */}
          <nav className="flex items-center justify-center gap-1.5 text-[11px] font-black uppercase text-slate-400 mb-6 tracking-widest font-rajdhani">
            <Link href="/" className="hover:text-orange-500 transition-colors">HOME</Link>
            <span>›</span>
            <span className="text-white">Smart Job Matcher</span>
          </nav>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-5 uppercase font-rajdhani leading-none">
            AI <span className="text-orange-500">Job Matcher</span>
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-medium">
            Stop scrolling through hundreds of irrelevant notifications. Tell us your academic background, age, and location, and our engine will instantly filter out the perfect Sarkari job opportunities tailored for you.
          </p>
        </div>
      </div>

      {/* The Matcher Tool (Overlapping Hero) */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full -mt-20 relative z-20 mb-16">
        <JobMatcher />
      </div>

      {/* SEO Content Block */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full mb-20">
        <article className="prose prose-slate max-w-3xl mx-auto text-sm md:text-base text-slate-600 bg-white p-8 md:p-12 rounded-[2rem] border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-black text-slate-900 uppercase font-rajdhani mb-4">Find Government Jobs by Your Exact Qualifications</h2>
          <p>
            The government sector in India offers thousands of vacancies every month. From 10th Pass roles in Railways (Group D) to highly technical Engineering roles in PSUs, and Administrative roles via UPSC. The challenge isn't the lack of jobs, but finding the one that perfectly matches your profile.
          </p>
          <p>
            Our <strong>Eligibility Matcher</strong> is a dynamic tool that scans our real-time database of all active bulletins. It analyzes:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-4 mb-8 text-slate-700 font-medium marker:text-blue-500">
            <li><strong>Age Limits:</strong> Automatically applies caste-based relaxations (OBC, SC, ST) to check if you're within the official boundary.</li>
            <li><strong>Education Hierarchy:</strong> Ensures you only see jobs that match your degree (e.g., filtering out Diploma jobs if you only have 12th pass, but showing 10th pass jobs if you have a Graduation degree since you are overqualified).</li>
            <li><strong>Regional Limits:</strong> Filters state-specific vacancies to ensure you only apply where you are eligible, while always including "All India" Central Govt jobs.</li>
          </ul>
        </article>
      </div>
    </div>
  );
}
