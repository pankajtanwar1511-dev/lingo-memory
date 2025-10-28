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

**Batch Number**: 7
**Total Batches**: 38
**Examples in This Batch**: 50

---

### Examples:

[
  {
    "card_id": "n5_vocab_0105",
    "example_index": 4,
    "target_vocab": {
      "kanji": "初めて",
      "kana": "はじめて",
      "meaning": "for the first time"
    },
    "sentence": {
      "japanese": "はじめて彼らに会ったのはいつですか。",
      "kana": "はじめてかれらにあったのはいつですか。",
      "english": "When did you see them first?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0105",
    "example_index": 5,
    "target_vocab": {
      "kanji": "初めて",
      "kana": "はじめて",
      "meaning": "for the first time"
    },
    "sentence": {
      "japanese": "この町に来たのははじめてですか。",
      "kana": "このまちにきたのははじめてですか。",
      "english": "Is this the first time that you have come to this town?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0106",
    "example_index": 0,
    "target_vocab": {
      "kanji": "風邪",
      "kana": "かぜ",
      "meaning": "a cold"
    },
    "sentence": {
      "japanese": "風邪で頭が痛い。",
      "kana": "かぜであたまがいたい。",
      "english": "My head aches with a cold.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0106",
    "example_index": 1,
    "target_vocab": {
      "kanji": "風邪",
      "kana": "かぜ",
      "meaning": "a cold"
    },
    "sentence": {
      "japanese": "風邪ですね。",
      "kana": "かぜですね。",
      "english": "It's just a cold.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0106",
    "example_index": 2,
    "target_vocab": {
      "kanji": "風邪",
      "kana": "かぜ",
      "meaning": "a cold"
    },
    "sentence": {
      "japanese": "彼女、風邪で休んでますよ。",
      "kana": "かのじょ、かぜでやすんでますよ。",
      "english": "She's off with the flu.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0107",
    "example_index": 0,
    "target_vocab": {
      "kanji": "赤い",
      "kana": "あかい",
      "meaning": "red"
    },
    "sentence": {
      "japanese": "彼女は赤いスカートをはいていた。",
      "kana": "かのじょはあかいすかーとをはいていた。",
      "english": "She was wearing a red skirt.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0107",
    "example_index": 1,
    "target_vocab": {
      "kanji": "赤い",
      "kana": "あかい",
      "meaning": "red"
    },
    "sentence": {
      "japanese": "赤いネクタイを買いました。",
      "kana": "あかいねくたいをかいました。",
      "english": "I bought a red tie.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0107",
    "example_index": 2,
    "target_vocab": {
      "kanji": "赤い",
      "kana": "あかい",
      "meaning": "red"
    },
    "sentence": {
      "japanese": "彼女は赤い服を着ていた。",
      "kana": "かのじょはあかいふくをきていた。",
      "english": "She was dressed in red.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0108",
    "example_index": 0,
    "target_vocab": {
      "kanji": "甘い",
      "kana": "あまい",
      "meaning": "sweet"
    },
    "sentence": {
      "japanese": "何か甘いものがほしい。",
      "kana": "なにかあまいものがほしい。",
      "english": "I want something sweet to eat.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0108",
    "example_index": 1,
    "target_vocab": {
      "kanji": "甘い",
      "kana": "あまい",
      "meaning": "sweet"
    },
    "sentence": {
      "japanese": "彼女は自分の子どもに甘い。",
      "kana": "かのじょはじぶんのこどもにあまい。",
      "english": "She lets her children have their own way too much.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0108",
    "example_index": 2,
    "target_vocab": {
      "kanji": "甘い",
      "kana": "あまい",
      "meaning": "sweet"
    },
    "sentence": {
      "japanese": "彼は甘いものが好きだ。",
      "kana": "かれはあまいものがすきだ。",
      "english": "He likes sweets.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0109",
    "example_index": 0,
    "target_vocab": {
      "kanji": "西",
      "kana": "にし",
      "meaning": "west"
    },
    "sentence": {
      "japanese": "この町は西も東も分かりません。",
      "kana": "このまちはにしもひがしもわかりません。",
      "english": "I'm quite a stranger in this town.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0109",
    "example_index": 1,
    "target_vocab": {
      "kanji": "西",
      "kana": "にし",
      "meaning": "west"
    },
    "sentence": {
      "japanese": "風は西から吹いている。",
      "kana": "かぜはにしからふいている。",
      "english": "The wind is blowing from the west.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0109",
    "example_index": 2,
    "target_vocab": {
      "kanji": "西",
      "kana": "にし",
      "meaning": "west"
    },
    "sentence": {
      "japanese": "駅はホテルの西の方にある。",
      "kana": "えきはほてるのにしのほうにある。",
      "english": "The station is to the west of the hotel.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0110",
    "example_index": 0,
    "target_vocab": {
      "kanji": "毎週",
      "kana": "まいしゅう",
      "meaning": "every week"
    },
    "sentence": {
      "japanese": "彼女は毎週私に手紙を書きます。",
      "kana": "かのじょはまいしゅうわたしにてがみをかきます。",
      "english": "She writes me every week.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0110",
    "example_index": 1,
    "target_vocab": {
      "kanji": "毎週",
      "kana": "まいしゅう",
      "meaning": "every week"
    },
    "sentence": {
      "japanese": "彼は毎週彼女に手紙を書く。",
      "kana": "かれはまいしゅうかのじょにてがみをかく。",
      "english": "He never fails to write to her every week.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0110",
    "example_index": 2,
    "target_vocab": {
      "kanji": "毎週",
      "kana": "まいしゅう",
      "meaning": "every week"
    },
    "sentence": {
      "japanese": "彼は毎週車を洗います。",
      "kana": "かれはまいしゅうくるまをあらいます。",
      "english": "He washes the car every week.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0113",
    "example_index": 0,
    "target_vocab": {
      "kanji": "建物",
      "kana": "たてもの",
      "meaning": "building"
    },
    "sentence": {
      "japanese": "病院の後ろにあるあの建物はなんですか。",
      "kana": "びょういんのうしろにあるあのたてものはなんですか。",
      "english": "What's that building at the back of the hospital?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0113",
    "example_index": 1,
    "target_vocab": {
      "kanji": "建物",
      "kana": "たてもの",
      "meaning": "building"
    },
    "sentence": {
      "japanese": "彼女はその建物の前で待っていた。",
      "kana": "かのじょはそのたてもののまえでまっていた。",
      "english": "She was waiting in front of the building.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0113",
    "example_index": 2,
    "target_vocab": {
      "kanji": "建物",
      "kana": "たてもの",
      "meaning": "building"
    },
    "sentence": {
      "japanese": "私達の前にあるあの大きな建物は何ですか。",
      "kana": "わたしたちのまえにあるあのおおきなたてものはなんですか。",
      "english": "What is that big building in front of us?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0114",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "なる",
      "meaning": "to become"
    },
    "sentence": {
      "japanese": "私も遠からずおとなになるだろう。",
      "kana": "わたしもとおからずおとなになるだろう。",
      "english": "I will also become a grown-up before long.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0114",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "なる",
      "meaning": "to become"
    },
    "sentence": {
      "japanese": "大好きになるか大嫌いになるかどちらかなんですね。",
      "kana": "だいすきになるかだいきらいになるかどちらかなんですね。",
      "english": "It's love-it-or-hate-it stuff.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0114",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "なる",
      "meaning": "to become"
    },
    "sentence": {
      "japanese": "家の家族は五人からなる。",
      "kana": "いえのかぞくはごにんからなる。",
      "english": "Our family consists of five members.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0115",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "まっすぐ",
      "meaning": "straight ahead"
    },
    "sentence": {
      "japanese": "絵はまっすぐですか。",
      "kana": "えはまっすぐですか。",
      "english": "Is the picture straight?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0115",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "まっすぐ",
      "meaning": "straight ahead"
    },
    "sentence": {
      "japanese": "まっすぐ行け。",
      "kana": "まっすぐいけ。",
      "english": "Go straight on.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0115",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "まっすぐ",
      "meaning": "straight ahead"
    },
    "sentence": {
      "japanese": "この道をまっすぐ行ってください。",
      "kana": "このみちをまっすぐいってください。",
      "english": "Go straight ahead on this street.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0116",
    "example_index": 0,
    "target_vocab": {
      "kanji": "作る",
      "kana": "つくる",
      "meaning": "to make"
    },
    "sentence": {
      "japanese": "薄い砂糖水を作った。",
      "kana": "うすいさとうみずをつくった。",
      "english": "I prepared a weak solution of sugar and water.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0116",
    "example_index": 1,
    "target_vocab": {
      "kanji": "作る",
      "kana": "つくる",
      "meaning": "to make"
    },
    "sentence": {
      "japanese": "私は昨日夕飯を作った。",
      "kana": "わたしはきのうゆうはんをつくった。",
      "english": "I cooked supper last night.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0116",
    "example_index": 2,
    "target_vocab": {
      "kanji": "作る",
      "kana": "つくる",
      "meaning": "to make"
    },
    "sentence": {
      "japanese": "毎日お昼ご飯を作っているよ。",
      "kana": "まいにちおひるごめしをつくっているよ。",
      "english": "I make lunch every day.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0116",
    "example_index": 3,
    "target_vocab": {
      "kanji": "作る",
      "kana": "つくる",
      "meaning": "to make"
    },
    "sentence": {
      "japanese": "ものをつくる前に人をつくれ。",
      "kana": "ものをつくるまえににんをつくれ。",
      "english": "Before making something, make the man.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0117",
    "example_index": 0,
    "target_vocab": {
      "kanji": "風",
      "kana": "かぜ",
      "meaning": "wind"
    },
    "sentence": {
      "japanese": "きょうかぜで学校を休みました。",
      "kana": "きょうかぜでがっこうをやすみました。",
      "english": "I didn't go to school today because I had a cold.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0117",
    "example_index": 1,
    "target_vocab": {
      "kanji": "風",
      "kana": "かぜ",
      "meaning": "wind"
    },
    "sentence": {
      "japanese": "寒かったうえに、風も強かった。",
      "kana": "さむかったうえに、かぜもつよかった。",
      "english": "It was cold, and, in addition, it was windy.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0117",
    "example_index": 2,
    "target_vocab": {
      "kanji": "風",
      "kana": "かぜ",
      "meaning": "wind"
    },
    "sentence": {
      "japanese": "またいつか風のように走るんだ。",
      "kana": "またいつかかぜのようにはしるんだ。",
      "english": "Someday I'll run like the wind.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0117",
    "example_index": 3,
    "target_vocab": {
      "kanji": "風",
      "kana": "かぜ",
      "meaning": "wind"
    },
    "sentence": {
      "japanese": "風がまだ強く吹きます。",
      "kana": "かぜがまだつよくふきます。",
      "english": "The wind still blows hard.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0118",
    "example_index": 0,
    "target_vocab": {
      "kanji": "少し",
      "kana": "すこし",
      "meaning": "few"
    },
    "sentence": {
      "japanese": "もう少し右の方へ―ようし！",
      "kana": "もうすこしみぎのほうへ―ようし！",
      "english": "A little more to the right, just like so!",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0118",
    "example_index": 1,
    "target_vocab": {
      "kanji": "少し",
      "kana": "すこし",
      "meaning": "few"
    },
    "sentence": {
      "japanese": "部屋には子ども達が少しいた。",
      "kana": "へやにはこどもとおるがすこしいた。",
      "english": "There were a few children in the room.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0118",
    "example_index": 2,
    "target_vocab": {
      "kanji": "少し",
      "kana": "すこし",
      "meaning": "few"
    },
    "sentence": {
      "japanese": "彼女は少し疲れたと言った。",
      "kana": "かのじょはすこしつかれたといった。",
      "english": "She said that she was a little tired.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0118",
    "example_index": 3,
    "target_vocab": {
      "kanji": "少し",
      "kana": "すこし",
      "meaning": "few"
    },
    "sentence": {
      "japanese": "私はすこしも疲れなかった。",
      "kana": "わたしはすこしもつかれなかった。",
      "english": "I was not a bit tired.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0119",
    "example_index": 0,
    "target_vocab": {
      "kanji": "大学",
      "kana": "だいがく",
      "meaning": "university"
    },
    "sentence": {
      "japanese": "私の兄は大学生です。",
      "kana": "わたしのあにはだいがくせいです。",
      "english": "My brother is a college student.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0119",
    "example_index": 1,
    "target_vocab": {
      "kanji": "大学",
      "kana": "だいがく",
      "meaning": "university"
    },
    "sentence": {
      "japanese": "彼女は大学生です。",
      "kana": "かのじょはだいがくせいです。",
      "english": "She is a college student.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0119",
    "example_index": 2,
    "target_vocab": {
      "kanji": "大学",
      "kana": "だいがく",
      "meaning": "university"
    },
    "sentence": {
      "japanese": "彼女は大学を出ている。",
      "kana": "かのじょはだいがくをでている。",
      "english": "She is a college graduate.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0120",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "シャツ",
      "meaning": "shirt"
    },
    "sentence": {
      "japanese": "あなたはシャツをあべこべに着ている。",
      "kana": "あなたはしゃつをあべこべにきている。",
      "english": "You are wearing your shirt inside out.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0120",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "シャツ",
      "meaning": "shirt"
    },
    "sentence": {
      "japanese": "彼はそのそばでシャツをすうっと着た。",
      "kana": "かれはそのそばでしゃつをすうっときた。",
      "english": "He slipped the gaudy shirt on.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0120",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "シャツ",
      "meaning": "shirt"
    },
    "sentence": {
      "japanese": "彼はいつも青いシャツをきている。",
      "kana": "かれはいつもあおいしゃつをきている。",
      "english": "He always wears blue shirts.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0121",
    "example_index": 0,
    "target_vocab": {
      "kanji": "病院",
      "kana": "びょういん",
      "meaning": "hospital"
    },
    "sentence": {
      "japanese": "病院へあなたと一緒に行きましょう。",
      "kana": "びょういんへあなたといっしょにいきましょう。",
      "english": "I'll accompany you to the hospital.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0121",
    "example_index": 1,
    "target_vocab": {
      "kanji": "病院",
      "kana": "びょういん",
      "meaning": "hospital"
    },
    "sentence": {
      "japanese": "病院はここから近い。",
      "kana": "びょういんはここからちかい。",
      "english": "The hospital is near here.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0121",
    "example_index": 2,
    "target_vocab": {
      "kanji": "病院",
      "kana": "びょういん",
      "meaning": "hospital"
    },
    "sentence": {
      "japanese": "病院の後ろにあるあの建物はなんですか。",
      "kana": "びょういんのうしろにあるあのたてものはなんですか。",
      "english": "What's that building at the back of the hospital?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0122",
    "example_index": 0,
    "target_vocab": {
      "kanji": "会社",
      "kana": "かいしゃ",
      "meaning": "company"
    },
    "sentence": {
      "japanese": "明日会社でね。",
      "kana": "あしたかいしゃでね。",
      "english": "See you tomorrow in the office.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0122",
    "example_index": 1,
    "target_vocab": {
      "kanji": "会社",
      "kana": "かいしゃ",
      "meaning": "company"
    },
    "sentence": {
      "japanese": "忙しくて会社にいるんだ。",
      "kana": "いそがしくてかいしゃにいるんだ。",
      "english": "I'm tied up at the office.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0122",
    "example_index": 2,
    "target_vocab": {
      "kanji": "会社",
      "kana": "かいしゃ",
      "meaning": "company"
    },
    "sentence": {
      "japanese": "忙しくて会社にいます。",
      "kana": "いそがしくてかいしゃにいます。",
      "english": "I am tied up at the office.",
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
