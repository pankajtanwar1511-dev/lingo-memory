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
  exampleSentences?: any[];
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

console.log('ANALYZING REMAINING WORDS');
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
  if (!fs.existsSync(filepath)) continue;

  let words: WordWithExamples[];
  if (file.type === 'md') {
    words = parseMdFile(filepath);
  } else {
    words = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
  }

  words.forEach(w => w.source = file.path);
  allAIWords.push(...words);
}

console.log(`✓ Loaded ${allAIWords.length} AI words from batch files\n`);

// Load current vocabulary
const vocabPath = path.join(__dirname, 'duolingo-vocab-with-examples', 'duolingo_vocab_enhanced.json');
const currentVocab: WordWithExamples[] = JSON.parse(fs.readFileSync(vocabPath, 'utf-8'));

console.log(`✓ Loaded ${currentVocab.length} words from current vocab\n`);

// Create maps
const vocabByJapaneseType = new Map<string, WordWithExamples>();
const vocabByJapanese = new Map<string, WordWithExamples[]>();

currentVocab.forEach(w => {
  const key = `${w.japanese}|${w.type}`;
  vocabByJapaneseType.set(key, w);

  if (!vocabByJapanese.has(w.japanese)) {
    vocabByJapanese.set(w.japanese, []);
  }
  vocabByJapanese.get(w.japanese)!.push(w);
});

const aiByJapaneseType = new Map<string, WordWithExamples>();
allAIWords.forEach(w => {
  const key = `${w.japanese}|${w.type}`;
  aiByJapaneseType.set(key, w);
});

// 1. Find 162 words in batch files but NOT in vocab
console.log('='.repeat(80));
console.log('1. WORDS IN BATCH FILES BUT NOT IN VOCAB (162 expected)');
console.log('='.repeat(80));

const notInVocab: any[] = [];
const typeMismatches: any[] = [];

for (const aiWord of allAIWords) {
  const key = `${aiWord.japanese}|${aiWord.type}`;
  const vocabWord = vocabByJapaneseType.get(key);

  if (!vocabWord) {
    // Check if same Japanese exists with different type
    const sameJapanese = vocabByJapanese.get(aiWord.japanese);

    if (sameJapanese && sameJapanese.length > 0) {
      typeMismatches.push({
        japanese: aiWord.japanese,
        aiType: aiWord.type,
        vocabTypes: sameJapanese.map(v => v.type).join(', '),
        aiId: aiWord.id,
        vocabIds: sameJapanese.map(v => v.id).join(', '),
        source: aiWord.source
      });
    } else {
      notInVocab.push({
        japanese: aiWord.japanese,
        english: aiWord.english,
        type: aiWord.type,
        aiId: aiWord.id,
        exampleCount: aiWord.exampleSentences?.length || 0,
        source: aiWord.source
      });
    }
  }
}

console.log(`\nTotal NOT in vocab: ${notInVocab.length}`);
console.log(`Type mismatches: ${typeMismatches.length}\n`);

// 2. Find 264 words without examples
console.log('='.repeat(80));
console.log('2. WORDS WITHOUT EXAMPLES (264 expected)');
console.log('='.repeat(80));

const withoutExamples = currentVocab.filter(w =>
  !w.exampleSentences || w.exampleSentences.length === 0
);

console.log(`\nTotal without examples: ${withoutExamples.length}\n`);

// Check if any of these 264 are actually in batch files
const inBatchFiles: any[] = [];
const notInBatchFiles: any[] = [];

for (const word of withoutExamples) {
  const key = `${word.japanese}|${word.type}`;
  const aiWord = aiByJapaneseType.get(key);

  if (aiWord) {
    inBatchFiles.push({
      japanese: word.japanese,
      english: word.english,
      type: word.type,
      vocabId: word.id,
      aiId: aiWord.id,
      aiExamples: aiWord.exampleSentences?.length || 0,
      source: aiWord.source
    });
  } else {
    notInBatchFiles.push({
      japanese: word.japanese,
      english: word.english,
      type: word.type,
      vocabId: word.id
    });
  }
}

console.log(`Words without examples that ARE in batch files: ${inBatchFiles.length}`);
console.log(`Words without examples that are NOT in batch files: ${notInBatchFiles.length}\n`);

// Summary Report
console.log('='.repeat(80));
console.log('SUMMARY');
console.log('='.repeat(80));

