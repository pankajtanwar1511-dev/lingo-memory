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

**Batch Number**: 19
**Total Batches**: 38
**Examples in This Batch**: 50

---

### Examples:

[
  {
    "card_id": "n5_vocab_0313",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "プール",
      "meaning": "swimming pool"
    },
    "sentence": {
      "japanese": "彼は今プールで泳いでいる。",
      "kana": "かれはいまぷーるでおよいでいる。",
      "english": "He is swimming in the pool.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0313",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "プール",
      "meaning": "swimming pool"
    },
    "sentence": {
      "japanese": "その学校には立派なプールがある。",
      "kana": "そのがっこうにはりっぱなぷーるがある。",
      "english": "The school boasts a fine swimming pool.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0313",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "プール",
      "meaning": "swimming pool"
    },
    "sentence": {
      "japanese": "暑かったので、プールで泳ぎました。",
      "kana": "あつかったので、ぷーるでおよぎました。",
      "english": "It was hot, so we swam in the pool.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0314",
    "example_index": 0,
    "target_vocab": {
      "kanji": "小さい",
      "kana": "ちいさい",
      "meaning": "little"
    },
    "sentence": {
      "japanese": "彼女は足が小さい。",
      "kana": "かのじょはあしがちーさい。",
      "english": "She has small feet.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0314",
    "example_index": 1,
    "target_vocab": {
      "kanji": "小さい",
      "kana": "ちいさい",
      "meaning": "little"
    },
    "sentence": {
      "japanese": "彼女は小さい声で話した。",
      "kana": "かのじょはちーさいこえではなした。",
      "english": "She spoke in a small voice.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0314",
    "example_index": 2,
    "target_vocab": {
      "kanji": "小さい",
      "kana": "ちいさい",
      "meaning": "little"
    },
    "sentence": {
      "japanese": "彼は小さい部屋に大きい机を置いている。",
      "kana": "かれはちーさいへやにおおきいつくえをおいている。",
      "english": "He has a large desk in his small room.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0315",
    "example_index": 0,
    "target_vocab": {
      "kanji": "今週",
      "kana": "こんしゅう",
      "meaning": "this week"
    },
    "sentence": {
      "japanese": "先生に今週会えますか。",
      "kana": "せんせいにこんしゅうあえますか。",
      "english": "Can the doctor see me this week?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0315",
    "example_index": 1,
    "target_vocab": {
      "kanji": "今週",
      "kana": "こんしゅう",
      "meaning": "this week"
    },
    "sentence": {
      "japanese": "私は今週はお休みです。",
      "kana": "わたしはこんしゅうはおやすみです。",
      "english": "I am on holiday this week.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0315",
    "example_index": 2,
    "target_vocab": {
      "kanji": "今週",
      "kana": "こんしゅう",
      "meaning": "this week"
    },
    "sentence": {
      "japanese": "私は今週お休みです。",
      "kana": "わたしはこんしゅうおやすみです。",
      "english": "I am on holiday this week.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0316",
    "example_index": 0,
    "target_vocab": {
      "kanji": "肉",
      "kana": "にく",
      "meaning": "meat"
    },
    "sentence": {
      "japanese": "彼はナイフで肉を切った。",
      "kana": "かれはないふでにくをきった。",
      "english": "He cut the meat with a knife.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0316",
    "example_index": 1,
    "target_vocab": {
      "kanji": "肉",
      "kana": "にく",
      "meaning": "meat"
    },
    "sentence": {
      "japanese": "肉はこの暑い天気では長くはもたないだろう。",
      "kana": "にくはこのあついてんきではながくはもたないだろう。",
      "english": "Meat won't keep long in this heat.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0316",
    "example_index": 2,
    "target_vocab": {
      "kanji": "肉",
      "kana": "にく",
      "meaning": "meat"
    },
    "sentence": {
      "japanese": "肉と魚どちらが好きですか。",
      "kana": "にくとさかなどちらがすきですか。",
      "english": "Which do you like better, meat or fish?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0318",
    "example_index": 0,
    "target_vocab": {
      "kanji": "豚肉",
      "kana": "ぶたにく",
      "meaning": "pork"
    },
    "sentence": {
      "japanese": "フォークで豚肉を食べます。",
      "kana": "ふぉーくでぶたにくをたべます。",
      "english": "I eat pork with a fork.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0318",
    "example_index": 1,
    "target_vocab": {
      "kanji": "豚肉",
      "kana": "ぶたにく",
      "meaning": "pork"
    },
    "sentence": {
      "japanese": "これは牛肉？それとも豚肉？",
      "kana": "これはぎゅうにく？それともぶたにく？",
      "english": "Is this beef or pork?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0318",
    "example_index": 2,
    "target_vocab": {
      "kanji": "豚肉",
      "kana": "ぶたにく",
      "meaning": "pork"
    },
    "sentence": {
      "japanese": "私は豚肉が食べられません。",
      "kana": "わたしはぶたにくがたべられません。",
      "english": "I can't eat pork.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0319",
    "example_index": 0,
    "target_vocab": {
      "kanji": "広い",
      "kana": "ひろい",
      "meaning": "spacious"
    },
    "sentence": {
      "japanese": "この雑誌は広く行き渡っている。",
      "kana": "このざっしはひろくいきわたっている。",
      "english": "This magazine circulates widely.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0319",
    "example_index": 1,
    "target_vocab": {
      "kanji": "広い",
      "kana": "ひろい",
      "meaning": "spacious"
    },
    "sentence": {
      "japanese": "彼女は広く知られている。",
      "kana": "かのじょはひろくしられている。",
      "english": "She is widely known.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0319",
    "example_index": 2,
    "target_vocab": {
      "kanji": "広い",
      "kana": "ひろい",
      "meaning": "spacious"
    },
    "sentence": {
      "japanese": "彼女は広い家に住んでいます。",
      "kana": "かのじょはひろいいえにすんでいます。",
      "english": "She lives in a large house.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0320",
    "example_index": 0,
    "target_vocab": {
      "kanji": "靴下",
      "kana": "くつした",
      "meaning": "socks"
    },
    "sentence": {
      "japanese": "この靴下はちぐはぐだ。",
      "kana": "このくつしたはちぐはぐだ。",
      "english": "These socks do not match.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0320",
    "example_index": 1,
    "target_vocab": {
      "kanji": "靴下",
      "kana": "くつした",
      "meaning": "socks"
    },
    "sentence": {
      "japanese": "彼女は靴下を二足買った。",
      "kana": "かのじょはくつしたをにそくかった。",
      "english": "She bought two pairs of socks.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0320",
    "example_index": 2,
    "target_vocab": {
      "kanji": "靴下",
      "kana": "くつした",
      "meaning": "socks"
    },
    "sentence": {
      "japanese": "靴下を脱いでください。",
      "kana": "くつしたをぬいでください。",
      "english": "Take off your socks, please.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0321",
    "example_index": 0,
    "target_vocab": {
      "kanji": "一人",
      "kana": "ひとり",
      "meaning": "one person"
    },
    "sentence": {
      "japanese": "今、女の人が１人入っていきましたよ。",
      "kana": "いま、おんなのひとが１にんいっっていきましたよ。",
      "english": "A woman is going into it now.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0321",
    "example_index": 1,
    "target_vocab": {
      "kanji": "一人",
      "kana": "ひとり",
      "meaning": "one person"
    },
    "sentence": {
      "japanese": "私は一人の弟がいます。",
      "kana": "わたしはひとりのおとうとがいます。",
      "english": "I have one brother.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0321",
    "example_index": 2,
    "target_vocab": {
      "kanji": "一人",
      "kana": "ひとり",
      "meaning": "one person"
    },
    "sentence": {
      "japanese": "彼は一人っきりである。",
      "kana": "かれはひとりっきりである。",
      "english": "He is alone.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0321",
    "example_index": 3,
    "target_vocab": {
      "kanji": "一人",
      "kana": "ひとり",
      "meaning": "one person"
    },
    "sentence": {
      "japanese": "彼女はひとりでそこに住んでいた。",
      "kana": "かのじょはひとりでそこにすんでいた。",
      "english": "She lived there by herself.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0321",
    "example_index": 4,
    "target_vocab": {
      "kanji": "一人",
      "kana": "ひとり",
      "meaning": "one person"
    },
    "sentence": {
      "japanese": "彼女はひとりでいたかった。",
      "kana": "かのじょはひとりでいたかった。",
      "english": "She wanted to be alone.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0321",
    "example_index": 5,
    "target_vocab": {
      "kanji": "一人",
      "kana": "ひとり",
      "meaning": "one person"
    },
    "sentence": {
      "japanese": "彼らは私をひとりでそこへ行かせた。",
      "kana": "かれらはわたしをひとりでそこへいかせた。",
      "english": "They made me go there alone.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0322",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "かぎ",
      "meaning": "key"
    },
    "sentence": {
      "japanese": "これはわたしの家のかぎです。",
      "kana": "これはわたしのいえのかぎです。",
      "english": "This is my house key.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0323",
    "example_index": 0,
    "target_vocab": {
      "kanji": "向こう",
      "kana": "むこう",
      "meaning": "over there"
    },
    "sentence": {
      "japanese": "向こうの交番で聞いてください。",
      "kana": "むこうのこうばんできいてください。",
      "english": "Ask at the police station over there.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0323",
    "example_index": 1,
    "target_vocab": {
      "kanji": "向こう",
      "kana": "むこう",
      "meaning": "over there"
    },
    "sentence": {
      "japanese": "その男の子は向こうにいます。",
      "kana": "そのおとこのこはむこうにいます。",
      "english": "The boy is over there.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0323",
    "example_index": 2,
    "target_vocab": {
      "kanji": "向こう",
      "kana": "むこう",
      "meaning": "over there"
    },
    "sentence": {
      "japanese": "彼は向こうの上、あの山の上に住んでいます。",
      "kana": "かれはむこうのうえ、あのやまのうえにすんでいます。",
      "english": "He lives up there, up on that mountain.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0324",
    "example_index": 0,
    "target_vocab": {
      "kanji": "上手",
      "kana": "じょうず",
      "meaning": "skillful"
    },
    "sentence": {
      "japanese": "話上手もいれば、聞き上手もいる。",
      "kana": "はなしじょうずもいれば、ききじょうずもいる。",
      "english": "Some people are good talkers and others good listeners.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0324",
    "example_index": 1,
    "target_vocab": {
      "kanji": "上手",
      "kana": "じょうず",
      "meaning": "skillful"
    },
    "sentence": {
      "japanese": "話し上手といわれる人もあれば、聞き上手といわれる人もいる。",
      "kana": "はなしじょうずといわれるにんもあれば、ききじょうずといわれるにんもいる。",
      "english": "Some are called good talkers, and others good listeners.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0324",
    "example_index": 2,
    "target_vocab": {
      "kanji": "上手",
      "kana": "じょうず",
      "meaning": "skillful"
    },
    "sentence": {
      "japanese": "料理が上手ですね。",
      "kana": "りょうりがじょうずですね。",
      "english": "You are a good cook.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0324",
    "example_index": 3,
    "target_vocab": {
      "kanji": "上手",
      "kana": "じょうず",
      "meaning": "skillful"
    },
    "sentence": {
      "japanese": "きみがこんなに料理がじょうずだとは知らなかった。",
      "kana": "きみがこんなにりょうりがじょうずだとはしらなかった。",
      "english": "I didn't know you were such a good cook.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0324",
    "example_index": 4,
    "target_vocab": {
      "kanji": "上手",
      "kana": "じょうず",
      "meaning": "skillful"
    },
    "sentence": {
      "japanese": "あなたは絵を書くのがじょうずですね。",
      "kana": "あなたはえをかくのがじょうずですね。",
      "english": "You are a good painter, aren't you?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0325",
    "example_index": 0,
    "target_vocab": {
      "kanji": "牛肉",
      "kana": "ぎゅうにく",
      "meaning": "beef"
    },
    "sentence": {
      "japanese": "これは牛肉？それとも豚肉？",
      "kana": "これはぎゅうにく？それともぶたにく？",
      "english": "Is this beef or pork?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0325",
    "example_index": 1,
    "target_vocab": {
      "kanji": "牛肉",
      "kana": "ぎゅうにく",
      "meaning": "beef"
    },
    "sentence": {
      "japanese": "牛肉は高い。",
      "kana": "ぎゅうにくはたかい。",
      "english": "Beef is expensive.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0325",
    "example_index": 2,
    "target_vocab": {
      "kanji": "牛肉",
      "kana": "ぎゅうにく",
      "meaning": "beef"
    },
    "sentence": {
      "japanese": "牛肉はとても高いんだ。",
      "kana": "ぎゅうにくはとてもたかいんだ。",
      "english": "Beef is very expensive.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0326",
    "example_index": 0,
    "target_vocab": {
      "kanji": "話",
      "kana": "はなし",
      "meaning": "talk"
    },
    "sentence": {
      "japanese": "それから先の話を聞きたい。",
      "kana": "それからさきのはなしをききたい。",
      "english": "I'd like to know the rest of the story.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0326",
    "example_index": 1,
    "target_vocab": {
      "kanji": "話",
      "kana": "はなし",
      "meaning": "talk"
    },
    "sentence": {
      "japanese": "彼の話は単純そのものだった。",
      "kana": "かのはなしはたんじゅんそのものだった。",
      "english": "His story was simplicity itself.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0326",
    "example_index": 2,
    "target_vocab": {
      "kanji": "話",
      "kana": "はなし",
      "meaning": "talk"
    },
    "sentence": {
      "japanese": "彼の話はいろいろなところへ飛ぶ。",
      "kana": "かのはなしはいろいろなところへとぶ。",
      "english": "He frequently jumps from one topic to another while he is talking.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0326",
    "example_index": 3,
    "target_vocab": {
      "kanji": "話",
      "kana": "はなし",
      "meaning": "talk"
    },
    "sentence": {
      "japanese": "もうパーティーはなしですよ。",
      "kana": "もうぱーてぃーはなしですよ。",
      "english": "No more parties.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0327",
    "example_index": 0,
    "target_vocab": {
      "kanji": "毎晩",
      "kana": "まいばん",
      "meaning": "every night"
    },
    "sentence": {
      "japanese": "私は毎晩家にいます。",
      "kana": "わたしはまいばんいえにいます。",
      "english": "I am at home every evening.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0327",
    "example_index": 1,
    "target_vocab": {
      "kanji": "毎晩",
      "kana": "まいばん",
      "meaning": "every night"
    },
    "sentence": {
      "japanese": "毎晩電話するよ。",
      "kana": "まいばんでんわするよ。",
      "english": "I'll give you a ring every night.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0327",
    "example_index": 2,
    "target_vocab": {
      "kanji": "毎晩",
      "kana": "まいばん",
      "meaning": "every night"
    },
    "sentence": {
      "japanese": "彼は毎晩彼女に電話する。",
      "kana": "かれはまいばんかのじょにでんわする。",
      "english": "He calls her up every night.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0329",
    "example_index": 0,
    "target_vocab": {
      "kanji": "吸う",
      "kana": "すう",
      "meaning": "to smoke"
    },
    "sentence": {
      "japanese": "たばこを吸わないの？",
      "kana": "たばこをすわないの？",
      "english": "Don't you smoke?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0329",
    "example_index": 1,
    "target_vocab": {
      "kanji": "吸う",
      "kana": "すう",
      "meaning": "to smoke"
    },
    "sentence": {
      "japanese": "たばこを吸わないでほしいのですが。",
      "kana": "たばこをすわないでほしいのですが。",
      "english": "I'd rather you didn't smoke so much.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0329",
    "example_index": 2,
    "target_vocab": {
      "kanji": "吸う",
      "kana": "すう",
      "meaning": "to smoke"
    },
    "sentence": {
      "japanese": "たばこは吸いますか。",
      "kana": "たばこはすいますか。",
      "english": "Do you smoke?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0329",
    "example_index": 3,
    "target_vocab": {
      "kanji": "吸う",
      "kana": "すう",
      "meaning": "to smoke"
    },
    "sentence": {
      "japanese": "彼はそのそばでシャツをすうっと着た。",
      "kana": "かれはそのそばでしゃつをすうっときた。",
      "english": "He slipped the gaudy shirt on.",
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
