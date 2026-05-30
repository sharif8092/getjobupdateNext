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
            className={`rounded-xl border transition-all duration-300 overflow-hidden shadow-sm group ${
              isOpen 
                ? 'border-orange-500 bg-orange-50/20 shadow-md ring-1 ring-orange-400/20' 
                : 'border-slate-200 bg-white hover:border-orange-300 hover:shadow-md'
            }`}
          >
            <button
              onClick={() => toggleFAQ(idx)}
              className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left cursor-pointer transition-colors"
            >
              <h3 className={`font-bold font-rajdhani text-base md:text-lg transition-colors pr-8 leading-snug ${
                isOpen ? 'text-orange-700' : 'text-slate-700 group-hover:text-slate-900'
              }`}>
                {item.q}
              </h3>
              
              <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${
                isOpen 
                  ? 'bg-orange-500 text-white shadow-md transform rotate-180' 
                  : 'bg-slate-100 text-slate-500 group-hover:bg-orange-100 group-hover:text-orange-600'
              }`}>
                <svg className="w-5 h-5 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            <div 
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-5 md:px-6 pb-6 pt-1">
                <div 
                  className="text-sm md:text-base text-slate-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: item.a }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
