# ATS Resume Checker Pro & Job Match Analyzer

**ATS Resume Checker Pro** is a high-performance, portfolio-grade, browser-based web application that audits resumes and analyzes job description alignments using deterministic algorithms. 

Operating **entirely in the user's browser**, this application requires **no external APIs, databases, keys, or server processes**, guaranteeing 100% data privacy and instant execution.

---

## Key Features

1. **PDF Resume Parser**: Reads and extracts plain text from resumes using `pdfjs-dist` inside a client-side sandbox.
2. **ATS Scoring Engine**: Generates a score out of 100 based on strict corporate recruitment guidelines:
   - **Contact Information (25 pts)**: Verifies presence of Email (+5), Phone (+5), LinkedIn (+5), GitHub (+5), and Portfolio (+5).
   - **Resume Sections (55 pts)**: Validates structural segments: Education (+10), Skills (+10), Projects (+15), Experience (+15), and Certifications (+5).
   - **Resume Quality (20 pts)**: Analyzes optimal word count range (+5) and technical keyword density (+15).
3. **Job Match Engine**: Extracted skills are matched against the target Job Description to yield a Match percentage.
4. **Keyword Match Analysis**: Matches industry keywords (Agile, Testing, Databases, microservices) in the text.
5. **Project Relevance Evaluation**: Algorithmic classification (High, Medium, Low Relevance) matching project descriptions against JD skills.
6. **Experience Match Analysis**: Identifies professional work history strengths and detects gaps.
7. **Actionable Recommendations**: Generates clear, rules-based improvements (e.g. "Add a GitHub profile link", "Include certifications section").
8. **PDF Report Export**: Generates a clean, print-ready PDF audit sheet using `jspdf` for local downloads.
9. **Interactive Dashboard**: Sleek, glassmorphic dark theme built with Tailwind CSS, Lucide icons, and responsive layouts.

---

## Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org) (App Router, TypeScript)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) (Modern glassmorphic dark theme)
- **Icons**: [Lucide React](https://lucide.dev)
- **PDF Extraction**: [pdfjs-dist](https://github.com/mozilla/pdf.js) (with cdnjs CDN web worker configuration)
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF)

---

## Security & Privacy Architecture

As a security-first tool, it enforces several measures to ensure data safety:
* **No Database/Backend Transmissions**: All parsing and scoring run on the client side. No resume text or private contact info ever leaves the user's browser, bypassing Vercel execution timeouts or data breaches.
* **XSS Prevention**: Extracted text and text inputs are sanitized to strip out malicious HTML tags, avoiding script execution payloads.
* **No DangerouslySetInnerHTML**: React components render text data using default text nodes, ensuring inputs are escaped before rendering.
* **File Validation**: Accepts only valid PDF byte streams under 5MB, preventing malware upload.
* **Prompt Injection Proof**: By omitting generative AI systems, it is immune to prompt injection attacks, role override attempts, and jailbreaks.

---

## Installation & Local Development

### Prerequisites
- Node.js (v18.x or later)
- npm (v10.x or later)

### Steps
1. Clone the project and navigate to the directory:
   ```bash
   cd InternshipAssignment
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

4. Verify compilation and check for TypeScript errors:
   ```bash
   npx tsc --noEmit
   ```
5. Build the optimized production bundle:
   ```bash
   npm run build
   ```

---

## Vercel Deployment Instructions

Since this is a static, browser-executable Next.js project, it is highly optimized for serverless hosting and can be deployed to Vercel in seconds with **zero cost**.

### Option 1: Vercel Git Integration (Recommended)
1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Go to the [Vercel Dashboard](https://vercel.com).
3. Click **Add New** -> **Project**.
4. Import your git repository.
5. Vercel automatically detects Next.js. Keep default build and install settings.
6. Click **Deploy**.

### Option 2: Vercel CLI
If you have the Vercel CLI installed locally:
```bash
# Login to your Vercel account
vercel login

# Initialize deployment
vercel
```

---

## License & Footer
Built by **Mansi Singh** ([your-email@example.com](mailto:your-email@example.com)) for **Digital Heroes**.
Website: [https://digitalheroesco.com](https://digitalheroesco.com)
