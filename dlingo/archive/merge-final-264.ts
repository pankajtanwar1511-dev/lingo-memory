import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ExampleSentence {
  japanese: string;
  english: string;
  context: string;
  level: string;
  isAIGenerated: boolean;
}

interface Word {
  id: string;
  japanese: string;
  english: string;
  type: string;
  exampleSentences?: ExampleSentence[];
}

console.log('MERGING 264 EXAMPLES INTO FINAL VOCABULARY');
console.log('='.repeat(80));

// Load all 264 words from example files
const examplesDir = path.join(__dirname, 'remaining_264_examples');
const jsonFiles = [
  '1_50.json',
  '51_100.json',
  '101_150.json',
  '151_200.json',
  '201_remaining.json'
];

const new264Words: Map<string, Word> = new Map();

for (const file of jsonFiles) {
  const filePath = path.join(examplesDir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${file}`);
    continue;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(content);

  if (data.updatedWords && Array.isArray(data.updatedWords)) {
    for (const word of data.updatedWords) {
      new264Words.set(word.id, word);
    }
  }
}

console.log(`✓ Loaded ${new264Words.size} words with examples from remaining_264_examples folder\n`);

// Load current vocabulary
const vocabPath = path.join(__dirname, '../public/seed-data/duolingo_vocab_enhanced.json');
const currentVocab: Word[] = JSON.parse(fs.readFileSync(vocabPath, 'utf-8'));

console.log(`✓ Loaded ${currentVocab.length} words from current vocabulary\n`);

// Count current state
const beforeWithExamples = currentVocab.filter(w => w.exampleSentences && w.exampleSentences.length > 0).length;
const beforeWithoutExamples = currentVocab.filter(w => !w.exampleSentences || w.exampleSentences.length === 0).length;

console.log('BEFORE MERGE:');
console.log(`  Words with examples: ${beforeWithExamples}/${currentVocab.length} (${(beforeWithExamples / currentVocab.length * 100).toFixed(1)}%)`);
console.log(`  Words without examples: ${beforeWithoutExamples}/${currentVocab.length}\n`);

// Merge the 264 words
let mergedCount = 0;
let alreadyHadExamples = 0;
let notFoundInVocab = 0;

for (const [id, newWord] of new264Words.entries()) {
  const vocabIndex = currentVocab.findIndex(w => w.id === id);

  if (vocabIndex === -1) {
    notFoundInVocab++;
    console.log(`⚠️  Word ${id} (${newWord.japanese}) not found in vocabulary`);
    continue;
  }

  const vocabWord = currentVocab[vocabIndex];

  // Check if it already has examples
  if (vocabWord.exampleSentences && vocabWord.exampleSentences.length > 0) {
    alreadyHadExamples++;
    console.log(`⚠️  Word ${id} (${vocabWord.japanese}) already has ${vocabWord.exampleSentences.length} examples - skipping`);
    continue;
  }

  // Merge the examples
  currentVocab[vocabIndex] = {
    ...vocabWord,
    exampleSentences: newWord.exampleSentences || []
  };
  mergedCount++;
}

console.log('\n' + '='.repeat(80));
console.log('MERGE RESULTS:');
console.log('='.repeat(80));
console.log(`✅ Successfully merged: ${mergedCount} words`);
console.log(`⚠️  Already had examples: ${alreadyHadExamples} words`);
console.log(`❌ Not found in vocab: ${notFoundInVocab} words\n`);

// Count after merge
const afterWithExamples = currentVocab.filter(w => w.exampleSentences && w.exampleSentences.length > 0).length;
const afterWithoutExamples = currentVocab.filter(w => !w.exampleSentences || w.exampleSentences.length === 0).length;

console.log('AFTER MERGE:');
console.log(`  Words with examples: ${afterWithExamples}/${currentVocab.length} (${(afterWithExamples / currentVocab.length * 100).toFixed(1)}%)`);
console.log(`  Words without examples: ${afterWithoutExamples}/${currentVocab.length}\n`);

// Calculate total examples
let totalExamples = 0;
let duolingoExamples = 0;
let aiExamples = 0;

for (const word of currentVocab) {
  if (word.exampleSentences) {
    for (const example of word.exampleSentences) {
      totalExamples++;
      if (example.isAIGenerated) {
        aiExamples++;
      } else {
        duolingoExamples++;
      }
    }
  }
}

console.log('EXAMPLE STATISTICS:');
console.log(`  Total examples: ${totalExamples}`);
console.log(`  Duolingo examples: ${duolingoExamples}`);
console.log(`  AI-generated examples: ${aiExamples}\n`);

// Save updated vocabulary
const backupPath = path.join(__dirname, '../public/seed-data/duolingo_vocab_enhanced_before_264_merge.json');
fs.writeFileSync(backupPath, JSON.stringify(JSON.parse(fs.readFileSync(vocabPath, 'utf-8')), null, 2));
console.log(`✓ Backup created: duolingo_vocab_enhanced_before_264_merge.json\n`);

fs.writeFileSync(vocabPath, JSON.stringify(currentVocab, null, 2));
console.log(`✓ Updated vocabulary saved: duolingo_vocab_enhanced.json\n`);

// Final report
console.log('='.repeat(80));
console.log('FINAL REPORT');
console.log('='.repeat(80));

if (afterWithoutExamples === 0) {
  console.log('🎉 SUCCESS! ALL 1060 WORDS NOW HAVE EXAMPLES!\n');
} else {
  console.log(`⚠️  Still need examples for ${afterWithoutExamples} words:\n`);

  const stillMissing = currentVocab.filter(w => !w.exampleSentences || w.exampleSentences.length === 0);
  stillMissing.forEach((w, i) => {
    console.log(`${i + 1}. ${w.id}: ${w.japanese} (${w.english}) [${w.type}]`);
  });
}

console.log('\n' + '='.repeat(80));
console.log('Coverage improved from ' + (beforeWithExamples / currentVocab.length * 100).toFixed(1) + '% to ' + (afterWithExamples / currentVocab.length * 100).toFixed(1) + '%');
console.log('='.repeat(80));
