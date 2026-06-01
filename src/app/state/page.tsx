import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { MapPin } from 'lucide-react';
import { STATES_LIST } from '@/lib/wordpress';

export const metadata: Metadata = {
  title: 'Browse Government Jobs by State | Get Job Update',
  description: 'Find state-wise government jobs, recruitment, and results across all states of India.',
};

export default function StateDirectoryPage() {
  return (
    <div className="w-full bg-slate-50 min-h-screen py-12 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl flex items-center gap-3">
            <MapPin className="w-8 h-8 text-blue-600" />
            Browse by State
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Select your state to find all active government job notifications, admit cards, and results specific to your region.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {STATES_LIST.map((state) => (
            <Link
              key={state.slug}
              href={`/state/${state.slug}`}
              className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3 hover:border-blue-500 hover:shadow-md transition-all group"
            >
              <div className="text-2xl group-hover:scale-110 transition-transform">
                {(state as any).emoji || '📍'}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                  {state.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
