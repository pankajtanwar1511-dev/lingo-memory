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
  exampleSentences?: Array<{
    japanese: string;
    english: string;
    context?: string;
    level?: string;
    isAIGenerated?: boolean;
  }>;
}

function extractSubset(words: DuolingoWord[], types: string[], subsetName: string) {
  const filtered = words.filter(w => types.includes(w.type));

  // Create JSON file
  const jsonPath = path.join(__dirname, `subset-${subsetName}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(filtered, null, 2));

  // Create human-readable text file for Claude
  const textPath = path.join(__dirname, `subset-${subsetName}-for-claude.txt`);
  let content = `VALIDATION REQUEST FOR CLAUDE AI\n`;
  content += `=`.repeat(80) + '\n\n';
  content += `Subset: ${subsetName}\n`;
  content += `Total words: ${filtered.length}\n`;
  content += `Word types: ${types.join(', ')}\n\n`;
  content += `INSTRUCTIONS:\n`;
  content += `Please validate that each example sentence actually contains or uses the target Japanese word.\n`;
  content += `The word might appear in different forms (conjugations, particles, kanji vs hiragana, etc.)\n`;
  content += `Report any examples that clearly don't contain the target word.\n\n`;
  content += `=`.repeat(80) + '\n\n';

  filtered.forEach((word, idx) => {
    content += `[${idx + 1}/${filtered.length}] ID: ${word.id}\n`;
    content += `Target Word: ${word.japanese} (${word.english})\n`;
    content += `Type: ${word.type}\n`;

    if (word.exampleSentences && word.exampleSentences.length > 0) {
      content += `Example Sentences:\n`;
      word.exampleSentences.forEach((ex, exIdx) => {
        content += `  ${exIdx + 1}. JP: ${ex.japanese}\n`;
        content += `     EN: ${ex.english}\n`;
      });
    } else {
      content += `(No example sentences)\n`;
    }

    content += `\n${'-'.repeat(80)}\n\n`;
  });

  fs.writeFileSync(textPath, content);

  console.log(`✓ Created ${subsetName}:`);
  console.log(`  - JSON: ${jsonPath}`);
  console.log(`  - Text for Claude: ${textPath}`);
  console.log(`  - Words: ${filtered.length}\n`);

  return filtered.length;
}

// Load vocabulary
const vocabPath = path.join(__dirname, '..', 'public', 'seed-data', 'duolingo_vocab_enhanced.json');
const words: DuolingoWord[] = JSON.parse(fs.readFileSync(vocabPath, 'utf-8'));

console.log(`Loaded ${words.length} total words\n`);

// Extract subsets
const count1 = extractSubset(words, ['counter'], '1-counter');
const count2 = extractSubset(words, ['adverb', 'particle'], '2-adverb-particle');
const count3 = extractSubset(words, ['phrase', 'pronoun'], '3-phrase-pronoun');

console.log(`Total words extracted: ${count1 + count2 + count3}`);
console.log(`\nYou can now copy the content from the *-for-claude.txt files and paste to Claude AI!`);
