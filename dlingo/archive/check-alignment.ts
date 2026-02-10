import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface DuolingoWord {
  id: string;
  japanese: string;
  english: string;
  type: string;
  exampleSentences?: any[];
}

// Parse the categorization-review.md file
function parseCategorization(): Map<string, { japanese: string; category: string; english: string }> {
  const mdPath = path.join(__dirname, 'categorization-review.md');
  const content = fs.readFileSync(mdPath, 'utf-8');

  const wordMap = new Map();
  const lines = content.split('\n');
  let inTable = false;

  for (const line of lines) {
    if (line.startsWith('| Japanese | Category | English |')) {
      inTable = true;
      continue;
    }

    if (inTable && line.startsWith('|') && !line.includes('---')) {
      const parts = line.split('|').map(p => p.trim()).filter(p => p);
      if (parts.length === 3) {
        const [japanese, category, english] = parts;
        wordMap.set(japanese, { japanese, category, english });
      }
    }
  }

  return wordMap;
}

// Load current vocabulary
function loadVocabulary(): DuolingoWord[] {
  const vocabPath = path.join(__dirname, '..', 'public', 'seed-data', 'duolingo_vocab_enhanced.json');
  return JSON.parse(fs.readFileSync(vocabPath, 'utf-8'));
}

// Main comparison
const categorization = parseCategorization();
const vocabulary = loadVocabulary();

console.log('ALIGNMENT CHECK REPORT');
console.log('='.repeat(80));
console.log(`\nCategorization file: ${categorization.size} words`);
console.log(`Vocabulary file: ${vocabulary.length} words`);

// Check for alignment issues
const issues: any[] = [];
const missingInVocab: string[] = [];
const missingInCategories: string[] = [];
const categoryMismatches: any[] = [];
const missingExamples: any[] = [];

// Create a map of vocabulary by japanese word
const vocabMap = new Map<string, DuolingoWord>();
vocabulary.forEach(word => {
  vocabMap.set(word.japanese, word);
});

// Check each word in categorization
for (const [japanese, expected] of categorization.entries()) {
  const vocabWord = vocabMap.get(japanese);

  if (!vocabWord) {
    missingInVocab.push(japanese);
  } else {
    // Check category match
    if (vocabWord.type !== expected.category) {
      categoryMismatches.push({
        japanese,
        expected: expected.category,
        actual: vocabWord.type,
        english: expected.english
      });
    }

    // Check if examples exist
    if (!vocabWord.exampleSentences || vocabWord.exampleSentences.length === 0) {
      missingExamples.push({
        japanese,
        english: expected.english,
        type: expected.category
      });
    }
  }
}

// Check for words in vocabulary but not in categorization
for (const [japanese, word] of vocabMap.entries()) {
  if (!categorization.has(japanese)) {
    missingInCategories.push(japanese);
  }
}

// Print results
console.log('\n' + '='.repeat(80));
console.log('RESULTS SUMMARY');
console.log('='.repeat(80));

if (categoryMismatches.length > 0) {
  console.log(`\n❌ CATEGORY MISMATCHES: ${categoryMismatches.length}`);
  console.log('First 10:');
  categoryMismatches.slice(0, 10).forEach(m => {
    console.log(`  ${m.japanese} (${m.english}): expected "${m.expected}" but got "${m.actual}"`);
  });
}

if (missingInVocab.length > 0) {
  console.log(`\n❌ WORDS IN CATEGORIZATION BUT NOT IN VOCABULARY: ${missingInVocab.length}`);
  console.log('First 10:', missingInVocab.slice(0, 10).join(', '));
}

if (missingInCategories.length > 0) {
  console.log(`\n❌ WORDS IN VOCABULARY BUT NOT IN CATEGORIZATION: ${missingInCategories.length}`);
  console.log('First 10:', missingInCategories.slice(0, 10).join(', '));
}

if (missingExamples.length > 0) {
  console.log(`\n⚠️  WORDS WITHOUT EXAMPLES: ${missingExamples.length}`);
  console.log('First 10:');
  missingExamples.slice(0, 10).forEach(m => {
    console.log(`  ${m.japanese} (${m.english}) [${m.type}]`);
  });
}

// Overall status
console.log('\n' + '='.repeat(80));
if (categoryMismatches.length === 0 && missingInVocab.length === 0 && missingInCategories.length === 0) {
  console.log('✅ CATEGORIES ARE PERFECTLY ALIGNED!');
  if (missingExamples.length > 0) {
    console.log(`⚠️  However, ${missingExamples.length} words are missing examples`);
  } else {
    console.log('✅ ALL WORDS HAVE EXAMPLES!');
  }
} else {
  console.log('❌ ALIGNMENT ISSUES FOUND - DATA NEEDS TO BE REBUILT');
  console.log('\nTotal Issues:');
  console.log(`  - Category mismatches: ${categoryMismatches.length}`);
  console.log(`  - Missing in vocab: ${missingInVocab.length}`);
  console.log(`  - Missing in categorization: ${missingInCategories.length}`);
  console.log(`  - Missing examples: ${missingExamples.length}`);
}
console.log('='.repeat(80));

// Save detailed reports
if (categoryMismatches.length > 0) {
  fs.writeFileSync(
    path.join(__dirname, 'category-mismatches.json'),
    JSON.stringify(categoryMismatches, null, 2)
  );
  console.log('\n📄 Detailed category mismatches saved to: category-mismatches.json');
}

if (missingExamples.length > 0) {
  fs.writeFileSync(
    path.join(__dirname, 'words-without-examples.json'),
    JSON.stringify(missingExamples, null, 2)
  );
  console.log('📄 Words without examples saved to: words-without-examples.json');
}
