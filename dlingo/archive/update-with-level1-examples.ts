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
  exampleSentence?: {
    japanese: string;
    english: string;
  };
  exampleSentences?: Array<{
    japanese: string;
    english: string;
  }>;
}

interface ExampleSentence {
  japanese: string;
  english: string;
}

// Parse Level 1 examples
function parseLevel1Examples(filePath: string): ExampleSentence[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const examples: ExampleSentence[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    // Skip headers, separators, tips
    if (line === '' || line.startsWith('-') || line.startsWith('TIP') ||
        line.startsWith('Level 1-') || line.startsWith('[')) {
      i++;
      continue;
    }

    // Japanese sentence (has hiragana/katakana/kanji)
    if (line.length > 0 && line.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/)) {
      const japaneseLine = line;
      // Next line should be English
      if (i + 1 < lines.length) {
        i++;
        const englishLine = lines[i].trim();

        // Check if it's English (starts with capital or common words)
        if (englishLine.length > 0 &&
            (englishLine.match(/^[A-Z]/) || englishLine.match(/^(I'm|It's|Yes|No|Bye|Hello)/))) {
          examples.push({
            japanese: japaneseLine,
            english: englishLine
          });
        } else {
          // Not English, go back one line
          i--;
        }
      }
    }

    i++;
  }

  return examples;
}

// Common words to skip (too common to be useful as example targets)
const SKIP_WORDS = new Set([
  'です', 'ます', 'は', 'が', 'を', 'に', 'で', 'と', 'の', 'か',
  'も', 'や', 'ね', 'よ', 'さ', 'な', 'だ', 'た', 'て', 'ん',
  'はい', 'いいえ', 'あ', 'ええと', 'さん', 'さんは'
]);

// Find which vocabulary words appear in a sentence pair (Japanese + English)
function findVocabInSentence(
  japaneseSentence: string,
  englishSentence: string,
  vocabList: DuolingoWord[]
): DuolingoWord[] {
  const foundWords: DuolingoWord[] = [];

  for (const word of vocabList) {
    // Skip already matched words
    if (foundWords.find(w => w.id === word.id)) continue;

    const japaneseVocab = word.japanese;
    const englishVocab = word.english;

    // Skip very common particles and copulas
    if (SKIP_WORDS.has(japaneseVocab)) continue;

    // Skip if word is only 1 character (usually particles)
    if (japaneseVocab.length === 1) continue;

    // Check if Japanese word appears in Japanese sentence
    const japaneseMatch = japaneseSentence === japaneseVocab || japaneseSentence.includes(japaneseVocab);

    if (!japaneseMatch) continue;

    // Now verify the English meaning also appears in the English sentence
    // Split English vocab into alternatives (separated by commas)
    const englishVariants = englishVocab.split(',').map(v => v.trim().toLowerCase());
    const lowerEnglishSentence = englishSentence.toLowerCase();

    // Check if any English variant appears in the English sentence
    const englishMatch = englishVariants.some(variant => {
      // Check for word boundaries to avoid partial matches
      const words = lowerEnglishSentence.split(/\s+/);

      // For multi-word variants (e.g., "green tea")
      if (variant.includes(' ')) {
        return lowerEnglishSentence.includes(variant);
      }

      // For single words, check if it appears as a whole word
      return words.some(w => w.replace(/[.,!?;:]/g, '') === variant);
    });

    // Only add if BOTH Japanese and English match
    if (japaneseMatch && englishMatch) {
      foundWords.push(word);
    }
  }

  // Sort by length (longest first) to prioritize more specific matches
  return foundWords.sort((a, b) => b.japanese.length - a.japanese.length);
}

