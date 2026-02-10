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
  exampleSentences?: Array<{
    japanese: string;
    english: string;
    context?: 'statement' | 'question' | 'answer';
    relatedTip?: string;
    level?: string;
    isAIGenerated?: boolean;
  }>;
}

interface ExampleSentence {
  japanese: string;
  english: string;
  context?: 'statement' | 'question' | 'answer';
  relatedTip?: string;
  level: string; // e.g., "1-1", "2-4", "3-15"
  isAIGenerated: boolean;
}

interface LevelData {
  chapter: string;
  level: string; // e.g., "1-1", "2-4", "3-15"
  examples: ExampleSentence[];
  tips: string[];
}

// Common words to skip
const SKIP_WORDS = new Set([
  'です', 'ます', 'は', 'が', 'を', 'に', 'で', 'と', 'の', 'か',
  'も', 'や', 'ね', 'よ', 'さ', 'な', 'だ', 'た', 'て', 'ん',
  'はい', 'いいえ', 'あ', 'ええと', 'さん', 'さんは',
  // Additional problematic short words that cause false matches
  'はん', 'いえ', 'すみ', 'あね', 'かい', 'さい', 'えん', 'まえ',
  'いす', 'にく', 'はし', 'とし', 'もの', 'しろ', 'バー', 'りょう'
]);

// Known false match patterns (word -> words it shouldn't match within)
const FALSE_MATCH_PATTERNS = new Map<string, string[]>([
  ['しろい', ['おもしろい']],
  ['かるい', ['あかるい']],
  ['たかい', ['あたたかい']],
  ['からい', ['やから']],
  ['いたいです', ['買いたいです', 'ききたいです', 'すわりたい']],
  ['テスト', ['コンテスト']],
  ['プレゼン', ['プレゼント']],
  ['いつ', ['いつも']],
  ['どう', ['どうが']],
  ['せんたく', ['せんたくき']],
  ['どうぶつ', ['どうぶつえん']],
  ['ひとり', ['ひとりで']],
  ['こんばん', ['こんばんは']],
  ['りょうしん', ['ごりょうしん']],
  ['ちゅうごく', ['ちゅうごくご']],
  ['しゃしん', ['しゃしんか']],
]);

// Parse a level file and extract examples with context and tips
function parseLevelFile(filePath: string): LevelData[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  const levelsData: LevelData[] = [];
  let currentChapter = '';
  let currentExamples: ExampleSentence[] = [];
  let currentTips: string[] = [];
  let i = 0;

  // Track if we're collecting a tip
  let collectingTip = false;
  let tipLines: string[] = [];
  let lastQuestion: ExampleSentence | null = null;

  let currentLevel = '';

  while (i < lines.length) {
    let line = lines[i];

    // Detect chapter header
    if (line.trim().startsWith('Level ')) {
      // Save previous chapter if exists
      if (currentChapter && currentExamples.length > 0) {
        levelsData.push({
          chapter: currentChapter,
          level: currentLevel,
          examples: currentExamples,
          tips: currentTips
        });
      }

      currentChapter = line.trim();
      // Extract level number like "1-1", "2-30", "3-15" from "Level 1-1 [ Order food ]"
      const levelMatch = currentChapter.match(/Level (\d+-\d+)/);
      currentLevel = levelMatch ? levelMatch[1] : '';
      currentExamples = [];
      currentTips = [];
      lastQuestion = null;
      i++;
      continue;
    }

    // Start of TIP section
    if (line.trim() === 'TIP') {
      collectingTip = true;
      tipLines = [];
      i++;
      continue;
    }

    // Inside TIP section
    if (collectingTip) {
      // Empty line or separator ends the tip
      if (line.trim() === '' || line.trim().startsWith('-')) {
        if (tipLines.length > 0) {
          const tipText = tipLines.join(' ').trim();
          currentTips.push(tipText);
        }
        collectingTip = false;
        tipLines = [];
      } else {
        // Collect tip content, skip Japanese/romaji examples within tips
        if (!line.match(/^[ぁ-んァ-ヶー一-龯]+/) && !line.match(/^\[.*\]$/)) {
          tipLines.push(line.trim());
        }
      }
      i++;
      continue;
    }

    // Skip separators and empty lines
    if (line.trim() === '' || line.trim().startsWith('-')) {
      i++;
      continue;
    }

    // Check if line starts with tab (it's an answer)
    const isAnswer = line.startsWith('\t') || line.match(/^\s{4,}/);

    // Japanese sentence (has hiragana/katakana/kanji)
    if (line.trim().length > 0 && line.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/)) {
      const japaneseLine = line.trim();

      // Next line should be English
      if (i + 1 < lines.length) {
        i++;
        const nextLine = lines[i];
        const englishLine = nextLine.trim();

        // Check if it's English
        if (englishLine.length > 0 &&
            (englishLine.match(/^[A-Z]/) || englishLine.match(/^(I'm|It's|Yes|No|Bye|Hello|Um|We)/))) {

          const example: ExampleSentence = {
            japanese: japaneseLine,
            english: englishLine,
            context: isAnswer ? 'answer' : (japaneseLine.endsWith('か。') || japaneseLine.endsWith('か？') ? 'question' : 'statement'),
            level: currentLevel,
            isAIGenerated: false
          };

          // If there are tips in this chapter, associate with examples
          if (currentTips.length > 0) {
            example.relatedTip = currentTips[currentTips.length - 1]; // Most recent tip
          }

          currentExamples.push(example);

          // Track questions for context
          if (example.context === 'question') {
            lastQuestion = example;
          }

          continue;
        } else {
          // Not English, go back
          i--;
        }
      }
    }

    i++;
  }

  // Save last chapter
  if (currentChapter && currentExamples.length > 0) {
    levelsData.push({
      chapter: currentChapter,
      level: currentLevel,
      examples: currentExamples,
      tips: currentTips
    });
  }

  return levelsData;
}

