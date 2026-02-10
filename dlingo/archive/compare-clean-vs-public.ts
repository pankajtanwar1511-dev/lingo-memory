import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load both files
const cleanPath = path.join(__dirname, 'final-word-level-category-without-example', 'duolingo_vocab_clean.json');
const publicPath = path.join(__dirname, '..', 'public', 'seed-data', 'duolingo_vocab_enhanced.json');

const cleanData = JSON.parse(fs.readFileSync(cleanPath, 'utf-8'));
const publicData = JSON.parse(fs.readFileSync(publicPath, 'utf-8'));

console.log('COMPARISON: Clean vs Public Data');
console.log('='.repeat(80));
console.log(`Clean file: ${cleanData.length} words`);
console.log(`Public file: ${publicData.length} words`);

// Create maps by japanese word
const cleanMap = new Map();
cleanData.forEach((word: any) => {
  cleanMap.set(word.japanese, word);
});

const publicMap = new Map();
publicData.forEach((word: any) => {
  publicMap.set(word.japanese, word);
});

// Compare
const mismatches: any[] = [];
const missingInPublic: string[] = [];
const missingInClean: string[] = [];

// Check each word in clean file
for (const [japanese, cleanWord] of cleanMap.entries()) {
  const publicWord = publicMap.get(japanese);

  if (!publicWord) {
    missingInPublic.push(japanese);
  } else {
    const issues: string[] = [];

    // Compare type/category
    if (cleanWord.type !== publicWord.type) {
      issues.push(`type: "${cleanWord.type}" vs "${publicWord.type}"`);
    }

    // Compare english
    if (cleanWord.english !== publicWord.english) {
      issues.push(`english: "${cleanWord.english}" vs "${publicWord.english}"`);
    }

    if (issues.length > 0) {
      mismatches.push({
        japanese,
        issues,
        clean: { english: cleanWord.english, type: cleanWord.type },
        public: { english: publicWord.english, type: publicWord.type }
      });
    }
  }
}

// Check for words in public but not in clean
for (const japanese of publicMap.keys()) {
  if (!cleanMap.has(japanese)) {
    missingInClean.push(japanese);
  }
}

// Report results
console.log('\n' + '='.repeat(80));
console.log('RESULTS');
console.log('='.repeat(80));

if (mismatches.length === 0 && missingInPublic.length === 0 && missingInClean.length === 0) {
  console.log('\n✅ PERFECT MATCH!');
  console.log('All words, categories, and English translations match exactly.');
  console.log('The only difference is that clean file has no examples.');
} else {
  if (mismatches.length > 0) {
    console.log(`\n❌ MISMATCHES FOUND: ${mismatches.length}`);
    console.log('\nFirst 10 mismatches:');
    mismatches.slice(0, 10).forEach(m => {
      console.log(`\n  ${m.japanese}:`);
      m.issues.forEach((issue: string) => console.log(`    - ${issue}`));
    });
  }

  if (missingInPublic.length > 0) {
    console.log(`\n❌ WORDS IN CLEAN BUT NOT IN PUBLIC: ${missingInPublic.length}`);
    console.log('First 10:', missingInPublic.slice(0, 10).join(', '));
  }

  if (missingInClean.length > 0) {
    console.log(`\n❌ WORDS IN PUBLIC BUT NOT IN CLEAN: ${missingInClean.length}`);
    console.log('First 10:', missingInClean.slice(0, 10).join(', '));
  }
}

console.log('\n' + '='.repeat(80));

// Save detailed report if there are issues
if (mismatches.length > 0) {
  const reportPath = path.join(__dirname, 'clean-vs-public-mismatches.json');
  fs.writeFileSync(reportPath, JSON.stringify(mismatches, null, 2));
  console.log(`\n📄 Detailed mismatch report saved to: clean-vs-public-mismatches.json`);
}
