import { ResumeData, ContactInfo, SectionChecks, ResumeProject, ResumeExperience, ResumeStats } from '@/types';
import { extractSkillsFromText } from './skill-db';

/**
 * Escapes characters for HTML output safely to prevent XSS
 */
export function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Normalizes text line endings
 */
export function normalizeText(text: string): string {
  return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

/**
 * Parses raw resume text into a structured ResumeData object
 */
export function parseResumeText(rawText: string): ResumeData {
  const text = normalizeText(rawText);
  
  // 1. Extract Contact Info
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const linkedinRegex = /linkedin\.com\/in\/[a-zA-Z0-9-_\/]+/i;
  const githubRegex = /github\.com\/[a-zA-Z0-9-_\/]+/i;
  // Match URLs that are not LinkedIn or GitHub
  const urlRegex = /(https?:\/\/[^\s]+)/gi;

  const emailMatch = text.match(emailRegex);
  const phoneMatch = text.match(phoneRegex);
  const linkedinMatch = text.match(linkedinRegex);
  const githubMatch = text.match(githubRegex);
  
  let portfolio = '';
  const allUrls = text.match(urlRegex) || [];
  for (const url of allUrls) {
    if (!url.includes('linkedin.com') && !url.includes('github.com')) {
      portfolio = url.replace(/[.,;:]$/, ''); // Clean trailing punctuation
      break;
    }
  }

  // Guess name (usually in the first few lines of the resume)
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  let name = 'Applicant';
  if (lines.length > 0) {
    // If the first line is short and doesn't look like an email or link, assume it's the name
    if (lines[0].length < 40 && !lines[0].includes('@') && !lines[0].includes('http')) {
      name = lines[0];
    }
  }

  const contactInfo: ContactInfo = {
    name,
    email: emailMatch ? emailMatch[0] : '',
    phone: phoneMatch ? phoneMatch[0] : '',
    linkedin: linkedinMatch ? (linkedinMatch[0].startsWith('http') ? linkedinMatch[0] : `https://${linkedinMatch[0]}`) : '',
    github: githubMatch ? (githubMatch[0].startsWith('http') ? githubMatch[0] : `https://${githubMatch[0]}`) : '',
    portfolio: portfolio
  };

  // 2. Identify Sections & Segment Text
  const sectionKeywords = {
    education: /\b(?:education|academic|university|degree|college|school)\b/i,
    skills: /\b(?:skills|technologies|proficiencies|languages|expertise|core competencies)\b/i,
    projects: /\b(?:projects|personal projects|key projects|academic projects)\b/i,
    experience: /\b(?:experience|employment|work history|professional background|career history)\b/i,
    certifications: /\b(?:certifications|certificates|courses|licenses|credentials)\b/i,
    achievements: /\b(?:achievements|awards|honors|accomplishments)\b/i
  };

  const isSectionHeader = (line: string): keyof typeof sectionKeywords | null => {
    const cleanLine = line.trim().replace(/^[•\-\*\s▪◦\d\.\)]+/, '').replace(/[:\s]+$/, '').toLowerCase();
    if (cleanLine.length > 35 || cleanLine.length < 2) return null;
    
    const headers = {
      education: /^(?:education|academic(?:s|\s+background|\s+history|\s+credentials|\s+details|\s+qualification)?|university|degree[s]?|college|school[s]?)$/i,
      skills: /^(?:skills|technical\s+skills|technologies|proficiencies|languages|expertise|core\s+competencies|key\s+skills|skills\s*&\s*technologies|tools|skills\s*&\s*tools)$/i,
      projects: /^(?:projects|personal\s+projects|key\s+projects|academic\s+projects|selected\s+projects|technical\s+projects|featured\s+projects)$/i,
      experience: /^(?:experience|work\s+experience|professional\s+experience|employment|work\s+history|professional\s+background|career\s+history|experience\s+history|professional\s+history)$/i,
      certifications: /^(?:certifications|certificates|courses|licenses|credentials|professional\s+certifications)$/i,
      achievements: /^(?:achievements|awards|honors|accomplishments|awards\s*&\s*honors)$/i
    };

    for (const [sec, regex] of Object.entries(headers)) {
      if (regex.test(cleanLine)) {
        return sec as keyof typeof sectionKeywords;
      }
    }
    return null;
  };

  const sections: SectionChecks = {
    education: false,
    skills: false,
    projects: false,
    experience: false,
    certifications: false,
    achievements: false
  };

  // Check presence of headers
  for (const line of lines) {
    const matchedSec = isSectionHeader(line);
    if (matchedSec) {
      sections[matchedSec] = true;
    }
  }

  // Fallback check: if we cannot find headers but find keywords in general text
  if (!sections.skills && extractSkillsFromText(text).length > 0) {
    sections.skills = true;
  }

  // 3. Segment sections and parse content
  const sectionTexts: Record<string, string[]> = {
    education: [],
    skills: [],
    projects: [],
    experience: [],
    certifications: [],
    achievements: []
  };

  let currentSection: keyof typeof sectionTexts | null = null;

  for (const line of lines) {
    const matchedSec = isSectionHeader(line);
    if (matchedSec) {
      currentSection = matchedSec;
      continue;
    }

    if (currentSection) {
      sectionTexts[currentSection].push(line);
    }
  }

  // 4. Extract detailed Skills
  const skills = extractSkillsFromText(text);

  // 5. Parse Projects
  const projects: ResumeProject[] = [];
  const projectLines = sectionTexts.projects.map(l => l.trim()).filter(l => l.length > 0);
  
  if (projectLines.length > 0) {
    const ACTION_VERBS = /^(?:developed|designed|built|implemented|created|led|managed|collaborated|configured|wrote|tested|integrated|optimized|structured|worked|assisted|maintained|enhanced|deployed|monitored|spearheaded|utilized|used|engineered|coordinated|resolved|produced|crafted|automated|delivered|facilitated|maximized|improved|established|executed)\b/i;
    
    let currentProject: { title: string; lines: string[] } | null = null;
    
    for (let index = 0; index < projectLines.length; index++) {
      const line = projectLines[index];
      const cleanLine = line.replace(/^[•\-\*\s▪◦\d\.\)]+/, '').trim();
      if (!cleanLine) continue;

      const startsWithBullet = /^[•\-\*▪◦]/.test(line);
      const startsWithActionVerb = ACTION_VERBS.test(cleanLine);
      const hasSeparator = line.includes('|') || line.includes('—') || line.includes('–') || line.includes(' - ');
      const hasParentheses = /\(.*?\)/.test(line);

      const isHeader = index === 0 || 
        (startsWithBullet && !startsWithActionVerb) || 
        (!startsWithActionVerb && cleanLine.length < 50 && (hasSeparator || hasParentheses)) ||
        (!startsWithActionVerb && cleanLine.length < 40 && !/[.:;]$/.test(cleanLine));

      if (isHeader) {
        if (currentProject) {
          const desc = currentProject.lines.join(' ');
          projects.push({
            title: currentProject.title,
            technologies: extractSkillsFromText(currentProject.title + ' ' + desc),
            description: desc || currentProject.title
          });
        }
        currentProject = {
          title: cleanLine.replace(/^[:\|\-\s—–]+|[:\|\-\s—–]+$/g, '').trim(),
          lines: []
        };
      } else {
        if (currentProject) {
          currentProject.lines.push(line);
        } else {
          currentProject = {
            title: cleanLine.replace(/^[:\|\-\s—–]+|[:\|\-\s—–]+$/g, '').trim(),
            lines: []
          };
        }
      }
    }

    if (currentProject) {
      const desc = currentProject.lines.join(' ');
      projects.push({
        title: currentProject.title,
        technologies: extractSkillsFromText(currentProject.title + ' ' + desc),
        description: desc || currentProject.title
      });
    }
  }

  // Fallback if projects is empty but sections.projects is true
  if (projects.length === 0 && sections.projects) {
    const projectContent = sectionTexts.projects.join('\n');
    projects.push({
      title: 'Project Details',
      technologies: extractSkillsFromText(projectContent),
      description: projectContent.substring(0, 500)
    });
  }

  // 6. Parse Experience
  const experience: ResumeExperience[] = [];
  const expLines = sectionTexts.experience.map(l => l.trim()).filter(l => l.length > 0);
  
  if (expLines.length > 0) {
    const ACTION_VERBS = /^(?:developed|designed|built|implemented|created|led|managed|collaborated|configured|wrote|tested|integrated|optimized|structured|worked|assisted|maintained|enhanced|deployed|monitored|spearheaded|utilized|used|engineered|coordinated|resolved|produced|crafted|automated|delivered|facilitated|maximized|improved|established|executed)\b/i;
    const dateRegex = /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\d{4})\s*(?:[-–—]|to)\s*(?:Present|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\d{4})/i;

    let currentExp: { role: string; company: string; duration: string; lines: string[] } | null = null;

    for (let index = 0; index < expLines.length; index++) {
      const line = expLines[index];
      const cleanLine = line.replace(/^[•\-\*\s▪◦\d\.\)]+/, '').trim();
      if (!cleanLine) continue;

      const startsWithBullet = /^[•\-\*▪◦]/.test(line);
      const startsWithActionVerb = ACTION_VERBS.test(cleanLine);
      const hasDate = dateRegex.test(line);

      const isHeader = index === 0 || hasDate || (startsWithBullet && !startsWithActionVerb);

      if (isHeader) {
        if (currentExp) {
          const desc = currentExp.lines.join(' ');
          experience.push({
            role: currentExp.role,
            company: currentExp.company,
            duration: currentExp.duration,
            description: desc || `${currentExp.role} at ${currentExp.company}`
          });
        }

        const dateMatch = line.match(dateRegex);
        const duration = dateMatch ? dateMatch[0] : 'Timeline not specified';
        let headerText = line.replace(dateRegex, '').replace(/^[•\-\*\s▪◦\d\.\)]+/, '').replace(/[:\s,]+$/, '').trim();
        
        let role = headerText;
        let company = 'Company / Organization';

        const separators = /\s+(?:at|@|\||-)\s+/i;
        if (separators.test(headerText)) {
          const parts = headerText.split(separators);
          if (parts.length >= 2) {
            role = parts[0].trim();
            company = parts[1].trim();
          }
        }

        currentExp = {
          role: role || `Role ${experience.length + 1}`,
          company: company,
          duration,
          lines: []
        };
      } else {
        if (currentExp) {
          currentExp.lines.push(line);
        } else {
          currentExp = {
            role: cleanLine,
            company: 'Company / Organization',
            duration: 'Timeline not specified',
            lines: []
          };
        }
      }
    }

    if (currentExp) {
      const desc = currentExp.lines.join(' ');
      experience.push({
        role: currentExp.role,
        company: currentExp.company,
        duration: currentExp.duration,
        description: desc || `${currentExp.role} at ${currentExp.company}`
      });
    }
  }

  if (experience.length === 0 && sections.experience) {
    const expContent = sectionTexts.experience.join('\n');
    experience.push({
      role: 'Professional Experience',
      company: 'Corporate Company',
      duration: 'Timeline Spec',
      description: expContent.substring(0, 500)
    });
  }

  // 7. Education, Certifications, Achievements list
  const education = sectionTexts.education;
  const certifications = sectionTexts.certifications;
  const achievements = sectionTexts.achievements;

  // 8. Calculate Stats
  const cleanWordText = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
  const words = cleanWordText.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  const charCount = text.length;

  const linksCount = [
    contactInfo.email,
    contactInfo.phone,
    contactInfo.linkedin,
    contactInfo.github,
    contactInfo.portfolio
  ].filter(link => link.length > 0).length;

  const stats: ResumeStats = {
    wordCount,
    charCount,
    skillsCount: skills.length,
    linksCount,
    projectsCount: projects.length,
    experienceCount: experience.length,
    certificationsCount: certifications.length
  };

  return {
    text: rawText,
    contactInfo,
    sections,
    skills,
    projects,
    experience,
    education,
    certifications,
    achievements,
    stats
  };
}
