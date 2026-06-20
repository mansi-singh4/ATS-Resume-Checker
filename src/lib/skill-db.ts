export interface SkillCategory {
  id: string;
  name: string;
  skills: string[];
}

export const SKILL_DATABASE: SkillCategory[] = [
  {
    id: 'frontend',
    name: 'Frontend Development',
    skills: [
      'React',
      'Next.js',
      'JavaScript',
      'TypeScript',
      'HTML',
      'CSS',
      'Tailwind',
      'Tailwind CSS',
      'Vue',
      'Vue.js',
      'Angular',
      'Svelte',
      'Redux',
      'Sass',
      'SCSS',
      'Webpack',
      'Vite',
      'Bootstrap',
      'jQuery'
    ]
  },
  {
    id: 'backend',
    name: 'Backend Development',
    skills: [
      'Node.js',
      'Node',
      'Express',
      'Express.js',
      'REST API',
      'REST APIs',
      'GraphQL',
      'Django',
      'Flask',
      'FastAPI',
      'Spring Boot',
      'NestJS',
      'ASP.NET',
      'Laravel',
      'gRPC',
      'Microservices'
    ]
  },
  {
    id: 'database',
    name: 'Database & ORM',
    skills: [
      'SQL',
      'PostgreSQL',
      'MongoDB',
      'MySQL',
      'Prisma',
      'Redis',
      'DynamoDB',
      'SQLite',
      'Oracle',
      'Cassandra',
      'Supabase',
      'Mongoose',
      'Firebase Firestore'
    ]
  },
  {
    id: 'tools',
    name: 'Tools, DevOps & Cloud',
    skills: [
      'Git',
      'GitHub',
      'Docker',
      'AWS',
      'Amazon Web Services',
      'Firebase',
      'Vercel',
      'Kubernetes',
      'Jenkins',
      'Terraform',
      'CI/CD',
      'GitLab',
      'Linux',
      'Heroku',
      'Netlify',
      'Google Cloud',
      'GCP',
      'Azure',
      'Nginx'
    ]
  },
  {
    id: 'programming',
    name: 'Programming Languages',
    skills: [
      'Python',
      'Java',
      'C++',
      'C',
      'Rust',
      'Ruby',
      'C#',
      'PHP',
      'Swift',
      'Kotlin',
      'Bash',
      'Shell',
      'Go',
      'Golang'
    ]
  }
];

// Flat array of all skills in their standard casing
export const ALL_SKILLS: string[] = SKILL_DATABASE.reduce<string[]>((acc, category) => {
  return [...acc, ...category.skills];
}, []);

// Normalize a skill name for robust matching (lowercase, strip spaces/dots)
export function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9+#]/g, '') // Keep alphanumeric, +, and # (important for C++, C#)
    .trim();
}

// Find matching technical skills in a block of text
export function extractSkillsFromText(text: string): string[] {
  if (!text) return [];
  
  const foundSkills = new Set<string>();
  
  // Use word boundaries or specific patterns for symbols
  ALL_SKILLS.forEach(skill => {
    let regex: RegExp;
    
    // For skills that end with symbols like C++ or C#
    if (skill.includes('+') || skill.includes('#')) {
      const escapedSkill = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      regex = new RegExp(`(?:\\b|\\s)${escapedSkill}(?:\\b|\\s|\\.|,|;|:|$)`, 'i');
    } else {
      // Normal skills, match whole word
      regex = new RegExp(`\\b${skill}\\b`, 'i');
    }
    
    if (regex.test(text)) {
      // Standardize to the canonical casing in our database
      foundSkills.add(skill);
    }
  });

  return Array.from(foundSkills);
}
