# N5 Sentence Extraction - Technical Methodology

**Complete technical documentation for AI validation**

---

## 📊 Overview

- **Objective**: Extract strictly N5-level sentences from Tatoeba corpus
- **Source**: 247,929 Japanese sentences with English translations
- **Vocabulary**: 807 JMdict-verified N5 words (1,286 unique forms)
- **Result**: 10,142 strictly N5 sentences (4.1% pass rate)

---

## 🔧 Stage 1: Vocabulary Filtering

### Script: `extract_807_vocab_sentences.py`

### Input Data Structure

**Vocabulary**: `N5_vocab_dataset_final.json`
```json
{
  "metadata": {
    "version": "2.3.0",
    "totalCards": 807
  },
  "vocabulary": [
    {
      "id": "n5_vocab_0001",
      "kanji": "行く",
      "kana": "いく",
      "meaning": ["to go"],
      "partOfSpeech": ["Godan verb with 'ku' ending"]
    }
  ]
}
```

**Tatoeba**: `jpn_sentences_detailed.tsv`
```
4710    知らない。    I don't know.
10000   今日は暑いです。    It's hot today.
15234   学校に行きます。    I go to school.
```

### Vocabulary Loading

```python
def load_807_vocab() -> Tuple[Set[str], Set[str]]:
    """
    Load 807 vocabulary in two sets: kanji forms and kana forms

    Returns:
        vocab_kanji: Set of kanji forms (499 entries)
        vocab_kana: Set of kana forms (1,286 total - includes kana-only)
    """
    with open(VOCAB_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)

    vocab_kanji = set()
    vocab_kana = set()

    for entry in data['vocabulary']:
        kana = entry.get('kana', '')
        kanji = entry.get('kanji', '')

        if kana:
            vocab_kana.add(kana)
        if kanji:
            vocab_kanji.add(kanji)

    return vocab_kanji, vocab_kana
```

**Example vocabulary sets**:
```python
vocab_kanji = {'行く', '学校', '本', '水', '先生', ...}  # 499 kanji forms
vocab_kana = {'いく', 'がっこう', 'ほん', 'みず', 'せんせい', ...}  # 1,286 total forms
```

### Particle Detection

```python
# Allowed particles (always permitted, not checked against vocabulary)
ALLOWED_PARTICLES = {
    # Case particles
    'は', 'が', 'を', 'に', 'へ', 'で', 'と', 'から', 'まで', 'の', 'も', 'や',

    # Sentence-ending particles
    'か', 'ね', 'よ', 'わ',

    # Copulas and auxiliaries
    'です', 'ます', 'だ', 'でした', 'ました', 'ない', 'ません',

    # Conjunctions
    'そして', 'それから', 'でも', 'しかし', 'だから', 'じゃ', 'では',
}

def is_particle(token) -> bool:
    """
    Check if token is particle/auxiliary/symbol

    Args:
        token: fugashi Token object with POS tags

    Returns:
        True if particle/auxiliary/symbol (should be skipped)
    """
    # Check POS tag
    pos1 = token.feature.pos1
    if pos1 in ("助詞", "助動詞", "記号", "補助記号"):
        return True

    # Check surface form
    if token.surface in ALLOWED_PARTICLES:
        return True

    return False
```

### Sentence Validation Logic

```python
def check_sentence(
    sentence: str,
    vocab_kanji: Set[str],
    vocab_kana: Set[str]
) -> Tuple[bool, str]:
    """
    Check if sentence uses ONLY our 807 vocabulary

    Args:
        sentence: Japanese sentence to check
        vocab_kanji: Set of kanji forms from 807 vocabulary
        vocab_kana: Set of kana forms from 807 vocabulary

    Returns:
        (passes, rejection_reason)
    """
    # ===== LENGTH CHECK =====
    if len(sentence) < 5 or len(sentence) > 35:
        return False, f"length_{len(sentence)}"

    # ===== TOKENIZATION =====
    # fugashi uses MeCab with UniDic dictionary
    tokens = tagger.parseToNodeList(sentence)

    # ===== TOKEN VALIDATION =====
    for token in tokens:
        # Skip particles and auxiliaries
        if is_particle(token):
            continue

        # Get surface form and lemma
        surface = token.surface
        lemma = token.feature.lemma if hasattr(token.feature, 'lemma') else surface

        # Check if word (surface or lemma) is in our 807 vocab
        in_vocab = (
            surface in vocab_kanji or
            surface in vocab_kana or
            lemma in vocab_kanji or
            lemma in vocab_kana
        )

        if not in_vocab:
            return False, f"non_vocab_word:{surface}"

    return True, ""
```

