import fs from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import { html } from 'satori-html';
import { Resvg } from '@resvg/resvg-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ogOutputDir = resolve(__dirname, '../public/og');

// Ensure output directory exists
if (!fs.existsSync(ogOutputDir)) {
  fs.mkdirSync(ogOutputDir, { recursive: true });
}

// Ensure fonts directory exists for caching
const fontsDir = resolve(__dirname, '../public/fonts');
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

// Download font utility with local disk caching
async function getCachedFont(urls, name, filename) {
  const localPath = resolve(fontsDir, filename);
  
  // 1. If it exists locally, read it instantly (Zero network latency on Vercel)
  if (fs.existsSync(localPath)) {
    console.log(`📦 Loaded ${name} font from local cache.`);
    return fs.readFileSync(localPath);
  }

  // 2. Otherwise, download it once
  const errors = [];
  for (const url of urls) {
    try {
      console.log(`📥 Downloading remote font ${name}...`);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP Status ${response.status}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Save it permanently so Vercel never has to download it again
      fs.writeFileSync(localPath, buffer);
      console.log(`✅ Saved ${name} font to local cache!`);
      return buffer;
    } catch (e) {
      errors.push(e);
      console.warn(`⚠️ Failed to download from ${url}:`, e.message);
    }
  }
  throw new Error(`Could not download ${name}. Errors: ${errors.map((e) => e.message).join(', ')}`);
}

// Base static pages
const pages = [
  { file: 'home.png', title: 'OMNIDEVX', tagline: 'Elite Software Engineering Agency' },
  { file: 'services.png', title: 'SERVICES', tagline: 'End-to-End Technical Solutions' },
  { file: 'portfolio.png', title: 'PORTFOLIO', tagline: 'Case Studies & Selected Work' },
  { file: 'careers.png', title: 'CAREERS', tagline: 'Build the Future of the Web' },
  { file: 'team.png', title: 'OUR TEAM', tagline: 'Leadership & Engineering' },
  { file: 'culture.png', title: 'CULTURE', tagline: 'The Omnidevx Way' },
  { file: 'contact.png', title: 'CONTACT', tagline: 'Let\'s Build Something Together' },
  
  { file: 'services-web.png', title: 'WEB APPS', tagline: 'High-Performance Web Architectures' },
  { file: 'services-mobile.png', title: 'MOBILE', tagline: 'Cross-Platform Mobile Experiences' },
  { file: 'services-mvp.png', title: 'AI MVP', tagline: 'From Concept to Production in 30 Days' },
  { file: 'services-genai.png', title: 'GEN AI', tagline: 'Custom LLM Integration & RAG' },
  { file: 'services-devops.png', title: 'DEVOPS & SQA', tagline: 'Scalable Infrastructure & Quality' }
];

console.log('🔍 Scanning codebase for dynamic pages...');

const portfolioDir = resolve(__dirname, '../src/pages/portfolio');
if (fs.existsSync(portfolioDir)) {
  const portfolioFiles = fs.readdirSync(portfolioDir).filter(f => f.endsWith('.astro'));
  for (const file of portfolioFiles) {
    const content = fs.readFileSync(resolve(portfolioDir, file), 'utf-8');
    const nameMatch = /name="([^"]+)"/.exec(content);
    const categoryMatch = /category="([^"]+)"/.exec(content);
    if (nameMatch && categoryMatch) {
      pages.push({
        file: `portfolio-${file.replace('.astro', '')}.png`,
        title: nameMatch[1].toUpperCase(),
        tagline: categoryMatch[1]
      });
      console.log(`   + Found Case Study: ${nameMatch[1]}`);
    }
  }
}

const jobsFile = resolve(__dirname, '../src/data/jobs.ts');
if (fs.existsSync(jobsFile)) {
  const jobsContent = fs.readFileSync(jobsFile, 'utf-8');
  const deptMatches = [...jobsContent.matchAll(/department:\s*['"]([^'"]+)['"]/g)];
  const departments = [...new Set(deptMatches.map(m => m[1]))];
  for (const dept of departments) {
    pages.push({
      file: `jobs-${dept.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`,
      title: dept.toUpperCase(),
      tagline: `Join Our ${dept} Team`
    });
    console.log(`   + Found Job Dept: ${dept}`);
  }
}

