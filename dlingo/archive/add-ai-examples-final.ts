import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ExampleSentence {
  japanese: string;
  english: string;
  context?: string;
  level?: string;
  isAIGenerated?: boolean;
}

interface WordWithExamples {
  id: string;
  japanese: string;
  english: string;
  type: string;
  exampleSentences?: ExampleSentence[];
  source?: string;
}

// Parse markdown files
function parseMdFile(filepath: string): WordWithExamples[] {
  const content = fs.readFileSync(filepath, 'utf-8');
  const words: WordWithExamples[] = [];
  const jsonBlocks = content.match(/```json\s*([\s\S]*?)\s*```/g);

  if (jsonBlocks) {
    for (const block of jsonBlocks) {
      const jsonContent = block.replace(/```json\s*/, '').replace(/\s*```/, '');
      try {
        const data = JSON.parse(jsonContent);
        if (data.updatedWords && Array.isArray(data.updatedWords)) {
          words.push(...data.updatedWords);
        }
      } catch (e) {
        // Skip errors
      }
    }
  }
  return words;
}

// Check if two examples are the same
function areSameExamples(ex1: ExampleSentence, ex2: ExampleSentence): boolean {
  return ex1.japanese.trim() === ex2.japanese.trim() &&
         ex1.english.trim() === ex2.english.trim();
}

// Check if example already exists in list
function exampleExists(example: ExampleSentence, existingExamples: ExampleSentence[]): boolean {
  return existingExamples.some(ex => areSameExamples(ex, example));
}

console.log('MERGING AI EXAMPLES INTO VOCABULARY');
console.log('='.repeat(80));

// Load AI batch files
const batchFiles = [
  { path: 'batch_1.md', type: 'md' as const },
  { path: 'batch_2.md', type: 'md' as const },
  { path: 'batch_3.md', type: 'md' as const },
  { path: 'batch_remaining.json', type: 'json' as const },
  { path: 'batch_final.json', type: 'json' as const }
];

const allAIWords: WordWithExamples[] = [];

for (const file of batchFiles) {
  const filepath = path.join(__dirname, file.path);
  if (!fs.existsSync(filepath)) {
    console.log(`⚠️  ${file.path} not found - skipping`);
    continue;
  }

  let words: WordWithExamples[];
  if (file.type === 'md') {
    words = parseMdFile(filepath);
  } else {
    words = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
  }

  words.forEach(w => w.source = file.path);
  allAIWords.push(...words);
}

console.log(`✓ Loaded AI words: ${allAIWords.length}\n`);

// Load current vocabulary
const vocabPath = path.join(__dirname, 'duolingo-vocab-with-examples', 'duolingo_vocab_enhanced.json');
const currentVocab: WordWithExamples[] = JSON.parse(fs.readFileSync(vocabPath, 'utf-8'));

console.log(`✓ Loaded current vocab: ${currentVocab.length} words`);

const beforeWithExamples = currentVocab.filter(w => w.exampleSentences && w.exampleSentences.length > 0).length;
console.log(`  - With examples (before): ${beforeWithExamples}`);
console.log(`  - Without examples (before): ${currentVocab.length - beforeWithExamples}\n`);

// Create map for quick lookup
const aiWordsMap = new Map<string, WordWithExamples>();
allAIWords.forEach(w => {
  const key = `${w.japanese}|${w.type}`;
  aiWordsMap.set(key, w);
});

// Merge process
let newWordsCount = 0;
let duplicatesChecked = 0;
let duplicatesAdded = 0;
let examplesAddedToNew = 0;
let examplesAddedToDuplicates = 0;
let skippedDuplicates = 0;

