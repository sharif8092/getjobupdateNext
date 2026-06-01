'use client';

import React from 'react';
import Image from 'next/image';
import { getRecommendedProducts } from '@/lib/affiliate';

interface AffiliateAdProps {
  tags?: string[];
  customProduct?: any;
  globalAmazonId?: string;
  variant?: 'list' | 'highlight';
}

export default function AffiliateAd({ tags, customProduct, globalAmazonId, variant = 'list' }: AffiliateAdProps) {
  // Use custom product if provided, otherwise dynamically query 2 best books
  let matchedBooks = customProduct ? [customProduct] : (tags ? getRecommendedProducts(tags, 2) : []);

  // Dynamically rewrite Amazon tags if global ID is provided
  if (globalAmazonId) {
    matchedBooks = matchedBooks.map((book /* eslint-disable-line @typescript-eslint/no-explicit-any */) => {
      let finalLink = book.buyLink || '';
      if (finalLink.includes('amazon.') || finalLink.includes('amzn.to')) {
        finalLink = finalLink.replace(/([?&])tag=[^&]+(&|$)/, '$1');
        finalLink = finalLink.replace(/[?&]$/, '');
        finalLink += (finalLink.includes('?') ? '&' : '?') + 'tag=' + encodeURIComponent(globalAmazonId);
      }
      return { ...book, buyLink: finalLink };
    });
  }

  if (matchedBooks.length === 0) return null;

  // Determine section title based on tags
  const tagsString = (tags || []).join(' ').toLowerCase();
  let sectionTitle = 'RECOMMENDED BOOKS';
  if (tagsString.includes('laptop') || tagsString.includes('headphones') || tagsString.includes('printer')) {
    sectionTitle = 'STUDY GADGETS';
  } else if (tagsString.includes('study-table') || tagsString.includes('furniture')) {
    sectionTitle = 'STATIONERY PICKS';
  }

  if (variant === 'highlight') {
    return (
      <div className="w-full my-6 font-sans flex flex-col gap-6">
        {matchedBooks.slice(0, 1).map((book) => (
          <div key={book.id} className="w-full bg-[#f8faff] border border-blue-100/60 rounded-[32px] p-6 sm:p-8 flex flex-col md:flex-row gap-8 items-center shadow-sm">
            {/* Left Image */}
            <div className="w-[160px] h-[160px] sm:w-[180px] sm:h-[180px] rounded-[32px] bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex-shrink-0 flex items-center justify-center p-3 relative">
              <Image src={book.image} alt={book.title} fill className="object-contain p-4" unoptimized />
            </div>
            {/* Right Content */}
            <div className="flex-1 flex flex-col justify-center w-full min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
                <span className="text-[10px] font-black tracking-widest uppercase text-blue-700">Top Recommended Book</span>
              </div>
              <h3 className="text-[18px] sm:text-[20px] font-black text-slate-900 leading-[1.2] mb-3 tracking-tight">
                {book.title}
              </h3>
              <p className="text-[13px] sm:text-[14px] font-medium text-slate-600 mb-6 leading-relaxed">
                {book.description || "This guide is highly recommended for complete syllabus coverage."}
              </p>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mt-auto">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Our Price</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900 tracking-tight leading-none">{book.price}</span>
                    {book.originalPrice && <span className="text-[12px] font-bold text-slate-400 line-through">{book.originalPrice}</span>}
                  </div>
                </div>
                <a href={book.buyLink} target="_blank" rel="noopener noreferrer" className="bg-[#1849d6] hover:bg-blue-800 text-white px-6 py-3 rounded-[12px] font-black text-[12px] tracking-wide uppercase transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2.5 group">
                  View on Store
                  <svg className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full my-6 font-sans">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-[2px] bg-blue-400 rounded-full"></div>
        <h3 className="text-[11px] font-black tracking-[0.15em] text-slate-500 uppercase">
          {sectionTitle}
        </h3>
      </div>

      <div className="flex flex-col gap-6 w-full">
        {matchedBooks.map((book) => (
          <a href={book.buyLink} target="_blank" rel="noopener noreferrer" key={book.id} className="flex gap-4 sm:gap-5 items-center w-full group">
            {/* Image Container */}
            <div className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] rounded-[24px] bg-white border border-slate-100 shadow-[0_8px_24px_rgb(0,0,0,0.04)] flex-shrink-0 flex items-center justify-center relative overflow-hidden group-hover:shadow-[0_12px_30px_rgb(0,0,0,0.08)] transition-all duration-300 p-2">
              <Image 
                src={book.image} 
                alt={book.title} 
                fill 
                className="object-contain p-3 group-hover:scale-110 transition-transform duration-500 ease-out" 
                unoptimized 
              />
            </div>
            {/* Text Container */}
            <div className="flex-1 flex flex-col justify-center py-2 min-w-0">
              <h4 className="text-[12px] sm:text-[13px] font-black uppercase text-slate-900 leading-[1.4] line-clamp-2 mb-2.5 group-hover:text-blue-600 transition-colors" title={book.title}>
                {book.title}
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-[15px] sm:text-[17px] font-black text-slate-900">{book.price}</span>
                {book.originalPrice && (
                  <span className="text-[11px] sm:text-[12px] font-bold text-slate-400 line-through">{book.originalPrice}</span>
                )}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
