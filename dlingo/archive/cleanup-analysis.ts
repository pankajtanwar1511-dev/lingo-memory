import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('DUOLINGO FOLDER CLEANUP ANALYSIS');
console.log('='.repeat(80));

// Get all files in duolingo folder
const files = fs.readdirSync(__dirname);

// Categorize files
const categories = {
  finalData: [] as string[],
  processDocumentation: [] as string[],
  usefulScripts: [] as string[],
  intermediateData: [] as string[],
  backups: [] as string[],
  temporaryFiles: [] as string[],
  folders: [] as string[]
};

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  const stat = fs.statSync(filePath);

  if (stat.isDirectory()) {
    categories.folders.push(file);
    return;
  }

  // Final data
  if (file === 'duolingo_vocab_enhanced.json') {
    categories.finalData.push(file);
  }
  // Process documentation
  else if (file.includes('categorization-review') ||
           file.includes('PROMPT-FOR-CLAUDE') ||
           file.includes('README')) {
    categories.processDocumentation.push(file);
  }
  // Useful scripts for future
  else if (file.includes('verification') && file.endsWith('.ts') ||
           file.includes('analyze') && file.endsWith('.ts') ||
           file === 'generate-claude-prompt.ts') {
    categories.usefulScripts.push(file);
  }
  // Backups
  else if (file.includes('backup') || file.includes('before_')) {
    categories.backups.push(file);
  }
  // Intermediate data
  else if (file.startsWith('batch_') ||
           file.startsWith('list-') ||
           file.includes('remaining') ||
           file.includes('analysis') && file.endsWith('.json') ||
           file.includes('report') && file.endsWith('.json')) {
    categories.intermediateData.push(file);
  }
  // Temporary/working files
  else if (file.endsWith('.ts') && !categories.usefulScripts.includes(file)) {
    categories.temporaryFiles.push(file);
  }
  else if (file.endsWith('.txt') || file.endsWith('.md') && !categories.processDocumentation.includes(file)) {
    categories.temporaryFiles.push(file);
  }
});

console.log('\n📂 FOLDERS:');
console.log('='.repeat(80));
categories.folders.forEach(f => {
  const folderPath = path.join(__dirname, f);
  const fileCount = fs.readdirSync(folderPath).length;
  const stats = fs.statSync(folderPath);
  console.log(`  ${f}/ (${fileCount} files)`);
});

console.log('\n📄 FINAL DATA (MUST KEEP):');
console.log('='.repeat(80));
categories.finalData.forEach(f => console.log(`  ✅ ${f}`));

console.log('\n📚 PROCESS DOCUMENTATION (SHOULD KEEP):');
console.log('='.repeat(80));
categories.processDocumentation.forEach(f => console.log(`  📖 ${f}`));

console.log('\n🔧 USEFUL SCRIPTS (SHOULD KEEP):');
console.log('='.repeat(80));
categories.usefulScripts.forEach(f => console.log(`  🔧 ${f}`));

console.log('\n💾 BACKUPS (KEEP LATEST ONLY):');
console.log('='.repeat(80));
categories.backups.forEach(f => console.log(`  💾 ${f}`));

console.log('\n📦 INTERMEDIATE DATA (CAN DELETE):');
console.log('='.repeat(80));
categories.intermediateData.forEach(f => console.log(`  📦 ${f}`));

console.log('\n🗑️  TEMPORARY FILES (CAN DELETE):');
console.log('='.repeat(80));
categories.temporaryFiles.forEach(f => console.log(`  🗑️  ${f}`));

console.log('\n' + '='.repeat(80));
console.log('RECOMMENDATION:');
console.log('='.repeat(80));
console.log(`
1. ✅ KEEP (${categories.finalData.length + categories.processDocumentation.length + categories.usefulScripts.length} files):
   - Final data files
   - Process documentation (categorization-review.md, PROMPT files)
   - Useful scripts (verification, analysis tools)

2. 📁 ARCHIVE (${categories.intermediateData.length + categories.backups.length} files):
   - Move to 'archive/' folder for reference
   - Intermediate batch files
   - Analysis reports
   - All backups (keep 1 latest in root)

3. 🗑️  DELETE (${categories.temporaryFiles.length} files):
   - Temporary working scripts
   - Old text files
   - Duplicate documentation

4. 📂 FOLDERS TO REVIEW:
   - remaining_264_examples/ → ARCHIVE (already merged)
   - remaining_173_few_examples/ → ARCHIVE (already merged)
   - duolingo-vocab-with-examples/ → KEEP (contains final data copy)
   - final-word-level-category-without-example/ → ARCHIVE (baseline backup)
`);

console.log('\nTotal files analyzed: ' + files.length);
