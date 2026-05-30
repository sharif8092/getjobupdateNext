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
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Default open first item

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
            className={`rounded-2xl border transition-all duration-300 overflow-hidden shadow-sm group ${
              isOpen 
                ? 'border-orange-400 dark:border-orange-500 bg-orange-50/30 dark:bg-orange-900/10 shadow-md ring-1 ring-orange-400/20' 
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f19] hover:border-orange-300 dark:hover:border-orange-700/50 hover:shadow-md'
            }`}
          >
            <button
              onClick={() => toggleFAQ(idx)}
              className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left cursor-pointer transition-colors"
            >
              <h3 className={`font-bold font-rajdhani text-base md:text-lg transition-colors ${
                isOpen ? 'text-orange-700 dark:text-orange-400' : 'text-slate-800 dark:text-slate-200 group-hover:text-orange-600'
              }`}>
                {item.q}
              </h3>
              
              <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border transition-all duration-300 ${
                isOpen 
                  ? 'bg-orange-600 border-orange-600 text-white shadow-md transform rotate-180' 
                  : 'bg-slate-50 border-slate-200 text-slate-500 group-hover:bg-orange-50 group-hover:border-orange-200 group-hover:text-orange-600'
              }`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            <div 
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div 
                className="px-5 md:px-6 pb-6 text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: item.a }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