const updatedVocab = currentVocab.map((word) => {
  const key = `${word.japanese}|${word.type}`;
  const aiWord = aiWordsMap.get(key);

  if (!aiWord || !aiWord.exampleSentences) {
    return word;
  }

  const hasExamples = word.exampleSentences && word.exampleSentences.length > 0;

  if (!hasExamples) {
    // NEW word - add all AI examples
    newWordsCount++;
    examplesAddedToNew += aiWord.exampleSentences.length;

    return {
      ...word,
      exampleSentences: aiWord.exampleSentences
    };
  } else {
    // DUPLICATE - check if examples are different
    duplicatesChecked++;

    const existingExamples = word.exampleSentences || [];
    const newExamples: ExampleSentence[] = [];

    for (const aiExample of aiWord.exampleSentences) {
      if (!exampleExists(aiExample, existingExamples)) {
        newExamples.push(aiExample);
      }
    }

    if (newExamples.length > 0) {
      duplicatesAdded++;
      examplesAddedToDuplicates += newExamples.length;

      return {
        ...word,
        exampleSentences: [...existingExamples, ...newExamples]
      };
    } else {
      skippedDuplicates++;
      return word;
    }
  }
});

// Count final stats
const afterWithExamples = updatedVocab.filter(w => w.exampleSentences && w.exampleSentences.length > 0).length;
const totalExamplesAfter = updatedVocab.reduce((sum, w) => sum + (w.exampleSentences?.length || 0), 0);

// Create backup
const backupPath = path.join(__dirname, 'duolingo-vocab-with-examples', `duolingo_vocab_enhanced.backup_${Date.now()}.json`);
fs.writeFileSync(backupPath, JSON.stringify(currentVocab, null, 2));
console.log(`✓ Backup created: ${path.basename(backupPath)}\n`);

// Save updated vocabulary
fs.writeFileSync(vocabPath, JSON.stringify(updatedVocab, null, 2));

// Report results
console.log('='.repeat(80));
console.log('FINAL RESULTS');
console.log('='.repeat(80));

console.log('\n📊 NEW WORDS (added AI examples):');
console.log(`  - Words: ${newWordsCount}`);
console.log(`  - Examples added: ${examplesAddedToNew}`);

console.log('\n📊 DUPLICATES (already had Duolingo examples):');
console.log(`  - Total checked: ${duplicatesChecked}`);
console.log(`  - Added different AI examples: ${duplicatesAdded}`);
console.log(`  - Examples added to duplicates: ${examplesAddedToDuplicates}`);
console.log(`  - Skipped (same examples): ${skippedDuplicates}`);

console.log('\n📊 COVERAGE:');
console.log(`  - Before: ${beforeWithExamples}/1060 (${((beforeWithExamples/1060)*100).toFixed(1)}%)`);
console.log(`  - After: ${afterWithExamples}/1060 (${((afterWithExamples/1060)*100).toFixed(1)}%)`);
console.log(`  - Improvement: +${afterWithExamples - beforeWithExamples} words`);
console.log(`  - Still missing: ${1060 - afterWithExamples}`);

console.log('\n📊 TOTAL EXAMPLES:');
console.log(`  - New examples added: ${examplesAddedToNew + examplesAddedToDuplicates}`);
console.log(`  - Total examples now: ${totalExamplesAfter}`);

console.log('\n✅ Updated vocabulary saved!');
console.log('📄 File: ' + vocabPath);

// Save detailed report
const reportPath = path.join(__dirname, 'merge-final-report.json');
fs.writeFileSync(reportPath, JSON.stringify({
  timestamp: new Date().toISOString(),
  summary: {
    newWords: newWordsCount,
    examplesAddedToNew: examplesAddedToNew,
    duplicatesChecked: duplicatesChecked,
    duplicatesAdded: duplicatesAdded,
    examplesAddedToDuplicates: examplesAddedToDuplicates,
    skippedDuplicates: skippedDuplicates,
    coverageBefore: beforeWithExamples,
    coverageAfter: afterWithExamples,
    totalExamplesAfter: totalExamplesAfter
  }
}, null, 2));

console.log('📄 Report saved: merge-final-report.json');
console.log('\n' + '='.repeat(80));