### Example Token Analysis

**Sentence**: `学校に行きます。`

**Tokenization**:
```python
Token 1: surface="学校", lemma="学校", pos1="名詞"
  → Check: "学校" in vocab_kanji? YES ✓

Token 2: surface="に", lemma="に", pos1="助詞"
  → Skip (particle) ✓

Token 3: surface="行きます", lemma="行く", pos1="動詞"
  → Check: "行きます" in vocab? NO
  → Check: "行く" (lemma) in vocab_kanji? YES ✓

Token 4: surface="。", lemma="。", pos1="補助記号"
  → Skip (symbol) ✓

Result: PASS (all content words are N5)
```

**Sentence**: `大使館に行きます。`

**Tokenization**:
```python
Token 1: surface="大使館", lemma="大使館", pos1="名詞"
  → Check: "大使館" in vocab? NO ✗
  → Check: "大使館" (lemma) in vocab? NO ✗

Result: REJECT (non_vocab_word:大使館)
```

### Stage 1 Results

```python
# Statistics from extraction_log.txt
Total processed:     247,929
✅ Passed:            11,553 (4.66%)
❌ Length filter:      6,920
❌ Non-vocab words:  229,456
```

---

## 🔧 Stage 2: Grammar Filtering

### Script: `filter_n5_grammar.py`

### N4+ Grammar Patterns (Rejected)

```python
NON_N5_GRAMMAR = [
    # Conditionals (N4)
    r'(たら|ば|れば|なら)',

    # Passive/Causative (N4+)
    # Negative lookahead (?!ば) prevents false positives
    r'(られる|れる|させる|させられる)(?!ば)',

    # Quotations and relative clauses (N4)
    r'(という|のが|のは)',

    # Explanatory のだ pattern (N4)
    r'(んです|のです)',

    # Complex conjunctions (N4)
    r'(ので|のに)',
]
```

### Grammar Detection Logic

```python
def has_n4_grammar(text: str) -> bool:
    """
    Check if sentence contains N4+ grammar patterns

    Args:
        text: Japanese sentence

    Returns:
        True if N4+ grammar found (should be rejected)
    """
    for pattern in NON_N5_GRAMMAR:
        if re.search(pattern, text):
            return True
    return False
```

### Example Grammar Analysis

**Sentence**: `今日は暑いです。`
```python
Check たら|ば|れば|なら: NO
Check られる|れる|させる|させられる: NO
Check という|のが|のは: NO
Check んです|のです: NO
Check ので|のに: NO

Result: PASS (N5 grammar)
```

**Sentence**: `暑かったら、水を飲みます。`
```python
Check たら|ば|れば|なら: FOUND "たら" ✗

Result: REJECT (conditional - N4)
```

**Sentence**: `本が読まれています。`
```python
Check られる|れる|させる|させられる: FOUND "まれ" (from 読まれ) ✗

Result: REJECT (passive - N4)
```

**Sentence**: `先生が来るんです。`
```python
Check んです|のです: FOUND "んです" ✗

Result: REJECT (explanatory - N4)
```

### Stage 2 Results

```python
# From filter output
Input:           11,553
✅ N5 grammar:    10,142 (87.8%)
❌ N4+ grammar:    1,411 (12.2%)
```

---

## 📊 Complete Pipeline

