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
    <div className="bg-slate-900 rounded-2xl p-7 flex flex-col justify-center relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] mt-6">
      {/* Mesh pattern overlay */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '16px 16px' }} />
      {/* Decorative Glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl"></div>
      
      {/* Badge */}
      <div className="relative z-10 self-start px-3 py-1.5 bg-orange-500/10 text-orange-400 text-[9px] font-black rounded-lg flex items-center gap-1.5 mb-5 tracking-[0.15em] uppercase border border-orange-500/20">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
        </svg>
        <span>Fast Alerts</span>
      </div>
      
      {/* Title with Logo */}
      <div className="relative z-10 flex items-center gap-2.5 mb-1 mt-1">
        <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
          </svg>
        </div>
        <div className="flex items-baseline gap-1 font-black text-xl tracking-wide uppercase leading-none">
          <span className="text-white">GETJOB</span>
          <span className="text-orange-500">UPDATE</span>
        </div>
      </div>
      <h3 className="relative z-10 font-bold text-white text-[19px] mb-4 tracking-tight">
        Mobile Experience
      </h3>
      
      {/* Description */}
      <p className="relative z-10 text-slate-400 text-sm font-medium mb-6 leading-relaxed pr-2">
        Verified job alerts and direct results delivered to your lockscreen. No noise, just speed.
      </p>
      
      {/* Button */}
      <button 
        onClick={handleSubscribe}
        className="relative z-10 self-start px-6 py-3 bg-orange-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-orange-500 shadow-md shadow-orange-600/30 hover:-translate-y-0.5 transition-all duration-200"
      >
        ENABLE ALERTS
      </button>
    </div>
  );
}
