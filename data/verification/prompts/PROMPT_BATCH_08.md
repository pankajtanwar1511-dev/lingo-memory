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

**Batch Number**: 8
**Total Batches**: 38
**Examples in This Batch**: 50

---

### Examples:

[
  {
    "card_id": "n5_vocab_0123",
    "example_index": 0,
    "target_vocab": {
      "kanji": "無くす",
      "kana": "なくす",
      "meaning": "to lose something"
    },
    "sentence": {
      "japanese": "彼女は新しい時計をなくした。",
      "kana": "かのじょはあたらしいとけいをなくした。",
      "english": "She lost her new watch.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0123",
    "example_index": 1,
    "target_vocab": {
      "kanji": "無くす",
      "kana": "なくす",
      "meaning": "to lose something"
    },
    "sentence": {
      "japanese": "財布をなくしたの。",
      "kana": "さいふをなくしたの。",
      "english": "I have lost my wallet.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0123",
    "example_index": 2,
    "target_vocab": {
      "kanji": "無くす",
      "kana": "なくす",
      "meaning": "to lose something"
    },
    "sentence": {
      "japanese": "時計をなくしました。",
      "kana": "とけいをなくしました。",
      "english": "I lost my watch.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0124",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "スリッパ",
      "meaning": "slippers"
    },
    "sentence": {
      "japanese": "スリッパをはいてください。",
      "kana": "すりっぱをはいてください。",
      "english": "Please put on your slippers.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0124",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "スリッパ",
      "meaning": "slippers"
    },
    "sentence": {
      "japanese": "猫が僕のスリッパの上で寝てるんだ。",
      "kana": "ねこがぼくのすりっぱのうえでねてるんだ。",
      "english": "The cat sleeps on my slippers.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0126",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "ページ",
      "meaning": "page"
    },
    "sentence": {
      "japanese": "その本はページが多かった。",
      "kana": "そのほんはぺーじがおおかった。",
      "english": "That book had a lot of pages.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0126",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "ページ",
      "meaning": "page"
    },
    "sentence": {
      "japanese": "ページの下を読んでください。",
      "kana": "ぺーじのしたをよんでください。",
      "english": "Read the bottom of the page.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0126",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "ページ",
      "meaning": "page"
    },
    "sentence": {
      "japanese": "何ページ？",
      "kana": "なにぺーじ？",
      "english": "What page?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0127",
    "example_index": 0,
    "target_vocab": {
      "kanji": "曇る",
      "kana": "くもる",
      "meaning": "to become cloudy"
    },
    "sentence": {
      "japanese": "曇ってきたようだね。",
      "kana": "くもってきたようだね。",
      "english": "I think it's clouding up.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0127",
    "example_index": 1,
    "target_vocab": {
      "kanji": "曇る",
      "kana": "くもる",
      "meaning": "to become cloudy"
    },
    "sentence": {
      "japanese": "曇っています。",
      "kana": "くもっています。",
      "english": "It's cloudy.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0127",
    "example_index": 2,
    "target_vocab": {
      "kanji": "曇る",
      "kana": "くもる",
      "meaning": "to become cloudy"
    },
    "sentence": {
      "japanese": "曇ってきた。",
      "kana": "くもってきた。",
      "english": "It's getting cloudy.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0128",
    "example_index": 0,
    "target_vocab": {
      "kanji": "辞書",
      "kana": "じしょ",
      "meaning": "dictionary"
    },
    "sentence": {
      "japanese": "この辞書は大きさが手ごろだ。",
      "kana": "このじしょはおおきさがてごろだ。",
      "english": "This dictionary is handy in size.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0128",
    "example_index": 1,
    "target_vocab": {
      "kanji": "辞書",
      "kana": "じしょ",
      "meaning": "dictionary"
    },
    "sentence": {
      "japanese": "その辞書を引くべきである。",
      "kana": "そのじしょをひくべきである。",
      "english": "You should consult the dictionary.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0128",
    "example_index": 2,
    "target_vocab": {
      "kanji": "辞書",
      "kana": "じしょ",
      "meaning": "dictionary"
    },
    "sentence": {
      "japanese": "僕は辞書を持っています。",
      "kana": "ぼくはじしょをもっています。",
      "english": "I have a dictionary.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0130",
    "example_index": 0,
    "target_vocab": {
      "kanji": "海",
      "kana": "うみ",
      "meaning": "sea"
    },
    "sentence": {
      "japanese": "冷たい風は海から吹いている。",
      "kana": "つめたいかぜはうみからふいている。",
      "english": "The cold wind is blowing from the sea.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0130",
    "example_index": 1,
    "target_vocab": {
      "kanji": "海",
      "kana": "うみ",
      "meaning": "sea"
    },
    "sentence": {
      "japanese": "彼は海を渡った。",
      "kana": "かれはうみをわたった。",
      "english": "He crossed over the sea.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0130",
    "example_index": 2,
    "target_vocab": {
      "kanji": "海",
      "kana": "うみ",
      "meaning": "sea"
    },
    "sentence": {
      "japanese": "彼は海の方へ歩いていきました。",
      "kana": "かれはうみのほうへあるいていきました。",
      "english": "He was walking toward the sea.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0131",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "エレベーター",
      "meaning": "elevator"
    },
    "sentence": {
      "japanese": "私達はエレベーターに乗って行った。",
      "kana": "わたしたちはえれべーたーにのっていった。",
      "english": "We rode in an elevator.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0131",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "エレベーター",
      "meaning": "elevator"
    },
    "sentence": {
      "japanese": "エレベーターはどこですか。",
      "kana": "えれべーたーはどこですか。",
      "english": "Where is the elevator?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0131",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "エレベーター",
      "meaning": "elevator"
    },
    "sentence": {
      "japanese": "エレベーター使おうよ。",
      "kana": "えれべーたーつかおうよ。",
      "english": "Let's take the elevator.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0132",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "たぶん",
      "meaning": "probably"
    },
    "sentence": {
      "japanese": "たぶん、明日は雪が降るだろう。",
      "kana": "たぶん、あしたはゆきがふるだろう。",
      "english": "Probably it will snow tomorrow.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0132",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "たぶん",
      "meaning": "probably"
    },
    "sentence": {
      "japanese": "彼女はたぶん明日来るでしょう。",
      "kana": "かのじょはたぶんあしたくるでしょう。",
      "english": "Perhaps she will come tomorrow.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0132",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "たぶん",
      "meaning": "probably"
    },
    "sentence": {
      "japanese": "彼はたぶん後から来るだろう。",
      "kana": "かれはたぶんのちからくるだろう。",
      "english": "No doubt he will come later.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0133",
    "example_index": 0,
    "target_vocab": {
      "kanji": "夕方",
      "kana": "ゆうがた",
      "meaning": "evening"
    },
    "sentence": {
      "japanese": "夕方私は犬と散歩する。",
      "kana": "ゆうがたわたしはいぬとさんぽする。",
      "english": "In the evening, I walk with my dog.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0133",
    "example_index": 1,
    "target_vocab": {
      "kanji": "夕方",
      "kana": "ゆうがた",
      "meaning": "evening"
    },
    "sentence": {
      "japanese": "夕方近く雨が降りだした。",
      "kana": "ゆうがたちかくあめがおりだした。",
      "english": "It came to rain toward evening.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0133",
    "example_index": 2,
    "target_vocab": {
      "kanji": "夕方",
      "kana": "ゆうがた",
      "meaning": "evening"
    },
    "sentence": {
      "japanese": "夕方から雨だっていっていたよ。",
      "kana": "ゆうがたからあめだっていっていたよ。",
      "english": "It said rain from this evening.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0134",
    "example_index": 0,
    "target_vocab": {
      "kanji": "東",
      "kana": "ひがし",
      "meaning": "east"
    },
    "sentence": {
      "japanese": "この町は西も東も分かりません。",
      "kana": "このまちはにしもひがしもわかりません。",
      "english": "I'm quite a stranger in this town.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0134",
    "example_index": 1,
    "target_vocab": {
      "kanji": "東",
      "kana": "ひがし",
      "meaning": "east"
    },
    "sentence": {
      "japanese": "風は東から吹いている。",
      "kana": "かぜはひがしからふいている。",
      "english": "The wind is blowing from the east.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0134",
    "example_index": 2,
    "target_vocab": {
      "kanji": "東",
      "kana": "ひがし",
      "meaning": "east"
    },
    "sentence": {
      "japanese": "風は東に吹いています。",
      "kana": "かぜはひがしにふいています。",
      "english": "The wind is blowing east.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0135",
    "example_index": 0,
    "target_vocab": {
      "kanji": "声",
      "kana": "こえ",
      "meaning": "voice"
    },
    "sentence": {
      "japanese": "もっと大きい声で言ってください。",
      "kana": "もっとおおきいこえでいってください。",
      "english": "Louder, please.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0135",
    "example_index": 1,
    "target_vocab": {
      "kanji": "声",
      "kana": "こえ",
      "meaning": "voice"
    },
    "sentence": {
      "japanese": "英語を声を出して読むべきだ。",
      "kana": "えいごをこえをだしてよむべきだ。",
      "english": "You ought to read English aloud.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0135",
    "example_index": 2,
    "target_vocab": {
      "kanji": "声",
      "kana": "こえ",
      "meaning": "voice"
    },
    "sentence": {
      "japanese": "しーっ、声が大きい。",
      "kana": "しーっ、こえがおおきい。",
      "english": "Shh, you're speaking too loudly.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0136",
    "example_index": 0,
    "target_vocab": {
      "kanji": "撮る",
      "kana": "とる",
      "meaning": "to take a photo or record a film"
    },
    "sentence": {
      "japanese": "写真をとるのは楽しいものだ。",
      "kana": "しゃしんをとるのはたのしいものだ。",
      "english": "I enjoy taking pictures.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0136",
    "example_index": 1,
    "target_vocab": {
      "kanji": "撮る",
      "kana": "とる",
      "meaning": "to take a photo or record a film"
    },
    "sentence": {
      "japanese": "私たちは、昼に休みをとる。",
      "kana": "わたしたちは、ひるにやすみをとる。",
      "english": "We take a rest at noon.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0136",
    "example_index": 2,
    "target_vocab": {
      "kanji": "撮る",
      "kana": "とる",
      "meaning": "to take a photo or record a film"
    },
    "sentence": {
      "japanese": "電話をとるな。",
      "kana": "でんわをとるな。",
      "english": "Don't pick up the phone.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0136",
    "example_index": 3,
    "target_vocab": {
      "kanji": "撮る",
      "kana": "とる",
      "meaning": "to take a photo or record a film"
    },
    "sentence": {
      "japanese": "彼女は写真を撮るのが好きだ。",
      "kana": "かのじょはしゃしんをとるのがすきだ。",
      "english": "She's fond of taking pictures.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0136",
    "example_index": 4,
    "target_vocab": {
      "kanji": "撮る",
      "kana": "とる",
      "meaning": "to take a photo or record a film"
    },
    "sentence": {
      "japanese": "彼は写真を撮るのが上手だ。",
      "kana": "かれはしゃしんをとるのがじょうずだ。",
      "english": "He is good at taking photos.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0136",
    "example_index": 5,
    "target_vocab": {
      "kanji": "撮る",
      "kana": "とる",
      "meaning": "to take a photo or record a film"
    },
    "sentence": {
      "japanese": "写真を撮るのが好きです。",
      "kana": "しゃしんをとるのがすきです。",
      "english": "I'm fond of taking pictures.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0137",
    "example_index": 0,
    "target_vocab": {
      "kanji": "私",
      "kana": "わたくし",
      "meaning": "(humble) I"
    },
    "sentence": {
      "japanese": "私の犬は、どこでも私の行くところへついてくる。",
      "kana": "わたしのいぬは、どこでもわたしのいくところへついてくる。",
      "english": "My dog follows me wherever I go.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0137",
    "example_index": 1,
    "target_vocab": {
      "kanji": "私",
      "kana": "わたくし",
      "meaning": "(humble) I"
    },
    "sentence": {
      "japanese": "とても暗いので私は本が読めない。",
      "kana": "とてもくらいのでわたしはほんがよめない。",
      "english": "It is too dark for me to read.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0137",
    "example_index": 2,
    "target_vocab": {
      "kanji": "私",
      "kana": "わたくし",
      "meaning": "(humble) I"
    },
    "sentence": {
      "japanese": "私は今朝バターつきのパンを食べた。",
      "kana": "わたしはけさばたーつきのぱんをたべた。",
      "english": "I ate bread and butter this morning.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0138",
    "example_index": 0,
    "target_vocab": {
      "kanji": "両親",
      "kana": "りょうしん",
      "meaning": "both parents"
    },
    "sentence": {
      "japanese": "両親は歳を取っている。",
      "kana": "りょうしんはとしをとっている。",
      "english": "My parents are old.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0138",
    "example_index": 1,
    "target_vocab": {
      "kanji": "両親",
      "kana": "りょうしん",
      "meaning": "both parents"
    },
    "sentence": {
      "japanese": "両親は私にそこへ行かせた。",
      "kana": "りょうしんはわたしにそこへいかせた。",
      "english": "My parents had me go there.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0138",
    "example_index": 2,
    "target_vocab": {
      "kanji": "両親",
      "kana": "りょうしん",
      "meaning": "both parents"
    },
    "sentence": {
      "japanese": "彼は両親に手紙を書いた。",
      "kana": "かれはりょうしんにてがみをかいた。",
      "english": "He wrote to his parents.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0139",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "きれい",
      "meaning": "pretty"
    },
    "sentence": {
      "japanese": "妹は部屋をいつもきれいにいておく。",
      "kana": "いもうとはへやをいつもきれいにいておく。",
      "english": "My sister always keeps her room clean.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0139",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "きれい",
      "meaning": "pretty"
    },
    "sentence": {
      "japanese": "彼女は私たちにきれいな帽子を見せた。",
      "kana": "かのじょはわたしたちにきれいなぼうしをみせた。",
      "english": "She showed us a beautiful hat.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0139",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "きれい",
      "meaning": "pretty"
    },
    "sentence": {
      "japanese": "彼女は姉同様きれいだ。",
      "kana": "かのじょはあねどうようきれいだ。",
      "english": "She is no less beautiful than her sister.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0140",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "どうぞ",
      "meaning": "please"
    },
    "sentence": {
      "japanese": "お先にどうぞ。",
      "kana": "おさきにどうぞ。",
      "english": "After you.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0140",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "どうぞ",
      "meaning": "please"
    },
    "sentence": {
      "japanese": "どうぞ、お先に！",
      "kana": "どうぞ、おさきに！",
      "english": "Go ahead!",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0140",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "どうぞ",
      "meaning": "please"
    },
    "sentence": {
      "japanese": "どうぞお体を大切に。",
      "kana": "どうぞおからだをたいせつに。",
      "english": "Please take good care of yourself.",
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
