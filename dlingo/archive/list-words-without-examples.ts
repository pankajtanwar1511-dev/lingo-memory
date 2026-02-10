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

const vocabPath = path.join(__dirname, '../public/seed-data/duolingo_vocab_enhanced.json');
const vocabData: DuolingoWord[] = JSON.parse(fs.readFileSync(vocabPath, 'utf-8'));

// Filter words without examples
const wordsWithoutExamples = vocabData.filter(
  word => !word.exampleSentences || word.exampleSentences.length === 0
);

console.log(`Total words without examples: ${wordsWithoutExamples.length}\n`);

// Group by type
const byType = new Map<string, DuolingoWord[]>();
wordsWithoutExamples.forEach(word => {
  if (!byType.has(word.type)) {
    byType.set(word.type, []);
  }
  byType.get(word.type)!.push(word);
});

// Sort types by count (descending)
const sortedTypes = Array.from(byType.entries())
  .sort((a, b) => b[1].length - a[1].length);

// Print summary
console.log('📊 SUMMARY BY TYPE\n');
console.log('Type'.padEnd(15) + 'Count');
console.log('='.repeat(30));
for (const [type, words] of sortedTypes) {
  console.log(type.padEnd(15) + words.length);
}
console.log('\n');

// Create detailed output file
let output = `# Words Without Examples\n\n`;
output += `**Total**: ${wordsWithoutExamples.length} words\n`;
output += `**Date**: ${new Date().toISOString().split('T')[0]}\n\n`;
output += `---\n\n`;

for (const [type, words] of sortedTypes) {
  output += `## ${type.toUpperCase()} (${words.length} words)\n\n`;
  
  words.forEach(word => {
    output += `- **${word.japanese}** (${word.english})`;
    if (word.subtype) {
      output += ` - _${word.subtype}_`;
    }
    output += ` | ${word.id}\n`;
  });
  
  output += `\n`;
}

// Save to file
const outputPath = path.join(__dirname, 'words-without-examples.md');
fs.writeFileSync(outputPath, output, 'utf-8');
console.log(`✅ Detailed list saved to: words-without-examples.md\n`);

// Also create a simple CSV for easy import
let csv = 'id,japanese,english,type,subtype\n';
wordsWithoutExamples.forEach(word => {
  csv += `${word.id},"${word.japanese}","${word.english}",${word.type},${word.subtype || ''}\n`;
});
const csvPath = path.join(__dirname, 'words-without-examples.csv');
fs.writeFileSync(csvPath, csv, 'utf-8');
console.log(`✅ CSV file saved to: words-without-examples.csv\n`);
