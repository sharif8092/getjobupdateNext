'use client';

import React, { useState } from 'react';

interface FAQItem {
  q: string;
  a: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 font-baloo">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div 
            key={idx} 
            className="rounded-2xl border border-[var(--border)] bg-white dark:bg-[#0b0f19] shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
          >
            <button
              onClick={() => toggleFAQ(idx)}
              className="w-full flex items-center justify-between gap-4 p-5 text-left font-bold font-rajdhani text-base md:text-lg text-[var(--foreground)] bg-slate-50/50 dark:bg-slate-900/10 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/30"
            >
              <span>{item.q}</span>
              <span className="flex-shrink-0 text-xl font-bold transition-transform duration-300" style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}>
                ➕
              </span>
            </button>
            <div 
              className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[300px] border-t border-[var(--border)]' : 'max-h-0'}`}
            >
              <div 
                className="p-5 text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed bg-white dark:bg-[#0b0f19]"
                dangerouslySetInnerHTML={{ __html: item.a }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
