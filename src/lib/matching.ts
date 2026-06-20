import { ResumeData, JobDescriptionData, AnalysisResult, ProjectRelevanceItem } from '@/types';
import { extractSkillsFromText } from './skill-db';
import { calculateAtsScore } from './scoring';

// Predefined set of common industry keywords to look for in Job Descriptions
const INDUSTRY_KEYWORDS = [
  'agile', 'scrum', 'testing', 'scalability', 'architecture', 'security',
  'collaboration', 'deployment', 'pipeline', 'cloud', 'optimization',
  'monitoring', 'design', 'development', 'debugging', 'ci/cd', 'git',
  'communication', 'leadership', 'analytics', 'automation', 'compliance',
  'microservices', 'performance', 'database', 'rest api', 'graphql'
];

/**
 * Parses the raw Job Description text to identify skills and industry keywords
 */
export function parseJobDescription(text: string): JobDescriptionData {
  if (!text.trim()) {
    return { text: '', skills: [], technologies: [], responsibilities: [], requirements: [] };
  }

  const skills = extractSkillsFromText(text);
  
  // Extract industry keywords
  const foundKeywords = new Set<string>();
  INDUSTRY_KEYWORDS.forEach(kw => {
    const regex = new RegExp(`\\b${kw}\\b`, 'i');
    if (regex.test(text)) {
      foundKeywords.add(kw);
    }
  });

  // Extract responsibilities (split by bullet points or lines containing action verbs)
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const responsibilities: string[] = [];
  const requirements: string[] = [];

  let currentSection: 'resp' | 'req' | null = null;
  const respKeywords = /\b(?:responsibilities|what you will do|role|tasks|duties|expectations)\b/i;
  const reqKeywords = /\b(?:requirements|qualifications|what you need|skills required|experience required|must have)\b/i;

  lines.forEach(line => {
    if (line.length < 40 && respKeywords.test(line)) {
      currentSection = 'resp';
      return;
    }
    if (line.length < 40 && reqKeywords.test(line)) {
      currentSection = 'req';
      return;
    }

    if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
      const cleanLine = line.replace(/^[•\-\*\s]+/, '');
      if (currentSection === 'resp') {
        responsibilities.push(cleanLine);
      } else if (currentSection === 'req') {
        requirements.push(cleanLine);
      }
    }
  });

  // Fallbacks if lists are empty
  if (responsibilities.length === 0) {
    responsibilities.push(...lines.slice(0, 5).filter(l => l.length > 30));
  }
  if (requirements.length === 0) {
    requirements.push(...lines.slice(5, 10).filter(l => l.length > 30));
  }

  return {
    text,
    skills,
    technologies: skills,
    responsibilities: responsibilities.slice(0, 8),
    requirements: requirements.slice(0, 8)
  };
}

/**
 * Matches a parsed resume against a job description
 */
