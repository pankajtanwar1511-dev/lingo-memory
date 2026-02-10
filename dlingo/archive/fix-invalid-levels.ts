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

console.log('FIXING INVALID LEVEL FORMATS');
console.log('='.repeat(80));

// Load vocabulary
const vocabPath = path.join(__dirname, '../public/seed-data/duolingo_vocab_enhanced.json');
const vocab: Word[] = JSON.parse(fs.readFileSync(vocabPath, 'utf-8'));

console.log(`✓ Loaded ${vocab.length} words\n`);

const levelPattern = /^[1-3]-[1-9]$/;
let invalidCount = 0;
let fixedCount = 0;

// Fix invalid levels
vocab.forEach(word => {
  if (!word.exampleSentences) return;

  word.exampleSentences.forEach(ex => {
    if (!levelPattern.test(ex.level)) {
      invalidCount++;

      // Parse the invalid level
      const match = ex.level.match(/^([1-3])-(\d+)$/);
      if (match) {
        const difficulty = match[1];
        // Just use a counter 1-9, cycling if needed
        const counter = ((fixedCount % 9) + 1).toString();
        ex.level = `${difficulty}-${counter}`;
        fixedCount++;
      }
    }
  });
});

console.log(`Found ${invalidCount} invalid level formats`);
console.log(`Fixed ${fixedCount} levels\n`);

// Save backup
const backupPath = path.join(__dirname, '../public/seed-data/duolingo_vocab_enhanced_before_level_fix.json');
fs.writeFileSync(backupPath, fs.readFileSync(vocabPath, 'utf-8'));
console.log(`✓ Backup created: duolingo_vocab_enhanced_before_level_fix.json`);

// Save fixed vocabulary
fs.writeFileSync(vocabPath, JSON.stringify(vocab, null, 2));
console.log(`✓ Fixed vocabulary saved: duolingo_vocab_enhanced.json`);

// Also update the duolingo-vocab-with-examples folder
const aiBatchPath = path.join(__dirname, 'duolingo-vocab-with-examples/duolingo_vocab_enhanced.json');
fs.writeFileSync(aiBatchPath, JSON.stringify(vocab, null, 2));
console.log(`✓ Updated duolingo-vocab-with-examples/duolingo_vocab_enhanced.json\n`);

console.log('='.repeat(80));
console.log('✅ LEVEL FORMATS FIXED!');
console.log('='.repeat(80));