// Check if a word appears with proper boundaries in a sentence
function hasWordBoundary(sentence: string, word: string): boolean {
  // Exact match
  if (sentence === word) return true;

  // Common particles and boundaries that indicate word ends
  const boundaries = ['、', '。', 'は', 'が', 'を', 'に', 'で', 'と', 'の', 'か', 'も', 'や', 'ね', 'よ', '！', '？'];

  // Check if word appears at start with boundary after
  if (sentence.startsWith(word)) {
    const nextChar = sentence.charAt(word.length);
    if (boundaries.includes(nextChar) || nextChar === '') return true;
  }

  // Check if word appears at end with boundary before
  if (sentence.endsWith(word)) {
    const prevIdx = sentence.length - word.length - 1;
    if (prevIdx < 0) return true;
    const prevChar = sentence.charAt(prevIdx);
    if (boundaries.includes(prevChar)) return true;
  }

  // Check if word appears in middle with boundaries on both sides
  const index = sentence.indexOf(word);
  if (index > 0) {
    const prevChar = sentence.charAt(index - 1);
    const nextChar = sentence.charAt(index + word.length);
    if (boundaries.includes(prevChar) && (boundaries.includes(nextChar) || nextChar === '')) {
      return true;
    }
  }

  return false;
}

// Find which vocabulary words appear in a sentence (Japanese only matching with word boundaries)
function findVocabInSentence(
  japaneseSentence: string,
  englishSentence: string,
  vocabList: DuolingoWord[]
): DuolingoWord[] {
  const foundWords: DuolingoWord[] = [];

  for (const word of vocabList) {
    if (foundWords.find(w => w.id === word.id)) continue;

    const japaneseVocab = word.japanese;

    if (SKIP_WORDS.has(japaneseVocab)) continue;
    if (japaneseVocab.length === 1) continue;

    // Check for known false match patterns
    if (FALSE_MATCH_PATTERNS.has(japaneseVocab)) {
      const falseMatches = FALSE_MATCH_PATTERNS.get(japaneseVocab)!;
      const isFalseMatch = falseMatches.some(pattern => japaneseSentence.includes(pattern));
      if (isFalseMatch) continue;
    }

    // For words 3 characters or shorter, require word boundaries
    // For longer words, allow substring match (they're less likely to be false positives)
    if (japaneseVocab.length <= 3) {
      if (hasWordBoundary(japaneseSentence, japaneseVocab)) {
        foundWords.push(word);
      }
    } else {
      // For longer words, still check if they appear in the sentence
      if (japaneseSentence.includes(japaneseVocab)) {
        foundWords.push(word);
      }
    }
  }

  return foundWords.sort((a, b) => b.japanese.length - a.japanese.length);
}

