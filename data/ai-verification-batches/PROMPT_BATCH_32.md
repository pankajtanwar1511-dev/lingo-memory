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

**Batch Number**: 32
**Total Batches**: 38
**Examples in This Batch**: 50

---

### Examples:

[
  {
    "card_id": "n5_vocab_0548",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "ドア",
      "meaning": "Western style door"
    },
    "sentence": {
      "japanese": "彼女はドアの方へ走った。",
      "kana": "かのじょはどあのほうへはしった。",
      "english": "She ran for the door.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0548",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "ドア",
      "meaning": "Western style door"
    },
    "sentence": {
      "japanese": "彼女はドアを開けた。",
      "kana": "かのじょはどあをひらけた。",
      "english": "She opened the door.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0549",
    "example_index": 0,
    "target_vocab": {
      "kanji": "見る観る",
      "kana": "みる",
      "meaning": "to see"
    },
    "sentence": {
      "japanese": "彼女は絵をみる目がある。",
      "kana": "かのじょはえをみるめがある。",
      "english": "She's got a good eye for paintings.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0549",
    "example_index": 1,
    "target_vocab": {
      "kanji": "見る観る",
      "kana": "みる",
      "meaning": "to see"
    },
    "sentence": {
      "japanese": "彼女が台所に入ってみると、そこには誰もいなかった。",
      "kana": "かのじょがだいどころにいっってみると、そこにはだれもいなかった。",
      "english": "When she entered the kitchen, no one was there.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0549",
    "example_index": 2,
    "target_vocab": {
      "kanji": "見る観る",
      "kana": "みる",
      "meaning": "to see"
    },
    "sentence": {
      "japanese": "「ここ何のお店だろう？」「入ってみる？」「うん」",
      "kana": "「ここなんのおみせだろう？」「いっってみる？」「うん」",
      "english": "\"What's this shop?\" \"Should we go in and have a look?\" \"OK.\"",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0550",
    "example_index": 0,
    "target_vocab": {
      "kanji": "交番",
      "kana": "こうばん",
      "meaning": "police box"
    },
    "sentence": {
      "japanese": "向こうの交番で聞いてください。",
      "kana": "むこうのこうばんできいてください。",
      "english": "Ask at the police station over there.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0550",
    "example_index": 1,
    "target_vocab": {
      "kanji": "交番",
      "kana": "こうばん",
      "meaning": "police box"
    },
    "sentence": {
      "japanese": "交番はどこにあるかわかりますか。",
      "kana": "こうばんはどこにあるかわかりますか。",
      "english": "Do you know where the police station is?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0550",
    "example_index": 2,
    "target_vocab": {
      "kanji": "交番",
      "kana": "こうばん",
      "meaning": "police box"
    },
    "sentence": {
      "japanese": "交番が近くにある。",
      "kana": "こうばんがちかくにある。",
      "english": "A police station is close at hand.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0551",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "ナイフ",
      "meaning": "knife"
    },
    "sentence": {
      "japanese": "彼女はナイフで手を切った。",
      "kana": "かのじょはないふでてをきった。",
      "english": "She cut her hand on a knife.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0551",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "ナイフ",
      "meaning": "knife"
    },
    "sentence": {
      "japanese": "彼は上手にナイフとフォークを使った。",
      "kana": "かれはじょうずにないふとふぉーくをつかった。",
      "english": "He handled the knife and fork very well.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0551",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "ナイフ",
      "meaning": "knife"
    },
    "sentence": {
      "japanese": "彼はナイフで肉を切った。",
      "kana": "かれはないふでにくをきった。",
      "english": "He cut the meat with a knife.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0552",
    "example_index": 0,
    "target_vocab": {
      "kanji": "辛い",
      "kana": "からい",
      "meaning": "spicy"
    },
    "sentence": {
      "japanese": "私はつらい仕事でとても疲れています。",
      "kana": "わたしはつらいしごとでとてもつかれています。",
      "english": "I am very tired from the hard work.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0552",
    "example_index": 1,
    "target_vocab": {
      "kanji": "辛い",
      "kana": "からい",
      "meaning": "spicy"
    },
    "sentence": {
      "japanese": "靴が痛くてとてもつらい。",
      "kana": "くつがいたくてとてもつらい。",
      "english": "My shoes hurt. I'm in agony.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0552",
    "example_index": 2,
    "target_vocab": {
      "kanji": "辛い",
      "kana": "からい",
      "meaning": "spicy"
    },
    "sentence": {
      "japanese": "寒い朝は早く起きるのがつらい。",
      "kana": "さむいあさははやくおきるのがつらい。",
      "english": "I find it hard to get up early on cold mornings.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0553",
    "example_index": 0,
    "target_vocab": {
      "kanji": "洋服",
      "kana": "ようふく",
      "meaning": "western-style clothes"
    },
    "sentence": {
      "japanese": "彼女はかなりの洋服を持っている。",
      "kana": "かのじょはかなりのようふくをもっている。",
      "english": "She has quite a lot of clothes.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0553",
    "example_index": 1,
    "target_vocab": {
      "kanji": "洋服",
      "kana": "ようふく",
      "meaning": "western-style clothes"
    },
    "sentence": {
      "japanese": "とてもすてきな洋服ですね。",
      "kana": "とてもすてきなようふくですね。",
      "english": "That's a beautiful dress.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0553",
    "example_index": 2,
    "target_vocab": {
      "kanji": "洋服",
      "kana": "ようふく",
      "meaning": "western-style clothes"
    },
    "sentence": {
      "japanese": "お洋服着ましょうね。",
      "kana": "おようふくちゃくましょうね。",
      "english": "Let's get you dressed.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0554",
    "example_index": 0,
    "target_vocab": {
      "kanji": "晩御飯",
      "kana": "ばんごはん",
      "meaning": "evening meal"
    },
    "sentence": {
      "japanese": "晩ご飯は食べましたか。",
      "kana": "ばんごめしはたべましたか。",
      "english": "Have you eaten dinner?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0554",
    "example_index": 1,
    "target_vocab": {
      "kanji": "晩御飯",
      "kana": "ばんごはん",
      "meaning": "evening meal"
    },
    "sentence": {
      "japanese": "僕らは晩御飯の後散歩に出た。",
      "kana": "ぼくらはばんごはんののちさんぽにでた。",
      "english": "We went out for a walk after dinner.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0554",
    "example_index": 2,
    "target_vocab": {
      "kanji": "晩御飯",
      "kana": "ばんごはん",
      "meaning": "evening meal"
    },
    "sentence": {
      "japanese": "晩ご飯は何？",
      "kana": "ばんごめしはなに？",
      "english": "What's for dinner?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0555",
    "example_index": 0,
    "target_vocab": {
      "kanji": "車",
      "kana": "くるま",
      "meaning": "car"
    },
    "sentence": {
      "japanese": "これは誰の車かしら。",
      "kana": "これはだれのくるまかしら。",
      "english": "I wonder whose car this is.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0555",
    "example_index": 1,
    "target_vocab": {
      "kanji": "車",
      "kana": "くるま",
      "meaning": "car"
    },
    "sentence": {
      "japanese": "いつでも私の車を貸してあげますよ。",
      "kana": "いつでもわたしのくるまをかしてあげますよ。",
      "english": "You can borrow my car anytime.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0555",
    "example_index": 2,
    "target_vocab": {
      "kanji": "車",
      "kana": "くるま",
      "meaning": "car"
    },
    "sentence": {
      "japanese": "明日君の車を貸してください。",
      "kana": "あしたくんのくるまをかしてください。",
      "english": "Lend me your car tomorrow.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0556",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "ちょうど",
      "meaning": "exactly"
    },
    "sentence": {
      "japanese": "彼女はちょうど買い物に出かけるところです。",
      "kana": "かのじょはちょうどかいものにでかけるところです。",
      "english": "She is just going shopping.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0556",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "ちょうど",
      "meaning": "exactly"
    },
    "sentence": {
      "japanese": "彼はちょうど私と同じ年です。",
      "kana": "かれはちょうどわたしとおなじねんです。",
      "english": "He is just my age.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0556",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "ちょうど",
      "meaning": "exactly"
    },
    "sentence": {
      "japanese": "彼はタクシーでちょうどここへ来たところだ。",
      "kana": "かれはたくしーでちょうどここへきたところだ。",
      "english": "He has just come here by taxi.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0558",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "ポスト",
      "meaning": "post"
    },
    "sentence": {
      "japanese": "彼はポストに手紙を入れた。",
      "kana": "かれはぽすとにてがみをいれた。",
      "english": "He dropped a letter into the mailbox.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0558",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "ポスト",
      "meaning": "post"
    },
    "sentence": {
      "japanese": "手紙を忘れずにポストに入れてください。",
      "kana": "てがみをわすれずにぽすとにいれてください。",
      "english": "Please remember to mail the letter.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0558",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "ポスト",
      "meaning": "post"
    },
    "sentence": {
      "japanese": "この辺にポストってある？",
      "kana": "このへんにぽすとってある？",
      "english": "Is there a mailbox near here?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0559",
    "example_index": 0,
    "target_vocab": {
      "kanji": "服",
      "kana": "ふく",
      "meaning": "clothes"
    },
    "sentence": {
      "japanese": "私は服を脱いでいる。",
      "kana": "わたしはふくをぬいでいる。",
      "english": "I'm undressing.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0559",
    "example_index": 1,
    "target_vocab": {
      "kanji": "服",
      "kana": "ふく",
      "meaning": "clothes"
    },
    "sentence": {
      "japanese": "服を着ましたか。",
      "kana": "ふくをちゃくましたか。",
      "english": "Have you finished dressing?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0559",
    "example_index": 2,
    "target_vocab": {
      "kanji": "服",
      "kana": "ふく",
      "meaning": "clothes"
    },
    "sentence": {
      "japanese": "彼女は服にたくさん金を使う。",
      "kana": "かのじょはふくにたくさんきんをつかう。",
      "english": "She spends a lot of money on clothes.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0561",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "パン",
      "meaning": "bread"
    },
    "sentence": {
      "japanese": "私は今朝バターつきのパンを食べた。",
      "kana": "わたしはけさばたーつきのぱんをたべた。",
      "english": "I ate bread and butter this morning.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0561",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "パン",
      "meaning": "bread"
    },
    "sentence": {
      "japanese": "彼女はパンを一個買った。",
      "kana": "かのじょはぱんをいっこかった。",
      "english": "She bought a loaf of bread.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0561",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "パン",
      "meaning": "bread"
    },
    "sentence": {
      "japanese": "彼はバター付きパンが好きだ。",
      "kana": "かれはばたーつきぱんがすきだ。",
      "english": "He likes bread and butter.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0562",
    "example_index": 0,
    "target_vocab": {
      "kanji": "半",
      "kana": "はん",
      "meaning": "half"
    },
    "sentence": {
      "japanese": "肉を半㌔ください。",
      "kana": "にくをはんはんください。",
      "english": "Give me a half-kilo of meat.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0562",
    "example_index": 1,
    "target_vocab": {
      "kanji": "半",
      "kana": "はん",
      "meaning": "half"
    },
    "sentence": {
      "japanese": "一年半前、私はもう少しで死ぬところだった。",
      "kana": "いちねんはんまえ、わたしはもうすこしでしぬところだった。",
      "english": "I almost died a year and a half ago.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0562",
    "example_index": 2,
    "target_vocab": {
      "kanji": "半",
      "kana": "はん",
      "meaning": "half"
    },
    "sentence": {
      "japanese": "半ドアだよ。",
      "kana": "はんどあだよ。",
      "english": "Your door isn't closed.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0563",
    "example_index": 0,
    "target_vocab": {
      "kanji": "若い",
      "kana": "わかい",
      "meaning": "young"
    },
    "sentence": {
      "japanese": "「彼女は若いですか」「はい」",
      "kana": "「かのじょはわかいですか」「はい」",
      "english": "\"Is she young?\" \"Yes, she is.\"",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0563",
    "example_index": 1,
    "target_vocab": {
      "kanji": "若い",
      "kana": "わかい",
      "meaning": "young"
    },
    "sentence": {
      "japanese": "若い男の人がドアの前で歌っています。",
      "kana": "わかいおとこのにんがどあのまえでうたっています。",
      "english": "A young man is singing in front of the door.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0563",
    "example_index": 2,
    "target_vocab": {
      "kanji": "若い",
      "kana": "わかい",
      "meaning": "young"
    },
    "sentence": {
      "japanese": "僕は若い。",
      "kana": "ぼくはわかい。",
      "english": "I'm young.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0564",
    "example_index": 0,
    "target_vocab": {
      "kanji": "食べる",
      "kana": "たべる",
      "meaning": "to eat"
    },
    "sentence": {
      "japanese": "私は今朝バターつきのパンを食べた。",
      "kana": "わたしはけさばたーつきのぱんをたべた。",
      "english": "I ate bread and butter this morning.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0564",
    "example_index": 1,
    "target_vocab": {
      "kanji": "食べる",
      "kana": "たべる",
      "meaning": "to eat"
    },
    "sentence": {
      "japanese": "もっと果物を食べるべきです。",
      "kana": "もっとくだものをたべるべきです。",
      "english": "You should eat more fruit.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0564",
    "example_index": 2,
    "target_vocab": {
      "kanji": "食べる",
      "kana": "たべる",
      "meaning": "to eat"
    },
    "sentence": {
      "japanese": "昼ご飯を食べに外に出ませんか。",
      "kana": "ひるごめしをたべにそとにでませんか。",
      "english": "How about going out for lunch?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0566",
    "example_index": 0,
    "target_vocab": {
      "kanji": "警官",
      "kana": "けいかん",
      "meaning": "policeman"
    },
    "sentence": {
      "japanese": "警官は女の子達にこの車は自分達のものであるかを聞いた。",
      "kana": "けいかんはおんなのことおるにこのくるまはじぶんたちのものであるかをきいた。",
      "english": "The policeman asked the girls if that car was theirs.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0566",
    "example_index": 1,
    "target_vocab": {
      "kanji": "警官",
      "kana": "けいかん",
      "meaning": "policeman"
    },
    "sentence": {
      "japanese": "警官は止まれと言った。",
      "kana": "けいかんはとまれといった。",
      "english": "The policeman said to them, \"Stop.\"",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0566",
    "example_index": 2,
    "target_vocab": {
      "kanji": "警官",
      "kana": "けいかん",
      "meaning": "policeman"
    },
    "sentence": {
      "japanese": "警官は君に何か言いましたか。",
      "kana": "けいかんはくんになにかいいましたか。",
      "english": "Did the policeman say anything to you?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0568",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "これ",
      "meaning": "this"
    },
    "sentence": {
      "japanese": "これは誰の車かしら。",
      "kana": "これはだれのくるまかしら。",
      "english": "I wonder whose car this is.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0568",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "これ",
      "meaning": "this"
    },
    "sentence": {
      "japanese": "これはとてもまろやかなコーヒーだ。",
      "kana": "これはとてもまろやかなこーひーだ。",
      "english": "This is a very mild coffee.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0568",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "これ",
      "meaning": "this"
    },
    "sentence": {
      "japanese": "これはとても奇妙な手紙です。",
      "kana": "これはとてもきみょうなてがみです。",
      "english": "This is a very strange letter.",
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
