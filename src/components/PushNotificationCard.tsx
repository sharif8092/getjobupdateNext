'use client';

import React from 'react';
import OneSignal from 'react-onesignal';

export default function PushNotificationCard() {
  const handleSubscribe = async () => {
    try {
      if (typeof window !== 'undefined' && OneSignal) {
        // Safe check to avoid crashing if OneSignal isn't fully initialized
        await OneSignal.Slidedown.promptPush();
      }
    } catch (error) {
      console.error('OneSignal prompt error:', error);
      alert('Please configure your OneSignal App ID first!');
    }
  };

  return (
    <div className="bg-[#353ec4] rounded-3xl p-7 flex flex-col justify-center relative overflow-hidden shadow-[0_10px_30px_-10px_rgba(53,62,196,0.5)] mt-6">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
      
      {/* Badge */}
      <div className="self-start px-3.5 py-1.5 bg-white/10 text-white text-[10px] font-black rounded-full flex items-center gap-1.5 mb-6 tracking-[0.15em] uppercase border border-white/5">
        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
        </svg>
        <span>#FAST JOB ALERTS</span> <span className="mx-1">|</span> <span>LATEST VACANCIES</span>
      </div>
      
      {/* Title with Logo */}
      <div className="flex items-center gap-3 mb-2 mt-2">
        <div className="relative flex items-center justify-center w-9 h-9 rounded-full border-2 border-[#ffbc00] overflow-hidden shrink-0">
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[#ffbc00]"></div>
          <svg className="w-4 h-4 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
          </svg>
        </div>
        <div className="flex items-baseline gap-1 font-black text-2xl tracking-wide uppercase leading-none">
          <span className="text-white">GETJOB</span>
          <span className="text-[#ffbc00]">UPDATE</span>
        </div>
      </div>
      <h3 className="font-bold text-white text-[22px] mb-5 tracking-tight">
        Mobile Experience
      </h3>
      
      {/* Description */}
      <p className="text-white/90 text-[15px] font-medium mb-8 leading-relaxed pr-2">
        Verified job alerts and direct results delivered to your lockscreen. No noise, just speed.
      </p>
      
      {/* Button */}
      <button 
        onClick={handleSubscribe}
        className="self-start px-7 py-3.5 bg-white text-[#353ec4] font-black text-xs uppercase tracking-widest rounded-full hover:bg-slate-100 hover:shadow-xl hover:scale-105 transition-all duration-200"
      >
        ENABLE ALERTS
      </button>
    </div>
  );
}
