import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load both files
const duolingoFolderFile = path.join(__dirname, 'duolingo_vocab_enhanced.json');
const publicSeedDataFile = path.join(__dirname, '..', 'public', 'seed-data', 'duolingo_vocab_enhanced.json');

const duolingoData = JSON.parse(fs.readFileSync(duolingoFolderFile, 'utf-8'));
const publicData = JSON.parse(fs.readFileSync(publicSeedDataFile, 'utf-8'));

console.log('FILE COMPARISON');
console.log('='.repeat(80));

console.log('\n📁 Duolingo Folder File:');
console.log(`  Path: ${duolingoFolderFile}`);
console.log(`  Words: ${duolingoData.length}`);
console.log(`  Structure:`);
console.log(JSON.stringify(duolingoData[0], null, 2).split('\n').slice(0, 15).join('\n'));

console.log('\n📁 Public Seed Data File:');
console.log(`  Path: ${publicSeedDataFile}`);
console.log(`  Words: ${publicData.length}`);
console.log(`  Structure:`);
console.log(JSON.stringify(publicData[0], null, 2).split('\n').slice(0, 15).join('\n'));

// Check examples
const duolingoWithExamples = duolingoData.filter((w: any) => w.examples && w.examples.length > 0);
const publicWithExamples = publicData.filter((w: any) => w.exampleSentences && w.exampleSentences.length > 0);

console.log('\n\n📊 EXAMPLES COMPARISON:');
console.log('='.repeat(80));
console.log(`Duolingo folder: ${duolingoWithExamples.length}/${duolingoData.length} words have examples`);
console.log(`Public seed data: ${publicWithExamples.length}/${publicData.length} words have examples`);

// Check if examples in duolingo folder file are correct
if (duolingoWithExamples.length > 0) {
  console.log('\n📝 Sample word with examples from Duolingo folder:');
  const sample = duolingoWithExamples[0];
  console.log(`Word: ${sample.japanese} (${sample.english})`);
  console.log(`Examples:`);
  sample.examples.forEach((ex: any, i: number) => {
    console.log(`  ${i + 1}. ${ex.japanese || ex}`);
  });
}

if (publicWithExamples.length > 0) {
  console.log('\n📝 Sample word with examples from Public seed data:');
  const sample = publicWithExamples[0];
  console.log(`Word: ${sample.japanese} (${sample.english})`);
  console.log(`Examples:`);
  sample.exampleSentences.forEach((ex: any, i: number) => {
    console.log(`  ${i + 1}. ${ex.japanese}`);
  });
}

console.log('\n\n' + '='.repeat(80));
console.log('RECOMMENDATION:');
console.log('='.repeat(80));
if (duolingoWithExamples.length > publicWithExamples.length) {
  console.log('✅ Duolingo folder file has MORE examples - might be better!');
} else if (publicWithExamples.length > duolingoWithExamples.length) {
  console.log('⚠️  Public seed data file has MORE examples');
} else {
  console.log('Both files have the same number of words with examples');
}
