import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load public vocab file
const publicPath = path.join(__dirname, '..', 'public', 'seed-data', 'duolingo_vocab_enhanced.json');
const data = JSON.parse(fs.readFileSync(publicPath, 'utf-8'));

console.log('Reversing IDs...');
console.log(`Total words: ${data.length}`);
console.log(`\nBefore:`);
console.log(`  First word: ${data[0].id} - ${data[0].japanese} (${data[0].english})`);
console.log(`  Last word: ${data[data.length - 1].id} - ${data[data.length - 1].japanese} (${data[data.length - 1].english})`);

// Reverse the IDs
const updatedData = data.map((word: any, index: number) => {
  const newId = `duo_${data.length - 1 - index}`;
  return {
    ...word,
    id: newId
  };
});

console.log(`\nAfter:`);
console.log(`  First word: ${updatedData[0].id} - ${updatedData[0].japanese} (${updatedData[0].english})`);
console.log(`  Last word: ${updatedData[updatedData.length - 1].id} - ${updatedData[updatedData.length - 1].japanese} (${updatedData[updatedData.length - 1].english})`);

// Save back
fs.writeFileSync(publicPath, JSON.stringify(updatedData, null, 2));

console.log(`\n✅ IDs successfully reversed!`);
console.log(`Updated file: ${publicPath}`);
