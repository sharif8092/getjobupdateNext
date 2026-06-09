'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BrandIcon from '@/components/BrandIcon';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Latest Jobs', href: '/jobs' },
    { name: 'Sarkari Result', href: '/results' },
    { name: 'Admit Card', href: '/admit-cards' },
    { name: 'Answer Key', href: '/answer-keys' },
    { name: 'Syllabus', href: '/syllabus' },
    { name: 'Exam Guide', href: '/exams' },
    { name: 'Sarkari Yojana', href: '/sarkari-yojana' },
  ];

  const toolLinks = [
    { name: 'Age Calculator', href: '/age-calculator' },
    { name: 'AI Job Matcher', href: '/job-matcher' },
  ];

  return (
    <>
      <header className="w-full bg-slate-900 text-white font-sans border-b border-slate-800 relative z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            
            {/* Logo Section */}
            <Link href="/" className="flex items-center gap-3 group relative z-[60]">
              {/* Brand Icon */}
              <BrandIcon className="w-12 h-12 flex-shrink-0 transform group-hover:scale-105 transition-transform" />
              
              {/* Logo Text */}
              <div className="flex flex-col justify-center">
                <div className="flex items-baseline gap-1.5 font-black font-rajdhani text-2xl tracking-wide uppercase leading-none">
                  <span className="text-white">GETJOB</span>
                  <span className="text-orange-600">UPDATE</span>
                </div>
                <span className="text-[9px] font-bold tracking-widest text-slate-500 uppercase mt-1">
                  #FAST JOB ALERTS <span className="mx-1">|</span> LATEST VACANCIES
                </span>
              </div>
            </Link>

            {/* Right Trust Badges (Hidden on mobile) */}
            <div className="hidden lg:flex items-center gap-8">
              
              <div className="flex items-center gap-3 group cursor-default">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-600 text-white shadow-lg overflow-hidden">
                  <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.642 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.358-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold font-rajdhani text-orange-600 tracking-widest uppercase leading-tight">Verified</span>
                  <span className="text-[11px] font-bold font-rajdhani text-white tracking-wider uppercase leading-tight">Information</span>
                </div>
              </div>

              <div className="flex items-center gap-3 group cursor-default">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-600 text-white shadow-lg overflow-hidden">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-white group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform duration-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.438 4.438 0 002.733-2.73 4.996 4.996 0 004.312-1.758" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold font-rajdhani text-orange-600 tracking-widest uppercase leading-tight">Fast</span>
                  <span className="text-[11px] font-bold font-rajdhani text-white tracking-wider uppercase leading-tight">Updates</span>
                </div>
              </div>

              <div className="flex items-center gap-3 group cursor-default">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-600 text-white shadow-lg overflow-hidden">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold font-rajdhani text-orange-600 tracking-widest uppercase leading-tight">Trusted</span>
                  <span className="text-[11px] font-bold font-rajdhani text-white tracking-wider uppercase leading-tight">Resource</span>
                </div>
              </div>

            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="lg:hidden flex items-center">
              <button 
                onClick={() => setIsOpen(true)}
                aria-label="Open mobile menu" 
                className="text-white hover:text-orange-500 p-2 focus:outline-none transition-colors"
              >
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            
          </div>
        </div>
      </header>

      {/* Sleek Modern Side Drawer Menu */}
      <div 
        className={`fixed inset-0 z-[100] lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
        
        {/* Drawer panel */}
        <div 
          className={`absolute top-0 right-0 h-full w-[280px] bg-slate-900 shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header inside drawer */}
          <div className="flex items-center justify-between p-4 border-b border-slate-800">
            <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2 group">
              <BrandIcon className="w-7 h-7 flex-shrink-0 transform group-hover:scale-105 transition-transform" />
              <div className="flex items-baseline gap-1 font-black font-rajdhani text-base tracking-wide uppercase leading-none">
                <span className="text-white">GETJOB</span>
                <span className="text-orange-500">UPDATE</span>
              </div>
            </Link>
            <button 
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
              className="p-1.5 text-slate-500 hover:text-orange-500 hover:bg-slate-800 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Links */}
          <nav className="flex-1 overflow-y-auto py-2 px-2 flex flex-col gap-0.5">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center px-3 py-2.5 text-slate-300 hover:text-orange-500 hover:bg-slate-800/50 rounded-lg transition-all font-bold text-[14px]"
              >
                {link.name}
              </Link>
            ))}

            <div className="my-1 border-t border-slate-800"></div>
            
            <div className="px-3 py-1.5 text-[10px] font-black tracking-widest text-slate-500 uppercase">
              Smart Tools
            </div>
            
            {toolLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center px-3 py-2.5 text-slate-300 hover:text-orange-500 hover:bg-slate-800/50 rounded-lg transition-all font-bold text-[14px]"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Footer inside drawer */}
          <div className="p-4 border-t border-slate-800 flex flex-col gap-2">
            <a href="https://t.me/getjobupdatefree" target="_blank" rel="noopener noreferrer" className="bg-[#0088cc]/10 text-[#0088cc] hover:bg-[#0088cc] hover:text-white transition-colors py-2.5 px-4 rounded-xl flex justify-center items-center gap-2 font-bold text-[13px] tracking-wide w-full">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.94-4.22 2.78-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.37.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .24z"/></svg>
              Join Telegram
            </a>
            <a href="https://whatsapp.com/channel/0029VaB901DGU3BHpXk9pU3n" target="_blank" rel="noopener noreferrer" className="bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors py-2.5 px-4 rounded-xl flex justify-center items-center gap-2 font-bold text-[13px] tracking-wide w-full">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Join WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
