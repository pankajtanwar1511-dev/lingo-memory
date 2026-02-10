import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load public vocab file
const publicPath = path.join(__dirname, '..', 'public', 'seed-data', 'duolingo_vocab_enhanced.json');
const data = JSON.parse(fs.readFileSync(publicPath, 'utf-8'));

console.log('Removing examples from public vocab file...');
console.log(`Original file: ${publicPath}`);
console.log(`Total words: ${data.length}`);

// Count words with examples before
const withExamplesBefore = data.filter((w: any) => w.exampleSentences && w.exampleSentences.length > 0).length;
console.log(`Words with examples before: ${withExamplesBefore}`);

// Remove exampleSentences from all words
const cleanData = data.map((word: any) => {
  const { exampleSentences, ...cleanWord } = word;
  return cleanWord;
});

// Save back to the same file
fs.writeFileSync(publicPath, JSON.stringify(cleanData, null, 2));

console.log('\n✅ Successfully removed all examples!');
console.log(`Updated file: ${publicPath}`);
console.log(`Words with examples after: 0`);
console.log(`\nBackup saved at: ${publicPath}.backup`);

// Show sample
console.log('\nSample word structure (after):');
console.log(JSON.stringify(cleanData[0], null, 2));
