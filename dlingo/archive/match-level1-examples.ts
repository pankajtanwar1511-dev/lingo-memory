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
  exampleSentence: {
    japanese: string;
    english: string;
  };
}

interface ExampleMatch {
  japanese: string;
  english: string;
}

// Parse the level 1 examples file
function parseLevel1Examples(filePath: string): Map<string, ExampleMatch[]> {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  const examplesMap = new Map<string, ExampleMatch[]>();
  let currentChapter = '';
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    // Detect chapter header
    if (line.startsWith('Level 1-')) {
      currentChapter = line;
      i++;
      continue;
    }

    // Skip separators, tips, empty lines
    if (line === '' || line.startsWith('-') || line.startsWith('TIP') || line.startsWith('[')) {
      i++;
      continue;
    }

    // Japanese sentence (not a tip or header)
    if (line.length > 0 && !line.match(/^[A-Z][a-z]/)) {
      const japaneseLine = line;
      // Next line should be English
      if (i + 1 < lines.length) {
        i++;
        const englishLine = lines[i].trim();

        // Make sure it looks like English (starts with capital letter or common words)
        if (englishLine.length > 0 && (englishLine.match(/^[A-Z]/) || englishLine.match(/^(I'm|It's|Yes|No)/))) {
          if (!examplesMap.has(currentChapter)) {
            examplesMap.set(currentChapter, []);
          }
          examplesMap.get(currentChapter)!.push({
            japanese: japaneseLine,
            english: englishLine
          });
        }
      }
    }

    i++;
  }

  return examplesMap;
}

// Extract vocabulary words from sentences
function extractVocabFromSentence(sentence: string): string[] {
  // Remove common particles and extract potential vocabulary
  const words: string[] = [];

  // Split by common particles and extract chunks
  const chunks = sentence.split(/[、。！？]/);

  for (const chunk of chunks) {
    if (chunk.trim().length > 0) {
      words.push(chunk.trim());

      // Also try to extract words by removing particles
      const withoutParticles = chunk
        .replace(/は/g, '|')
        .replace(/が/g, '|')
        .replace(/を/g, '|')
        .replace(/に/g, '|')
        .replace(/で/g, '|')
        .replace(/と/g, '|')
        .replace(/の/g, '|')
        .split('|');

      words.push(...withoutParticles.filter(w => w.trim().length > 0));
    }
  }

  return words;
}

// Find matching vocabulary word
function findVocabMatch(words: DuolingoWord[], searchTerm: string): DuolingoWord | null {
  // Direct match
  let match = words.find(w => w.japanese === searchTerm);
  if (match) return match;

  // Contains match (for longer forms)
  match = words.find(w => searchTerm.includes(w.japanese) && w.japanese.length > 1);
  if (match) return match;

  return null;
}

// Main function
function matchExamples() {
  console.log('🔍 Analyzing Level 1 examples...\n');

  // Load vocabulary data
  const vocabPath = path.join(__dirname, '../public/seed-data/duolingo_vocab_enhanced.json');
  const vocabData: DuolingoWord[] = JSON.parse(fs.readFileSync(vocabPath, 'utf-8'));

  // Load Level 1 examples
  const examplesPath = path.join(__dirname, 'example_level_1.txt');
  const examplesMap = parseLevel1Examples(examplesPath);

  console.log(`📚 Total vocabulary words: ${vocabData.length}`);
  console.log(`📖 Level 1 chapters found: ${examplesMap.size}\n`);

  // Create a map of vocab words for quick lookup
  const vocabMap = new Map<string, DuolingoWord>();
  vocabData.forEach(word => {
    vocabMap.set(word.japanese, word);
  });

  // Track matches
  const matchedWords = new Set<string>();
  const matchesPerChapter = new Map<string, Array<{word: DuolingoWord, example: ExampleMatch}>>();

  // Process each chapter
  for (const [chapter, examples] of examplesMap.entries()) {
    console.log(`\n${chapter}`);
    console.log('='.repeat(chapter.length));

    const chapterMatches: Array<{word: DuolingoWord, example: ExampleMatch}> = [];

    for (const example of examples) {
      console.log(`\n📝 ${example.japanese}`);
      console.log(`   ${example.english}`);

      // Extract vocabulary from this sentence
      const vocabInSentence = extractVocabFromSentence(example.japanese);

      // Find matches in our vocabulary
      const foundWords: DuolingoWord[] = [];
      for (const term of vocabInSentence) {
        const match = findVocabMatch(vocabData, term);
        if (match && !foundWords.find(w => w.id === match.id)) {
          foundWords.push(match);
        }
      }

      if (foundWords.length > 0) {
        console.log(`   ✅ Vocab found: ${foundWords.map(w => w.japanese).join(', ')}`);
        foundWords.forEach(word => {
          matchedWords.add(word.japanese);
          chapterMatches.push({word, example});
        });
      } else {
        console.log(`   ⚠️  No vocab matches found`);
      }
    }

    if (chapterMatches.length > 0) {
      matchesPerChapter.set(chapter, chapterMatches);
    }
  }

  // Summary
  console.log('\n\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total vocabulary in dataset: ${vocabData.length}`);
  console.log(`Unique words matched in Level 1: ${matchedWords.size}`);
  console.log(`Coverage: ${((matchedWords.size / vocabData.length) * 100).toFixed(1)}%`);

  // Show which words were matched
  console.log('\n✅ Matched vocabulary words:');
  const sortedMatches = Array.from(matchedWords).sort();
  sortedMatches.forEach((word, idx) => {
    if (idx % 5 === 0) console.log('');
    process.stdout.write(`${word.padEnd(15)}`);
  });
  console.log('\n');

  // Find the range of IDs
  const matchedVocab = vocabData.filter(w => matchedWords.has(w.japanese));
  const ids = matchedVocab.map(w => parseInt(w.id.replace('duo_', '')));
  if (ids.length > 0) {
    const minId = Math.min(...ids);
    const maxId = Math.max(...ids);
    console.log(`\n📍 Word ID range: duo_${minId} to duo_${maxId}`);
    console.log(`   (Remember: your data is newest→oldest, so Level 1 is at the end)`);
  }

  return { matchedWords, matchesPerChapter, vocabData };
}

// Run the analysis
matchExamples();
