'use client';

import React, { useState, useEffect } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface Props {
  headings: Heading[];
}

export default function TableOfContents({ headings }: Props) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first intersecting heading
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break; // Stop after finding the first one
          }
        }
      },
      { rootMargin: '-100px 0px -60% 0px' }
    );

    headings.forEach((h) => {
      const element = document.getElementById(h.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (!headings || headings.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
      <div className="flex items-center gap-2 px-5 py-3 bg-slate-900">
        <svg className="w-4 h-4 text-orange-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h7" />
        </svg>
        <span className="text-xs font-black text-white uppercase tracking-widest">Table of Contents</span>
      </div>
      <nav className="p-4 bg-slate-50">
        <ul className="space-y-1 columns-1 sm:columns-2 gap-6">
          {headings.map((h, idx) => {
            const isActive = activeId === h.id;
            return (
              <li key={idx} className={`${h.level === 3 ? 'pl-4' : ''} break-inside-avoid`}>
                <a 
                  href={`#${h.id}`}
                  className={`flex items-start gap-2 py-1.5 px-2 rounded-lg text-sm font-semibold transition-all duration-150 group leading-snug ${isActive ? 'text-orange-700 bg-orange-100/80 shadow-sm border border-orange-200/50' : 'text-slate-600 hover:text-orange-600 hover:bg-orange-50/70'}`}
                >
                  <span className={`flex-shrink-0 text-xs font-black mt-0.5 min-w-[1.25rem] transition-colors ${isActive ? 'text-orange-600' : 'text-orange-400 group-hover:text-orange-600'}`}>
                    {idx + 1}.
                  </span>
                  <span>{h.text}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
