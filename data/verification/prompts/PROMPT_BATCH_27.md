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

**Batch Number**: 27
**Total Batches**: 38
**Examples in This Batch**: 50

---

### Examples:

[
  {
    "card_id": "n5_vocab_0462",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "そっち",
      "meaning": "over there"
    },
    "sentence": {
      "japanese": "そっちがその手でくるならこっちにも手がある。",
      "kana": "そっちがそのてでくるならこっちにもてがある。",
      "english": "Two can play at that game.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0464",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "カップ",
      "meaning": "cup"
    },
    "sentence": {
      "japanese": "テーブルの上にカップがある。",
      "kana": "てーぶるのうえにかっぷがある。",
      "english": "There is a cup on the table.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0464",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "カップ",
      "meaning": "cup"
    },
    "sentence": {
      "japanese": "そのカップは素敵だ。",
      "kana": "そのかっぷはすてきだ。",
      "english": "The cup is nice.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0464",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "カップ",
      "meaning": "cup"
    },
    "sentence": {
      "japanese": "どのカップがあなたのですか。",
      "kana": "どのかっぷがあなたのですか。",
      "english": "Which cup is yours?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0465",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "あの",
      "meaning": "that over there"
    },
    "sentence": {
      "japanese": "どんなに高くても、あの古い時計を買います。",
      "kana": "どんなにたかくても、あのふるいとけいをかいます。",
      "english": "I'll buy that old clock, however expensive it is.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0465",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "あの",
      "meaning": "that over there"
    },
    "sentence": {
      "japanese": "あのデパートで新しいコートを買いたい。",
      "kana": "あのでぱーとであたらしいこーとをかいたい。",
      "english": "I would like to buy a new coat at that department store.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0465",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "あの",
      "meaning": "that over there"
    },
    "sentence": {
      "japanese": "あの仕事の口はまだあるよ。",
      "kana": "あのしごとのくちはまだあるよ。",
      "english": "The job offer still stands.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0466",
    "example_index": 0,
    "target_vocab": {
      "kanji": "頼む",
      "kana": "たのむ",
      "meaning": "to ask"
    },
    "sentence": {
      "japanese": "ちょっとおたのみがあるんですが。",
      "kana": "ちょっとおたのみがあるんですが。",
      "english": "Would you do something for me?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0466",
    "example_index": 1,
    "target_vocab": {
      "kanji": "頼む",
      "kana": "たのむ",
      "meaning": "to ask"
    },
    "sentence": {
      "japanese": "頼んだぞ。",
      "kana": "たのんだぞ。",
      "english": "I'm depending on you.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0466",
    "example_index": 2,
    "target_vocab": {
      "kanji": "頼む",
      "kana": "たのむ",
      "meaning": "to ask"
    },
    "sentence": {
      "japanese": "頼んだ物がまだ来ません。",
      "kana": "たのんだものがまだきません。",
      "english": "I'm still waiting for my order.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0468",
    "example_index": 0,
    "target_vocab": {
      "kanji": "手",
      "kana": "て",
      "meaning": "hand"
    },
    "sentence": {
      "japanese": "彼女はナイフで手を切った。",
      "kana": "かのじょはないふでてをきった。",
      "english": "She cut her hand on a knife.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0468",
    "example_index": 1,
    "target_vocab": {
      "kanji": "手",
      "kana": "て",
      "meaning": "hand"
    },
    "sentence": {
      "japanese": "もう手が冷たくって。",
      "kana": "もうてがつめたくって。",
      "english": "My hand's getting too cold.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0468",
    "example_index": 2,
    "target_vocab": {
      "kanji": "手",
      "kana": "て",
      "meaning": "hand"
    },
    "sentence": {
      "japanese": "この手の本はあまり読まない。",
      "kana": "このてのほんはあまりよまない。",
      "english": "I don't read this kind of book much.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0468",
    "example_index": 3,
    "target_vocab": {
      "kanji": "手",
      "kana": "て",
      "meaning": "hand"
    },
    "sentence": {
      "japanese": "あなたはシャツをあべこべに着ている。",
      "kana": "あなたはしゃつをあべこべにきている。",
      "english": "You are wearing your shirt inside out.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0468",
    "example_index": 4,
    "target_vocab": {
      "kanji": "手",
      "kana": "て",
      "meaning": "hand"
    },
    "sentence": {
      "japanese": "もう朝から晩まで働いてクタクタだよ。",
      "kana": "もうあさからばんまではたらいてくたくただよ。",
      "english": "I'm beat. I've been working from dawn to dusk.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0468",
    "example_index": 5,
    "target_vocab": {
      "kanji": "手",
      "kana": "て",
      "meaning": "hand"
    },
    "sentence": {
      "japanese": "彼はくたくたの背広を着ていた。",
      "kana": "かれはくたくたのせびろをきていた。",
      "english": "He was wearing a threadbare suit.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0469",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "ええ",
      "meaning": "yes"
    },
    "sentence": {
      "japanese": "ええ、じゃあ私の電話番号教えるね。",
      "kana": "ええ、じゃあわたしのでんわばんごうおしえるね。",
      "english": "OK. Let me give you my number.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0469",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "ええ",
      "meaning": "yes"
    },
    "sentence": {
      "japanese": "長く歩いた後で疲れたかどうか聞くと、彼女は「ええ、ちょっと」と言った。",
      "kana": "ながくあるいたあとでつかれたかどうかきくと、かのじょは「ええ、ちょっと」といった。",
      "english": "When I asked her if she was tired after the long walk, she said, \"Sort of.\"",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0469",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "ええ",
      "meaning": "yes"
    },
    "sentence": {
      "japanese": "ええと、買ったのは先週でした。",
      "kana": "ええと、かったのはせんしゅうでした。",
      "english": "Let's see. I bought it last week.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0470",
    "example_index": 0,
    "target_vocab": {
      "kanji": "毎日",
      "kana": "まいにち",
      "meaning": "every day"
    },
    "sentence": {
      "japanese": "毎日働く時間帯が違うんです。",
      "kana": "まいにちはたらくじかんたいがちがうんです。",
      "english": "Every day I work different hours.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0470",
    "example_index": 1,
    "target_vocab": {
      "kanji": "毎日",
      "kana": "まいにち",
      "meaning": "every day"
    },
    "sentence": {
      "japanese": "音楽が好きで、毎日聴いています。",
      "kana": "おんがくがすきで、まいにちきいています。",
      "english": "I like music, and I listen to it every day.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0470",
    "example_index": 2,
    "target_vocab": {
      "kanji": "毎日",
      "kana": "まいにち",
      "meaning": "every day"
    },
    "sentence": {
      "japanese": "毎日お昼ご飯を作っているよ。",
      "kana": "まいにちおひるごめしをつくっているよ。",
      "english": "I make lunch every day.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0471",
    "example_index": 0,
    "target_vocab": {
      "kanji": "花",
      "kana": "はな",
      "meaning": "flower"
    },
    "sentence": {
      "japanese": "これらの花は春に咲く。",
      "kana": "これらのはなははるにさく。",
      "english": "These flowers bloom in spring.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0471",
    "example_index": 1,
    "target_vocab": {
      "kanji": "花",
      "kana": "はな",
      "meaning": "flower"
    },
    "sentence": {
      "japanese": "たおやかな花が咲いている。",
      "kana": "たおやかなはながさいている。",
      "english": "The delicate, graceful flowers are in bloom.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0471",
    "example_index": 2,
    "target_vocab": {
      "kanji": "花",
      "kana": "はな",
      "meaning": "flower"
    },
    "sentence": {
      "japanese": "彼女は鳥や花が大好きです。",
      "kana": "かのじょはとりやはながだいすきです。",
      "english": "She is keen on birds and flowers.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0472",
    "example_index": 0,
    "target_vocab": {
      "kanji": "一",
      "kana": "いち",
      "meaning": "one"
    },
    "sentence": {
      "japanese": "あなたか私のどちらかが一位を取るだろう。",
      "kana": "あなたかわたしのどちらかがいちいをとるだろう。",
      "english": "Either you or I will get the first prize.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0472",
    "example_index": 1,
    "target_vocab": {
      "kanji": "一",
      "kana": "いち",
      "meaning": "one"
    },
    "sentence": {
      "japanese": "その家なら一軒おいて隣ですよ。",
      "kana": "そのいえならいっけんおいてとなりですよ。",
      "english": "The house is next door but one.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0472",
    "example_index": 2,
    "target_vocab": {
      "kanji": "一",
      "kana": "いち",
      "meaning": "one"
    },
    "sentence": {
      "japanese": "机の上に一冊の本がある。",
      "kana": "つくえのうえにいっさつのほんがある。",
      "english": "There is an album on the desk.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0473",
    "example_index": 0,
    "target_vocab": {
      "kanji": "居る",
      "kana": "いる",
      "meaning": "to be"
    },
    "sentence": {
      "japanese": "あなたはシャツをあべこべに着ている。",
      "kana": "あなたはしゃつをあべこべにきている。",
      "english": "You are wearing your shirt inside out.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0473",
    "example_index": 1,
    "target_vocab": {
      "kanji": "居る",
      "kana": "いる",
      "meaning": "to be"
    },
    "sentence": {
      "japanese": "ワシが空を飛んでいる。",
      "kana": "わしがそらをとんでいる。",
      "english": "An eagle is flying in the sky.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0473",
    "example_index": 2,
    "target_vocab": {
      "kanji": "居る",
      "kana": "いる",
      "meaning": "to be"
    },
    "sentence": {
      "japanese": "その上雨が降り出している。",
      "kana": "そのうえあめがおりだしている。",
      "english": "Besides, it's starting to rain.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0473",
    "example_index": 3,
    "target_vocab": {
      "kanji": "居る",
      "kana": "いる",
      "meaning": "to be"
    },
    "sentence": {
      "japanese": "あなたはシャツをあべこべに着ている。",
      "kana": "あなたはしゃつをあべこべにきている。",
      "english": "You are wearing your shirt inside out.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0473",
    "example_index": 4,
    "target_vocab": {
      "kanji": "居る",
      "kana": "いる",
      "meaning": "to be"
    },
    "sentence": {
      "japanese": "彼はくたくたの背広を着ていた。",
      "kana": "かれはくたくたのせびろをきていた。",
      "english": "He was wearing a threadbare suit.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0473",
    "example_index": 5,
    "target_vocab": {
      "kanji": "居る",
      "kana": "いる",
      "meaning": "to be"
    },
    "sentence": {
      "japanese": "彼女はそこらにいますか。",
      "kana": "かのじょはそこらにいますか。",
      "english": "Is she anywhere about?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0474",
    "example_index": 0,
    "target_vocab": {
      "kanji": "砂糖",
      "kana": "さとう",
      "meaning": "sugar"
    },
    "sentence": {
      "japanese": "薄い砂糖水を作った。",
      "kana": "うすいさとうみずをつくった。",
      "english": "I prepared a weak solution of sugar and water.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0474",
    "example_index": 1,
    "target_vocab": {
      "kanji": "砂糖",
      "kana": "さとう",
      "meaning": "sugar"
    },
    "sentence": {
      "japanese": "彼女はコーヒーにたくさん砂糖を入れた。",
      "kana": "かのじょはこーひーにたくさんさとうをいれた。",
      "english": "She put much sugar in the coffee.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0474",
    "example_index": 2,
    "target_vocab": {
      "kanji": "砂糖",
      "kana": "さとう",
      "meaning": "sugar"
    },
    "sentence": {
      "japanese": "彼は砂糖を入れないコーヒーが好きだ。",
      "kana": "かれはさとうをいれないこーひーがすきだ。",
      "english": "He likes coffee without sugar.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0475",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "カレンダー",
      "meaning": "calendar"
    },
    "sentence": {
      "japanese": "カレンダーはどこ？",
      "kana": "かれんだーはどこ？",
      "english": "Where is the calendar?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0475",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "カレンダー",
      "meaning": "calendar"
    },
    "sentence": {
      "japanese": "カレンダーはある？",
      "kana": "かれんだーはある？",
      "english": "Do you have a calendar?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0476",
    "example_index": 0,
    "target_vocab": {
      "kanji": "今",
      "kana": "いま",
      "meaning": "now"
    },
    "sentence": {
      "japanese": "私は彼が来るのを今か今かと待っている。",
      "kana": "わたしはかれがくるのをいまかいまかとまっている。",
      "english": "I expect him to come every moment.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0476",
    "example_index": 1,
    "target_vocab": {
      "kanji": "今",
      "kana": "いま",
      "meaning": "now"
    },
    "sentence": {
      "japanese": "今、女の人が１人入っていきましたよ。",
      "kana": "いま、おんなのひとが１にんいっっていきましたよ。",
      "english": "A woman is going into it now.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0476",
    "example_index": 2,
    "target_vocab": {
      "kanji": "今",
      "kana": "いま",
      "meaning": "now"
    },
    "sentence": {
      "japanese": "彼女は今のところ大丈夫です。",
      "kana": "かのじょはいまのところだいじょうぶです。",
      "english": "She is all right at the moment.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0476",
    "example_index": 3,
    "target_vocab": {
      "kanji": "今",
      "kana": "いま",
      "meaning": "now"
    },
    "sentence": {
      "japanese": "彼らはいま三人の子供がいる。",
      "kana": "かれらはいまさんにんのこどもがいる。",
      "english": "Now they have three children.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0476",
    "example_index": 4,
    "target_vocab": {
      "kanji": "今",
      "kana": "いま",
      "meaning": "now"
    },
    "sentence": {
      "japanese": "彼はいま泳いでいます。",
      "kana": "かれはいまおよいでいます。",
      "english": "He's swimming now.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0476",
    "example_index": 5,
    "target_vocab": {
      "kanji": "今",
      "kana": "いま",
      "meaning": "now"
    },
    "sentence": {
      "japanese": "いま頭が痛い。",
      "kana": "いまあたまがいたい。",
      "english": "I have a headache now.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0477",
    "example_index": 0,
    "target_vocab": {
      "kanji": "旅行",
      "kana": "りょこう",
      "meaning": "travel"
    },
    "sentence": {
      "japanese": "彼は来年外国旅行をする。",
      "kana": "かれはらいねんがいこくりょこうをする。",
      "english": "He will travel abroad next year.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0477",
    "example_index": 1,
    "target_vocab": {
      "kanji": "旅行",
      "kana": "りょこう",
      "meaning": "travel"
    },
    "sentence": {
      "japanese": "旅行は楽しい。",
      "kana": "りょこうはたのしい。",
      "english": "It's fun to travel.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0477",
    "example_index": 2,
    "target_vocab": {
      "kanji": "旅行",
      "kana": "りょこう",
      "meaning": "travel"
    },
    "sentence": {
      "japanese": "旅行に行こう。",
      "kana": "りょこうにいこう。",
      "english": "Let's take a trip.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0478",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "できる",
      "meaning": "to be able to"
    },
    "sentence": {
      "japanese": "できるよ！",
      "kana": "できるよ！",
      "english": "You can do it.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0478",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "できる",
      "meaning": "to be able to"
    },
    "sentence": {
      "japanese": "電話はどこでできる？",
      "kana": "でんわはどこでできる？",
      "english": "Where can one make a phone call?",
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
