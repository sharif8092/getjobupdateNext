'use client';

import React, { useState, useEffect } from 'react';

export default function ShareWidget() {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentUrl(window.location.href);
    }
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const shareText = "Check out this latest government update on Get Job Update!";
  
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + currentUrl)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`;

  return (
    <div className="w-full my-6 sm:my-10 relative group">
      {/* Background Glow Effect - Hidden on mobile for cleaner look */}
      <div className="hidden sm:block absolute -inset-0.5 bg-gradient-to-r from-orange-500/20 via-blue-500/20 to-emerald-500/20 rounded-[2rem] blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Main Container */}
      <div className="relative w-full py-3 px-4 sm:py-6 sm:px-8 flex flex-row items-center justify-between gap-2 sm:gap-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[1.25rem] sm:rounded-[2rem] border border-slate-200/60 dark:border-slate-700/50 shadow-sm sm:shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
        
        {/* Decorative subtle pattern */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`, backgroundSize: '24px 24px' }} />

        {/* Left Section: Label and Icon */}
        <div className="flex items-center gap-2 sm:gap-5 text-left relative z-10 shrink-0">
          <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-rose-500 items-center justify-center text-white shadow-lg shadow-orange-500/30 transform transition-transform group-hover:scale-110 group-hover:rotate-3 duration-300 flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742l4.636-2.318m0 7.152l-4.636-2.318M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex flex-col justify-center">
            <h4 className="font-black text-[13px] sm:text-xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 uppercase tracking-tight sm:tracking-normal leading-none sm:leading-tight">
              SHARE<span className="sm:hidden">:</span>
              <span className="hidden sm:inline"> THE WORD</span>
            </h4>
            <p className="hidden sm:block text-[13px] font-black text-orange-500 dark:text-orange-400 uppercase tracking-[0.2em] leading-tight mt-1 opacity-90">
              Share With Friends
            </p>
          </div>
        </div>

        {/* Right Section: Sharing Links */}
        <div className="flex items-center gap-2 sm:gap-4 flex-nowrap justify-end relative z-10 shrink-0">
          
          {/* WhatsApp */}
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#25d366] to-[#128C7E] flex items-center justify-center text-white transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[#25d366]/40 active:scale-95 shrink-0"
            title="Share on WhatsApp"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.413 9.863-9.864.001-2.641-1.023-5.123-2.885-6.987C16.586 1.892 14.1 1.866 12.012 1.866c-5.44 0-9.866 4.415-9.869 9.866-.001 1.777.472 3.511 1.371 5.071L2.527 21.57l5.12-1.346-.1-.07z" />
            </svg>
          </a>

          {/* Telegram */}
          <a 
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#0088cc] to-[#005580] flex items-center justify-center text-white transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[#0088cc]/40 active:scale-95 shrink-0"
            title="Share on Telegram"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-.99.53-1.41.52-.46-.01-1.35-.26-2.01-.48-.81-.27-1.46-.42-1.4-.88.03-.24.36-.49.99-.74 3.88-1.69 6.47-2.8 7.77-3.32 3.69-1.48 4.45-1.74 4.95-1.75.11 0 .36.03.52.16.14.11.18.27.2.42z" />
            </svg>
          </a>

          {/* X / Twitter */}
          <a 
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-slate-800 to-black flex items-center justify-center text-white transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-800/40 active:scale-95 shrink-0"
            title="Share on X"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          {/* Divider */}
          <div className="hidden sm:block w-px h-8 bg-slate-200 dark:bg-slate-700 mx-1"></div>

          {/* Copy Link Capsule */}
          <button 
            onClick={handleCopy}
            title="Copy Link"
            className={`relative overflow-hidden h-8 w-8 sm:w-auto sm:h-12 rounded-full sm:px-7 flex items-center justify-center sm:gap-2 font-black text-sm uppercase tracking-wider transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-95 shrink-0 group/btn
              ${copied 
                ? 'bg-gradient-to-r from-emerald-400 to-emerald-600 text-white shadow-emerald-500/40' 
                : 'bg-slate-100 sm:bg-gradient-to-r sm:from-slate-100 sm:to-slate-200 dark:from-slate-800 dark:to-slate-700 text-slate-700 dark:text-white shadow-sm sm:shadow-slate-200/50 dark:shadow-none hover:from-white hover:to-slate-100 dark:hover:from-slate-700 dark:hover:to-slate-600'
              }`}
          >
            {/* Shimmer effect for button */}
            {!copied && <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover/btn:animate-shimmer hidden sm:block" />}
            
            <svg className={`w-4 h-4 sm:w-4 sm:h-4 relative z-10 ${copied ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              {copied ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              )}
            </svg>
            <span className="relative z-10 hidden sm:inline">{copied ? 'LINK COPIED!' : 'COPY LINK'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
