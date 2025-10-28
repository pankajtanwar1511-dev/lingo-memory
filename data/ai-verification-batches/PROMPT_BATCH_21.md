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

**Batch Number**: 21
**Total Batches**: 38
**Examples in This Batch**: 50

---

### Examples:

[
  {
    "card_id": "n5_vocab_0351",
    "example_index": 0,
    "target_vocab": {
      "kanji": "帽子",
      "kana": "ぼうし",
      "meaning": "hat"
    },
    "sentence": {
      "japanese": "帽子をとってください。",
      "kana": "ぼうしをとってください。",
      "english": "Please take off your hat.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0351",
    "example_index": 1,
    "target_vocab": {
      "kanji": "帽子",
      "kana": "ぼうし",
      "meaning": "hat"
    },
    "sentence": {
      "japanese": "彼女は新しい帽子を欲しがっている。",
      "kana": "かのじょはあたらしいぼうしをほっしがっている。",
      "english": "She wants a new hat.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0351",
    "example_index": 2,
    "target_vocab": {
      "kanji": "帽子",
      "kana": "ぼうし",
      "meaning": "hat"
    },
    "sentence": {
      "japanese": "彼女は私たちにきれいな帽子を見せた。",
      "kana": "かのじょはわたしたちにきれいなぼうしをみせた。",
      "english": "She showed us a beautiful hat.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0351",
    "example_index": 3,
    "target_vocab": {
      "kanji": "帽子",
      "kana": "ぼうし",
      "meaning": "hat"
    },
    "sentence": {
      "japanese": "この部屋ではぼうしを取ってください。",
      "kana": "このへやではぼうしをとってください。",
      "english": "Please take off your hat here in this room.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0352",
    "example_index": 0,
    "target_vocab": {
      "kanji": "丈夫",
      "kana": "じょうぶ",
      "meaning": "strong"
    },
    "sentence": {
      "japanese": "私は前と同じようにじょうぶです。",
      "kana": "わたしはまえとおなじようにじょうぶです。",
      "english": "I'm as strong as before.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0352",
    "example_index": 1,
    "target_vocab": {
      "kanji": "丈夫",
      "kana": "じょうぶ",
      "meaning": "strong"
    },
    "sentence": {
      "japanese": "この橋はじょうぶそうだ。",
      "kana": "このはしはじょうぶそうだ。",
      "english": "This bridge looks secure.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0352",
    "example_index": 2,
    "target_vocab": {
      "kanji": "丈夫",
      "kana": "じょうぶ",
      "meaning": "strong"
    },
    "sentence": {
      "japanese": "彼はとても丈夫だ。",
      "kana": "かれはとてもじょうぶだ。",
      "english": "He is strong as a horse.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0352",
    "example_index": 3,
    "target_vocab": {
      "kanji": "丈夫",
      "kana": "じょうぶ",
      "meaning": "strong"
    },
    "sentence": {
      "japanese": "私は前と同じようにじょうぶです。",
      "kana": "わたしはまえとおなじようにじょうぶです。",
      "english": "I'm as strong as before.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0352",
    "example_index": 4,
    "target_vocab": {
      "kanji": "丈夫",
      "kana": "じょうぶ",
      "meaning": "strong"
    },
    "sentence": {
      "japanese": "この橋はじょうぶそうだ。",
      "kana": "このはしはじょうぶそうだ。",
      "english": "This bridge looks secure.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0353",
    "example_index": 0,
    "target_vocab": {
      "kanji": "入れる",
      "kana": "いれる",
      "meaning": "to put in"
    },
    "sentence": {
      "japanese": "何か飲み物をいれましょうか。",
      "kana": "なにかのみものをいれましょうか。",
      "english": "Can I get you something to drink?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0353",
    "example_index": 1,
    "target_vocab": {
      "kanji": "入れる",
      "kana": "いれる",
      "meaning": "to put in"
    },
    "sentence": {
      "japanese": "僕は君の欲しいものはなんでも手に入れた。",
      "kana": "ぼくはくんのほしいものはなんでもてにいれた。",
      "english": "I've got everything that you want.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0353",
    "example_index": 2,
    "target_vocab": {
      "kanji": "入れる",
      "kana": "いれる",
      "meaning": "to put in"
    },
    "sentence": {
      "japanese": "彼女は今台所でコーヒーをいれています。",
      "kana": "かのじょはいまだいどころでこーひーをいれています。",
      "english": "She is now making coffee in the kitchen.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0356",
    "example_index": 0,
    "target_vocab": {
      "kanji": "遠い",
      "kana": "とおい",
      "meaning": "far"
    },
    "sentence": {
      "japanese": "私も遠からずおとなになるだろう。",
      "kana": "わたしもとおからずおとなになるだろう。",
      "english": "I will also become a grown-up before long.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0356",
    "example_index": 1,
    "target_vocab": {
      "kanji": "遠い",
      "kana": "とおい",
      "meaning": "far"
    },
    "sentence": {
      "japanese": "ここから遠いの？",
      "kana": "ここからとおいの？",
      "english": "Is it far from here?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0356",
    "example_index": 2,
    "target_vocab": {
      "kanji": "遠い",
      "kana": "とおい",
      "meaning": "far"
    },
    "sentence": {
      "japanese": "歩くと遠いですか。",
      "kana": "あるくととおいですか。",
      "english": "Is it too far to walk?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0357",
    "example_index": 0,
    "target_vocab": {
      "kanji": "夏休み",
      "kana": "なつやすみ",
      "meaning": "summer holiday"
    },
    "sentence": {
      "japanese": "夏休みにどこかへ行きましたか。",
      "kana": "なつやすみにどこかへいきましたか。",
      "english": "Did you go anywhere during the summer vacation?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0357",
    "example_index": 1,
    "target_vocab": {
      "kanji": "夏休み",
      "kana": "なつやすみ",
      "meaning": "summer holiday"
    },
    "sentence": {
      "japanese": "この夏休みはどこかへ行くのですか。",
      "kana": "このなつやすみはどこかへいくのですか。",
      "english": "Are you going away this summer?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0357",
    "example_index": 2,
    "target_vocab": {
      "kanji": "夏休み",
      "kana": "なつやすみ",
      "meaning": "summer holiday"
    },
    "sentence": {
      "japanese": "彼女は夏休みを待ちかねている。",
      "kana": "かのじょはなつやすみをまちかねている。",
      "english": "She can hardly wait for the summer vacation.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0358",
    "example_index": 0,
    "target_vocab": {
      "kanji": "友達",
      "kana": "ともだち",
      "meaning": "friend"
    },
    "sentence": {
      "japanese": "友達はたくさんいますか。",
      "kana": "ともだちはたくさんいますか。",
      "english": "Do you have many friends?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0358",
    "example_index": 1,
    "target_vocab": {
      "kanji": "友達",
      "kana": "ともだち",
      "meaning": "friend"
    },
    "sentence": {
      "japanese": "友達と買い物に行った。",
      "kana": "ともだちとかいものにいった。",
      "english": "I went shopping with a friend.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0358",
    "example_index": 2,
    "target_vocab": {
      "kanji": "友達",
      "kana": "ともだち",
      "meaning": "friend"
    },
    "sentence": {
      "japanese": "友達が明日家に遊びに来る。",
      "kana": "ともだちがあしたいえにあそびにくる。",
      "english": "A friend comes to play at our house tomorrow.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0359",
    "example_index": 0,
    "target_vocab": {
      "kanji": "横",
      "kana": "よこ",
      "meaning": "beside"
    },
    "sentence": {
      "japanese": "さようなら、さよこ！",
      "kana": "さようなら、さよこ！",
      "english": "Bye, Sayoko!",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0359",
    "example_index": 1,
    "target_vocab": {
      "kanji": "横",
      "kana": "よこ",
      "meaning": "beside"
    },
    "sentence": {
      "japanese": "あちっ！ 熱いよこのコーヒー！",
      "kana": "あちっ！ あついよこのこーひー！",
      "english": "Ow! This coffee is hot!",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0359",
    "example_index": 2,
    "target_vocab": {
      "kanji": "横",
      "kana": "よこ",
      "meaning": "beside"
    },
    "sentence": {
      "japanese": "横に座って。",
      "kana": "よこにすわって。",
      "english": "Sit beside me.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0359",
    "example_index": 3,
    "target_vocab": {
      "kanji": "横",
      "kana": "よこ",
      "meaning": "beside"
    },
    "sentence": {
      "japanese": "さようなら、さよこ！",
      "kana": "さようなら、さよこ！",
      "english": "Bye, Sayoko!",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0359",
    "example_index": 4,
    "target_vocab": {
      "kanji": "横",
      "kana": "よこ",
      "meaning": "beside"
    },
    "sentence": {
      "japanese": "あちっ！ 熱いよこのコーヒー！",
      "kana": "あちっ！ あついよこのこーひー！",
      "english": "Ow! This coffee is hot!",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0360",
    "example_index": 0,
    "target_vocab": {
      "kanji": "冷たい",
      "kana": "つめたい",
      "meaning": "cold to the touch"
    },
    "sentence": {
      "japanese": "もう手が冷たくって。",
      "kana": "もうてがつめたくって。",
      "english": "My hand's getting too cold.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0360",
    "example_index": 1,
    "target_vocab": {
      "kanji": "冷たい",
      "kana": "つめたい",
      "meaning": "cold to the touch"
    },
    "sentence": {
      "japanese": "冷たい風は海から吹いている。",
      "kana": "つめたいかぜはうみからふいている。",
      "english": "The cold wind is blowing from the sea.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0360",
    "example_index": 2,
    "target_vocab": {
      "kanji": "冷たい",
      "kana": "つめたい",
      "meaning": "cold to the touch"
    },
    "sentence": {
      "japanese": "冷たいなあ。",
      "kana": "つめたいなあ。",
      "english": "That's a bit cold.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0361",
    "example_index": 0,
    "target_vocab": {
      "kanji": "夜",
      "kana": "よる",
      "meaning": "evening"
    },
    "sentence": {
      "japanese": "あなたは夜よく寝れませんか。",
      "kana": "あなたはよるよくねれませんか。",
      "english": "Don't you sleep well at night?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0361",
    "example_index": 1,
    "target_vocab": {
      "kanji": "夜",
      "kana": "よる",
      "meaning": "evening"
    },
    "sentence": {
      "japanese": "私はなぜか夜の方が元気だ。",
      "kana": "わたしはなぜかよるのほうがげんきだ。",
      "english": "For some reason I feel more alive at night.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0361",
    "example_index": 2,
    "target_vocab": {
      "kanji": "夜",
      "kana": "よる",
      "meaning": "evening"
    },
    "sentence": {
      "japanese": "夜は早く寝ます。",
      "kana": "よるははやくねます。",
      "english": "I go to bed early at night.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0361",
    "example_index": 3,
    "target_vocab": {
      "kanji": "夜",
      "kana": "よる",
      "meaning": "evening"
    },
    "sentence": {
      "japanese": "新聞によると彼は今日はここに来るらしい。",
      "kana": "しんぶんによるとかれはこんにちはここにくるらしい。",
      "english": "According to the newspaper, he will be here today.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0361",
    "example_index": 4,
    "target_vocab": {
      "kanji": "夜",
      "kana": "よる",
      "meaning": "evening"
    },
    "sentence": {
      "japanese": "新聞によると今日は雨が降ります。",
      "kana": "しんぶんによるとこんにちはあめがおります。",
      "english": "According to the newspaper, it will rain today.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0362",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "トイレ",
      "meaning": "toilet"
    },
    "sentence": {
      "japanese": "トイレの水が止まりません。",
      "kana": "といれのみずがどまりません。",
      "english": "The toilet won't stop running.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0362",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "トイレ",
      "meaning": "toilet"
    },
    "sentence": {
      "japanese": "トイレはどちらでしょうか。",
      "kana": "といれはどちらでしょうか。",
      "english": "Where's the restroom?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0362",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "トイレ",
      "meaning": "toilet"
    },
    "sentence": {
      "japanese": "トイレはどこにあるのでしょうか。",
      "kana": "といれはどこにあるのでしょうか。",
      "english": "Where is the bathroom?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0363",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "おなか",
      "meaning": "stomach"
    },
    "sentence": {
      "japanese": "おなかが痛い。",
      "kana": "おなかがいたい。",
      "english": "My stomach hurts.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0363",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "おなか",
      "meaning": "stomach"
    },
    "sentence": {
      "japanese": "おなかペコペコだ。",
      "kana": "おなかぺこぺこだ。",
      "english": "I am hungry.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0363",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "おなか",
      "meaning": "stomach"
    },
    "sentence": {
      "japanese": "おなかが痛いので、病院へ行きます。",
      "kana": "おなかがいたいので、びょういんへいきます。",
      "english": "I'm going to the hospital because my stomach hurts.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0364",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "どこ",
      "meaning": "where"
    },
    "sentence": {
      "japanese": "私の犬は、どこでも私の行くところへついてくる。",
      "kana": "わたしのいぬは、どこでもわたしのいくところへついてくる。",
      "english": "My dog follows me wherever I go.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0364",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "どこ",
      "meaning": "where"
    },
    "sentence": {
      "japanese": "夏休みにどこかへ行きましたか。",
      "kana": "なつやすみにどこかへいきましたか。",
      "english": "Did you go anywhere during the summer vacation?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0364",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "どこ",
      "meaning": "where"
    },
    "sentence": {
      "japanese": "この夏休みはどこかへ行くのですか。",
      "kana": "このなつやすみはどこかへいくのですか。",
      "english": "Are you going away this summer?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0365",
    "example_index": 0,
    "target_vocab": {
      "kanji": "暇",
      "kana": "ひま",
      "meaning": "free time"
    },
    "sentence": {
      "japanese": "今晩暇かな？",
      "kana": "こんばんひまかな？",
      "english": "Are you free tonight?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0365",
    "example_index": 1,
    "target_vocab": {
      "kanji": "暇",
      "kana": "ひま",
      "meaning": "free time"
    },
    "sentence": {
      "japanese": "明日の夕方はお暇ですか。",
      "kana": "あしたのゆうがたはおひまですか。",
      "english": "Are you free tomorrow evening?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0365",
    "example_index": 2,
    "target_vocab": {
      "kanji": "暇",
      "kana": "ひま",
      "meaning": "free time"
    },
    "sentence": {
      "japanese": "彼は明日暇でしょう。",
      "kana": "かれはあしたひまでしょう。",
      "english": "He will be free tomorrow.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0365",
    "example_index": 3,
    "target_vocab": {
      "kanji": "暇",
      "kana": "ひま",
      "meaning": "free time"
    },
    "sentence": {
      "japanese": "私は今日はひまです。",
      "kana": "わたしはこんにちはひまです。",
      "english": "I'm free today.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0365",
    "example_index": 4,
    "target_vocab": {
      "kanji": "暇",
      "kana": "ひま",
      "meaning": "free time"
    },
    "sentence": {
      "japanese": "今は忙しいが明日はひまになるだろうと彼は言った。",
      "kana": "いまはいそがしいがあしたはひまになるだろうとかれはいった。",
      "english": "He said that he was busy then, but that he would be free the next day.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0365",
    "example_index": 5,
    "target_vocab": {
      "kanji": "暇",
      "kana": "ひま",
      "meaning": "free time"
    },
    "sentence": {
      "japanese": "明日の晩は、ひま？",
      "kana": "あしたのばんは、ひま？",
      "english": "Are you free tomorrow evening?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0366",
    "example_index": 0,
    "target_vocab": {
      "kanji": "鳴く",
      "kana": "なく",
      "meaning": "animal noise. to chirp"
    },
    "sentence": {
      "japanese": "鳥は鳴く。",
      "kana": "とりはなく。",
      "english": "Birds sing.",
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
