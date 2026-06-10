import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { QUALIFICATIONS_LIST } from '@/lib/wordpress';
import { GraduationCap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Browse Government Jobs by Qualification | Get Job Update',
  description: 'Find government jobs and recruitment based on your educational qualification (10th, 12th, ITI, Diploma, Graduate).',
};

export default function QualificationDirectoryPage() {
  return (
    <div className="w-full bg-slate-50 min-h-screen flex flex-col font-sans">
      
      {/* Brand Hero Section */}
      <div className="bg-slate-900 w-full pt-12 pb-24 md:pb-32 relative overflow-hidden">
        {/* Decorative Grid */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-1.5 text-[11px] font-black uppercase text-slate-400 mb-6 tracking-widest font-rajdhani">
            <Link prefetch={false} href="/" className="hover:text-orange-500 transition-colors">HOME</Link>
            <span>›</span>
            <span className="text-white">QUALIFICATION DIRECTORY</span>
          </nav>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-5 uppercase font-rajdhani leading-none flex items-center justify-center gap-3">
            <GraduationCap className="w-10 h-10 text-orange-500" />
            <span className="text-white">Browse by</span> <span className="text-orange-500">Qualification</span>
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-medium">
            Select your highest educational qualification to find suitable active government job postings.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full -mt-12 md:-mt-20 relative z-20 pb-12">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {QUALIFICATIONS_LIST.map((qual) => (
            <Link prefetch={false}
              key={qual.slug}
              href={`/qualification/${qual.slug}`}
              className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center gap-3 hover:border-orange-500 hover:shadow-md transition-all group"
            >
              <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                {qual.emoji || '🎓'}
              </div>
              <h3 className="font-bold text-slate-900 text-xl group-hover:text-orange-600 transition-colors">
                {qual.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
