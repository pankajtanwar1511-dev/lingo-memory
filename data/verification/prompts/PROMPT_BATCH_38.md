# N5 Example Verification Prompt

## Background and Problems

We have 1,871 example sentences for 662 N5 vocabulary words, sourced from JMdict and Tatoeba. However, we've identified critical quality issues:

### Problem 1: False Positive Vocabulary Matches
- Substring matching created false positives
- Example: "売る" (uru - to sell) incorrectly matched "うるさい" (urusai - noisy)
- Need to verify the target vocabulary actually appears as a distinct word

### Problem 2: Grammar Level Uncertainty
- Examples may contain N4+ grammar despite passing our filters
- Filter may have missed advanced conditional forms, causative, passive, etc.
- Need strict verification that ONLY N5 grammar is used

### Problem 3: Kana Accuracy
- Auto-generated kana readings may have errors
- Need to verify kana matches the Japanese sentence correctly

## Your Task

Verify each example sentence below for N5 appropriateness and provide structured feedback.

## N5 Grammar Patterns Reference

### ✅ ALLOWED (N5 Grammar)

**Particles**: は、が、を、に、へ、で、と、も、か、から、まで、の、や、ね、よ

**Verb Forms**:
- Dictionary form: 食べる、行く
- Masu form: 食べます、行きます
- Te form: 食べて、行って
- Ta form: 食べた、行った
- Nai form: 食べない、行かない
- Nakatta form: 食べなかった

**Copula**: だ、です、じゃない、ではない

**Adjectives**:
- I-adjectives: 大きい、大きくない、大きかった
- Na-adjectives: 静かだ、静かな、静かじゃない