// Main update function
function updateWithLevel1Examples() {
  console.log('🔄 Updating vocabulary with Level 1 examples...\n');

  // Load vocabulary data
  const vocabPath = path.join(__dirname, '../public/seed-data/duolingo_vocab_enhanced.json');
  const vocabData: DuolingoWord[] = JSON.parse(fs.readFileSync(vocabPath, 'utf-8'));

  // Parse Level 1 examples
  const examplesPath = path.join(__dirname, 'example_level_1.txt');
  const level1Examples = parseLevel1Examples(examplesPath);

  console.log(`📚 Total vocabulary: ${vocabData.length}`);
  console.log(`📖 Level 1 example sentences: ${level1Examples.length}\n`);

  // Step 1: Clear all temporary examples
  console.log('🧹 Step 1: Clearing all temporary examples...');
  vocabData.forEach(word => {
    // Remove old single example field
    delete word.exampleSentence;
    // Initialize new multiple examples field
    word.exampleSentences = [];
  });
  console.log('   ✅ All examples cleared\n');

  // Step 2: Create a mapping of examples to vocabulary
  console.log('🔗 Step 2: Matching Level 1 examples to vocabulary...');

  const exampleToVocab = new Map<string, DuolingoWord[]>();
  const vocabToExamples = new Map<string, ExampleSentence[]>();

  for (const example of level1Examples) {
    const matchedWords = findVocabInSentence(example.japanese, example.english, vocabData);

    if (matchedWords.length > 0) {
      exampleToVocab.set(example.japanese, matchedWords);

      // Assign this example to ALL matched words
      // Each word can have MULTIPLE examples
      for (const word of matchedWords) {
        if (!vocabToExamples.has(word.japanese)) {
          vocabToExamples.set(word.japanese, []);
        }
        vocabToExamples.get(word.japanese)!.push(example);
      }
    }
  }

  console.log(`   ✅ Matched ${vocabToExamples.size} vocabulary words to examples\n`);

  // Step 3: Update vocabulary with matched examples
  console.log('📝 Step 3: Updating vocabulary data...\n');

  let updatedCount = 0;
  let totalExamples = 0;

  vocabData.forEach(word => {
    const examples = vocabToExamples.get(word.japanese);
    if (examples && examples.length > 0) {
      word.exampleSentences = examples;
      updatedCount++;
      totalExamples += examples.length;

      console.log(`   ✅ ${word.japanese.padEnd(20)} → ${examples.length} example${examples.length > 1 ? 's' : ''}`);
      examples.forEach((ex, idx) => {
        console.log(`      ${idx + 1}. ${ex.japanese}`);
      });
    }
  });

  console.log(`\n   ✅ Updated ${updatedCount} words with ${totalExamples} total examples\n`);

  // Step 4: Save updated data
  console.log('💾 Step 4: Saving updated data...');
  const outputPath = vocabPath;
  fs.writeFileSync(outputPath, JSON.stringify(vocabData, null, 2), 'utf-8');
  console.log(`   ✅ Saved to ${outputPath}\n`);

  // Summary
  console.log('=' .repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total vocabulary: ${vocabData.length}`);
  console.log(`Words with Level 1 examples: ${updatedCount}`);
  console.log(`Words without examples: ${vocabData.length - updatedCount}`);
  console.log(`Coverage: ${((updatedCount / vocabData.length) * 100).toFixed(1)}%`);
  console.log('\n✅ Update complete! All temporary examples removed and Level 1 examples added.');
  console.log('📋 Words without examples are now blank - ready for Level 2 & 3 data!\n');

  // Show which words got examples
  console.log('📝 Vocabulary words with Level 1 examples:');
  const wordsWithExamples = vocabData.filter(w => w.exampleSentences && w.exampleSentences.length > 0);
  const sortedWords = wordsWithExamples.sort((a, b) => {
    const aId = parseInt(a.id.replace('duo_', ''));
    const bId = parseInt(b.id.replace('duo_', ''));
    return bId - aId; // Sort by ID descending (newest to oldest)
  });

  console.log('\nWords by ID (newest → oldest):');
  sortedWords.forEach((word, idx) => {
    if (idx % 3 === 0) console.log('');
    const exCount = word.exampleSentences?.length || 0;
    process.stdout.write(`${word.id.padEnd(10)} ${word.japanese.padEnd(15)} (${exCount} ex)  `);
  });
  console.log('\n');
}

// Run the update
updateWithLevel1Examples();
