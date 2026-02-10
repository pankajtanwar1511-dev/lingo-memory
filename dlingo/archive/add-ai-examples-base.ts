import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface WordWithExamples {
  id: string;
  japanese: string;
  english: string;
  type: string;
  exampleSentences: any[];
  source?: string;
}

// Parse markdown files to extract JSON
function parseMdFile(filepath: string): WordWithExamples[] {
  const content = fs.readFileSync(filepath, 'utf-8');
  const words: WordWithExamples[] = [];

  // Find all JSON blocks in the markdown
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
        console.error(`Error parsing JSON from ${filepath}:`, e);
      }
    }
  }

  return words;
}

// Load all batch files
const batchFiles = [
  { path: 'batch_1.md', type: 'md' },
  { path: 'batch_2.md', type: 'md' },
  { path: 'batch_3.md', type: 'md' },
  { path: 'batch_remaining.json', type: 'json' },
  { path: 'batch_final.json', type: 'json' }
];

console.log('ANALYZING AI-GENERATED BATCH FILES');
console.log('='.repeat(80));

// Collect all AI-generated words
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

  console.log(`✓ ${file.path}: ${words.length} words`);
}

console.log(`\n📊 Total AI words collected: ${allAIWords.length}`);

// Load current vocab with examples
const currentVocabPath = path.join(__dirname, 'duolingo-vocab-with-examples', 'duolingo_vocab_enhanced.json');
const currentVocab: WordWithExamples[] = JSON.parse(fs.readFileSync(currentVocabPath, 'utf-8'));

const wordsWithExamples = currentVocab.filter(w => w.exampleSentences && w.exampleSentences.length > 0);
const wordsWithoutExamples = currentVocab.filter(w => !w.exampleSentences || w.exampleSentences.length === 0);

console.log(`\n📚 Current Vocab Status:`);
console.log(`  Total: ${currentVocab.length}`);
console.log(`  With examples (Duolingo): ${wordsWithExamples.length}`);
console.log(`  Without examples: ${wordsWithoutExamples.length}`);

// Create maps for matching
const currentVocabMap = new Map<string, WordWithExamples>();
currentVocab.forEach(w => {
  const key = `${w.japanese}|${w.type}`;
  currentVocabMap.set(key, w);
});

const wordsWithExamplesMap = new Map<string, WordWithExamples>();
wordsWithExamples.forEach(w => {
  const key = `${w.japanese}|${w.type}`;
  wordsWithExamplesMap.set(key, w);
});

// Analyze AI words
console.log('\n' + '='.repeat(80));
console.log('MATCHING ANALYSIS');
console.log('='.repeat(80));

const matched: any[] = [];
const duplicates: any[] = [];
const notFound: any[] = [];
const typeMismatch: any[] = [];

for (const aiWord of allAIWords) {
  const key = `${aiWord.japanese}|${aiWord.type}`;
  const currentWord = currentVocabMap.get(key);

  if (!currentWord) {
    // Check if word exists but type is different
    const anyMatch = currentVocab.find(w => w.japanese === aiWord.japanese);
    if (anyMatch) {
      typeMismatch.push({
        japanese: aiWord.japanese,
        aiType: aiWord.type,
        vocabType: anyMatch.type,
        aiId: aiWord.id,
        vocabId: anyMatch.id,
        source: aiWord.source
      });
    } else {
      notFound.push({
        japanese: aiWord.japanese,
        type: aiWord.type,
        aiId: aiWord.id,
        source: aiWord.source
      });
    }
    continue;
  }

  // Check if it already has examples (Duolingo examples)
  const hasExamples = wordsWithExamplesMap.has(key);

  matched.push({
    japanese: aiWord.japanese,
    english: aiWord.english,
    type: aiWord.type,
    aiId: aiWord.id,
    vocabId: currentWord.id,
    exampleCount: aiWord.exampleSentences?.length || 0,
    isDuplicate: hasExamples,
    source: aiWord.source
  });

  if (hasExamples) {
    duplicates.push({
      japanese: aiWord.japanese,
      type: aiWord.type,
      aiId: aiWord.id,
      vocabId: currentWord.id,
      aiExamples: aiWord.exampleSentences?.length || 0,
      existingExamples: currentWord.exampleSentences?.length || 0,
      source: aiWord.source
    });
  }
}

// Report results
console.log(`\n✅ Successfully matched: ${matched.length}/${allAIWords.length}`);
console.log(`   - New words (no existing examples): ${matched.length - duplicates.length}`);
console.log(`   - Duplicates (already have examples): ${duplicates.length}`);
console.log(`\n❌ Not found in vocab: ${notFound.length}`);
console.log(`⚠️  Type mismatch: ${typeMismatch.length}`);

// Calculate coverage
const newCoverage = matched.length - duplicates.length;
const potentialTotal = wordsWithExamples.length + newCoverage;
const coveragePercent = ((potentialTotal / currentVocab.length) * 100).toFixed(1);

console.log('\n' + '='.repeat(80));
console.log('COVERAGE ANALYSIS');
console.log('='.repeat(80));
console.log(`Current coverage: ${wordsWithExamples.length}/1060 (${((wordsWithExamples.length/1060)*100).toFixed(1)}%)`);
console.log(`AI words that are NEW: ${newCoverage}`);
console.log(`Potential coverage: ${potentialTotal}/1060 (${coveragePercent}%)`);
console.log(`Still missing: ${1060 - potentialTotal}`);

// Show sample duplicates
if (duplicates.length > 0) {
  console.log('\n' + '='.repeat(80));
  console.log('SAMPLE DUPLICATES (first 10)');
  console.log('='.repeat(80));
  duplicates.slice(0, 10).forEach(d => {
    console.log(`${d.japanese} (${d.type}): AI=${d.aiExamples} examples, Existing=${d.existingExamples} examples`);
    console.log(`  AI ID: ${d.aiId}, Vocab ID: ${d.vocabId}, Source: ${d.source}`);
  });
}

// Show sample new words
const newWords = matched.filter(m => !m.isDuplicate);
if (newWords.length > 0) {
  console.log('\n' + '='.repeat(80));
  console.log('SAMPLE NEW WORDS (first 10)');
  console.log('='.repeat(80));
  newWords.slice(0, 10).forEach(w => {
    console.log(`${w.japanese} (${w.type}): ${w.exampleCount} AI examples`);
    console.log(`  AI ID: ${w.aiId}, Vocab ID: ${w.vocabId}, Source: ${w.source}`);
  });
}

// Save detailed reports
const reportPath = path.join(__dirname, 'ai-batch-analysis-report.json');
fs.writeFileSync(reportPath, JSON.stringify({
  summary: {
    totalAIWords: allAIWords.length,
    matched: matched.length,
    duplicates: duplicates.length,
    newWords: newCoverage,
    notFound: notFound.length,
    typeMismatch: typeMismatch.length,
    currentCoverage: wordsWithExamples.length,
    potentialCoverage: potentialTotal
  },
  matched,
  duplicates,
  notFound,
  typeMismatch
}, null, 2));

console.log(`\n📄 Detailed report saved: ai-batch-analysis-report.json`);
