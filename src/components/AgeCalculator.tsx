'use client';

import React, { useState } from 'react';

interface AgeCalculatorProps {
  applyEnd: string;
  ageLimitStr: string;
  department: string;
}

export default function AgeCalculator({ applyEnd = '', ageLimitStr = '18-30', department = '' }: Partial<AgeCalculatorProps> = {}) {
  const [dob, setDob] = useState('2000-01-01');
  const [category, setCategory] = useState('General');
  const [calculated, setCalculated] = useState(false);
  
  const [result, setResult] = useState<{
    years: number;
    months: number;
    days: number;
    isEligible: boolean;
    reason: string;
    relaxationApplied: boolean;
  } | null>(null);

  const calculateAgeOnCutOff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dob) return;

    const dobDate = new Date(dob);
    
    // Determine cut-off date (defaulting to post applyEnd, fallback to current date)
    let cutOffDate = new Date();
    if (applyEnd) {
      const parsedDeadline = new Date(applyEnd);
      if (!isNaN(parsedDeadline.getTime())) {
        cutOffDate = parsedDeadline;
      }
    }

    if (dobDate > cutOffDate) {
      setResult({
        years: 0,
        months: 0,
        days: 0,
        isEligible: false,
        reason: 'Date of Birth cannot be after the cut-off deadline!',
        relaxationApplied: false
      });
      setCalculated(true);
      return;
    }

    // Precise Years, Months, Days calculation
    let years = cutOffDate.getFullYear() - dobDate.getFullYear();
    let months = cutOffDate.getMonth() - dobDate.getMonth();
    let days = cutOffDate.getDate() - dobDate.getDate();

    if (days < 0) {
      months -= 1;
      // Get days in the previous month of the cut-off date
      const prevMonth = new Date(cutOffDate.getFullYear(), cutOffDate.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    // Eligibility check
    let isEligible = true;
    let relaxationApplied = false;
    let reason = 'Your age fits perfectly within standard criteria.';

    const ageNumbers = ageLimitStr.match(/\d+/g);
    if (ageNumbers && ageNumbers.length >= 2) {
      const minAge = parseInt(ageNumbers[0]);
      let maxAge = parseInt(ageNumbers[1]);

      // Apply Caste relaxation concessions
      if (category === 'SC' || category === 'ST') {
        maxAge += 5;
        relaxationApplied = true;
      } else if (category === 'OBC') {
        maxAge += 3;
        relaxationApplied = true;
      }

      if (years < minAge) {
        isEligible = false;
        reason = `Minimum required age is ${minAge} years. You are underage by ${minAge - years} years.`;
      } else if (years > maxAge || (years === maxAge && (months > 0 || days > 0))) {
        isEligible = false;
        reason = `Maximum allowed age (including ${category} relaxation) is ${maxAge} years. You have exceeded this limit.`;
      } else {
        reason = `Eligible! Fits in the ${minAge}-${maxAge} range (Relaxation applied: ${relaxationApplied ? 'Yes' : 'None'}).`;
      }
    }

    setResult({
      years,
      months,
      days,
      isEligible,
      reason,
      relaxationApplied
    });
    setCalculated(true);
  };

  return (
    <div className="relative bg-white/90 backdrop-blur-xl rounded-[2rem] border border-slate-200/80 p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden font-baloo text-slate-800">
      {/* Background glowing blobs */}
      <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 rounded-full bg-orange-500/10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>

      <div className="relative z-10 space-y-1.5 mb-8 text-center max-w-xl mx-auto">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-black font-rajdhani tracking-widest text-orange-600 dark:text-orange-400 uppercase bg-orange-50 dark:bg-orange-900/20 px-3 py-1 rounded-full ring-1 ring-orange-500/20 shadow-sm mb-2">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Smart Age Verification
        </span>
        <h4 className="text-2xl md:text-3xl font-black font-rajdhani uppercase tracking-wide text-slate-900 dark:text-white">
          Sarkari Age Calculator
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-500">
          Check if you fit the age criteria on the official cut-off date (<strong>{applyEnd || 'notice date'}</strong>).
        </p>
      </div>

      <form onSubmit={calculateAgeOnCutOff} className="relative z-10 space-y-5 text-xs font-bold font-rajdhani text-slate-700 dark:text-slate-300 uppercase tracking-wide max-w-xl mx-auto">
        
        {/* Date of Birth selector */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="dob-input" className="text-[11px] font-extrabold text-slate-500 ml-1">📅 Select Date of Birth</label>
          <input
            id="dob-input"
            required
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-3.5 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all shadow-sm"
          />
        </div>

        {/* Category selector */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="category-select" className="text-[11px] font-extrabold text-slate-500 ml-1">🛡️ Caste Category (Relaxations)</label>
          <select
            id="category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-3.5 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all shadow-sm cursor-pointer"
          >
            <option value="General">General / UR</option>
            <option value="OBC">OBC (+3 Years Relaxation)</option>
            <option value="SC">SC (+5 Years Relaxation)</option>
            <option value="ST">ST (+5 Years Relaxation)</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full mt-2 rounded-2xl bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-rajdhani font-black text-sm tracking-widest uppercase py-3.5 shadow-lg shadow-orange-500/30 transition-all cursor-pointer flex justify-center items-center gap-2 group"
        >
          Calculate Eligibility
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </button>

      </form>

      {/* Calculated Results panel */}
      {calculated && result && (
        <div className="relative z-10 pt-6 mt-6 border-t border-slate-200 dark:border-slate-800 space-y-4 animate-fade-in text-xs font-baloo max-w-xl mx-auto">
          <div className="text-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/60 dark:to-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest block font-rajdhani mb-2">
              Your precise age on Cut-Off Date
            </span>
            <div className="text-2xl md:text-3xl font-black font-rajdhani text-slate-900 dark:text-white tracking-wide">
              <span className="text-orange-600">{result.years}</span> Yrs <span className="text-slate-400 mx-1">|</span> <span className="text-orange-600">{result.months}</span> Mos <span className="text-slate-400 mx-1">|</span> <span className="text-orange-600">{result.days}</span> Days
            </div>
          </div>

          <div className={`rounded-2xl p-4 md:p-5 border flex items-start gap-3 shadow-sm ${result.isEligible ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-900/10 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400'}`}>
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg ${result.isEligible ? 'bg-emerald-200/50' : 'bg-rose-200/50'}`}>
              {result.isEligible ? '✅' : '❌'}
            </div>
            <div className="space-y-1.5 pt-0.5">
              <strong className="block font-rajdhani uppercase tracking-widest text-xs font-black">
                {result.isEligible ? 'ELIGIBLE TO APPLY' : 'NOT ELIGIBLE'}
              </strong>
              <p className="text-[11px] md:text-xs leading-relaxed opacity-90 font-medium">
                {result.reason}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Age Relaxation Quick Guide */}
      <div className="relative z-10 mt-10 pt-8 border-t border-slate-200/60 max-w-2xl mx-auto hidden sm:block">
        <h5 className="text-[11px] font-black font-rajdhani uppercase tracking-widest text-slate-500 text-center mb-5">Standard Sarkari Age Relaxations</h5>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/50 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-4 text-center shadow-sm hover:border-orange-300 transition-colors">
            <div className="text-orange-600 font-black text-xl mb-1">+3 Yrs</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">OBC</div>
          </div>
          <div className="bg-white/50 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-4 text-center shadow-sm hover:border-orange-300 transition-colors">
            <div className="text-orange-600 font-black text-xl mb-1">+5 Yrs</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">SC / ST</div>
          </div>
          <div className="bg-white/50 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-4 text-center shadow-sm hover:border-orange-300 transition-colors">
            <div className="text-orange-600 font-black text-xl mb-1">+10 Yrs</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">PwD (Gen)</div>
          </div>
          <div className="bg-white/50 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-4 text-center shadow-sm hover:border-orange-300 transition-colors">
            <div className="text-orange-600 font-black text-xl mb-1">+13 Yrs</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">PwD (OBC)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
