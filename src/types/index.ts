export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export interface SectionChecks {
  education: boolean;
  skills: boolean;
  projects: boolean;
  experience: boolean;
  certifications: boolean;
  achievements: boolean;
}

export interface ResumeStats {
  wordCount: number;
  charCount: number;
  skillsCount: number;
  linksCount: number;
  projectsCount: number;
  experienceCount: number;
  certificationsCount: number;
}

export interface ResumeProject {
  title: string;
  technologies: string[];
  description: string;
}

export interface ResumeExperience {
  role: string;
  company: string;
  duration: string;
  description: string;
}

export interface ResumeData {
  text: string;
  contactInfo: ContactInfo;
  sections: SectionChecks;
  skills: string[];
  projects: ResumeProject[];
  experience: ResumeExperience[];
  education: string[];
  certifications: string[];
  achievements: string[];
  stats: ResumeStats;
}

export interface JobDescriptionData {
  text: string;
  skills: string[];
  technologies: string[];
  responsibilities: string[];
  requirements: string[];
}

export interface ProjectRelevanceItem {
  title: string;
  relevance: 'High' | 'Medium' | 'Low';
  reason: string;
  technologies: string[];
  matchedTech: string[];
}

export interface AnalysisResult {
  atsScore: number;
  scoreBreakdown: {
    contactInfo: number;    // Max 25
    sections: number;       // Max 55
    quality: number;        // Max 20
  };
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
  jobMatchScore: number;    // Overall Match %
  skillsMatch: {
    matched: string[];
    missing: string[];
    percentage: number;
  };
  keywordsMatch: {
    matched: string[];
    missing: string[];
    percentage: number;
    score: number;
  };
  projectRelevance: ProjectRelevanceItem[];
  experienceAnalysis: {
    strengths: string[];
    gaps: string[];
    score: number;
  };
  strengthIndicator: 'Beginner' | 'Intermediate' | 'Strong' | 'Excellent';
  recommendations: string[];
}
