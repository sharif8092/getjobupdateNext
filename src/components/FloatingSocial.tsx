'use client';

import React, { useState, useEffect } from 'react';

export default function FloatingSocial() {
  const [visible, setVisible] = useState(false);
  const telegramUrl = 'https://t.me/getjobupdatefree';
  const whatsappUrl = 'https://whatsapp.com/channel/0029VbCi7hW9RZAO5fRVKO0W';

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (typeof window === 'undefined') return null;
  if (!visible) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-50 flex flex-col gap-3 animate-fade-in-up">
      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Join our WhatsApp Channel"
        className="group relative flex items-center justify-center w-14 h-14 bg-green-500 rounded-full shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300"
        title="Join our WhatsApp Channel"
      >
        <span className="absolute right-full mr-3 whitespace-nowrap bg-slate-900 text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Join WhatsApp
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
          <path d="M12 2C6.48 2 2 6.48 2 12c0 1.76.46 3.42 1.25 4.89L2 22l5.24-1.18A9.92 9.92 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18.2c-1.46 0-2.85-.35-4.08-1l-.29-.16-3.03.68.69-2.95-.18-.3A8.2 8.2 0 013.8 12c0-4.52 3.68-8.2 8.2-8.2 4.52 0 8.2 3.68 8.2 8.2s-3.68 8.2-8.2 8.2zm4.33-5.89c-.24-.12-1.4-.69-1.62-.77-.22-.08-.38-.12-.54.12s-.61.77-.75.93c-.14.16-.28.18-.52.06a6.56 6.56 0 01-1.92-1.19c-.66-.6-1.1-1.34-1.23-1.57-.13-.23-.01-.36.1-.48.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42s-.54-1.3-.74-1.78c-.19-.47-.38-.4-.54-.4h-.46c-.16 0-.42.06-.64.3s-.85.83-.85 2.03c0 1.2.87 2.36.99 2.52.12.16 1.72 2.63 4.17 3.69.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.4-.57 1.6-1.12.2-.55.2-.1.14-.12z" />
        </svg>
      </a>

      {/* Telegram Button */}
      <a
        href={telegramUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Join our Telegram Channel"
        className="group relative flex items-center justify-center w-14 h-14 bg-[#0088cc] rounded-full shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300"
        title="Join our Telegram Channel"
      >
        <span className="absolute right-full mr-3 whitespace-nowrap bg-slate-900 text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Join Telegram
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
          <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.892-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      </a>
    </div>
  );
}
