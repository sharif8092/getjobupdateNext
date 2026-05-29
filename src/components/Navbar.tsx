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
            <div className="relative flex items-center justify-center w-12 h-12 rounded-full border-[3px] border-amber-500 overflow-hidden">
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-amber-500"></div>
              <svg className="w-6 h-6 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
              </svg>
            </div>
            
            {/* Logo Text */}
            <div className="flex flex-col justify-center">
              <div className="flex items-baseline gap-1.5 font-black font-rajdhani text-2xl tracking-wide uppercase leading-none">
                <span className="text-white">GETJOB</span>
                <span className="text-amber-500">UPDATE</span>
              </div>
              <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase mt-1">
                #FAST JOB ALERTS <span className="mx-1">|</span> LATEST VACANCIES
              </span>
            </div>
          </Link>

          {/* Right Trust Badges (Image 1 style) - Hidden on very small screens */}
          <div className="hidden lg:flex items-center gap-8">
            
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-500 text-white shadow-lg">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.642 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.358-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold font-rajdhani text-amber-500 tracking-widest uppercase leading-tight">Verified</span>
                <span className="text-[11px] font-bold font-rajdhani text-white tracking-wider uppercase leading-tight">Information</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-500 text-white shadow-lg">
                <span className="text-lg">🚀</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold font-rajdhani text-amber-500 tracking-widest uppercase leading-tight">Fast</span>
                <span className="text-[11px] font-bold font-rajdhani text-white tracking-wider uppercase leading-tight">Updates</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-500 text-white shadow-lg">
                <span className="text-lg">👍</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold font-rajdhani text-amber-500 tracking-widest uppercase leading-tight">Trusted</span>
                <span className="text-[11px] font-bold font-rajdhani text-white tracking-wider uppercase leading-tight">Resource</span>
              </div>
            </div>

          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button className="text-white hover:text-amber-500 p-2 focus:outline-none">
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
