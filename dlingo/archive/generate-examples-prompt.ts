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

// Create comprehensive prompt
let prompt = `# Task: Generate Example Sentences for Japanese Vocabulary

## Context
I have a Japanese vocabulary learning application with ${wordsWithoutExamples.length} words that need example sentences. These examples will help learners understand how to use each word in context.

## Requirements for Each Example

### Structure
Each example must include:
- **japanese**: Japanese sentence using the vocabulary word
- **english**: English translation
- **context**: One of: "statement", "question", or "answer"
- **level**: Estimate appropriate Duolingo level (e.g., "1-1" to "1-9" for Level 1, "2-1" to "2-30" for Level 2, "3-1" to "3-15" for Level 3)
- **isAIGenerated**: true

### Quality Guidelines
1. **Natural usage**: Use the word naturally as a native speaker would
2. **Appropriate level**: Match complexity to beginner-intermediate learners (JLPT N5-N4 level)
3. **Context variety**: Mix statements, questions, and answers
4. **Different scenarios**: Show different contexts/situations where the word is used
5. **Common collocations**: Use words that commonly appear together
6. **Accurate translations**: English should be natural and accurate

### Quantity
- Aim for 1-3 examples per word
- More examples (2-3) for: common words, verbs with multiple uses, adjectives
- Fewer examples (1) for: very specific nouns, rare words, technical terms

## Example Format

For the word **しょうせつ** (novel):
\`\`\`json
{
  "id": "duo_0",
  "japanese": "しょうせつ",
  "english": "novel",
  "type": "noun",
  "exampleSentences": [
    {
      "japanese": "日本のしょうせつを読むのが好きです。",
      "english": "I like reading Japanese novels.",
      "context": "statement",
      "level": "2-10",
      "isAIGenerated": true
    },
    {
      "japanese": "どんなしょうせつが好きですか。",
      "english": "What kind of novels do you like?",
      "context": "question",
      "level": "2-10",
      "isAIGenerated": true
    }
  ]
}
\`\`\`

---

## Vocabulary Words to Process

Total: ${wordsWithoutExamples.length} words

`;

// Group by type for organization
const byType = new Map<string, DuolingoWord[]>();
wordsWithoutExamples.forEach(word => {
  if (!byType.has(word.type)) {
    byType.set(word.type, []);
  }
  byType.get(word.type)!.push(word);
});

const sortedTypes = Array.from(byType.entries())
  .sort((a, b) => b[1].length - a[1].length);

for (const [type, words] of sortedTypes) {
  prompt += `\n### ${type.toUpperCase()} (${words.length} words)\n\n`;
  prompt += '```json\n';
  
  words.forEach((word, idx) => {
    const wordObj = {
      id: word.id,
      japanese: word.japanese,
      english: word.english,
      type: word.type,
      ...(word.subtype && { subtype: word.subtype })
    };
    
    prompt += JSON.stringify(wordObj, null, 2);
    if (idx < words.length - 1) {
      prompt += ',\n';
    }
  });
  
  prompt += '\n```\n';
}

prompt += `\n---

## Output Format

Please generate example sentences for ALL ${wordsWithoutExamples.length} words above and return them in this JSON format:

\`\`\`json
{
  "updatedWords": [
    {
      "id": "duo_0",
      "exampleSentences": [
        {
          "japanese": "...",
          "english": "...",
          "context": "statement|question|answer",
          "level": "X-Y",
          "isAIGenerated": true
        }
      ]
    },
    // ... all other words
  ]
}
\`\`\`

## Important Notes

1. **Do NOT skip any words** - all ${wordsWithoutExamples.length} words must have examples
2. **Context types**:
   - "statement": Declarative sentences
   - "question": Questions (usually end with か)
   - "answer": Responses to questions
3. **Level estimation guide**:
   - Level 1 (1-1 to 1-9): Very basic, greetings, food orders, simple descriptions
   - Level 2 (2-1 to 2-30): Intermediate, daily conversations, hobbies, work
   - Level 3 (3-1 to 3-15): Advanced beginner, past tense, preferences, complex situations
4. **Use natural Japanese**: Avoid overly formal or bookish language unless appropriate for the word
5. **Be consistent**: All examples should be beginner-friendly but realistic

## Ready?

Please process all ${wordsWithoutExamples.length} words and generate the JSON output. Take your time to ensure quality!
`;

// Save prompt
const outputPath = path.join(__dirname, 'AI-GENERATE-EXAMPLES-PROMPT.md');
fs.writeFileSync(outputPath, prompt, 'utf-8');

console.log(`\n✅ Prompt file created: AI-GENERATE-EXAMPLES-PROMPT.md`);
console.log(`📊 Total words to process: ${wordsWithoutExamples.length}`);
console.log(`📝 File size: ${(Buffer.byteLength(prompt, 'utf-8') / 1024).toFixed(1)} KB\n`);
console.log(`🤖 Next steps:`);
console.log(`   1. Open AI-GENERATE-EXAMPLES-PROMPT.md`);
console.log(`   2. Copy the entire content`);
console.log(`   3. Paste into Claude (claude.ai)`);
console.log(`   4. Wait for the JSON response`);
console.log(`   5. Save the response to process with the update script\n`);
