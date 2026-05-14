import sharp from 'sharp';
import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const svgPath = resolve(__dirname, '../public/og-image.svg');
const ogOutputDir = resolve(__dirname, '../public/og');

// Ensure output directory exists
if (!existsSync(ogOutputDir)) {
  mkdirSync(ogOutputDir, { recursive: true });
}

// Configuration Array
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
  { file: 'services-devops.png', title: 'DEVOPS & SQA', tagline: 'Scalable Infrastructure & Quality' },

  // Portfolio Sub-Pages
  { file: 'portfolio-nexusai.png', title: 'NEXUS AI', tagline: 'Enterprise RAG Platform' },
  { file: 'portfolio-paylab.png', title: 'PAYLAB PRO', tagline: 'FinTech as a Service' },
  { file: 'portfolio-fieldsync.png', title: 'FIELDSYNC', tagline: 'Field Management Platform' },

  // Job Departments
  { file: 'jobs-engineering.png', title: 'ENGINEERING', tagline: 'Join Our Engineering Team' },
  { file: 'jobs-design.png', title: 'DESIGN', tagline: 'Join Our Creative Team' },
  { file: 'jobs-product.png', title: 'PRODUCT', tagline: 'Join Our Product Team' }
];

console.log('🖼️ Starting Open Graph image generation...');

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

async function generateImages() {
  for (const page of pages) {
    const pngPath = resolve(ogOutputDir, page.file);
    
    // Replace placeholders with real content (safely escaped for XML)
    let customizedSvg = baseSvg
      .replace('{{TITLE}}', escapeXml(page.title))
      .replace('{{TAGLINE}}', escapeXml(page.tagline));
      
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
}

generateImages();
