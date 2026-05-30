import React from 'react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="w-full bg-[#0b1120] text-white font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo Section (Image 1 style) */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* Logo Icon */}
            <div className="relative flex items-center justify-center w-12 h-12 rounded-full border-[3px] border-orange-600 overflow-hidden">
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-orange-600"></div>
              <svg className="w-6 h-6 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
              </svg>
            </div>
            
            {/* Logo Text */}
            <div className="flex flex-col justify-center">
              <div className="flex items-baseline gap-1.5 font-black font-rajdhani text-2xl tracking-wide uppercase leading-none">
                <span className="text-white">GETJOB</span>
                <span className="text-orange-600">UPDATE</span>
              </div>
              <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase mt-1">
                #FAST JOB ALERTS <span className="mx-1">|</span> LATEST VACANCIES
              </span>
            </div>
          </Link>

          {/* Right Trust Badges (Image 1 style) - Hidden on very small screens */}
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

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button className="text-white hover:text-orange-600 p-2 focus:outline-none">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
        </div>
      </div>
    </header>
  );
}
