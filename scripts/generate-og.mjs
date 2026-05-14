import sharp from 'sharp';
import { readFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const svgPath = resolve(__dirname, '../public/og-image.svg');
const ogOutputDir = resolve(__dirname, '../public/og');

// Ensure output directory exists
if (!existsSync(ogOutputDir)) {
  mkdirSync(ogOutputDir, { recursive: true });
}

// Base static pages
const pages = [
  // Core Pages
  { file: 'home.png', title: 'OMNIDEVX', tagline: 'Elite Software Engineering Agency' },
  { file: 'services.png', title: 'SERVICES', tagline: 'End-to-End Technical Solutions' },
  { file: 'portfolio.png', title: 'PORTFOLIO', tagline: 'Case Studies & Selected Work' },
  { file: 'careers.png', title: 'CAREERS', tagline: 'Build the Future of the Web' },
  { file: 'team.png', title: 'OUR TEAM', tagline: 'Leadership & Engineering' },
  { file: 'culture.png', title: 'CULTURE', tagline: 'The Omnidevx Way' },
  { file: 'contact.png', title: 'CONTACT', tagline: 'Let\'s Build Something Together' },
  
  // Service Sub-Pages
  { file: 'services-web.png', title: 'WEB APPS', tagline: 'High-Performance Web Architectures' },
  { file: 'services-mobile.png', title: 'MOBILE', tagline: 'Cross-Platform Mobile Experiences' },
  { file: 'services-mvp.png', title: 'AI MVP', tagline: 'From Concept to Production in 30 Days' },
  { file: 'services-genai.png', title: 'GEN AI', tagline: 'Custom LLM Integration & RAG' },
  { file: 'services-devops.png', title: 'DEVOPS & SQA', tagline: 'Scalable Infrastructure & Quality' }
];


console.log('🔍 Scanning codebase for dynamic pages...');

// 1. Auto-discover portfolio case studies
const portfolioDir = resolve(__dirname, '../src/pages/portfolio');
if (existsSync(portfolioDir)) {
  const portfolioFiles = readdirSync(portfolioDir).filter(f => f.endsWith('.astro'));
  for (const file of portfolioFiles) {
    const content = readFileSync(resolve(portfolioDir, file), 'utf-8');
    const nameMatch = /name="([^"]+)"/.exec(content);
    const categoryMatch = /category="([^"]+)"/.exec(content);
    
    if (nameMatch && categoryMatch) {
      const slug = file.replace('.astro', '');
      pages.push({
        file: `portfolio-${slug}.png`,
        title: nameMatch[1].toUpperCase(),
        tagline: categoryMatch[1]
      });
      console.log(`   + Found Case Study: ${nameMatch[1]}`);
    }
  }
}

// 2. Auto-discover job departments
const jobsFile = resolve(__dirname, '../src/data/jobs.ts');
if (existsSync(jobsFile)) {
  const jobsContent = readFileSync(jobsFile, 'utf-8');
  // Match all department strings: department: "Engineering" or department: 'Design'
  const deptMatches = [...jobsContent.matchAll(/department:\s*['"]([^'"]+)['"]/g)];
  const departments = [...new Set(deptMatches.map(m => m[1]))]; // Get unique
  
  for (const dept of departments) {
    const slug = dept.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    pages.push({
      file: `jobs-${slug}.png`,
      title: dept.toUpperCase(),
      tagline: `Join Our ${dept} Team`
    });
    console.log(`   + Found Job Dept: ${dept}`);
  }
}

console.log(`\n🖼️ Starting Open Graph image generation for ${pages.length} images...`);

// Read base template
const baseSvg = readFileSync(svgPath, 'utf-8');

// Helper to escape XML special characters
function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

// Helper to determine brand colors based on page type
function getColors(filename) {
  // Job Postings
  if (filename === 'jobs-engineering.png') return { main: '#059669', light: '#34d399' }; // Emerald Green
  if (filename === 'jobs-design.png') return { main: '#db2777', light: '#f472b6' }; // Pink
  if (filename === 'jobs-product.png') return { main: '#0284c7', light: '#38bdf8' }; // Sky Blue
  
  // Services
  if (filename.startsWith('services-') || filename === 'services.png') return { main: '#7c3aed', light: '#a78bfa' }; // Violet
  
  // Portfolios
  if (filename.startsWith('portfolio-') || filename === 'portfolio.png') return { main: '#e11d48', light: '#fb7185' }; // Rose
  
  // Core Pages
  if (filename === 'team.png') return { main: '#d97706', light: '#fbbf24' }; // Amber
  if (filename === 'culture.png') return { main: '#c026d3', light: '#e879f9' }; // Fuchsia
  if (filename === 'careers.png') return { main: '#0d9488', light: '#2dd4bf' }; // Teal
  if (filename === 'contact.png') return { main: '#65a30d', light: '#a3e635' }; // Lime
  
  // Default (Home and any others)
  return { main: '#2563eb', light: '#60a5fa' }; // Blue
}

// Generate images using top-level await
for (const page of pages) {
  const pngPath = resolve(ogOutputDir, page.file);
  const colors = getColors(page.file);
  
  // Replace placeholders with real content (safely escaped for XML)
  let customizedSvg = baseSvg
    .replace('{{TITLE}}', escapeXml(page.title))
    .replace('{{TAGLINE}}', escapeXml(page.tagline))
    .replaceAll('{{COLOR_MAIN}}', colors.main)
    .replaceAll('{{COLOR_LIGHT}}', colors.light);
    
  // Convert string to buffer
  const svgBuffer = Buffer.from(customizedSvg);
  
  try {
    await sharp(svgBuffer)
      .resize(1200, 630)
      .png({ quality: 95 })
      .toFile(pngPath);
      
    console.log(`✅ Generated: public/og/${page.file}`);
  } catch (err) {
    console.error(`❌ Failed to generate ${page.file}:`, err);
  }
}
console.log('🎉 All OG images generated successfully!');
