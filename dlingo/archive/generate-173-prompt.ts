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
const vocabPath = path.join(__dirname, '../public/seed-data/duolingo_vocab_enhanced.json');
const allWords: Word[] = JSON.parse(fs.readFileSync(vocabPath, 'utf-8'));

// Get words with fewer than 3 examples
const wordsNeedingMore = allWords.filter(w => {
  const count = w.exampleSentences?.length || 0;
  return count < 3;
});

console.log(`Total words: ${allWords.length}`);
console.log(`Words needing more examples: ${wordsNeedingMore.length}\n`);

// Sort by current example count (words with 1 example first, then 2)
wordsNeedingMore.sort((a, b) => {
  const aCount = a.exampleSentences?.length || 0;
  const bCount = b.exampleSentences?.length || 0;
  return aCount - bCount;
});

// Format 173 words list with current example count
let word173List = '';
word173List += `### List of ${wordsNeedingMore.length} Words (Need Additional Examples)\n\n`;
word173List += '```json\n';
word173List += JSON.stringify(wordsNeedingMore.map(w => ({
  id: w.id,
  japanese: w.japanese,
  english: w.english,
  type: w.type,
  currentExamples: w.exampleSentences?.length || 0,
  needsMore: 3 - (w.exampleSentences?.length || 0)
})), null, 2);
word173List += '\n```\n\n';

word173List += '**Summary:**\n\n';
const with1 = wordsNeedingMore.filter(w => (w.exampleSentences?.length || 0) === 1).length;
const with2 = wordsNeedingMore.filter(w => (w.exampleSentences?.length || 0) === 2).length;
const with0 = wordsNeedingMore.filter(w => (w.exampleSentences?.length || 0) === 0).length;

word173List += `- **Words with 0 examples** (need 3): ${with0} words\n`;
word173List += `- **Words with 1 example** (need 2 more): ${with1} words\n`;
word173List += `- **Words with 2 examples** (need 1 more): ${with2} words\n`;

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

// Read template
const templatePath = path.join(__dirname, 'claude-prompt-173-words-template.md');
const template = `# Prompt for Claude AI - Add Examples to 173 Words

## Task

Add **additional example sentences** for **173 Japanese vocabulary words** that currently have fewer than 3 examples. Each word should end up with **exactly 3 examples total**.

## Important Notes

### Current State
- Some words have **1 example** (need 2 more)
- Some words have **2 examples** (need 1 more)
- Some words have **0 examples** (need 3)

**You must ADD examples to reach a total of 3 per word, NOT replace existing ones.**

### Vocabulary Restriction
**CRITICAL:** Use ONLY words from the provided 1060-word vocabulary list when creating example sentences. Do not use any Japanese words outside this list.

### Example Distribution (for NEW examples being added)
- **15% Simple** (1 level, basic grammar, single clause)
- **60% Intermediate** (2 levels, natural sentences, 2-3 grammar points)
- **25% Advanced** (3 levels, multiple vocab from the 1060 list, complex patterns)

### Diversity Requirements
Please use a variety of grammar elements in your examples:
- **Particles**: は, が, を, に, で, と, の, から, まで, etc.
- **Pronouns**: 私, あなた, これ, それ, あれ, だれ, 何, etc.
- **Time expressions**: 今, 今日, 明日, 昨日, 先週, 来月, etc.
- **Adverbs**: よく, とても, また, もう, いつも, etc.
- **Adjectives**: 大きい, 小さい, 新しい, 古い, きれい, etc.
- **Counters**: 一つ, 二つ, 三人, 四日, 五月, etc.
- **Verbs in different forms**: ます, ました, たい, ません, etc.

### Output Format

For each word, provide the **ADDITIONAL** examples needed in this JSON structure:

\`\`\`json
{
  "updatedWords": [
    {
      "id": "duo_XXXX",
      "japanese": "word",
      "english": "translation",
      "type": "category",
      "currentExamples": 1,
      "newExampleSentences": [
        {
          "japanese": "example sentence in Japanese",
          "english": "example sentence in English",
          "context": "statement|question|answer",
          "level": "1-3|2-2|3-1",
          "isAIGenerated": true
        }
      ]
    }
  ]
}
\`\`\`

**Important:**
- \`currentExamples\`: How many examples the word currently has
- \`newExampleSentences\`: Array of NEW examples to add (should contain 2 examples if currentExamples=1, or 1 example if currentExamples=2)

**Level notation:**
- \`1-X\` = Simple (beginner-friendly, 1-2 grammar points)
- \`2-X\` = Intermediate (natural, 2-3 grammar points)
- \`3-X\` = Advanced (complex, uses multiple vocab words from the list)

**Context types:**
- \`statement\` - Declarative sentence
- \`question\` - Interrogative sentence
- \`answer\` - Response to a question

---

## Words Needing Additional Examples (173 words)

${word173List}

---

## Complete 1060-Word Vocabulary Reference

**Use ONLY these words in your example sentences:**

${vocab1060List}

---

## Instructions

1. For each of the 173 words listed above, add the necessary examples to reach 3 total
2. If a word has 1 example, add 2 more examples
3. If a word has 2 examples, add 1 more example
4. Ensure all examples use ONLY vocabulary from the 1060-word list
5. Follow the distribution: 15% simple, 60% intermediate, 25% advanced
6. Use diverse grammar elements (particles, pronouns, time, counters, etc.)
7. Make sentences natural and useful for learning
8. Provide output in the JSON format specified above

## Quality Checklist

Before submitting, verify:
- ✅ Every example uses ONLY words from the 1060-word vocabulary
- ✅ Distribution is approximately 15%/60%/25% (simple/intermediate/advanced)
- ✅ Examples include variety: particles, pronouns, time, adverbs, adjectives, counters
- ✅ Each word ends up with exactly 3 examples total (existing + new)
- ✅ JSON format is correct with all required fields
- ✅ Context (statement/question/answer) is appropriate
- ✅ Level notation (1-X, 2-X, 3-X) matches complexity
- ✅ \`newExampleSentences\` contains the correct number of examples based on \`currentExamples\`

---

**Please generate the additional examples now. You can process them in batches if needed.**
`;

// Save final prompt
const outputPath = path.join(__dirname, 'PROMPT-FOR-CLAUDE-173-WORDS.md');
fs.writeFileSync(outputPath, template);

console.log('✅ Prompt generated successfully!\n');
console.log(`📄 Output: PROMPT-FOR-CLAUDE-173-WORDS.md`);
console.log(`📏 File size: ${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB`);
console.log('\n✅ Ready to copy and paste to Claude AI!');
