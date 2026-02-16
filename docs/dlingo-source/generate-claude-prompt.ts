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

// Load current vocabulary
const vocabPath = path.join(__dirname, 'duolingo-vocab-with-examples', 'duolingo_vocab_enhanced.json');
const allWords: Word[] = JSON.parse(fs.readFileSync(vocabPath, 'utf-8'));

// Get words without examples
const wordsWithoutExamples = allWords.filter(w => !w.exampleSentences || w.exampleSentences.length === 0);

console.log(`Total words: ${allWords.length}`);
console.log(`Words without examples: ${wordsWithoutExamples.length}\n`);

// Format 264 words list
let word264List = '';
word264List += `### List of ${wordsWithoutExamples.length} Words\n\n`;
word264List += '```json\n';
word264List += JSON.stringify(wordsWithoutExamples.map(w => ({
  id: w.id,
  japanese: w.japanese,
  english: w.english,
  type: w.type
})), null, 2);
word264List += '\n```\n\n';

word264List += '**Summary by Type:**\n\n';
const typeCount = new Map<string, number>();
wordsWithoutExamples.forEach(w => {
  typeCount.set(w.type, (typeCount.get(w.type) || 0) + 1);
});

Array.from(typeCount.entries())
  .sort((a, b) => b[1] - a[1])
  .forEach(([type, count]) => {
    word264List += `- **${type}**: ${count} words\n`;
  });

// Format 1060 words vocabulary list
let vocab1060List = '';
vocab1060List += '### Complete Vocabulary (1060 words)\n\n';
vocab1060List += '**Organized by Type:**\n\n';

// Group by type
const byType = new Map<string, Word[]>();
allWords.forEach(w => {
  if (!byType.has(w.type)) {
    byType.set(w.type, []);
  }
  byType.get(w.type)!.push(w);
});

// Sort by type
const sortedTypes = Array.from(byType.entries()).sort((a, b) => b[1].length - a[1].length);

sortedTypes.forEach(([type, words]) => {
  vocab1060List += `#### ${type.toUpperCase()} (${words.length} words)\n\n`;

  const wordList = words.map(w => `${w.japanese} (${w.english})`).join(', ');

  // Wrap long lines
  const maxLineLength = 80;
  const wrappedLines: string[] = [];
  let currentLine = '';

  wordList.split(', ').forEach(word => {
    if ((currentLine + word).length > maxLineLength) {
      wrappedLines.push(currentLine);
      currentLine = word + ', ';
    } else {
      currentLine += word + ', ';
    }
  });
  if (currentLine) {
    wrappedLines.push(currentLine.replace(/, $/, ''));
  }

  vocab1060List += wrappedLines.join('\n') + '\n\n';
});

// Read template and replace placeholders
const templatePath = path.join(__dirname, 'claude-prompt-264-words.md');
let template = fs.readFileSync(templatePath, 'utf-8');

template = template.replace('<<WORD_LIST_264>>', word264List);
template = template.replace('<<FULL_VOCAB_1060>>', vocab1060List);

// Save final prompt
const outputPath = path.join(__dirname, 'PROMPT-FOR-CLAUDE-264-WORDS.md');
fs.writeFileSync(outputPath, template);

console.log('✅ Prompt generated successfully!\n');
console.log(`📄 Output: PROMPT-FOR-CLAUDE-264-WORDS.md`);
console.log(`📏 File size: ${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB`);
console.log('\n✅ Ready to copy and paste to Claude AI!');