**Sentence Patterns**:
- X は Y です (X is Y)
- X が好きです/嫌いです (like/dislike)
- X は Y が Adj です (X's Y is Adj)
- X は Y を V (X does V to Y)
- X で Y を V (do V with Y)
- X から Y まで (from X to Y)
- Question words: 何、誰、どこ、いつ、なぜ、どう、いくら
- Counting/time expressions

### ❌ NOT ALLOWED (N4+ Grammar)

**Conditionals**: たら、ば、なら、と (conditional)
**Causative**: させる、せる forms
**Passive**: れる、られる forms
**Potential**: できる、られる (ability)
**Volitional**: よう、ましょう (beyond basic suggestions)
**Advanced conjunctions**: のに、ので (complex reasons)
**Formal patterns**: ている (continuous) is borderline - accept only if very basic

## Verification Criteria

For each example, check:

### 1. Target Vocabulary Present (YES/NO/UNCLEAR)
- Does the sentence contain the EXACT target vocabulary word?
- Check word boundaries - not just substring
- If target has kanji, check if kanji or kana version appears
- Mark UNCLEAR if word might be part of compound

### 2. Kana Accuracy (ACCURATE/MINOR_ERROR/MAJOR_ERROR)
- Does the kana reading match the Japanese sentence character-by-character?
- ACCURATE: Perfect match
- MINOR_ERROR: 1-2 character mistakes, missing particles
- MAJOR_ERROR: Multiple errors, completely wrong readings

### 3. N5 Grammar Check (PASS/FAIL + explanation)
- Does sentence use ONLY N5 grammar patterns listed above?
- Identify any N4+ grammar if found
- PASS: Only N5 patterns
- FAIL: Contains any N4+ pattern (list which ones)

### 4. Difficulty Rating (1-10 within N5 range)

Rate based on these factors:
- **Grammar complexity**: Simple statements (1-3) vs multiple clauses (7-10)
- **Vocabulary density**: Only target word (1-3) vs many N5 words (7-10)
- **Sentence length**: Short (1-3) vs long (7-10)
- **Cultural context**: Universal concepts (1-3) vs Japan-specific (5-7)

**Rating Scale Examples**:
- **1-3 (Beginner N5)**: これは本です。/ 私は学生です。
- **4-6 (Mid N5)**: 私は毎日学校へ行きます。
- **7-8 (Advanced N5)**: 田中さんは昨日図書館で本を読みました。
- **9-10 (Upper N5 limit)**: Complex but still N5-only grammar

### 5. Recommendation (ACCEPT/REVIEW/REJECT)
- **ACCEPT**: Target present, kana accurate, N5 grammar only, appropriate difficulty
- **REVIEW**: Minor issues (small kana error, borderline grammar, difficulty uncertain)
- **REJECT**: Major issues (wrong vocab, N4+ grammar, major kana errors)

## Output Format

For each example, return JSON in this exact format:

```json
{
  "card_id": "n5_vocab_0001",
  "example_index": 0,
  "verification": {
    "target_vocab_present": "YES/NO/UNCLEAR",
    "target_vocab_notes": "Explain where/how target word appears",
    "kana_accuracy": "ACCURATE/MINOR_ERROR/MAJOR_ERROR",
    "kana_notes": "Explain any errors found",
    "n5_grammar_check": "PASS/FAIL",
    "grammar_notes": "List any N4+ patterns if FAIL, or note N5 patterns if PASS",
    "difficulty_rating": 5,
    "difficulty_notes": "Explain rating based on 4 factors",
    "recommendation": "ACCEPT/REVIEW/REJECT",
    "overall_notes": "Summary of decision"
  }
}
```

## Batch to Verify

**Batch Number**: 38
**Total Batches**: 38
**Examples in This Batch**: 21

---

### Examples:

[
  {
    "card_id": "n5_vocab_0657",
    "example_index": 0,
    "target_vocab": {
      "kanji": "貼る",
      "kana": "はる",
      "meaning": "to stick"
    },
    "sentence": {
      "japanese": "私は封筒に切手をはるのを忘れた。",
      "kana": "わたしはふうとうにきってをはるのをわすれた。",
      "english": "I forgot to attach a stamp to the envelope.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0657",
    "example_index": 1,
    "target_vocab": {
      "kanji": "貼る",
      "kana": "はる",
      "meaning": "to stick"
    },
    "sentence": {
      "japanese": "手紙を出す前に切手を貼るのを忘れた。",
      "kana": "てがみをだすまえにきってをはるのをわすれた。",
      "english": "I forgot to put on the stamp before I mailed the letter.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0657",
    "example_index": 2,
    "target_vocab": {
      "kanji": "貼る",
      "kana": "はる",
      "meaning": "to stick"
    },
    "sentence": {
      "japanese": "私が出して欲しいと頼んだ手紙に切手を貼るのを忘れないでね。",
      "kana": "わたしがだしてほしいとたのんだてがみにきってをはるのをわすれないでね。",
      "english": "Please don't forget to put stamps on the letters I gave you to post.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0657",
    "example_index": 3,
    "target_vocab": {
      "kanji": "貼る",
      "kana": "はる",
      "meaning": "to stick"
    },
    "sentence": {
      "japanese": "私が出すの頼んでおいた手紙にさ、切手貼るの忘れないでよ。",
      "kana": "わたしがだすのたのんでおいたてがみにさ、きってはるのわすれないでよ。",
      "english": "Please don't forget to put stamps on the letters that I gave you to mail.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0658",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "たばこ",
      "meaning": "tobacco"
    },
    "sentence": {
      "japanese": "たばこを吸わないの？",
      "kana": "たばこをすわないの？",
      "english": "Don't you smoke?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0658",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "たばこ",
      "meaning": "tobacco"
    },
    "sentence": {
      "japanese": "たばこを吸わないでほしいのですが。",
      "kana": "たばこをすわないでほしいのですが。",
      "english": "I'd rather you didn't smoke so much.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0658",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "たばこ",
      "meaning": "tobacco"
    },
    "sentence": {
      "japanese": "たばこは体に悪いよ。",
      "kana": "たばこはからだにわるいよ。",
      "english": "Smoking is bad for your health.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0659",
    "example_index": 0,
    "target_vocab": {
      "kanji": "涼しい",
      "kana": "すずしい",
      "meaning": "refreshing"
    },
    "sentence": {
      "japanese": "涼しい夏は好きですか。",
      "kana": "すずしいなつはすきですか。",
      "english": "Do you like a cool summer?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0659",
    "example_index": 1,
    "target_vocab": {
      "kanji": "涼しい",
      "kana": "すずしい",
      "meaning": "refreshing"
    },
    "sentence": {
      "japanese": "今日は涼しいです。",
      "kana": "こんにちはすずしいです。",
      "english": "It's cool today.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0659",
    "example_index": 2,
    "target_vocab": {
      "kanji": "涼しい",
      "kana": "すずしい",
      "meaning": "refreshing"
    },
    "sentence": {
      "japanese": "今日は少しすずしい。",
      "kana": "こんにちはすこしすずしい。",
      "english": "It is a little cool today.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0659",
    "example_index": 3,
    "target_vocab": {
      "kanji": "涼しい",
      "kana": "すずしい",
      "meaning": "refreshing"
    },
    "sentence": {
      "japanese": "今日は少しすずしい。",
      "kana": "こんにちはすこしすずしい。",
      "english": "It is a little cool today.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0660",
    "example_index": 0,
    "target_vocab": {
      "kanji": "昨日",
      "kana": "きのう",
      "meaning": "yesterday"
    },
    "sentence": {
      "japanese": "私は昨日夕飯を作った。",
      "kana": "わたしはきのうゆうはんをつくった。",
      "english": "I cooked supper last night.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0660",
    "example_index": 1,
    "target_vocab": {
      "kanji": "昨日",
      "kana": "きのう",
      "meaning": "yesterday"
    },
    "sentence": {
      "japanese": "昨日動物園に行った。",
      "kana": "きのうどうぶつえんにいった。",
      "english": "I went to the zoo yesterday.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0660",
    "example_index": 2,
    "target_vocab": {
      "kanji": "昨日",
      "kana": "きのう",
      "meaning": "yesterday"
    },
    "sentence": {
      "japanese": "彼女は昨日野菜を買いました。",
      "kana": "かのじょはきのうやさいをかいました。",
      "english": "She bought some vegetables yesterday.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0660",
    "example_index": 3,
    "target_vocab": {
      "kanji": "昨日",
      "kana": "きのう",
      "meaning": "yesterday"
    },
    "sentence": {
      "japanese": "彼は「この本をきのうここで買った」と言った。",
      "kana": "かれは「このほんをきのうここでかった」といった。",
      "english": "He said he had bought that book there the day before.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0660",
    "example_index": 4,
    "target_vocab": {
      "kanji": "昨日",
      "kana": "きのう",
      "meaning": "yesterday"
    },
    "sentence": {
      "japanese": "私はきのう歯が痛かった。",
      "kana": "わたしはきのうはがいたかった。",
      "english": "I had a toothache yesterday.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0660",
    "example_index": 5,
    "target_vocab": {
      "kanji": "昨日",
      "kana": "きのう",
      "meaning": "yesterday"
    },
    "sentence": {
      "japanese": "これは私がきのう買ったカメラです。",
      "kana": "これはわたしがきのうかったかめらです。",
      "english": "This is the camera which I bought yesterday.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0661",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "せっけん",
      "meaning": "economy"
    },
    "sentence": {
      "japanese": "せっけんで手を洗いました。",
      "kana": "せっけんでてをあらいました。",
      "english": "I washed my hands with soap.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0662",
    "example_index": 0,
    "target_vocab": {
      "kanji": "初め/始め",
      "kana": "はじめ",
      "meaning": "beginning"
    },
    "sentence": {
      "japanese": "彼は体を足から洗いはじめた。",
      "kana": "かれはからだをあしからあらいはじめた。",
      "english": "In washing himself, he started on the legs.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0662",
    "example_index": 1,
    "target_vocab": {
      "kanji": "初め/始め",
      "kana": "はじめ",
      "meaning": "beginning"
    },
    "sentence": {
      "japanese": "彼は車を洗いはじめた。",
      "kana": "かれはくるまをあらいはじめた。",
      "english": "He started washing his car.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0662",
    "example_index": 2,
    "target_vocab": {
      "kanji": "初め/始め",
      "kana": "はじめ",
      "meaning": "beginning"
    },
    "sentence": {
      "japanese": "雨が降りはじめた。",
      "kana": "あめがおりはじめた。",
      "english": "The rain began to fall.",
      "source": "tatoeba"
    }
  }
]

---

## Important Notes

- Be strict with grammar verification - when in doubt, mark as REVIEW
- Consider learner perspective - would a beginner understand this?
- Target vocabulary must be the MAIN focus of the sentence
- Rate difficulty relative to N5 range, not absolute Japanese proficiency
- Provide clear explanations for REVIEW and REJECT recommendations

## Output Instructions

1. Verify all examples in this batch
2. Return results as a JSON array
3. Include your verification reasoning in the notes fields
4. Be consistent with your ratings across all examples
