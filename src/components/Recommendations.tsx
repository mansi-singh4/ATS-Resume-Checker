'use client';

import React from 'react';
import { Lightbulb, CheckCircle2 } from 'lucide-react';

interface RecommendationsProps {
  recommendations: string[];
}

export default function Recommendations({ recommendations }: RecommendationsProps) {
  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl hover:border-slate-700/80 transition-all duration-300">
      <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-teal-400" />
        Actionable Recommendations
      </h3>
      <p className="text-slate-500 text-xs mt-0.5 mb-6">
        Deterministic rules-based suggestions to help bypass applicant tracking system filters.
      </p>

      <div className="space-y-3">
        {recommendations.length > 0 ? (
          recommendations.map((rec, idx) => (
            <div 
              key={idx} 
              className="flex items-start gap-3 p-3 bg-slate-950/40 border border-slate-850 hover:border-slate-800 rounded-xl transition-all group"
            >
              <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded bg-teal-500/10 text-teal-400 flex items-center justify-center text-xs font-bold border border-teal-500/10 group-hover:bg-teal-500 group-hover:text-slate-950 transition-all">
                {idx + 1}
              </div>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{rec}</p>
            </div>
          ))
        ) : (
          <div className="p-4 bg-teal-500/5 border border-teal-500/15 rounded-xl flex items-center gap-3 text-teal-400 text-xs">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>Fantastic! No major optimizations required. Your resume is extremely clean and complete.</span>
          </div>
        )}
      </div>
    </div>
  );
}
