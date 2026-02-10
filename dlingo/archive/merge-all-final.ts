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

console.log('MERGING ALL EXAMPLES INTO FINAL COMPLETE VOCABULARY');
console.log('='.repeat(80));

// Load the file with AI batch examples (796 words)
const aiBatchPath = path.join(__dirname, 'duolingo-vocab-with-examples/duolingo_vocab_enhanced.json');
const aiBatchWords: Word[] = JSON.parse(fs.readFileSync(aiBatchPath, 'utf-8'));
console.log(`✓ Loaded ${aiBatchWords.length} words from duolingo-vocab-with-examples (has AI batch examples)`);

const aiBatchCount = aiBatchWords.filter(w => w.exampleSentences && w.exampleSentences.length > 0).length;
console.log(`  Words with examples: ${aiBatchCount}/${aiBatchWords.length}\n`);

// Load the file with new 264 examples (639 words)
const new264Path = path.join(__dirname, '../public/seed-data/duolingo_vocab_enhanced.json');
const new264Words: Word[] = JSON.parse(fs.readFileSync(new264Path, 'utf-8'));
console.log(`✓ Loaded ${new264Words.length} words from public/seed-data (has new 264 examples)`);

const new264Count = new264Words.filter(w => w.exampleSentences && w.exampleSentences.length > 0).length;
console.log(`  Words with examples: ${new264Count}/${new264Words.length}\n`);

// Create maps for easy lookup
const aiBatchMap = new Map<string, Word>();
aiBatchWords.forEach(w => aiBatchMap.set(w.id, w));

const new264Map = new Map<string, Word>();
new264Words.forEach(w => new264Map.set(w.id, w));

// Merge strategy:
// 1. Start with AI batch words (796 with examples)
// 2. For words in new264 that have examples, check if AI batch has them
// 3. If AI batch doesn't have examples, use new264 examples
// 4. If AI batch has examples, keep AI batch (because they were generated first)

console.log('MERGING STRATEGY:');
console.log('  1. Keep all AI batch examples (796 words)');
console.log('  2. Add new 264 examples for words NOT in AI batch');
console.log('  3. Combine all unique examples\n');

const finalVocab: Word[] = [];
let mergedFromAI = 0;
let mergedFromNew264 = 0;
let bothHadExamples = 0;
let combinedExamples = 0;

for (const word of aiBatchWords) {
  const aiWord = aiBatchMap.get(word.id)!;
  const new264Word = new264Map.get(word.id);

  const hasAIExamples = aiWord.exampleSentences && aiWord.exampleSentences.length > 0;
  const hasNew264Examples = new264Word?.exampleSentences && new264Word.exampleSentences.length > 0;

  if (hasAIExamples && hasNew264Examples) {
    // Both have examples - combine them
    bothHadExamples++;

    // Check if examples are different
    const combinedExampleSet = new Set<string>();
    const allExamples: ExampleSentence[] = [];

    // Add AI examples
    aiWord.exampleSentences!.forEach(ex => {
      const key = `${ex.japanese}|${ex.english}`;
      if (!combinedExampleSet.has(key)) {
        combinedExampleSet.add(key);
        allExamples.push(ex);
      }
    });

    // Add new264 examples if different
    new264Word.exampleSentences!.forEach(ex => {
      const key = `${ex.japanese}|${ex.english}`;
      if (!combinedExampleSet.has(key)) {
        combinedExampleSet.add(key);
        allExamples.push(ex);
        combinedExamples++;
      }
    });

    finalVocab.push({
      ...aiWord,
      exampleSentences: allExamples
    });
  } else if (hasAIExamples) {
    // Only AI has examples
    mergedFromAI++;
    finalVocab.push(aiWord);
  } else if (hasNew264Examples) {
    // Only new264 has examples
    mergedFromNew264++;
    finalVocab.push({
      ...aiWord,
      exampleSentences: new264Word.exampleSentences
    });
  } else {
    // Neither has examples
    finalVocab.push(aiWord);
  }
}

console.log('='.repeat(80));
console.log('MERGE RESULTS');
console.log('='.repeat(80));
console.log(`  Words with AI batch examples only: ${mergedFromAI}`);
console.log(`  Words with new 264 examples only: ${mergedFromNew264}`);
console.log(`  Words with BOTH (combined): ${bothHadExamples}`);
console.log(`  Additional examples from new264 added: ${combinedExamples}\n`);

// Count final stats
const finalWithExamples = finalVocab.filter(w => w.exampleSentences && w.exampleSentences.length > 0).length;
const finalWithoutExamples = finalVocab.filter(w => !w.exampleSentences || w.exampleSentences.length === 0).length;

let totalExamples = 0;
let duolingoExamples = 0;
let aiExamples = 0;

for (const word of finalVocab) {
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
console.log(`  Total words: ${finalVocab.length}`);
console.log(`  Words with examples: ${finalWithExamples}/${finalVocab.length} (${(finalWithExamples / finalVocab.length * 100).toFixed(1)}%)`);
console.log(`  Words without examples: ${finalWithoutExamples}/${finalVocab.length}`);
console.log(`\n  Total examples: ${totalExamples}`);
console.log(`  Duolingo examples: ${duolingoExamples}`);
console.log(`  AI-generated examples: ${aiExamples}\n`);

if (finalWithoutExamples === 0) {
  console.log('🎉🎉🎉 SUCCESS! ALL 1060 WORDS NOW HAVE EXAMPLES! 🎉🎉🎉\n');
} else {
  console.log(`⚠️  Still need examples for ${finalWithoutExamples} words\n`);
}

// Save to BOTH locations
const backupPath = path.join(__dirname, '../public/seed-data/duolingo_vocab_enhanced_before_final_merge.json');
fs.writeFileSync(backupPath, fs.readFileSync(new264Path, 'utf-8'));
console.log(`✓ Backup created: duolingo_vocab_enhanced_before_final_merge.json`);

fs.writeFileSync(new264Path, JSON.stringify(finalVocab, null, 2));
console.log(`✓ Final vocabulary saved to: public/seed-data/duolingo_vocab_enhanced.json`);

fs.writeFileSync(aiBatchPath, JSON.stringify(finalVocab, null, 2));
console.log(`✓ Final vocabulary saved to: duolingo-vocab-with-examples/duolingo_vocab_enhanced.json`);

console.log('\n' + '='.repeat(80));
console.log('✅ MERGE COMPLETE!');
console.log('='.repeat(80));
