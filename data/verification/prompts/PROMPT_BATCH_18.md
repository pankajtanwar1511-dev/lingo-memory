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

**Batch Number**: 18
**Total Batches**: 38
**Examples in This Batch**: 50

---

### Examples:

[
  {
    "card_id": "n5_vocab_0297",
    "example_index": 5,
    "target_vocab": {
      "kanji": "一昨日",
      "kana": "おととい",
      "meaning": "day before yesterday"
    },
    "sentence": {
      "japanese": "おととい彼に会ったんだ。",
      "kana": "おとといかれにあったんだ。",
      "english": "I met him the day before yesterday.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0298",
    "example_index": 0,
    "target_vocab": {
      "kanji": "有名",
      "kana": "ゆうめい",
      "meaning": "famous"
    },
    "sentence": {
      "japanese": "みんなあなたに会いたがってる。あなたは有名なのよ！",
      "kana": "みんなあなたにあいたがってる。あなたはゆうめいなのよ！",
      "english": "Everyone wants to meet you. You're famous!",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0298",
    "example_index": 1,
    "target_vocab": {
      "kanji": "有名",
      "kana": "ゆうめい",
      "meaning": "famous"
    },
    "sentence": {
      "japanese": "彼は確かに有名人だが、嫌いな男だ。",
      "kana": "かれはたしかにゆうめいじんだが、きらいなおとこだ。",
      "english": "He is a famous man, to be sure, but I don't like him.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0298",
    "example_index": 2,
    "target_vocab": {
      "kanji": "有名",
      "kana": "ゆうめい",
      "meaning": "famous"
    },
    "sentence": {
      "japanese": "彼の絵はとても有名です。",
      "kana": "かのえはとてもゆうめいです。",
      "english": "His pictures are very famous.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0300",
    "example_index": 0,
    "target_vocab": {
      "kanji": "近い",
      "kana": "ちかい",
      "meaning": "near"
    },
    "sentence": {
      "japanese": "あれ、そんなに近いとは知りませんでした。",
      "kana": "あれ、そんなにちかいとはしりませんでした。",
      "english": "Oh, I didn't know it was that close.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0300",
    "example_index": 1,
    "target_vocab": {
      "kanji": "近い",
      "kana": "ちかい",
      "meaning": "near"
    },
    "sentence": {
      "japanese": "病院はここから近い。",
      "kana": "びょういんはここからちかい。",
      "english": "The hospital is near here.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0300",
    "example_index": 2,
    "target_vocab": {
      "kanji": "近い",
      "kana": "ちかい",
      "meaning": "near"
    },
    "sentence": {
      "japanese": "私達の学校は駅に近い。",
      "kana": "わたしたちのがっこうはえきにちかい。",
      "english": "Our school is near the station.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0301",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "ください",
      "meaning": "please"
    },
    "sentence": {
      "japanese": "あなたの切手帳を見せてください。",
      "kana": "あなたのきってちょうをみせてください。",
      "english": "Please show me your stamp album.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0301",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "ください",
      "meaning": "please"
    },
    "sentence": {
      "japanese": "向こうの交番で聞いてください。",
      "kana": "むこうのこうばんできいてください。",
      "english": "Ask at the police station over there.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0301",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "ください",
      "meaning": "please"
    },
    "sentence": {
      "japanese": "お水を持ってきてください。",
      "kana": "おみずをもってきてください。",
      "english": "Could you bring me some water?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0302",
    "example_index": 0,
    "target_vocab": {
      "kanji": "時計",
      "kana": "とけい",
      "meaning": "watch"
    },
    "sentence": {
      "japanese": "どんなに高くても、あの古い時計を買います。",
      "kana": "どんなにたかくても、あのふるいとけいをかいます。",
      "english": "I'll buy that old clock, however expensive it is.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0302",
    "example_index": 1,
    "target_vocab": {
      "kanji": "時計",
      "kana": "とけい",
      "meaning": "watch"
    },
    "sentence": {
      "japanese": "あなたの時計では何時ですか。",
      "kana": "あなたのとけいではなんじですか。",
      "english": "What time is it by your watch?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0302",
    "example_index": 2,
    "target_vocab": {
      "kanji": "時計",
      "kana": "とけい",
      "meaning": "watch"
    },
    "sentence": {
      "japanese": "彼女は新しい時計をなくした。",
      "kana": "かのじょはあたらしいとけいをなくした。",
      "english": "She lost her new watch.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0303",
    "example_index": 0,
    "target_vocab": {
      "kanji": "午後",
      "kana": "ごご",
      "meaning": "afternoon"
    },
    "sentence": {
      "japanese": "明日の午後彼に会います。",
      "kana": "あしたのごごかれにあいます。",
      "english": "I see him tomorrow afternoon.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0303",
    "example_index": 1,
    "target_vocab": {
      "kanji": "午後",
      "kana": "ごご",
      "meaning": "afternoon"
    },
    "sentence": {
      "japanese": "明日の午後に会いたいのですが。",
      "kana": "あしたのごごにあいたいのですが。",
      "english": "I'd like to see him tomorrow afternoon.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0303",
    "example_index": 2,
    "target_vocab": {
      "kanji": "午後",
      "kana": "ごご",
      "meaning": "afternoon"
    },
    "sentence": {
      "japanese": "彼らは午後勉強する。",
      "kana": "かれらはごごべんきょうする。",
      "english": "They study in the afternoon.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0304",
    "example_index": 0,
    "target_vocab": {
      "kanji": "食べ物",
      "kana": "たべもの",
      "meaning": "food"
    },
    "sentence": {
      "japanese": "ここではおいしい食べ物が出されます。",
      "kana": "ここではおいしいたべものがだされます。",
      "english": "They serve excellent food here.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0304",
    "example_index": 1,
    "target_vocab": {
      "kanji": "食べ物",
      "kana": "たべもの",
      "meaning": "food"
    },
    "sentence": {
      "japanese": "彼女は食べ物を買いに出ていった。",
      "kana": "かのじょはたべものをかいにでていった。",
      "english": "She went out to buy some food.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0304",
    "example_index": 2,
    "target_vocab": {
      "kanji": "食べ物",
      "kana": "たべもの",
      "meaning": "food"
    },
    "sentence": {
      "japanese": "彼女は食べ物を買いに行った。",
      "kana": "かのじょはたべものをかいにいった。",
      "english": "She went out to buy some food.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0305",
    "example_index": 0,
    "target_vocab": {
      "kanji": "降る",
      "kana": "ふる",
      "meaning": "to fall"
    },
    "sentence": {
      "japanese": "にわかに雨が降ってきた。",
      "kana": "にわかにあめがふってきた。",
      "english": "Suddenly, the rain fell.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0305",
    "example_index": 1,
    "target_vocab": {
      "kanji": "降る",
      "kana": "ふる",
      "meaning": "to fall"
    },
    "sentence": {
      "japanese": "その上雨が降り出している。",
      "kana": "そのうえあめがおりだしている。",
      "english": "Besides, it's starting to rain.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0305",
    "example_index": 2,
    "target_vocab": {
      "kanji": "降る",
      "kana": "ふる",
      "meaning": "to fall"
    },
    "sentence": {
      "japanese": "たぶん、明日は雪が降るだろう。",
      "kana": "たぶん、あしたはゆきがふるだろう。",
      "english": "Probably it will snow tomorrow.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0305",
    "example_index": 3,
    "target_vocab": {
      "kanji": "降る",
      "kana": "ふる",
      "meaning": "to fall"
    },
    "sentence": {
      "japanese": "雨がふるといけないから窓を閉めた。",
      "kana": "あめがふるといけないからまどをしめた。",
      "english": "He closed the window for fear of rain.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0306",
    "example_index": 0,
    "target_vocab": {
      "kanji": "易しい",
      "kana": "やさしい",
      "meaning": "easy"
    },
    "sentence": {
      "japanese": "易しい英語で言ってください。",
      "kana": "やさしいえいごでいってください。",
      "english": "Could you say that in plain English?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0306",
    "example_index": 1,
    "target_vocab": {
      "kanji": "易しい",
      "kana": "やさしい",
      "meaning": "easy"
    },
    "sentence": {
      "japanese": "それは何と易しい問題なのでしょう。",
      "kana": "それはなんとやさしいもんだいなのでしょう。",
      "english": "What an easy problem it is!",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0306",
    "example_index": 2,
    "target_vocab": {
      "kanji": "易しい",
      "kana": "やさしい",
      "meaning": "easy"
    },
    "sentence": {
      "japanese": "この本は易しい英語で書かれている。",
      "kana": "このほんはやさしいえいごでかかれている。",
      "english": "This book is written in easy English.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0306",
    "example_index": 3,
    "target_vocab": {
      "kanji": "易しい",
      "kana": "やさしい",
      "meaning": "easy"
    },
    "sentence": {
      "japanese": "彼女は僕にやさしいんだ。",
      "kana": "かのじょはぼくにやさしいんだ。",
      "english": "She's good to me you know.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0306",
    "example_index": 4,
    "target_vocab": {
      "kanji": "易しい",
      "kana": "やさしい",
      "meaning": "easy"
    },
    "sentence": {
      "japanese": "彼女は子供達にはやさしい。",
      "kana": "かのじょはこどもたちにはやさしい。",
      "english": "She is gentle with children.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0306",
    "example_index": 5,
    "target_vocab": {
      "kanji": "易しい",
      "kana": "やさしい",
      "meaning": "easy"
    },
    "sentence": {
      "japanese": "彼女はやさしい。",
      "kana": "かのじょはやさしい。",
      "english": "She is gentle.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0308",
    "example_index": 0,
    "target_vocab": {
      "kanji": "誰",
      "kana": "だれ",
      "meaning": "who"
    },
    "sentence": {
      "japanese": "これは誰の車かしら。",
      "kana": "これはだれのくるまかしら。",
      "english": "I wonder whose car this is.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0308",
    "example_index": 1,
    "target_vocab": {
      "kanji": "誰",
      "kana": "だれ",
      "meaning": "who"
    },
    "sentence": {
      "japanese": "あそこに立ってる女の人はだれですか。",
      "kana": "あそこにたってるおんなのひとはだれですか。",
      "english": "Who is the woman standing there?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0308",
    "example_index": 2,
    "target_vocab": {
      "kanji": "誰",
      "kana": "だれ",
      "meaning": "who"
    },
    "sentence": {
      "japanese": "誰がその電話に出たか知っていますか。",
      "kana": "だれがそのでんわにでたかしっていますか。",
      "english": "Do you know who took the call?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0308",
    "example_index": 3,
    "target_vocab": {
      "kanji": "誰",
      "kana": "だれ",
      "meaning": "who"
    },
    "sentence": {
      "japanese": "あそこに立ってる女の人はだれですか。",
      "kana": "あそこにたってるおんなのひとはだれですか。",
      "english": "Who is the woman standing there?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0308",
    "example_index": 4,
    "target_vocab": {
      "kanji": "誰",
      "kana": "だれ",
      "meaning": "who"
    },
    "sentence": {
      "japanese": "彼女はだれからもよく言われる。",
      "kana": "かのじょはだれからもよくいわれる。",
      "english": "She is well spoken of by everybody.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0308",
    "example_index": 5,
    "target_vocab": {
      "kanji": "誰",
      "kana": "だれ",
      "meaning": "who"
    },
    "sentence": {
      "japanese": "彼女がだれか知っていますか。",
      "kana": "かのじょがだれかしっていますか。",
      "english": "Do you know who she is?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0309",
    "example_index": 0,
    "target_vocab": {
      "kanji": "上",
      "kana": "うえ",
      "meaning": "on top of"
    },
    "sentence": {
      "japanese": "机の上に一冊の本がある。",
      "kana": "つくえのうえにいっさつのほんがある。",
      "english": "There is an album on the desk.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0309",
    "example_index": 1,
    "target_vocab": {
      "kanji": "上",
      "kana": "うえ",
      "meaning": "on top of"
    },
    "sentence": {
      "japanese": "その上雨が降り出している。",
      "kana": "そのうえあめがおりだしている。",
      "english": "Besides, it's starting to rain.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0309",
    "example_index": 2,
    "target_vocab": {
      "kanji": "上",
      "kana": "うえ",
      "meaning": "on top of"
    },
    "sentence": {
      "japanese": "寒かったうえに、風も強かった。",
      "kana": "さむかったうえに、かぜもつよかった。",
      "english": "It was cold, and, in addition, it was windy.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0309",
    "example_index": 3,
    "target_vocab": {
      "kanji": "上",
      "kana": "うえ",
      "meaning": "on top of"
    },
    "sentence": {
      "japanese": "寒かったうえに、風も強かった。",
      "kana": "さむかったうえに、かぜもつよかった。",
      "english": "It was cold, and, in addition, it was windy.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0309",
    "example_index": 4,
    "target_vocab": {
      "kanji": "上",
      "kana": "うえ",
      "meaning": "on top of"
    },
    "sentence": {
      "japanese": "彼は英語を読めるし、そのうえ書けもする。",
      "kana": "かれはえいごをよめるし、そのうえかけもする。",
      "english": "He can read and write English as well.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0309",
    "example_index": 5,
    "target_vocab": {
      "kanji": "上",
      "kana": "うえ",
      "meaning": "on top of"
    },
    "sentence": {
      "japanese": "寒かった、そのうえ風が吹いていた。",
      "kana": "さむかった、そのうえかぜがふいていた。",
      "english": "It was cold, and in addition, it was windy.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0310",
    "example_index": 0,
    "target_vocab": {
      "kanji": "五",
      "kana": "ご",
      "meaning": "five"
    },
    "sentence": {
      "japanese": "三日から五日で。",
      "kana": "みっかからいつかで。",
      "english": "Maybe three to five days.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0310",
    "example_index": 1,
    "target_vocab": {
      "kanji": "五",
      "kana": "ご",
      "meaning": "five"
    },
    "sentence": {
      "japanese": "ここに五本の鉛筆がある。",
      "kana": "ここにごほんのえんぴつがある。",
      "english": "There are five pencils here.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0310",
    "example_index": 2,
    "target_vocab": {
      "kanji": "五",
      "kana": "ご",
      "meaning": "five"
    },
    "sentence": {
      "japanese": "家の家族は五人からなる。",
      "kana": "いえのかぞくはごにんからなる。",
      "english": "Our family consists of five members.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0310",
    "example_index": 3,
    "target_vocab": {
      "kanji": "五",
      "kana": "ご",
      "meaning": "five"
    },
    "sentence": {
      "japanese": "山に行くところですが、ご一緒にどうですか。",
      "kana": "やまにいくところですが、ごいっしょにどうですか。",
      "english": "We're going up into the mountains, so why don't you come with us?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0310",
    "example_index": 4,
    "target_vocab": {
      "kanji": "五",
      "kana": "ご",
      "meaning": "five"
    },
    "sentence": {
      "japanese": "楽しいご旅行を。",
      "kana": "たのしいごりょこうを。",
      "english": "Enjoy your trip.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0310",
    "example_index": 5,
    "target_vocab": {
      "kanji": "五",
      "kana": "ご",
      "meaning": "five"
    },
    "sentence": {
      "japanese": "それをご両親に見せましたか。",
      "kana": "それをごりょうしんにみせましたか。",
      "english": "Did you show it to your parents?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0312",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "どちら",
      "meaning": "which of two"
    },
    "sentence": {
      "japanese": "あなたか私のどちらかが一位を取るだろう。",
      "kana": "あなたかわたしのどちらかがいちいをとるだろう。",
      "english": "Either you or I will get the first prize.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0312",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "どちら",
      "meaning": "which of two"
    },
    "sentence": {
      "japanese": "大好きになるか大嫌いになるかどちらかなんですね。",
      "kana": "だいすきになるかだいきらいになるかどちらかなんですね。",
      "english": "It's love-it-or-hate-it stuff.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0312",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "どちら",
      "meaning": "which of two"
    },
    "sentence": {
      "japanese": "彼らはどちらもとてもかわいいです。",
      "kana": "かれらはどちらもとてもかわいいです。",
      "english": "Both of them are very cute.",
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
