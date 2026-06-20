'use client';

import React, { useState } from 'react';
import { Sparkles, BarChart3, Lock, Award, FileSpreadsheet, Download, RefreshCw, Send, AlertTriangle } from 'lucide-react';
import FileUpload from './FileUpload';
import JobDescriptionInput from './JobDescriptionInput';
import ScoresDisplay from './ScoresDisplay';
import SkillsComparison from './SkillsComparison';
import ProjectRelevance from './ProjectRelevance';
import ExperienceMatch from './ExperienceMatch';
import Recommendations from './Recommendations';
import SecurityPanel from './SecurityPanel';
import ExportReportButton from './ExportReportButton';

import { ResumeData, AnalysisResult } from '@/types';
import { parseJobDescription, matchResumeWithJd } from '@/lib/matching';

type ActiveTab = 'skills' | 'projects' | 'experience' | 'recommendations' | 'security';

export default function Dashboard() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [jdText, setJdText] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('skills');
  const [parseError, setParseError] = useState<string>('');

  // Handle successful resume parsing
  const handleParseSuccess = (data: ResumeData) => {
    setResumeData(data);
    setParseError('');

    // Automatically run baseline analysis (without JD details)
    const baselineJd = parseJobDescription('');
    const baselineResult = matchResumeWithJd(data, baselineJd);
    setAnalysisResult(baselineResult);
  };

  // Handle analysis trigger (resume + pasted JD)
  const handleAnalyze = (text: string) => {
    if (!resumeData) return;

    setIsAnalyzing(true);
    setJdText(text);

    // Simulate short network delay for pleasant user micro-interaction
    setTimeout(() => {
      try {
        const parsedJd = parseJobDescription(text);
        const result = matchResumeWithJd(resumeData, parsedJd);
        setAnalysisResult(result);
      } catch (err) {
        console.error(err);
      } finally {
        setIsAnalyzing(false);
      }
    }, 600);
  };

  // Reset dashboard state
  const handleReset = () => {
    setResumeData(null);
    setJdText('');
    setAnalysisResult(null);
    setParseError('');
    setActiveTab('skills');
  };

  const hasJd = !!jdText.trim();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-teal-500 selection:text-slate-950">

      {/* Decorative background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse" />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">

        {/* Hero Section */}
        <section className="text-center py-6 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold rounded-full shadow-[0_0_15px_rgba(20,184,166,0.1)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ATS Resume Checker Pro v1.2</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-teal-100 to-cyan-400">
            Optimize Your Resume for ATS Filters
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Upload your resume PDF and paste the target job description. Get instant match scores, extract missing keywords, and review deterministic improvements—all processed locally in your browser.
          </p>
        </section>

        {/* Upload & JD Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <FileUpload
            onParseSuccess={handleParseSuccess}
            onParseError={setParseError}
            onReset={handleReset}
            parsedData={resumeData}
          />
          <JobDescriptionInput
            onAnalyze={handleAnalyze}
            isLoading={isAnalyzing}
            isDisabled={!resumeData}
          />
        </section>

        {/* Analysis Dashboard */}
        {resumeData && analysisResult && (
          <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-teal-400" />
                  Audit Analysis Results
                </h2>
                <p className="text-slate-400 text-xs mt-1">
                  Analysis based on local parsing of {resumeData.contactInfo.name}&apos;s resume details.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <ExportReportButton
                  result={analysisResult}
                  resumeData={resumeData}
                  hasJd={hasJd}
                />
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset All</span>
                </button>
              </div>
            </div>

            {/* Circular Scores and Breakdown */}
            <ScoresDisplay
              result={analysisResult}
              resumeData={resumeData}
              hasJd={hasJd}
            />

            {/* Tabbed Interactive Views */}
            <div className="space-y-4">
              <div className="flex border-b border-slate-800 overflow-x-auto pb-px gap-1 no-scrollbar">
                {[
                  { id: 'skills', label: 'Skills Alignment' },
                  { id: 'projects', label: 'Projects Relevance' },
                  { id: 'experience', label: 'Experience Match' },
                  { id: 'recommendations', label: 'Actionable Suggestions' },
                  { id: 'security', label: 'Security & Privacy' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as ActiveTab)}
                    className={`px-4 py-2.5 font-bold text-xs sm:text-sm border-b-2 whitespace-nowrap transition-all cursor-pointer ${activeTab === tab.id
                        ? 'border-teal-500 text-teal-400 bg-teal-500/5'
                        : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-800'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab panels */}
              <div className="transition-all duration-300">
                {activeTab === 'skills' && (
                  <SkillsComparison
                    skillsMatch={analysisResult.skillsMatch}
                    hasJd={hasJd}
                  />
                )}
                {activeTab === 'projects' && (
                  <ProjectRelevance
                    projects={analysisResult.projectRelevance}
                    hasJd={hasJd}
                  />
                )}
                {activeTab === 'experience' && (
                  <ExperienceMatch
                    experienceAnalysis={analysisResult.experienceAnalysis}
                    hasJd={hasJd}
                  />
                )}
                {activeTab === 'recommendations' && (
                  <Recommendations
                    recommendations={analysisResult.recommendations}
                  />
                )}
                {activeTab === 'security' && (
                  <SecurityPanel />
                )}
              </div>
            </div>

          </section>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full bg-slate-950 border-t border-slate-900 py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-1">
            <p className="text-slate-400 text-sm font-semibold">
              Built by Mansi Singh
            </p>
            <p className="text-slate-650 text-xs">
              Contact: <a href="mailto:mansisingh2072@gmail.com" className="text-teal-450 hover:underline">mansisingh2072@gmail.com"</a>
            </p>
          </div>

          <div>
            <a
              href="https://digitalheroesco.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(20,184,166,0.1)] hover:shadow-[0_0_20px_rgba(20,184,166,0.25)] transition-all cursor-pointer border-none"
            >
              Built for Digital Heroes
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