// Main update function
function updateWithAllLevels() {
  console.log('🔄 Updating vocabulary with ALL level examples...\n');

  // Load vocabulary data
  const vocabPath = path.join(__dirname, '../public/seed-data/duolingo_vocab_enhanced.json');
  const vocabData: DuolingoWord[] = JSON.parse(fs.readFileSync(vocabPath, 'utf-8'));

  // Parse all level files
  const level1Path = path.join(__dirname, 'example_level_1.txt');
  const level2Path = path.join(__dirname, 'example_level_2.txt');
  const level3Path = path.join(__dirname, 'example_level_3.txt');

  const level1Data = parseLevelFile(level1Path);
  const level2Data = parseLevelFile(level2Path);
  const level3Data = parseLevelFile(level3Path);

  const allLevels = [...level1Data, ...level2Data, ...level3Data];

  console.log(`📚 Total vocabulary: ${vocabData.length}`);
  console.log(`📖 Level 1 chapters: ${level1Data.length}`);
  console.log(`📖 Level 2 chapters: ${level2Data.length}`);
  console.log(`📖 Level 3 chapters: ${level3Data.length}`);

  // Count all examples
  const totalExamples = allLevels.reduce((sum, level) => sum + level.examples.length, 0);
  const totalTips = allLevels.reduce((sum, level) => sum + level.tips.length, 0);
  console.log(`📝 Total example sentences: ${totalExamples}`);
  console.log(`💡 Total tips: ${totalTips}\n`);

  // Step 1: Clear all examples
  console.log('🧹 Step 1: Clearing all temporary examples...');
  vocabData.forEach(word => {
    delete word.exampleSentences;
    word.exampleSentences = [];
  });
  console.log('   ✅ All examples cleared\n');

  // Step 2: Match examples to vocabulary
  console.log('🔗 Step 2: Matching examples to vocabulary...');

  const vocabToExamples = new Map<string, ExampleSentence[]>();

  for (const levelData of allLevels) {
    for (const example of levelData.examples) {
      const matchedWords = findVocabInSentence(example.japanese, example.english, vocabData);

      for (const word of matchedWords) {
        if (!vocabToExamples.has(word.japanese)) {
          vocabToExamples.set(word.japanese, []);
        }
        vocabToExamples.get(word.japanese)!.push(example);
      }
    }
  }

  console.log(`   ✅ Matched ${vocabToExamples.size} vocabulary words to examples\n`);

  // Step 3: Update vocabulary
  console.log('📝 Step 3: Updating vocabulary data...\n');

  let updatedCount = 0;
  let totalExamplesAdded = 0;
  const contextCounts = { statement: 0, question: 0, answer: 0 };

  vocabData.forEach(word => {
    const examples = vocabToExamples.get(word.japanese);
    if (examples && examples.length > 0) {
      word.exampleSentences = examples;
      updatedCount++;
      totalExamplesAdded += examples.length;

      // Count contexts
      examples.forEach(ex => {
        if (ex.context) contextCounts[ex.context]++;
      });

      console.log(`   ✅ ${word.japanese.padEnd(20)} → ${examples.length} example${examples.length > 1 ? 's' : ''} (${examples.map(e => e.context).join(', ')})`);
    }
  });

  console.log(`\n   ✅ Updated ${updatedCount} words with ${totalExamplesAdded} total examples`);
  console.log(`   📊 Context breakdown: ${contextCounts.statement} statements, ${contextCounts.question} questions, ${contextCounts.answer} answers\n`);

  // Step 4: Save
  console.log('💾 Step 4: Saving updated data...');
  fs.writeFileSync(vocabPath, JSON.stringify(vocabData, null, 2), 'utf-8');
  console.log(`   ✅ Saved to ${vocabPath}\n`);

  // Summary
  console.log('='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total vocabulary: ${vocabData.length}`);
  console.log(`Words with examples: ${updatedCount}`);
  console.log(`Words without examples: ${vocabData.length - updatedCount}`);
  console.log(`Coverage: ${((updatedCount / vocabData.length) * 100).toFixed(1)}%`);
  console.log(`Total examples added: ${totalExamplesAdded}`);
  console.log(`Average examples per word: ${(totalExamplesAdded / updatedCount).toFixed(1)}\n`);

  console.log('✅ Update complete!\n');

  // Show words with most examples
  const sortedByExampleCount = vocabData
    .filter(w => w.exampleSentences && w.exampleSentences.length > 0)
    .sort((a, b) => (b.exampleSentences?.length || 0) - (a.exampleSentences?.length || 0));

  console.log('🏆 Top 20 words with most examples:');
  sortedByExampleCount.slice(0, 20).forEach((word, idx) => {
    console.log(`   ${(idx + 1).toString().padStart(2)}. ${word.japanese.padEnd(15)} → ${word.exampleSentences?.length} examples`);
  });

  // Generate review document
  console.log('\n📝 Generating review document...');
  generateReviewDocument(vocabData);
  console.log('   ✅ Review document created: examples-review.md\n');
}

// Generate a review document for AI verification
function generateReviewDocument(vocabData: DuolingoWord[]) {
  const wordsWithExamples = vocabData
    .filter(w => w.exampleSentences && w.exampleSentences.length > 0)
    .sort((a, b) => {
      const aId = parseInt(a.id.replace('duo_', ''));
      const bId = parseInt(b.id.replace('duo_', ''));
      return bId - aId; // Sort by ID descending (newest to oldest)
    });

  let markdown = `# Duolingo Examples Review Document

**Generated**: ${new Date().toISOString().split('T')[0]}
**Total Words with Examples**: ${wordsWithExamples.length}
**Total Examples**: ${wordsWithExamples.reduce((sum, w) => sum + (w.exampleSentences?.length || 0), 0)}

---

## Instructions for Review

Please review each vocabulary word and its matched examples. Check if:
1. The Japanese word actually appears in the Japanese sentence
2. The example makes sense for learning this vocabulary
3. The context (Q/A/statement) is appropriate

---

`;

  // Group by word type
  const byType = new Map<string, DuolingoWord[]>();
  wordsWithExamples.forEach(word => {
    if (!byType.has(word.type)) {
      byType.set(word.type, []);
    }
    byType.get(word.type)!.push(word);
  });

  // Sort types by count
  const sortedTypes = Array.from(byType.entries())
    .sort((a, b) => b[1].length - a[1].length);

  for (const [type, words] of sortedTypes) {
    markdown += `## ${type.toUpperCase()} (${words.length} words)\n\n`;

    for (const word of words) {
      markdown += `### ${word.japanese} (${word.english})\n`;
      markdown += `**ID**: ${word.id} | **Type**: ${word.type}`;
      if (word.subtype) {
        markdown += ` | **Subtype**: ${word.subtype}`;
      }
      markdown += `\n\n`;

      markdown += `**Examples** (${word.exampleSentences?.length || 0}):\n\n`;

      word.exampleSentences?.forEach((example, idx) => {
        const contextBadge = example.context === 'question' ? '❓' :
                            example.context === 'answer' ? '✅' : '💬';
        const aiTag = example.isAIGenerated ? '🤖 AI' : '📘 Duolingo';
        markdown += `${idx + 1}. ${contextBadge} **${example.context?.toUpperCase()}** | Level ${example.level} | ${aiTag}\n`;
        markdown += `   - JP: ${example.japanese}\n`;
        markdown += `   - EN: ${example.english}\n`;
        if (example.relatedTip) {
          markdown += `   - 💡 Tip: ${example.relatedTip.substring(0, 100)}...\n`;
        }
        markdown += `\n`;
      });

      markdown += `---\n\n`;
    }
  }

  // Add statistics at the end
  markdown += `\n## Statistics by Word Type\n\n`;
  markdown += `| Word Type | Words | Total Examples | Avg Examples/Word |\n`;
  markdown += `|-----------|-------|----------------|------------------|\n`;

  for (const [type, words] of sortedTypes) {
    const totalExamples = words.reduce((sum, w) => sum + (w.exampleSentences?.length || 0), 0);
    const avgExamples = (totalExamples / words.length).toFixed(1);
    markdown += `| ${type} | ${words.length} | ${totalExamples} | ${avgExamples} |\n`;
  }

  markdown += `\n---\n\n`;
  markdown += `Generated by Claude Code - Duolingo Vocabulary Examples Matcher\n`;

  // Save to file
  const outputPath = path.join(__dirname, 'examples-review.md');
  fs.writeFileSync(outputPath, markdown, 'utf-8');
}

// Run the update
updateWithAllLevels();
