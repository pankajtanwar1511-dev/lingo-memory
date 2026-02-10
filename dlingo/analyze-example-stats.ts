import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Word {
  id: string;
  japanese: string;
  english: string;
  type: string;
  exampleSentences?: any[];
}

console.log('ANALYZING EXAMPLE SENTENCE STATISTICS');
console.log('='.repeat(80));

// Load final vocabulary
const vocabPath = path.join(__dirname, '../public/seed-data/duolingo_vocab_enhanced.json');
const vocab: Word[] = JSON.parse(fs.readFileSync(vocabPath, 'utf-8'));

console.log(`Total words: ${vocab.length}\n`);

// Count examples per word
const exampleCounts = new Map<number, number>();
const wordsWithLessThan3: Word[] = [];
const wordsWithExactly3: Word[] = [];
const wordsWithMoreThan3: Word[] = [];

for (const word of vocab) {
  const exampleCount = word.exampleSentences?.length || 0;

  exampleCounts.set(exampleCount, (exampleCounts.get(exampleCount) || 0) + 1);

  if (exampleCount < 3) {
    wordsWithLessThan3.push(word);
  } else if (exampleCount === 3) {
    wordsWithExactly3.push(word);
  } else {
    wordsWithMoreThan3.push(word);
  }
}

// Sort example counts
const sortedCounts = Array.from(exampleCounts.entries()).sort((a, b) => a[0] - b[0]);

console.log('DISTRIBUTION OF EXAMPLES PER WORD:');
console.log('='.repeat(80));
sortedCounts.forEach(([count, words]) => {
  const percentage = (words / vocab.length * 100).toFixed(1);
  const bar = '█'.repeat(Math.floor(words / 20));
  console.log(`  ${count} examples: ${words.toString().padStart(4)} words (${percentage.padStart(5)}%) ${bar}`);
});

console.log('\n' + '='.repeat(80));
console.log('SUMMARY');
console.log('='.repeat(80));

const with0 = exampleCounts.get(0) || 0;
const with1 = exampleCounts.get(1) || 0;
const with2 = exampleCounts.get(2) || 0;
const with3orMore = wordsWithExactly3.length + wordsWithMoreThan3.length;

console.log(`\n📊 Words with 0 examples: ${with0} (${(with0 / vocab.length * 100).toFixed(1)}%)`);
console.log(`📊 Words with 1 example: ${with1} (${(with1 / vocab.length * 100).toFixed(1)}%)`);
console.log(`📊 Words with 2 examples: ${with2} (${(with2 / vocab.length * 100).toFixed(1)}%)`);
console.log(`📊 Words with 3+ examples: ${with3orMore} (${(with3orMore / vocab.length * 100).toFixed(1)}%)`);

console.log(`\n✅ Words with exactly 3 examples: ${wordsWithExactly3.length}`);
console.log(`✅ Words with more than 3 examples: ${wordsWithMoreThan3.length}`);
console.log(`⚠️  Words with less than 3 examples: ${wordsWithLessThan3.length}`);

if (wordsWithLessThan3.length > 0) {
  console.log('\n' + '='.repeat(80));
  console.log(`WORDS WITH LESS THAN 3 EXAMPLES (${wordsWithLessThan3.length} words)`);
  console.log('='.repeat(80));

  // Group by example count
  const grouped = new Map<number, Word[]>();
  wordsWithLessThan3.forEach(w => {
    const count = w.exampleSentences?.length || 0;
    if (!grouped.has(count)) grouped.set(count, []);
    grouped.get(count)!.push(w);
  });

  // Show each group
  for (const [count, words] of Array.from(grouped.entries()).sort((a, b) => a[0] - b[0])) {
    console.log(`\n${count} example(s) - ${words.length} words:`);
    words.slice(0, 20).forEach(w => {
      console.log(`  ${w.id}: ${w.japanese} (${w.english}) [${w.type}]`);
    });
    if (words.length > 20) {
      console.log(`  ... and ${words.length - 20} more`);
    }
  }
}

// Calculate average
const totalExamples = vocab.reduce((sum, w) => sum + (w.exampleSentences?.length || 0), 0);
const avgExamples = (totalExamples / vocab.length).toFixed(2);

console.log('\n' + '='.repeat(80));
console.log('OVERALL STATISTICS');
console.log('='.repeat(80));
console.log(`  Total words: ${vocab.length}`);
console.log(`  Total examples: ${totalExamples}`);
console.log(`  Average examples per word: ${avgExamples}`);
console.log(`  Min examples: ${Math.min(...Array.from(exampleCounts.keys()))}`);
console.log(`  Max examples: ${Math.max(...Array.from(exampleCounts.keys()))}`);

console.log('\n' + '='.repeat(80));
if (wordsWithLessThan3.length === 0) {
  console.log('🎉 ALL WORDS HAVE AT LEAST 3 EXAMPLES!');
} else {
  console.log(`⚠️  ${wordsWithLessThan3.length} words still need more examples to reach 3`);
}
console.log('='.repeat(80));
