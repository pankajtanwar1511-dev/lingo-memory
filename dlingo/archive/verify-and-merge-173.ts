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

interface WordUpdate {
  id: string;
  japanese: string;
  english: string;
  type: string;
  currentExamples: number;
  newExampleSentences: ExampleSentence[];
}

interface Word {
  id: string;
  japanese: string;
  english: string;
  type: string;
  exampleSentences?: ExampleSentence[];
}

console.log('VERIFYING AND MERGING 173 ADDITIONAL EXAMPLES');
console.log('='.repeat(80));

// Load the new examples
const newExamplesPath = path.join(__dirname, 'remaining_173_few_examples/examples.json');
const newExamplesData = JSON.parse(fs.readFileSync(newExamplesPath, 'utf-8'));
const newExamples: WordUpdate[] = newExamplesData.updatedWords || [];

console.log(`✓ Loaded ${newExamples.length} word updates from examples.json\n`);

// Load current vocabulary
const vocabPath = path.join(__dirname, '../public/seed-data/duolingo_vocab_enhanced.json');
const currentVocab: Word[] = JSON.parse(fs.readFileSync(vocabPath, 'utf-8'));

console.log(`✓ Loaded ${currentVocab.length} words from current vocabulary\n`);

// Get words that need more examples
const wordsNeedingMore = currentVocab.filter(w => {
  const count = w.exampleSentences?.length || 0;
  return count < 3;
});

console.log(`✓ Found ${wordsNeedingMore.length} words needing more examples\n`);

console.log('='.repeat(80));
console.log('VERIFICATION');
console.log('='.repeat(80));

// Verify each word update
const issues: string[] = [];
const verified: string[] = [];
let totalNewExamples = 0;

const newExamplesMap = new Map<string, WordUpdate>();
newExamples.forEach(w => newExamplesMap.set(w.id, w));

for (const word of wordsNeedingMore) {
  const update = newExamplesMap.get(word.id);
  const currentCount = word.exampleSentences?.length || 0;
  const needed = 3 - currentCount;

  if (!update) {
    issues.push(`❌ ${word.id} (${word.japanese}): Missing in examples.json`);
    continue;
  }

  // Verify it has the correct number of new examples
  const newCount = update.newExampleSentences?.length || 0;

  if (newCount !== needed) {
    issues.push(`⚠️  ${word.id} (${word.japanese}): Has ${currentCount} examples, needs ${needed} more, but got ${newCount} new examples`);
  }

  // Verify japanese and type match
  if (update.japanese !== word.japanese) {
    issues.push(`⚠️  ${word.id}: Japanese mismatch - expected "${word.japanese}", got "${update.japanese}"`);
  }

  if (update.type !== word.type) {
    issues.push(`⚠️  ${word.id}: Type mismatch - expected "${word.type}", got "${update.type}"`);
  }

  // Verify currentExamples matches
  if (update.currentExamples !== currentCount) {
    issues.push(`⚠️  ${word.id}: currentExamples mismatch - actual: ${currentCount}, stated: ${update.currentExamples}`);
  }

  if (newCount === needed && update.japanese === word.japanese && update.type === word.type) {
    verified.push(`✅ ${word.id} (${word.japanese}): ${currentCount} → ${currentCount + newCount} examples`);
    totalNewExamples += newCount;
  }
}

// Check for extra words in examples.json
for (const update of newExamples) {
  const vocabWord = currentVocab.find(w => w.id === update.id);
  if (!vocabWord) {
    issues.push(`⚠️  ${update.id} (${update.japanese}): Word not found in vocabulary`);
  } else {
    const currentCount = vocabWord.exampleSentences?.length || 0;
    if (currentCount >= 3) {
      issues.push(`⚠️  ${update.id} (${update.japanese}): Already has ${currentCount} examples, doesn't need more`);
    }
  }
}

console.log(`\n✅ Verified: ${verified.length} words`);
console.log(`⚠️  Issues: ${issues.length}\n`);

if (issues.length > 0) {
  console.log('ISSUES FOUND:');
  console.log('='.repeat(80));
  issues.forEach(issue => console.log(issue));
  console.log('\n');
}

// If verification passed, proceed with merge
if (issues.length === 0) {
  console.log('='.repeat(80));
  console.log('MERGING EXAMPLES');
  console.log('='.repeat(80));

  const vocabMap = new Map<string, Word>();
  currentVocab.forEach(w => vocabMap.set(w.id, w));

  let mergedCount = 0;
  let examplesAdded = 0;

  for (const update of newExamples) {
    const vocabWord = vocabMap.get(update.id);
    if (!vocabWord) continue;

    // Add new examples to existing ones
    const currentExamples = vocabWord.exampleSentences || [];
    const newExamplesList = update.newExampleSentences || [];

    vocabWord.exampleSentences = [...currentExamples, ...newExamplesList];
    mergedCount++;
    examplesAdded += newExamplesList.length;
  }

  console.log(`\n✅ Merged ${mergedCount} words`);
  console.log(`✅ Added ${examplesAdded} new examples\n`);

  // Count final stats
  const finalWith3orMore = currentVocab.filter(w => (w.exampleSentences?.length || 0) >= 3).length;
  const finalWithLess = currentVocab.filter(w => (w.exampleSentences?.length || 0) < 3).length;

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

  console.log('FINAL STATISTICS');
  console.log('='.repeat(80));
  console.log(`  Total words: ${currentVocab.length}`);
  console.log(`  Words with 3+ examples: ${finalWith3orMore}/${currentVocab.length} (${(finalWith3orMore / currentVocab.length * 100).toFixed(1)}%)`);
  console.log(`  Words with <3 examples: ${finalWithLess}/${currentVocab.length}`);
  console.log(`\n  Total examples: ${totalExamples}`);
  console.log(`  Duolingo examples: ${duolingoExamples}`);
  console.log(`  AI-generated examples: ${aiExamples}\n`);

  // Save backup
  const backupPath = path.join(__dirname, '../public/seed-data/duolingo_vocab_enhanced_before_173_merge.json');
  fs.writeFileSync(backupPath, fs.readFileSync(vocabPath, 'utf-8'));
  console.log(`✓ Backup created: duolingo_vocab_enhanced_before_173_merge.json`);

  // Save updated vocabulary
  fs.writeFileSync(vocabPath, JSON.stringify(currentVocab, null, 2));
  console.log(`✓ Updated vocabulary saved: duolingo_vocab_enhanced.json\n`);

  // Also update the duolingo-vocab-with-examples folder
  const aiBatchPath = path.join(__dirname, 'duolingo-vocab-with-examples/duolingo_vocab_enhanced.json');
  fs.writeFileSync(aiBatchPath, JSON.stringify(currentVocab, null, 2));
  console.log(`✓ Updated duolingo-vocab-with-examples/duolingo_vocab_enhanced.json\n`);

  console.log('='.repeat(80));
  if (finalWithLess === 0) {
    console.log('🎉🎉🎉 ALL 1060 WORDS NOW HAVE AT LEAST 3 EXAMPLES! 🎉🎉🎉');
  } else {
    console.log(`⚠️  ${finalWithLess} words still have fewer than 3 examples`);
  }
  console.log('='.repeat(80));

} else {
  console.log('='.repeat(80));
  console.log('❌ MERGE CANCELLED - Please fix the issues above first');
  console.log('='.repeat(80));
}
