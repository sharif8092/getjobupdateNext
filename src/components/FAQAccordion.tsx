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
    <div className="w-full space-y-4 font-sans">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div 
            key={idx} 
            className={`border transition-all duration-300 overflow-hidden bg-white shadow-sm hover:shadow-md rounded-2xl ${
              isOpen ? 'border-slate-300' : 'border-slate-200'
            }`}
          >
            <button
              onClick={() => toggleFAQ(idx)}
              className={`w-full flex items-center justify-between gap-4 text-left cursor-pointer transition-colors ${
                isOpen ? 'p-6 pb-4' : 'px-8 py-5'
              }`}
            >
              <h3 className="font-bold text-slate-900 text-base md:text-[17px] pr-8 leading-snug tracking-tight">
                {item.q}
              </h3>
              
              <div className="flex-shrink-0 text-slate-500 flex items-center justify-center transition-transform duration-300">
                {isOpen ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                )}
              </div>
            </button>
            <div 
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-6 pb-6 pt-2">
                <div 
                  className="text-[15px] text-slate-600 leading-relaxed font-medium"
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
