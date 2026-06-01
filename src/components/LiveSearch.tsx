'use client';

import React, { useState, useEffect, useRef, useTransition } from 'react';
import Link from 'next/link';
import { getLiveSearchResults } from '@/app/actions';
import { STATES_LIST, POST_TYPE_MAP, WordPressPost } from '@/lib/wordpress';

export default function LiveSearch() {
  const [query, setQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [results, setResults] = useState<WordPressPost[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search effect
  useEffect(() => {
    const handler = setTimeout(() => {
      if (query.trim().length >= 2) {
        startTransition(async () => {
          const res = await getLiveSearchResults(query);
          setResults(res);
          setIsOpen(true);
        });
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300); // 300ms debounce to save server load

    return () => clearTimeout(handler);
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [containerRef]);

  return (
    <div className="relative w-full max-w-3xl mx-auto" ref={containerRef}>
      <form action="/search" className="bg-white rounded-2xl p-2 flex items-center shadow-2xl border border-slate-100 relative z-20">
        <div className="flex-1 flex items-center pl-4 border-r border-slate-200">
          <svg className={`w-5 h-5 shrink-0 ${isPending ? 'text-orange-500 animate-spin' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isPending ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            )}
          </svg>
          <input 
            type="text" 
            name="q" 
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { if (results.length > 0) setIsOpen(true); }}
            aria-label="Search jobs" 
            placeholder="Search by job title or organization..." 
            className="w-full px-3 py-2.5 outline-none text-slate-800 bg-transparent text-sm font-medium placeholder:text-slate-400" 
          />
        </div>
        <div className="hidden sm:flex items-center px-4 w-44 border-r border-slate-200 cursor-pointer gap-2">
          <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          <select 
            name="state" 
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            aria-label="Filter by state" 
            className="bg-transparent text-slate-700 outline-none w-full text-sm font-semibold cursor-pointer appearance-none"
          >
            <option value="">All States</option>
            {STATES_LIST.map(s => <option key={s.slug} value={s.slug}>{s.name}</option>)}
          </select>
        </div>
        <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl px-6 py-3 font-bold text-sm flex items-center gap-2 transition-colors ml-1.5 shadow-md shadow-orange-600/30">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          Search
        </button>
      </form>

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] border border-slate-100 overflow-hidden z-50 text-left">
          <div className="p-2 flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 py-2">Instant Results</span>
            {results.map((post) => {
              const typeSlug = POST_TYPE_MAP[post.type] || 'jobs';
              return (
                <Link 
                  key={post.id} 
                  href={`/${typeSlug}/${post.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 hover:bg-slate-50 rounded-xl transition-colors flex items-start gap-3 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                  </div>
                  <div className="flex flex-col">
                    <span 
                      className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1" 
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }} 
                    />
                    {post.custom_meta?.aziz_department && (
                      <span className="text-[11px] text-slate-500 font-medium">🏢 {post.custom_meta.aziz_department}</span>
                    )}
                  </div>
                </Link>
              );
            })}
            <div className="p-2 border-t border-slate-100 mt-1 text-center">
              <button 
                onClick={() => {
                  const form = document.querySelector('form[action="/search"]') as HTMLFormElement;
                  if (form) form.submit();
                }}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
              >
                View all results for &quot;{query}&quot; →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
