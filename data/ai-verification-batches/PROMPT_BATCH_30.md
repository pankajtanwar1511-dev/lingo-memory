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

**Batch Number**: 30
**Total Batches**: 38
**Examples in This Batch**: 50

---

### Examples:

[
  {
    "card_id": "n5_vocab_0512",
    "example_index": 1,
    "target_vocab": {
      "kanji": "階段",
      "kana": "かいだん",
      "meaning": "stairs"
    },
    "sentence": {
      "japanese": "わたしの家には階段がふたつある。",
      "kana": "わたしのいえにはかいだんがふたつある。",
      "english": "There are two staircases in my house.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0512",
    "example_index": 2,
    "target_vocab": {
      "kanji": "階段",
      "kana": "かいだん",
      "meaning": "stairs"
    },
    "sentence": {
      "japanese": "階段がある。",
      "kana": "かいだんがある。",
      "english": "There are stairs.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0513",
    "example_index": 0,
    "target_vocab": {
      "kanji": "煩い",
      "kana": "うるさい",
      "meaning": "noisy"
    },
    "sentence": {
      "japanese": "隣の部屋がうるさいのです。",
      "kana": "となりのへやがうるさいのです。",
      "english": "It's noisy next door.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0513",
    "example_index": 1,
    "target_vocab": {
      "kanji": "煩い",
      "kana": "うるさい",
      "meaning": "noisy"
    },
    "sentence": {
      "japanese": "彼女は食べ物にうるさい。",
      "kana": "かのじょはたべものにうるさい。",
      "english": "She is particular about food.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0513",
    "example_index": 2,
    "target_vocab": {
      "kanji": "煩い",
      "kana": "うるさい",
      "meaning": "noisy"
    },
    "sentence": {
      "japanese": "男の子で食べ物にうるさいのは少ない。",
      "kana": "おとこのこでたべものにうるさいのはすくない。",
      "english": "Few boys are dainty about their food.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0513",
    "example_index": 3,
    "target_vocab": {
      "kanji": "煩い",
      "kana": "うるさい",
      "meaning": "noisy"
    },
    "sentence": {
      "japanese": "隣の部屋がうるさいのです。",
      "kana": "となりのへやがうるさいのです。",
      "english": "It's noisy next door.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0513",
    "example_index": 4,
    "target_vocab": {
      "kanji": "煩い",
      "kana": "うるさい",
      "meaning": "noisy"
    },
    "sentence": {
      "japanese": "彼女は食べ物にうるさい。",
      "kana": "かのじょはたべものにうるさい。",
      "english": "She is particular about food.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0513",
    "example_index": 5,
    "target_vocab": {
      "kanji": "煩い",
      "kana": "うるさい",
      "meaning": "noisy"
    },
    "sentence": {
      "japanese": "男の子で食べ物にうるさいのは少ない。",
      "kana": "おとこのこでたべものにうるさいのはすくない。",
      "english": "Few boys are dainty about their food.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0514",
    "example_index": 0,
    "target_vocab": {
      "kanji": "半分",
      "kana": "はんぶん",
      "meaning": "half minute"
    },
    "sentence": {
      "japanese": "はい、お兄ちゃん、半分こ。",
      "kana": "はい、おにいちゃん、はんぶんこ。",
      "english": "Here, bro, halfsies.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0514",
    "example_index": 1,
    "target_vocab": {
      "kanji": "半分",
      "kana": "はんぶん",
      "meaning": "half minute"
    },
    "sentence": {
      "japanese": "私の犬の大きさはあなたの犬の半分です。",
      "kana": "わたしのいぬのおおきさはあなたのいぬのはんぶんです。",
      "english": "My dog is almost half the size of yours.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0514",
    "example_index": 2,
    "target_vocab": {
      "kanji": "半分",
      "kana": "はんぶん",
      "meaning": "half minute"
    },
    "sentence": {
      "japanese": "私のクラスの生徒の半分は犬が好きです。",
      "kana": "わたしのくらすのせいとのはんぶんはいぬがすきです。",
      "english": "Half of my class like dogs.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0515",
    "example_index": 0,
    "target_vocab": {
      "kanji": "背広",
      "kana": "せびろ",
      "meaning": "business suit"
    },
    "sentence": {
      "japanese": "彼はくたくたの背広を着ていた。",
      "kana": "かれはくたくたのせびろをきていた。",
      "english": "He was wearing a threadbare suit.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0515",
    "example_index": 1,
    "target_vocab": {
      "kanji": "背広",
      "kana": "せびろ",
      "meaning": "business suit"
    },
    "sentence": {
      "japanese": "私は新しい背広を買った。",
      "kana": "わたしはあたらしいせびろをかった。",
      "english": "I bought a new suit of clothes.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0516",
    "example_index": 0,
    "target_vocab": {
      "kanji": "晴れ",
      "kana": "はれ",
      "meaning": "clear weather"
    },
    "sentence": {
      "japanese": "明日は晴れだろうか。",
      "kana": "あしたははれだろうか。",
      "english": "Will it be fine weather tomorrow?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0516",
    "example_index": 1,
    "target_vocab": {
      "kanji": "晴れ",
      "kana": "はれ",
      "meaning": "clear weather"
    },
    "sentence": {
      "japanese": "明日は晴れかどうか知りたいな。",
      "kana": "あしたははれかどうかしりたいな。",
      "english": "We want to know if it will be sunny tomorrow.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0516",
    "example_index": 2,
    "target_vocab": {
      "kanji": "晴れ",
      "kana": "はれ",
      "meaning": "clear weather"
    },
    "sentence": {
      "japanese": "明日の天気は晴れ時々雨でしょう。",
      "kana": "あしたのてんきははれときどきあめでしょう。",
      "english": "Tomorrow's weather should be sunny with occasional rain.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0517",
    "example_index": 0,
    "target_vocab": {
      "kanji": "見せる",
      "kana": "みせる",
      "meaning": "to show"
    },
    "sentence": {
      "japanese": "あなたの切手帳を見せてください。",
      "kana": "あなたのきってちょうをみせてください。",
      "english": "Please show me your stamp album.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0517",
    "example_index": 1,
    "target_vocab": {
      "kanji": "見せる",
      "kana": "みせる",
      "meaning": "to show"
    },
    "sentence": {
      "japanese": "あなたに何枚かの写真を見せましょう。",
      "kana": "あなたになんまいかのしゃしんをみせましょう。",
      "english": "I will show you some pictures.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0517",
    "example_index": 2,
    "target_vocab": {
      "kanji": "見せる",
      "kana": "みせる",
      "meaning": "to show"
    },
    "sentence": {
      "japanese": "彼女は本を隣の人にも見せてあげた。",
      "kana": "かのじょはほんをとなりのにんにもみせてあげた。",
      "english": "She shared her book with her neighbor.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0518",
    "example_index": 0,
    "target_vocab": {
      "kanji": "飲み物",
      "kana": "のみもの",
      "meaning": "a drink"
    },
    "sentence": {
      "japanese": "何か飲み物をいれましょうか。",
      "kana": "なにかのみものをいれましょうか。",
      "english": "Can I get you something to drink?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0518",
    "example_index": 1,
    "target_vocab": {
      "kanji": "飲み物",
      "kana": "のみもの",
      "meaning": "a drink"
    },
    "sentence": {
      "japanese": "僕は今、何か冷たい飲み物が欲しい。",
      "kana": "ぼくはいま、なにかつめたいのみものがほしい。",
      "english": "I want something cold to drink now.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0518",
    "example_index": 2,
    "target_vocab": {
      "kanji": "飲み物",
      "kana": "のみもの",
      "meaning": "a drink"
    },
    "sentence": {
      "japanese": "彼は何か冷たい飲み物を欲しがっている。",
      "kana": "かれはなにかつめたいのみものをほっしがっている。",
      "english": "He wants something cold to drink.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0519",
    "example_index": 0,
    "target_vocab": {
      "kanji": "雪",
      "kana": "ゆき",
      "meaning": "snow"
    },
    "sentence": {
      "japanese": "たぶん、明日は雪が降るだろう。",
      "kana": "たぶん、あしたはゆきがふるだろう。",
      "english": "Probably it will snow tomorrow.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0519",
    "example_index": 1,
    "target_vocab": {
      "kanji": "雪",
      "kana": "ゆき",
      "meaning": "snow"
    },
    "sentence": {
      "japanese": "明日は雪だろう。",
      "kana": "あしたはゆきだろう。",
      "english": "It'll snow tomorrow.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0519",
    "example_index": 2,
    "target_vocab": {
      "kanji": "雪",
      "kana": "ゆき",
      "meaning": "snow"
    },
    "sentence": {
      "japanese": "明日、雪が降るだろう。",
      "kana": "あした、ゆきがふるだろう。",
      "english": "It'll snow tomorrow.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0520",
    "example_index": 0,
    "target_vocab": {
      "kanji": "買い物",
      "kana": "かいもの",
      "meaning": "shopping"
    },
    "sentence": {
      "japanese": "１日おきに買い物に行く。",
      "kana": "１にちおきにかいものにいく。",
      "english": "I go shopping every other day.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0520",
    "example_index": 1,
    "target_vocab": {
      "kanji": "買い物",
      "kana": "かいもの",
      "meaning": "shopping"
    },
    "sentence": {
      "japanese": "友達と買い物に行った。",
      "kana": "ともだちとかいものにいった。",
      "english": "I went shopping with a friend.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0520",
    "example_index": 2,
    "target_vocab": {
      "kanji": "買い物",
      "kana": "かいもの",
      "meaning": "shopping"
    },
    "sentence": {
      "japanese": "明日買い物に行きます。",
      "kana": "あしたかいものにいきます。",
      "english": "I'm going shopping tomorrow.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0522",
    "example_index": 0,
    "target_vocab": {
      "kanji": "駅",
      "kana": "えき",
      "meaning": "station"
    },
    "sentence": {
      "japanese": "明日駅で会いましょう。",
      "kana": "あしたえきであいましょう。",
      "english": "I'll meet you down at the station tomorrow.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0522",
    "example_index": 1,
    "target_vocab": {
      "kanji": "駅",
      "kana": "えき",
      "meaning": "station"
    },
    "sentence": {
      "japanese": "僕は駅で彼に会った。",
      "kana": "ぼくはえきでかれにあった。",
      "english": "I met him at the station.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0522",
    "example_index": 2,
    "target_vocab": {
      "kanji": "駅",
      "kana": "えき",
      "meaning": "station"
    },
    "sentence": {
      "japanese": "彼女はなぜ駅に行ったのですか。",
      "kana": "かのじょはなぜえきにいったのですか。",
      "english": "Why did she go to the station?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0523",
    "example_index": 0,
    "target_vocab": {
      "kanji": "大丈夫",
      "kana": "だいじょうぶ",
      "meaning": "all right"
    },
    "sentence": {
      "japanese": "このセーターは洗っても大丈夫です。",
      "kana": "このせーたーはあらってもだいじょうぶです。",
      "english": "This sweater will stand washing.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0523",
    "example_index": 1,
    "target_vocab": {
      "kanji": "大丈夫",
      "kana": "だいじょうぶ",
      "meaning": "all right"
    },
    "sentence": {
      "japanese": "彼女は今のところ大丈夫です。",
      "kana": "かのじょはいまのところだいじょうぶです。",
      "english": "She is all right at the moment.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0523",
    "example_index": 2,
    "target_vocab": {
      "kanji": "大丈夫",
      "kana": "だいじょうぶ",
      "meaning": "all right"
    },
    "sentence": {
      "japanese": "「ぼくだいじょうぶ？」といわれました。「だいじょうぶ」とこたえました。",
      "kana": "「ぼくだいじょうぶ？」といわれました。「だいじょうぶ」とこたえました。",
      "english": "I was asked, \"You OK, kid?\". I replied, \"Fine.\"",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0523",
    "example_index": 3,
    "target_vocab": {
      "kanji": "大丈夫",
      "kana": "だいじょうぶ",
      "meaning": "all right"
    },
    "sentence": {
      "japanese": "「ぼくだいじょうぶ？」といわれました。「だいじょうぶ」とこたえました。",
      "kana": "「ぼくだいじょうぶ？」といわれました。「だいじょうぶ」とこたえました。",
      "english": "I was asked, \"You OK, kid?\". I replied, \"Fine.\"",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0525",
    "example_index": 0,
    "target_vocab": {
      "kanji": "勉強",
      "kana": "べんきょうする",
      "meaning": "to study"
    },
    "sentence": {
      "japanese": "彼女は勉強部屋から出ていった。",
      "kana": "かのじょはべんきょうへやからでていった。",
      "english": "She went out of her study.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0525",
    "example_index": 1,
    "target_vocab": {
      "kanji": "勉強",
      "kana": "べんきょうする",
      "meaning": "to study"
    },
    "sentence": {
      "japanese": "勉強は難しいの？",
      "kana": "べんきょうはむずかしいの？",
      "english": "Is the school work hard?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0525",
    "example_index": 2,
    "target_vocab": {
      "kanji": "勉強",
      "kana": "べんきょうする",
      "meaning": "to study"
    },
    "sentence": {
      "japanese": "勉強は順調にいっています。",
      "kana": "べんきょうはじゅんちょうにいっています。",
      "english": "My studies are going okay.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0526",
    "example_index": 0,
    "target_vocab": {
      "kanji": "兄弟",
      "kana": "きょうだい",
      "meaning": "(humble) siblings"
    },
    "sentence": {
      "japanese": "あなたは何人兄弟がいますか。",
      "kana": "あなたはなんにんきょうだいがいますか。",
      "english": "How many siblings do you have?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0526",
    "example_index": 1,
    "target_vocab": {
      "kanji": "兄弟",
      "kana": "きょうだい",
      "meaning": "(humble) siblings"
    },
    "sentence": {
      "japanese": "彼女には兄弟が三人いる。",
      "kana": "かのじょにはきょうだいがさんにんいる。",
      "english": "She has three brothers.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0526",
    "example_index": 2,
    "target_vocab": {
      "kanji": "兄弟",
      "kana": "きょうだい",
      "meaning": "(humble) siblings"
    },
    "sentence": {
      "japanese": "彼女に兄弟はいない。",
      "kana": "かのじょにきょうだいはいない。",
      "english": "She has no brothers.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0526",
    "example_index": 3,
    "target_vocab": {
      "kanji": "兄弟",
      "kana": "きょうだい",
      "meaning": "(humble) siblings"
    },
    "sentence": {
      "japanese": "きょうだいは何人ですか。",
      "kana": "きょうだいはなんにんですか。",
      "english": "How many brothers and sisters do you have?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0526",
    "example_index": 4,
    "target_vocab": {
      "kanji": "兄弟",
      "kana": "きょうだい",
      "meaning": "(humble) siblings"
    },
    "sentence": {
      "japanese": "女のきょうだいはいません。",
      "kana": "おんなのきょうだいはいません。",
      "english": "I have no sisters.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0526",
    "example_index": 5,
    "target_vocab": {
      "kanji": "兄弟",
      "kana": "きょうだい",
      "meaning": "(humble) siblings"
    },
    "sentence": {
      "japanese": "ごきょうだいはいますか？",
      "kana": "ごきょうだいはいますか？",
      "english": "Do you have any siblings?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0527",
    "example_index": 0,
    "target_vocab": {
      "kanji": "封筒",
      "kana": "ふうとう",
      "meaning": "envelope"
    },
    "sentence": {
      "japanese": "封筒をください。",
      "kana": "ふうとうをください。",
      "english": "I need an envelope.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0527",
    "example_index": 1,
    "target_vocab": {
      "kanji": "封筒",
      "kana": "ふうとう",
      "meaning": "envelope"
    },
    "sentence": {
      "japanese": "彼は封筒を切って開けた。",
      "kana": "かれはふうとうをきってひらけた。",
      "english": "He cut the envelope open.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0527",
    "example_index": 2,
    "target_vocab": {
      "kanji": "封筒",
      "kana": "ふうとう",
      "meaning": "envelope"
    },
    "sentence": {
      "japanese": "私は封筒に切手をはるのを忘れた。",
      "kana": "わたしはふうとうにきってをはるのをわすれた。",
      "english": "I forgot to attach a stamp to the envelope.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0528",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "レコード",
      "meaning": "record"
    },
    "sentence": {
      "japanese": "彼女はよく何時間もレコードを聞いている。",
      "kana": "かのじょはよくなんじかんもれこーどをきいている。",
      "english": "She will often listen to records for hours.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0528",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "レコード",
      "meaning": "record"
    },
    "sentence": {
      "japanese": "彼らは、レコードを買います。",
      "kana": "かれらは、れこーどをかいます。",
      "english": "They will buy a record.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0528",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "レコード",
      "meaning": "record"
    },
    "sentence": {
      "japanese": "私は彼のレコードをいくつか聞いた。",
      "kana": "わたしはかのれこーどをいくつかきいた。",
      "english": "I listened to some of his records.",
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
