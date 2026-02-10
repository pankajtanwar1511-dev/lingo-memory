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

// Load the 264 words list
const list264Path = path.join(__dirname, 'list-2-without-examples.txt');
const list264Content = fs.readFileSync(list264Path, 'utf-8');

// Parse the 264 words from the text file
const expected264Words: Map<string, { id: string; japanese: string; english: string; type: string }> = new Map();
const lines = list264Content.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  // Look for pattern: number. japanese (english) [type]
  const match = line.match(/^\d+\.\s+(.+?)\s+\((.+?)\)\s+\[(.+?)\]$/);
  if (match) {
    const japanese = match[1];
    const english = match[2];
    const type = match[3];
    // Get vocab ID from next line
    const nextLine = lines[i + 1];
    const idMatch = nextLine?.match(/Vocab ID:\s+(duo_\d+)/);
    if (idMatch) {
      const id = idMatch[1];
      expected264Words.set(id, { id, japanese, english, type });
    }
  }
}

console.log(`Expected 264 words loaded: ${expected264Words.size}\n`);

// Load all JSON files from remaining_264_examples folder
const examplesDir = path.join(__dirname, 'remaining_264_examples');
const jsonFiles = [
  '1_50.json',
  '51_100.json',
  '101_150.json',
  '151_200.json',
  '201_remaining.json'
];

const allWordsWithExamples: Map<string, Word> = new Map();
const issues: string[] = [];

for (const file of jsonFiles) {
  const filePath = path.join(examplesDir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${file}`);
    continue;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(content);

  if (data.updatedWords && Array.isArray(data.updatedWords)) {
    for (const word of data.updatedWords) {
      allWordsWithExamples.set(word.id, word);
    }
  }
}

console.log(`Total words found in example files: ${allWordsWithExamples.size}\n`);

// Check alignment and matching
console.log('='.repeat(80));
console.log('VERIFICATION REPORT');
console.log('='.repeat(80));

let perfectMatches = 0;
let missingWords = 0;
let mismatchedJapanese = 0;
let mismatchedType = 0;
let missingExamples = 0;

const missingWordsList: string[] = [];
const mismatchedList: string[] = [];
const noExamplesList: string[] = [];

for (const [expectedId, expectedWord] of expected264Words.entries()) {
  const actualWord = allWordsWithExamples.get(expectedId);

  if (!actualWord) {
    missingWords++;
    missingWordsList.push(`${expectedId}: ${expectedWord.japanese} (${expectedWord.english}) [${expectedWord.type}]`);
    continue;
  }

  let hasIssue = false;
  const issueDetails: string[] = [];

  // Check japanese matching
  if (actualWord.japanese !== expectedWord.japanese) {
    mismatchedJapanese++;
    hasIssue = true;
    issueDetails.push(`  Japanese mismatch: expected "${expectedWord.japanese}", got "${actualWord.japanese}"`);
  }

  // Check type matching
  if (actualWord.type !== expectedWord.type) {
    mismatchedType++;
    hasIssue = true;
    issueDetails.push(`  Type mismatch: expected "${expectedWord.type}", got "${actualWord.type}"`);
  }

  // Check examples
  if (!actualWord.exampleSentences || actualWord.exampleSentences.length === 0) {
    missingExamples++;
    hasIssue = true;
    issueDetails.push(`  No example sentences found`);
    noExamplesList.push(`${expectedId}: ${expectedWord.japanese}`);
  }

  if (hasIssue) {
    mismatchedList.push(`${expectedId}: ${expectedWord.japanese}\n${issueDetails.join('\n')}`);
  } else {
    perfectMatches++;
  }
}

console.log(`\n✅ Perfect matches: ${perfectMatches}/${expected264Words.size}`);
console.log(`❌ Missing words: ${missingWords}`);
console.log(`⚠️  Japanese mismatches: ${mismatchedJapanese}`);
console.log(`⚠️  Type mismatches: ${mismatchedType}`);
console.log(`⚠️  Words without examples: ${missingExamples}`);

if (missingWordsList.length > 0) {
  console.log('\n' + '='.repeat(80));
  console.log('MISSING WORDS');
  console.log('='.repeat(80));
  missingWordsList.forEach(w => console.log(w));
}

if (mismatchedList.length > 0) {
  console.log('\n' + '='.repeat(80));
  console.log('MISMATCHED WORDS');
  console.log('='.repeat(80));
  mismatchedList.forEach(w => console.log(w + '\n'));
}

if (noExamplesList.length > 0) {
  console.log('\n' + '='.repeat(80));
  console.log('WORDS WITHOUT EXAMPLES');
  console.log('='.repeat(80));
  noExamplesList.forEach(w => console.log(w));
}

// Summary
console.log('\n' + '='.repeat(80));
console.log('SUMMARY');
console.log('='.repeat(80));

if (perfectMatches === expected264Words.size) {
  console.log('✅ ALL 264 WORDS HAVE BEEN SUCCESSFULLY MATCHED WITH EXAMPLES!');
} else {
  console.log(`⚠️  ${expected264Words.size - perfectMatches} words still need attention.`);
}

console.log('\n📊 File Distribution:');
jsonFiles.forEach(file => {
  const filePath = path.join(examplesDir, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    const count = data.updatedWords?.length || 0;
    console.log(`  ${file}: ${count} words`);
  }
});
