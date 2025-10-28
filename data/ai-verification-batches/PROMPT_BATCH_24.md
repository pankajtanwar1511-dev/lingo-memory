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

**Batch Number**: 24
**Total Batches**: 38
**Examples in This Batch**: 50

---

### Examples:

[
  {
    "card_id": "n5_vocab_0398",
    "example_index": 1,
    "target_vocab": {
      "kanji": "映画",
      "kana": "えいが",
      "meaning": "movie"
    },
    "sentence": {
      "japanese": "妹と私はときどき映画に行きます。",
      "kana": "いもうととわたしはときどきえいがにいきます。",
      "english": "My sister and I go to the movies from time to time.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0398",
    "example_index": 2,
    "target_vocab": {
      "kanji": "映画",
      "kana": "えいが",
      "meaning": "movie"
    },
    "sentence": {
      "japanese": "僕と一緒に映画に行った女の子は僕の友達です。",
      "kana": "ぼくといっしょにえいがにいったおんなのこはぼくのともだちです。",
      "english": "The girl I went to the movies with is a friend of mine.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0399",
    "example_index": 0,
    "target_vocab": {
      "kanji": "遅い",
      "kana": "おそい",
      "meaning": "late"
    },
    "sentence": {
      "japanese": "彼女は走るのが遅い。",
      "kana": "かのじょははしるのがおそい。",
      "english": "She is a slow runner.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0399",
    "example_index": 1,
    "target_vocab": {
      "kanji": "遅い",
      "kana": "おそい",
      "meaning": "late"
    },
    "sentence": {
      "japanese": "昨夜は、遅かったんです。",
      "kana": "さくやは、おそかったんです。",
      "english": "I stayed up late last night.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0399",
    "example_index": 2,
    "target_vocab": {
      "kanji": "遅い",
      "kana": "おそい",
      "meaning": "late"
    },
    "sentence": {
      "japanese": "彼女はホテルに夜遅く着いた。",
      "kana": "かのじょはほてるによるおそくついた。",
      "english": "She got to the hotel late at night.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0400",
    "example_index": 0,
    "target_vocab": {
      "kanji": "耳",
      "kana": "みみ",
      "meaning": "ear"
    },
    "sentence": {
      "japanese": "彼は耳が早い。",
      "kana": "かれはみみがはやい。",
      "english": "He is quick to learn.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0400",
    "example_index": 1,
    "target_vocab": {
      "kanji": "耳",
      "kana": "みみ",
      "meaning": "ear"
    },
    "sentence": {
      "japanese": "彼は私の言葉に耳をかさなかった。",
      "kana": "かれはわたしのことばにみみをかさなかった。",
      "english": "He turned a deaf ear to my words.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0400",
    "example_index": 2,
    "target_vocab": {
      "kanji": "耳",
      "kana": "みみ",
      "meaning": "ear"
    },
    "sentence": {
      "japanese": "彼の犬は耳が遠い。",
      "kana": "かのいぬはみみがとおい。",
      "english": "His dog is hard of hearing.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0401",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "かかる",
      "meaning": "to take time or money"
    },
    "sentence": {
      "japanese": "長くかかるんでしょうか。",
      "kana": "ながくかかるんでしょうか。",
      "english": "Will it be much longer?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0401",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "かかる",
      "meaning": "to take time or money"
    },
    "sentence": {
      "japanese": "医者にかかるべきだ。",
      "kana": "いしゃにかかるべきだ。",
      "english": "You should consult your doctor.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0401",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "かかる",
      "meaning": "to take time or money"
    },
    "sentence": {
      "japanese": "バスでは時間がかかるぞ。",
      "kana": "ばすではじかんがかかるぞ。",
      "english": "The bus will take time.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0404",
    "example_index": 0,
    "target_vocab": {
      "kanji": "机",
      "kana": "つくえ",
      "meaning": "desk"
    },
    "sentence": {
      "japanese": "机の上に一冊の本がある。",
      "kana": "つくえのうえにいっさつのほんがある。",
      "english": "There is an album on the desk.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0404",
    "example_index": 1,
    "target_vocab": {
      "kanji": "机",
      "kana": "つくえ",
      "meaning": "desk"
    },
    "sentence": {
      "japanese": "この机は私にはちょっと低い。",
      "kana": "このつくえはわたしにはちょっとひくい。",
      "english": "This desk is a little low for me.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0404",
    "example_index": 2,
    "target_vocab": {
      "kanji": "机",
      "kana": "つくえ",
      "meaning": "desk"
    },
    "sentence": {
      "japanese": "あの窓のそばの机は使うな。",
      "kana": "あのまどのそばのつくえはつかうな。",
      "english": "Don't use the desk by that window.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0405",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "あっち",
      "meaning": "over there"
    },
    "sentence": {
      "japanese": "さあ、あっちへ行ってよ。",
      "kana": "さあ、あっちへいってよ。",
      "english": "Oh, off with you.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0405",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "あっち",
      "meaning": "over there"
    },
    "sentence": {
      "japanese": "こっちの本はあっちの本よりやさしい。",
      "kana": "こっちのほんはあっちのほんよりやさしい。",
      "english": "These books are easier than those books.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0405",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "あっち",
      "meaning": "over there"
    },
    "sentence": {
      "japanese": "あっちの本は彼らの本です。",
      "kana": "あっちのほんはかれらのほんです。",
      "english": "Those books are theirs.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0406",
    "example_index": 0,
    "target_vocab": {
      "kanji": "買う",
      "kana": "かう",
      "meaning": "to buy"
    },
    "sentence": {
      "japanese": "どんなに高くても、あの古い時計を買います。",
      "kana": "どんなにたかくても、あのふるいとけいをかいます。",
      "english": "I'll buy that old clock, however expensive it is.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0406",
    "example_index": 1,
    "target_vocab": {
      "kanji": "買う",
      "kana": "かう",
      "meaning": "to buy"
    },
    "sentence": {
      "japanese": "あのデパートで新しいコートを買いたい。",
      "kana": "あのでぱーとであたらしいこーとをかいたい。",
      "english": "I would like to buy a new coat at that department store.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0406",
    "example_index": 2,
    "target_vocab": {
      "kanji": "買う",
      "kana": "かう",
      "meaning": "to buy"
    },
    "sentence": {
      "japanese": "その雑誌はどこで買えますか。",
      "kana": "そのざっしはどこでかえますか。",
      "english": "Where can I buy that magazine?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0407",
    "example_index": 0,
    "target_vocab": {
      "kanji": "開く",
      "kana": "あく",
      "meaning": "to open"
    },
    "sentence": {
      "japanese": "門は今開いている。",
      "kana": "もんはいまひらいている。",
      "english": "The gate is open now.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0407",
    "example_index": 1,
    "target_vocab": {
      "kanji": "開く",
      "kana": "あく",
      "meaning": "to open"
    },
    "sentence": {
      "japanese": "本を開くな。",
      "kana": "ほんをひらくな。",
      "english": "Don't open your book.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0407",
    "example_index": 2,
    "target_vocab": {
      "kanji": "開く",
      "kana": "あく",
      "meaning": "to open"
    },
    "sentence": {
      "japanese": "頻繁にパーティーを開くのが大好きだ。",
      "kana": "ひんぱんにぱーてぃーをひらくのがだいすきだ。",
      "english": "They love to give parties all the time.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0408",
    "example_index": 0,
    "target_vocab": {
      "kanji": "教室",
      "kana": "きょうしつ",
      "meaning": "classroom"
    },
    "sentence": {
      "japanese": "彼女は教室の前の方に立っていた。",
      "kana": "かのじょはきょうしつのまえのほうにたっていた。",
      "english": "She was standing in the front of the classroom.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0408",
    "example_index": 1,
    "target_vocab": {
      "kanji": "教室",
      "kana": "きょうしつ",
      "meaning": "classroom"
    },
    "sentence": {
      "japanese": "彼女はいつ教室から出ていったのですか。",
      "kana": "かのじょはいつきょうしつからでていったのですか。",
      "english": "When did she leave the classroom?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0408",
    "example_index": 2,
    "target_vocab": {
      "kanji": "教室",
      "kana": "きょうしつ",
      "meaning": "classroom"
    },
    "sentence": {
      "japanese": "先生は私を教室に立たせておいた。",
      "kana": "せんせいはわたしをきょうしつにたたせておいた。",
      "english": "My teacher had me standing in the classroom.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0409",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "かばん",
      "meaning": "bag"
    },
    "sentence": {
      "japanese": "彼女はあなたが持っているのと同じようなかばんを持っている。",
      "kana": "かのじょはあなたがもっているのとおなじようなかばんをもっている。",
      "english": "She has the same bag as you have.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0409",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "かばん",
      "meaning": "bag"
    },
    "sentence": {
      "japanese": "私のかばんです。",
      "kana": "わたしのかばんです。",
      "english": "This is my bag.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0409",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "かばん",
      "meaning": "bag"
    },
    "sentence": {
      "japanese": "君のかばんはここにあるよ。",
      "kana": "くんのかばんはここにあるよ。",
      "english": "Here is your bag.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0410",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "マッチ",
      "meaning": "match"
    },
    "sentence": {
      "japanese": "マッチを持っていますか。",
      "kana": "まっちをもっていますか。",
      "english": "Have you got a match?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0410",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "マッチ",
      "meaning": "match"
    },
    "sentence": {
      "japanese": "マッチで遊んではいけません。",
      "kana": "まっちであそんではいけません。",
      "english": "You shouldn't play with matches.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0411",
    "example_index": 0,
    "target_vocab": {
      "kanji": "短い",
      "kana": "みじかい",
      "meaning": "short"
    },
    "sentence": {
      "japanese": "彼女は短いスカートが好きだ。",
      "kana": "かのじょはみじかいすかーとがすきだ。",
      "english": "She likes short skirts.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0411",
    "example_index": 1,
    "target_vocab": {
      "kanji": "短い",
      "kana": "みじかい",
      "meaning": "short"
    },
    "sentence": {
      "japanese": "彼は短い病気の後で死んだ。",
      "kana": "かれはみじかいびょうきのあとでしんだ。",
      "english": "He died after a brief illness.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0411",
    "example_index": 2,
    "target_vocab": {
      "kanji": "短い",
      "kana": "みじかい",
      "meaning": "short"
    },
    "sentence": {
      "japanese": "私はそんなに短い時間でその本は読めません。",
      "kana": "わたしはそんなにみじかいじかんでそのほんはよめません。",
      "english": "I cannot read the book in so short a time.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0412",
    "example_index": 0,
    "target_vocab": {
      "kanji": "姉",
      "kana": "あね",
      "meaning": "(humble) older sister"
    },
    "sentence": {
      "japanese": "私の姉は君より背が低い。",
      "kana": "わたしのあねはくんよりせがひくい。",
      "english": "My sister is shorter than you.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0412",
    "example_index": 1,
    "target_vocab": {
      "kanji": "姉",
      "kana": "あね",
      "meaning": "(humble) older sister"
    },
    "sentence": {
      "japanese": "彼女は私の姉です。",
      "kana": "かのじょはわたしのあねです。",
      "english": "She is my elder sister.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0412",
    "example_index": 2,
    "target_vocab": {
      "kanji": "姉",
      "kana": "あね",
      "meaning": "(humble) older sister"
    },
    "sentence": {
      "japanese": "彼女は姉同様きれいだ。",
      "kana": "かのじょはあねどうようきれいだ。",
      "english": "She is no less beautiful than her sister.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0413",
    "example_index": 0,
    "target_vocab": {
      "kanji": "大勢",
      "kana": "おおぜい",
      "meaning": "great number of people"
    },
    "sentence": {
      "japanese": "そこには大勢の人がいた。",
      "kana": "そこにはおおぜいのにんがいた。",
      "english": "There was a large crowd there.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0413",
    "example_index": 1,
    "target_vocab": {
      "kanji": "大勢",
      "kana": "おおぜい",
      "meaning": "great number of people"
    },
    "sentence": {
      "japanese": "彼の家族は大勢である。",
      "kana": "かのかぞくはおおぜいである。",
      "english": "His is a large family.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0413",
    "example_index": 2,
    "target_vocab": {
      "kanji": "大勢",
      "kana": "おおぜい",
      "meaning": "great number of people"
    },
    "sentence": {
      "japanese": "大勢の人たちがバスを待っていた。",
      "kana": "おおぜいのにんたちがばすをまっていた。",
      "english": "There were a lot of people waiting for the bus.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0414",
    "example_index": 0,
    "target_vocab": {
      "kanji": "開ける",
      "kana": "あける",
      "meaning": "to open"
    },
    "sentence": {
      "japanese": "電車が停まるまで開けないで。",
      "kana": "でんしゃがとまるまでひらけないで。",
      "english": "Don't open before the train stops.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0414",
    "example_index": 1,
    "target_vocab": {
      "kanji": "開ける",
      "kana": "あける",
      "meaning": "to open"
    },
    "sentence": {
      "japanese": "口を開けてください！",
      "kana": "くちをひらけてください！",
      "english": "Open your mouth!",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0414",
    "example_index": 2,
    "target_vocab": {
      "kanji": "開ける",
      "kana": "あける",
      "meaning": "to open"
    },
    "sentence": {
      "japanese": "目を開けてください。",
      "kana": "めをひらけてください。",
      "english": "Open your eyes, please.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0415",
    "example_index": 0,
    "target_vocab": {
      "kanji": "忙しい",
      "kana": "いそがしい",
      "meaning": "busy"
    },
    "sentence": {
      "japanese": "忙しくって、クレージーだ。",
      "kana": "いそがしくって、くれーじーだ。",
      "english": "Staying busy and crazy!!",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0415",
    "example_index": 1,
    "target_vocab": {
      "kanji": "忙しい",
      "kana": "いそがしい",
      "meaning": "busy"
    },
    "sentence": {
      "japanese": "その女の子達は、とても忙しい。",
      "kana": "そのおんなのことおるは、とてもいそがしい。",
      "english": "Those girls are very busy.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0415",
    "example_index": 2,
    "target_vocab": {
      "kanji": "忙しい",
      "kana": "いそがしい",
      "meaning": "busy"
    },
    "sentence": {
      "japanese": "来月はとても忙しいだろう。",
      "kana": "らいげつはとてもいそがしいだろう。",
      "english": "I'll be very busy next month.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0415",
    "example_index": 3,
    "target_vocab": {
      "kanji": "忙しい",
      "kana": "いそがしい",
      "meaning": "busy"
    },
    "sentence": {
      "japanese": "彼は明日いそがしいだろう。",
      "kana": "かれはあしたいそがしいだろう。",
      "english": "He'll be busy tomorrow.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0417",
    "example_index": 0,
    "target_vocab": {
      "kanji": "店",
      "kana": "みせ",
      "meaning": "shop"
    },
    "sentence": {
      "japanese": "その店は野菜を売っている。",
      "kana": "そのみせはやさいをうっている。",
      "english": "The store deals in vegetables.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0417",
    "example_index": 1,
    "target_vocab": {
      "kanji": "店",
      "kana": "みせ",
      "meaning": "shop"
    },
    "sentence": {
      "japanese": "その店は私の家の目と鼻の先にある。",
      "kana": "そのみせはわたしのいえのめとはなのさきにある。",
      "english": "The store is close to my house.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0417",
    "example_index": 2,
    "target_vocab": {
      "kanji": "店",
      "kana": "みせ",
      "meaning": "shop"
    },
    "sentence": {
      "japanese": "彼女はその店へ行った。",
      "kana": "かのじょはそのみせへいった。",
      "english": "She went to that store.",
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
