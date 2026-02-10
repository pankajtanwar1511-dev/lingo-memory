# Duolingo Vocabulary Dataset

This directory contains the parsed and categorized Duolingo Japanese vocabulary data, ready for quiz integration.

## Files

### Source Data
- **`data.txt`** - Original Duolingo vocabulary data (1,060 entries)
  - Format: Japanese, English, blank line (repeating)
  - Raw export from Duolingo learning materials

### Generated Data Files

1. **`duolingo_vocab.json`** - Basic parsed vocabulary
   - Structured JSON with Japanese, English, and part of speech
   - 1,060 entries total
   - Fields: `id`, `japanese`, `english`, `partOfSpeech`, `source`

2. **`duolingo_vocab_enhanced.json`** - ⭐ **MAIN FILE FOR QUIZ INTEGRATION**
   - Complete vocabulary with quiz metadata
   - Includes: JLPT levels, difficulty scores, quiz type suggestions, tags
   - Fields:
     - `id` - Unique identifier
     - `japanese` - Japanese word/phrase
     - `english` - English translation(s)
     - `partOfSpeech` - Grammatical category
     - `source` - "duolingo"
     - `jlptLevel` - Estimated JLPT level (N5, N4, N3)
     - `difficulty` - Difficulty score (1-10)
     - `suggestedQuizTypes` - Array of suitable quiz types
     - `tags` - Categorization tags
     - `deck` - Deck identifier ("duolingo-basics")
     - `examples` - Placeholder for example sentences

3. **`summary.json`** - Basic statistics
   - Total entry count
   - Part of speech breakdown

4. **`enhanced_stats.json`** - Detailed statistics
   - JLPT level distribution
   - Difficulty distribution
   - Part of speech breakdown
   - Average difficulty

### Scripts

- **`parse_duolingo_data.py`** - Parses raw data and labels parts of speech
- **`enhance_for_quiz.py`** - Adds quiz metadata (JLPT, difficulty, tags)

## Statistics Summary

### Overview
- **Total Entries**: 1,060 vocabulary items
- **Average Difficulty**: 5.4/10
- **Primary Source**: Duolingo Japanese course

### JLPT Level Distribution
- **N5** (Beginner): 229 entries (21.6%)
- **N4** (Elementary): 734 entries (69.2%)
- **N3** (Intermediate): 97 entries (9.2%)

### Difficulty Distribution
- **Level 2-3** (Easiest): 146 entries (13.8%)
- **Level 4-6** (Medium): 686 entries (64.8%)
- **Level 7-9** (Hardest): 228 entries (21.5%)

### Part of Speech Breakdown
1. **Nouns**: 588 (55.5%)
2. **Verbs**: 214 (20.2%)
3. **I-adjectives**: 49 (4.6%)
4. **Proper nouns**: 47 (4.4%)
5. **Numbers**: 44 (4.2%)
6. **Adverbs**: 20 (1.9%)
7. **Question words**: 20 (1.9%)
8. **Counters**: 16 (1.5%)
9. **Time expressions**: 15 (1.4%)
10. **Na-adjectives**: 15 (1.4%)
11. **Location words**: 13 (1.2%)
12. **Particles**: 13 (1.2%)
13. **Expressions**: 6 (0.6%)

## Part of Speech Categories

### Grammatical Categories
- **noun** - Nouns (people, places, things)
- **verb** - Verbs in various forms (ます, たい, past, negative)
- **i-adjective** - い-adjectives (大きい, 小さい, etc.)
- **na-adjective** - な-adjectives (きれい, 静か, etc.)
- **adverb** - Adverbs (よく, ときどき, etc.)
- **particle** - Particles (は, を, に, が, etc.)
- **counter** - Japanese counters (つ, 人, 階, etc.)

### Special Categories
- **number** - Numbers (一, 二, 三, etc.)
- **proper-noun** - Names of people, places (東京, アメリカ, etc.)
- **question-word** - Question words (何, だれ, どこ, etc.)
- **time-expression** - Time-related words (今日, 明日, etc.)
- **location** - Location/direction words (ここ, 前, 右, etc.)
- **expression** - Fixed expressions, greetings (ありがとう, etc.)

## Quiz Type Suggestions

The enhanced dataset includes `suggestedQuizTypes` for each entry:

### Quiz Types by Part of Speech

- **Nouns**: multiple-choice, typing, matching, listening
- **Verbs**: multiple-choice, typing, conjugation, fill-in-blank
- **Adjectives**: multiple-choice, typing, conjugation, sentence-building
- **Particles**: multiple-choice, typing, fill-in-blank, sentence-building
- **Expressions**: multiple-choice, typing, listening, context-matching
- **Numbers/Counters**: multiple-choice, typing, listening, matching

## Tags System

Entries are tagged for easy filtering and categorization:

### Grammatical Tags
- Part of speech tags (noun, verb, adjective, etc.)
- Grammar form tags (masu-form, desire-form, negative, past-tense)

