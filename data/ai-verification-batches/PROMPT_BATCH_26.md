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

**Batch Number**: 26
**Total Batches**: 38
**Examples in This Batch**: 50

---

### Examples:

[
  {
    "card_id": "n5_vocab_0439",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "シャワー",
      "meaning": "shower"
    },
    "sentence": {
      "japanese": "シャワーにするわ。",
      "kana": "しゃわーにするわ。",
      "english": "I'll take a shower.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0440",
    "example_index": 0,
    "target_vocab": {
      "kanji": "散歩",
      "kana": "さんぽする",
      "meaning": "to stroll"
    },
    "sentence": {
      "japanese": "夕方私は犬と散歩する。",
      "kana": "ゆうがたわたしはいぬとさんぽする。",
      "english": "In the evening, I walk with my dog.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0440",
    "example_index": 1,
    "target_vocab": {
      "kanji": "散歩",
      "kana": "さんぽする",
      "meaning": "to stroll"
    },
    "sentence": {
      "japanese": "明日天気ならば私は散歩に出ます。",
      "kana": "あしたてんきならばわたしはさんぽにでます。",
      "english": "I will go for a walk if it is nice tomorrow.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0440",
    "example_index": 2,
    "target_vocab": {
      "kanji": "散歩",
      "kana": "さんぽする",
      "meaning": "to stroll"
    },
    "sentence": {
      "japanese": "僕は夜散歩するのが好きです。",
      "kana": "ぼくはよるさんぽするのがすきです。",
      "english": "I like walking at night.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0441",
    "example_index": 0,
    "target_vocab": {
      "kanji": "三",
      "kana": "さん",
      "meaning": "three"
    },
    "sentence": {
      "japanese": "三日から五日で。",
      "kana": "みっかからいつかで。",
      "english": "Maybe three to five days.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0441",
    "example_index": 1,
    "target_vocab": {
      "kanji": "三",
      "kana": "さん",
      "meaning": "three"
    },
    "sentence": {
      "japanese": "彼は三枚目だ。",
      "kana": "かれはさんまいめだ。",
      "english": "He's a comedian.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0441",
    "example_index": 2,
    "target_vocab": {
      "kanji": "三",
      "kana": "さん",
      "meaning": "three"
    },
    "sentence": {
      "japanese": "彼女には兄弟が三人いる。",
      "kana": "かのじょにはきょうだいがさんにんいる。",
      "english": "She has three brothers.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0441",
    "example_index": 3,
    "target_vocab": {
      "kanji": "三",
      "kana": "さん",
      "meaning": "three"
    },
    "sentence": {
      "japanese": "あなたの妹さんに会いたいものです。",
      "kana": "あなたのいもうとさんにあいたいものです。",
      "english": "I'd like to see your sister.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0441",
    "example_index": 4,
    "target_vocab": {
      "kanji": "三",
      "kana": "さん",
      "meaning": "three"
    },
    "sentence": {
      "japanese": "君の妹さんは何年生なの？",
      "kana": "くんのいもうとさんはなんねんうなの？",
      "english": "What grade is your sister in?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0441",
    "example_index": 5,
    "target_vocab": {
      "kanji": "三",
      "kana": "さん",
      "meaning": "three"
    },
    "sentence": {
      "japanese": "妹さんは元気？",
      "kana": "いもうとさんはげんき？",
      "english": "How's your sister?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0442",
    "example_index": 0,
    "target_vocab": {
      "kanji": "消える",
      "kana": "きえる",
      "meaning": "to disappear"
    },
    "sentence": {
      "japanese": "雪は消えた。",
      "kana": "ゆきはきえた。",
      "english": "The snow has disappeared.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0442",
    "example_index": 1,
    "target_vocab": {
      "kanji": "消える",
      "kana": "きえる",
      "meaning": "to disappear"
    },
    "sentence": {
      "japanese": "私の車が消えていた。",
      "kana": "わたしのくるまがきえていた。",
      "english": "I found my car missing.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0442",
    "example_index": 2,
    "target_vocab": {
      "kanji": "消える",
      "kana": "きえる",
      "meaning": "to disappear"
    },
    "sentence": {
      "japanese": "電気が消えているので、誰もいないらしい。",
      "kana": "でんきがきえているので、だれもいないらしい。",
      "english": "It seems no one is there because the lights are off.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0444",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "いす",
      "meaning": "chair"
    },
    "sentence": {
      "japanese": "彼女は子供をいすに座らせた。",
      "kana": "かのじょはこどもをいすにすわらせた。",
      "english": "She set a child in the chair.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0444",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "いす",
      "meaning": "chair"
    },
    "sentence": {
      "japanese": "彼らはいすとテーブルを使わない。",
      "kana": "かれらはいすとてーぶるをつかわない。",
      "english": "They don't use chairs or tables.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0444",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "いす",
      "meaning": "chair"
    },
    "sentence": {
      "japanese": "先生はいすにすわった。",
      "kana": "せんせいはいすにすわった。",
      "english": "The teacher sat on the chair.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0446",
    "example_index": 0,
    "target_vocab": {
      "kanji": "切る",
      "kana": "きる",
      "meaning": "to cut"
    },
    "sentence": {
      "japanese": "彼女はナイフで手を切った。",
      "kana": "かのじょはないふでてをきった。",
      "english": "She cut her hand on a knife.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0446",
    "example_index": 1,
    "target_vocab": {
      "kanji": "切る",
      "kana": "きる",
      "meaning": "to cut"
    },
    "sentence": {
      "japanese": "彼女はさよならも言わずに電話を切った。",
      "kana": "かのじょはさよならもいわずにでんわをきった。",
      "english": "She hung up without saying good-bye.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0446",
    "example_index": 2,
    "target_vocab": {
      "kanji": "切る",
      "kana": "きる",
      "meaning": "to cut"
    },
    "sentence": {
      "japanese": "彼は封筒を切って開けた。",
      "kana": "かれはふうとうをきってひらけた。",
      "english": "He cut the envelope open.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0448",
    "example_index": 0,
    "target_vocab": {
      "kanji": "洗う",
      "kana": "あらう",
      "meaning": "to wash"
    },
    "sentence": {
      "japanese": "このセーターは洗っても大丈夫です。",
      "kana": "このせーたーはあらってもだいじょうぶです。",
      "english": "This sweater will stand washing.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0448",
    "example_index": 1,
    "target_vocab": {
      "kanji": "洗う",
      "kana": "あらう",
      "meaning": "to wash"
    },
    "sentence": {
      "japanese": "彼は毎週車を洗います。",
      "kana": "かれはまいしゅうくるまをあらいます。",
      "english": "He washes the car every week.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0448",
    "example_index": 2,
    "target_vocab": {
      "kanji": "洗う",
      "kana": "あらう",
      "meaning": "to wash"
    },
    "sentence": {
      "japanese": "彼は体を足から洗いはじめた。",
      "kana": "かれはからだをあしからあらいはじめた。",
      "english": "In washing himself, he started on the legs.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0449",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "あれ",
      "meaning": "that"
    },
    "sentence": {
      "japanese": "あれ、そんなに近いとは知りませんでした。",
      "kana": "あれ、そんなにちかいとはしりませんでした。",
      "english": "Oh, I didn't know it was that close.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0449",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "あれ",
      "meaning": "that"
    },
    "sentence": {
      "japanese": "話し上手といわれる人もあれば、聞き上手といわれる人もいる。",
      "kana": "はなしじょうずといわれるにんもあれば、ききじょうずといわれるにんもいる。",
      "english": "Some are called good talkers, and others good listeners.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0449",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "あれ",
      "meaning": "that"
    },
    "sentence": {
      "japanese": "赤いものもあれば白いのもある。",
      "kana": "あかいものもあればしろいのもある。",
      "english": "Some are red and others are white.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0451",
    "example_index": 0,
    "target_vocab": {
      "kanji": "習う",
      "kana": "ならう",
      "meaning": "to learn"
    },
    "sentence": {
      "japanese": "彼は泳ぎ方を習った。",
      "kana": "かれはおよぎほうをならった。",
      "english": "He learned how to swim.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0451",
    "example_index": 1,
    "target_vocab": {
      "kanji": "習う",
      "kana": "ならう",
      "meaning": "to learn"
    },
    "sentence": {
      "japanese": "私は音楽を習います。",
      "kana": "わたしはおんがくをならいます。",
      "english": "I'm learning music.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0451",
    "example_index": 2,
    "target_vocab": {
      "kanji": "習う",
      "kana": "ならう",
      "meaning": "to learn"
    },
    "sentence": {
      "japanese": "私たちは学校で英語を習います。",
      "kana": "わたしたちはがっこうでえいごをならいます。",
      "english": "We learn English at school.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0452",
    "example_index": 0,
    "target_vocab": {
      "kanji": "後",
      "kana": "あと",
      "meaning": "afterwards"
    },
    "sentence": {
      "japanese": "私は後から行きます。",
      "kana": "わたしはのちからいきます。",
      "english": "I'll join you later.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0452",
    "example_index": 1,
    "target_vocab": {
      "kanji": "後",
      "kana": "あと",
      "meaning": "afterwards"
    },
    "sentence": {
      "japanese": "彼女は後であなたに電話をすると言っています。",
      "kana": "かのじょはあとであなたにでんわをするといっています。",
      "english": "She says she will call you later.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0452",
    "example_index": 2,
    "target_vocab": {
      "kanji": "後",
      "kana": "あと",
      "meaning": "afterwards"
    },
    "sentence": {
      "japanese": "彼は入った後ドアを静かに閉めた。",
      "kana": "かれはいっったのちどあをしずかにしめた。",
      "english": "He closed the door quietly behind him.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0452",
    "example_index": 3,
    "target_vocab": {
      "kanji": "後",
      "kana": "あと",
      "meaning": "afterwards"
    },
    "sentence": {
      "japanese": "彼は三つ食べて、あと三つ食べられるといいました。",
      "kana": "かれはみっつたべて、あとみっつたべられるといいました。",
      "english": "He ate three and said he could eat as many again.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0452",
    "example_index": 4,
    "target_vocab": {
      "kanji": "後",
      "kana": "あと",
      "meaning": "afterwards"
    },
    "sentence": {
      "japanese": "彼はあとから来るよ。",
      "kana": "かれはあとからくるよ。",
      "english": "He will join us later.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0452",
    "example_index": 5,
    "target_vocab": {
      "kanji": "後",
      "kana": "あと",
      "meaning": "afterwards"
    },
    "sentence": {
      "japanese": "彼が死んだあと子供達はどうなるのだろうか。",
      "kana": "かれがしんだあとこどもたちはどうなるのだろうか。",
      "english": "What will become of the children after his death?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0453",
    "example_index": 0,
    "target_vocab": {
      "kanji": "猫",
      "kana": "ねこ",
      "meaning": "cat"
    },
    "sentence": {
      "japanese": "私はネコ派です。",
      "kana": "わたしはねこはです。",
      "english": "I am a cat person.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0453",
    "example_index": 1,
    "target_vocab": {
      "kanji": "猫",
      "kana": "ねこ",
      "meaning": "cat"
    },
    "sentence": {
      "japanese": "ここの家、何匹猫がいるの？",
      "kana": "ここのいえ、なんびきねこがいるの？",
      "english": "How many cats are there in this house?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0453",
    "example_index": 2,
    "target_vocab": {
      "kanji": "猫",
      "kana": "ねこ",
      "meaning": "cat"
    },
    "sentence": {
      "japanese": "彼女はネコが大好きだ。",
      "kana": "かのじょはねこがだいすきだ。",
      "english": "She adores cats.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0453",
    "example_index": 3,
    "target_vocab": {
      "kanji": "猫",
      "kana": "ねこ",
      "meaning": "cat"
    },
    "sentence": {
      "japanese": "いすの上にねこがいます。",
      "kana": "いすのうえにねこがいます。",
      "english": "There is a cat on the chair.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0453",
    "example_index": 4,
    "target_vocab": {
      "kanji": "猫",
      "kana": "ねこ",
      "meaning": "cat"
    },
    "sentence": {
      "japanese": "ねこっかぶり！",
      "kana": "ねこっかぶり！",
      "english": "You hypocrite!",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0457",
    "example_index": 0,
    "target_vocab": {
      "kanji": "大きい",
      "kana": "おおきい",
      "meaning": "big"
    },
    "sentence": {
      "japanese": "この辞書は大きさが手ごろだ。",
      "kana": "このじしょはおおきさがてごろだ。",
      "english": "This dictionary is handy in size.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0457",
    "example_index": 1,
    "target_vocab": {
      "kanji": "大きい",
      "kana": "おおきい",
      "meaning": "big"
    },
    "sentence": {
      "japanese": "町は村よりも大きい。",
      "kana": "まちはむらよりもおおきい。",
      "english": "Towns are larger than villages.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0457",
    "example_index": 2,
    "target_vocab": {
      "kanji": "大きい",
      "kana": "おおきい",
      "meaning": "big"
    },
    "sentence": {
      "japanese": "きみは何と大きい家を持っているんだろう。",
      "kana": "きみはなんとおおきいいえをもっているんだろう。",
      "english": "What a big house you have!",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0459",
    "example_index": 0,
    "target_vocab": {
      "kanji": "歩く",
      "kana": "あるく",
      "meaning": "to walk"
    },
    "sentence": {
      "japanese": "歩いて行きますか？それともバスで行きますか？",
      "kana": "あるいていきますか？それともばすでいきますか？",
      "english": "Will you go on foot or by bus?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0459",
    "example_index": 1,
    "target_vocab": {
      "kanji": "歩く",
      "kana": "あるく",
      "meaning": "to walk"
    },
    "sentence": {
      "japanese": "歩くの疲れたよ。",
      "kana": "あるくのつかれたよ。",
      "english": "I am tired from walking.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0459",
    "example_index": 2,
    "target_vocab": {
      "kanji": "歩く",
      "kana": "あるく",
      "meaning": "to walk"
    },
    "sentence": {
      "japanese": "僕は彼女と一緒に歩いている。",
      "kana": "ぼくはかのじょといっしょにあるいている。",
      "english": "I'm walking beside her.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0460",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "ズボン",
      "meaning": "trousers"
    },
    "sentence": {
      "japanese": "彼は赤いズボンをはいていた。",
      "kana": "かれはあかいずぼんをはいていた。",
      "english": "He wore red pants.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0460",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "ズボン",
      "meaning": "trousers"
    },
    "sentence": {
      "japanese": "私はズボンをはいた。",
      "kana": "わたしはずぼんをはいた。",
      "english": "I put on my trousers.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0460",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "ズボン",
      "meaning": "trousers"
    },
    "sentence": {
      "japanese": "それは僕のズボンです。",
      "kana": "それはぼくのずぼんです。",
      "english": "Those are my trousers.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0462",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "そっち",
      "meaning": "over there"
    },
    "sentence": {
      "japanese": "そっちの本は私のです。",
      "kana": "そっちのほんはわたしのです。",
      "english": "Those books are mine.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0462",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "そっち",
      "meaning": "over there"
    },
    "sentence": {
      "japanese": "そっちの天気は？",
      "kana": "そっちのてんきは？",
      "english": "How's the weather there?",
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
