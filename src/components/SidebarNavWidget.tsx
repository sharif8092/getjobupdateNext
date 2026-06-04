import React from 'react';
import Link from 'next/link';

export default function SidebarNavWidget() {
  const states = [
    { name: 'Uttar Pradesh', slug: 'up' },
    { name: 'Bihar', slug: 'bihar' },
    { name: 'Madhya Pradesh', slug: 'mp' },
    { name: 'Rajasthan', slug: 'rajasthan' },
    { name: 'Haryana', slug: 'haryana' },
    { name: 'Delhi', slug: 'delhi' },
    { name: 'Uttarakhand', slug: 'uttarakhand' },
    { name: 'Jharkhand', slug: 'jharkhand' },
    { name: 'Chhattisgarh', slug: 'chhattisgarh' },
    { name: 'All India', slug: 'india' },
  ];

  const qualifications = [
    { name: '10th Pass Jobs', slug: '10th-pass' },
    { name: '12th Pass Jobs', slug: '12th-pass' },
    { name: 'ITI Pass Jobs', slug: 'iti' },
    { name: 'Diploma Jobs', slug: 'diploma' },
    { name: 'Graduate Jobs', slug: 'graduate' },
    { name: 'Post Graduate', slug: 'post-graduate' },
    { name: 'B.Tech / Engineering', slug: 'btech' },
    { name: 'Medical / Nursing', slug: 'medical' },
  ];

  const categories = [
    { name: 'Latest Govt Jobs', slug: 'jobs' },
    { name: 'Sarkari Results', slug: 'results' },
    { name: 'Admit Cards', slug: 'admit-cards' },
    { name: 'Answer Keys', slug: 'answer-keys' },
    { name: 'Syllabus', slug: 'syllabus' },
    { name: 'Admissions', slug: 'admissions' },
  ];

  return (
    <div className="space-y-6">
      {/* Job Category Widget */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <span className="text-orange-500">🎯</span> Job Categories
          </h3>
        </div>
        <div className="p-2">
          <ul className="space-y-1">
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link href={`/${cat.slug}`} className="flex items-center justify-between px-3 py-2 text-sm text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors group">
                  <span className="font-semibold">{cat.name}</span>
                  <svg className="w-4 h-4 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Jobs by State Widget */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <span className="text-blue-500">🗺️</span> Jobs By State
          </h3>
        </div>
        <div className="p-2">
          <ul className="grid grid-cols-2 gap-1">
            {states.map((state) => (
              <li key={state.slug}>
                <Link href={`/state/${state.slug}`} className="flex items-center px-2 py-2 text-[13px] text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium">
                  <span className="truncate">{state.name}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-2 px-2 pb-2">
            <Link href="/state" className="block w-full text-center py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors uppercase tracking-wider">
              View All States
            </Link>
          </div>
        </div>
      </div>

      {/* Jobs by Qualification Widget */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <span className="text-emerald-500">🎓</span> By Qualification
          </h3>
        </div>
        <div className="p-2">
          <ul className="space-y-1">
            {qualifications.map((qual) => (
              <li key={qual.slug}>
                <Link href={`/qualification/${qual.slug}`} className="flex items-center justify-between px-3 py-2 text-[13px] text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors group">
                  <span className="font-semibold">{qual.name}</span>
                  <svg className="w-3 h-3 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-2 px-2 pb-2">
            <Link href="/qualification" className="block w-full text-center py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors uppercase tracking-wider">
              View All
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
