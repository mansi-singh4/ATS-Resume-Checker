'use client';

import React, { useState } from 'react';
import { Download, FileDown } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { AnalysisResult, ResumeData } from '@/types';

interface ExportReportButtonProps {
  result: AnalysisResult;
  resumeData: ResumeData;
  hasJd: boolean;
}

export default function ExportReportButton({ result, resumeData, hasJd }: ExportReportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePdf = async () => {
    setIsGenerating(true);

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const primaryColor = [15, 23, 42]; // Slate 900
      const secondaryColor = [20, 184, 166]; // Teal 500
      const lightBg = [248, 250, 252]; // Slate 50
      const borderColor = [226, 232, 240]; // Slate 200
      const darkText = [51, 65, 85]; // Slate 700

      // --- PAGE 1: Header & Summary ---
      // Primary Banner
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, 210, 40, 'F');

      // Title
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text('ATS RESUME AUDIT REPORT', 15, 18);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('LOCAL DETERMINISTIC PARSING ENGINE • PRO REPORT', 15, 25);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 150, 25);

      // Candidate name & score card
      doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
      doc.rect(15, 48, 180, 25, 'F');
      doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
      doc.rect(15, 48, 180, 25);

      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('CANDIDATE INFORMATION', 20, 54);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Name: ${resumeData.contactInfo.name || 'Applicant'}`, 20, 60);
      doc.text(`Email: ${resumeData.contactInfo.email || 'Not detected'}`, 20, 65);
      doc.text(`Phone: ${resumeData.contactInfo.phone || 'Not detected'}`, 20, 70);

      // Score block on the right
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(145, 48, 50, 25, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('ATS RATING', 150, 54);
      doc.setFontSize(18);
      doc.text(`${result.atsScore} / 100`, 150, 62);
      doc.setFontSize(8);
      doc.text(`Strength: ${result.strengthIndicator}`, 150, 68);

      // Section check statuses
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('RESUME SECTION STATUS', 15, 83);
      doc.line(15, 85, 195, 85);

      let yPos = 92;
      const sectionKeys = Object.entries(resumeData.sections);
      
      // Print verified sections in 2 columns
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      sectionKeys.forEach(([sec, present], index) => {
        const col = index % 2;
        const xOffset = col * 90 + 20;
        const row = Math.floor(index / 2);
        const yOffset = yPos + row * 8;
        
        doc.setFillColor(present ? 204 : 254, present ? 251 : 226, present ? 241 : 226); // Teal / Red background
        doc.circle(xOffset - 4, yOffset - 1, 2.5, 'F');
        doc.setTextColor(present ? 15 : 153, present ? 118 : 27, present ? 110 : 27); // Colors
        doc.setFont('helvetica', 'bold');
        doc.text(present ? 'Y' : 'N', xOffset - 5, yOffset - 0.2);

        doc.setTextColor(darkText[0], darkText[1], darkText[2]);
        doc.setFont('helvetica', 'normal');
        doc.text(`${sec.toUpperCase()}`, xOffset + 2, yOffset);
      });

      // Stats
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('RESUME STATISTICS', 15, 122);
      doc.line(15, 124, 195, 124);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Word Count: ${resumeData.stats.wordCount}`, 20, 131);
      doc.text(`Skills Found: ${resumeData.stats.skillsCount}`, 20, 137);
      doc.text(`Projects Count: ${resumeData.stats.projectsCount}`, 110, 131);
      doc.text(`Experience Entries: ${resumeData.stats.experienceCount}`, 110, 137);

      // JD Match section if JD is provided
      if (hasJd) {
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('JOB DESCRIPTION MATCH METRICS', 15, 152);
        doc.line(15, 154, 195, 154);

        doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
        doc.rect(15, 158, 180, 22, 'F');
        doc.rect(15, 158, 180, 22);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text('Overall JD Match:', 20, 164);
        doc.text('Skills Match:', 20, 170);
        doc.text('Experience Match:', 110, 164);
        doc.text('Project Relevance Match:', 110, 170);

        doc.setFont('helvetica', 'normal');
        doc.text(`${result.jobMatchScore}%`, 55, 164);
        doc.text(`${result.skillsMatch.percentage}%`, 55, 170);
        doc.text(`${result.experienceAnalysis.score}%`, 155, 164);
        doc.text(`${result.keywordsMatch.score}%`, 155, 170);

        // Skills comparison
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('SKILLS MATCH DETAIL', 15, 192);
        doc.line(15, 194, 195, 194);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(20, 184, 166);
        doc.text(`Matched Skills (${result.skillsMatch.matched.length}):`, 15, 201);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(darkText[0], darkText[1], darkText[2]);
        const matchedSkillsText = result.skillsMatch.matched.slice(0, 10).join(', ') + 
          (result.skillsMatch.matched.length > 10 ? '...' : '');
        doc.text(matchedSkillsText || 'None', 15, 206, { maxWidth: 180 });

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(239, 68, 68);
        doc.text(`Missing Skills (${result.skillsMatch.missing.length}):`, 15, 215);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(darkText[0], darkText[1], darkText[2]);
        const missingSkillsText = result.skillsMatch.missing.slice(0, 10).join(', ') + 
          (result.skillsMatch.missing.length > 10 ? '...' : '');
        doc.text(missingSkillsText || 'None', 15, 220, { maxWidth: 180 });
      }

      // Add a page break for Recommendations
      doc.addPage();
      
      // Page 2 header banner (shorter)
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, 210, 15, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('ATS RESUME AUDIT • RECOMMENDATIONS', 15, 10);

      // Recommendations list
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFontSize(12);
      doc.text('ACTIONABLE IMPROVEMENT SUGGESTIONS', 15, 28);
      doc.line(15, 30, 195, 30);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(darkText[0], darkText[1], darkText[2]);
      
      let recY = 38;
      result.recommendations.forEach((rec, index) => {
        const itemText = `${index + 1}. ${rec}`;
        const lines = doc.splitTextToSize(itemText, 175);
        doc.text(lines, 18, recY);
        recY += lines.length * 6 + 2;
      });

      // Footer notice
      doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
      doc.line(15, 275, 195, 275);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184); // Slate 400
      doc.text('CONFIDENTIAL RESUME ANALYSIS REPORT • BUILT BY MANSI SINGH FOR DIGITAL HEROES', 15, 281);
      doc.text('https://digitalheroesco.com', 157, 281);

      // Save PDF
      const filename = `${(resumeData.contactInfo.name || 'Resume').replace(/\s+/g, '_')}_ATS_Report.pdf`;
      doc.save(filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('An error occurred while generating the PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={generatePdf}
      disabled={isGenerating}
      className="px-5 py-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-700 disabled:opacity-50 text-slate-200 hover:text-slate-100 font-semibold text-xs rounded-lg border border-slate-750 flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer disabled:cursor-not-allowed"
    >
      {isGenerating ? (
        <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-slate-100 rounded-full animate-spin" />
      ) : (
        <FileDown className="w-4 h-4 text-teal-400" />
      )}
      <span>{isGenerating ? 'Compiling Report...' : 'Download PDF Report'}</span>
    </button>
  );
}
