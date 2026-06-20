'use client';

import React from 'react';
import { ProjectRelevanceItem } from '@/types';
import { Code, ShieldAlert, Sparkles, FolderKanban } from 'lucide-react';

interface ProjectRelevanceProps {
  projects: ProjectRelevanceItem[];
  hasJd: boolean;
}

export default function ProjectRelevance({ projects, hasJd }: ProjectRelevanceProps) {
  if (!hasJd) {
    return (
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl text-center py-12">
        <ShieldAlert className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-200 mb-1">Project Relevance Analysis Locked</h3>
        <p className="text-slate-500 text-sm max-w-sm mx-auto">
          Add a Job Description and run the analysis to check whether your projects align with the required technologies.
        </p>
      </div>
    );
  }

  const badgeStyles = {
    High: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    Medium: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    Low: 'bg-red-500/10 border-red-500/20 text-red-400'
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl hover:border-slate-700/80 transition-all duration-300">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <FolderKanban className="w-5 h-5 text-teal-400" />
          Project Relevance Analysis
        </h3>
        <p className="text-slate-500 text-xs mt-0.5">
          Algorithmic assessment of your resume projects based on technology overlaps with the job description.
        </p>
      </div>

      <div className="space-y-4 mt-6">
        {projects.length > 0 ? (
          projects.map((project, idx) => (
            <div 
              key={idx} 
              className="bg-slate-950/40 border border-slate-850 hover:border-slate-800/85 rounded-xl p-5 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-slate-900 rounded-lg text-teal-400">
                    <Code className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-slate-200 text-sm sm:text-base">{project.title}</h4>
                </div>

                <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${badgeStyles[project.relevance] || badgeStyles.Low}`}>
                  {project.relevance} Relevance
                </span>
              </div>

              {/* Technologies list */}
              <div className="mb-3">
                <span className="text-[10px] text-slate-500 font-mono uppercase block mb-1">Project Tech Stack</span>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.length > 0 ? (
                    project.technologies.map(tech => {
                      const isMatched = project.matchedTech.some(mt => mt.toLowerCase() === tech.toLowerCase());
                      return (
                        <span 
                          key={tech} 
                          className={`text-[10px] px-2 py-0.5 rounded ${
                            isMatched 
                              ? 'bg-teal-500/10 text-teal-300 font-semibold border border-teal-500/20' 
                              : 'bg-slate-900 text-slate-450 border border-slate-850'
                          }`}
                        >
                          {tech}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-xs text-slate-600 italic">No technology tags detected in description.</span>
                  )}
                </div>
              </div>

              <div className="bg-slate-900/30 border border-slate-850/60 rounded-lg p-3 text-xs text-slate-400 leading-relaxed flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-350 block mb-0.5">Engine Feedback:</span>
                  {project.reason}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 border border-dashed border-slate-850 rounded-xl bg-slate-950/20">
            <p className="text-xs text-slate-500 italic">No structured projects section detected on resume.</p>
          </div>
        )}
      </div>
    </div>
  );
}
