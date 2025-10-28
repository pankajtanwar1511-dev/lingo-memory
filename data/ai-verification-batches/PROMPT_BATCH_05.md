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

**Batch Number**: 5
**Total Batches**: 38
**Examples in This Batch**: 50

---

### Examples:

[
  {
    "card_id": "n5_vocab_0074",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "コート",
      "meaning": "coat"
    },
    "sentence": {
      "japanese": "彼女はコートを着ました。",
      "kana": "かのじょはこーとをちゃくました。",
      "english": "She put on a coat.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0075",
    "example_index": 0,
    "target_vocab": {
      "kanji": "手紙",
      "kana": "てがみ",
      "meaning": "letter"
    },
    "sentence": {
      "japanese": "これはとても奇妙な手紙です。",
      "kana": "これはとてもきみょうなてがみです。",
      "english": "This is a very strange letter.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0075",
    "example_index": 1,
    "target_vocab": {
      "kanji": "手紙",
      "kana": "てがみ",
      "meaning": "letter"
    },
    "sentence": {
      "japanese": "彼に長い手紙を書いた。",
      "kana": "かれにながいてがみをかいた。",
      "english": "I wrote a long letter to him.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0075",
    "example_index": 2,
    "target_vocab": {
      "kanji": "手紙",
      "kana": "てがみ",
      "meaning": "letter"
    },
    "sentence": {
      "japanese": "その手紙は私宛に来た。",
      "kana": "そのてがみはわたしあてにきた。",
      "english": "The letter is for me.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0076",
    "example_index": 0,
    "target_vocab": {
      "kanji": "要る",
      "kana": "いる",
      "meaning": "to need"
    },
    "sentence": {
      "japanese": "今は何も要りません。",
      "kana": "いまはなにもいりません。",
      "english": "I don't need anything now.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0076",
    "example_index": 1,
    "target_vocab": {
      "kanji": "要る",
      "kana": "いる",
      "meaning": "to need"
    },
    "sentence": {
      "japanese": "地図が要ります。",
      "kana": "ちずがいります。",
      "english": "I need a map.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0076",
    "example_index": 2,
    "target_vocab": {
      "kanji": "要る",
      "kana": "いる",
      "meaning": "to need"
    },
    "sentence": {
      "japanese": "もうそれはいらない。",
      "kana": "もうそれはいらない。",
      "english": "I don't want it anymore.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0077",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "こっち",
      "meaning": "this person or way"
    },
    "sentence": {
      "japanese": "そっちがその手でくるならこっちにも手がある。",
      "kana": "そっちがそのてでくるならこっちにもてがある。",
      "english": "Two can play at that game.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0077",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "こっち",
      "meaning": "this person or way"
    },
    "sentence": {
      "japanese": "こっちの本はあっちの本よりやさしい。",
      "kana": "こっちのほんはあっちのほんよりやさしい。",
      "english": "These books are easier than those books.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0077",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "こっち",
      "meaning": "this person or way"
    },
    "sentence": {
      "japanese": "仕事でこっちに来てるんです。",
      "kana": "しごとでこっちにきてるんです。",
      "english": "I am here on business.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0078",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "スプーン",
      "meaning": "spoon"
    },
    "sentence": {
      "japanese": "スプーンとフォークとナイフが要る。どうも。",
      "kana": "すぷーんとふぉーくとないふがいる。どうも。",
      "english": "I need a spoon, a fork, and a knife. Thank you.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0079",
    "example_index": 0,
    "target_vocab": {
      "kanji": "時々",
      "kana": "ときどき",
      "meaning": "sometimes"
    },
    "sentence": {
      "japanese": "明日の天気は晴れ時々雨でしょう。",
      "kana": "あしたのてんきははれときどきあめでしょう。",
      "english": "Tomorrow's weather should be sunny with occasional rain.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0079",
    "example_index": 1,
    "target_vocab": {
      "kanji": "時々",
      "kana": "ときどき",
      "meaning": "sometimes"
    },
    "sentence": {
      "japanese": "妹と私はときどき映画に行きます。",
      "kana": "いもうととわたしはときどきえいがにいきます。",
      "english": "My sister and I go to the movies from time to time.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0079",
    "example_index": 2,
    "target_vocab": {
      "kanji": "時々",
      "kana": "ときどき",
      "meaning": "sometimes"
    },
    "sentence": {
      "japanese": "彼は時々手紙を書いた。",
      "kana": "かれはときどきてがみをかいた。",
      "english": "He wrote to me from time to time.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0079",
    "example_index": 3,
    "target_vocab": {
      "kanji": "時々",
      "kana": "ときどき",
      "meaning": "sometimes"
    },
    "sentence": {
      "japanese": "妹と私はときどき映画に行きます。",
      "kana": "いもうととわたしはときどきえいがにいきます。",
      "english": "My sister and I go to the movies from time to time.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0079",
    "example_index": 4,
    "target_vocab": {
      "kanji": "時々",
      "kana": "ときどき",
      "meaning": "sometimes"
    },
    "sentence": {
      "japanese": "彼はときどき車で仕事に行く。",
      "kana": "かれはときどきくるまでしごとにいく。",
      "english": "He sometimes goes to work by car.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0079",
    "example_index": 5,
    "target_vocab": {
      "kanji": "時々",
      "kana": "ときどき",
      "meaning": "sometimes"
    },
    "sentence": {
      "japanese": "彼はときどき私のところへ遊びに来る。",
      "kana": "かれはときどきわたしのところへあそびにくる。",
      "english": "He sometimes comes to see me.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0080",
    "example_index": 0,
    "target_vocab": {
      "kanji": "傘",
      "kana": "かさ",
      "meaning": "umbrella"
    },
    "sentence": {
      "japanese": "彼女は傘を置き忘れた。",
      "kana": "かのじょはかさをおきわすれた。",
      "english": "She has left her umbrella behind.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0080",
    "example_index": 1,
    "target_vocab": {
      "kanji": "傘",
      "kana": "かさ",
      "meaning": "umbrella"
    },
    "sentence": {
      "japanese": "彼女は傘を持っていた。",
      "kana": "かのじょはかさをもっていた。",
      "english": "She was holding an umbrella.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0080",
    "example_index": 2,
    "target_vocab": {
      "kanji": "傘",
      "kana": "かさ",
      "meaning": "umbrella"
    },
    "sentence": {
      "japanese": "彼女はバスに傘を置き忘れた。",
      "kana": "かのじょはばすにかさをおきわすれた。",
      "english": "She left her umbrella on the bus.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0080",
    "example_index": 3,
    "target_vocab": {
      "kanji": "傘",
      "kana": "かさ",
      "meaning": "umbrella"
    },
    "sentence": {
      "japanese": "彼女は電車の中にかさを置き忘れた。",
      "kana": "かのじょはでんしゃのなかにかさをおきわすれた。",
      "english": "She left her umbrella in the train.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0080",
    "example_index": 4,
    "target_vocab": {
      "kanji": "傘",
      "kana": "かさ",
      "meaning": "umbrella"
    },
    "sentence": {
      "japanese": "彼は私の言葉に耳をかさなかった。",
      "kana": "かれはわたしのことばにみみをかさなかった。",
      "english": "He turned a deaf ear to my words.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0080",
    "example_index": 5,
    "target_vocab": {
      "kanji": "傘",
      "kana": "かさ",
      "meaning": "umbrella"
    },
    "sentence": {
      "japanese": "彼はかさをもっていかなかった。",
      "kana": "かれはかさをもっていかなかった。",
      "english": "He didn't take an umbrella with him.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0082",
    "example_index": 0,
    "target_vocab": {
      "kanji": "電話",
      "kana": "でんわ",
      "meaning": "telephone"
    },
    "sentence": {
      "japanese": "ええ、じゃあ私の電話番号教えるね。",
      "kana": "ええ、じゃあわたしのでんわばんごうおしえるね。",
      "english": "OK. Let me give you my number.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0082",
    "example_index": 1,
    "target_vocab": {
      "kanji": "電話",
      "kana": "でんわ",
      "meaning": "telephone"
    },
    "sentence": {
      "japanese": "電話は便利なものである。",
      "kana": "でんわはべんりなものである。",
      "english": "The telephone is a convenience.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0082",
    "example_index": 2,
    "target_vocab": {
      "kanji": "電話",
      "kana": "でんわ",
      "meaning": "telephone"
    },
    "sentence": {
      "japanese": "誰がその電話に出たか知っていますか。",
      "kana": "だれがそのでんわにでたかしっていますか。",
      "english": "Do you know who took the call?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0083",
    "example_index": 0,
    "target_vocab": {
      "kanji": "勤める",
      "kana": "つとめる",
      "meaning": "to work for someone"
    },
    "sentence": {
      "japanese": "彼女は病院につとめています。",
      "kana": "かのじょはびょういんにつとめています。",
      "english": "She works for a hospital.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0083",
    "example_index": 1,
    "target_vocab": {
      "kanji": "勤める",
      "kana": "つとめる",
      "meaning": "to work for someone"
    },
    "sentence": {
      "japanese": "彼はもうここには勤めていない。",
      "kana": "かれはもうここにはつとめていない。",
      "english": "He no longer works here.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0083",
    "example_index": 2,
    "target_vocab": {
      "kanji": "勤める",
      "kana": "つとめる",
      "meaning": "to work for someone"
    },
    "sentence": {
      "japanese": "私は、旅行会社に勤めています。",
      "kana": "わたしは、りょこうがいしゃにつとめています。",
      "english": "I work for a travel agency.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0084",
    "example_index": 0,
    "target_vocab": {
      "kanji": "安い",
      "kana": "やすい",
      "meaning": "cheap"
    },
    "sentence": {
      "japanese": "僕は本を安く売った。",
      "kana": "ぼくはほんをやすくうった。",
      "english": "I sold my books cheaply.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0084",
    "example_index": 1,
    "target_vocab": {
      "kanji": "安い",
      "kana": "やすい",
      "meaning": "cheap"
    },
    "sentence": {
      "japanese": "私はこの車を安く買いました。",
      "kana": "わたしはこのくるまをやすくかいました。",
      "english": "I bought this car at a bargain.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0084",
    "example_index": 2,
    "target_vocab": {
      "kanji": "安い",
      "kana": "やすい",
      "meaning": "cheap"
    },
    "sentence": {
      "japanese": "私はこのコートを安く買った。",
      "kana": "わたしはこのこーとをやすくかった。",
      "english": "I bought this coat at a low price.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0084",
    "example_index": 3,
    "target_vocab": {
      "kanji": "安い",
      "kana": "やすい",
      "meaning": "cheap"
    },
    "sentence": {
      "japanese": "彼は人の名前を忘れやすい。",
      "kana": "かれはにんのなまえをわすれやすい。",
      "english": "He is apt to forget people's name.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0084",
    "example_index": 4,
    "target_vocab": {
      "kanji": "安い",
      "kana": "やすい",
      "meaning": "cheap"
    },
    "sentence": {
      "japanese": "目が疲れやすいです。",
      "kana": "めがつかれやすいです。",
      "english": "My eyes get tired very easily.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0084",
    "example_index": 5,
    "target_vocab": {
      "kanji": "安い",
      "kana": "やすい",
      "meaning": "cheap"
    },
    "sentence": {
      "japanese": "彼は疲れやすい。",
      "kana": "かれはつかれやすい。",
      "english": "He gets tired easily.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0085",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "どう",
      "meaning": "how"
    },
    "sentence": {
      "japanese": "明日のお天気はどうかしら？",
      "kana": "あしたのおてんきはどうかしら？",
      "english": "I wonder what the weather will be tomorrow.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0085",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "どう",
      "meaning": "how"
    },
    "sentence": {
      "japanese": "明日はどうですか。",
      "kana": "あしたはどうですか。",
      "english": "How about tomorrow?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0085",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "どう",
      "meaning": "how"
    },
    "sentence": {
      "japanese": "問題は彼女が来るかどうかである。",
      "kana": "もんだいはかのじょがくるかどうかである。",
      "english": "The point is whether she will come or not.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0086",
    "example_index": 0,
    "target_vocab": {
      "kanji": "道",
      "kana": "みち",
      "meaning": "street"
    },
    "sentence": {
      "japanese": "彼らは狭い道を歩いていった。",
      "kana": "かれらはせまいみちをあるいていった。",
      "english": "They walked along a narrow path.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0086",
    "example_index": 1,
    "target_vocab": {
      "kanji": "道",
      "kana": "みち",
      "meaning": "street"
    },
    "sentence": {
      "japanese": "道を渡ろう。",
      "kana": "みちをわたろう。",
      "english": "Let's cross the street.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0086",
    "example_index": 2,
    "target_vocab": {
      "kanji": "道",
      "kana": "みち",
      "meaning": "street"
    },
    "sentence": {
      "japanese": "道を教えます。",
      "kana": "みちをおしえます。",
      "english": "I'll show you the way.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0087",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "バス",
      "meaning": "bus"
    },
    "sentence": {
      "japanese": "電車はバスより頻繁に来ます。",
      "kana": "でんしゃはばすよりひんぱんにきます。",
      "english": "Trains come more often than buses.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0087",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "バス",
      "meaning": "bus"
    },
    "sentence": {
      "japanese": "歩いて行きますか？それともバスで行きますか？",
      "kana": "あるいていきますか？それともばすでいきますか？",
      "english": "Will you go on foot or by bus?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0087",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "バス",
      "meaning": "bus"
    },
    "sentence": {
      "japanese": "そらバスが来た。",
      "kana": "そらばすがきた。",
      "english": "Here's the bus.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0088",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "クラス",
      "meaning": "class"
    },
    "sentence": {
      "japanese": "私たちは２人とも同じクラスです。",
      "kana": "わたしたちは２にんともおなじくらすです。",
      "english": "We are both in the same class.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0088",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "クラス",
      "meaning": "class"
    },
    "sentence": {
      "japanese": "僕のクラスの友達だよ。",
      "kana": "ぼくのくらすのともだちだよ。",
      "english": "She's my classmate.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0088",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "クラス",
      "meaning": "class"
    },
    "sentence": {
      "japanese": "僕と彼女は同じクラスだ。",
      "kana": "ぼくとかのじょはおなじくらすだ。",
      "english": "She and I are classmates.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0089",
    "example_index": 0,
    "target_vocab": {
      "kanji": "差す",
      "kana": "さす",
      "meaning": "to stretch out hands"
    },
    "sentence": {
      "japanese": "傘をさしました。",
      "kana": "かさをさしました。",
      "english": "I put up my umbrella.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0089",
    "example_index": 1,
    "target_vocab": {
      "kanji": "差す",
      "kana": "さす",
      "meaning": "to stretch out hands"
    },
    "sentence": {
      "japanese": "なんで傘さしてんの？ 雨降ってないよ。",
      "kana": "なんでかささしてんの？ あふりってないよ。",
      "english": "Why do you have your umbrella up? It's not raining.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0089",
    "example_index": 2,
    "target_vocab": {
      "kanji": "差す",
      "kana": "さす",
      "meaning": "to stretch out hands"
    },
    "sentence": {
      "japanese": "傘さす？",
      "kana": "かささす？",
      "english": "Do you want an umbrella?",
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
