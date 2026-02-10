import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse the markdown file
function parseExamplesReview(mdPath: string): Map<string, any> {
  const content = fs.readFileSync(mdPath, 'utf-8');
  const lines = content.split('\n');

  const wordsMap = new Map();
  let currentWord: any = null;
  let currentExample: any = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Word header: ### おちゃ (green teas, green tea, tea)
    if (line.startsWith('### ')) {
      const match = line.match(/^### (.+?) \((.+?)\)$/);
      if (match) {
        currentWord = {
          japanese: match[1],
          english: match[2],
          id: '',
          type: '',
          examples: []
        };
      }
    }

    // ID and Type: **ID**: duo_1059 | **Type**: noun
    if (line.includes('**ID**:') && currentWord) {
      const idMatch = line.match(/\*\*ID\*\*:\s*(\S+)/);
      const typeMatch = line.match(/\*\*Type\*\*:\s*(\S+)/);
      if (idMatch) currentWord.id = idMatch[1];
      if (typeMatch) currentWord.type = typeMatch[1];
    }

    // Example entry: 1. 💬 **STATEMENT** | Level 1-1 | 📘 Duolingo
    if (/^\d+\.\s+[💬❓✅]/.test(line) && currentWord) {
      const contextMatch = line.match(/\*\*(STATEMENT|QUESTION|ANSWER)\*\*/);
      const levelMatch = line.match(/Level\s+([\d-]+)/);

      currentExample = {
        context: contextMatch ? contextMatch[1].toLowerCase() : 'statement',
        level: levelMatch ? levelMatch[1] : '',
        isAIGenerated: line.includes('🤖') // 🤖 for AI, 📘 for Duolingo
      };
    }

    // Japanese sentence: - JP: おちゃ、ください！
    if (line.trim().startsWith('- JP:') && currentExample) {
      currentExample.japanese = line.replace(/^\s*-\s*JP:\s*/, '').trim();
    }

    // English sentence: - EN: Green tea, please!
    if (line.trim().startsWith('- EN:') && currentExample) {
      currentExample.english = line.replace(/^\s*-\s*EN:\s*/, '').trim();

      // Add completed example to current word
      if (currentWord && currentExample.japanese && currentExample.english) {
        currentWord.examples.push({ ...currentExample });
      }
    }

    // End of word section (---) - save the word
    if (line.trim() === '---' && currentWord && currentWord.id) {
      wordsMap.set(currentWord.japanese, currentWord);
      currentWord = null;
      currentExample = null;
    }
  }

  return wordsMap;
}

// Main merge function
const mdPath = path.join(__dirname, 'examples-review.md');
const publicPath = path.join(__dirname, '..', 'public', 'seed-data', 'duolingo_vocab_enhanced.json');

console.log('Parsing examples-review.md...');
const examplesMap = parseExamplesReview(mdPath);
console.log(`✓ Parsed ${examplesMap.size} words with examples\n`);

console.log('Loading public vocab file...');
const publicData = JSON.parse(fs.readFileSync(publicPath, 'utf-8'));
console.log(`✓ Loaded ${publicData.length} words\n`);

// Match and merge
const mismatches: any[] = [];
let matchedCount = 0;
let examplesAdded = 0;

const updatedData = publicData.map((word: any) => {
  const exampleWord = examplesMap.get(word.japanese);

  if (exampleWord) {
    // Check for mismatches
    const issues: string[] = [];

    if (word.id !== exampleWord.id) {
      issues.push(`ID mismatch: vocab has "${word.id}", examples has "${exampleWord.id}"`);
    }

    if (word.type !== exampleWord.type) {
      issues.push(`Type mismatch: vocab has "${word.type}", examples has "${exampleWord.type}"`);
    }

    if (word.english !== exampleWord.english) {
      issues.push(`English mismatch: vocab has "${word.english}", examples has "${exampleWord.english}"`);
    }

    if (issues.length > 0) {
      mismatches.push({
        japanese: word.japanese,
        issues
      });
    }

    // Add examples
    matchedCount++;
    examplesAdded += exampleWord.examples.length;

    return {
      ...word,
      exampleSentences: exampleWord.examples
    };
  }

  return word;
});

// Report results
console.log('='.repeat(80));
console.log('MERGE RESULTS');
console.log('='.repeat(80));
console.log(`\n✓ Words matched: ${matchedCount}/${examplesMap.size}`);
console.log(`✓ Examples added: ${examplesAdded}`);
console.log(`✓ Words without examples: ${publicData.length - matchedCount}`);

if (mismatches.length > 0) {
  console.log(`\n⚠️  MISMATCHES FOUND: ${mismatches.length}`);
  console.log('\nFirst 10 mismatches:');
  mismatches.slice(0, 10).forEach(m => {
    console.log(`\n  ${m.japanese}:`);
    m.issues.forEach((issue: string) => console.log(`    - ${issue}`));
  });

  // Save mismatch report
  const mismatchPath = path.join(__dirname, 'merge-mismatches.json');
  fs.writeFileSync(mismatchPath, JSON.stringify(mismatches, null, 2));
  console.log(`\n📄 Full mismatch report saved to: merge-mismatches.json`);
} else {
  console.log('\n✅ NO MISMATCHES - All IDs, types, and English match perfectly!');
}

// Save updated data
fs.writeFileSync(publicPath, JSON.stringify(updatedData, null, 2));
console.log(`\n✅ Updated vocab file saved: ${publicPath}`);

// Show sample
const sampleWithExamples = updatedData.find((w: any) => w.exampleSentences && w.exampleSentences.length > 0);
if (sampleWithExamples) {
  console.log('\nSample word with examples:');
  console.log(JSON.stringify(sampleWithExamples, null, 2).split('\n').slice(0, 20).join('\n'));
}
