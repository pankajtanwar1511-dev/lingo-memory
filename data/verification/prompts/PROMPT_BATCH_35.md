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

**Batch Number**: 35
**Total Batches**: 38
**Examples in This Batch**: 50

---

### Examples:

[
  {
    "card_id": "n5_vocab_0606",
    "example_index": 0,
    "target_vocab": {
      "kanji": "結婚",
      "kana": "けっこん",
      "meaning": "marriage"
    },
    "sentence": {
      "japanese": "彼女は来年結婚する。",
      "kana": "かのじょはらいねんけっこんする。",
      "english": "She'll be getting married next year.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0606",
    "example_index": 1,
    "target_vocab": {
      "kanji": "結婚",
      "kana": "けっこん",
      "meaning": "marriage"
    },
    "sentence": {
      "japanese": "彼女は彼と結婚するのを嫌がっている。",
      "kana": "かのじょはかれとけっこんするのをいやがっている。",
      "english": "She is reluctant to marry him.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0606",
    "example_index": 2,
    "target_vocab": {
      "kanji": "結婚",
      "kana": "けっこん",
      "meaning": "marriage"
    },
    "sentence": {
      "japanese": "彼女は彼と結婚するのかなあ。",
      "kana": "かのじょはかれとけっこんするのかなあ。",
      "english": "I wonder if she will marry him.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0607",
    "example_index": 0,
    "target_vocab": {
      "kanji": "置く",
      "kana": "おく",
      "meaning": "to put"
    },
    "sentence": {
      "japanese": "その家なら一軒おいて隣ですよ。",
      "kana": "そのいえならいっけんおいてとなりですよ。",
      "english": "The house is next door but one.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0607",
    "example_index": 1,
    "target_vocab": {
      "kanji": "置く",
      "kana": "おく",
      "meaning": "to put"
    },
    "sentence": {
      "japanese": "その古い置き時計はまだ使われている。",
      "kana": "そのふるいおきどけいはまだつかわれている。",
      "english": "The old clock is still in use.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0607",
    "example_index": 2,
    "target_vocab": {
      "kanji": "置く",
      "kana": "おく",
      "meaning": "to put"
    },
    "sentence": {
      "japanese": "目を開けておくのよ。",
      "kana": "めをひらけておくのよ。",
      "english": "Keep your eyes open.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0607",
    "example_index": 3,
    "target_vocab": {
      "kanji": "置く",
      "kana": "おく",
      "meaning": "to put"
    },
    "sentence": {
      "japanese": "目を開けておくのよ。",
      "kana": "めをひらけておくのよ。",
      "english": "Keep your eyes open.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0607",
    "example_index": 4,
    "target_vocab": {
      "kanji": "置く",
      "kana": "おく",
      "meaning": "to put"
    },
    "sentence": {
      "japanese": "妹は部屋をいつもきれいにいておく。",
      "kana": "いもうとはへやをいつもきれいにいておく。",
      "english": "My sister always keeps her room clean.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0607",
    "example_index": 5,
    "target_vocab": {
      "kanji": "置く",
      "kana": "おく",
      "meaning": "to put"
    },
    "sentence": {
      "japanese": "部屋の窓は閉めておくように。",
      "kana": "へやのまどはしめておくように。",
      "english": "See that the windows in your room are fastened.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0608",
    "example_index": 0,
    "target_vocab": {
      "kanji": "渡る",
      "kana": "わたる",
      "meaning": "to go across"
    },
    "sentence": {
      "japanese": "この雑誌は広く行き渡っている。",
      "kana": "このざっしはひろくいきわたっている。",
      "english": "This magazine circulates widely.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0608",
    "example_index": 1,
    "target_vocab": {
      "kanji": "渡る",
      "kana": "わたる",
      "meaning": "to go across"
    },
    "sentence": {
      "japanese": "彼は海を渡った。",
      "kana": "かれはうみをわたった。",
      "english": "He crossed over the sea.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0608",
    "example_index": 2,
    "target_vocab": {
      "kanji": "渡る",
      "kana": "わたる",
      "meaning": "to go across"
    },
    "sentence": {
      "japanese": "道を渡ろう。",
      "kana": "みちをわたろう。",
      "english": "Let's cross the street.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0608",
    "example_index": 3,
    "target_vocab": {
      "kanji": "渡る",
      "kana": "わたる",
      "meaning": "to go across"
    },
    "sentence": {
      "japanese": "そのふるい橋をわたるのは危ない。",
      "kana": "そのふるいはしをわたるのはあぶない。",
      "english": "It is dangerous to cross that old bridge.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0612",
    "example_index": 0,
    "target_vocab": {
      "kanji": "家庭",
      "kana": "かてい",
      "meaning": "household"
    },
    "sentence": {
      "japanese": "僕は仕事より家庭の方が大事だ。",
      "kana": "ぼくはしごとよりかていのほうがだいじだ。",
      "english": "My family comes before my career.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0612",
    "example_index": 1,
    "target_vocab": {
      "kanji": "家庭",
      "kana": "かてい",
      "meaning": "household"
    },
    "sentence": {
      "japanese": "男は家を造り女は家庭を作る。",
      "kana": "おとこはいえをつくりおんなはかていをつくる。",
      "english": "Men make houses, women make homes.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0612",
    "example_index": 2,
    "target_vocab": {
      "kanji": "家庭",
      "kana": "かてい",
      "meaning": "household"
    },
    "sentence": {
      "japanese": "私は仕事より家庭のほうが大事だ。",
      "kana": "わたしはしごとよりかていのほうがだいじだ。",
      "english": "I put my family before my career.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0613",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "パーティー",
      "meaning": "party"
    },
    "sentence": {
      "japanese": "月並みのパーティーだったよ。",
      "kana": "つきなみみのぱーてぃーだったよ。",
      "english": "That was just another party.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0613",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "パーティー",
      "meaning": "party"
    },
    "sentence": {
      "japanese": "僕らと一緒にパーティーに行こうよ。",
      "kana": "ぼくらといっしょにぱーてぃーにいこうよ。",
      "english": "Why don't you come along with us to the party?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0613",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "パーティー",
      "meaning": "party"
    },
    "sentence": {
      "japanese": "忙しいのでパーティーには出られません。",
      "kana": "いそがしいのでぱーてぃーにはでられません。",
      "english": "I'm so busy I can't attend the party.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0614",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "あちら",
      "meaning": "there"
    },
    "sentence": {
      "japanese": "あちらに着いたら手紙をください。",
      "kana": "あちらについたらてがみをください。",
      "english": "Please write to me when you get there.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0614",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "あちら",
      "meaning": "there"
    },
    "sentence": {
      "japanese": "あちらが私の待っていた人です。",
      "kana": "あちらがわたしのまっていたにんです。",
      "english": "That's the person I've been waiting for.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0614",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "あちら",
      "meaning": "there"
    },
    "sentence": {
      "japanese": "こちらが私の靴で、あちらがあなたのです。",
      "kana": "こちらがわたしのくつで、あちらがあなたのです。",
      "english": "These are my shoes and those are yours.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0615",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "スカート",
      "meaning": "skirt"
    },
    "sentence": {
      "japanese": "彼女は赤いスカートをはいていた。",
      "kana": "かのじょはあかいすかーとをはいていた。",
      "english": "She was wearing a red skirt.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0615",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "スカート",
      "meaning": "skirt"
    },
    "sentence": {
      "japanese": "彼女は短いスカートが好きだ。",
      "kana": "かのじょはみじかいすかーとがすきだ。",
      "english": "She likes short skirts.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0615",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "スカート",
      "meaning": "skirt"
    },
    "sentence": {
      "japanese": "昨日このスカートを買ったのは誰ですか。",
      "kana": "きのうこのすかーとをかったのはだれですか。",
      "english": "Who was it that bought this skirt yesterday?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0616",
    "example_index": 0,
    "target_vocab": {
      "kanji": "靴",
      "kana": "くつ",
      "meaning": "shoes"
    },
    "sentence": {
      "japanese": "彼女は白い靴をはいていた。",
      "kana": "かのじょはしろいくつをはいていた。",
      "english": "She had white shoes on.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0616",
    "example_index": 1,
    "target_vocab": {
      "kanji": "靴",
      "kana": "くつ",
      "meaning": "shoes"
    },
    "sentence": {
      "japanese": "彼女は靴にたくさん金を使う。",
      "kana": "かのじょはくつにたくさんきんをつかう。",
      "english": "She spends a lot of money on shoes.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0616",
    "example_index": 2,
    "target_vocab": {
      "kanji": "靴",
      "kana": "くつ",
      "meaning": "shoes"
    },
    "sentence": {
      "japanese": "彼は古い靴をはいていた。",
      "kana": "かれはふるいくつをはいていた。",
      "english": "He wore old shoes.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0616",
    "example_index": 3,
    "target_vocab": {
      "kanji": "靴",
      "kana": "くつ",
      "meaning": "shoes"
    },
    "sentence": {
      "japanese": "彼はくつをみがいた。",
      "kana": "かれはくつをみがいた。",
      "english": "He shined his shoes.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0616",
    "example_index": 4,
    "target_vocab": {
      "kanji": "靴",
      "kana": "くつ",
      "meaning": "shoes"
    },
    "sentence": {
      "japanese": "そのくつはどこで買ったんですか。",
      "kana": "そのくつはどこでかったんですか。",
      "english": "Where did you buy the shoes?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0616",
    "example_index": 5,
    "target_vocab": {
      "kanji": "靴",
      "kana": "くつ",
      "meaning": "shoes"
    },
    "sentence": {
      "japanese": "犬は私のくつを食べました。",
      "kana": "いぬはわたしのくつをたべました。",
      "english": "The dog ate my shoe.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0617",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "ボタン",
      "meaning": "button"
    },
    "sentence": {
      "japanese": "彼は非常ボタンをおした。",
      "kana": "かれはひじょうぼたんをおした。",
      "english": "He pushed the emergency button.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0617",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "ボタン",
      "meaning": "button"
    },
    "sentence": {
      "japanese": "彼はボタンを押して待った。",
      "kana": "かれはぼたんをおしてまった。",
      "english": "He pressed the button and waited.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0617",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "ボタン",
      "meaning": "button"
    },
    "sentence": {
      "japanese": "ボタンを押しましたか。",
      "kana": "ぼたんをおしましたか。",
      "english": "Did you push the button?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0618",
    "example_index": 0,
    "target_vocab": {
      "kanji": "今月",
      "kana": "こんげつ",
      "meaning": "this month"
    },
    "sentence": {
      "japanese": "今月は雨が多かった。",
      "kana": "こんげつはあめがおおかった。",
      "english": "We've had a lot of rain this month.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0618",
    "example_index": 1,
    "target_vocab": {
      "kanji": "今月",
      "kana": "こんげつ",
      "meaning": "this month"
    },
    "sentence": {
      "japanese": "今月は雨がたくさん降った。",
      "kana": "こんげつはあめがたくさんふった。",
      "english": "We've had a lot of rain this month.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0618",
    "example_index": 2,
    "target_vocab": {
      "kanji": "今月",
      "kana": "こんげつ",
      "meaning": "this month"
    },
    "sentence": {
      "japanese": "今月はまだ雨が降りません。",
      "kana": "こんげつはまだあめがおりません。",
      "english": "It hasn't rained this month yet.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0619",
    "example_index": 0,
    "target_vocab": {
      "kanji": "返す",
      "kana": "かえす",
      "meaning": "to return something"
    },
    "sentence": {
      "japanese": "明日そのテープを返してください。",
      "kana": "あしたそのてーぷをかえしてください。",
      "english": "Please bring back the tape tomorrow.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0619",
    "example_index": 1,
    "target_vocab": {
      "kanji": "返す",
      "kana": "かえす",
      "meaning": "to return something"
    },
    "sentence": {
      "japanese": "彼は私の辞書を返すのを忘れた。",
      "kana": "かれはわたしのじしょをかえすのをわすれた。",
      "english": "He forgot to give back my dictionary.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0619",
    "example_index": 2,
    "target_vocab": {
      "kanji": "返す",
      "kana": "かえす",
      "meaning": "to return something"
    },
    "sentence": {
      "japanese": "借りるのが好きな人は返すのが嫌いだ。",
      "kana": "かりるのがすきなにんはかえすのがきらいだ。",
      "english": "Those who like borrowing dislike paying.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0620",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "いかが",
      "meaning": "how"
    },
    "sentence": {
      "japanese": "紅茶またはコーヒーはいかが？",
      "kana": "こうちゃまたはこーひーはいかが？",
      "english": "Would you like some tea or coffee?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0620",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "いかが",
      "meaning": "how"
    },
    "sentence": {
      "japanese": "新しい仕事はいかがですか。",
      "kana": "あたらしいしごとはいかがですか。",
      "english": "How do you like your new job?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0620",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "いかが",
      "meaning": "how"
    },
    "sentence": {
      "japanese": "新しいクラスはいかがですか。",
      "kana": "あたらしいくらすはいかがですか。",
      "english": "How do you like your new class?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0621",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "ストーブ",
      "meaning": "heater"
    },
    "sentence": {
      "japanese": "ストーブちゃんと消した？",
      "kana": "すとーぶちゃんとけした？",
      "english": "Did you turn the stove off?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0621",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "ストーブ",
      "meaning": "heater"
    },
    "sentence": {
      "japanese": "ストーブ切った？",
      "kana": "すとーぶきった？",
      "english": "Did you turn the stove off?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0622",
    "example_index": 0,
    "target_vocab": {
      "kanji": "二人",
      "kana": "ふたり",
      "meaning": "two people"
    },
    "sentence": {
      "japanese": "私たちは２人とも同じクラスです。",
      "kana": "わたしたちは２にんともおなじくらすです。",
      "english": "We are both in the same class.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0622",
    "example_index": 1,
    "target_vocab": {
      "kanji": "二人",
      "kana": "ふたり",
      "meaning": "two people"
    },
    "sentence": {
      "japanese": "我々二人がここにいるのは不自然だ。",
      "kana": "われわれふたりがここにいるのはふしぜんだ。",
      "english": "The two of us don't belong here.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0622",
    "example_index": 2,
    "target_vocab": {
      "kanji": "二人",
      "kana": "ふたり",
      "meaning": "two people"
    },
    "sentence": {
      "japanese": "僕には兄さんが一人と妹が二人いる。",
      "kana": "ぼくにはにいさんがひとりといもうとがふたりいる。",
      "english": "I have one big brother and two little sisters.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0622",
    "example_index": 3,
    "target_vocab": {
      "kanji": "二人",
      "kana": "ふたり",
      "meaning": "two people"
    },
    "sentence": {
      "japanese": "私にはふたりの子供がいる。一人は男の子、もうひとりは女の子です。",
      "kana": "わたしにはふたりのこどもがいる。ひとりはおとこのこ、もうひとりはおんなのこです。",
      "english": "I have two children. One is a boy and the other is a girl.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0622",
    "example_index": 4,
    "target_vocab": {
      "kanji": "二人",
      "kana": "ふたり",
      "meaning": "two people"
    },
    "sentence": {
      "japanese": "私たちは子供がふたりいる。",
      "kana": "わたしたちはこどもがふたりいる。",
      "english": "We have two kids.",
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
