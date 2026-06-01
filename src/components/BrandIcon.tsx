import React from 'react';

export default function BrandIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Outer Border (Orange) */}
      <circle cx="256" cy="256" r="256" fill="#ea580c" />
      
      {/* Top Half (Dark Blue) */}
      <path d="M 28 256 A 228 228 0 0 1 484 256 Z" fill="#0f172a" />
      
      {/* Bottom Half (Orange) */}
      <path d="M 28 256 A 228 228 0 0 0 484 256 Z" fill="#ea580c" />
      
      {/* Bell Icon Overlay */}
      <svg x="136" y="136" width="240" height="240" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </svg>
    </svg>
  );
}
