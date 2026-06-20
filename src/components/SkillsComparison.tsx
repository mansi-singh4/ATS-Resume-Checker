'use client';

import React from 'react';
import { AnalysisResult } from '@/types';
import { Check, X, ShieldAlert, BadgeCheck } from 'lucide-react';

interface SkillsComparisonProps {
  skillsMatch: AnalysisResult['skillsMatch'];
  hasJd: boolean;
}

export default function SkillsComparison({ skillsMatch, hasJd }: SkillsComparisonProps) {
  const { matched, missing, percentage } = skillsMatch;

  if (!hasJd) {
    return (
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl text-center py-12">
        <ShieldAlert className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-200 mb-1">Skills Matching Locked</h3>
        <p className="text-slate-500 text-sm max-w-sm mx-auto">
          Paste a Job Description above and run the analyzer to compare matching and missing technical skills.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl transition-all duration-300 hover:border-slate-700/80">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <BadgeCheck className="w-5 h-5 text-teal-400" />
            Skills Match Analysis
          </h3>
          <p className="text-slate-500 text-xs mt-0.5">
            Compares technical keywords found in both the resume and the job description.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-32 bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                percentage >= 80 ? 'bg-teal-500' : percentage >= 50 ? 'bg-cyan-500' : 'bg-orange-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-sm font-bold text-slate-200">{percentage}% Match</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Matched Skills */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-teal-500/10 text-teal-400 text-[10px]">✓</span>
            Matched Skills ({matched.length})
          </h4>
          
          {matched.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {matched.map(skill => (
                <div 
                  key={skill} 
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-500/5 hover:bg-teal-500/10 border border-teal-500/15 rounded-lg text-xs font-medium text-teal-300 transition-colors"
                >
                  <Check className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-600 italic">No matching skills identified.</p>
          )}
        </div>

        {/* Missing Skills */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-red-500/10 text-red-400 text-[10px]">✗</span>
            Missing Skills ({missing.length})
          </h4>
          
          {missing.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {missing.map(skill => (
                <div 
                  key={skill} 
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/5 hover:bg-red-500/10 border border-red-500/15 rounded-lg text-xs font-medium text-red-350 transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-teal-400 italic font-medium flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> All job description skills are covered on your resume!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
