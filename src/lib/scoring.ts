import { ResumeData } from '@/types';

export interface ScoreDetails {
  atsScore: number;
  contactInfoScore: number;
  sectionsScore: number;
  qualityScore: number;
  breakdown: {
    email: number;
    phone: number;
    linkedin: number;
    github: number;
    portfolio: number;
    education: number;
    skillsSection: number;
    projects: number;
    experience: number;
    certifications: number;
    wordCount: number;
    keywords: number;
  };
  strength: 'Beginner' | 'Intermediate' | 'Strong' | 'Excellent';
}

/**
 * Calculates the ATS Score out of 100 based on strict deterministic rules
 */
export function calculateAtsScore(resume: ResumeData): ScoreDetails {
  // 1. Contact Information (Max 25 pts)
  const emailScore = resume.contactInfo.email ? 5 : 0;
  const phoneScore = resume.contactInfo.phone ? 5 : 0;
  const linkedinScore = resume.contactInfo.linkedin ? 5 : 0;
  const githubScore = resume.contactInfo.github ? 5 : 0;
  const portfolioScore = resume.contactInfo.portfolio ? 5 : 0;
  const contactInfoScore = emailScore + phoneScore + linkedinScore + githubScore + portfolioScore;

  // 2. Resume Sections (Max 55 pts)
  const educationScore = resume.sections.education ? 10 : 0;
  const skillsSecScore = resume.sections.skills ? 10 : 0;
  const projectsScore = resume.sections.projects ? 15 : 0;
  const experienceScore = resume.sections.experience ? 15 : 0;
  const certificationsScore = resume.sections.certifications ? 5 : 0;
  const sectionsScore = educationScore + skillsSecScore + projectsScore + experienceScore + certificationsScore;

  // 3. Resume Quality (Max 20 pts)
  // Proper word count = 5 pts (sweet spot is 300 to 1000 words for normal resumes)
  let wordCountScore = 0;
  const wc = resume.stats.wordCount;
  if (wc >= 400 && wc <= 1000) {
    wordCountScore = 5;
  } else if ((wc >= 200 && wc < 400) || (wc > 1000 && wc <= 1500)) {
    wordCountScore = 3;
  } else if (wc > 0) {
    wordCountScore = 1;
  }

  // Technical keywords = 15 pts (max)
  // Score based on how many standard tech keywords were successfully parsed
  let keywordsScore = 0;
  const sc = resume.stats.skillsCount;
  if (sc >= 12) {
    keywordsScore = 15;
  } else if (sc >= 8) {
    keywordsScore = 10;
  } else if (sc >= 4) {
    keywordsScore = 5;
  } else if (sc >= 1) {
    keywordsScore = 2;
  }
  const qualityScore = wordCountScore + keywordsScore;

  // Total Score
  const atsScore = contactInfoScore + sectionsScore + qualityScore;

  // Strength Indicator
  let strength: 'Beginner' | 'Intermediate' | 'Strong' | 'Excellent' = 'Beginner';
  if (atsScore >= 85) {
    strength = 'Excellent';
  } else if (atsScore >= 70) {
    strength = 'Strong';
  } else if (atsScore >= 50) {
    strength = 'Intermediate';
  }

  return {
    atsScore,
    contactInfoScore,
    sectionsScore,
    qualityScore,
    breakdown: {
      email: emailScore,
      phone: phoneScore,
      linkedin: linkedinScore,
      github: githubScore,
      portfolio: portfolioScore,
      education: educationScore,
      skillsSection: skillsSecScore,
      projects: projectsScore,
      experience: experienceScore,
      certifications: certificationsScore,
      wordCount: wordCountScore,
      keywords: keywordsScore
    },
    strength
  };
}
