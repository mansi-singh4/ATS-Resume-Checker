'use client';

import React, { useState } from 'react';
import { Briefcase, Sparkles, ChevronDown, Check } from 'lucide-react';
import { sanitizeInputText } from '@/lib/security';

interface JobDescriptionInputProps {
  onAnalyze: (jdText: string) => void;
  isLoading: boolean;
  isDisabled: boolean;
}

const TEMPLATES = [
  {
    title: 'Frontend Developer',
    text: `Job Description: Frontend Engineer (React/TypeScript)

Responsibilities:
• Develop responsive, accessible web interfaces using React.js and Next.js.
• Write clean, maintainable code using TypeScript.
• Collaborate with designers to implement clean UI mockups using Tailwind CSS.
• Optimize application performance and ensure high SEO standards.

Requirements:
• Experience with React, Next.js, HTML, CSS, JavaScript, and TypeScript.
• Proficiency in styling with Tailwind CSS and Git for version control.
• Experience with cloud deployments on Vercel or AWS.
• Knowledge of writing unit tests.`
  },
  {
    title: 'Full Stack Engineer',
    text: `Job Description: Full Stack Developer (Node/PostgreSQL)

Responsibilities:
• Design and build secure, scalable backend REST APIs using Node.js and Express.
• Develop interactive client dashboards using React and Tailwind CSS.
• Integrate database models using Prisma ORM with PostgreSQL.
• Implement continuous integration and deployment pipelines using GitHub Actions.

Requirements:
• Strong skills in JavaScript, TypeScript, Node.js, Express, and REST APIs.
• Solid understanding of databases (PostgreSQL, MongoDB, SQL).
• Experience with Git, GitHub, Docker, and Firebase.
• Familiarity with serverless deployments on AWS and Vercel.`
  },
  {
    title: 'Backend Developer',
    text: `Job Description: Backend Software Engineer (Node/AWS)

Responsibilities:
• Build microservices and maintain server architectures using Node.js.
• Design, query, and optimize SQL/PostgreSQL databases.
• Deploy serverless applications on AWS and set up monitoring dashboards.
• Manage API gateways, authentication flows, and Docker containers.

Requirements:
• Advanced experience with Python, Node.js, and SQL.
• Deep knowledge of database engines (MySQL, PostgreSQL, MongoDB).
• Hands-on cloud experience with AWS, Docker, Kubernetes, and Git.
• Experience designing scalable GraphQL and REST APIs.`
  }
];

export default function JobDescriptionInput({ onAnalyze, isLoading, isDisabled }: JobDescriptionInputProps) {
  const [text, setText] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);

  const handleTemplateSelect = (templateText: string) => {
    setText(templateText);
    setShowTemplates(false);
  };

  const handleAnalyzeClick = () => {
    const sanitizedText = sanitizeInputText(text);
    onAnalyze(sanitizedText);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  return (
    <div className="w-full bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl transition-all duration-300 hover:border-slate-700/80">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 text-sm font-semibold">2</span>
          Job Description (Optional)
        </h2>

        {/* Template Selector Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowTemplates(!showTemplates)}
            disabled={isLoading || isDisabled}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold text-slate-300 hover:text-slate-100 border border-slate-700 rounded-lg transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
            <span>Load Quick Template</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          
          {showTemplates && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-950/95 backdrop-blur-md border border-slate-800 rounded-lg shadow-2xl z-20 py-1 divide-y divide-slate-900">
              {TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.title}
                  type="button"
                  onClick={() => handleTemplateSelect(tmpl.text)}
                  className="w-full text-left px-4 py-2 text-xs text-slate-400 hover:text-teal-300 hover:bg-teal-500/5 transition-colors flex items-center justify-between"
                >
                  <span>{tmpl.title}</span>
                  {text === tmpl.text && <Check className="w-3.5 h-3.5 text-teal-400" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste the Job Description here (responsibilities, required tools, technologies, etc.) to analyze matching scores..."
          disabled={isLoading || isDisabled}
          className="w-full h-44 bg-slate-950/40 text-slate-200 border border-slate-800 rounded-xl p-4 text-sm placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all font-sans leading-relaxed resize-none disabled:opacity-50"
        />
        {text && (
          <button
            type="button"
            onClick={() => setText('')}
            className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 text-xs px-2 py-1 bg-slate-900/60 hover:bg-slate-900 rounded-md border border-slate-800 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex gap-4 text-xs text-slate-500 font-mono">
          <span>Words: {wordCount}</span>
          <span>Characters: {charCount}</span>
        </div>

        <button
          onClick={handleAnalyzeClick}
          disabled={isLoading || isDisabled}
          className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 text-slate-950 font-bold rounded-xl shadow-[0_0_15px_rgba(20,184,166,0.15)] hover:shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all flex items-center justify-center gap-2 group disabled:shadow-none"
        >
          <Briefcase className="w-4 h-4 text-slate-950 group-hover:animate-bounce" />
          <span>{isLoading ? 'Analyzing Resume...' : 'Analyze Match & Score'}</span>
        </button>
      </div>
    </div>
  );
}
