import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load duolingo folder vocab file
const sourcePath = path.join(__dirname, 'duolingo_vocab_enhanced.json');
const data = JSON.parse(fs.readFileSync(sourcePath, 'utf-8'));

// Remove examples field from each word
const cleanData = data.map((word: any) => {
  const { examples, ...cleanWord } = word;
  return cleanWord;
});

// Save to backup folder
const outputPath = path.join(__dirname, 'final-word-level-category-without-example', 'duolingo_vocab_enhanced.json');
fs.writeFileSync(outputPath, JSON.stringify(cleanData, null, 2));

console.log(`✓ Copied duolingo folder vocab file (without examples) to backup folder`);
console.log(`  Source: ${sourcePath}`);
console.log(`  Output: ${outputPath}`);
console.log(`  Words: ${cleanData.length}`);
console.log(`\nSample word structure:`);
console.log(JSON.stringify(cleanData[0], null, 2));
