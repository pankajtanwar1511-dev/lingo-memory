# N5 Sentence Extraction - AI Validation Prompt

**Purpose**: Validate our methodology for extracting strictly N5 sentences from Tatoeba corpus

---

## 🎯 Task Summary

We extracted **10,142 strictly N5 sentences** from Tatoeba corpus (247,929 sentences) using:
1. **807 JMdict-verified N5 vocabulary words** (1,286 unique forms: kanji + kana)
2. **Two-stage filtering**: Vocabulary filtering → Grammar filtering
3. **Pass rate**: 4.1% (very strict N5 criteria)

---

## 📋 Prompt for ChatGPT / Claude AI

Copy and paste this entire prompt to validate our approach:

---

### VALIDATION REQUEST

I'm creating a Japanese N5 (JLPT beginner level) sentence dataset and need your expert validation on my methodology.

**Context:**
- Source: Tatoeba corpus (247,929 Japanese sentences with English translations)
- Vocabulary: 807 verified N5 words from JMdict (1,286 unique forms including kanji/kana)
- Goal: Extract sentences that are 100% N5 level (vocabulary + grammar)

**Two-Stage Filtering Process:**

### Stage 1: Vocabulary Filtering

**Tool**: fugashi (MeCab tokenizer) with UniDic dictionary

**Algorithm:**
```python
def check_sentence(sentence: str, vocab_kanji: Set[str], vocab_kana: Set[str]):
    # Length check
    if len(sentence) < 5 or len(sentence) > 35:
        return False  # Reject

    # Tokenize
    tokens = tagger.parseToNodeList(sentence)

    for token in tokens:
        # Skip particles and auxiliaries
        if token.pos1 in ("助詞", "助動詞", "記号", "補助記号"):
            continue
        if token.surface in ALLOWED_PARTICLES:  # は, が, を, に, へ, で, と, etc.
            continue

        # Check content words
        surface = token.surface  # e.g., 行きます
        lemma = token.feature.lemma  # e.g., 行く

        # Must exist in 807 vocabulary (either surface or lemma, kanji or kana)
        if surface not in vocab_kanji and surface not in vocab_kana and \
           lemma not in vocab_kanji and lemma not in vocab_kana:
            return False  # Non-N5 word found

    return True  # All words are N5
```

**Allowed Particles** (always permitted):
```python
ALLOWED_PARTICLES = {
    'は', 'が', 'を', 'に', 'へ', 'で', 'と', 'から', 'まで', 'の', 'も', 'や', 'か',
    'ね', 'よ', 'わ', 'です', 'ます', 'だ', 'でした', 'ました', 'ない', 'ません',
    'そして', 'それから', 'でも', 'しかし', 'だから', 'じゃ', 'では'
}
```

**Results:**
- Input: 247,929 sentences
- Output: 11,553 sentences (4.66% pass rate)
- Rejected: 236,376 sentences (length or non-N5 vocabulary)

---

### Stage 2: Grammar Filtering

**Goal**: Remove N4+ grammar patterns

**Rejected Patterns** (N4 and above):
```python
NON_N5_GRAMMAR = [
    r'(たら|ば|れば|なら)',              # Conditionals (N4)
    r'(られる|れる|させる|させられる)(?!ば)',  # Passive/Causative (N4+)
    r'(という|のが|のは)',              # Quotation/relative clauses (N4)
    r'(んです|のです)',                 # Explanatory のだ (N4)
    r'(ので|のに)',                     # Complex conjunctions (N4)
]
```

**Algorithm:**
```python
def has_n4_grammar(text: str) -> bool:
    for pattern in NON_N5_GRAMMAR:
        if re.search(pattern, text):
            return True  # N4+ grammar found
    return False
```

**Results:**
- Input: 11,553 vocabulary-matched sentences
- Output: 10,142 sentences (87.8% pass rate)
- Rejected: 1,411 sentences with N4+ grammar

---

### Final Results

- **Total processed**: 247,929 sentences
- **Final dataset**: 10,142 sentences (4.1% pass rate)
- **Vocabulary**: 100% N5 (807 words only)
- **Grammar**: 100% N5 (no conditionals, passive, causative, complex patterns)

---

## ❓ Questions for Validation

1. **Vocabulary Filtering Approach:**
   - Is using fugashi/MeCab with lemma matching appropriate for N5?
   - Are we correctly allowing particles (は, が, を, に, etc.)?
   - Should we allow any additional grammar markers?

2. **Grammar Pattern Detection:**
   - Are the rejected patterns (たら, ば, られる, という, んです, ので) definitely N4+?
   - Are we missing any N4+ patterns that should be filtered?
   - Are we accidentally rejecting any N5-valid patterns?

3. **Pass Rate Validation:**
   - Is 4.1% pass rate (10,142 out of 247,929) reasonable for strict N5 filtering?
   - Does this indicate we're being too strict or appropriately strict?

4. **Overall Methodology:**
   - Is two-stage filtering (vocabulary → grammar) the right approach?
   - Should we add any additional validation steps?
   - What are the potential weaknesses in this approach?

5. **Sample Validation:**
   Please rate these accepted sentences (should they be N5?):
   - ✅ `知らない。` (I don't know.)
   - ✅ `今日は暑いです。` (It's hot today.)
   - ✅ `学校に行きます。` (I go to school.)
   - ✅ `これは本です。` (This is a book.)
   - ✅ `水を飲みました。` (I drank water.)

   Please rate these rejected sentences (should they be rejected?):
   - ❌ `暑かったら、水を飲みます。` (If it's hot, I'll drink water.) - Rejected: たら conditional
   - ❌ `本が読まれています。` (The book is being read.) - Rejected: passive られる
   - ❌ `先生が来るんです。` (The teacher is coming.) - Rejected: explanatory んです
   - ❌ `雨が降るので、帰ります。` (Because it's raining, I'll go home.) - Rejected: ので

6. **Comparison:**
   - Previous dataset: 3,094 sentences from ~1,147 words (with duplicates)
   - New dataset: 10,142 sentences from 807 words (no duplicates)
   - Is 3.3x increase with cleaner vocabulary reasonable?

---

## 🔍 Technical Details for Reference

**Tokenizer**: fugashi (Python wrapper for MeCab)
- Dictionary: UniDic (unidic-lite)
- Part-of-speech tags: UniDic format (助詞, 助動詞, 名詞, 動詞, etc.)

**Lemma Matching**:
- Handles conjugations: 行きます → 行く, 食べた → 食べる
- Handles variants: 大きい/大きな → 大きい

**Vocabulary Source**: JMdict/EDICT
- 807 entries with full dictionary data
- 100% verified N5 level
- No ます-forms in base vocabulary (handled via lemma matching)

---

## 📊 Please Provide Feedback On:

1. **Accuracy**: Is this methodology sound for N5 filtering?
2. **Completeness**: Are we missing any important filters?
3. **Over-filtering**: Are we rejecting valid N5 sentences?
4. **Under-filtering**: Are we accepting non-N5 sentences?
5. **Improvements**: What would you recommend changing?

Rate our approach: **X / 10**

---

### Expected Validation Result

Based on your expert knowledge of:
- JLPT N5 grammar patterns
- Japanese tokenization and morphology
- Language learning corpus development

Please provide:
1. **Overall rating** (1-10)
2. **Strengths** of the approach
3. **Weaknesses** or potential issues
4. **Recommendations** for improvement
5. **Sample sentence validation** (are accepted/rejected examples correct?)

---

Thank you for your validation!

---

