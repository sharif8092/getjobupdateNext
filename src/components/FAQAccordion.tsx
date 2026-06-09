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
  const [openIndex, setOpenIndex] = useState<number | null>(null); // Start all closed

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full font-sans">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div 
            key={idx} 
            className="border-b border-slate-200 last:border-0 transition-all duration-300"
          >
            <button
              onClick={() => toggleFAQ(idx)}
              className="w-full flex items-center justify-between gap-4 text-left cursor-pointer py-4 md:py-5 group"
            >
              <div role="heading" aria-level={3} className="font-bold text-slate-800 text-[15px] md:text-[16px] pr-8 leading-snug group-hover:text-slate-900 transition-colors">
                {item.q}
              </div>
              
              <div className={`flex-shrink-0 flex items-center justify-center transition-transform duration-300 ${isOpen ? 'text-orange-500 rotate-180' : 'text-slate-500 group-hover:text-orange-500'}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            <div 
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isOpen ? 'max-h-[1000px] opacity-100 pb-5' : 'max-h-0 opacity-0'
              }`}
            >
              <div 
                className="text-[14px] md:text-[15px] text-slate-600 leading-relaxed font-medium"
                dangerouslySetInnerHTML={{ __html: item.a }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
