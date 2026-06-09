'use client';

import React, { useState, useEffect } from 'react';

interface Props {
  applyLink?: string;
  pdfLink?: string;
  officialLink?: string;
  isResult?: boolean;
}

export default function MobileStickyCTA({ applyLink, pdfLink, officialLink, isResult }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!applyLink && !pdfLink && !officialLink) return null;

  return (
    <div
      className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-[0_-4px_24px_rgba(0,0,0,0.10)] px-2 py-2 flex gap-1.5 transition-transform duration-300 ${visible ? 'translate-y-0' : 'translate-y-full'}`}
    >
      {applyLink && (
        <a
          href={applyLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-white font-bold text-[10px] rounded-lg py-1.5 transition-colors shadow-sm ${isResult ? 'bg-green-700 hover:bg-green-800' : 'bg-orange-700 hover:bg-orange-800'}`}
        >
          {isResult ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
            </svg>
          )}
          {isResult ? 'Check Result' : 'Apply Now'}
        </a>
      )}
      {pdfLink && (
        <a
          href={pdfLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center justify-center gap-0.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-[10px] rounded-lg py-1.5 transition-colors border border-slate-700"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Notification
        </a>
      )}
      {officialLink && (
        <a
          href={officialLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center justify-center gap-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] rounded-lg py-1.5 transition-colors border border-slate-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582" />
          </svg>
          Official Web
        </a>
      )}
    </div>
  );
}
