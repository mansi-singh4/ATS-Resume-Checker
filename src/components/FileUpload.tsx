'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { validateUploadedFile } from '@/lib/security';
import { extractTextFromPdf } from '@/lib/pdf-extractor';
import { parseResumeText } from '@/lib/parser';
import { ResumeData } from '@/types';

interface FileUploadProps {
  onParseSuccess: (data: ResumeData) => void;
  onParseError: (err: string) => void;
  onReset: () => void;
  parsedData: ResumeData | null;
}

export default function FileUpload({ onParseSuccess, onParseError, onReset, parsedData }: FileUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setErrorMsg('');
    onParseError('');
    setIsLoading(true);
    setProgress(15);
    
    // Validate file
    const validation = validateUploadedFile(file);
    if (!validation.isValid) {
      const err = validation.error || 'Invalid file.';
      setErrorMsg(err);
      onParseError(err);
      setIsLoading(false);
      return;
    }

    try {
      setProgress(40);
      // Extract text
      const extractedText = await extractTextFromPdf(file);
      setProgress(75);
      
      // Parse structured details
      const parsed = parseResumeText(extractedText);
      setProgress(100);
      
      setTimeout(() => {
        onParseSuccess(parsed);
        setIsLoading(false);
      }, 300);
    } catch (err: any) {
      console.error(err);
      const errMsg = err.message || 'An error occurred while parsing the resume.';
      setErrorMsg(errMsg);
      onParseError(errMsg);
      setIsLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value && e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl transition-all duration-300 hover:border-slate-700/80">
      <h2 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 text-sm font-semibold">1</span>
        Upload Resume PDF
      </h2>

      {!parsedData && !isLoading ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={handleButtonClick}
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all duration-300 ${
            isDragActive 
              ? 'border-teal-500 bg-teal-500/5 shadow-[0_0_15px_rgba(20,184,166,0.1)]' 
              : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-950/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="p-4 bg-slate-900 rounded-full text-slate-400 mb-4 transition-transform duration-300 hover:scale-110">
            <UploadCloud className="w-8 h-8 text-teal-400" />
          </div>
          <p className="text-slate-200 font-semibold text-center mb-1">
            Drag & drop your resume here, or <span className="text-teal-400 hover:underline">browse</span>
          </p>
          <p className="text-slate-500 text-xs text-center">
            Supports PDF files only (Maximum 5MB)
          </p>
        </div>
      ) : null}

      {isLoading && (
        <div className="flex flex-col items-center justify-center p-8 bg-slate-950/40 border border-slate-800 rounded-xl">
          <div className="w-12 h-12 border-4 border-slate-800 border-t-teal-500 rounded-full animate-spin mb-4" />
          <p className="text-slate-300 font-medium mb-2">Extracting resume text...</p>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden max-w-xs">
            <div 
              className="bg-teal-500 h-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-slate-500 text-xs mt-1">{progress}%</span>
        </div>
      )}

      {parsedData && !isLoading && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-teal-500/5 border border-teal-500/20 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-500/10 text-teal-400 rounded-lg">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-slate-200 font-medium text-sm">Resume Loaded Successfully</p>
                <p className="text-slate-400 text-xs">{parsedData.contactInfo.name || 'Applicant'} Resume PDF</p>
              </div>
            </div>
            <button
              onClick={onReset}
              className="text-xs font-semibold px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-slate-100 rounded-lg transition-colors border border-slate-700"
            >
              Change File
            </button>
          </div>

          {/* Collapsible Text Preview */}
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/20">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="w-full flex items-center justify-between px-4 py-3 bg-slate-950/40 text-slate-300 hover:text-slate-100 hover:bg-slate-950/60 transition-colors text-sm font-medium"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-400" />
                <span>Extracted Resume Text Preview</span>
              </div>
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>

            {showPreview && (
              <div className="p-4 border-t border-slate-800 max-h-48 overflow-y-auto">
                <pre className="text-slate-400 text-xs font-mono whitespace-pre-wrap leading-relaxed select-all">
                  {parsedData.text}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="mt-4 flex items-start gap-3 p-3 bg-red-500/5 border border-red-500/20 rounded-xl text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Parsing Error</p>
            <p className="text-xs text-red-400/90">{errorMsg}</p>
          </div>
        </div>
      )}
    </div>
  );
}
