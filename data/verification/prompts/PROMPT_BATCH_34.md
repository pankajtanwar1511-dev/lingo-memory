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

**Batch Number**: 34
**Total Batches**: 38
**Examples in This Batch**: 50

---

### Examples:

[
  {
    "card_id": "n5_vocab_0585",
    "example_index": 1,
    "target_vocab": {
      "kanji": "走る",
      "kana": "はしる",
      "meaning": "to run"
    },
    "sentence": {
      "japanese": "またいつか風のように走るんだ。",
      "kana": "またいつかかぜのようにはしるんだ。",
      "english": "Someday I'll run like the wind.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0585",
    "example_index": 2,
    "target_vocab": {
      "kanji": "走る",
      "kana": "はしる",
      "meaning": "to run"
    },
    "sentence": {
      "japanese": "彼女は走るのが嫌いだ。",
      "kana": "かのじょははしるのがきらいだ。",
      "english": "She hates running.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0587",
    "example_index": 0,
    "target_vocab": {
      "kanji": "意味",
      "kana": "いみ",
      "meaning": "meaning"
    },
    "sentence": {
      "japanese": "少しは彼が言っている意味が分かる。",
      "kana": "すこしはかれがいっているいみがわかる。",
      "english": "I understand his point in a way.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0587",
    "example_index": 1,
    "target_vocab": {
      "kanji": "意味",
      "kana": "いみ",
      "meaning": "meaning"
    },
    "sentence": {
      "japanese": "自分で意味がわからない言葉はつかってはいけない。",
      "kana": "じぶんでいみがわからないことばはつかってはいけない。",
      "english": "Don't use any words whose meanings you don't know well.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0587",
    "example_index": 2,
    "target_vocab": {
      "kanji": "意味",
      "kana": "いみ",
      "meaning": "meaning"
    },
    "sentence": {
      "japanese": "私はこれらの文章の意味がわからない。",
      "kana": "わたしはこれらのぶんしょうのいみがわからない。",
      "english": "I can't make sense of these sentences.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0588",
    "example_index": 0,
    "target_vocab": {
      "kanji": "物",
      "kana": "もの",
      "meaning": "thing"
    },
    "sentence": {
      "japanese": "彼の話は単純そのものだった。",
      "kana": "かのはなしはたんじゅんそのものだった。",
      "english": "His story was simplicity itself.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0588",
    "example_index": 1,
    "target_vocab": {
      "kanji": "物",
      "kana": "もの",
      "meaning": "thing"
    },
    "sentence": {
      "japanese": "あなたの妹さんに会いたいものです。",
      "kana": "あなたのいもうとさんにあいたいものです。",
      "english": "I'd like to see your sister.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0588",
    "example_index": 2,
    "target_vocab": {
      "kanji": "物",
      "kana": "もの",
      "meaning": "thing"
    },
    "sentence": {
      "japanese": "電話は便利なものである。",
      "kana": "でんわはべんりなものである。",
      "english": "The telephone is a convenience.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0588",
    "example_index": 3,
    "target_vocab": {
      "kanji": "物",
      "kana": "もの",
      "meaning": "thing"
    },
    "sentence": {
      "japanese": "彼の話は単純そのものだった。",
      "kana": "かのはなしはたんじゅんそのものだった。",
      "english": "His story was simplicity itself.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0588",
    "example_index": 4,
    "target_vocab": {
      "kanji": "物",
      "kana": "もの",
      "meaning": "thing"
    },
    "sentence": {
      "japanese": "あなたの妹さんに会いたいものです。",
      "kana": "あなたのいもうとさんにあいたいものです。",
      "english": "I'd like to see your sister.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0588",
    "example_index": 5,
    "target_vocab": {
      "kanji": "物",
      "kana": "もの",
      "meaning": "thing"
    },
    "sentence": {
      "japanese": "電話は便利なものである。",
      "kana": "でんわはべんりなものである。",
      "english": "The telephone is a convenience.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0589",
    "example_index": 0,
    "target_vocab": {
      "kanji": "強い",
      "kana": "つよい",
      "meaning": "powerful"
    },
    "sentence": {
      "japanese": "寒かったうえに、風も強かった。",
      "kana": "さむかったうえに、かぜもつよかった。",
      "english": "It was cold, and, in addition, it was windy.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0589",
    "example_index": 1,
    "target_vocab": {
      "kanji": "強い",
      "kana": "つよい",
      "meaning": "powerful"
    },
    "sentence": {
      "japanese": "風がまだ強く吹きます。",
      "kana": "かぜがまだつよくふきます。",
      "english": "The wind still blows hard.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0589",
    "example_index": 2,
    "target_vocab": {
      "kanji": "強い",
      "kana": "つよい",
      "meaning": "powerful"
    },
    "sentence": {
      "japanese": "風が強く吹いている。",
      "kana": "かぜがつよくふいている。",
      "english": "The wind is blowing hard.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0590",
    "example_index": 0,
    "target_vocab": {
      "kanji": "魚",
      "kana": "さかな",
      "meaning": "fish"
    },
    "sentence": {
      "japanese": "飛ぶ魚もいる。",
      "kana": "とぶさかなもいる。",
      "english": "Some fish fly.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0590",
    "example_index": 1,
    "target_vocab": {
      "kanji": "魚",
      "kana": "さかな",
      "meaning": "fish"
    },
    "sentence": {
      "japanese": "肉と魚どちらが好きですか。",
      "kana": "にくとさかなどちらがすきですか。",
      "english": "Which do you like better, meat or fish?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0590",
    "example_index": 2,
    "target_vocab": {
      "kanji": "魚",
      "kana": "さかな",
      "meaning": "fish"
    },
    "sentence": {
      "japanese": "池に大きな赤い魚が一匹泳いでいる。",
      "kana": "いけにおおきなあかいさかながいっぴきおよいでいる。",
      "english": "A big red fish is swimming about in the pond.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0591",
    "example_index": 0,
    "target_vocab": {
      "kanji": "切手",
      "kana": "きって",
      "meaning": "postage stamp"
    },
    "sentence": {
      "japanese": "あなたの切手帳を見せてください。",
      "kana": "あなたのきってちょうをみせてください。",
      "english": "Please show me your stamp album.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0591",
    "example_index": 1,
    "target_vocab": {
      "kanji": "切手",
      "kana": "きって",
      "meaning": "postage stamp"
    },
    "sentence": {
      "japanese": "彼は外国切手をたくさん持っている。",
      "kana": "かれはがいこくきってをたくさんもっている。",
      "english": "He has a lot of foreign stamps.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0591",
    "example_index": 2,
    "target_vocab": {
      "kanji": "切手",
      "kana": "きって",
      "meaning": "postage stamp"
    },
    "sentence": {
      "japanese": "切手はどこで売っていますか。",
      "kana": "きってはどこでうっていますか。",
      "english": "Where do I get stamps?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0592",
    "example_index": 0,
    "target_vocab": {
      "kanji": "暗い",
      "kana": "くらい",
      "meaning": "gloomy"
    },
    "sentence": {
      "japanese": "とても暗いので私は本が読めない。",
      "kana": "とてもくらいのでわたしはほんがよめない。",
      "english": "It is too dark for me to read.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0592",
    "example_index": 1,
    "target_vocab": {
      "kanji": "暗い",
      "kana": "くらい",
      "meaning": "gloomy"
    },
    "sentence": {
      "japanese": "目に悪いから暗いところで本を読んではいけない。",
      "kana": "めにわるいからくらいところでほんをよんではいけない。",
      "english": "Don't read under insufficient light, for it is bad for your eyes.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0592",
    "example_index": 2,
    "target_vocab": {
      "kanji": "暗い",
      "kana": "くらい",
      "meaning": "gloomy"
    },
    "sentence": {
      "japanese": "部屋の中は暗くて寒かった。",
      "kana": "へやのなかはくらくてさむかった。",
      "english": "It was dark and cold in the room.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0592",
    "example_index": 3,
    "target_vocab": {
      "kanji": "暗い",
      "kana": "くらい",
      "meaning": "gloomy"
    },
    "sentence": {
      "japanese": "彼女はお兄さんと同じ位の速さで泳げます。",
      "kana": "かのじょはおにいさんとおなじくらいのはやさでおよげます。",
      "english": "She can swim as fast as her brother.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0592",
    "example_index": 4,
    "target_vocab": {
      "kanji": "暗い",
      "kana": "くらい",
      "meaning": "gloomy"
    },
    "sentence": {
      "japanese": "彼と結婚するぐらいなら死んだ方がましだ。",
      "kana": "かれとけっこんするぐらいならしんだほうがましだ。",
      "english": "I would rather die than marry him.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0592",
    "example_index": 5,
    "target_vocab": {
      "kanji": "暗い",
      "kana": "くらい",
      "meaning": "gloomy"
    },
    "sentence": {
      "japanese": "少なくとも地図ぐらいはあるだろう。",
      "kana": "すくなくともちずぐらいはあるだろう。",
      "english": "At least they should have a map.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0593",
    "example_index": 0,
    "target_vocab": {
      "kanji": "出る",
      "kana": "でる",
      "meaning": "to appear"
    },
    "sentence": {
      "japanese": "言葉が出てこなかった。",
      "kana": "ことばがでてこなかった。",
      "english": "Words failed me.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0593",
    "example_index": 1,
    "target_vocab": {
      "kanji": "出る",
      "kana": "でる",
      "meaning": "to appear"
    },
    "sentence": {
      "japanese": "昼ご飯を食べに外に出ませんか。",
      "kana": "ひるごめしをたべにそとにでませんか。",
      "english": "How about going out for lunch?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0593",
    "example_index": 2,
    "target_vocab": {
      "kanji": "出る",
      "kana": "でる",
      "meaning": "to appear"
    },
    "sentence": {
      "japanese": "彼女は勉強部屋から出ていった。",
      "kana": "かのじょはべんきょうへやからでていった。",
      "english": "She went out of her study.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0593",
    "example_index": 3,
    "target_vocab": {
      "kanji": "出る",
      "kana": "でる",
      "meaning": "to appear"
    },
    "sentence": {
      "japanese": "死んでるって？",
      "kana": "しんでるって？",
      "english": "He's dead?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0593",
    "example_index": 4,
    "target_vocab": {
      "kanji": "出る",
      "kana": "でる",
      "meaning": "to appear"
    },
    "sentence": {
      "japanese": "ここ何で並んでるんですか？",
      "kana": "ここなんでならんでるんですか？",
      "english": "What are you lining up for?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0593",
    "example_index": 5,
    "target_vocab": {
      "kanji": "出る",
      "kana": "でる",
      "meaning": "to appear"
    },
    "sentence": {
      "japanese": "誰と一緒に住んでるの？",
      "kana": "だれといっしょにすんでるの？",
      "english": "Who do you live with?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0594",
    "example_index": 0,
    "target_vocab": {
      "kanji": "犬",
      "kana": "いぬ",
      "meaning": "dog"
    },
    "sentence": {
      "japanese": "私の犬は、どこでも私の行くところへついてくる。",
      "kana": "わたしのいぬは、どこでもわたしのいくところへついてくる。",
      "english": "My dog follows me wherever I go.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0594",
    "example_index": 1,
    "target_vocab": {
      "kanji": "犬",
      "kana": "いぬ",
      "meaning": "dog"
    },
    "sentence": {
      "japanese": "犬は四本足である。",
      "kana": "いぬはよんほんあしである。",
      "english": "A dog has four legs.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0594",
    "example_index": 2,
    "target_vocab": {
      "kanji": "犬",
      "kana": "いぬ",
      "meaning": "dog"
    },
    "sentence": {
      "japanese": "これは犬です。",
      "kana": "これはいぬです。",
      "english": "This is a dog.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0595",
    "example_index": 0,
    "target_vocab": {
      "kanji": "女",
      "kana": "おんな",
      "meaning": "woman"
    },
    "sentence": {
      "japanese": "今、女の人が１人入っていきましたよ。",
      "kana": "いま、おんなのひとが１にんいっっていきましたよ。",
      "english": "A woman is going into it now.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0595",
    "example_index": 1,
    "target_vocab": {
      "kanji": "女",
      "kana": "おんな",
      "meaning": "woman"
    },
    "sentence": {
      "japanese": "あそこに立ってる女の人はだれですか。",
      "kana": "あそこにたってるおんなのひとはだれですか。",
      "english": "Who is the woman standing there?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0595",
    "example_index": 2,
    "target_vocab": {
      "kanji": "女",
      "kana": "おんな",
      "meaning": "woman"
    },
    "sentence": {
      "japanese": "彼女はとても女らしい。",
      "kana": "かのじょはとてもおんならしい。",
      "english": "She is a very feminine person.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0599",
    "example_index": 0,
    "target_vocab": {
      "kanji": "午前",
      "kana": "ごぜん",
      "meaning": "morning"
    },
    "sentence": {
      "japanese": "彼女は午前中そこにいた。",
      "kana": "かのじょはごぜんちゅうそこにいた。",
      "english": "She was there in the morning.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0599",
    "example_index": 1,
    "target_vocab": {
      "kanji": "午前",
      "kana": "ごぜん",
      "meaning": "morning"
    },
    "sentence": {
      "japanese": "私は午前中、庭で熱心に働く。",
      "kana": "わたしはごぜんちゅう、にわでねっしんにはたらく。",
      "english": "I work hard in the garden in the morning.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0599",
    "example_index": 2,
    "target_vocab": {
      "kanji": "午前",
      "kana": "ごぜん",
      "meaning": "morning"
    },
    "sentence": {
      "japanese": "彼は午前中に本を読んでいた。",
      "kana": "かれはごぜんちゅうにほんをよんでいた。",
      "english": "He read a book all morning.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0600",
    "example_index": 0,
    "target_vocab": {
      "kanji": "名前",
      "kana": "なまえ",
      "meaning": "name"
    },
    "sentence": {
      "japanese": "彼は人の名前を忘れやすい。",
      "kana": "かれはにんのなまえをわすれやすい。",
      "english": "He is apt to forget people's name.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0600",
    "example_index": 1,
    "target_vocab": {
      "kanji": "名前",
      "kana": "なまえ",
      "meaning": "name"
    },
    "sentence": {
      "japanese": "私はその動物の名前を知っている。",
      "kana": "わたしはそのどうぶつのなまえをしっている。",
      "english": "I know the name of this animal.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0600",
    "example_index": 2,
    "target_vocab": {
      "kanji": "名前",
      "kana": "なまえ",
      "meaning": "name"
    },
    "sentence": {
      "japanese": "私は彼の名前の読み方がわからない。",
      "kana": "わたしはかのなまえのよみかたがわからない。",
      "english": "I don't know how to pronounce his name.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0603",
    "example_index": 0,
    "target_vocab": {
      "kanji": "鼻",
      "kana": "はな",
      "meaning": "nose"
    },
    "sentence": {
      "japanese": "あまりそれを鼻にかけるな。",
      "kana": "あまりそれをはなにかけるな。",
      "english": "Don't boast too much about that.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0603",
    "example_index": 1,
    "target_vocab": {
      "kanji": "鼻",
      "kana": "はな",
      "meaning": "nose"
    },
    "sentence": {
      "japanese": "その店は私の家の目と鼻の先にある。",
      "kana": "そのみせはわたしのいえのめとはなのさきにある。",
      "english": "The store is close to my house.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0603",
    "example_index": 2,
    "target_vocab": {
      "kanji": "鼻",
      "kana": "はな",
      "meaning": "nose"
    },
    "sentence": {
      "japanese": "鼻がでているよ。",
      "kana": "はながでているよ。",
      "english": "Your nose is running.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0605",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "コップ",
      "meaning": "a glass"
    },
    "sentence": {
      "japanese": "君のコップ？それとも妹のコップ？",
      "kana": "くんのこっぷ？それともいもうとのこっぷ？",
      "english": "Is this your glass or your sister's?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0605",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "コップ",
      "meaning": "a glass"
    },
    "sentence": {
      "japanese": "テーブルの上にコップがある。",
      "kana": "てーぶるのうえにこっぷがある。",
      "english": "There is a glass on the table.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0605",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "コップ",
      "meaning": "a glass"
    },
    "sentence": {
      "japanese": "このコップには水が入っている。",
      "kana": "このこっぷにはみずがいっっている。",
      "english": "This glass contains water.",
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
