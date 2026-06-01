import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { MapPin } from 'lucide-react';
import { STATES_LIST } from '@/lib/wordpress';

export const metadata: Metadata = {
  title: 'Browse Government Jobs by State | Get Job Update',
  description: 'Find state-wise government jobs, recruitment, and results across all states of India.',
};

export default function StateDirectoryPage() {
  return (
    <div className="w-full bg-slate-50 min-h-screen flex flex-col font-sans">
      
      {/* Brand Hero Section */}
      <div className="bg-slate-900 w-full pt-12 pb-24 md:pb-32 relative overflow-hidden">
        {/* Decorative Grid */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-1.5 text-[11px] font-black uppercase text-slate-400 mb-6 tracking-widest font-rajdhani">
            <Link href="/" className="hover:text-orange-500 transition-colors">HOME</Link>
            <span>›</span>
            <span className="text-white">STATE DIRECTORY</span>
          </nav>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-5 uppercase font-rajdhani leading-none flex items-center justify-center gap-3">
            <MapPin className="w-10 h-10 text-orange-500" />
            <span className="text-white">Browse by</span> <span className="text-orange-500">State</span>
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-medium">
            Select your state to find all active government job notifications, admit cards, and results specific to your region.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full -mt-12 md:-mt-20 relative z-20 pb-12">
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {STATES_LIST.map((state) => (
            <Link
              key={state.slug}
              href={`/state/${state.slug}`}
              className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3 hover:border-orange-500 hover:shadow-md transition-all group"
            >
              <div className="text-2xl group-hover:scale-110 transition-transform">
                {(state as any).emoji || '📍'}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-orange-600 transition-colors">
                  {state.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
