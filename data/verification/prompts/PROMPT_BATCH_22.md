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

**Batch Number**: 22
**Total Batches**: 38
**Examples in This Batch**: 50

---

### Examples:

[
  {
    "card_id": "n5_vocab_0366",
    "example_index": 1,
    "target_vocab": {
      "kanji": "鳴く",
      "kana": "なく",
      "meaning": "animal noise. to chirp"
    },
    "sentence": {
      "japanese": "木の上で鳥が楽しそうに鳴いている。",
      "kana": "きのうえでとりがたのしそうにないている。",
      "english": "A bird is singing in the tree.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0366",
    "example_index": 2,
    "target_vocab": {
      "kanji": "鳴く",
      "kana": "なく",
      "meaning": "animal noise. to chirp"
    },
    "sentence": {
      "japanese": "鳥が鳴いてるの聞いた？",
      "kana": "とりがないてるのきいた？",
      "english": "Did you hear the birds tweeting?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0366",
    "example_index": 3,
    "target_vocab": {
      "kanji": "鳴く",
      "kana": "なく",
      "meaning": "animal noise. to chirp"
    },
    "sentence": {
      "japanese": "私はメガネがなくては読めない。",
      "kana": "わたしはめがねがなくてはよめない。",
      "english": "I cannot read without glasses.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0366",
    "example_index": 4,
    "target_vocab": {
      "kanji": "鳴く",
      "kana": "なく",
      "meaning": "animal noise. to chirp"
    },
    "sentence": {
      "japanese": "今日は、これまでになく寒い。",
      "kana": "こんにちは、これまでになくさむい。",
      "english": "Today's the coldest day we've ever had.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0366",
    "example_index": 5,
    "target_vocab": {
      "kanji": "鳴く",
      "kana": "なく",
      "meaning": "animal noise. to chirp"
    },
    "sentence": {
      "japanese": "問題なのは何を読むかではなくてどう読むかである。",
      "kana": "もんだいなのはなにをよむかではなくてどうよむかである。",
      "english": "It is not what you read but how you read that matters.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0367",
    "example_index": 0,
    "target_vocab": {
      "kanji": "隣",
      "kana": "となり",
      "meaning": "next door to"
    },
    "sentence": {
      "japanese": "その家なら一軒おいて隣ですよ。",
      "kana": "そのいえならいっけんおいてとなりですよ。",
      "english": "The house is next door but one.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0367",
    "example_index": 1,
    "target_vocab": {
      "kanji": "隣",
      "kana": "となり",
      "meaning": "next door to"
    },
    "sentence": {
      "japanese": "隣の部屋がうるさいのです。",
      "kana": "となりのへやがうるさいのです。",
      "english": "It's noisy next door.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0367",
    "example_index": 2,
    "target_vocab": {
      "kanji": "隣",
      "kana": "となり",
      "meaning": "next door to"
    },
    "sentence": {
      "japanese": "彼らはお隣同士です。",
      "kana": "かれらはおとなりどうしです。",
      "english": "They are next door neighbors.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0367",
    "example_index": 3,
    "target_vocab": {
      "kanji": "隣",
      "kana": "となり",
      "meaning": "next door to"
    },
    "sentence": {
      "japanese": "彼女は私のとなりに座った。",
      "kana": "かのじょはわたしのとなりにすわった。",
      "english": "She sat next to me.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0367",
    "example_index": 4,
    "target_vocab": {
      "kanji": "隣",
      "kana": "となり",
      "meaning": "next door to"
    },
    "sentence": {
      "japanese": "彼らはとなりに住んでいる。",
      "kana": "かれらはとなりにすんでいる。",
      "english": "They live next door.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0368",
    "example_index": 0,
    "target_vocab": {
      "kanji": "先生",
      "kana": "せんせい",
      "meaning": "teacher"
    },
    "sentence": {
      "japanese": "この部屋は先生方に使われています。",
      "kana": "このへやはせんせいがたにつかわれています。",
      "english": "This room is used by teachers.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0368",
    "example_index": 1,
    "target_vocab": {
      "kanji": "先生",
      "kana": "せんせい",
      "meaning": "teacher"
    },
    "sentence": {
      "japanese": "先生、ペン書きにするのでしょうか。",
      "kana": "せんせい、ぺんかきにするのでしょうか。",
      "english": "Sir, do we have to write in ink?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0368",
    "example_index": 2,
    "target_vocab": {
      "kanji": "先生",
      "kana": "せんせい",
      "meaning": "teacher"
    },
    "sentence": {
      "japanese": "彼女は先生です。",
      "kana": "かのじょはせんせいです。",
      "english": "She is a teacher.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0369",
    "example_index": 0,
    "target_vocab": {
      "kanji": "出口",
      "kana": "でぐち",
      "meaning": "exit"
    },
    "sentence": {
      "japanese": "出口はどちらですか。",
      "kana": "でぐちはどちらですか。",
      "english": "Where is the way out?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0369",
    "example_index": 1,
    "target_vocab": {
      "kanji": "出口",
      "kana": "でぐち",
      "meaning": "exit"
    },
    "sentence": {
      "japanese": "出口はどこですか？",
      "kana": "でぐちはどこですか？",
      "english": "Where is the exit?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0370",
    "example_index": 0,
    "target_vocab": {
      "kanji": "後ろ",
      "kana": "うしろ",
      "meaning": "behind"
    },
    "sentence": {
      "japanese": "病院の後ろにあるあの建物はなんですか。",
      "kana": "びょういんのうしろにあるあのたてものはなんですか。",
      "english": "What's that building at the back of the hospital?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0370",
    "example_index": 1,
    "target_vocab": {
      "kanji": "後ろ",
      "kana": "うしろ",
      "meaning": "behind"
    },
    "sentence": {
      "japanese": "彼は私の後ろに立った。",
      "kana": "かれはわたしのうしろにたった。",
      "english": "He stood behind me.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0370",
    "example_index": 2,
    "target_vocab": {
      "kanji": "後ろ",
      "kana": "うしろ",
      "meaning": "behind"
    },
    "sentence": {
      "japanese": "彼は後ろのドアを閉めた。",
      "kana": "かれはうしろのどあをしめた。",
      "english": "He shut the door that was behind him.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0371",
    "example_index": 0,
    "target_vocab": {
      "kanji": "先月",
      "kana": "せんげつ",
      "meaning": "last month"
    },
    "sentence": {
      "japanese": "先月は非常に寒かった。",
      "kana": "せんげつはひじょうにさむかった。",
      "english": "It was very cold last month.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0371",
    "example_index": 1,
    "target_vocab": {
      "kanji": "先月",
      "kana": "せんげつ",
      "meaning": "last month"
    },
    "sentence": {
      "japanese": "先月はたくさん雨が降った。",
      "kana": "せんげつはたくさんあめがふった。",
      "english": "We had a lot of rain last month.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0371",
    "example_index": 2,
    "target_vocab": {
      "kanji": "先月",
      "kana": "せんげつ",
      "meaning": "last month"
    },
    "sentence": {
      "japanese": "先月はあまり雨が降らなかった。",
      "kana": "せんげつはあまりあめがふらなかった。",
      "english": "We didn't have much rain last month.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0372",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "テープ",
      "meaning": "tape"
    },
    "sentence": {
      "japanese": "明日そのテープを返してください。",
      "kana": "あしたそのてーぷをかえしてください。",
      "english": "Please bring back the tape tomorrow.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0372",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "テープ",
      "meaning": "tape"
    },
    "sentence": {
      "japanese": "私はテープを買います。",
      "kana": "わたしはてーぷをかいます。",
      "english": "I buy a tape.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0372",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "テープ",
      "meaning": "tape"
    },
    "sentence": {
      "japanese": "そのテープを聞きましょう。",
      "kana": "そのてーぷをききましょう。",
      "english": "Let's listen to the tape.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0375",
    "example_index": 0,
    "target_vocab": {
      "kanji": "本",
      "kana": "ほん",
      "meaning": "book"
    },
    "sentence": {
      "japanese": "とても暗いので私は本が読めない。",
      "kana": "とてもくらいのでわたしはほんがよめない。",
      "english": "It is too dark for me to read.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0375",
    "example_index": 1,
    "target_vocab": {
      "kanji": "本",
      "kana": "ほん",
      "meaning": "book"
    },
    "sentence": {
      "japanese": "机の上に一冊の本がある。",
      "kana": "つくえのうえにいっさつのほんがある。",
      "english": "There is an album on the desk.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0375",
    "example_index": 2,
    "target_vocab": {
      "kanji": "本",
      "kana": "ほん",
      "meaning": "book"
    },
    "sentence": {
      "japanese": "あなたは外国の本を持っていますか。",
      "kana": "あなたはがいこくのほんをもっていますか。",
      "english": "Do you have any foreign books?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0376",
    "example_index": 0,
    "target_vocab": {
      "kanji": "泳ぐ",
      "kana": "およぐ",
      "meaning": "to swim"
    },
    "sentence": {
      "japanese": "あなたは泳げますよね。",
      "kana": "あなたはおよげますよね。",
      "english": "You can swim, can't you?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0376",
    "example_index": 1,
    "target_vocab": {
      "kanji": "泳ぐ",
      "kana": "およぐ",
      "meaning": "to swim"
    },
    "sentence": {
      "japanese": "彼女は泳げないし、私も泳げない。",
      "kana": "かのじょはおよげないし、わたしもおよげない。",
      "english": "She can't swim and neither can I.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0376",
    "example_index": 2,
    "target_vocab": {
      "kanji": "泳ぐ",
      "kana": "およぐ",
      "meaning": "to swim"
    },
    "sentence": {
      "japanese": "彼女は泳げない。",
      "kana": "かのじょはおよげない。",
      "english": "She can't swim.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0378",
    "example_index": 0,
    "target_vocab": {
      "kanji": "門",
      "kana": "もん",
      "meaning": "gate"
    },
    "sentence": {
      "japanese": "門を閉める時間だ。",
      "kana": "もんをしめるじかんだ。",
      "english": "It is time to shut the gate.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0378",
    "example_index": 1,
    "target_vocab": {
      "kanji": "門",
      "kana": "もん",
      "meaning": "gate"
    },
    "sentence": {
      "japanese": "門は今開いている。",
      "kana": "もんはいまひらいている。",
      "english": "The gate is open now.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0378",
    "example_index": 2,
    "target_vocab": {
      "kanji": "門",
      "kana": "もん",
      "meaning": "gate"
    },
    "sentence": {
      "japanese": "彼女の友達は、門のそばで彼女を待った。",
      "kana": "かのじょのともだちは、もんのそばでかのじょをまった。",
      "english": "Her mates waited for her by the gate.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0378",
    "example_index": 3,
    "target_vocab": {
      "kanji": "門",
      "kana": "もん",
      "meaning": "gate"
    },
    "sentence": {
      "japanese": "知るもんか。",
      "kana": "しるもんか。",
      "english": "Who cares?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0378",
    "example_index": 4,
    "target_vocab": {
      "kanji": "門",
      "kana": "もん",
      "meaning": "gate"
    },
    "sentence": {
      "japanese": "その町なら庭みたいなもんだよ。",
      "kana": "そのまちならにわみたいなもんだよ。",
      "english": "I know every inch of the town.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0378",
    "example_index": 5,
    "target_vocab": {
      "kanji": "門",
      "kana": "もん",
      "meaning": "gate"
    },
    "sentence": {
      "japanese": "死ぬもんか。",
      "kana": "しぬもんか。",
      "english": "I won't die.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0379",
    "example_index": 0,
    "target_vocab": {
      "kanji": "荷物",
      "kana": "にもつ",
      "meaning": "luggage"
    },
    "sentence": {
      "japanese": "彼女は手荷物をたくさん持って行った。",
      "kana": "かのじょはてにもつをたくさんもっていった。",
      "english": "She took a lot of baggage with her.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0379",
    "example_index": 1,
    "target_vocab": {
      "kanji": "荷物",
      "kana": "にもつ",
      "meaning": "luggage"
    },
    "sentence": {
      "japanese": "彼女は手荷物をたくさん持ってきた。",
      "kana": "かのじょはてにもつをたくさんもってきた。",
      "english": "She took a lot of baggage with her.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0379",
    "example_index": 2,
    "target_vocab": {
      "kanji": "荷物",
      "kana": "にもつ",
      "meaning": "luggage"
    },
    "sentence": {
      "japanese": "彼女は手荷物をたくさん持っていた。",
      "kana": "かのじょはてにもつをたくさんもっていた。",
      "english": "She took a lot of baggage with her.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0380",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "この",
      "meaning": "this"
    },
    "sentence": {
      "japanese": "この靴下はちぐはぐだ。",
      "kana": "このくつしたはちぐはぐだ。",
      "english": "These socks do not match.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0380",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "この",
      "meaning": "this"
    },
    "sentence": {
      "japanese": "このセーターは洗っても大丈夫です。",
      "kana": "このせーたーはあらってもだいじょうぶです。",
      "english": "This sweater will stand washing.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0380",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "この",
      "meaning": "this"
    },
    "sentence": {
      "japanese": "このハンカチはいくらですか。",
      "kana": "このはんかちはいくらですか。",
      "english": "How much is this handkerchief?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0381",
    "example_index": 0,
    "target_vocab": {
      "kanji": "書く",
      "kana": "かく",
      "meaning": "to write"
    },
    "sentence": {
      "japanese": "彼に長い手紙を書いた。",
      "kana": "かれにながいてがみをかいた。",
      "english": "I wrote a long letter to him.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0381",
    "example_index": 1,
    "target_vocab": {
      "kanji": "書く",
      "kana": "かく",
      "meaning": "to write"
    },
    "sentence": {
      "japanese": "僕がこの本を書いたんだ。",
      "kana": "ぼくがこのほんをかいたんだ。",
      "english": "I wrote this book.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0381",
    "example_index": 2,
    "target_vocab": {
      "kanji": "書く",
      "kana": "かく",
      "meaning": "to write"
    },
    "sentence": {
      "japanese": "忘れずに手紙を書いてください。",
      "kana": "わすれずにてがみをかいてください。",
      "english": "Please remember to write to her.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0382",
    "example_index": 0,
    "target_vocab": {
      "kanji": "毎年",
      "kana": "まいねん/まいとし",
      "meaning": "every year"
    },
    "sentence": {
      "japanese": "毎年行きます。",
      "kana": "まいとしいきます。",
      "english": "I go every year.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0382",
    "example_index": 1,
    "target_vocab": {
      "kanji": "毎年",
      "kana": "まいねん/まいとし",
      "meaning": "every year"
    },
    "sentence": {
      "japanese": "毎年ここに来なきゃ。",
      "kana": "まいとしここにこなきゃ。",
      "english": "I'll have to come here every year.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0382",
    "example_index": 2,
    "target_vocab": {
      "kanji": "毎年",
      "kana": "まいねん/まいとし",
      "meaning": "every year"
    },
    "sentence": {
      "japanese": "毎年、私たちの町は春には暖かい天気になる。",
      "kana": "まいとし、わたしたちのまちははるにはあたたかいてんきになる。",
      "english": "Every year, spring brings warm weather to our town.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0383",
    "example_index": 0,
    "target_vocab": {
      "kanji": "明日",
      "kana": "あした",
      "meaning": "tomorrow"
    },
    "sentence": {
      "japanese": "それじゃまた明日。",
      "kana": "それじゃまたあした。",
      "english": "See you tomorrow.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0383",
    "example_index": 1,
    "target_vocab": {
      "kanji": "明日",
      "kana": "あした",
      "meaning": "tomorrow"
    },
    "sentence": {
      "japanese": "たぶん、明日は雪が降るだろう。",
      "kana": "たぶん、あしたはゆきがふるだろう。",
      "english": "Probably it will snow tomorrow.",
      "source": "jmdict"
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