export function matchResumeWithJd(resume: ResumeData, jd: JobDescriptionData): AnalysisResult {
  const atsDetails = calculateAtsScore(resume);
  
  // Baseline check: No Job Description provided
  if (!jd.text || !jd.text.trim()) {
    const recommendations: string[] = [];
    
    if (!resume.contactInfo.github) {
      recommendations.push('Add a GitHub profile link to showcase your source code and repositories.');
    }
    if (!resume.contactInfo.portfolio) {
      recommendations.push('Include a personal portfolio or website link to display live demos of your work.');
    }
    if (!resume.sections.certifications) {
      recommendations.push('Add a certifications or courses section to validate your ongoing technical education.');
    }
    if (resume.stats.wordCount < 400) {
      recommendations.push('Your resume is relatively short. Expand on your project and work descriptions to provide more context.');
    }
    if (resume.stats.wordCount > 1000) {
      recommendations.push('Your resume exceeds 1000 words. Condense descriptions and focus on high-impact bullet points.');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Great job! Your resume has a strong structure. Paste a Job Description to check keyword matching.');
    }

    return {
      atsScore: atsDetails.atsScore,
      scoreBreakdown: {
        contactInfo: atsDetails.contactInfoScore,
        sections: atsDetails.sectionsScore,
        quality: atsDetails.qualityScore
      },
      breakdown: atsDetails.breakdown,
      jobMatchScore: 0,
      skillsMatch: {
        matched: [],
        missing: [],
        percentage: 0
      },
      keywordsMatch: {
        matched: [],
        missing: [],
        percentage: 0,
        score: 0
      },
      projectRelevance: [],
      experienceAnalysis: {
        strengths: [],
        gaps: [],
        score: 0
      },
      strengthIndicator: atsDetails.strength,
      recommendations
    };
  }

  // 1. Skills Match
  const jdSkillsSet = new Set(jd.skills.map(s => s.toLowerCase()));
  const resumeSkillsSet = new Set(resume.skills.map(s => s.toLowerCase()));
  
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  // Match canonical names
  jd.skills.forEach(skill => {
    if (resumeSkillsSet.has(skill.toLowerCase())) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  const skillsMatchPercentage = jd.skills.length > 0 
    ? Math.round((matchedSkills.length / jd.skills.length) * 100)
    : 100;

  // 2. Keyword Match (incorporate industry terms)
  const jdKeywords = Array.from(new Set([
    ...jd.skills,
    ...INDUSTRY_KEYWORDS.filter(kw => {
      const regex = new RegExp(`\\b${kw}\\b`, 'i');
      return regex.test(jd.text);
    })
  ]));

  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  jdKeywords.forEach(kw => {
    const regex = new RegExp(`\\b${kw}\\b`, 'i');
    if (regex.test(resume.text)) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  const keywordMatchPercentage = jdKeywords.length > 0
    ? Math.round((matchedKeywords.length / jdKeywords.length) * 100)
    : 100;

  // 3. Project Relevance Analysis (Algorithmic)
  const projectRelevance: ProjectRelevanceItem[] = resume.projects.map(project => {
    const projectText = `${project.title} ${project.description} ${project.technologies.join(' ')}`;
    const projectSkills = extractSkillsFromText(projectText);
    const matchedTech = projectSkills.filter(s => jdSkillsSet.has(s.toLowerCase()));
    
    let relevance: 'High' | 'Medium' | 'Low' = 'Low';
    let reason = '';

    if (matchedTech.length >= 2) {
      relevance = 'High';
      reason = `Demonstrates direct technical alignment with the JD, utilizing key required technologies: ${matchedTech.join(', ')}.`;
    } else if (matchedTech.length >= 1) {
      relevance = 'Medium';
      reason = `Partial overlap with required job skills, highlighting: ${matchedTech.join(', ')}. Highlight more JD keywords.`;
    } else {
      relevance = 'Low';
      reason = 'No direct technology overlap found with the JD requirements. Consider rewriting the description to mention relevant tools/frameworks.';
    }

    return {
      title: project.title,
      relevance,
      reason,
      technologies: projectSkills,
      matchedTech
    };
  });

  const projectRelevanceScore = projectRelevance.length > 0
    ? Math.round(
        projectRelevance.reduce((acc, item) => {
          const val = item.relevance === 'High' ? 100 : item.relevance === 'Medium' ? 60 : 20;
          return acc + val;
        }, 0) / projectRelevance.length
      )
    : 0;

  // 4. Experience Analysis
  const expText = resume.experience.map(e => `${e.role} ${e.company} ${e.description}`).join('\n');
  const expSkills = extractSkillsFromText(expText);
  
  const strengths: string[] = [];
  const gaps: string[] = [];

  jd.skills.forEach(skill => {
    const isMatched = expSkills.some(es => es.toLowerCase() === skill.toLowerCase());
    if (isMatched) {
      strengths.push(`Proven experience with ${skill} in professional roles.`);
    } else {
      gaps.push(`Lacks clear mention of ${skill} in job descriptions.`);
    }
  });

  const displayStrengths = strengths.slice(0, 5);
  const displayGaps = gaps.slice(0, 5);

  if (displayStrengths.length === 0 && resume.experience.length > 0) {
    displayStrengths.push('Professional history section is present and structured.');
  }
  if (displayGaps.length === 0 && missingSkills.length > 0) {
    displayGaps.push(`Consider detailing experience in: ${missingSkills.slice(0, 3).join(', ')}.`);
  }

  const expMatchScore = jd.skills.length > 0
    ? Math.round((strengths.length / jd.skills.length) * 100)
    : 100;

  // 5. Recommendations
  const recommendations: string[] = [];
  
  if (!resume.contactInfo.github) {
    recommendations.push('Add a GitHub profile link to showcase your source code and repositories.');
  }
  if (!resume.contactInfo.portfolio) {
    recommendations.push('Include a personal portfolio or website link to display live demos of your work.');
  }
  if (!resume.sections.certifications) {
    recommendations.push('Add a certifications or courses section to validate your ongoing technical education.');
  }
  if (resume.stats.wordCount < 400) {
    recommendations.push('Your resume is relatively short. Expand on your project and work descriptions to provide more context.');
  }
  if (resume.stats.wordCount > 1000) {
    recommendations.push('Your resume exceeds 1000 words. Condense descriptions and focus on high-impact bullet points.');
  }
  
  missingSkills.slice(0, 4).forEach(skill => {
    recommendations.push(`Incorporate experience or usage of "${skill}" if you have worked with it previously.`);
  });

  if (recommendations.length === 0) {
    recommendations.push('Great job! Your resume aligns very well. Consider adding quantifiable metrics (e.g., % improvements or speed increases) to projects.');
  }

  // 6. Overall Match Score (weighted average)
  const jobMatchScore = Math.round(
    (skillsMatchPercentage * 0.5) +
    (expMatchScore * 0.25) +
    (projectRelevanceScore * 0.25)
  );

  return {
    atsScore: atsDetails.atsScore,
    scoreBreakdown: {
      contactInfo: atsDetails.contactInfoScore,
      sections: atsDetails.sectionsScore,
      quality: atsDetails.qualityScore
    },
    breakdown: atsDetails.breakdown,
    jobMatchScore,
    skillsMatch: {
      matched: matchedSkills,
      missing: missingSkills,
      percentage: skillsMatchPercentage
    },
    keywordsMatch: {
      matched: matchedKeywords,
      missing: missingKeywords,
      percentage: keywordMatchPercentage,
      score: keywordMatchPercentage
    },
    projectRelevance,
    experienceAnalysis: {
      strengths: displayStrengths,
      gaps: displayGaps,
      score: expMatchScore
    },
    strengthIndicator: atsDetails.strength,
    recommendations
  };
}
