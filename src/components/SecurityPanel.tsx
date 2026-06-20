'use client';

import React from 'react';
import { ShieldCheck, Lock, EyeOff, ServerCrash, BugPlay } from 'lucide-react';

export default function SecurityPanel() {
  const securityChecks = [
    {
      title: 'Local Sandboxed Parsing',
      desc: 'All text extraction via pdf.js runs strictly in your browser. No files are uploaded to any backend database or server.',
      icon: <Lock className="w-4 h-4 text-teal-400" />
    },
    {
      title: 'Prompt Injection Immune',
      desc: 'Because this tool uses local deterministic algorithms instead of an AI model, it is immune to prompt injection attacks.',
      icon: <ServerCrash className="w-4 h-4 text-teal-400" />
    },
    {
      title: 'HTML & Script Sanitization',
      desc: 'All extracted and typed text is stripped of HTML tags and escaped before rendering to prevent Cross-Site Scripting (XSS).',
      icon: <ShieldCheck className="w-4 h-4 text-teal-400" />
    },
    {
      title: 'Strict File Type Verification',
      desc: 'Only authentic PDF byte layers under 5MB are accepted, rejecting malicious executable scripts or corrupted files.',
      icon: <BugPlay className="w-4 h-4 text-teal-400" />
    }
  ];

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl hover:border-slate-700/80 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-teal-450" />
          Security & Privacy Panel
        </h3>
        
        <span className="flex items-center gap-1 text-[10px] sm:text-xs font-mono font-bold text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2.5 py-1 rounded-full shadow-[0_0_10px_rgba(20,184,166,0.1)]">
          <EyeOff className="w-3.5 h-3.5" />
          100% Private (Local-Only)
        </span>
      </div>

      <p className="text-slate-500 text-xs mt-0.5 mb-6 leading-relaxed">
        This app uses **ATS Resume Checker Pro Offline Core**, executing rules-based heuristics in a local browser sandbox.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {securityChecks.map((check, index) => (
          <div 
            key={index}
            className="p-3 bg-slate-950/30 border border-slate-850/65 rounded-xl hover:border-slate-800 transition-colors flex items-start gap-3"
          >
            <div className="p-2 bg-slate-900 rounded-lg flex-shrink-0 mt-0.5 border border-slate-800">
              {check.icon}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200">{check.title}</h4>
              <p className="text-[10px] text-slate-550 leading-relaxed mt-1">{check.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
