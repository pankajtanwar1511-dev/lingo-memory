# Prompt for Claude AI - Generate Example Sentences

## Task

Generate example sentences for **264 Japanese vocabulary words** that currently don't have examples.

## Important Constraints

### 1. Vocabulary Restriction
**CRITICAL:** Use ONLY words from the provided 1060-word vocabulary list when creating example sentences. Do not use any Japanese words outside this list.

### 2. Example Distribution (2-3 examples per word)
- **15% Simple** (1 level, basic grammar, single clause)
- **60% Intermediate** (2 levels, natural sentences, 2-3 grammar points)
- **25% Advanced** (3 levels, multiple vocab from the 1060 list, complex patterns)

### 3. Diversity Requirements
Please use a variety of grammar elements in your examples:
- **Particles**: は, が, を, に, で, と, の, から, まで, etc.
- **Pronouns**: 私, あなた, これ, それ, あれ, だれ, 何, etc.
- **Time expressions**: 今, 今日, 明日, 昨日, 先週, 来月, etc.
- **Adverbs**: よく, とても, また, もう, いつも, etc.
- **Adjectives**: 大きい, 小さい, 新しい, 古い, きれい, etc.
- **Counters**: 一つ, 二つ, 三人, 四日, 五月, etc.
- **Verbs in different forms**: ます, ました, たい, ません, etc.

### 4. Output Format

For each word, provide examples in this JSON structure:

```json
{
  "updatedWords": [
    {
      "id": "duo_XXXX",
      "japanese": "word",
      "english": "translation",
      "type": "category",
      "exampleSentences": [
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
```

**Level notation:**
- `1-X` = Simple (beginner-friendly, 1-2 grammar points)
- `2-X` = Intermediate (natural, 2-3 grammar points)
- `3-X` = Advanced (complex, uses multiple vocab words from the list)

**Context types:**
- `statement` - Declarative sentence
- `question` - Interrogative sentence
- `answer` - Response to a question

---

## Words Needing Examples (264 words)

<<WORD_LIST_264>>

---

## Complete 1060-Word Vocabulary Reference

**Use ONLY these words in your example sentences:**

<<FULL_VOCAB_1060>>

---

## Instructions

1. Generate 2-3 example sentences for each of the 264 words listed above
2. Ensure examples use ONLY vocabulary from the 1060-word list
3. Follow the distribution: 15% simple, 60% intermediate, 25% advanced
4. Use diverse grammar elements (particles, pronouns, time, counters, etc.)
5. Make sentences natural and useful for learning
6. Provide output in the JSON format specified above

## Quality Checklist

Before submitting, verify:
- ✅ Every example uses ONLY words from the 1060-word vocabulary
- ✅ Distribution is approximately 15%/60%/25% (simple/intermediate/advanced)
- ✅ Examples include variety: particles, pronouns, time, adverbs, adjectives, counters
- ✅ Each word has 2-3 examples minimum
- ✅ JSON format is correct with all required fields
- ✅ Context (statement/question/answer) is appropriate
- ✅ Level notation (1-X, 2-X, 3-X) matches complexity

---

**Please generate the examples now. You can process them in batches if needed.**
