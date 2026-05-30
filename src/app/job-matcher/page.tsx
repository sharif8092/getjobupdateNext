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
    <div className="w-full bg-[#f8fafc] dark:bg-[#030712] py-10 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs font-bold font-rajdhani uppercase text-slate-400 mb-6 tracking-wide">
          <Link href="/" className="hover:text-blue-500">HOME</Link>
          <span>›</span>
          <span className="text-slate-500">Job Matcher</span>
        </nav>

        {/* SEO Optimized Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Smart <span className="text-blue-600">Job Matcher</span> AI
          </h1>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            Stop scrolling through hundreds of irrelevant notifications. Tell us your academic background, age, and location, and our engine will instantly filter out the perfect Sarkari job opportunities tailored for you.
          </p>
        </div>

        {/* The Matcher Tool */}
        <div className="w-full mb-16">
          <JobMatcher />
        </div>

        {/* SEO Content Block */}
        <article className="prose prose-slate max-w-3xl mx-auto text-sm md:text-base text-slate-600 border-t border-slate-200 pt-10">
          <h2 className="text-2xl font-bold text-slate-900">Find Government Jobs by Your Exact Qualifications</h2>
          <p>
            The government sector in India offers thousands of vacancies every month. From 10th Pass roles in Railways (Group D) to highly technical Engineering roles in PSUs, and Administrative roles via UPSC. The challenge isn't the lack of jobs, but finding the one that perfectly matches your profile.
          </p>
          <p>
            Our <strong>Eligibility Matcher</strong> is a dynamic tool that scans our real-time database of all active bulletins. It analyzes:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-4 mb-8 text-slate-700 font-medium">
            <li><strong>Age Limits:</strong> Automatically applies caste-based relaxations (OBC, SC, ST) to check if you're within the official boundary.</li>
            <li><strong>Education Hierarchy:</strong> Ensures you only see jobs that match your degree (e.g., filtering out Diploma jobs if you only have 12th pass, but showing 10th pass jobs if you have a Graduation degree since you are overqualified).</li>
            <li><strong>Regional Limits:</strong> Filters state-specific vacancies to ensure you only apply where you are eligible, while always including "All India" Central Govt jobs.</li>
          </ul>
        </article>
      </div>
    </div>
  );
}