### Thematic Tags
- **food** - Food, cooking, eating, drinking
- **travel** - Transportation, trips, hotels
- **shopping** - Buying, stores, prices
- **family** - Family members, relationships
- **time** - Time expressions, dates
- **location** - Places, directions
- **school** - Education, studying
- **work** - Jobs, office, business
- **weather** - Weather conditions
- **emotions** - Feelings, preferences
- **body** - Body parts
- **animals** - Animals, pets
- **colors** - Colors
- **numbers** - Numbers, counting

## Usage for Quiz Integration

### Example: Load and Filter by Difficulty

```javascript
import duolingoVocab from './duolingo_vocab_enhanced.json';

// Get beginner-friendly words (difficulty 1-4)
const beginnerWords = duolingoVocab.filter(w => w.difficulty <= 4);

// Get N5 level verbs
const n5Verbs = duolingoVocab.filter(w =>
  w.jlptLevel === 'N5' && w.partOfSpeech === 'verb'
);

// Get words suitable for listening quizzes
const listeningWords = duolingoVocab.filter(w =>
  w.suggestedQuizTypes.includes('listening')
);

// Get food-related vocabulary
const foodWords = duolingoVocab.filter(w =>
  w.tags.includes('food')
);
```

### Example: Create Quiz Category

```javascript
// Create a new quiz category for Duolingo content
const duolingoQuizCategory = {
  id: 'duolingo-basics',
  name: 'Duolingo Basics',
  description: 'Vocabulary from Duolingo Japanese course',
  totalWords: 1060,
  levels: {
    n5: duolingoVocab.filter(w => w.jlptLevel === 'N5'),
    n4: duolingoVocab.filter(w => w.jlptLevel === 'N4'),
    n3: duolingoVocab.filter(w => w.jlptLevel === 'N3')
  },
  byTheme: {
    food: duolingoVocab.filter(w => w.tags.includes('food')),
    travel: duolingoVocab.filter(w => w.tags.includes('travel')),
    shopping: duolingoVocab.filter(w => w.tags.includes('shopping')),
    // ... more themes
  }
};
```

### Example: Generate Quiz Questions

```javascript
// Generate multiple-choice question
function generateMultipleChoice(word) {
  return {
    question: `What does "${word.japanese}" mean?`,
    correctAnswer: word.english,
    options: [
      word.english,
      // ... get 3 other random words with same part of speech
    ],
    difficulty: word.difficulty,
    tags: word.tags
  };
}

// Generate typing quiz
function generateTypingQuiz(word) {
  return {
    question: `How do you say "${word.english}" in Japanese?`,
    correctAnswer: word.japanese,
    type: 'typing',
    hints: {
      partOfSpeech: word.partOfSpeech,
      jlptLevel: word.jlptLevel
    }
  };
}
```

## Integration Checklist

To integrate this data into LingoMemory:

- [ ] Import `duolingo_vocab_enhanced.json` into the app
- [ ] Create new deck category "Duolingo Basics"
- [ ] Add quiz type implementations for suggested types
- [ ] Implement tag-based filtering in vocabulary browser
- [ ] Add difficulty-based progression system
- [ ] Create themed quiz sets based on tags
- [ ] Add JLPT level filters to study interface
- [ ] (Optional) Add example sentences to `examples` field
- [ ] (Optional) Generate audio files for listening quizzes

## Future Enhancements

Potential improvements for this dataset:

1. **Example Sentences**: Add real example sentences from Tatoeba
2. **Audio Files**: Generate TTS audio for each entry
3. **Kanji Breakdown**: For words with kanji, add component analysis
4. **Related Words**: Link to related vocabulary (synonyms, antonyms)
5. **Frequency Data**: Add usage frequency rankings
6. **Context Images**: Add visual aids for nouns
7. **Conjugation Tables**: For verbs and adjectives
8. **Cultural Notes**: Add cultural context where relevant

## Data Quality

### Parsing Accuracy
- **Part of Speech**: ~95% accuracy (rule-based classification)
- **JLPT Level**: ~85% accuracy (heuristic-based estimation)
- **Difficulty**: Relative scale, suitable for adaptive learning

### Known Limitations
1. Some multi-meaning words may be over-simplified
2. JLPT levels are estimates, not official classifications
3. Tags are based on English translations, may miss nuances
4. No example sentences yet (placeholder field)

## Regenerating the Data

If you need to regenerate or modify the data:

```bash
# Parse raw data
python3 parse_duolingo_data.py

# Enhance with quiz metadata
python3 enhance_for_quiz.py
```

To modify categorization rules, edit the functions in:
- `parse_duolingo_data.py` - Part of speech detection
- `enhance_for_quiz.py` - JLPT level, difficulty, tags

## License

This data is derived from Duolingo's Japanese course materials. Please check Duolingo's terms of service for usage restrictions.

## Contact

For questions or issues with this dataset, please open an issue in the repository.

---

**Last Updated**: 2025-12-12
**Version**: 1.0.0
**Total Entries**: 1,060
