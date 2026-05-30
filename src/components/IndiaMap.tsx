'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { INDIA_MAP_PATHS } from './IndiaMapPaths';
import { STATES_LIST } from '@/lib/wordpress';

// Hand-curated pastel color palette matching the requested premium design
const PASTEL_COLORS = [
  { fill: '#fbcfe8', hover: '#f9a8d4', stroke: '#db2777', text: '#be185d', name: 'pink' },
  { fill: '#d1fae5', hover: '#a7f3d0', stroke: '#059669', text: '#047857', name: 'green' },
  { fill: '#fef3c7', hover: '#fde68a', stroke: '#d97706', text: '#b45309', name: 'yellow' },
  { fill: '#ede9fe', hover: '#ddd6fe', stroke: '#7c3aed', text: '#6d28d9', name: 'lavender' },
  { fill: '#ffedd5', hover: '#fed7aa', stroke: '#ea580c', text: '#c2410c', name: 'orange' },
  { fill: '#ccfbf1', hover: '#99f6e4', stroke: '#0d9488', text: '#0f766e', name: 'teal' },
  { fill: '#dbeafe', hover: '#bfdbfe', stroke: '#2563eb', text: '#1d4ed8', name: 'blue' }
];

export default function IndiaMap({ 
  externalHoverSlug = null, 
  onStateHover 
}: { 
  externalHoverSlug?: string | null;
  onStateHover?: (slug: string | null) => void;
}) {
  const router = useRouter();
  const [internalHoveredState, setInternalHoveredState] = useState<{ name: string; slug: string; count: number } | null>(null);

  // Use external slug if provided (for highlighting from outside), otherwise use internal hover logic for map badge
  const activeSlug = externalHoverSlug || internalHoveredState?.slug;
  const displayHoveredState = activeSlug ? { 
    name: STATES_LIST.find(s => s.slug === activeSlug)?.name || internalHoveredState?.name || '', 
    slug: activeSlug, 
    count: STATES_LIST.find(s => s.slug === activeSlug)?.count || internalHoveredState?.count || 5 
  } : null;

  const getStateJobCount = (slug: string) => {
    const matched = STATES_LIST.find((s) => s.slug === slug);
    return matched ? matched.count : 5;
  };

  const getStateColor = (slug: string, index: number) => {
    const colorIndex = (slug.length + index) % PASTEL_COLORS.length;
    return PASTEL_COLORS[colorIndex];
  };

  return (
    <>
      <div className="w-full relative z-10 scale-105 origin-center group">
        <svg 
          className="india-map-svg w-full max-w-[500px] h-auto drop-shadow-md z-10 mx-auto transition-transform group-hover:scale-[1.01]" 
          viewBox="0 0 612 696" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {INDIA_MAP_PATHS.map((statePath, idx) => {
            const count = getStateJobCount(statePath.slug);
            const colors = getStateColor(statePath.slug, idx);
            const isHovered = activeSlug === statePath.slug;

            return (
              <path
                key={statePath.id}
                id={statePath.id}
                d={statePath.d}
                fill={isHovered ? colors.hover : colors.fill}
                style={{
                  stroke: isHovered ? colors.stroke : 'rgba(255, 255, 255, 0.9)',
                  strokeWidth: isHovered ? '2.5px' : '1px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out'
                }}
                onMouseEnter={() => {
                  setInternalHoveredState({ name: statePath.name, slug: statePath.slug, count });
                  onStateHover?.(statePath.slug);
                }}
                onMouseLeave={() => {
                  setInternalHoveredState(null);
                  onStateHover?.(null);
                }}
                onClick={() => router.push(`/state/${statePath.slug}`)}
              />
            );
          })}
        </svg>
      </div>

      {/* Live Status Floating Badge */}
      <div className="absolute bottom-0 right-4 lg:right-12 z-20 bg-white rounded-full p-2 pr-3 flex items-center gap-5 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-slate-100 backdrop-blur-sm transition-all duration-300">
        <div className="w-12 h-12 rounded-full bg-[#1d4ed8] flex items-center justify-center shadow-inner">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        
        {displayHoveredState ? (
          <div className="flex flex-col pr-2 animate-fade-in min-w-[120px]">
            <div className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-0.5">{displayHoveredState.count} Live Posts</div>
            <div className="text-[17px] font-black text-slate-900 tracking-tight">{displayHoveredState.name}</div>
          </div>
        ) : (
          <div className="flex flex-col pr-2 min-w-[120px]">
            <div className="text-[11px] font-black text-[#1d4ed8] uppercase tracking-[0.2em] mb-0.5">LIVE STATUS</div>
            <div className="text-[17px] font-black text-slate-900 tracking-tight">38 Active Regions</div>
          </div>
        )}

        <div 
          onClick={() => displayHoveredState ? router.push(`/state/${displayHoveredState.slug}`) : router.push('/states')}
          className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center ml-2 hover:bg-slate-800 cursor-pointer transition-colors shadow-md text-white"
        >
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </div>
    </>
  );
}