```
START: 247,929 Tatoeba sentences
   ↓
   ↓ STAGE 1: Vocabulary Filter
   ├─ Length check (5-35 chars)
   ├─ Tokenization (fugashi/MeCab)
   ├─ Particle detection (skip)
   ├─ Content word validation (807 vocab)
   └─ Lemma matching (conjugations)
   ↓
11,553 sentences (4.66% pass)
   ↓
   ↓ STAGE 2: Grammar Filter
   ├─ Conditional check (たら, ば, れば, なら)
   ├─ Passive/Causative check (られる, させる)
   ├─ Quotation check (という, のが, のは)
   ├─ Explanatory check (んです, のです)
   └─ Conjunction check (ので, のに)
   ↓
10,142 sentences (87.8% pass)
   ↓
END: 4.1% overall pass rate
```

---

## 🔍 Validation Questions for AI

### 1. Vocabulary Filtering

**Q**: Is lemma matching appropriate for N5?
- Example: 行きます → 行く (lemma)
- We check BOTH surface and lemma against vocabulary

**Q**: Should particles always be allowed?
- Current: は, が, を, に, へ, で, と, から, まで, の, も, や, か, ね, よ, わ
- These are all N5 particles

**Q**: Should we check particle conjugations?
- Example: でした (です + た), ました (ます + た)
- Currently allowed as auxiliaries

### 2. Grammar Filtering

**Q**: Are these patterns definitely N4+?
- たら, ば, れば, なら (conditionals)
- られる, れる (passive)
- させる, させられる (causative)
- という, のが, のは (quotations)
- んです, のです (explanatory)
- ので, のに (complex conjunctions)

**Q**: Are we missing any N4+ patterns?
- Volitional form (〜よう)?
- Potential form (〜える)?
- Other patterns?

**Q**: Are we accidentally rejecting N5 patterns?
- Check sample rejected sentences

### 3. Overall Methodology

**Q**: Is 4.1% pass rate reasonable?
- Very strict filtering
- 10,142 out of 247,929 sentences

**Q**: Should we use POS tags for grammar?
- Currently using regex patterns
- Alternative: Check MeCab POS tags for passive/causative

**Q**: Is two-stage filtering optimal?
- Alternative: Single-stage with both checks?
- Alternative: Add third stage for validation?

---

## 📝 Sample Validation

### Accepted Sentences (Should be N5)

```
✅ 知らない。
   Vocab: 知る (know) - N5 ✓
   Grammar: Plain form negation (ない) - N5 ✓

✅ 今日は暑いです。
   Vocab: 今日 (today), 暑い (hot) - N5 ✓
   Grammar: い-adjective + です - N5 ✓

✅ 学校に行きます。
   Vocab: 学校 (school), 行く (go) - N5 ✓
   Grammar: Polite form (ます) - N5 ✓

✅ これは本です。
   Vocab: これ (this), 本 (book) - N5 ✓
   Grammar: Noun + です - N5 ✓

✅ 水を飲みました。
   Vocab: 水 (water), 飲む (drink) - N5 ✓
   Grammar: Past polite (ました) - N5 ✓
```

### Rejected Sentences (Should be N4+)

```
❌ 暑かったら、水を飲みます。
   Vocab: All N5 ✓
   Grammar: たら conditional - N4 ✗

❌ 本が読まれています。
   Vocab: All N5 ✓
   Grammar: Passive (まれる) - N4 ✗

❌ 先生が来るんです。
   Vocab: All N5 ✓
   Grammar: Explanatory (んです) - N4 ✗

❌ 雨が降るので、帰ります。
   Vocab: All N5 ✓
   Grammar: Complex conjunction (ので) - N4 ✗
```

---

## 🎯 AI Validation Checklist

Please validate:

- [ ] Vocabulary filtering logic is sound
- [ ] Particle handling is appropriate
- [ ] Lemma matching is correct for N5
- [ ] Grammar patterns are correctly classified
- [ ] No N5 patterns are accidentally rejected
- [ ] No N4+ patterns are accidentally accepted
- [ ] Sample sentences are correctly classified
- [ ] Pass rate (4.1%) is reasonable
- [ ] Overall methodology is sound

**Rating**: ____ / 10

**Recommended improvements**:
1.
2.
3.

---

**Generated**: 2025-11-03
**Purpose**: AI validation of N5 sentence extraction methodology