// Brand Colors
function getColors(filename) {
  if (filename === 'jobs-engineering.png') return '#059669'; // Emerald
  if (filename === 'jobs-design.png') return '#db2777'; // Pink
  if (filename === 'jobs-product.png') return '#0284c7'; // Sky
  if (filename.startsWith('services-') || filename === 'services.png') return '#7c3aed'; // Violet
  if (filename.startsWith('portfolio-') || filename === 'portfolio.png') return '#e11d48'; // Rose
  if (filename === 'team.png') return '#d97706'; // Amber
  if (filename === 'culture.png') return '#c026d3'; // Fuchsia
  if (filename === 'careers.png') return '#0d9488'; // Teal
  if (filename === 'contact.png') return '#65a30d'; // Lime
  return '#2563eb'; // Blue
}

// Decode HTML entities so Satori renders '&' instead of '&amp;'
function decodeHtml(str) {
  if (!str) return '';
  return str.replaceAll('&amp;', '&')
            .replaceAll('&lt;', '<')
            .replaceAll('&gt;', '>')
            .replaceAll('&quot;', '"')
            .replaceAll('&#39;', "'");
}

async function run() {
  console.log('\n⚡ Preparing Vercel Build Optimization...');
  
  const caveatBuffer = await getCachedFont([
    'https://raw.githubusercontent.com/googlefonts/caveat/main/fonts/ttf/Caveat-Bold.ttf',
    'https://raw.githubusercontent.com/google/fonts/main/ofl/caveat/Caveat-Bold.ttf'
  ], 'Caveat', 'Caveat-Bold.ttf');
  
  const kalamBuffer = await getCachedFont([
    'https://raw.githubusercontent.com/itfoundry/kalam/master/fonts/Kalam-Bold.ttf',
    'https://raw.githubusercontent.com/google/fonts/main/ofl/kalam/Kalam-Bold.ttf'
  ], 'Kalam', 'Kalam-Bold.ttf');

  console.log(`\n🚀 Starting parallel concurrent Satori generation for ${pages.length} images...`);

  // Use Promise.all to generate all images simultaneously, saving massive build time
  await Promise.all(pages.map(async (page) => {
    const pngPath = resolve(ogOutputDir, page.file);
    const color = getColors(page.file);
    
    // Clean strings
    const cleanTitle = decodeHtml(page.title);
    const cleanTagline = decodeHtml(page.tagline);

    const rawHtml = `
      <div style="display: flex; flex-direction: column; width: 1200px; height: 630px; background-color: #FDFCF7; padding: 80px; font-family: 'Kalam'; position: relative;">
        <!-- Background SVG Glow -->
        <svg width="1200" height="630" style="position: absolute; top: 0; left: 0;">
          <defs>
            <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="${color}" stop-opacity="0.15" />
              <stop offset="100%" stop-color="${color}" stop-opacity="0" />
            </linearGradient>
          </defs>
          <ellipse cx="900" cy="200" rx="400" ry="300" fill="url(#glow)" />
        </svg>

        <!-- Content Wrapper -->
        <div style="display: flex; flex-direction: column; z-index: 10;">
          <!-- Logo -->
          <div style="display: flex; font-family: 'Caveat'; font-size: 64px; font-weight: 700; color: #161616; margin-top: 20px;">
            omnidev<span style="color: #2A6FDB; display: flex;">X</span>
          </div>

          <!-- Accent Line -->
          <div style="display: flex; width: 120px; height: 6px; background-color: ${color}; border-radius: 3px; margin-top: 10px;"></div>

          <!-- Title -->
          <div style="display: flex; font-family: 'Caveat'; font-size: 110px; font-weight: 700; color: #161616; margin-top: 80px; letter-spacing: -2px;">
            ${cleanTitle}
          </div>

          <!-- Tagline -->
          <div style="display: flex; font-size: 42px; font-weight: 700; color: #444444; margin-top: 10px;">
            ${cleanTagline}
          </div>
        </div>

        <!-- Bottom Bar -->
        <div style="display: flex; position: absolute; bottom: 80px; left: 80px; right: 80px; border-bottom: 2px solid #e8e5db; padding-bottom: 20px; font-size: 24px; font-weight: 700; color: #71717a; letter-spacing: 2px;">
          OMNIDEVX.COM
        </div>
      </div>
    `;

    // Parse cleanly
    const markup = html(rawHtml);

    const svg = await satori(markup, {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Caveat', data: caveatBuffer, weight: 700, style: 'normal' },
        { name: 'Kalam', data: kalamBuffer, weight: 700, style: 'normal' }
      ]
    });

    const resvg = new Resvg(svg, {
      background: '#FDFCF7',
      fitTo: { mode: 'width', value: 1200 }
    });
    
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();
    
    fs.writeFileSync(pngPath, pngBuffer);
    console.log(`✅ Generated: public/og/${page.file}`);
  }));
  
  console.log('🎉 All OG images perfectly generated with parallel execution!');
}

try {
  await run();
} catch (err) {
  console.error('❌ Error generating images:', err);
}
