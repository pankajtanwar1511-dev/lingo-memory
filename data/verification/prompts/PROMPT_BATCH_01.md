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

**Batch Number**: 1
**Total Batches**: 38
**Examples in This Batch**: 50

---

### Examples:

[
  {
    "card_id": "n5_vocab_0001",
    "example_index": 0,
    "target_vocab": {
      "kanji": "毎朝",
      "kana": "まいあさ",
      "meaning": "every morning"
    },
    "sentence": {
      "japanese": "彼女は毎朝早く起きる。",
      "kana": "かのじょはまいあさはやくおきる。",
      "english": "She gets up early every morning.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0001",
    "example_index": 1,
    "target_vocab": {
      "kanji": "毎朝",
      "kana": "まいあさ",
      "meaning": "every morning"
    },
    "sentence": {
      "japanese": "彼女は毎朝歯を磨くと言った。",
      "kana": "かのじょはまいあさはをみがくといった。",
      "english": "She said that she brushes her teeth every morning.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0001",
    "example_index": 2,
    "target_vocab": {
      "kanji": "毎朝",
      "kana": "まいあさ",
      "meaning": "every morning"
    },
    "sentence": {
      "japanese": "彼は毎朝駅まで走ります。",
      "kana": "かれはまいあさえきまではしります。",
      "english": "He runs to the station every morning.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0002",
    "example_index": 0,
    "target_vocab": {
      "kanji": "問題",
      "kana": "もんだい",
      "meaning": "problem"
    },
    "sentence": {
      "japanese": "君は問題児ですね。",
      "kana": "くんはもんだいじですね。",
      "english": "You are a troublemaker.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0002",
    "example_index": 1,
    "target_vocab": {
      "kanji": "問題",
      "kana": "もんだい",
      "meaning": "problem"
    },
    "sentence": {
      "japanese": "何が問題なの？",
      "kana": "なにがもんだいなの？",
      "english": "Where is the problem?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0002",
    "example_index": 2,
    "target_vocab": {
      "kanji": "問題",
      "kana": "もんだい",
      "meaning": "problem"
    },
    "sentence": {
      "japanese": "そこに問題がある。",
      "kana": "そこにもんだいがある。",
      "english": "Therein lies the problem.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0004",
    "example_index": 0,
    "target_vocab": {
      "kanji": "黒",
      "kana": "くろ",
      "meaning": "black"
    },
    "sentence": {
      "japanese": "彼は黒っぽいセーターを着ていた。",
      "kana": "かれはくろっぽいせーたーをきていた。",
      "english": "He wore a dark sweater.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0004",
    "example_index": 1,
    "target_vocab": {
      "kanji": "黒",
      "kana": "くろ",
      "meaning": "black"
    },
    "sentence": {
      "japanese": "私は彼女の黒っぽい目が好きだ。",
      "kana": "わたしはかのじょのくろっぽいめがすきだ。",
      "english": "I like her dark eyes.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0004",
    "example_index": 2,
    "target_vocab": {
      "kanji": "黒",
      "kana": "くろ",
      "meaning": "black"
    },
    "sentence": {
      "japanese": "私は黒の上着と白の上着をもっている。",
      "kana": "わたしはくろのうわぎとしろのうわぎをもっている。",
      "english": "I have a black and a white coat.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0005",
    "example_index": 0,
    "target_vocab": {
      "kanji": "台所",
      "kana": "だいどころ",
      "meaning": "kitchen"
    },
    "sentence": {
      "japanese": "彼女は台所で働きますか。",
      "kana": "かのじょはだいどころではたらきますか。",
      "english": "Does she work in the kitchen?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0005",
    "example_index": 1,
    "target_vocab": {
      "kanji": "台所",
      "kana": "だいどころ",
      "meaning": "kitchen"
    },
    "sentence": {
      "japanese": "彼女は今台所でコーヒーをいれています。",
      "kana": "かのじょはいまだいどころでこーひーをいれています。",
      "english": "She is now making coffee in the kitchen.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0005",
    "example_index": 2,
    "target_vocab": {
      "kanji": "台所",
      "kana": "だいどころ",
      "meaning": "kitchen"
    },
    "sentence": {
      "japanese": "彼女が台所に入ってみると、そこには誰もいなかった。",
      "kana": "かのじょがだいどころにいっってみると、そこにはだれもいなかった。",
      "english": "When she entered the kitchen, no one was there.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0006",
    "example_index": 0,
    "target_vocab": {
      "kanji": "葉書",
      "kana": "はがき",
      "meaning": "postcard"
    },
    "sentence": {
      "japanese": "この店に葉書がたくさんある。",
      "kana": "このみせにはがきがたくさんある。",
      "english": "There are many postcards in this store.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0006",
    "example_index": 1,
    "target_vocab": {
      "kanji": "葉書",
      "kana": "はがき",
      "meaning": "postcard"
    },
    "sentence": {
      "japanese": "この店にはハガキがたくさんあるんだよ。",
      "kana": "このみせにははがきがたくさんあるんだよ。",
      "english": "There are many postcards in this store.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0006",
    "example_index": 2,
    "target_vocab": {
      "kanji": "葉書",
      "kana": "はがき",
      "meaning": "postcard"
    },
    "sentence": {
      "japanese": "ハガキを売ってるんですね。",
      "kana": "はがきをうってるんですね。",
      "english": "You sell postcards.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0007",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "ペン",
      "meaning": "pen"
    },
    "sentence": {
      "japanese": "ペンか鉛筆を持っていますか。",
      "kana": "ぺんかえんぴつをもっていますか。",
      "english": "Do you have a pen or a pencil?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0007",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "ペン",
      "meaning": "pen"
    },
    "sentence": {
      "japanese": "先生、ペン書きにするのでしょうか。",
      "kana": "せんせい、ぺんかきにするのでしょうか。",
      "english": "Sir, do we have to write in ink?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0007",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "ペン",
      "meaning": "pen"
    },
    "sentence": {
      "japanese": "彼女は何本ペンを持っていますか。",
      "kana": "かのじょはなんぼんぺんをもっていますか。",
      "english": "How many pens does she have?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0008",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "ニュース",
      "meaning": "news"
    },
    "sentence": {
      "japanese": "そのニュースはラジオで聞いたよ。",
      "kana": "そのにゅーすはらじおできいたよ。",
      "english": "I heard the news on the radio.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0008",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "ニュース",
      "meaning": "news"
    },
    "sentence": {
      "japanese": "私は彼にそのビッグニュースを知らせた。",
      "kana": "わたしはかれにそのびっぐにゅーすをしらせた。",
      "english": "I told him the big news.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0008",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "ニュース",
      "meaning": "news"
    },
    "sentence": {
      "japanese": "彼女はまだそのニュースを聞いてはいない。",
      "kana": "かのじょはまだそのにゅーすをきいてはいない。",
      "english": "She's not yet heard the news.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0009",
    "example_index": 0,
    "target_vocab": {
      "kanji": "花瓶",
      "kana": "かびん",
      "meaning": "a vase"
    },
    "sentence": {
      "japanese": "花瓶のなかには何本の花がはいっていますか。",
      "kana": "かびんのなかにはなんぼんのはながはいっていますか。",
      "english": "How many flowers are there in the vase?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0009",
    "example_index": 1,
    "target_vocab": {
      "kanji": "花瓶",
      "kana": "かびん",
      "meaning": "a vase"
    },
    "sentence": {
      "japanese": "花瓶には何本の花が入っていますか。",
      "kana": "かびんにはなんぼんのはながいっっていますか。",
      "english": "How many flowers are there in the vase?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0009",
    "example_index": 2,
    "target_vocab": {
      "kanji": "花瓶",
      "kana": "かびん",
      "meaning": "a vase"
    },
    "sentence": {
      "japanese": "テーブルの上に花瓶がある。",
      "kana": "てーぶるのうえにかびんがある。",
      "english": "There is a vase on the table.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0010",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "フォーク",
      "meaning": "fork"
    },
    "sentence": {
      "japanese": "彼は上手にナイフとフォークを使った。",
      "kana": "かれはじょうずにないふとふぉーくをつかった。",
      "english": "He handled the knife and fork very well.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0010",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "フォーク",
      "meaning": "fork"
    },
    "sentence": {
      "japanese": "スプーンとフォークとナイフが要る。どうも。",
      "kana": "すぷーんとふぉーくとないふがいる。どうも。",
      "english": "I need a spoon, a fork, and a knife. Thank you.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0010",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "フォーク",
      "meaning": "fork"
    },
    "sentence": {
      "japanese": "フォークで豚肉を食べます。",
      "kana": "ふぉーくでぶたにくをたべます。",
      "english": "I eat pork with a fork.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0011",
    "example_index": 0,
    "target_vocab": {
      "kanji": "引く",
      "kana": "ひく",
      "meaning": "to pull"
    },
    "sentence": {
      "japanese": "その辞書を引くべきである。",
      "kana": "そのじしょをひくべきである。",
      "english": "You should consult the dictionary.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0011",
    "example_index": 1,
    "target_vocab": {
      "kanji": "引く",
      "kana": "ひく",
      "meaning": "to pull"
    },
    "sentence": {
      "japanese": "私はよく風邪を引く。",
      "kana": "わたしはよくかぜをひく。",
      "english": "I often catch cold.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0011",
    "example_index": 2,
    "target_vocab": {
      "kanji": "引く",
      "kana": "ひく",
      "meaning": "to pull"
    },
    "sentence": {
      "japanese": "九引く六はいくつですか。",
      "kana": "きゅうひくろくはいくつですか。",
      "english": "How many is nine minus six?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0012",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "フィルム",
      "meaning": "roll of film"
    },
    "sentence": {
      "japanese": "彼は自分のカメラに新しいフィルムを入れた。",
      "kana": "かれはじぶんのかめらにあたらしいふぃるむをいれた。",
      "english": "He put new film into his camera.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0012",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "フィルム",
      "meaning": "roll of film"
    },
    "sentence": {
      "japanese": "私のカメラは簡単にフィルムを入れられる。",
      "kana": "わたしのかめらはかんたんにふぃるむをいれられる。",
      "english": "My camera loads easily.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0012",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "フィルム",
      "meaning": "roll of film"
    },
    "sentence": {
      "japanese": "このカメラにはフィルムが入っていないんだ。",
      "kana": "このかめらにはふぃるむがいっっていないんだ。",
      "english": "This camera is not loaded with film.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0013",
    "example_index": 0,
    "target_vocab": {
      "kanji": "磨く",
      "kana": "みがく",
      "meaning": "to brush teeth"
    },
    "sentence": {
      "japanese": "彼女は毎朝歯を磨くと言った。",
      "kana": "かのじょはまいあさはをみがくといった。",
      "english": "She said that she brushes her teeth every morning.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0013",
    "example_index": 1,
    "target_vocab": {
      "kanji": "磨く",
      "kana": "みがく",
      "meaning": "to brush teeth"
    },
    "sentence": {
      "japanese": "彼はくつをみがいた。",
      "kana": "かれはくつをみがいた。",
      "english": "He shined his shoes.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0013",
    "example_index": 2,
    "target_vocab": {
      "kanji": "磨く",
      "kana": "みがく",
      "meaning": "to brush teeth"
    },
    "sentence": {
      "japanese": "寝る前に歯をみがかなくてはいけないですよ。",
      "kana": "ねるまえにはをみがかなくてはいけないですよ。",
      "english": "You are to clean your teeth before you go to bed.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0014",
    "example_index": 0,
    "target_vocab": {
      "kanji": "押す",
      "kana": "おす",
      "meaning": "to push"
    },
    "sentence": {
      "japanese": "僕たちは、その車を押した。",
      "kana": "ぼくたちは、そのくるまをおした。",
      "english": "We gave the car a push.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0014",
    "example_index": 1,
    "target_vocab": {
      "kanji": "押す",
      "kana": "おす",
      "meaning": "to push"
    },
    "sentence": {
      "japanese": "彼女は戸を押して閉めた。",
      "kana": "かのじょはこをおしてしめた。",
      "english": "She pushed the door shut.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0014",
    "example_index": 2,
    "target_vocab": {
      "kanji": "押す",
      "kana": "おす",
      "meaning": "to push"
    },
    "sentence": {
      "japanese": "彼は非常ボタンをおした。",
      "kana": "かれはひじょうぼたんをおした。",
      "english": "He pushed the emergency button.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0015",
    "example_index": 0,
    "target_vocab": {
      "kanji": "売る",
      "kana": "うる",
      "meaning": "to sell"
    },
    "sentence": {
      "japanese": "その店は野菜を売っている。",
      "kana": "そのみせはやさいをうっている。",
      "english": "The store deals in vegetables.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0015",
    "example_index": 1,
    "target_vocab": {
      "kanji": "売る",
      "kana": "うる",
      "meaning": "to sell"
    },
    "sentence": {
      "japanese": "僕は本を安く売った。",
      "kana": "ぼくはほんをやすくうった。",
      "english": "I sold my books cheaply.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0015",
    "example_index": 2,
    "target_vocab": {
      "kanji": "売る",
      "kana": "うる",
      "meaning": "to sell"
    },
    "sentence": {
      "japanese": "彼は車を売りたくて、私はその車を買いたいのです。",
      "kana": "かれはくるまをうりたくて、わたしはそのくるまをかいたいのです。",
      "english": "He wants to sell his car, and I want to buy one.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0016",
    "example_index": 0,
    "target_vocab": {
      "kanji": "電気",
      "kana": "でんき",
      "meaning": "electricity"
    },
    "sentence": {
      "japanese": "寝る前に電気を消してください。",
      "kana": "ねるまえにでんきをけしてください。",
      "english": "Turn off the light before you go to bed.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0016",
    "example_index": 1,
    "target_vocab": {
      "kanji": "電気",
      "kana": "でんき",
      "meaning": "electricity"
    },
    "sentence": {
      "japanese": "電気を消すのを忘れないで。",
      "kana": "でんきをけすのをわすれないで。",
      "english": "Don't forget to turn the light off.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0016",
    "example_index": 2,
    "target_vocab": {
      "kanji": "電気",
      "kana": "でんき",
      "meaning": "electricity"
    },
    "sentence": {
      "japanese": "電気を消すな。",
      "kana": "でんきをけすな。",
      "english": "Don't turn off the light.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0017",
    "example_index": 0,
    "target_vocab": {
      "kanji": "並ぶ",
      "kana": "ならぶ",
      "meaning": "to line up"
    },
    "sentence": {
      "japanese": "並んでお待ちください。",
      "kana": "ならんでおまちください。",
      "english": "Wait in line, please.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0017",
    "example_index": 1,
    "target_vocab": {
      "kanji": "並ぶ",
      "kana": "ならぶ",
      "meaning": "to line up"
    },
    "sentence": {
      "japanese": "彼女は僕と並んで歩いた。",
      "kana": "かのじょはぼくとならんであるいた。",
      "english": "She walked side by side with me.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0017",
    "example_index": 2,
    "target_vocab": {
      "kanji": "並ぶ",
      "kana": "ならぶ",
      "meaning": "to line up"
    },
    "sentence": {
      "japanese": "彼女はわたしとならんで座った。",
      "kana": "かのじょはわたしとならんですわった。",
      "english": "She sat side by side with me.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0018",
    "example_index": 0,
    "target_vocab": {
      "kanji": "病気",
      "kana": "びょうき",
      "meaning": "illness"
    },
    "sentence": {
      "japanese": "彼女は病気だったらしい。",
      "kana": "かのじょはびょうきだったらしい。",
      "english": "It seems that she was ill.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0018",
    "example_index": 1,
    "target_vocab": {
      "kanji": "病気",
      "kana": "びょうき",
      "meaning": "illness"
    },
    "sentence": {
      "japanese": "病気は財布を空にする。",
      "kana": "びょうきはさいふをそらにする。",
      "english": "Sickness empties the wallet.",
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
