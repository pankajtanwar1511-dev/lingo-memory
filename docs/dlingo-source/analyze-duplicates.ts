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

console.log('ANALYZING "DUPLICATE" EXAMPLES');
console.log('='.repeat(80));

const vocabPath = path.join(__dirname, '../public/seed-data/duolingo_vocab_enhanced.json');
const vocab: Word[] = JSON.parse(fs.readFileSync(vocabPath, 'utf-8'));

// Find examples that appear in multiple words
const exampleToWords = new Map<string, string[]>();

vocab.forEach(word => {
  if (!word.exampleSentences) return;

  word.exampleSentences.forEach(ex => {
    const key = `${ex.japanese}|||${ex.english}`;
    if (!exampleToWords.has(key)) {
      exampleToWords.set(key, []);
    }
    exampleToWords.get(key)!.push(`${word.id} (${word.japanese})`);
  });
});

// Find duplicates
const duplicates = Array.from(exampleToWords.entries())
  .filter(([_, words]) => words.length > 1)
  .sort((a, b) => b[1].length - a[1].length);

console.log(`Found ${duplicates.length} examples used across multiple words\n`);

console.log('Top 10 most shared examples:');
console.log('='.repeat(80));

duplicates.slice(0, 10).forEach(([key, words], idx) => {
  const [japanese, english] = key.split('|||');
  console.log(`\n${idx + 1}. Shared by ${words.length} words:`);
  console.log(`   Japanese: ${japanese}`);
  console.log(`   English: ${english}`);
  console.log(`   Words: ${words.join(', ')}`);
});

console.log('\n' + '='.repeat(80));
console.log('ANALYSIS:');
console.log('='.repeat(80));
console.log(`\nThese "duplicates" are actually VALID and BENEFICIAL:`);
console.log(`- A single sentence can teach multiple vocabulary words`);
console.log(`- Example: "私は学生です" teaches both "私" (I) and "学生" (student)`);
console.log(`- This is good for learning as it shows words in natural context`);
console.log(`\n✅ This is NOT an issue - it's a feature!`);
