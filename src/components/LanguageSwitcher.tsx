'use client';

import React, { useEffect, useState } from 'react';
import Script from 'next/script';

const LANGUAGES = [
  { code: 'original', name: 'Original', nativeName: 'मूळ भाषा', flag: '✨' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇮🇳' },
];

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('original');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if user already has a translation cookie
    const cookies = document.cookie.split(';');
    const translateCookie = cookies.find(c => c.trim().startsWith('googtrans='));
    if (translateCookie) {
      const lang = translateCookie.split('/')[2]; // e.g. /en/hi -> hi
      if (lang && LANGUAGES.some(l => l.code === lang)) {
        setCurrentLang(lang);
      }
    }

    // Define the init function globally for the Google script to call
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: 'hi', // base language must be Hindi for English translation to work
          includedLanguages: 'hi,en,mr,bn,te,ta,gu,kn,or,pa,ur',
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        'google_translate_element'
      );
      setIsLoaded(true);
    };

    // Fallback if script loads fast or is already loaded
    setTimeout(() => {
      if ((window as any).google && (window as any).google.translate) {
        setIsLoaded(true);
      }
    }, 1000);
  }, []);

  const changeLanguage = (code: string) => {
    setCurrentLang(code);
    setIsOpen(false);

    if (code === 'original') {
      // Clear google translate cookies
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
      window.location.reload();
      return;
    }

    // Try to trigger the hidden select element
    const gtSelect = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (gtSelect) {
      gtSelect.value = code;
      gtSelect.dispatchEvent(new Event('change'));
    } else {
      // Fallback if widget hasn't rendered properly but script is loaded
      document.cookie = `googtrans=/hi/${code}; path=/;`;
      document.cookie = `googtrans=/hi/${code}; path=/; domain=${window.location.hostname};`;
      window.location.reload();
    }
  };

  const selectedLangInfo = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

  return (
    <div className="relative inline-block text-left z-50">
      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
      
      {/* Hidden google translate div */}
      <div id="google_translate_element" className="hidden"></div>
      
      {/* CSS to hide Google Translate default UI artifacts */}
      <style dangerouslySetInnerHTML={{ __html: `
        .goog-te-banner-frame.skiptranslate { display: none !important; }
        body { top: 0px !important; }
        #goog-gt-tt { display: none !important; }
        .goog-tooltip { display: none !important; }
        .goog-tooltip:hover { display: none !important; }
        .goog-text-highlight { background-color: transparent !important; box-shadow: none !important; }
      `}} />

      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-between w-full sm:w-[140px] px-3 py-1.5 text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/50 backdrop-blur-md"
        >
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <span className="hidden sm:inline">{selectedLangInfo.nativeName}</span>
            <span className="sm:hidden">{selectedLangInfo.code === 'original' ? 'Translate' : selectedLangInfo.nativeName}</span>
          </span>
          <svg className={`w-3.5 h-3.5 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <>
          {/* Backdrop for mobile closing */}
          <div className="fixed inset-0 z-40 sm:hidden" onClick={() => setIsOpen(false)}></div>
          
          <div className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-[280px] sm:w-[320px] origin-top-right sm:origin-top-left rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-top-2">
            
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Read in your language</span>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-700">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-2 grid grid-cols-2 gap-1 max-h-[300px] overflow-y-auto">
              {LANGUAGES.map((lang) => {
                const isActive = currentLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`
                      w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left
                      ${isActive 
                        ? 'bg-orange-50 text-orange-700 border border-orange-200 shadow-sm' 
                        : 'text-slate-700 hover:bg-slate-50 hover:text-orange-600 border border-transparent'}
                    `}
                  >
                    <span className="text-base">{lang.flag}</span>
                    <span className="truncate">{lang.nativeName}</span>
                    {isActive && (
                      <svg className="w-3.5 h-3.5 ml-auto text-orange-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    )}
                  </button>
                );
              })}
            </div>
            
            <div className="bg-slate-50 px-4 py-2 border-t border-slate-100 text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Powered by Google Translate
            </div>
          </div>
        </>
      )}
    </div>
  );
}
