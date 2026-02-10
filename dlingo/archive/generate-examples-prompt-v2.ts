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

// Get words without examples
const wordsWithoutExamples = vocabData.filter(
  word => !word.exampleSentences || word.exampleSentences.length === 0
);

// Get ALL words for vocabulary constraint
const allVocabulary = vocabData.map(w => ({
  id: w.id,
  japanese: w.japanese,
  english: w.english,
  type: w.type
}));

// Create enhanced prompt
let prompt = `# Task: Generate HIGH-QUALITY Educational Example Sentences for Japanese Vocabulary

## 🎯 PRIMARY OBJECTIVE

Create **educational, grammar-rich example sentences** that maximize learning value. Each sentence should teach learners how to use vocabulary in meaningful, natural contexts while demonstrating important grammar patterns.

---

## ⚠️ CRITICAL CONSTRAINT: Vocabulary Limitation

**YOU MUST ONLY USE WORDS FROM THE PROVIDED 1,060-WORD VOCABULARY LIST.**

❌ **DO NOT** introduce new vocabulary words
✅ **DO** use only words from the complete vocabulary list provided below
✅ **DO** combine words creatively to show grammar patterns

This ensures learners recognize all words and see how their vocabulary works together.

---

## 🎓 Educational Quality Requirements

### What Makes a GOOD Example:

✅ **Grammar-focused**: Demonstrates important patterns (adjectives, time, counters, questions, etc.)
✅ **Multiple learning points**: Combines vocabulary to show relationships
✅ **Natural context**: Real-world situations learners will encounter
✅ **Intermediate complexity**: Not too simple, but beginner-friendly (80% of examples)
✅ **Vocabulary reinforcement**: Uses other words from the 1,060-word list

### What Makes a BAD Example:

❌ **Too simple**: "これはりんごです。" (This is an apple.) - No learning value
❌ **Artificial**: Sentences that natives wouldn't actually say
❌ **Single word focus**: Only showing one word without context
❌ **Unknown vocabulary**: Using words NOT in the 1,060-word list
❌ **Too advanced**: Complex grammar beyond beginner-intermediate level

---

## 📚 Priority Learning Areas

Focus on creating examples that teach:

### 1. **Adjective Usage** (56 adjectives need examples)
- い-adjectives and な-adjectives
- Present/negative forms (大きい、大きくない)
- Comparatives (もっと大きい)
- Adjective + noun combinations

**Good Example**: 
- このレストランは高いですが、おいしいです。(This restaurant is expensive, but delicious.)
- Shows: adjectives, は/が particles, contrast with が

### 2. **Time Expressions & Days**
- 今日、明日、昨日
- Days of week (月曜日、火曜日...)
- Time words (朝、夜、午後)
- Time + activity combinations

**Good Example**:
- 明日の朝、駅で会いましょう。(Let's meet at the station tomorrow morning.)
- Shows: time + の + time, location particle で, polite invitation

### 3. **Counters** (39 counters need examples)
- People counters (一人、二人、三人)
- Object counters (一つ、二つ、三つ)
- Time counters (一時、二時)
- Usage in natural sentences

**Good Example**:
- カフェで友だちと二時間話しました。(I talked with friends at the cafe for two hours.)
- Shows: location, time counter, past tense, と particle

### 4. **Pronouns & Question Words**
- これ、それ、あれ
- だれ、何、どこ、いつ
- Question formation patterns

**Good Example**:
- それはどこで買いましたか。(Where did you buy that?)
- Shows: pronoun, question word, で particle, past tense question

### 5. **Adverbs** (19 adverbs need examples)
- Frequency: よく、ときどき、あまり
- Manner: ゆっくり、ちゃんと
- Degree: もっと、とても
- Natural placement in sentences

**Good Example**:
- 兄はよくギターを弾きます。(My older brother often plays guitar.)
- Shows: family term, adverb placement, を particle, verb

### 6. **Verb Patterns**
- Present/future, past, negative
- Polite vs casual
- て-form for sequences
- Desire forms (〜たい)

**Good Example**:
- 週末に映画を見て、レストランで食べたいです。(On the weekend, I want to watch a movie and eat at a restaurant.)
- Shows: time expression, て-form connection, 〜たい desire, multiple activities

---

## 📊 Complexity Distribution

**Target distribution for your examples:**

- 10% - Simple/Basic (for very concrete nouns like "banana", "chair")
  - Example: バナナが好きです。
  
- 80% - **INTERMEDIATE/EDUCATIONAL** (Main focus!)
  - Multiple grammar points
  - Natural conversations
  - Real-world contexts
  - Vocabulary combinations
  
- 10% - Slightly Advanced (for abstract concepts, complex verbs)
  - Longer sentences
  - Multiple clauses
  - More sophisticated grammar

---

## 🎯 Quantity Guidelines

**Generate 1-3 examples per word based on:**

- **3 examples**: Common words, versatile usage, important grammar patterns
  - Verbs (especially する verbs)
  - Common adjectives
  - Question words
  - Time/day expressions
  
- **2 examples**: Moderate frequency words, multiple contexts
  - Most nouns
  - Most verbs
  - Adverbs
  
- **1 example**: Specific/concrete nouns, limited contexts
  - Specific food items
  - Specific places
  - Very specific objects

---

## 💡 Example Comparison: Good vs. Bad

### BAD Example (Too Simple):
Word: **レストラン** (restaurant)
```
❌ これはレストランです。(This is a restaurant.)
```
Why bad: No learning value, obvious, doesn't show usage

### GOOD Example (Educational):
Word: **レストラン** (restaurant)
```
✅ この駅の近くに安くておいしいレストランがあります。
   (There's a cheap and delicious restaurant near this station.)
```
Why good: Shows て-form adjective connection, location expressions, あります usage, natural context

---

## 📖 Complete Vocabulary List (1,060 words)

**IMPORTANT**: Your example sentences MUST only use words from this list.

`;

// Add all vocabulary organized by type
const byType = new Map<string, typeof allVocabulary>();
allVocabulary.forEach(word => {
  if (!byType.has(word.type)) {
    byType.set(word.type, []);
  }
  byType.get(word.type)!.push(word);
});

prompt += '### Available Vocabulary by Type\n\n';

const sortedTypes = Array.from(byType.entries())
  .sort((a, b) => b[1].length - a[1].length);

for (const [type, words] of sortedTypes) {
  prompt += `**${type.toUpperCase()}** (${words.length} words): `;
  const wordList = words.slice(0, 30).map(w => w.japanese).join(', ');
  prompt += wordList;
  if (words.length > 30) {
    prompt += `, ... and ${words.length - 30} more`;
  }
  prompt += '\n\n';
}

prompt += `\n---

## 📝 Words Needing Examples (${wordsWithoutExamples.length} words)

These are the words you need to generate examples for:

`;

// Group words without examples by type
const withoutByType = new Map<string, DuolingoWord[]>();
wordsWithoutExamples.forEach(word => {
  if (!withoutByType.has(word.type)) {
    withoutByType.set(word.type, []);
  }
  withoutByType.get(word.type)!.push(word);
});

const sortedWithout = Array.from(withoutByType.entries())
  .sort((a, b) => b[1].length - a[1].length);

for (const [type, words] of sortedWithout) {
  prompt += `### ${type.toUpperCase()} (${words.length} words)\n\n`;
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
  
  prompt += '\n```\n\n';
}

prompt += `---

## 🎯 Output Format

Return your examples in this JSON format:

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
    }
  ]
}
\`\`\`

---

## ✅ Final Checklist Before Submitting

For EACH example sentence, verify:

- [ ] Uses ONLY words from the 1,060-word vocabulary list
- [ ] Demonstrates meaningful grammar pattern or usage
- [ ] Natural sentence a native speaker would say
- [ ] Appropriate complexity (mostly intermediate, 80%)
- [ ] Context tag is correct (statement/question/answer)
- [ ] Level estimate is reasonable (1-1 to 3-15)
- [ ] English translation is accurate and natural
- [ ] Shows the target word in a useful context

---

## 🚀 Ready to Generate!

Process all ${wordsWithoutExamples.length} words with focus on:
- **Educational value** over simplicity
- **Grammar patterns** in every sentence
- **Vocabulary reinforcement** using only the 1,060 words
- **Natural contexts** learners will encounter
- **Variety** in sentence types and situations

**Remember**: Your examples will be used to teach real learners. Make every sentence count! 📚
`;

// Save prompt
const outputPath = path.join(__dirname, 'AI-GENERATE-EXAMPLES-PROMPT-V2.md');
fs.writeFileSync(outputPath, prompt, 'utf-8');

console.log(`\n✅ Enhanced prompt created: AI-GENERATE-EXAMPLES-PROMPT-V2.md`);
console.log(`📊 Words to process: ${wordsWithoutExamples.length}`);
console.log(`📚 Total vocabulary available: ${allVocabulary.length}`);
console.log(`📝 File size: ${(Buffer.byteLength(prompt, 'utf-8') / 1024).toFixed(1)} KB\n`);
console.log(`🎓 Enhanced with:`);
console.log(`   - Vocabulary constraint (only use 1,060 words)`);
console.log(`   - Educational quality guidelines`);
console.log(`   - Grammar pattern emphasis`);
console.log(`   - Good vs. bad examples`);
console.log(`   - Complexity distribution targets\n`);
