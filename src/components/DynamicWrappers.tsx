'use client';
import dynamic from 'next/dynamic';

export const InteractiveStateBrowser = dynamic(
  () => import('@/components/InteractiveStateBrowser'), 
  { ssr: false, loading: () => <div className="h-[500px] bg-slate-100 rounded-2xl animate-pulse flex items-center justify-center text-slate-500">Loading State Browser...</div> }
);

export const AgeCalculator = dynamic(
  () => import('@/components/AgeCalculator'), 
  { ssr: false, loading: () => <div className="h-[400px] bg-white rounded-2xl border border-slate-100 shadow-sm animate-pulse flex items-center justify-center text-slate-500">Loading Age Calculator...</div> }
);

export const JobMatcher = dynamic(
  () => import('@/components/JobMatcher'), 
  { ssr: false, loading: () => <div className="h-[300px] bg-white rounded-2xl border border-slate-100 shadow-sm animate-pulse flex items-center justify-center text-slate-500">Loading Job Matcher...</div> }
);
