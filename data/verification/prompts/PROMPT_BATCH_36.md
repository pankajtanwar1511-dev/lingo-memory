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

**Batch Number**: 36
**Total Batches**: 38
**Examples in This Batch**: 50

---

### Examples:

[
  {
    "card_id": "n5_vocab_0622",
    "example_index": 5,
    "target_vocab": {
      "kanji": "二人",
      "kana": "ふたり",
      "meaning": "two people"
    },
    "sentence": {
      "japanese": "私たちは子どもがふたりいます。",
      "kana": "わたしたちはこどもがふたりいます。",
      "english": "We have two children.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0623",
    "example_index": 0,
    "target_vocab": {
      "kanji": "起きる",
      "kana": "おきる",
      "meaning": "to get up"
    },
    "sentence": {
      "japanese": "何が起きたの？",
      "kana": "なにがおきたの？",
      "english": "What happened?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0623",
    "example_index": 1,
    "target_vocab": {
      "kanji": "起きる",
      "kana": "おきる",
      "meaning": "to get up"
    },
    "sentence": {
      "japanese": "問題でも起きたのか。",
      "kana": "もんだいでもおきたのか。",
      "english": "Is something wrong?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0623",
    "example_index": 2,
    "target_vocab": {
      "kanji": "起きる",
      "kana": "おきる",
      "meaning": "to get up"
    },
    "sentence": {
      "japanese": "明日何が起きるのかは誰にもわからない。",
      "kana": "あしたなにがおきるのかはだれにもわからない。",
      "english": "There is no telling what will happen tomorrow.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0624",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "さあ",
      "meaning": "well…"
    },
    "sentence": {
      "japanese": "さあ話したまえ。",
      "kana": "さあはなしたまえ。",
      "english": "Now tell me.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0624",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "さあ",
      "meaning": "well…"
    },
    "sentence": {
      "japanese": "さあ着いたぞ。",
      "kana": "さあついたぞ。",
      "english": "Here we are!",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0624",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "さあ",
      "meaning": "well…"
    },
    "sentence": {
      "japanese": "さあ早く答えないか！",
      "kana": "さあはやくこたえないか！",
      "english": "Come on, answer quickly.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0625",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "あそこ",
      "meaning": "over there"
    },
    "sentence": {
      "japanese": "あそこに立ってる女の人はだれですか。",
      "kana": "あそこにたってるおんなのひとはだれですか。",
      "english": "Who is the woman standing there?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0625",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "あそこ",
      "meaning": "over there"
    },
    "sentence": {
      "japanese": "彼はあそこの家に住んでいる。",
      "kana": "かれはあそこのいえにすんでいる。",
      "english": "He lives in that house over there.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0625",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "あそこ",
      "meaning": "over there"
    },
    "sentence": {
      "japanese": "彼はあそこで遊んでいます。",
      "kana": "かれはあそこであそんでいます。",
      "english": "He is playing over there.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0626",
    "example_index": 0,
    "target_vocab": {
      "kanji": "古い",
      "kana": "ふるい",
      "meaning": "old (not used for people)"
    },
    "sentence": {
      "japanese": "どんなに高くても、あの古い時計を買います。",
      "kana": "どんなにたかくても、あのふるいとけいをかいます。",
      "english": "I'll buy that old clock, however expensive it is.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0626",
    "example_index": 1,
    "target_vocab": {
      "kanji": "古い",
      "kana": "ふるい",
      "meaning": "old (not used for people)"
    },
    "sentence": {
      "japanese": "その古い置き時計はまだ使われている。",
      "kana": "そのふるいおきどけいはまだつかわれている。",
      "english": "The old clock is still in use.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0626",
    "example_index": 2,
    "target_vocab": {
      "kanji": "古い",
      "kana": "ふるい",
      "meaning": "old (not used for people)"
    },
    "sentence": {
      "japanese": "彼は新しい車と古い車を持っています。",
      "kana": "かれはあたらしいくるまとふるいくるまをもっています。",
      "english": "He has a new car and an old car.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0626",
    "example_index": 3,
    "target_vocab": {
      "kanji": "古い",
      "kana": "ふるい",
      "meaning": "old (not used for people)"
    },
    "sentence": {
      "japanese": "そのふるい橋をわたるのは危ない。",
      "kana": "そのふるいはしをわたるのはあぶない。",
      "english": "It is dangerous to cross that old bridge.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0627",
    "example_index": 0,
    "target_vocab": {
      "kanji": "黄色い",
      "kana": "きいろい",
      "meaning": "yellow"
    },
    "sentence": {
      "japanese": "彼は黄色いあの家に住んでいる。",
      "kana": "かれはきいろいあのいえにすんでいる。",
      "english": "He lives in that yellow house.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0627",
    "example_index": 1,
    "target_vocab": {
      "kanji": "黄色い",
      "kana": "きいろい",
      "meaning": "yellow"
    },
    "sentence": {
      "japanese": "私は花をたくさん持っている。赤いものもあれば黄色いのもある。",
      "kana": "わたしははなをたくさんもっている。あかいものもあればきいろいのもある。",
      "english": "I have a lot of flowers. Some are red and others are yellow.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0627",
    "example_index": 2,
    "target_vocab": {
      "kanji": "黄色い",
      "kana": "きいろい",
      "meaning": "yellow"
    },
    "sentence": {
      "japanese": "花は黄色い。",
      "kana": "はなはきいろい。",
      "english": "Flowers are yellow.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0628",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "まだ",
      "meaning": "yet"
    },
    "sentence": {
      "japanese": "あの仕事の口はまだあるよ。",
      "kana": "あのしごとのくちはまだあるよ。",
      "english": "The job offer still stands.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0628",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "まだ",
      "meaning": "yet"
    },
    "sentence": {
      "japanese": "彼はまだ元気盛んだ。",
      "kana": "かれはまだげんきさかんだ。",
      "english": "He is still full of energy.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0628",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "まだ",
      "meaning": "yet"
    },
    "sentence": {
      "japanese": "お前はまだ「青い」な。",
      "kana": "おまえはまだ「あおい」な。",
      "english": "You're still green.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0629",
    "example_index": 0,
    "target_vocab": {
      "kanji": "歌う",
      "kana": "うたう",
      "meaning": "to sing"
    },
    "sentence": {
      "japanese": "はい。これならそらで歌えます。",
      "kana": "はい。これならそらでうたえます。",
      "english": "Yes. This one I can sing from memory.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0629",
    "example_index": 1,
    "target_vocab": {
      "kanji": "歌う",
      "kana": "うたう",
      "meaning": "to sing"
    },
    "sentence": {
      "japanese": "若い男の人がドアの前で歌っています。",
      "kana": "わかいおとこのにんがどあのまえでうたっています。",
      "english": "A young man is singing in front of the door.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0629",
    "example_index": 2,
    "target_vocab": {
      "kanji": "歌う",
      "kana": "うたう",
      "meaning": "to sing"
    },
    "sentence": {
      "japanese": "彼女は彼より上手に歌った。",
      "kana": "かのじょはかれよりじょうずにうたった。",
      "english": "She sang better than he.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0630",
    "example_index": 0,
    "target_vocab": {
      "kanji": "飴",
      "kana": "あめ",
      "meaning": "candy"
    },
    "sentence": {
      "japanese": "飴がほしい。",
      "kana": "あめがほしい。",
      "english": "I want a piece of candy.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0630",
    "example_index": 1,
    "target_vocab": {
      "kanji": "飴",
      "kana": "あめ",
      "meaning": "candy"
    },
    "sentence": {
      "japanese": "これ、誰の飴？",
      "kana": "これ、だれのあめ？",
      "english": "Whose candy is this?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0630",
    "example_index": 2,
    "target_vocab": {
      "kanji": "飴",
      "kana": "あめ",
      "meaning": "candy"
    },
    "sentence": {
      "japanese": "飴は歯に悪い。",
      "kana": "あめははにわるい。",
      "english": "Candy is bad for your teeth.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0631",
    "example_index": 0,
    "target_vocab": {
      "kanji": "寝る",
      "kana": "ねる",
      "meaning": "to go to bed"
    },
    "sentence": {
      "japanese": "寝る前に電気を消してください。",
      "kana": "ねるまえにでんきをけしてください。",
      "english": "Turn off the light before you go to bed.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0631",
    "example_index": 1,
    "target_vocab": {
      "kanji": "寝る",
      "kana": "ねる",
      "meaning": "to go to bed"
    },
    "sentence": {
      "japanese": "あなたは夜よく寝れませんか。",
      "kana": "あなたはよるよくねれませんか。",
      "english": "Don't you sleep well at night?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0631",
    "example_index": 2,
    "target_vocab": {
      "kanji": "寝る",
      "kana": "ねる",
      "meaning": "to go to bed"
    },
    "sentence": {
      "japanese": "夜は早く寝ます。",
      "kana": "よるははやくねます。",
      "english": "I go to bed early at night.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0631",
    "example_index": 3,
    "target_vocab": {
      "kanji": "寝る",
      "kana": "ねる",
      "meaning": "to go to bed"
    },
    "sentence": {
      "japanese": "昨夜早めにねるべきだった。",
      "kana": "さくやはやめにねるべきだった。",
      "english": "I should have gone to bed earlier last night.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0632",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "それ",
      "meaning": "that"
    },
    "sentence": {
      "japanese": "それじゃまた明日。",
      "kana": "それじゃまたあした。",
      "english": "See you tomorrow.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0632",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "それ",
      "meaning": "that"
    },
    "sentence": {
      "japanese": "それを言われると弱いなあ。",
      "kana": "それをいわれるとよわいなあ。",
      "english": "That sure puts me on the spot.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0632",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "それ",
      "meaning": "that"
    },
    "sentence": {
      "japanese": "それから先の話を聞きたい。",
      "kana": "それからさきのはなしをききたい。",
      "english": "I'd like to know the rest of the story.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0633",
    "example_index": 0,
    "target_vocab": {
      "kanji": "質問",
      "kana": "しつもん",
      "meaning": "question"
    },
    "sentence": {
      "japanese": "私は質問に答えたでしょうか。",
      "kana": "わたしはしつもんにこたえたでしょうか。",
      "english": "Have I answered your question?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0633",
    "example_index": 1,
    "target_vocab": {
      "kanji": "質問",
      "kana": "しつもん",
      "meaning": "question"
    },
    "sentence": {
      "japanese": "僕がこの質問に答えるのは不可能だった。",
      "kana": "ぼくがこのしつもんにこたえるのはふかのうだった。",
      "english": "It was impossible for me to answer this question.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0633",
    "example_index": 2,
    "target_vocab": {
      "kanji": "質問",
      "kana": "しつもん",
      "meaning": "question"
    },
    "sentence": {
      "japanese": "彼女はその質問に答えるのが難しいとわかった。",
      "kana": "かのじょはそのしつもんにこたえるのがむずかしいとわかった。",
      "english": "She found it difficult to answer the question.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0634",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "どなた",
      "meaning": "who"
    },
    "sentence": {
      "japanese": "向こうにおられる方はどなたかしら。",
      "kana": "むこうにおられるかたはどなたかしら。",
      "english": "I wonder who the man over there may be.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0634",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "どなた",
      "meaning": "who"
    },
    "sentence": {
      "japanese": "あなたが話していた人はどなたですか。",
      "kana": "あなたがはなしていたにんはどなたですか。",
      "english": "Who is the man that you were talking with?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0634",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "どなた",
      "meaning": "who"
    },
    "sentence": {
      "japanese": "机の上の本はどなたのですか。",
      "kana": "つくえのうえのほんはどなたのですか。",
      "english": "Whose book is on the desk?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0635",
    "example_index": 0,
    "target_vocab": {
      "kanji": "牛乳",
      "kana": "ぎゅうにゅう",
      "meaning": "milk"
    },
    "sentence": {
      "japanese": "私は牛乳が飲みたいな。",
      "kana": "わたしはぎゅうにゅうがのみたいな。",
      "english": "I want to drink milk.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0635",
    "example_index": 1,
    "target_vocab": {
      "kanji": "牛乳",
      "kana": "ぎゅうにゅう",
      "meaning": "milk"
    },
    "sentence": {
      "japanese": "私たちは牛乳でバターを作ります。",
      "kana": "わたしたちはぎゅうにゅうでばたーをつくります。",
      "english": "We make milk into butter.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0635",
    "example_index": 2,
    "target_vocab": {
      "kanji": "牛乳",
      "kana": "ぎゅうにゅう",
      "meaning": "milk"
    },
    "sentence": {
      "japanese": "子供は毎日牛乳を飲むべきだ。",
      "kana": "こどもはまいにちぎゅうにゅうをのむべきだ。",
      "english": "Children should drink milk every day.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0636",
    "example_index": 0,
    "target_vocab": {
      "kanji": "二",
      "kana": "に",
      "meaning": "two"
    },
    "sentence": {
      "japanese": "彼は二枚目だ。",
      "kana": "かれはにまいめだ。",
      "english": "He is a handsome man.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0636",
    "example_index": 1,
    "target_vocab": {
      "kanji": "二",
      "kana": "に",
      "meaning": "two"
    },
    "sentence": {
      "japanese": "彼女は靴下を二足買った。",
      "kana": "かのじょはくつしたをにそくかった。",
      "english": "She bought two pairs of socks.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0636",
    "example_index": 2,
    "target_vocab": {
      "kanji": "二",
      "kana": "に",
      "meaning": "two"
    },
    "sentence": {
      "japanese": "彼女には子供が十二人もいる。",
      "kana": "かのじょにはこどもがじゅうににんもいる。",
      "english": "She has no less than twelve children.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0636",
    "example_index": 3,
    "target_vocab": {
      "kanji": "二",
      "kana": "に",
      "meaning": "two"
    },
    "sentence": {
      "japanese": "あからさまに言えば彼は嫌いだ。",
      "kana": "あからさまにいえばかれはきらいだ。",
      "english": "Frankly, I don't like him.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0636",
    "example_index": 4,
    "target_vocab": {
      "kanji": "二",
      "kana": "に",
      "meaning": "two"
    },
    "sentence": {
      "japanese": "あなたはシャツをあべこべに着ている。",
      "kana": "あなたはしゃつをあべこべにきている。",
      "english": "You are wearing your shirt inside out.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0636",
    "example_index": 5,
    "target_vocab": {
      "kanji": "二",
      "kana": "に",
      "meaning": "two"
    },
    "sentence": {
      "japanese": "お先にどうぞ。",
      "kana": "おさきにどうぞ。",
      "english": "After you.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0637",
    "example_index": 0,
    "target_vocab": {
      "kanji": "紅茶",
      "kana": "こうちゃ",
      "meaning": "black tea"
    },
    "sentence": {
      "japanese": "紅茶またはコーヒーはいかが？",
      "kana": "こうちゃまたはこーひーはいかが？",
      "english": "Would you like some tea or coffee?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0637",
    "example_index": 1,
    "target_vocab": {
      "kanji": "紅茶",
      "kana": "こうちゃ",
      "meaning": "black tea"
    },
    "sentence": {
      "japanese": "僕はコーヒーより紅茶が好きだ。",
      "kana": "ぼくはこーひーよりこうちゃがすきだ。",
      "english": "I prefer tea to coffee.",
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
