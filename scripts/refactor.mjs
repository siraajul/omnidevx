import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(__dirname, '../src');
const uiDir = path.join(srcDir, 'components/ui');
const sectionsDir = path.join(srcDir, 'components/sections');

// Files to move from ui/ to sections/
const filesToMove = [
  'animated-bento.tsx',
  'animated-process-flow.tsx',
  'bento-features.tsx',
  'card-stack.tsx',
  'cobe-globe.tsx',
  'container-scroll-animation.tsx',
  'culture-photo-gallery.tsx',
  'culture-stories.tsx',
  'custom-lanyard.tsx',
  'faq-section.tsx',
  'globe-section.tsx',
  'hero-stats-card.tsx',
  'industry-radar.tsx',
  'interactive-selector.tsx',
  'magnified-bento.tsx',
  'omnidevx-hero.tsx',
  'process-stack.tsx',
  'service-features.tsx',
  'story-scroll.tsx',
  'story-viewer.tsx',
  'team-showcase.tsx',
  'vertical-image-stack.tsx',
  'work-showcase.tsx'
];

console.log('🚀 Starting Architecture Refactor...');

// 1. Create sections directory
if (!fs.existsSync(sectionsDir)) {
  fs.mkdirSync(sectionsDir, { recursive: true });
}

// 2. Move Files
console.log('\n📁 Moving UI Sections...');
filesToMove.forEach(file => {
  const oldPath = path.join(uiDir, file);
  const newPath = path.join(sectionsDir, file);
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`  Moved: ${file}`);
  }
});

// 3. Unify Utility Folders
console.log('\n📁 Unifying Utility Folders...');
const oldSanityPath = path.join(srcDir, 'utils/sanity.ts');
const newSanityPath = path.join(srcDir, 'lib/sanity.ts');
if (fs.existsSync(oldSanityPath)) {
  fs.renameSync(oldSanityPath, newSanityPath);
  console.log(`  Moved: sanity.ts -> lib/sanity.ts`);
  
  // Clean up empty utils folder if possible
  try {
    fs.rmdirSync(path.join(srcDir, 'utils'));
    console.log(`  Deleted empty src/utils folder`);
  } catch (e) {
    console.log(`  Note: Could not delete src/utils (might not be empty)`);
  }
}

// 4. Update Imports Globally
console.log('\n🔗 Fixing Import Paths Globally...');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  let filesArray = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      filesArray = getAllFiles(dirPath + "/" + file, filesArray);
    } else {
      if (file.endsWith('.astro') || file.endsWith('.tsx') || file.endsWith('.ts')) {
        filesArray.push(path.join(dirPath, file));
      }
    }
  });
  return filesArray;
}

const allFiles = getAllFiles(srcDir, []);
let updatedCount = 0;

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  let originalContent = content;

  // Replace ui/ -> sections/ for moved files globally
  filesToMove.forEach(movedFile => {
    const filenameWithoutExt = movedFile.replace('.tsx', '');
    const regex = new RegExp(`components/ui/${filenameWithoutExt}`, 'g');
    content = content.replace(regex, `components/sections/${filenameWithoutExt}`);
  });

  // Handle internal imports for files that moved to sections/
  if (file.includes('components/sections/')) {
    // If a file in sections/ imports card.tsx or feature-wrappers.tsx, it must go up one level
    content = content.replace(/from\s+['"]\.\/card['"]/g, "from '../ui/card'");
    content = content.replace(/from\s+['"]\.\/feature-wrappers['"]/g, "from '../ui/feature-wrappers'");
    content = content.replace(/from\s+['"]\.\/dashboards\//g, "from '../ui/dashboards/");
  }

  // Replace utils/sanity -> lib/sanity
  content = content.replace(/utils\/sanity/g, 'lib/sanity');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf-8');
    updatedCount++;
    console.log(`  Updated imports in: ${path.relative(srcDir, file)}`);
  }
});

console.log(`\n🎉 Refactor Complete! Fixed imports in ${updatedCount} files.`);