console.log('\n📊 List 1: Words in batch files but NOT in vocab');
console.log(`   Total: ${notInVocab.length}`);
console.log(`   (These are extra words AI generated that we don't have)`);

console.log('\n📊 List 2: Words without examples');
console.log(`   Total: ${withoutExamples.length}`);
console.log(`   - Found in batch files: ${inBatchFiles.length} ⚠️ (WHY weren't they added?)`);
console.log(`   - NOT in batch files: ${notInBatchFiles.length} ✓ (Need to generate)`);

console.log('\n📊 Type Mismatches:');
console.log(`   Total: ${typeMismatches.length}`);
console.log(`   (Same Japanese word, different type/category)`);

// Save detailed lists
const report = {
  timestamp: new Date().toISOString(),
  summary: {
    notInVocab: notInVocab.length,
    withoutExamples: withoutExamples.length,
    withoutExamplesInBatch: inBatchFiles.length,
    withoutExamplesNotInBatch: notInBatchFiles.length,
    typeMismatches: typeMismatches.length
  },
  lists: {
    notInVocab,
    withoutExamples: notInBatchFiles,
    withoutExamplesButInBatch: inBatchFiles,
    typeMismatches
  }
};

const reportPath = path.join(__dirname, 'remaining-words-analysis.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

console.log(`\n📄 Detailed report saved: remaining-words-analysis.json`);

// Save readable lists
const list1Path = path.join(__dirname, 'list-1-not-in-vocab.txt');
let list1Content = `WORDS IN BATCH FILES BUT NOT IN VOCAB (${notInVocab.length} words)\n`;
list1Content += '='.repeat(80) + '\n\n';
notInVocab.forEach((w, i) => {
  list1Content += `${i + 1}. ${w.japanese} (${w.english}) [${w.type}]\n`;
  list1Content += `   AI ID: ${w.aiId}, Examples: ${w.exampleCount}, Source: ${w.source}\n\n`;
});
fs.writeFileSync(list1Path, list1Content);

const list2Path = path.join(__dirname, 'list-2-without-examples.txt');
let list2Content = `WORDS WITHOUT EXAMPLES - NOT IN BATCH FILES (${notInBatchFiles.length} words)\n`;
list2Content += '='.repeat(80) + '\n\n';
notInBatchFiles.forEach((w, i) => {
  list2Content += `${i + 1}. ${w.japanese} (${w.english}) [${w.type}]\n`;
  list2Content += `   Vocab ID: ${w.vocabId}\n\n`;
});
fs.writeFileSync(list2Path, list2Content);

const list3Path = path.join(__dirname, 'list-3-type-mismatches.txt');
let list3Content = `TYPE MISMATCHES (${typeMismatches.length} words)\n`;
list3Content += '='.repeat(80) + '\n\n';
typeMismatches.forEach((w, i) => {
  list3Content += `${i + 1}. ${w.japanese}\n`;
  list3Content += `   AI Type: ${w.aiType}, Vocab Type: ${w.vocabTypes}\n`;
  list3Content += `   AI ID: ${w.aiId}, Vocab ID: ${w.vocabIds}\n`;
  list3Content += `   Source: ${w.source}\n\n`;
});
fs.writeFileSync(list3Path, list3Content);

if (inBatchFiles.length > 0) {
  const list4Path = path.join(__dirname, 'list-4-without-examples-but-in-batch.txt');
  let list4Content = `WORDS WITHOUT EXAMPLES BUT FOUND IN BATCH FILES (${inBatchFiles.length} words)\n`;
  list4Content += 'WHY WEREN\'T THESE ADDED? NEEDS INVESTIGATION!\n';
  list4Content += '='.repeat(80) + '\n\n';
  inBatchFiles.forEach((w, i) => {
    list4Content += `${i + 1}. ${w.japanese} (${w.english}) [${w.type}]\n`;
    list4Content += `   Vocab ID: ${w.vocabId}, AI ID: ${w.aiId}\n`;
    list4Content += `   AI Examples: ${w.aiExamples}, Source: ${w.source}\n\n`;
  });
  fs.writeFileSync(list4Path, list4Content);
  console.log('📄 list-4-without-examples-but-in-batch.txt');
}

console.log('📄 list-1-not-in-vocab.txt');
console.log('📄 list-2-without-examples.txt');
console.log('📄 list-3-type-mismatches.txt');

console.log('\n' + '='.repeat(80));
