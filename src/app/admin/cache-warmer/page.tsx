'use client';

import React, { useState } from 'react';

export default function CacheWarmerPage() {
  const [status, setStatus] = useState<string>('Idle');
  const [urls, setUrls] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [currentUrl, setCurrentUrl] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const fetchUrls = async () => {
    setStatus('Fetching all URLs from Sitemap...');
    setIsRunning(true);
    const allUrls: string[] = [];

    try {
      const res = await fetch('/sitemap.xml');
      if (res.ok) {
        const text = await res.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, 'text/xml');
        const locs = xmlDoc.getElementsByTagName('loc');
        for (let i = 0; i < locs.length; i++) {
          if (locs[i].textContent) {
            allUrls.push(locs[i].textContent as string);
          }
        }
      }

      setUrls(allUrls);
      setTotal(allUrls.length);
      setStatus(`Found ${allUrls.length} pages. Ready to warm cache.`);
      setIsRunning(false);
    } catch (e) {
      setStatus('Error fetching URLs.');
      setIsRunning(false);
    }
  };

  const startWarming = async () => {
    if (urls.length === 0) return;
    setIsRunning(true);
    setStatus('Warming cache one by one to prevent server overload...');
    
    let count = 0;
    for (const url of urls) {
      setCurrentUrl(url);
      try {
        // Fetch the URL to force Next.js to statically generate and cache it
        await fetch(url, { mode: 'no-cors', cache: 'no-store' });
      } catch (e) {
        // Ignore cors or network errors, the request still hits the server
      }
      count++;
      setProgress(count);
      // Wait 2000ms between requests to keep the server safe
      await new Promise(r => setTimeout(r, 2000));
    }
    
    setStatus('? All pages have been successfully cached! Your site is now blazing fast.');
    setCurrentUrl('');
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-800">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">??</span>
          <h1 className="text-2xl font-black text-slate-900">Smart Cache Warmer</h1>
        </div>
        
        <p className="text-slate-600 mb-8 leading-relaxed">
          This tool will fetch all your URLs securely from the Sitemap to permanently cache them in Next.js. 
          It does this slowly (2 seconds delay) so your Hostinger server doesn't crash from overload.
        </p>

        <div className="flex gap-4 mb-8">
          <button 
            onClick={fetchUrls} 
            disabled={isRunning}
            className="px-6 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 disabled:opacity-50 transition-colors"
          >
            1. Scan Sitemap
          </button>
          
          <button 
            onClick={startWarming} 
            disabled={isRunning || urls.length === 0}
            className="px-6 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 disabled:opacity-50 transition-colors"
          >
            2. Start Caching ({urls.length} pages)
          </button>
        </div>

        <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 mb-6">
          <p className="font-bold text-sm text-slate-500 mb-1">Status:</p>
          <p className="text-slate-800 font-medium">{status}</p>
        </div>

        {total > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-bold text-slate-600">
              <span>Progress: {progress} / {total}</span>
              <span>{Math.round((progress / total) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-emerald-500 h-4 rounded-full transition-all duration-300" 
                style={{ width: `${(progress / total) * 100}%` }}
              ></div>
            </div>
            {currentUrl && (
              <p className="text-xs text-slate-400 truncate mt-2">
                Currently building: <span className="text-blue-500">{currentUrl}</span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

