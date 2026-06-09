'use client';

import React, { useState, useEffect } from 'react';

interface SyllabusTrackerProps {
  keySlug: string;
}

const CORE_SUBJECTS = [
  {
    title: '🧮 Quantitative Aptitude',
    topics: ['Number Systems', 'Percentage & Average', 'Ratio & Proportion', 'Profit, Loss & Discount', 'Simple & Compound Interest', 'Time, Speed & Distance', 'Algebra & Geometry']
  },
  {
    title: '🧠 General Intelligence & Reasoning',
    topics: ['Analogies & Coding-Decoding', 'Blood Relations & Directions', 'Syllogism & Venn Diagrams', 'Series & Number Puzzles', 'Non-Verbal (Paper Folding/Mirror)', 'Seating Arrangement']
  },
  {
    title: '📖 English Language & Comprehension',
    topics: ['Spotting the Error', 'Synonyms & Antonyms', 'Cloze Test & Fillers', 'One-word Substitution', 'Reading Comprehension Passage', 'Active & Passive Voice']
  },
  {
    title: '🏛️ General Awareness & Current Affairs',
    topics: ['History & Geography (India)', 'Indian Constitution & Polity', 'General Science (PCB)', 'Economic Schemes', 'Current Affairs (Last 6 Months)', 'Sports & Awards']
  }
];

export default function SyllabusTracker({ keySlug }: SyllabusTrackerProps) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const [checkedTopics, setCheckedTopics] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);

  // Load progress from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`syllabus_progress_${keySlug}`);
      if (saved) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCheckedTopics(JSON.parse(saved));
      }
    } catch (e: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
      console.error('Failed to load syllabus progress:', e);
    }
    setHydrated(true);
  }, [keySlug]);

  // Handle checking/unchecking topic
  const toggleTopic = (topic: string) => {
    const updated = {
      ...checkedTopics,
      [topic]: !checkedTopics[topic]
    };
    setCheckedTopics(updated);
    
    try {
      localStorage.setItem(`syllabus_progress_${keySlug}`, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save syllabus progress:', e);
    }
  };

  // Calculate progress percentage
  const totalTopics = CORE_SUBJECTS.reduce((acc, curr) => acc + curr.topics.length, 0);
  const completedTopics = Object.values(checkedTopics).filter(Boolean).length;
  const progressPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  if (!hydrated) {
    return (
      <div className="animate-pulse space-y-2 py-4">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-5 font-baloo">
      {/* Visual Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs font-black font-rajdhani tracking-wider text-[var(--foreground)] uppercase">
          <span>Your study progress:</span>
          <span className="text-emerald-600 dark:text-emerald-400">{progressPercent}% Completed</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div 
            className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <span className="text-[10px] font-bold text-slate-500 font-mono block">
          Completed {completedTopics} of {totalTopics} chapters
        </span>
      </div>

      {/* Grid of Subjects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CORE_SUBJECTS.map((subject, sIdx) => (
          <div 
            key={sIdx} 
            className="rounded-xl border border-[var(--border)] bg-white dark:bg-[#0b0f19] p-4 space-y-3"
          >
            <h5 className="font-bold font-rajdhani text-sm text-[var(--foreground)] border-b border-[var(--border)] pb-1.5 uppercase">
              {subject.title}
            </h5>
            
            <div className="space-y-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              {subject.topics.map((topic, tIdx) => {
                const isChecked = !!checkedTopics[topic];
                return (
                  <label 
                    key={tIdx} 
                    className="flex items-center gap-2 cursor-pointer select-none hover:text-[var(--foreground)] transition-colors"
                  >
                    <input 
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleTopic(topic)}
                      className="rounded border-[var(--border)] text-emerald-500 focus:ring-emerald-500/20 cursor-pointer h-3.5 w-3.5"
                    />
                    <span className={isChecked ? 'line-through text-slate-400 dark:text-slate-600' : ''}>
                      {topic}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
