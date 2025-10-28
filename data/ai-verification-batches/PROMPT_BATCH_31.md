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

**Batch Number**: 31
**Total Batches**: 38
**Examples in This Batch**: 50

---

### Examples:

[
  {
    "card_id": "n5_vocab_0529",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "コーヒー",
      "meaning": "coffee"
    },
    "sentence": {
      "japanese": "これはとてもまろやかなコーヒーだ。",
      "kana": "これはとてもまろやかなこーひーだ。",
      "english": "This is a very mild coffee.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0529",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "コーヒー",
      "meaning": "coffee"
    },
    "sentence": {
      "japanese": "このコーヒーはぬるいです。",
      "kana": "このこーひーはぬるいです。",
      "english": "This coffee is not hot enough.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0529",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "コーヒー",
      "meaning": "coffee"
    },
    "sentence": {
      "japanese": "コーヒーは薄いのが好きです。",
      "kana": "こーひーはうすいのがすきです。",
      "english": "I'd like my coffee weak.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0530",
    "example_index": 0,
    "target_vocab": {
      "kanji": "漢字",
      "kana": "かんじ",
      "meaning": "Chinese character"
    },
    "sentence": {
      "japanese": "君はこの漢字が読めますか。",
      "kana": "くんはこのかんじがよめますか。",
      "english": "Can you read this kanji?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0530",
    "example_index": 1,
    "target_vocab": {
      "kanji": "漢字",
      "kana": "かんじ",
      "meaning": "Chinese character"
    },
    "sentence": {
      "japanese": "漢字は読むのが難しい。",
      "kana": "かんじはよむのがむずかしい。",
      "english": "Kanji are difficult to read.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0530",
    "example_index": 2,
    "target_vocab": {
      "kanji": "漢字",
      "kana": "かんじ",
      "meaning": "Chinese character"
    },
    "sentence": {
      "japanese": "この漢字はどういう意味ですか。",
      "kana": "このかんじはどういういみですか。",
      "english": "What does this kanji mean?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0532",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "その",
      "meaning": "that"
    },
    "sentence": {
      "japanese": "彼はそのそばでシャツをすうっと着た。",
      "kana": "かれはそのそばでしゃつをすうっときた。",
      "english": "He slipped the gaudy shirt on.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0532",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "その",
      "meaning": "that"
    },
    "sentence": {
      "japanese": "その仕事でへとへとだ。",
      "kana": "そのしごとでへとへとだ。",
      "english": "That job took a lot out of me.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0532",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "その",
      "meaning": "that"
    },
    "sentence": {
      "japanese": "そのニュースはラジオで聞いたよ。",
      "kana": "そのにゅーすはらじおできいたよ。",
      "english": "I heard the news on the radio.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0533",
    "example_index": 0,
    "target_vocab": {
      "kanji": "子供",
      "kana": "こども",
      "meaning": "child"
    },
    "sentence": {
      "japanese": "あなたには何人子供がいますか。",
      "kana": "あなたにはなんにんこどもがいますか。",
      "english": "How many children do you have?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0533",
    "example_index": 1,
    "target_vocab": {
      "kanji": "子供",
      "kana": "こども",
      "meaning": "child"
    },
    "sentence": {
      "japanese": "彼は体の弱い子供だった。",
      "kana": "かれはからだのよわいこどもだった。",
      "english": "He was a weak and delicate child.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0533",
    "example_index": 2,
    "target_vocab": {
      "kanji": "子供",
      "kana": "こども",
      "meaning": "child"
    },
    "sentence": {
      "japanese": "野菜の嫌いな子供もいる。",
      "kana": "やさいのきらいなこどももいる。",
      "english": "Some children do not like vegetables.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0533",
    "example_index": 3,
    "target_vocab": {
      "kanji": "子供",
      "kana": "こども",
      "meaning": "child"
    },
    "sentence": {
      "japanese": "彼女はこどもたちと遊ぶのが非常に好きだ。",
      "kana": "かのじょはこどもたちとあそぶのがひじょうにすきだ。",
      "english": "She seems to take immense pleasure in playing with children.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0534",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "ちょっと",
      "meaning": "somewhat"
    },
    "sentence": {
      "japanese": "この机は私にはちょっと低い。",
      "kana": "このつくえはわたしにはちょっとひくい。",
      "english": "This desk is a little low for me.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0534",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "ちょっと",
      "meaning": "somewhat"
    },
    "sentence": {
      "japanese": "ちょっと、そこのきみ！",
      "kana": "ちょっと、そこのきみ！",
      "english": "Hey, you there!",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0534",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "ちょっと",
      "meaning": "somewhat"
    },
    "sentence": {
      "japanese": "ちょっとおたのみがあるんですが。",
      "kana": "ちょっとおたのみがあるんですが。",
      "english": "Would you do something for me?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0535",
    "example_index": 0,
    "target_vocab": {
      "kanji": "女の子",
      "kana": "おんなのこ",
      "meaning": "girl"
    },
    "sentence": {
      "japanese": "その女の子達は、とても忙しい。",
      "kana": "そのおんなのことおるは、とてもいそがしい。",
      "english": "Those girls are very busy.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0535",
    "example_index": 1,
    "target_vocab": {
      "kanji": "女の子",
      "kana": "おんなのこ",
      "meaning": "girl"
    },
    "sentence": {
      "japanese": "あなたが女の子だからよ。",
      "kana": "あなたがおんなのこだからよ。",
      "english": "That's because you're a girl.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0535",
    "example_index": 2,
    "target_vocab": {
      "kanji": "女の子",
      "kana": "おんなのこ",
      "meaning": "girl"
    },
    "sentence": {
      "japanese": "僕と一緒に映画に行った女の子は僕の友達です。",
      "kana": "ぼくといっしょにえいがにいったおんなのこはぼくのともだちです。",
      "english": "The girl I went to the movies with is a friend of mine.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0536",
    "example_index": 0,
    "target_vocab": {
      "kanji": "紙",
      "kana": "かみ",
      "meaning": "paper"
    },
    "sentence": {
      "japanese": "彼は一枚の紙に手紙を書きました。",
      "kana": "かれはいちまいのかみにてがみをかきました。",
      "english": "He wrote a letter on a piece of paper.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0536",
    "example_index": 1,
    "target_vocab": {
      "kanji": "紙",
      "kana": "かみ",
      "meaning": "paper"
    },
    "sentence": {
      "japanese": "書く紙を一枚ください。",
      "kana": "かくかみをいちまいください。",
      "english": "Please give me a sheet of paper.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0536",
    "example_index": 2,
    "target_vocab": {
      "kanji": "紙",
      "kana": "かみ",
      "meaning": "paper"
    },
    "sentence": {
      "japanese": "紙は木から作られる。",
      "kana": "かみはきからつくられる。",
      "english": "Paper is made from wood.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0536",
    "example_index": 3,
    "target_vocab": {
      "kanji": "紙",
      "kana": "かみ",
      "meaning": "paper"
    },
    "sentence": {
      "japanese": "かみさんが寝られないんだ。",
      "kana": "かみさんがねられないんだ。",
      "english": "My wife's trying to sleep.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0536",
    "example_index": 4,
    "target_vocab": {
      "kanji": "紙",
      "kana": "かみ",
      "meaning": "paper"
    },
    "sentence": {
      "japanese": "君のかみさん元気？",
      "kana": "くんのかみさんげんき？",
      "english": "How is your wife doing?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0539",
    "example_index": 0,
    "target_vocab": {
      "kanji": "嫌い",
      "kana": "きらい",
      "meaning": "hate"
    },
    "sentence": {
      "japanese": "あからさまに言えば彼は嫌いだ。",
      "kana": "あからさまにいえばかれはきらいだ。",
      "english": "Frankly, I don't like him.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0539",
    "example_index": 1,
    "target_vocab": {
      "kanji": "嫌い",
      "kana": "きらい",
      "meaning": "hate"
    },
    "sentence": {
      "japanese": "いびつな野菜はお嫌いですか？",
      "kana": "いびつなやさいはおきらいですか？",
      "english": "Do you hate misshapen vegetables?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0539",
    "example_index": 2,
    "target_vocab": {
      "kanji": "嫌い",
      "kana": "きらい",
      "meaning": "hate"
    },
    "sentence": {
      "japanese": "私は彼の口のききかたが嫌いだ。",
      "kana": "わたしはかのくちのききかたがきらいだ。",
      "english": "I do not like the way he talks.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0540",
    "example_index": 0,
    "target_vocab": {
      "kanji": "先",
      "kana": "さき",
      "meaning": "the future"
    },
    "sentence": {
      "japanese": "お先にどうぞ。",
      "kana": "おさきにどうぞ。",
      "english": "After you.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0540",
    "example_index": 1,
    "target_vocab": {
      "kanji": "先",
      "kana": "さき",
      "meaning": "the future"
    },
    "sentence": {
      "japanese": "どうぞ、お先に！",
      "kana": "どうぞ、おさきに！",
      "english": "Go ahead!",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0540",
    "example_index": 2,
    "target_vocab": {
      "kanji": "先",
      "kana": "さき",
      "meaning": "the future"
    },
    "sentence": {
      "japanese": "ここから先には行けません。",
      "kana": "ここからさきにはいけません。",
      "english": "You cannot go any farther.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0541",
    "example_index": 0,
    "target_vocab": {
      "kanji": "答える",
      "kana": "こたえる",
      "meaning": "to answer"
    },
    "sentence": {
      "japanese": "「ぼくだいじょうぶ？」といわれました。「だいじょうぶ」とこたえました。",
      "kana": "「ぼくだいじょうぶ？」といわれました。「だいじょうぶ」とこたえました。",
      "english": "I was asked, \"You OK, kid?\". I replied, \"Fine.\"",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0541",
    "example_index": 1,
    "target_vocab": {
      "kanji": "答える",
      "kana": "こたえる",
      "meaning": "to answer"
    },
    "sentence": {
      "japanese": "テストで一問も答えられなかった。",
      "kana": "てすとでいちもんもこたえられなかった。",
      "english": "I couldn't answer any questions on the test.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0541",
    "example_index": 2,
    "target_vocab": {
      "kanji": "答える",
      "kana": "こたえる",
      "meaning": "to answer"
    },
    "sentence": {
      "japanese": "何て答えたの？",
      "kana": "なんてこたえたの？",
      "english": "What did you answer?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0541",
    "example_index": 3,
    "target_vocab": {
      "kanji": "答える",
      "kana": "こたえる",
      "meaning": "to answer"
    },
    "sentence": {
      "japanese": "彼には寒さがとてもこたえる。",
      "kana": "かれにはさむさがとてもこたえる。",
      "english": "He feels the cold very much.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0542",
    "example_index": 0,
    "target_vocab": {
      "kanji": "食堂",
      "kana": "しょくどう",
      "meaning": "dining hall"
    },
    "sentence": {
      "japanese": "食堂はどこですか。",
      "kana": "しょくどうはどこですか。",
      "english": "Where is the cafeteria?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0542",
    "example_index": 1,
    "target_vocab": {
      "kanji": "食堂",
      "kana": "しょくどう",
      "meaning": "dining hall"
    },
    "sentence": {
      "japanese": "食堂はもう開いてますか。",
      "kana": "しょくどうはもうひらいてますか。",
      "english": "Is the dining room open now?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0542",
    "example_index": 2,
    "target_vocab": {
      "kanji": "食堂",
      "kana": "しょくどう",
      "meaning": "dining hall"
    },
    "sentence": {
      "japanese": "食堂がまだ開いてるかどうか、誰か知ってる？",
      "kana": "しょくどうがまだひらいてるかどうか、だれかしってる？",
      "english": "Does anybody know if the cafeteria is still open?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0543",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "テーブル",
      "meaning": "table"
    },
    "sentence": {
      "japanese": "彼女はその箱をテーブルの上に置いた。",
      "kana": "かのじょはそのはこをてーぶるのうえにおいた。",
      "english": "She deposited the box on the table.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0543",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "テーブル",
      "meaning": "table"
    },
    "sentence": {
      "japanese": "彼らはレストランのテーブルについた。",
      "kana": "かれらはれすとらんのてーぶるについた。",
      "english": "They were seated at a table in a restaurant.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0543",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "テーブル",
      "meaning": "table"
    },
    "sentence": {
      "japanese": "彼らはいすとテーブルを使わない。",
      "kana": "かれらはいすとてーぶるをつかわない。",
      "english": "They don't use chairs or tables.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0545",
    "example_index": 0,
    "target_vocab": {
      "kanji": "働く",
      "kana": "はたらく",
      "meaning": "to work"
    },
    "sentence": {
      "japanese": "もう朝から晩まで働いてクタクタだよ。",
      "kana": "もうあさからばんまではたらいてくたくただよ。",
      "english": "I'm beat. I've been working from dawn to dusk.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0545",
    "example_index": 1,
    "target_vocab": {
      "kanji": "働く",
      "kana": "はたらく",
      "meaning": "to work"
    },
    "sentence": {
      "japanese": "毎日働く時間帯が違うんです。",
      "kana": "まいにちはたらくじかんたいがちがうんです。",
      "english": "Every day I work different hours.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0545",
    "example_index": 2,
    "target_vocab": {
      "kanji": "働く",
      "kana": "はたらく",
      "meaning": "to work"
    },
    "sentence": {
      "japanese": "あなたはなぜ働いているの。",
      "kana": "あなたはなぜはたらいているの。",
      "english": "How come you're still working?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0546",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "こんな",
      "meaning": "such"
    },
    "sentence": {
      "japanese": "何だって私の本がこんなところにあるんだろう。",
      "kana": "なんだってわたしのほんがこんなところにあるんだろう。",
      "english": "What's my book doing here?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0546",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "こんな",
      "meaning": "such"
    },
    "sentence": {
      "japanese": "毎日こんなに暑いのですか。",
      "kana": "まいにちこんなにあついのですか。",
      "english": "Is it this hot every day?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0546",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "こんな",
      "meaning": "such"
    },
    "sentence": {
      "japanese": "私はこんな甘いコーヒーは飲めない。",
      "kana": "わたしはこんなあまいこーひーはのめない。",
      "english": "I can't drink coffee as sweet as this.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0547",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "たくさん",
      "meaning": "many"
    },
    "sentence": {
      "japanese": "この学校はたくさんの生徒がいます。",
      "kana": "このがっこうはたくさんのせいとがいます。",
      "english": "This school has many students.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0547",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "たくさん",
      "meaning": "many"
    },
    "sentence": {
      "japanese": "この悪い天気はもうたくさんだ。",
      "kana": "このわるいてんきはもうたくさんだ。",
      "english": "We've had enough of this bad weather.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0547",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "たくさん",
      "meaning": "many"
    },
    "sentence": {
      "japanese": "分からない言葉がたくさんある。",
      "kana": "わからないことばがたくさんある。",
      "english": "There are many words that I don't understand.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0548",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "ドア",
      "meaning": "Western style door"
    },
    "sentence": {
      "japanese": "若い男の人がドアの前で歌っています。",
      "kana": "わかいおとこのにんがどあのまえでうたっています。",
      "english": "A young man is singing in front of the door.",
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
