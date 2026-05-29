'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { STATES_LIST, QUALIFICATIONS_LIST, CATEGORIES_LIST, searchPosts, WordPressPost } from '@/lib/wordpress';

export default function JobMatcher() {
  const [qual, setQual] = useState('');
  const [category, setCategory] = useState('General');
  const [age, setAge] = useState('21');
  const [stateSlug, setStateSlug] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [matchedJobs, setMatchedJobs] = useState<Array<{
    post: WordPressPost;
    reason: string;
    relaxationApplied: boolean;
  }>>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qual) return;

    setLoading(true);
    setHasSearched(true);

    try {
      // Fetch dynamic active jobs to scan
      // If server fetch is offline, standard mock database inside client runs automatically
      const activeJobs = await searchPosts('', 40);
      
      const candidateAge = parseInt(age) || 21;
      const matched: typeof matchedJobs = [];

      activeJobs.forEach((job) => {
        const meta = job.custom_meta || {};
        const jobQual = (meta.aziz_qualification || '').toLowerCase();
        const jobLocation = (meta.aziz_job_location || '').toLowerCase();
        const ageLimitStr = meta.aziz_age_limit || '18-30 Years';
        
        let isEligible = true;
        let reason = '100% Eligible matched profile';
        let relaxationApplied = false;

        // 1. Age Relaxations Analysis (Standard Government Norms)
        const ageNumbers = ageLimitStr.match(/\d+/g);
        if (ageNumbers && ageNumbers.length >= 2) {
          const minAge = parseInt(ageNumbers[0]);
          let maxAge = parseInt(ageNumbers[1]);

          // Apply Category Concessions
          if (category === 'SC' || category === 'ST') {
            maxAge += 5; // SC/ST relaxation
            relaxationApplied = true;
          } else if (category === 'OBC') {
            maxAge += 3; // OBC relaxation
            relaxationApplied = true;
          }

          if (candidateAge < minAge) {
            isEligible = false;
          } else if (candidateAge > maxAge) {
            isEligible = false;
          } else {
            reason = `Age criteria fit (${minAge}-${maxAge} years limit).`;
            if (relaxationApplied) {
              reason += ` Includes +${category === 'OBC' ? 3 : 5} yrs relaxation for ${category}.`;
            }
          }
        }

        // 2. Qualification matching
        const selectedQualObj = QUALIFICATIONS_LIST.find(q => q.slug === qual);
        const selectedQualName = selectedQualObj ? selectedQualObj.name.toLowerCase() : '';
        
        if (selectedQualName && jobQual) {
          // If candidate has PG, they can apply for PG, Graduation, 12th, 10th jobs
          // Simple hierarchy evaluation
          const qualHierarchy = ['10th', '12th', 'iti', 'diploma', 'graduate', 'b.e', 'post graduate'];
          const candidateIdx = qualHierarchy.findIndex(h => selectedQualName.includes(h));
          const jobIdx = qualHierarchy.findIndex(h => jobQual.includes(h));

          if (candidateIdx !== -1 && jobIdx !== -1 && candidateIdx < jobIdx) {
            isEligible = false; // job requires higher qualification than candidate has
          }
        }

        // 3. Location matching
        const selectedStateObj = STATES_LIST.find(s => s.slug === stateSlug);
        const selectedStateName = selectedStateObj ? selectedStateObj.name.toLowerCase() : '';
        
        if (selectedStateName && jobLocation) {
          const isAllIndia = jobLocation.includes('all india') || jobLocation.includes('central') || jobLocation.includes('all-india');
          const isMatchedState = jobLocation.includes(selectedStateName);
          
          if (!isAllIndia && !isMatchedState) {
            isEligible = false; // job is restricted to a different state
          }
        }

        if (isEligible) {
          matched.push({
            post: job,
            reason,
            relaxationApplied
          });
        }
      });

      setMatchedJobs(matched.slice(0, 8)); // Limit to top 8 best matches
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full py-12 bg-white dark:bg-[#0b0f19] border-b border-[var(--border)] font-baloo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="glass-card rounded-3xl border border-[var(--border)] p-6 md:p-10 shadow-lg relative overflow-hidden">
          {/* Glowing dynamic badge decoration */}
          <div className="absolute -left-16 -top-16 w-36 h-36 bg-amber-400/5 rounded-full blur-2xl"></div>
          <div className="absolute -right-16 -bottom-16 w-36 h-36 bg-blue-500/5 rounded-full blur-2xl"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
            
            {/* Form Wizard Column (5 Columns) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <span className="text-[11px] font-black font-rajdhani tracking-widest text-blue-500 dark:text-blue-400 uppercase bg-blue-500/10 px-3 py-1 rounded-md">
                  🚀 Premium AI Integration
                </span>
                <h3 className="text-2xl font-black font-rajdhani text-[var(--foreground)] uppercase">
                  Sarkari Eligibility Matcher
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Enter your academic and category details to dynamically scan open central/state recruitment gazettes and discover matched openings instantly.
                </p>
              </div>

              <form onSubmit={handleMatch} className="space-y-4 text-xs font-bold font-rajdhani text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                
                {/* 1. Academic Qualification */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-extrabold text-slate-500">🎓 Select Academic Background</label>
                  <select
                    required
                    value={qual}
                    onChange={(e) => setQual(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border)] bg-slate-50 dark:bg-slate-900/40 p-3 text-sm text-[var(--foreground)] outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="" disabled>-- Choose Qualification --</option>
                    {QUALIFICATIONS_LIST.map((q) => (
                      <option key={q.slug} value={q.slug}>{q.name}</option>
                    ))}
                  </select>
                </div>

                {/* Grid of Category, Age, and State */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Category */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-extrabold text-slate-500">🛡️ Caste Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-xl border border-[var(--border)] bg-slate-50 dark:bg-slate-900/40 p-3 text-sm text-[var(--foreground)] outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option value="General">General / UR</option>
                      <option value="OBC">OBC</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                    </select>
                  </div>

                  {/* Candidate Age */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-extrabold text-slate-500">📅 Current Age (Years)</label>
                    <input
                      required
                      type="number"
                      min="15"
                      max="60"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full rounded-xl border border-[var(--border)] bg-slate-50 dark:bg-slate-900/40 p-3 text-sm text-[var(--foreground)] outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* State of Residence */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-extrabold text-slate-500">📍 State of Residence</label>
                  <select
                    required
                    value={stateSlug}
                    onChange={(e) => setStateSlug(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border)] bg-slate-50 dark:bg-slate-900/40 p-3 text-sm text-[var(--foreground)] outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="" disabled>-- Choose Location --</option>
                    {STATES_LIST.map((s) => (
                      <option key={s.slug} value={s.slug}>{s.name}</option>
                    ))}
                  </select>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-amber-400 hover:bg-amber-500 text-[#0f172a] font-rajdhani font-black text-sm tracking-wider uppercase py-3.5 shadow-lg shadow-amber-400/10 cursor-pointer transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#0f172a] border-t-transparent"></div>
                      Scanning open bulletins...
                    </>
                  ) : (
                    <>🎯 Find My Matched Jobs</>
                  )}
                </button>

              </form>
            </div>

            {/* Results Column (7 Columns) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="border-b border-[var(--border)] pb-3 flex justify-between items-center">
                <span className="text-[12px] font-black font-rajdhani tracking-wider text-slate-400 uppercase">
                  🔍 MATCED VACANCY RESULTS
                </span>
                {hasSearched && (
                  <span className="text-[11px] font-extrabold font-rajdhani bg-emerald-500/15 border border-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded">
                    {matchedJobs.length} Jobs Matched
                  </span>
                )}
              </div>

              {!hasSearched ? (
                <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border-2 border-dashed border-[var(--border)] text-slate-400">
                  <span className="text-4xl mb-3">📋</span>
                  <p className="text-sm font-semibold">Select your credentials on the left.</p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">We will analyze official age limits and categories instantly.</p>
                </div>
              ) : loading ? (
                <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400 space-y-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-400 border-t-transparent"></div>
                  <p className="text-sm font-bold font-rajdhani tracking-wider uppercase">Running eligibility matching scripts...</p>
                </div>
              ) : matchedJobs.length > 0 ? (
                <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2">
                  {matchedJobs.map(({ post, reason, relaxationApplied }) => {
                    const postTypeSlug = post.type === 'aziz_job' ? 'jobs' : post.type === 'aziz_result' ? 'results' : 'admit-cards';
                    return (
                      <div 
                        key={post.id}
                        className="rounded-2xl border border-[var(--border)] bg-slate-50/50 dark:bg-slate-900/10 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-amber-400/40 transition-colors"
                      >
                        <div className="flex-1 space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[11px] font-black font-rajdhani text-blue-500">
                              🏢 {post.custom_meta?.aziz_department || 'Govt Board'}
                            </span>
                            <span className={`text-[10px] font-black font-rajdhani px-1.5 py-0.5 rounded ${relaxationApplied ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                              {relaxationApplied ? 'Relaxation Match' : 'Direct Match'}
                            </span>
                          </div>
                          <Link 
                            href={`/${postTypeSlug}/${post.slug}`}
                            className="block font-bold text-sm text-[var(--foreground)] hover:text-amber-500 line-clamp-1 transition-colors"
                            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                          />
                          <p className="text-[10px] font-semibold text-slate-500 font-mono">
                            ⚡ {reason}
                          </p>
                        </div>
                        
                        <Link
                          href={`/${postTypeSlug}/${post.slug}`}
                          className="w-full sm:w-auto text-center rounded-lg bg-slate-900 dark:bg-slate-800 hover:bg-amber-400 dark:hover:bg-amber-400 hover:text-slate-900 text-white font-rajdhani font-black text-xs px-3.5 py-2 uppercase tracking-wide transition-colors"
                        >
                          Check Status
                        </Link>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-rose-500/10 bg-rose-500/5 text-rose-500">
                  <span className="text-4xl mb-3">❌</span>
                  <p className="text-sm font-bold font-rajdhani uppercase tracking-wider">No exact matches found</p>
                  <p className="text-xs text-rose-400/80 mt-1 max-w-xs mx-auto">Either your age is outside standard bounds (18-30) or the vacancy requirements did not match your academic level. Try resetting input fields.</p>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
