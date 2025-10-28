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

**Batch Number**: 25
**Total Batches**: 38
**Examples in This Batch**: 50

---

### Examples:

[
  {
    "card_id": "n5_vocab_0417",
    "example_index": 3,
    "target_vocab": {
      "kanji": "店",
      "kana": "みせ",
      "meaning": "shop"
    },
    "sentence": {
      "japanese": "私にちょっとみせてくださいよ。",
      "kana": "わたしにちょっとみせてくださいよ。",
      "english": "Let me have a look at it, will you?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0418",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "ワイシャツ",
      "meaning": "business shirt"
    },
    "sentence": {
      "japanese": "私はワイシャツをきれいに洗った。",
      "kana": "わたしはわいしゃつをきれいにあらった。",
      "english": "I washed my shirt clean.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0418",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "ワイシャツ",
      "meaning": "business shirt"
    },
    "sentence": {
      "japanese": "俺の白のワイシャツ、どこ？",
      "kana": "おれのしろのわいしゃつ、どこ？",
      "english": "Where's my white dress shirt?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0419",
    "example_index": 0,
    "target_vocab": {
      "kanji": "北",
      "kana": "きた",
      "meaning": "north"
    },
    "sentence": {
      "japanese": "北の方では冬が寒いです。",
      "kana": "きたのほうではふゆがさむいです。",
      "english": "In the north, it's cold in winter.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0419",
    "example_index": 1,
    "target_vocab": {
      "kanji": "北",
      "kana": "きた",
      "meaning": "north"
    },
    "sentence": {
      "japanese": "北から冷たい風が吹いていた。",
      "kana": "きたからつめたいかぜがふいていた。",
      "english": "There was a cold wind blowing from the north.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0419",
    "example_index": 2,
    "target_vocab": {
      "kanji": "北",
      "kana": "きた",
      "meaning": "north"
    },
    "sentence": {
      "japanese": "風は北から吹いている。",
      "kana": "かぜはきたからふいている。",
      "english": "The wind is blowing from the north.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0420",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "ラジオ",
      "meaning": "radio"
    },
    "sentence": {
      "japanese": "そのニュースはラジオで聞いたよ。",
      "kana": "そのにゅーすはらじおできいたよ。",
      "english": "I heard the news on the radio.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0420",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "ラジオ",
      "meaning": "radio"
    },
    "sentence": {
      "japanese": "彼女はラジオを消した。",
      "kana": "かのじょはらじおをけした。",
      "english": "She turned off the radio.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0420",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "ラジオ",
      "meaning": "radio"
    },
    "sentence": {
      "japanese": "彼女はラジオを持っていた。",
      "kana": "かのじょはらじおをもっていた。",
      "english": "She had a radio.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0422",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "ハンカチ",
      "meaning": "handkerchief"
    },
    "sentence": {
      "japanese": "このハンカチはいくらですか。",
      "kana": "このはんかちはいくらですか。",
      "english": "How much is this handkerchief?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0422",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "ハンカチ",
      "meaning": "handkerchief"
    },
    "sentence": {
      "japanese": "彼女はたくさんハンカチを持っている。",
      "kana": "かのじょはたくさんはんかちをもっている。",
      "english": "She has many handkerchiefs.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0422",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "ハンカチ",
      "meaning": "handkerchief"
    },
    "sentence": {
      "japanese": "きのう教室にハンカチを忘れました。",
      "kana": "きのうきょうしつにはんかちをわすれました。",
      "english": "I left my handkerchief in the classroom yesterday.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0423",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "いつ",
      "meaning": "when"
    },
    "sentence": {
      "japanese": "テレビはいつからあるの？",
      "kana": "てれびはいつからあるの？",
      "english": "When did TV appear?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0423",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "いつ",
      "meaning": "when"
    },
    "sentence": {
      "japanese": "いつものところでいつもの人達に会った。",
      "kana": "いつものところでいつものひとたちにあった。",
      "english": "I met the usual people at the usual place.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0423",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "いつ",
      "meaning": "when"
    },
    "sentence": {
      "japanese": "いつでも私の車を貸してあげますよ。",
      "kana": "いつでもわたしのくるまをかしてあげますよ。",
      "english": "You can borrow my car anytime.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0424",
    "example_index": 0,
    "target_vocab": {
      "kanji": "全部",
      "kana": "ぜんぶ",
      "meaning": "all"
    },
    "sentence": {
      "japanese": "彼は窓を全部開けておいた。",
      "kana": "かれはまどをぜんぶひらけておいた。",
      "english": "He kept all the windows open.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0424",
    "example_index": 1,
    "target_vocab": {
      "kanji": "全部",
      "kana": "ぜんぶ",
      "meaning": "all"
    },
    "sentence": {
      "japanese": "生徒は全部で約千人です。",
      "kana": "せいとはぜんぶでやくせんにんです。",
      "english": "There are about a thousand students in all.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0424",
    "example_index": 2,
    "target_vocab": {
      "kanji": "全部",
      "kana": "ぜんぶ",
      "meaning": "all"
    },
    "sentence": {
      "japanese": "私は彼らの全部を知っている。",
      "kana": "わたしはかれらのぜんぶをしっている。",
      "english": "I know all of them.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0425",
    "example_index": 0,
    "target_vocab": {
      "kanji": "橋",
      "kana": "はし",
      "meaning": "bridge"
    },
    "sentence": {
      "japanese": "はしで食べるのは難しいですか。",
      "kana": "はしでたべるのはむずかしいですか。",
      "english": "Is eating with chopsticks difficult?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0425",
    "example_index": 1,
    "target_vocab": {
      "kanji": "橋",
      "kana": "はし",
      "meaning": "bridge"
    },
    "sentence": {
      "japanese": "彼らは橋を造った。",
      "kana": "かれらははしをぞうった。",
      "english": "They constructed a bridge.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0425",
    "example_index": 2,
    "target_vocab": {
      "kanji": "橋",
      "kana": "はし",
      "meaning": "bridge"
    },
    "sentence": {
      "japanese": "私の家はあの橋の向こうにある。",
      "kana": "わたしのいえはあのはしのむこうにある。",
      "english": "My house is beyond that bridge.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0425",
    "example_index": 3,
    "target_vocab": {
      "kanji": "橋",
      "kana": "はし",
      "meaning": "bridge"
    },
    "sentence": {
      "japanese": "橋まで一緒に行きましょう。",
      "kana": "はしまでいっしょにいきましょう。",
      "english": "I'll go with you as far as the bridge.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0427",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "バター",
      "meaning": "butter"
    },
    "sentence": {
      "japanese": "私は今朝バターつきのパンを食べた。",
      "kana": "わたしはけさばたーつきのぱんをたべた。",
      "english": "I ate bread and butter this morning.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0427",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "バター",
      "meaning": "butter"
    },
    "sentence": {
      "japanese": "彼はバター付きパンが好きだ。",
      "kana": "かれはばたーつきぱんがすきだ。",
      "english": "He likes bread and butter.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0427",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "バター",
      "meaning": "butter"
    },
    "sentence": {
      "japanese": "私たちは牛乳でバターを作ります。",
      "kana": "わたしたちはぎゅうにゅうでばたーをつくります。",
      "english": "We make milk into butter.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0428",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "もっと",
      "meaning": "more"
    },
    "sentence": {
      "japanese": "もっと果物を食べるべきです。",
      "kana": "もっとくだものをたべるべきです。",
      "english": "You should eat more fruit.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0428",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "もっと",
      "meaning": "more"
    },
    "sentence": {
      "japanese": "もっと大きい声で言ってください。",
      "kana": "もっとおおきいこえでいってください。",
      "english": "Louder, please.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0428",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "もっと",
      "meaning": "more"
    },
    "sentence": {
      "japanese": "なんでもっと早くここに来なかったのだ。",
      "kana": "なんでもっとはやくここにこなかったのだ。",
      "english": "Why didn't you get here sooner?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0430",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "など",
      "meaning": "et cetera"
    },
    "sentence": {
      "japanese": "彼は鉛筆やノートや辞書などを買った。",
      "kana": "かれはえんぴつやのーとやじしょなどをかった。",
      "english": "He bought pencils, notebooks, dictionaries and so on.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0430",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "など",
      "meaning": "et cetera"
    },
    "sentence": {
      "japanese": "私はパンやコーヒーや砂糖などを買った。",
      "kana": "わたしはぱんやこーひーやさとうなどをかった。",
      "english": "I bought bread, coffee, sugar and the like.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0430",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "など",
      "meaning": "et cetera"
    },
    "sentence": {
      "japanese": "だれがその手紙を書いたかはまだなぞである。",
      "kana": "だれがそのてがみをかいたかはまだなぞである。",
      "english": "It is still a mystery who wrote the letter.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0431",
    "example_index": 0,
    "target_vocab": {
      "kanji": "太い",
      "kana": "ふとい",
      "meaning": "fat"
    },
    "sentence": {
      "japanese": "このペンは太いです。",
      "kana": "このぺんはふといです。",
      "english": "This pen is thick.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0432",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "やる",
      "meaning": "to do"
    },
    "sentence": {
      "japanese": "彼は夏は花に毎日水をやる。",
      "kana": "かれはなつははなにまいにちみずをやる。",
      "english": "He waters the flowers every day in summer.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0432",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "やる",
      "meaning": "to do"
    },
    "sentence": {
      "japanese": "私は毎日庭の花に水をやる。",
      "kana": "わたしはまいにちにわのはなにみずをやる。",
      "english": "I water the flowers in the garden every day.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0432",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "やる",
      "meaning": "to do"
    },
    "sentence": {
      "japanese": "私は犬に肉をやる。",
      "kana": "わたしはいぬににくをやる。",
      "english": "I feed meat to my dog.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0434",
    "example_index": 0,
    "target_vocab": {
      "kanji": "昼",
      "kana": "ひる",
      "meaning": "noon"
    },
    "sentence": {
      "japanese": "彼女は昼も夜も働いている。",
      "kana": "かのじょはひるもよるもはたらいている。",
      "english": "She is working night and day.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0434",
    "example_index": 1,
    "target_vocab": {
      "kanji": "昼",
      "kana": "ひる",
      "meaning": "noon"
    },
    "sentence": {
      "japanese": "昼寝て夜働く人もいる。",
      "kana": "ひるねてよるはたらくにんもいる。",
      "english": "There are some people who sleep in the daytime and work at night.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0434",
    "example_index": 2,
    "target_vocab": {
      "kanji": "昼",
      "kana": "ひる",
      "meaning": "noon"
    },
    "sentence": {
      "japanese": "私たちはよく一緒に御昼を食べます。",
      "kana": "わたしたちはよくいっしょにおひるをたべます。",
      "english": "We often eat lunch together.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0435",
    "example_index": 0,
    "target_vocab": {
      "kanji": "色",
      "kana": "いろ",
      "meaning": "colour"
    },
    "sentence": {
      "japanese": "僕はこの色もまた好きだ。",
      "kana": "ぼくはこのいろもまたすきだ。",
      "english": "I like this color as well.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0435",
    "example_index": 1,
    "target_vocab": {
      "kanji": "色",
      "kana": "いろ",
      "meaning": "colour"
    },
    "sentence": {
      "japanese": "彼女は色が黒い。",
      "kana": "かのじょはいろがくろい。",
      "english": "She is dark-skinned.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0435",
    "example_index": 2,
    "target_vocab": {
      "kanji": "色",
      "kana": "いろ",
      "meaning": "colour"
    },
    "sentence": {
      "japanese": "彼女の目の色は青です。",
      "kana": "かのじょのめのいろはあおです。",
      "english": "The color of her eyes is blue.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0436",
    "example_index": 0,
    "target_vocab": {
      "kanji": "黄色",
      "kana": "きいろ",
      "meaning": "yellow"
    },
    "sentence": {
      "japanese": "私はたくさんの花を持っている。あるものは赤く、あるものは黄色である。",
      "kana": "わたしはたくさんのはなをもっている。あるものはあかく、あるものはきいろである。",
      "english": "I have a lot of flowers. Some are red and some are yellow.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0436",
    "example_index": 1,
    "target_vocab": {
      "kanji": "黄色",
      "kana": "きいろ",
      "meaning": "yellow"
    },
    "sentence": {
      "japanese": "私は黄色が好きです。",
      "kana": "わたしはきいろがすきです。",
      "english": "I like the colour yellow.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0436",
    "example_index": 2,
    "target_vocab": {
      "kanji": "黄色",
      "kana": "きいろ",
      "meaning": "yellow"
    },
    "sentence": {
      "japanese": "黄色のもあるよ。",
      "kana": "きいろのもあるよ。",
      "english": "There's also a yellow one.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0437",
    "example_index": 0,
    "target_vocab": {
      "kanji": "左",
      "kana": "ひだり",
      "meaning": "left hand side"
    },
    "sentence": {
      "japanese": "左の足が痛いです。",
      "kana": "ひだりのあしがいたいです。",
      "english": "My left foot hurts.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0438",
    "example_index": 0,
    "target_vocab": {
      "kanji": "野菜",
      "kana": "やさい",
      "meaning": "vegetable"
    },
    "sentence": {
      "japanese": "その店は野菜を売っている。",
      "kana": "そのみせはやさいをうっている。",
      "english": "The store deals in vegetables.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0438",
    "example_index": 1,
    "target_vocab": {
      "kanji": "野菜",
      "kana": "やさい",
      "meaning": "vegetable"
    },
    "sentence": {
      "japanese": "いびつな野菜はお嫌いですか？",
      "kana": "いびつなやさいはおきらいですか？",
      "english": "Do you hate misshapen vegetables?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0438",
    "example_index": 2,
    "target_vocab": {
      "kanji": "野菜",
      "kana": "やさい",
      "meaning": "vegetable"
    },
    "sentence": {
      "japanese": "野菜を食べたら？",
      "kana": "やさいをたべたら？",
      "english": "Why don't you eat some vegetables?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0439",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "シャワー",
      "meaning": "shower"
    },
    "sentence": {
      "japanese": "シャワーはどこですか。",
      "kana": "しゃわーはどこですか。",
      "english": "Where are the showers?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0439",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "シャワー",
      "meaning": "shower"
    },
    "sentence": {
      "japanese": "シャワーの水が出ません。",
      "kana": "しゃわーのみずがでません。",
      "english": "There's no water coming out of the shower.",
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
