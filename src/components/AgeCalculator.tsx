'use client';

import React, { useState } from 'react';

interface AgeCalculatorProps {
  applyEnd: string;
  ageLimitStr: string;
  department: string;
}

export default function AgeCalculator({ applyEnd, ageLimitStr, department }: AgeCalculatorProps) {
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
    <div className="glass-card rounded-3xl border border-[var(--border)] p-6 space-y-5 shadow-sm font-baloo">
      <div className="space-y-1">
        <span className="text-[11px] font-black font-rajdhani tracking-widest text-amber-500 uppercase bg-amber-500/10 px-2.5 py-0.5 rounded">
          📊 Smart Age Verification
        </span>
        <h4 className="text-lg font-bold font-rajdhani uppercase tracking-wide text-[var(--foreground)] mt-2">
          Sarkari Age Calculator
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Check if you fit the age criteria on the cut-off date (<strong>{applyEnd || 'notice date'}</strong>).
        </p>
      </div>

      <form onSubmit={calculateAgeOnCutOff} className="space-y-3 text-xs font-bold font-rajdhani text-slate-700 dark:text-slate-300 uppercase tracking-wide">
        
        {/* Date of Birth selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-slate-400">Select Date of Birth</label>
          <input
            required
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-slate-50 dark:bg-slate-900/40 p-2.5 text-sm text-[var(--foreground)] outline-none focus:border-amber-400"
          />
        </div>

        {/* Category selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-slate-400">Caste Category (For Relaxations)</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-slate-50 dark:bg-slate-900/40 p-2.5 text-sm text-[var(--foreground)] outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="General">General / UR</option>
            <option value="OBC">OBC (+3 Years Relaxation)</option>
            <option value="SC">SC (+5 Years Relaxation)</option>
            <option value="ST">ST (+5 Years Relaxation)</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-slate-950 dark:bg-slate-800 hover:bg-amber-400 dark:hover:bg-amber-400 hover:text-slate-900 text-white font-rajdhani font-black text-xs tracking-wider uppercase py-3 transition-colors cursor-pointer"
        >
          Calculate Eligibility
        </button>

      </form>

      {/* Calculated Results panel */}
      {calculated && result && (
        <div className="pt-3 border-t border-[var(--border)] space-y-3 animate-fade-in text-xs font-baloo">
          <div className="text-center bg-slate-50 dark:bg-slate-900/20 p-4 rounded-2xl border border-[var(--border)]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-rajdhani mb-1">
              Your precise age on Cut-Off Date:
            </span>
            <div className="text-xl font-extrabold font-rajdhani text-[var(--foreground)] tracking-wide">
              {result.years} Yrs, {result.months} Mos, {result.days} Days
            </div>
          </div>

          <div className={`rounded-xl p-3 border flex items-start gap-2.5 ${result.isEligible ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/5 border-rose-500/10 text-rose-500'}`}>
            <span className="text-base">{result.isEligible ? '✅' : '❌'}</span>
            <div className="space-y-1">
              <strong className="block font-rajdhani uppercase tracking-wider text-[11px]">
                {result.isEligible ? 'ELIGIBLE TO APPLY' : 'NOT ELIGIBLE'}
              </strong>
              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 font-medium">
                {result.reason}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
