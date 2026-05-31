'use client';

import React from 'react';
import Image from 'next/image';
import { getRecommendedProducts } from '@/lib/affiliate';

interface AffiliateAdProps {
  tags?: string[];
  customProduct?: any;
}

export default function AffiliateAd({ tags, customProduct }: AffiliateAdProps) {
  // Use custom product if provided, otherwise dynamically query 2 best books
  const matchedBooks = customProduct ? [customProduct] : (tags ? getRecommendedProducts(tags, 2) : []);

  if (matchedBooks.length === 0) return null;

  return (
    <div className="glass-card rounded-3xl border border-dashed border-amber-400/30 p-6 md:p-8 space-y-6 shadow-sm font-baloo relative overflow-hidden my-8">
      {/* Background soft aura */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full blur-2xl"></div>

      {/* Header */}
      <div className="flex items-start md:items-center justify-between gap-3 flex-wrap border-b border-[var(--border)] pb-4">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1 text-[10px] font-black font-rajdhani tracking-widest text-slate-900 dark:text-amber-500 bg-amber-400 dark:bg-amber-400/10 px-2.5 py-0.5 rounded uppercase font-mono shadow-sm">
            ⭐ Recommended Prep Kit
          </span>
          <h4 className="text-lg font-bold font-rajdhani uppercase tracking-wide text-[var(--foreground)] mt-2">
            Supercharge Your Selection Preparation
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Aspirants who cracked this exam highly recommend starting with these expert-approved study guides:
          </p>
        </div>
      </div>

      {/* Grid listing the recommended books */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {matchedBooks.map((book) => (
          <div 
            key={book.id}
            className="flex gap-4 p-4 bg-slate-50/50 dark:bg-slate-950/40 border border-[var(--border)] rounded-2xl items-center hover:border-amber-400/30 transition-all duration-300 group"
          >
            {/* Visual representation of Product */}
            <div className="w-16 h-16 rounded-xl bg-white dark:bg-[#0b0f19] border border-[var(--border)] flex items-center justify-center text-3xl shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform overflow-hidden relative">
              {book.image?.startsWith('http') || book.image?.startsWith('/') ? (
                <Image 
                  src={book.image} 
                  alt={book.title} 
                  width={64}
                  height={64}
                  className="w-full h-full object-contain p-1.5"
                  unoptimized={true}
                />
              ) : (
                book.image
              )}
            </div>

            <div className="flex-1 space-y-1.5 min-w-0">
              {/* Rating and Badges */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[9px] font-bold text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded font-mono">
                  ★ {book.rating} Rating
                </span>
                {book.discountBadge && (
                  <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded font-mono">
                    {book.discountBadge}
                  </span>
                )}
              </div>

              {/* Title & Price */}
              <h5 className="font-rajdhani font-black text-sm text-[var(--foreground)] uppercase leading-snug line-clamp-1 truncate group-hover:text-amber-500 transition-colors" title={book.title}>
                {book.title}
              </h5>
              
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-sm font-black font-rajdhani text-emerald-600 dark:text-emerald-400">
                  {book.price} <span className="text-[10px] text-slate-400 line-through font-normal">{book.originalPrice}</span>
                </span>
                
                <a 
                  href={book.buyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-black font-rajdhani text-slate-900 hover:text-amber-500 bg-amber-400 hover:bg-slate-950 hover:text-amber-400 px-3 py-1.5 rounded-lg uppercase tracking-wider transition-colors shadow-sm"
                >
                  Buy Now
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-[10px] text-slate-400 dark:text-slate-500 text-center italic border-t border-[var(--border)] pt-3 font-mono">
        Disclaimer: Recommending third-party study references may yield referral commission to sustain server costs.
      </div>
    </div>
  );
}
