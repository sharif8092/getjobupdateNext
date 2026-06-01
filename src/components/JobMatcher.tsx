'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { STATES_LIST, QUALIFICATIONS_LIST, CATEGORIES_LIST, searchPosts, WordPressPost, extractPostMeta } from '@/lib/wordpress';

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
    dept?: string;
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
        const { dept, qual: extQual, lastDate } = extractPostMeta(job);
        const meta = job.custom_meta || {};
        const jobQual = (extQual || meta.aziz_qualification || '').toLowerCase();
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
            relaxationApplied,
            dept // storing dept so we can use it easily
          });
        }
      });

      setMatchedJobs(matched.slice(0, 8)); // Limit to top 8 best matches
    } catch (err /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full relative group">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-3xl border border-slate-200 dark:border-white/10 p-6 md:p-10 shadow-sm relative overflow-hidden transition-all duration-500">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start relative z-10">
            
            {/* Form Wizard Column (5 Columns) */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3 relative">
                <span className="inline-flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-500 bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-full shadow-sm">
                  <span>✨</span> AI Integration
                </span>
                <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight leading-none">
                  Eligibility Matcher
                </h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                  Enter your details to dynamically scan active gazettes and discover matched openings instantly.
                </p>
              </div>

              <form onSubmit={handleMatch} className="space-y-5 text-sm font-bold font-rajdhani text-slate-700 dark:text-slate-300 tracking-wide">
                
                {/* 1. Academic Qualification */}
                <div className="flex flex-col gap-2 group/input">
                  <label htmlFor="jm-qual" className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest group-focus-within/input:text-orange-500 transition-colors">🎓 Academic Background</label>
                  <div className="relative">
                    <select
                      id="jm-qual"
                      required
                      value={qual}
                      onChange={(e) => setQual(e.target.value)}
                      className="w-full appearance-none rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 px-4 py-3.5 text-[var(--foreground)] outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-slate-900 focus:shadow-[0_0_0_4px_rgba(251,191,36,0.1)] cursor-pointer transition-all uppercase"
                    >
                      <option value="" disabled>-- Choose Qualification --</option>
                      {QUALIFICATIONS_LIST.map((q) => (
                        <option key={q.slug} value={q.slug}>{q.name}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                  </div>
                </div>

                {/* Grid of Category and Age */}
                <div className="grid grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2 group/input">
                    <label htmlFor="jm-category" className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest group-focus-within/input:text-orange-500 transition-colors">🛡️ Category</label>
                    <div className="relative">
                      <select
                        id="jm-category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full appearance-none rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 px-4 py-3.5 text-[var(--foreground)] outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-slate-900 focus:shadow-[0_0_0_4px_rgba(251,191,36,0.1)] cursor-pointer transition-all uppercase"
                      >
                        <option value="General">General / UR</option>
                        <option value="OBC">OBC</option>
                        <option value="SC">SC</option>
                        <option value="ST">ST</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 group/input">
                    <label htmlFor="jm-age" className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest group-focus-within/input:text-orange-500 transition-colors">📅 Age (Years)</label>
                    <input
                      id="jm-age"
                      required
                      type="number"
                      min="15"
                      max="60"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 px-4 py-3.5 text-[var(--foreground)] outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-slate-900 focus:shadow-[0_0_0_4px_rgba(251,191,36,0.1)] transition-all font-sans font-bold"
                    />
                  </div>
                </div>

                {/* State of Residence */}
                <div className="flex flex-col gap-2 group/input">
                  <label htmlFor="jm-state" className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest group-focus-within/input:text-orange-500 transition-colors">📍 State of Residence</label>
                  <div className="relative">
                    <select
                      id="jm-state"
                      required
                      value={stateSlug}
                      onChange={(e) => setStateSlug(e.target.value)}
                      className="w-full appearance-none rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 px-4 py-3.5 text-[var(--foreground)] outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-slate-900 focus:shadow-[0_0_0_4px_rgba(251,191,36,0.1)] cursor-pointer transition-all uppercase"
                    >
                      <option value="" disabled>-- Choose Location --</option>
                      {STATES_LIST.map((s) => (
                        <option key={s.slug} value={s.slug}>{s.name}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base tracking-wider uppercase px-6 py-4 shadow-lg shadow-slate-900/10 cursor-pointer transition-all flex items-center justify-center gap-2 relative overflow-hidden"
                >
                  {loading ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                      Scanning...
                    </>
                  ) : (
                    <>🎯 Find Matches</>
                  )}
                </button>

              </form>
            </div>

            {/* Results Column (7 Columns) */}
            <div className="lg:col-span-7 h-full flex flex-col">
              <div className="bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50 rounded-[2rem] p-6 md:p-8 flex-1 flex flex-col relative overflow-hidden h-[540px]">
                <div className="border-b-2 border-slate-200/60 dark:border-slate-800 pb-4 mb-4 flex justify-between items-center z-10 relative">
                  <span className="text-[13px] font-black font-rajdhani tracking-widest text-slate-500 dark:text-slate-400 uppercase">
                    🔍 Matched Results
                  </span>
                  {hasSearched && (
                    <span className="text-[11px] font-extrabold font-rajdhani bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                      {matchedJobs.length} Jobs
                    </span>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar relative z-10">
                  {!hasSearched ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 animate-in fade-in duration-700">
                      <div className="w-20 h-20 mb-6 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                        <span className="text-4xl filter drop-shadow-sm">📋</span>
                      </div>
                      <h4 className="text-lg font-black font-rajdhani text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1">Awaiting Credentials</h4>
                      <p className="text-sm font-medium text-slate-500 max-w-sm">We will analyze official age limits and categories instantly when you search.</p>
                    </div>
                  ) : loading ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-4">
                      <div className="relative">
                        <div className="h-12 w-12 rounded-full border-4 border-orange-500/20"></div>
                        <div className="h-12 w-12 rounded-full border-4 border-orange-500 border-t-transparent animate-spin absolute inset-0"></div>
                      </div>
                      <p className="text-sm font-black font-rajdhani tracking-widest uppercase text-orange-500 animate-pulse">Running Scripts...</p>
                    </div>
                  ) : matchedJobs.length > 0 ? (
                    <div className="space-y-4">
                      {matchedJobs.map(({ post, reason, relaxationApplied, dept }, idx) => {
                        const postTypeSlug = post.type === 'aziz_job' ? 'jobs' : post.type === 'aziz_result' ? 'results' : 'admit-cards';
                        return (
                          <div 
                            key={post.id}
                            className="group/card rounded-2xl border-2 border-white dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/5 transition-all cursor-default"
                            style={{ animationDelay: `${idx * 100}ms` }}
                          >
                            <div className="flex-1 space-y-2.5 w-full">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[10px] font-black font-rajdhani tracking-widest text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md uppercase">
                                  🏢 {dept || 'Govt Board'}
                                </span>
                                <span className={`text-[9px] font-black font-rajdhani tracking-widest uppercase px-2 py-1 rounded-md ${relaxationApplied ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-500' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                                  {relaxationApplied ? 'Relaxation Applied' : 'Direct Match'}
                                </span>
                              </div>
                              <Link 
                                href={`/${postTypeSlug}/${post.slug}`}
                                className="block font-bold text-base md:text-sm text-slate-800 dark:text-slate-100 hover:text-orange-500 transition-colors line-clamp-2 leading-snug"
                                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                              />
                              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 font-sans bg-slate-50 dark:bg-slate-950 p-2 rounded-lg inline-block border border-slate-100 dark:border-slate-800">
                                ⚡ <span className="opacity-90">{reason}</span>
                              </p>
                            </div>
                            
                            <Link
                              href={`/${postTypeSlug}/${post.slug}`}
                              className="w-full sm:w-auto text-center shrink-0 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-orange-500 text-white hover:text-slate-900 font-rajdhani font-black text-[13px] px-5 py-3 uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
                            >
                              Check
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center text-rose-500 animate-in slide-in-from-bottom-4">
                      <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-3xl">❌</span>
                      </div>
                      <h4 className="text-lg font-black font-rajdhani uppercase tracking-wide mb-1">No matches found</h4>
                      <p className="text-sm font-medium text-rose-400/80 max-w-xs">Age requirements or qualifications did not match. Adjust your inputs to try again.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
