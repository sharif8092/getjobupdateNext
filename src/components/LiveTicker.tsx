'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { POST_TYPE_MAP } from '@/lib/wordpress';

interface TickerPost {
  slug: string;
  type: string;
  title: { rendered: string };
}

export default function LiveTicker() {
  const [posts, setPosts] = useState<TickerPost[]>([]);

  useEffect(() => {
    // Fetch immediately to prevent late visual changes (improves Speed Index)
    const fetchTicker = () => {
      fetch('/api/ticker')
        .then(r => r.json())
        .then(data => { if (Array.isArray(data)) setPosts(data); })
        .catch(() => {});
    };

    fetchTicker();
  }, []);

  if (posts.length === 0) {
    // Placeholder bar to prevent layout shift
    return (
      <div className="bg-black h-[46px] border-b border-white/10" aria-hidden="true" />
    );
  }

  const tickerItems = [...posts, ...posts];

  return (
    <div className="bg-black text-white overflow-hidden flex items-center relative text-sm font-semibold tracking-wide border-b border-white/10 h-[46px]">
      {/* Fixed LIVE Badge on the left */}
      <div className="bg-black px-4 absolute left-0 z-10 h-full flex items-center shadow-[10px_0_20px_rgba(0,0,0,1)]">
        <div className="bg-[#e11d48] text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-[0_0_10px_rgba(225,29,72,0.6)]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
          </span>
          LIVE
        </div>
      </div>

      {/* Scrolling container */}
      <div className="flex whitespace-nowrap pl-[120px] md:pl-[110px] w-max">
        <div className="flex gap-10 animate-marquee will-change-transform items-center hover:[animation-play-state:paused]">
          {tickerItems.map((post, i) => {
            const badgeLabel = POST_TYPE_MAP[post.type] || 'JOB';
            const routePrefix = badgeLabel === 'Sarkari Yojana' ? 'sarkari-yojana' : (POST_TYPE_MAP[post.type]?.toLowerCase() || 'jobs');

            return (
              <Link key={i} href={`/${routePrefix}/${post.slug}`} className="hover:opacity-80 transition-opacity flex items-center gap-2">
                <span className="text-amber-500">🔥</span>
                <span className="text-amber-500 font-bold tracking-tight" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                <span className="text-pink-400 font-bold text-[11px] uppercase">[{badgeLabel}]</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
