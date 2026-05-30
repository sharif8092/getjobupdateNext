'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { STATES_LIST } from '@/lib/wordpress';
import IndiaMap from './IndiaMap';

export default function InteractiveStateBrowser() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
      {/* Left Column: Text and Pills */}
      <div className="lg:col-span-5 space-y-6">
        <h2 className="text-4xl md:text-[56px] font-black text-slate-900 tracking-tight leading-[1.1]">
          Browse by <span className="text-orange-600">State</span>
        </h2>
        <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-md font-medium">
          Find specific government opportunities within your home state or preferred region across India.
        </p>
        
        <div className="flex flex-wrap gap-4 pt-6">
          <Link 
            href="/state/central" 
            className="flex items-center gap-3 bg-slate-100/90 backdrop-blur-xl border border-slate-200/80 rounded-full py-2.5 px-5 hover:border-orange-500 hover:shadow-[0_8px_20px_rgb(17,64,176,0.12)] hover:-translate-y-0.5 transition-all shadow-sm group"
          >
            <span className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[11px] font-black tracking-wider group-hover:bg-orange-600 group-hover:text-white transition-colors">IN</span>
            <span className="text-[15px] font-bold text-slate-800 group-hover:text-orange-700 transition-colors">Central Government</span>
          </Link>
          
          {STATES_LIST.slice(0, 7).map((state) => {
            const isHovered = activeSlug === state.slug;
            return (
              <Link 
                key={state.slug} 
                href={`/state/${state.slug}`} 
                onMouseEnter={() => setActiveSlug(state.slug)}
                onMouseLeave={() => setActiveSlug(null)}
                className={`flex items-center gap-3 backdrop-blur-xl border rounded-full py-2.5 px-5 transition-all shadow-sm group ${
                  isHovered 
                            ? 'bg-orange-50 border-orange-500 shadow-[0_8px_20px_rgba(255,188,0,0.18)] -translate-y-0.5' 
                    : 'bg-slate-100/90 border-slate-200/80 hover:border-orange-500 hover:shadow-[0_8px_20px_rgba(255,188,0,0.14)] hover:-translate-y-0.5'
                }`}
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black tracking-wider transition-colors ${
                  isHovered 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-slate-200 text-slate-700 group-hover:bg-orange-600 group-hover:text-white'
                }`}>
                  {state.name.substring(0,2).toUpperCase()}
                </span>
                <span className={`text-[15px] font-bold transition-colors ${
                  isHovered ? 'text-orange-700' : 'text-slate-800 group-hover:text-orange-700'
                }`}>
                  {state.name}
                </span>
              </Link>
            );
          })}
          
          <Link href="/states" className="flex items-center gap-2 bg-slate-100/90 backdrop-blur-xl border border-slate-200 rounded-full py-3 px-6 hover:bg-orange-600 hover:text-white transition-all shadow-sm group">
            <span className="text-[15px] font-bold text-slate-800 group-hover:text-white transition-colors">View All States <span className="ml-1 text-lg leading-none group-hover:translate-x-1 inline-block transition-transform">→</span></span>
          </Link>
        </div>
      </div>

      {/* Right Column: Map */}
      <div className="lg:col-span-7 relative flex items-center justify-center min-h-[500px]">
        <IndiaMap 
          externalHoverSlug={activeSlug} 
          onStateHover={(slug) => setActiveSlug(slug)} 
        />
      </div>
    </div>
  );
}
