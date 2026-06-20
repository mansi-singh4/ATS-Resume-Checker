'use client';

import React from 'react';
import { AnalysisResult } from '@/types';
import { ShieldCheck, ShieldAlert, Sparkles, Briefcase } from 'lucide-react';

interface ExperienceMatchProps {
  experienceAnalysis: AnalysisResult['experienceAnalysis'];
  hasJd: boolean;
}

export default function ExperienceMatch({ experienceAnalysis, hasJd }: ExperienceMatchProps) {
  const { strengths, gaps, score } = experienceAnalysis;

  if (!hasJd) {
    return (
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl text-center py-12">
        <ShieldAlert className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-200 mb-1">Experience Alignment Locked</h3>
        <p className="text-slate-500 text-sm max-w-sm mx-auto">
          Add a Job Description and run the analysis to verify how well your work history matches the required responsibilities.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl hover:border-slate-700/80 transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-teal-400" />
            Experience Match Analysis
          </h3>
          <p className="text-slate-500 text-xs mt-0.5">
            Matches skills and responsibilities in your work history with JD expectations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-32 bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                score >= 80 ? 'bg-teal-500' : score >= 50 ? 'bg-cyan-500' : 'bg-orange-500'
              }`}
              style={{ width: `${score}%` }}
            />
          </div>
          <span className="text-sm font-bold text-slate-200">{score}% Match</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-400 flex-shrink-0" />
            Identified Strengths ({strengths.length})
          </h4>
          
          <div className="space-y-2">
            {strengths.length > 0 ? (
              strengths.map((str, idx) => (
                <div 
                  key={idx} 
                  className="p-3 bg-teal-500/5 border border-teal-500/10 rounded-xl text-xs text-slate-350 leading-relaxed flex items-start gap-2"
                >
                  <span className="text-teal-400 font-bold select-none">•</span>
                  <span>{str}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-650 italic">No structured strengths identified in work history.</p>
            )}
          </div>
        </div>

        {/* Potential Gaps */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-orange-400 flex-shrink-0" />
            Potential Gaps ({gaps.length})
          </h4>
          
          <div className="space-y-2">
            {gaps.length > 0 ? (
              gaps.map((gap, idx) => (
                <div 
                  key={idx} 
                  className="p-3 bg-orange-500/5 border border-orange-500/10 rounded-xl text-xs text-slate-350 leading-relaxed flex items-start gap-2"
                >
                  <span className="text-orange-400 font-bold select-none">•</span>
                  <span>{gap}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-teal-400 italic font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> No visible gaps identified. Your work history matches well!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
