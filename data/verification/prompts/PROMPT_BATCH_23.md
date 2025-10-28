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

**Batch Number**: 23
**Total Batches**: 38
**Examples in This Batch**: 50

---

### Examples:

[
  {
    "card_id": "n5_vocab_0383",
    "example_index": 2,
    "target_vocab": {
      "kanji": "明日",
      "kana": "あした",
      "meaning": "tomorrow"
    },
    "sentence": {
      "japanese": "ではまた明日。",
      "kana": "ではまたあした。",
      "english": "See you again tomorrow.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0383",
    "example_index": 3,
    "target_vocab": {
      "kanji": "明日",
      "kana": "あした",
      "meaning": "tomorrow"
    },
    "sentence": {
      "japanese": "はい、あしたは休みます。",
      "kana": "はい、あしたはやすみます。",
      "english": "Yeah, I'm going to take tomorrow off.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0383",
    "example_index": 4,
    "target_vocab": {
      "kanji": "明日",
      "kana": "あした",
      "meaning": "tomorrow"
    },
    "sentence": {
      "japanese": "彼はあした来るかな。",
      "kana": "かれはあしたくるかな。",
      "english": "I wonder if he'll come tomorrow.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0383",
    "example_index": 5,
    "target_vocab": {
      "kanji": "明日",
      "kana": "あした",
      "meaning": "tomorrow"
    },
    "sentence": {
      "japanese": "またあしたね。",
      "kana": "またあしたね。",
      "english": "See you tomorrow!",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0384",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "ホテル",
      "meaning": "hotel"
    },
    "sentence": {
      "japanese": "彼女は今ホテルにいる。",
      "kana": "かのじょはいまほてるにいる。",
      "english": "She is in her hotel now.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0384",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "ホテル",
      "meaning": "hotel"
    },
    "sentence": {
      "japanese": "彼女はホテルに夜遅く着いた。",
      "kana": "かのじょはほてるによるおそくついた。",
      "english": "She got to the hotel late at night.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0384",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "ホテル",
      "meaning": "hotel"
    },
    "sentence": {
      "japanese": "彼らはホテルに着いた。",
      "kana": "かれらはほてるについた。",
      "english": "They arrived at the hotel.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0385",
    "example_index": 0,
    "target_vocab": {
      "kanji": "降りる",
      "kana": "おりる",
      "meaning": "to get off"
    },
    "sentence": {
      "japanese": "彼はその駅で降りるように言われた。",
      "kana": "かれはそのえきでおりるようにいわれた。",
      "english": "He was told to get off at the station.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0385",
    "example_index": 1,
    "target_vocab": {
      "kanji": "降りる",
      "kana": "おりる",
      "meaning": "to get off"
    },
    "sentence": {
      "japanese": "次が君の降りる駅です。",
      "kana": "つがくんのおりるえきです。",
      "english": "The next station is where you get off.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0385",
    "example_index": 2,
    "target_vocab": {
      "kanji": "降りる",
      "kana": "おりる",
      "meaning": "to get off"
    },
    "sentence": {
      "japanese": "バスが止まるまで降りるな。",
      "kana": "ばすがとまるまでおりるな。",
      "english": "Don't get off the bus till it stops.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0386",
    "example_index": 0,
    "target_vocab": {
      "kanji": "重い",
      "kana": "おもい",
      "meaning": "heavy"
    },
    "sentence": {
      "japanese": "彼は口が重い。",
      "kana": "かれはくちがおもい。",
      "english": "He is a man of few words.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0386",
    "example_index": 1,
    "target_vocab": {
      "kanji": "重い",
      "kana": "おもい",
      "meaning": "heavy"
    },
    "sentence": {
      "japanese": "疲れて足が重かった。",
      "kana": "つかれてあしがおもかった。",
      "english": "My legs were leaden from fatigue.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0386",
    "example_index": 2,
    "target_vocab": {
      "kanji": "重い",
      "kana": "おもい",
      "meaning": "heavy"
    },
    "sentence": {
      "japanese": "彼の所に行くのは足が重い。",
      "kana": "かのところにいくのはあしがおもい。",
      "english": "I'm reluctant to visit him.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0386",
    "example_index": 3,
    "target_vocab": {
      "kanji": "重い",
      "kana": "おもい",
      "meaning": "heavy"
    },
    "sentence": {
      "japanese": "彼は私たちのパーティーに来るとおもいます。",
      "kana": "かれはわたしたちのぱーてぃーにくるとおもいます。",
      "english": "I think he will come to our party.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0386",
    "example_index": 4,
    "target_vocab": {
      "kanji": "重い",
      "kana": "おもい",
      "meaning": "heavy"
    },
    "sentence": {
      "japanese": "このテーブルはおもいです。",
      "kana": "このてーぶるはおもいです。",
      "english": "This table is heavy.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0387",
    "example_index": 0,
    "target_vocab": {
      "kanji": "電車",
      "kana": "でんしゃ",
      "meaning": "electric train"
    },
    "sentence": {
      "japanese": "ほら、あなたの乗る電車が来たわ。",
      "kana": "ほら、あなたののるでんしゃがきたわ。",
      "english": "Look, here comes your train.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0387",
    "example_index": 1,
    "target_vocab": {
      "kanji": "電車",
      "kana": "でんしゃ",
      "meaning": "electric train"
    },
    "sentence": {
      "japanese": "電車はバスより頻繁に来ます。",
      "kana": "でんしゃはばすよりひんぱんにきます。",
      "english": "Trains come more often than buses.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0387",
    "example_index": 2,
    "target_vocab": {
      "kanji": "電車",
      "kana": "でんしゃ",
      "meaning": "electric train"
    },
    "sentence": {
      "japanese": "電車が停まるまで開けないで。",
      "kana": "でんしゃがとまるまでひらけないで。",
      "english": "Don't open before the train stops.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0388",
    "example_index": 0,
    "target_vocab": {
      "kanji": "痛い",
      "kana": "いたい",
      "meaning": "painful"
    },
    "sentence": {
      "japanese": "目が痛いです。",
      "kana": "めがいたいです。",
      "english": "My eyes are sore.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0388",
    "example_index": 1,
    "target_vocab": {
      "kanji": "痛い",
      "kana": "いたい",
      "meaning": "painful"
    },
    "sentence": {
      "japanese": "目が痛い。",
      "kana": "めがいたい。",
      "english": "My eyes hurt.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0388",
    "example_index": 2,
    "target_vocab": {
      "kanji": "痛い",
      "kana": "いたい",
      "meaning": "painful"
    },
    "sentence": {
      "japanese": "風邪で頭が痛い。",
      "kana": "かぜであたまがいたい。",
      "english": "My head aches with a cold.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0388",
    "example_index": 3,
    "target_vocab": {
      "kanji": "痛い",
      "kana": "いたい",
      "meaning": "painful"
    },
    "sentence": {
      "japanese": "家にいたいな。",
      "kana": "いえにいたいな。",
      "english": "I would rather stay at home.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0388",
    "example_index": 4,
    "target_vocab": {
      "kanji": "痛い",
      "kana": "いたい",
      "meaning": "painful"
    },
    "sentence": {
      "japanese": "どちらかと言えば、私は家にいたいな。",
      "kana": "どちらかといえば、わたしはいえにいたいな。",
      "english": "I would rather stay at home.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0388",
    "example_index": 5,
    "target_vocab": {
      "kanji": "痛い",
      "kana": "いたい",
      "meaning": "painful"
    },
    "sentence": {
      "japanese": "一緒にいたいな。",
      "kana": "いっしょにいたいな。",
      "english": "I want to be with you.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0389",
    "example_index": 0,
    "target_vocab": {
      "kanji": "話す",
      "kana": "はなす",
      "meaning": "to speak"
    },
    "sentence": {
      "japanese": "彼の話し方が嫌なの。",
      "kana": "かのはなしかたがいやなの。",
      "english": "I don't like his way of talking.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0389",
    "example_index": 1,
    "target_vocab": {
      "kanji": "話す",
      "kana": "はなす",
      "meaning": "to speak"
    },
    "sentence": {
      "japanese": "私は誰と話しているの？",
      "kana": "わたしはだれとはなしているの？",
      "english": "Who am I talking with?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0389",
    "example_index": 2,
    "target_vocab": {
      "kanji": "話す",
      "kana": "はなす",
      "meaning": "to speak"
    },
    "sentence": {
      "japanese": "何を話しているの？",
      "kana": "なにをはなしているの？",
      "english": "What are you talking about?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0390",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "りっぱ",
      "meaning": "splendid"
    },
    "sentence": {
      "japanese": "私の家の近くにりっぱな公園がある。",
      "kana": "わたしのいえのちかくにりっぱなこうえんがある。",
      "english": "There is a fine park near my house.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0392",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "よく",
      "meaning": "often"
    },
    "sentence": {
      "japanese": "あなたは夜よく寝れませんか。",
      "kana": "あなたはよるよくねれませんか。",
      "english": "Don't you sleep well at night?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0392",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "よく",
      "meaning": "often"
    },
    "sentence": {
      "japanese": "僕はあの人達をよく知っています。",
      "kana": "ぼくはあのひとたちをよくしっています。",
      "english": "I've got acquainted with them.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0392",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "よく",
      "meaning": "often"
    },
    "sentence": {
      "japanese": "彼女はよく働く。",
      "kana": "かのじょはよくはたらく。",
      "english": "She works hard.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0393",
    "example_index": 0,
    "target_vocab": {
      "kanji": "嫌",
      "kana": "いや",
      "meaning": "unpleasant"
    },
    "sentence": {
      "japanese": "彼の話し方が嫌なの。",
      "kana": "かのはなしかたがいやなの。",
      "english": "I don't like his way of talking.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0393",
    "example_index": 1,
    "target_vocab": {
      "kanji": "嫌",
      "kana": "いや",
      "meaning": "unpleasant"
    },
    "sentence": {
      "japanese": "僕が「嫌だ」と言ったらどうする。",
      "kana": "ぼくが「いやだ」といったらどうする。",
      "english": "What if I say \"no\"?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0393",
    "example_index": 2,
    "target_vocab": {
      "kanji": "嫌",
      "kana": "いや",
      "meaning": "unpleasant"
    },
    "sentence": {
      "japanese": "彼女は名前を言うのを嫌がった。",
      "kana": "かのじょはなまえをいうのをいやがった。",
      "english": "She was unwilling to tell her name.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0393",
    "example_index": 3,
    "target_vocab": {
      "kanji": "嫌",
      "kana": "いや",
      "meaning": "unpleasant"
    },
    "sentence": {
      "japanese": "今日はいやに暑い。",
      "kana": "こんにちはいやにあつい。",
      "english": "It's awfully hot today.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0393",
    "example_index": 4,
    "target_vocab": {
      "kanji": "嫌",
      "kana": "いや",
      "meaning": "unpleasant"
    },
    "sentence": {
      "japanese": "一人はいやだ。",
      "kana": "ひとりはいやだ。",
      "english": "I dislike being alone.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0393",
    "example_index": 5,
    "target_vocab": {
      "kanji": "嫌",
      "kana": "いや",
      "meaning": "unpleasant"
    },
    "sentence": {
      "japanese": "一人で行くのはいやです。",
      "kana": "ひとりでいくのはいやです。",
      "english": "I don't want to go alone.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0394",
    "example_index": 0,
    "target_vocab": {
      "kanji": "宿題",
      "kana": "しゅくだい",
      "meaning": "homework"
    },
    "sentence": {
      "japanese": "彼は今宿題で忙しい。",
      "kana": "かれはいまじゅくだいでいそがしい。",
      "english": "He's busy with his homework now.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0394",
    "example_index": 1,
    "target_vocab": {
      "kanji": "宿題",
      "kana": "しゅくだい",
      "meaning": "homework"
    },
    "sentence": {
      "japanese": "先生は私たちに宿題を出した。",
      "kana": "せんせいはわたしたちにしゅくだいをだした。",
      "english": "The teacher gave us homework.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0394",
    "example_index": 2,
    "target_vocab": {
      "kanji": "宿題",
      "kana": "しゅくだい",
      "meaning": "homework"
    },
    "sentence": {
      "japanese": "先生は私たちにたくさんの宿題を出した。",
      "kana": "せんせいはわたしたちにたくさんのしゅくだいをだした。",
      "english": "The teacher gave us a lot of homework.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0395",
    "example_index": 0,
    "target_vocab": {
      "kanji": "死ぬ",
      "kana": "しぬ",
      "meaning": "to die"
    },
    "sentence": {
      "japanese": "てめぇら、死にやがれ！",
      "kana": "てめぇら、しにやがれ！",
      "english": "Fuck you all to hell!",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0395",
    "example_index": 1,
    "target_vocab": {
      "kanji": "死ぬ",
      "kana": "しぬ",
      "meaning": "to die"
    },
    "sentence": {
      "japanese": "物言わぬ友達は今朝死んだ。",
      "kana": "ものいわぬともだちはけさしんだ。",
      "english": "My poor dumb friend died this morning.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0395",
    "example_index": 2,
    "target_vocab": {
      "kanji": "死ぬ",
      "kana": "しぬ",
      "meaning": "to die"
    },
    "sentence": {
      "japanese": "彼女は私がそこに着く前に死んだ。",
      "kana": "かのじょはわたしがそこにつくまえにしんだ。",
      "english": "She died before I arrived there.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0396",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "みんな",
      "meaning": "everyone"
    },
    "sentence": {
      "japanese": "みんなあなたに会いたがってる。あなたは有名なのよ！",
      "kana": "みんなあなたにあいたがってる。あなたはゆうめいなのよ！",
      "english": "Everyone wants to meet you. You're famous!",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0396",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "みんな",
      "meaning": "everyone"
    },
    "sentence": {
      "japanese": "それらはみんな同じかい？",
      "kana": "それらはみんなおなじかい？",
      "english": "Are they all the same?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0396",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "みんな",
      "meaning": "everyone"
    },
    "sentence": {
      "japanese": "立っているのは、みんな男だった。",
      "kana": "たっているのは、みんなおとこだった。",
      "english": "Those standing were all men.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0397",
    "example_index": 0,
    "target_vocab": {
      "kanji": "万",
      "kana": "まん",
      "meaning": "ten thousand"
    },
    "sentence": {
      "japanese": "万年筆を持っていますか。",
      "kana": "まんねんひつをもっていますか。",
      "english": "Do you have a fountain pen with you?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0397",
    "example_index": 1,
    "target_vocab": {
      "kanji": "万",
      "kana": "まん",
      "meaning": "ten thousand"
    },
    "sentence": {
      "japanese": "新しい万年筆買ったんだ。",
      "kana": "あたらしいまんねんひつかったんだ。",
      "english": "I bought a new fountain pen.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0397",
    "example_index": 2,
    "target_vocab": {
      "kanji": "万",
      "kana": "まん",
      "meaning": "ten thousand"
    },
    "sentence": {
      "japanese": "万年筆って持ってる？",
      "kana": "まんねんひつってもってる？",
      "english": "Do you have a fountain pen?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0398",
    "example_index": 0,
    "target_vocab": {
      "kanji": "映画",
      "kana": "えいが",
      "meaning": "movie"
    },
    "sentence": {
      "japanese": "明日の夜、映画に行かない？",
      "kana": "あしたのよる、えいがにいかない？",
      "english": "Wanna go to a movie tomorrow night?",
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
