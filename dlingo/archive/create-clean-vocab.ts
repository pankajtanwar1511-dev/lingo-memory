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
  subtype?: string;
  exampleSentences?: any[];
}

// Load vocabulary
const vocabPath = path.join(__dirname, '..', 'public', 'seed-data', 'duolingo_vocab_enhanced.json');
const vocabulary: DuolingoWord[] = JSON.parse(fs.readFileSync(vocabPath, 'utf-8'));

// Strip example sentences
const cleanVocabulary = vocabulary.map(word => {
  const { exampleSentences, ...cleanWord } = word;
  return cleanWord;
});

// Save to backup folder
const outputPath = path.join(__dirname, 'final-word-level-category-without-example', 'duolingo_vocab_clean.json');
fs.writeFileSync(outputPath, JSON.stringify(cleanVocabulary, null, 2));

console.log(`✓ Created clean vocabulary file without examples`);
console.log(`  Output: ${outputPath}`);
console.log(`  Words: ${cleanVocabulary.length}`);
