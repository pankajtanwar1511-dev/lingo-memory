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

**Batch Number**: 17
**Total Batches**: 38
**Examples in This Batch**: 50

---

### Examples:

[
  {
    "card_id": "n5_vocab_0281",
    "example_index": 2,
    "target_vocab": {
      "kanji": "動物",
      "kana": "どうぶつ",
      "meaning": "animal"
    },
    "sentence": {
      "japanese": "彼らは動物園へ行った。",
      "kana": "かれらはどうぶつえんへいった。",
      "english": "They went to the zoo.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0282",
    "example_index": 0,
    "target_vocab": {
      "kanji": "切符",
      "kana": "きっぷ",
      "meaning": "ticket"
    },
    "sentence": {
      "japanese": "彼女は切符を家に置き忘れた。",
      "kana": "かのじょはきっぷをいえにおきわすれた。",
      "english": "She left her ticket at home.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0282",
    "example_index": 1,
    "target_vocab": {
      "kanji": "切符",
      "kana": "きっぷ",
      "meaning": "ticket"
    },
    "sentence": {
      "japanese": "切符を手にいれてください。",
      "kana": "きっぷをてにいれてください。",
      "english": "Get me a ticket, please.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0282",
    "example_index": 2,
    "target_vocab": {
      "kanji": "切符",
      "kana": "きっぷ",
      "meaning": "ticket"
    },
    "sentence": {
      "japanese": "切符を見せてください。",
      "kana": "きっぷをみせてください。",
      "english": "Please show your ticket.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0282",
    "example_index": 3,
    "target_vocab": {
      "kanji": "切符",
      "kana": "きっぷ",
      "meaning": "ticket"
    },
    "sentence": {
      "japanese": "きっぷって、どこで買えるの？",
      "kana": "きっぷって、どこでかえるの？",
      "english": "Where can I buy a ticket?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0284",
    "example_index": 0,
    "target_vocab": {
      "kanji": "呼ぶ",
      "kana": "よぶ",
      "meaning": "to call out"
    },
    "sentence": {
      "japanese": "あなたが呼べば、彼は来るでしょう。",
      "kana": "あなたがよべば、かれはくるでしょう。",
      "english": "He will come if you call him.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0284",
    "example_index": 1,
    "target_vocab": {
      "kanji": "呼ぶ",
      "kana": "よぶ",
      "meaning": "to call out"
    },
    "sentence": {
      "japanese": "彼女は生徒を呼んで部屋へ入らせた。",
      "kana": "かのじょはせいとをよんでへやへいらせた。",
      "english": "She called the pupils into the room.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0284",
    "example_index": 2,
    "target_vocab": {
      "kanji": "呼ぶ",
      "kana": "よぶ",
      "meaning": "to call out"
    },
    "sentence": {
      "japanese": "彼らは我々を問題児と呼ぶ。",
      "kana": "かれらはわれわれをもんだいじとよぶ。",
      "english": "They call us problem children.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0285",
    "example_index": 0,
    "target_vocab": {
      "kanji": "体",
      "kana": "からだ",
      "meaning": "body"
    },
    "sentence": {
      "japanese": "どうぞお体を大切に。",
      "kana": "どうぞおからだをたいせつに。",
      "english": "Please take good care of yourself.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0285",
    "example_index": 1,
    "target_vocab": {
      "kanji": "体",
      "kana": "からだ",
      "meaning": "body"
    },
    "sentence": {
      "japanese": "その細っこい体のどこに入るんだ？",
      "kana": "そのこまっこいからだのどこにいるんだ？",
      "english": "In that slender body, where does it all go?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0285",
    "example_index": 2,
    "target_vocab": {
      "kanji": "体",
      "kana": "からだ",
      "meaning": "body"
    },
    "sentence": {
      "japanese": "彼は体の弱い子供だった。",
      "kana": "かれはからだのよわいこどもだった。",
      "english": "He was a weak and delicate child.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0288",
    "example_index": 0,
    "target_vocab": {
      "kanji": "大人",
      "kana": "おとな",
      "meaning": "adult"
    },
    "sentence": {
      "japanese": "私も遠からずおとなになるだろう。",
      "kana": "わたしもとおからずおとなになるだろう。",
      "english": "I will also become a grown-up before long.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0288",
    "example_index": 1,
    "target_vocab": {
      "kanji": "大人",
      "kana": "おとな",
      "meaning": "adult"
    },
    "sentence": {
      "japanese": "子供向けではあるが、この本は大人によく読まれている。",
      "kana": "こどもむけではあるが、このほんはおとなによくよまれている。",
      "english": "Intended for children, this is a book often read by adults.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0288",
    "example_index": 2,
    "target_vocab": {
      "kanji": "大人",
      "kana": "おとな",
      "meaning": "adult"
    },
    "sentence": {
      "japanese": "君はもう大人だ。",
      "kana": "くんはもうおとなだ。",
      "english": "You are now an adult.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0288",
    "example_index": 3,
    "target_vocab": {
      "kanji": "大人",
      "kana": "おとな",
      "meaning": "adult"
    },
    "sentence": {
      "japanese": "私も遠からずおとなになるだろう。",
      "kana": "わたしもとおからずおとなになるだろう。",
      "english": "I will also become a grown-up before long.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0289",
    "example_index": 0,
    "target_vocab": {
      "kanji": "歯",
      "kana": "は",
      "meaning": "tooth"
    },
    "sentence": {
      "japanese": "今日歯医者へ行きました。",
      "kana": "きょうはいしゃへいきました。",
      "english": "Today I went to the dentist's.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0289",
    "example_index": 1,
    "target_vocab": {
      "kanji": "歯",
      "kana": "は",
      "meaning": "tooth"
    },
    "sentence": {
      "japanese": "目には目を、歯には歯を。",
      "kana": "めにはめを、はにははを。",
      "english": "An eye for an eye, a tooth for a tooth.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0289",
    "example_index": 2,
    "target_vocab": {
      "kanji": "歯",
      "kana": "は",
      "meaning": "tooth"
    },
    "sentence": {
      "japanese": "彼女は毎朝歯を磨くと言った。",
      "kana": "かのじょはまいあさはをみがくといった。",
      "english": "She said that she brushes her teeth every morning.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0289",
    "example_index": 3,
    "target_vocab": {
      "kanji": "歯",
      "kana": "は",
      "meaning": "tooth"
    },
    "sentence": {
      "japanese": "あからさまに言えば彼は嫌いだ。",
      "kana": "あからさまにいえばかれはきらいだ。",
      "english": "Frankly, I don't like him.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0289",
    "example_index": 4,
    "target_vocab": {
      "kanji": "歯",
      "kana": "は",
      "meaning": "tooth"
    },
    "sentence": {
      "japanese": "あなたはシャツをあべこべに着ている。",
      "kana": "あなたはしゃつをあべこべにきている。",
      "english": "You are wearing your shirt inside out.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0289",
    "example_index": 5,
    "target_vocab": {
      "kanji": "歯",
      "kana": "は",
      "meaning": "tooth"
    },
    "sentence": {
      "japanese": "おや、今朝は早いですね。",
      "kana": "おや、けさははやいですね。",
      "english": "Oh, you are early this morning.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0290",
    "example_index": 0,
    "target_vocab": {
      "kanji": "冬",
      "kana": "ふゆ",
      "meaning": "winter"
    },
    "sentence": {
      "japanese": "北の方では冬が寒いです。",
      "kana": "きたのほうではふゆがさむいです。",
      "english": "In the north, it's cold in winter.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0290",
    "example_index": 1,
    "target_vocab": {
      "kanji": "冬",
      "kana": "ふゆ",
      "meaning": "winter"
    },
    "sentence": {
      "japanese": "去年の冬は暖かだった。",
      "kana": "きょねんのふゆはあたたかだった。",
      "english": "We had a mild winter last year.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0290",
    "example_index": 2,
    "target_vocab": {
      "kanji": "冬",
      "kana": "ふゆ",
      "meaning": "winter"
    },
    "sentence": {
      "japanese": "冬の静かな夜だった。",
      "kana": "ふゆのしずかなよるだった。",
      "english": "It was a silent night in winter.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0291",
    "example_index": 0,
    "target_vocab": {
      "kanji": "所",
      "kana": "ところ",
      "meaning": "place"
    },
    "sentence": {
      "japanese": "私の犬は、どこでも私の行くところへついてくる。",
      "kana": "わたしのいぬは、どこでもわたしのいくところへついてくる。",
      "english": "My dog follows me wherever I go.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0291",
    "example_index": 1,
    "target_vocab": {
      "kanji": "所",
      "kana": "ところ",
      "meaning": "place"
    },
    "sentence": {
      "japanese": "いつものところでいつもの人達に会った。",
      "kana": "いつものところでいつものひとたちにあった。",
      "english": "I met the usual people at the usual place.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0291",
    "example_index": 2,
    "target_vocab": {
      "kanji": "所",
      "kana": "ところ",
      "meaning": "place"
    },
    "sentence": {
      "japanese": "彼女は今のところ大丈夫です。",
      "kana": "かのじょはいまのところだいじょうぶです。",
      "english": "She is all right at the moment.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0291",
    "example_index": 3,
    "target_vocab": {
      "kanji": "所",
      "kana": "ところ",
      "meaning": "place"
    },
    "sentence": {
      "japanese": "私の犬は、どこでも私の行くところへついてくる。",
      "kana": "わたしのいぬは、どこでもわたしのいくところへついてくる。",
      "english": "My dog follows me wherever I go.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0291",
    "example_index": 4,
    "target_vocab": {
      "kanji": "所",
      "kana": "ところ",
      "meaning": "place"
    },
    "sentence": {
      "japanese": "いつものところでいつもの人達に会った。",
      "kana": "いつものところでいつものひとたちにあった。",
      "english": "I met the usual people at the usual place.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0291",
    "example_index": 5,
    "target_vocab": {
      "kanji": "所",
      "kana": "ところ",
      "meaning": "place"
    },
    "sentence": {
      "japanese": "彼女は今のところ大丈夫です。",
      "kana": "かのじょはいまのところだいじょうぶです。",
      "english": "She is all right at the moment.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0292",
    "example_index": 0,
    "target_vocab": {
      "kanji": "吹く",
      "kana": "ふく",
      "meaning": "to blow"
    },
    "sentence": {
      "japanese": "風がまだ強く吹きます。",
      "kana": "かぜがまだつよくふきます。",
      "english": "The wind still blows hard.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0292",
    "example_index": 1,
    "target_vocab": {
      "kanji": "吹く",
      "kana": "ふく",
      "meaning": "to blow"
    },
    "sentence": {
      "japanese": "冷たい風は海から吹いている。",
      "kana": "つめたいかぜはうみからふいている。",
      "english": "The cold wind is blowing from the sea.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0292",
    "example_index": 2,
    "target_vocab": {
      "kanji": "吹く",
      "kana": "ふく",
      "meaning": "to blow"
    },
    "sentence": {
      "japanese": "明日は明日の風が吹く。",
      "kana": "あしたはあしたのかぜがふく。",
      "english": "Tomorrow is another day.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0293",
    "example_index": 0,
    "target_vocab": {
      "kanji": "足",
      "kana": "あし",
      "meaning": "foot"
    },
    "sentence": {
      "japanese": "犬は四本足である。",
      "kana": "いぬはよんほんあしである。",
      "english": "A dog has four legs.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0293",
    "example_index": 1,
    "target_vocab": {
      "kanji": "足",
      "kana": "あし",
      "meaning": "foot"
    },
    "sentence": {
      "japanese": "疲れて足が重かった。",
      "kana": "つかれてあしがおもかった。",
      "english": "My legs were leaden from fatigue.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0293",
    "example_index": 2,
    "target_vocab": {
      "kanji": "足",
      "kana": "あし",
      "meaning": "foot"
    },
    "sentence": {
      "japanese": "彼の所に行くのは足が重い。",
      "kana": "かのところにいくのはあしがおもい。",
      "english": "I'm reluctant to visit him.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0294",
    "example_index": 0,
    "target_vocab": {
      "kanji": "箱",
      "kana": "はこ",
      "meaning": "box"
    },
    "sentence": {
      "japanese": "おやまあ、なんて大きな箱なの。",
      "kana": "おやまあ、なんておおきなはこなの。",
      "english": "My heavens, what an enormous box!",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0294",
    "example_index": 1,
    "target_vocab": {
      "kanji": "箱",
      "kana": "はこ",
      "meaning": "box"
    },
    "sentence": {
      "japanese": "彼女はその箱をテーブルの上に置いた。",
      "kana": "かのじょはそのはこをてーぶるのうえにおいた。",
      "english": "She deposited the box on the table.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0294",
    "example_index": 2,
    "target_vocab": {
      "kanji": "箱",
      "kana": "はこ",
      "meaning": "box"
    },
    "sentence": {
      "japanese": "彼は箱の開け方をわかった。",
      "kana": "かれははこのひらけほうをわかった。",
      "english": "He discovered how to open the box.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0295",
    "example_index": 0,
    "target_vocab": {
      "kanji": "八",
      "kana": "はち",
      "meaning": "eight"
    },
    "sentence": {
      "japanese": "彼は十中八九来るだろう。",
      "kana": "かれはじゅっちゅうはっくくるだろう。",
      "english": "He will come nine times out of ten.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0295",
    "example_index": 1,
    "target_vocab": {
      "kanji": "八",
      "kana": "はち",
      "meaning": "eight"
    },
    "sentence": {
      "japanese": "十中八九、彼は一位になるだろう。",
      "kana": "じゅっちゅうはっく、かれはいちいになるだろう。",
      "english": "In nine cases out of ten he will take the first place.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0295",
    "example_index": 2,
    "target_vocab": {
      "kanji": "八",
      "kana": "はち",
      "meaning": "eight"
    },
    "sentence": {
      "japanese": "一つ、二つ、三つ、四つ、五つ、六つ、七つ、八つ、九つ、十。",
      "kana": "ひとつ、ふたつ、みっつ、よつ、いつつ、むつ、ななつ、やつ、ここのつ、じゅう。",
      "english": "One, two, three, four, five, six, seven, eight, nine, ten.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0296",
    "example_index": 0,
    "target_vocab": {
      "kanji": "朝",
      "kana": "あさ",
      "meaning": "morning"
    },
    "sentence": {
      "japanese": "もう朝から晩まで働いてクタクタだよ。",
      "kana": "もうあさからばんまではたらいてくたくただよ。",
      "english": "I'm beat. I've been working from dawn to dusk.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0296",
    "example_index": 1,
    "target_vocab": {
      "kanji": "朝",
      "kana": "あさ",
      "meaning": "morning"
    },
    "sentence": {
      "japanese": "明日の朝、電話するよ。",
      "kana": "あしたのあさ、でんわするよ。",
      "english": "I'll call you up tomorrow morning.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0296",
    "example_index": 2,
    "target_vocab": {
      "kanji": "朝",
      "kana": "あさ",
      "meaning": "morning"
    },
    "sentence": {
      "japanese": "明日の朝私に会うのを忘れないで。",
      "kana": "あしたのあさわたしにあうのをわすれないで。",
      "english": "Don't forget to see me tomorrow morning.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0297",
    "example_index": 0,
    "target_vocab": {
      "kanji": "一昨日",
      "kana": "おととい",
      "meaning": "day before yesterday"
    },
    "sentence": {
      "japanese": "おとといそこへ行きました。",
      "kana": "おとといそこへいきました。",
      "english": "I went there the day before yesterday.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0297",
    "example_index": 1,
    "target_vocab": {
      "kanji": "一昨日",
      "kana": "おととい",
      "meaning": "day before yesterday"
    },
    "sentence": {
      "japanese": "おとといきやがれ！",
      "kana": "おとといきやがれ！",
      "english": "Don't you ever come here again!",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0297",
    "example_index": 2,
    "target_vocab": {
      "kanji": "一昨日",
      "kana": "おととい",
      "meaning": "day before yesterday"
    },
    "sentence": {
      "japanese": "おとつい彼に会ったよ。",
      "kana": "おとついかれにあったよ。",
      "english": "I met him the day before yesterday.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0297",
    "example_index": 3,
    "target_vocab": {
      "kanji": "一昨日",
      "kana": "おととい",
      "meaning": "day before yesterday"
    },
    "sentence": {
      "japanese": "おとといそこへ行きました。",
      "kana": "おとといそこへいきました。",
      "english": "I went there the day before yesterday.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0297",
    "example_index": 4,
    "target_vocab": {
      "kanji": "一昨日",
      "kana": "おととい",
      "meaning": "day before yesterday"
    },
    "sentence": {
      "japanese": "おとといきやがれ！",
      "kana": "おとといきやがれ！",
      "english": "Don't you ever come here again!",
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
