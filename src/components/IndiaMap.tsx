'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { INDIA_MAP_PATHS } from './IndiaMapPaths';
import { STATES_LIST } from '@/lib/wordpress';

// Hand-curated pastel color palette matching the requested premium design
const PASTEL_COLORS = [
  { fill: '#fbcfe8', hover: '#f9a8d4', stroke: '#db2777', text: '#be185d', name: 'pink' },      // pink
  { fill: '#d1fae5', hover: '#a7f3d0', stroke: '#059669', text: '#047857', name: 'green' },     // green
  { fill: '#fef3c7', hover: '#fde68a', stroke: '#d97706', text: '#b45309', name: 'yellow' },    // yellow
  { fill: '#ede9fe', hover: '#ddd6fe', stroke: '#7c3aed', text: '#6d28d9', name: 'lavender' },  // lavender
  { fill: '#ffedd5', hover: '#fed7aa', stroke: '#ea580c', text: '#c2410c', name: 'orange' },    // orange
  { fill: '#ccfbf1', hover: '#99f6e4', stroke: '#0d9488', text: '#0f766e', name: 'teal' },      // teal
  { fill: '#dbeafe', hover: '#bfdbfe', stroke: '#2563eb', text: '#1d4ed8', name: 'blue' }       // blue
];

export default function IndiaMap() {
  const router = useRouter();
  const [hoveredState, setHoveredState] = useState<{ name: string; slug: string; count: number; colorIndex: number } | null>(null);
  const [expanded, setExpanded] = useState(false);

  // Map state slug to its job count
  const getStateJobCount = (slug: string) => {
    const matched = STATES_LIST.find((s) => s.slug === slug);
    return matched ? matched.count : 5; // fallback
  };

  // Assign a stable color index based on the state name length or slug code
  const getStateColor = (slug: string, index: number) => {
    const colorIndex = (slug.length + index) % PASTEL_COLORS.length;
    return {
      colors: PASTEL_COLORS[colorIndex],
      colorIndex
    };
  };

  // Initially show only the top 8 main states with highest counts
  const mainStates = STATES_LIST.slice(0, 8);
  const otherStates = STATES_LIST.slice(8);
  const visibleStates = expanded ? STATES_LIST : mainStates;

  const handleStateClick = (slug: string) => {
    router.push(`/state/${slug}`);
  };

  return (
    <section id="state-map-section" className="w-full py-16 bg-white dark:bg-[#0b0f19] border-y border-[var(--border)] font-baloo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold font-rajdhani text-[var(--foreground)] uppercase tracking-tight">
            🗺️ Browse Jobs by State
          </h2>
          <p className="text-base text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto">
            Choose your state to find customized, active notifications tailored to local regions.
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: State badges and view list */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-[12px] font-black font-rajdhani tracking-wider text-amber-500 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full uppercase">
                Interactive Directory
              </span>
              <h3 className="text-2xl font-bold font-rajdhani text-[var(--foreground)] mt-2">
                Click a Region to Filter Instantly
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                We monitor recruitment drives across all 28 states and 8 union territories. Select a state to filter vacancies.
              </p>
            </div>

            {/* Live Status Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-5 text-white shadow-xl">
              {/* Background Glow */}
              <div className="absolute right-0 top-0 w-24 h-24 bg-amber-400/10 rounded-full blur-xl"></div>
              
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-black font-rajdhani tracking-widest text-emerald-400 uppercase">
                  Live Status Card
                </span>
              </div>

              {hoveredState ? (
                <div className="mt-3 animate-fade-in">
                  <h4 className="text-xl font-bold font-rajdhani text-white flex items-center gap-1.5">
                    📍 {hoveredState.name}
                  </h4>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80">
                    <span className="text-xs text-slate-400 font-medium">Active Openings:</span>
                    <span className="text-sm font-bold font-rajdhani text-amber-400">
                      {hoveredState.count} Live Posts
                    </span>
                  </div>
                  <button 
                    onClick={() => handleStateClick(hoveredState.slug)}
                    className="mt-3 w-full flex items-center justify-center gap-1.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-[#0f172a] px-3 py-1.5 text-xs font-bold font-rajdhani tracking-wide transition-colors"
                  >
                    View All {hoveredState.name} Jobs
                    <span>→</span>
                  </button>
                </div>
              ) : (
                <div className="mt-3 text-slate-400 text-xs py-4 flex items-center gap-2">
                  <span>🗺️</span> Hover over any state on the map or tap the list below to explore.
                </div>
              )}
            </div>

            {/* Dynamic Capsule Badges list */}
            <div className="flex flex-wrap gap-2 pt-2">
              {visibleStates.map((state, idx) => {
                const { colors } = getStateColor(state.slug, idx);
                const active = hoveredState?.slug === state.slug;
                
                return (
                  <Link
                    key={state.slug}
                    href={`/state/${state.slug}`}
                    onMouseEnter={() => setHoveredState({ name: state.name, slug: state.slug, count: state.count, colorIndex: idx })}
                    className="group flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold font-rajdhani uppercase border transition-all cursor-pointer"
                    style={{
                      backgroundColor: active ? colors.hover : 'rgba(255, 255, 255, 0.05)',
                      borderColor: active ? colors.stroke : 'var(--border)',
                      color: active ? '#0f172a' : 'var(--foreground)'
                    }}
                  >
                    <span>📍</span>
                    <span>{state.name}</span>
                    <span 
                      className="rounded-full px-1.5 py-0.5 text-[9px] font-black border font-mono transition-colors"
                      style={{
                        backgroundColor: active ? '#ffffff' : 'rgba(0,0,0,0.05)',
                        borderColor: active ? colors.stroke : 'var(--border)',
                        color: active ? colors.text : 'inherit'
                      }}
                    >
                      {state.count}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Expand / Collapse Button */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-2 flex items-center gap-1.5 text-xs font-extrabold font-rajdhani tracking-wider text-amber-500 dark:text-amber-400 hover:text-amber-600 transition-colors uppercase"
            >
              {expanded ? '▲ View Fewer Regions' : '▼ View All 38 Active Regions'}
            </button>
          </div>

          {/* Right Column: Premium India SVG Map */}
          <div className="lg:col-span-7 flex justify-center bg-slate-50 dark:bg-slate-950/40 rounded-3xl p-6 border border-[var(--border)] relative overflow-hidden group">
            {/* SVG Grid lines decoration */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
            
            <svg 
              className="india-map-svg w-full max-w-[500px] h-auto drop-shadow-md z-10 transition-transform group-hover:scale-[1.01]" 
              viewBox="0 0 612 696" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {INDIA_MAP_PATHS.map((statePath, idx) => {
                const count = getStateJobCount(statePath.slug);
                const { colors, colorIndex } = getStateColor(statePath.slug, idx);
                const isHovered = hoveredState?.slug === statePath.slug;

                return (
                  <path
                    key={statePath.id}
                    id={statePath.id}
                    d={statePath.d}
                    fill={isHovered ? colors.hover : colors.fill}
                    style={{
                      stroke: isHovered ? colors.stroke : 'rgba(255, 255, 255, 0.9)',
                      strokeWidth: isHovered ? '2.5px' : '1px',
                    }}
                    onMouseEnter={() => setHoveredState({ name: statePath.name, slug: statePath.slug, count, colorIndex })}
                    onMouseLeave={() => setHoveredState(null)}
                    onClick={() => handleStateClick(statePath.slug)}
                  />
                );
              })}
            </svg>
          </div>

        </div>

      </div>
    </section>
  );
}
