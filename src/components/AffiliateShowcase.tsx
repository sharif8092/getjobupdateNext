import React from 'react';
import { AFFILIATE_PRODUCTS } from '@/lib/affiliate';

export default function AffiliateShowcase() {
  // Grab standard trending products for homepage showcase
  const trendingBooks = AFFILIATE_PRODUCTS.slice(0, 6);

  return (
    <section className="w-full py-12 bg-gradient-to-b from-white to-[#f8fafc] dark:from-[#0b0f19] dark:to-[#030712] border-b border-[var(--border)] overflow-hidden font-baloo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div className="space-y-1">
            <span className="text-[10px] font-black font-rajdhani tracking-widest text-amber-500 uppercase bg-amber-500/10 px-2.5 py-0.5 rounded">
              📚 Sarkari Prep Store
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold font-rajdhani text-[var(--foreground)] uppercase mt-2">
              Best Preparation Books & Syllabus Guides
            </h2>
            <p className="text-xs text-slate-500">
              Boost your selection chances with top-rated guide books curated by verified academic experts.
            </p>
          </div>
          
          <span className="text-xs font-semibold text-slate-500 mt-2 md:mt-0 font-rajdhani uppercase tracking-wider block">
            ⭐ 4.5+ Average Rating
          </span>
        </div>

        {/* Responsive Scrolling Shelf */}
        <div className="flex overflow-x-auto gap-5 pb-5 scrollbar-none snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0">
          {trendingBooks.map((book) => (
            <div 
              key={book.id}
              className="w-[280px] md:w-[320px] flex-shrink-0 bg-white dark:bg-[#0b0f19] border border-[var(--border)] rounded-3xl p-5 shadow-sm hover:border-amber-400/50 hover:shadow-lg transition-all duration-300 snap-start flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Shimmer background effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none"></div>

              <div className="space-y-4">
                {/* Book Image Placeholder Box */}
                <div className="w-full h-40 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/40 dark:to-slate-950/40 rounded-2xl flex items-center justify-center text-5xl relative group-hover:scale-[1.02] transition-transform">
                  <span className="relative z-10">{book.image}</span>
                  {book.discountBadge && (
                    <span className="absolute top-3 right-3 text-[10px] font-black font-rajdhani tracking-wider text-slate-900 bg-amber-400 px-2.5 py-0.5 rounded-full uppercase shadow">
                      {book.discountBadge}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1">
                    <div className="flex text-amber-400 text-xs">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-3.5 h-3.5 ${i < Math.floor(book.rating) ? 'fill-current' : 'text-slate-200 dark:text-slate-800'}`} 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 font-mono">
                      {book.rating}
                    </span>
                  </div>

                  {/* Title & Author */}
                  <div className="space-y-1">
                    <h3 className="font-rajdhani font-black text-base text-[var(--foreground)] uppercase leading-tight line-clamp-2 group-hover:text-amber-500 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-[11px] font-bold text-slate-500 font-rajdhani uppercase tracking-wide">
                      By {book.author}
                    </p>
                  </div>

                  {/* Description snippet */}
                  <p className="text-xs text-slate-500 dark:text-slate-500 line-clamp-2 leading-relaxed">
                    {book.description}
                  </p>
                </div>
              </div>

              {/* Price and CTA Block */}
              <div className="pt-4 border-t border-[var(--border)] mt-4 flex items-center justify-between gap-2">
                <div className="flex flex-col">
                  <span className="text-sm font-black font-rajdhani text-slate-500 line-through leading-none">
                    {book.originalPrice}
                  </span>
                  <span className="text-xl font-black font-rajdhani text-emerald-600 dark:text-emerald-400 leading-none mt-1">
                    {book.price}
                  </span>
                </div>

                <a 
                  href={book.buyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-rajdhani font-black text-xs uppercase px-4 py-2.5 shadow-md shadow-amber-400/20 transition-all group-hover:scale-105"
                >
                  Buy on Amazon
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
