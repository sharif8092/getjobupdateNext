'use client';

import React, { useState, useEffect } from 'react';

export default function ShareWidget() {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
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
    <div className="w-full border-y border-[var(--border)] py-6 my-8 font-baloo flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-50/20 dark:bg-slate-950/5 px-4 sm:px-6 rounded-2xl">
      
      {/* Label and Icon */}
      <div className="flex items-center gap-4 text-center sm:text-left">
        <div className="w-12 h-12 rounded-full bg-blue-500/5 flex items-center justify-center text-blue-500 border border-blue-500/10 flex-shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742l4.636-2.318m0 7.152l-4.636-2.318M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="space-y-0.5">
          <h4 className="font-rajdhani font-black text-base text-[var(--foreground)] uppercase tracking-wider leading-none">
            SPREAD THE WORD
          </h4>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
            SHARE WITH FRIENDS
          </p>
        </div>
      </div>

      {/* Sharing Links */}
      <div className="flex items-center gap-3.5 flex-wrap justify-center">
        {/* WhatsApp Icon */}
        <a 
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-11 h-11 rounded-full bg-[#25d366] hover:bg-[#20ba5a] flex items-center justify-center text-white transition-transform hover:scale-105 shadow-md shadow-[#25d366]/10"
          title="Share on WhatsApp"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.413 9.863-9.864.001-2.641-1.023-5.123-2.885-6.987C16.586 1.892 14.1 1.866 12.012 1.866c-5.44 0-9.866 4.415-9.869 9.866-.001 1.777.472 3.511 1.371 5.071L2.527 21.57l5.12-1.346-.1-.07z" />
          </svg>
        </a>

        {/* Telegram Icon */}
        <a 
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-11 h-11 rounded-full bg-[#0088cc] hover:bg-[#0077b5] flex items-center justify-center text-white transition-transform hover:scale-105 shadow-md shadow-[#0088cc]/10"
          title="Share on Telegram"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-.99.53-1.41.52-.46-.01-1.35-.26-2.01-.48-.81-.27-1.46-.42-1.4-.88.03-.24.36-.49.99-.74 3.88-1.69 6.47-2.8 7.77-3.32 3.69-1.48 4.45-1.74 4.95-1.75.11 0 .36.03.52.16.14.11.18.27.2.42z" />
          </svg>
        </a>

        {/* X/Twitter Icon */}
        <a 
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-11 h-11 rounded-full bg-black hover:bg-slate-900 flex items-center justify-center text-white transition-transform hover:scale-105 shadow-md"
          title="Share on X"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>

        {/* Copy Link Capsule Button */}
        <button 
          onClick={handleCopy}
          className={`h-11 rounded-full px-5 flex items-center gap-2 border border-slate-200 dark:border-slate-800 text-xs font-rajdhani font-black uppercase tracking-wider shadow-sm transition-all cursor-pointer ${copied ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'}`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            {copied ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            )}
          </svg>
          {copied ? 'COPIED!' : 'COPY LINK'}
        </button>
      </div>

    </div>
  );
}
