'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { searchPosts, WordPressPost, CATEGORIES_LIST } from '@/lib/wordpress';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<WordPressPost[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Search Input Change
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await searchPosts(searchQuery, 6);
        setSearchResults(results);
      } catch (err) {
        console.error(err);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[#0f172a]/90 backdrop-blur-md text-white shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo & Branding */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-black font-rajdhani tracking-tight bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                GET JOB<span className="text-blue-400">UPDATE</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 font-rajdhani font-semibold text-[15px] tracking-wide">
            <Link 
              href="/" 
              className={`px-3 py-2 rounded-lg transition-colors ${pathname === '/' ? 'text-amber-400 bg-white/5' : 'text-slate-200 hover:text-white hover:bg-white/5'}`}
            >
              HOME
            </Link>
            {CATEGORIES_LIST.map((cat) => {
              const active = pathname.startsWith(`/${cat.slug}`);
              return (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  className={`px-3 py-2 rounded-lg transition-colors ${active ? 'text-amber-400 bg-white/5' : 'text-slate-200 hover:text-white hover:bg-white/5'}`}
                >
                  {cat.name.toUpperCase()}
                </Link>
              );
            })}
          </nav>

          {/* Search Box & Mobile Toggle */}
          <div className="flex items-center gap-2 flex-1 max-w-xs md:max-w-sm justify-end">
            {/* Live Search Component */}
            <div ref={searchRef} className="relative w-full max-w-[240px] sm:max-w-[280px]">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Govt Jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  className="w-full rounded-full border border-slate-700 bg-slate-900/60 px-4 py-1.5 pl-10 text-sm text-white placeholder-slate-400 outline-none transition-all focus:border-amber-400 focus:bg-slate-950 focus:ring-2 focus:ring-amber-400/20"
                />
                <span className="absolute left-3.5 top-2.5 text-slate-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')} 
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Instant Dropdown results */}
              {searchFocused && (searchQuery.trim().length >= 2 || searching) && (
                <div className="absolute right-0 mt-2 w-[290px] sm:w-[350px] overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/95 p-2 shadow-2xl backdrop-blur-xl animate-float">
                  {searching ? (
                    <div className="flex items-center justify-center p-6 text-sm text-slate-400 gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-400 border-t-transparent"></div>
                      Searching database...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      <div className="px-3 py-1 text-[11px] font-bold text-amber-400/80 tracking-wider font-rajdhani border-b border-slate-800/80 mb-1">
                        🎯 LATEST LIVE UPDATES MATCHED
                      </div>
                      {searchResults.map((post) => {
                        const slugType = CATEGORIES_LIST.find((c) => c.type === post.type)?.slug || 'jobs';
                        return (
                          <Link
                            key={post.id}
                            href={`/${slugType}/${post.slug}`}
                            onClick={() => setSearchFocused(false)}
                            className="flex flex-col gap-0.5 rounded-lg p-2 hover:bg-white/5 transition-colors group"
                          >
                            <div className="flex items-center gap-1.5">
                              <span className="rounded bg-amber-400/10 px-1.5 py-0.5 text-[10px] font-extrabold font-rajdhani text-amber-300 uppercase">
                                {slugType}
                              </span>
                              <span className="text-[12px] text-slate-400">
                                {post.custom_meta?.aziz_department || 'Govt Board'}
                              </span>
                            </div>
                            <span className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                              {post.title.rendered}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-slate-500">
                      No results found for &quot;{searchQuery}&quot;
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950/95 px-4 py-4 space-y-2 animate-fade-in font-rajdhani font-semibold">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block rounded-lg px-3 py-2 text-base transition-colors ${pathname === '/' ? 'text-amber-400 bg-white/5' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
          >
            HOME
          </Link>
          {CATEGORIES_LIST.map((cat) => {
            const active = pathname.startsWith(`/${cat.slug}`);
            return (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded-lg px-3 py-2 text-base transition-colors ${active ? 'text-amber-400 bg-white/5' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
              >
                {cat.name.toUpperCase()}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
