'use client';

import React from 'react';
import { AnalysisResult, ResumeData } from '@/types';
import { Sparkles, Award, FileText, CheckCircle2, XCircle, ShieldAlert, BookOpen, Briefcase, AwardIcon, Link2, Wrench } from 'lucide-react';

interface ScoresDisplayProps {
  result: AnalysisResult;
  resumeData: ResumeData;
  hasJd: boolean;
}

export default function ScoresDisplay({ result, resumeData, hasJd }: ScoresDisplayProps) {
  const { atsScore, scoreBreakdown, breakdown, jobMatchScore, strengthIndicator } = result;

  // Strength colors and descriptions
  const strengthConfigs = {
    Beginner: {
      color: 'from-red-500 to-rose-500 text-rose-400 bg-rose-500/10 border-rose-500/20',
      description: 'Needs significant expansion. Add contact details, projects, or clear section headings.'
    },
    Intermediate: {
      color: 'from-amber-500 to-orange-500 text-orange-400 bg-orange-500/10 border-orange-500/20',
      description: 'Decent base, but could be improved. Add missing sections, list more skills, and refine layout.'
    },
    Strong: {
      color: 'from-cyan-500 to-blue-500 text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      description: 'Highly competitive. Solid section structure, rich keyword density, and clear credentials.'
    },
    Excellent: {
      color: 'from-teal-500 to-emerald-500 text-teal-400 bg-teal-500/10 border-teal-500/20',
      description: 'Industry-standard excellence. Perfectly structured, rich technical terminology, and full contact metadata.'
    }
  };

  const currentStrength = strengthConfigs[strengthIndicator] || strengthConfigs.Beginner;

  // Circular progress helper
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  
  const getStrokeDashoffset = (score: number) => {
    return circumference - (score / 100) * circumference;
  };

  return (
    <div className="space-y-6">
      {/* Score and Strength row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ATS Score Circular Card */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center relative overflow-hidden group hover:border-slate-700/80 transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-cyan-500" />
          <span className="text-slate-400 text-xs font-mono mb-2 tracking-wider">OVERALL ATS SCORE</span>
          
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* Background Circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-slate-800 fill-none"
                strokeWidth="10"
              />
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-teal-500 fill-none transition-all duration-1000 ease-out"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={getStrokeDashoffset(atsScore)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold text-white leading-none font-sans">{atsScore}</span>
              <span className="text-slate-500 text-xs mt-1">/100</span>
            </div>
          </div>
          
          {/* Badge */}
          <div className="mt-4 flex items-center gap-1 text-slate-300 text-xs font-semibold px-2.5 py-1 bg-slate-950/60 rounded-full border border-slate-800">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>ATS Engine Rating</span>
          </div>
        </div>

        {/* Job Match Score Circular Card */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center relative overflow-hidden group hover:border-slate-700/80 transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
          <span className="text-slate-400 text-xs font-mono mb-2 tracking-wider">JOB DESCRIPTION MATCH</span>
          
          {hasJd ? (
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  className="stroke-slate-800 fill-none"
                  strokeWidth="10"
                />
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  className="stroke-cyan-500 fill-none transition-all duration-1000 ease-out"
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={getStrokeDashoffset(jobMatchScore)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold text-white leading-none font-sans">{jobMatchScore}%</span>
                <span className="text-slate-500 text-xs mt-1">Match</span>
              </div>
            </div>
          ) : (
            <div className="relative w-36 h-36 flex flex-col items-center justify-center text-center p-3 border-2 border-dashed border-slate-800 rounded-full">
              <ShieldAlert className="w-8 h-8 text-slate-600 mb-1" />
              <p className="text-[10px] text-slate-500 font-sans leading-tight">Paste a job description to activate</p>
            </div>
          )}
          
          <div className="mt-4 flex items-center gap-1 text-slate-300 text-xs font-semibold px-2.5 py-1 bg-slate-950/60 rounded-full border border-slate-800">
            <Award className="w-3.5 h-3.5 text-cyan-400" />
            <span>JD Relevance Rating</span>
          </div>
        </div>

        {/* Resume Strength Indicator Card */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden group hover:border-slate-700/80 transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
          
          <div>
            <span className="text-slate-400 text-xs font-mono tracking-wider block mb-2">RESUME STRENGTH</span>
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-2xl font-black px-4 py-1.5 rounded-xl border bg-gradient-to-r ${currentStrength.color} flex items-center gap-1.5 shadow-[0_0_15px_rgba(20,184,166,0.05)]`}>
                {strengthIndicator}
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed mt-3">
              {currentStrength.description}
            </p>
          </div>
          
          <div className="border-t border-slate-800/80 pt-3 mt-4 flex items-center justify-between text-xs text-slate-500">
            <span>Formula: Contact + Sections + Quality</span>
            <span className="font-mono">{atsScore}/100</span>
          </div>
        </div>
      </div>

      {/* Score breakdown and Section checks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Score Breakdown progress bars */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl hover:border-slate-700/80 transition-all duration-300">
          <h3 className="text-md font-bold text-slate-100 mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-400" />
            ATS Score Breakdown
          </h3>

          <div className="space-y-4">
            {/* Contact Info (Max 25) */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Contact Details Verified</span>
                <span className="font-mono text-slate-300">{scoreBreakdown.contactInfo} / 25 pts</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800/50">
                <div 
                  className="bg-teal-500 h-full transition-all duration-500 rounded-full" 
                  style={{ width: `${(scoreBreakdown.contactInfo / 25) * 100}%` }}
                />
              </div>
              <div className="flex gap-2 text-[10px] text-slate-500 mt-1">
                <span className={resumeData.contactInfo.email ? 'text-teal-500/85' : 'text-slate-600'}>Email (+5)</span>
                <span className={resumeData.contactInfo.phone ? 'text-teal-500/85' : 'text-slate-600'}>Phone (+5)</span>
                <span className={resumeData.contactInfo.linkedin ? 'text-teal-500/85' : 'text-slate-600'}>LinkedIn (+5)</span>
                <span className={resumeData.contactInfo.github ? 'text-teal-500/85' : 'text-slate-600'}>GitHub (+5)</span>
                <span className={resumeData.contactInfo.portfolio ? 'text-teal-500/85' : 'text-slate-600'}>Portfolio (+5)</span>
              </div>
            </div>

            {/* Sections (Max 55) */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Resume Structural Sections</span>
                <span className="font-mono text-slate-300">{scoreBreakdown.sections} / 55 pts</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800/50">
                <div 
                  className="bg-cyan-500 h-full transition-all duration-500 rounded-full" 
                  style={{ width: `${(scoreBreakdown.sections / 55) * 100}%` }}
                />
              </div>
              <div className="flex gap-2 text-[10px] text-slate-500 mt-1 flex-wrap">
                <span className={resumeData.sections.skills ? 'text-cyan-500/85' : 'text-slate-600'}>Skills (+10)</span>
                <span className={resumeData.sections.education ? 'text-cyan-500/85' : 'text-slate-600'}>Education (+10)</span>
                <span className={resumeData.sections.experience ? 'text-cyan-500/85' : 'text-slate-600'}>Experience (+15)</span>
                <span className={resumeData.sections.projects ? 'text-cyan-500/85' : 'text-slate-600'}>Projects (+15)</span>
                <span className={resumeData.sections.certifications ? 'text-cyan-500/85' : 'text-slate-600'}>Certifications (+5)</span>
              </div>
            </div>

            {/* Quality (Max 20) */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Text Quality & Keyword Density</span>
                <span className="font-mono text-slate-300">{scoreBreakdown.quality} / 20 pts</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800/50">
                <div 
                  className="bg-blue-500 h-full transition-all duration-500 rounded-full" 
                  style={{ width: `${(scoreBreakdown.quality / 20) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>Word Count (200-1000 range): +{breakdown.wordCount} pts</span>
                <span>Keyword Coverage: +{breakdown.keywords} pts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section Checks (Found vs Missing) */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl hover:border-slate-700/80 transition-all duration-300 flex flex-col justify-between">
          <div>
            <h3 className="text-md font-bold text-slate-100 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              Section Verification Status
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {Object.entries(resumeData.sections).map(([secName, present]) => (
                <div 
                  key={secName} 
                  className={`flex items-center justify-between p-2.5 rounded-lg border text-xs font-semibold capitalize transition-all ${
                    present 
                      ? 'bg-teal-500/5 border-teal-500/10 text-teal-400/90' 
                      : 'bg-red-500/5 border-red-500/10 text-red-400/80'
                  }`}
                >
                  <span>{secName}</span>
                  {present ? (
                    <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500/80 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
          <p className="text-[10px] text-slate-500 mt-4 leading-relaxed">
            * Note: ATS algorithms parse resumes by segments. Missing structural headings like Experience, Skills, or Education can cause parsing failures.
          </p>
        </div>
      </div>

      {/* Resume statistics grid */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl hover:border-slate-700/80 transition-all duration-300">
        <h3 className="text-md font-bold text-slate-100 mb-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-teal-400" />
          Extracted Resume Statistics
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl flex flex-col justify-center">
            <span className="text-slate-500 text-[10px] font-mono uppercase mb-0.5">Word Count</span>
            <span className="text-lg font-bold text-slate-200">{resumeData.stats.wordCount}</span>
            <span className="text-[9px] text-slate-500 mt-0.5">Optimal: 400 - 800</span>
          </div>

          <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl flex flex-col justify-center">
            <span className="text-slate-500 text-[10px] font-mono uppercase mb-0.5">Skills Found</span>
            <span className="text-lg font-bold text-slate-200">{resumeData.stats.skillsCount}</span>
            <span className="text-[9px] text-slate-500 mt-0.5">Matching keywords</span>
          </div>

          <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl flex flex-col justify-center">
            <span className="text-slate-500 text-[10px] font-mono uppercase mb-0.5">Projects Count</span>
            <span className="text-lg font-bold text-slate-200">{resumeData.stats.projectsCount}</span>
            <span className="text-[9px] text-slate-500 mt-0.5">Identified in section</span>
          </div>

          <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl flex flex-col justify-center">
            <span className="text-slate-500 text-[10px] font-mono uppercase mb-0.5">Work Entries</span>
            <span className="text-lg font-bold text-slate-200">{resumeData.stats.experienceCount}</span>
            <span className="text-[9px] text-slate-500 mt-0.5">Roles identified</span>
          </div>
        </div>
      </div>
    </div>
  );
}
