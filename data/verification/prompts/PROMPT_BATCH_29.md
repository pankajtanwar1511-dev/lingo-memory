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

**Batch Number**: 29
**Total Batches**: 38
**Examples in This Batch**: 50

---

### Examples:

[
  {
    "card_id": "n5_vocab_0496",
    "example_index": 2,
    "target_vocab": {
      "kanji": "前",
      "kana": "まえ",
      "meaning": "before"
    },
    "sentence": {
      "japanese": "私は前もってあなたに知らせる。",
      "kana": "わたしはまえもってあなたにしらせる。",
      "english": "I will let you know in advance.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0496",
    "example_index": 3,
    "target_vocab": {
      "kanji": "前",
      "kana": "まえ",
      "meaning": "before"
    },
    "sentence": {
      "japanese": "困ったら私のところへきたまえ。",
      "kana": "こまったらわたしのところへきたまえ。",
      "english": "Come to me if you are in difficulties.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0496",
    "example_index": 4,
    "target_vocab": {
      "kanji": "前",
      "kana": "まえ",
      "meaning": "before"
    },
    "sentence": {
      "japanese": "さあ話したまえ。",
      "kana": "さあはなしたまえ。",
      "english": "Now tell me.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0496",
    "example_index": 5,
    "target_vocab": {
      "kanji": "前",
      "kana": "まえ",
      "meaning": "before"
    },
    "sentence": {
      "japanese": "さあ、来たまえ。",
      "kana": "さあ、きたまえ。",
      "english": "Come along.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0497",
    "example_index": 0,
    "target_vocab": {
      "kanji": "来る",
      "kana": "くる",
      "meaning": "to come"
    },
    "sentence": {
      "japanese": "私の犬は、どこでも私の行くところへついてくる。",
      "kana": "わたしのいぬは、どこでもわたしのいくところへついてくる。",
      "english": "My dog follows me wherever I go.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0497",
    "example_index": 1,
    "target_vocab": {
      "kanji": "来る",
      "kana": "くる",
      "meaning": "to come"
    },
    "sentence": {
      "japanese": "ほら、あなたの乗る電車が来たわ。",
      "kana": "ほら、あなたののるでんしゃがきたわ。",
      "english": "Look, here comes your train.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0497",
    "example_index": 2,
    "target_vocab": {
      "kanji": "来る",
      "kana": "くる",
      "meaning": "to come"
    },
    "sentence": {
      "japanese": "にわかに雨が降ってきた。",
      "kana": "にわかにあめがふってきた。",
      "english": "Suddenly, the rain fell.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0497",
    "example_index": 3,
    "target_vocab": {
      "kanji": "来る",
      "kana": "くる",
      "meaning": "to come"
    },
    "sentence": {
      "japanese": "私の犬は、どこでも私の行くところへついてくる。",
      "kana": "わたしのいぬは、どこでもわたしのいくところへついてくる。",
      "english": "My dog follows me wherever I go.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0497",
    "example_index": 4,
    "target_vocab": {
      "kanji": "来る",
      "kana": "くる",
      "meaning": "to come"
    },
    "sentence": {
      "japanese": "これは頭にくる。",
      "kana": "これはあたまにくる。",
      "english": "This is making me really angry.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0497",
    "example_index": 5,
    "target_vocab": {
      "kanji": "来る",
      "kana": "くる",
      "meaning": "to come"
    },
    "sentence": {
      "japanese": "来週になると一家族が入ってくる。",
      "kana": "らいしゅうになるとひとかぞくがいっってくる。",
      "english": "Next week a family will move in.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0498",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "おもしろい",
      "meaning": "interesting"
    },
    "sentence": {
      "japanese": "本を読むのはとてもおもしろい。",
      "kana": "ほんをよむのはとてもおもしろい。",
      "english": "Reading books is very interesting.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0498",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "おもしろい",
      "meaning": "interesting"
    },
    "sentence": {
      "japanese": "彼は私にその本はおもしろいと言った。",
      "kana": "かれはわたしにそのほんはおもしろいといった。",
      "english": "He told me that the book was interesting.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0498",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "おもしろい",
      "meaning": "interesting"
    },
    "sentence": {
      "japanese": "彼はとてもおもしろい本を持っています。",
      "kana": "かれはとてもおもしろいほんをもっています。",
      "english": "He has an interesting book.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0499",
    "example_index": 0,
    "target_vocab": {
      "kanji": "貸す",
      "kana": "かす",
      "meaning": "to lend"
    },
    "sentence": {
      "japanese": "いつでも私の車を貸してあげますよ。",
      "kana": "いつでもわたしのくるまをかしてあげますよ。",
      "english": "You can borrow my car anytime.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0499",
    "example_index": 1,
    "target_vocab": {
      "kanji": "貸す",
      "kana": "かす",
      "meaning": "to lend"
    },
    "sentence": {
      "japanese": "明日君の車を貸してください。",
      "kana": "あしたくんのくるまをかしてください。",
      "english": "Lend me your car tomorrow.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0499",
    "example_index": 2,
    "target_vocab": {
      "kanji": "貸す",
      "kana": "かす",
      "meaning": "to lend"
    },
    "sentence": {
      "japanese": "彼女は学生に部屋を貸している。",
      "kana": "かのじょはがくせいにへやをかしている。",
      "english": "She rents a room to a student.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0500",
    "example_index": 0,
    "target_vocab": {
      "kanji": "早い",
      "kana": "はやい",
      "meaning": "early"
    },
    "sentence": {
      "japanese": "タクシーよりも歩くほうがはやいだろう。",
      "kana": "たくしーよりもあるくほうがはやいだろう。",
      "english": "It'll be quicker to walk than to take a taxi.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0500",
    "example_index": 1,
    "target_vocab": {
      "kanji": "早い",
      "kana": "はやい",
      "meaning": "early"
    },
    "sentence": {
      "japanese": "おや、今朝は早いですね。",
      "kana": "おや、けさははやいですね。",
      "english": "Oh, you are early this morning.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0500",
    "example_index": 2,
    "target_vocab": {
      "kanji": "早い",
      "kana": "はやい",
      "meaning": "early"
    },
    "sentence": {
      "japanese": "彼は耳が早い。",
      "kana": "かれはみみがはやい。",
      "english": "He is quick to learn.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0500",
    "example_index": 3,
    "target_vocab": {
      "kanji": "早い",
      "kana": "はやい",
      "meaning": "early"
    },
    "sentence": {
      "japanese": "なんでもっと早くここに来なかったのだ。",
      "kana": "なんでもっとはやくここにこなかったのだ。",
      "english": "Why didn't you get here sooner?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0501",
    "example_index": 0,
    "target_vocab": {
      "kanji": "弱い",
      "kana": "よわい",
      "meaning": "weak"
    },
    "sentence": {
      "japanese": "それを言われると弱いなあ。",
      "kana": "それをいわれるとよわいなあ。",
      "english": "That sure puts me on the spot.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0501",
    "example_index": 1,
    "target_vocab": {
      "kanji": "弱い",
      "kana": "よわい",
      "meaning": "weak"
    },
    "sentence": {
      "japanese": "彼は体の弱い子供だった。",
      "kana": "かれはからだのよわいこどもだった。",
      "english": "He was a weak and delicate child.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0501",
    "example_index": 2,
    "target_vocab": {
      "kanji": "弱い",
      "kana": "よわい",
      "meaning": "weak"
    },
    "sentence": {
      "japanese": "彼女は暑さには弱いんです。",
      "kana": "かのじょはあつさにはよわいんです。",
      "english": "She is sensitive to the heat.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0502",
    "example_index": 0,
    "target_vocab": {
      "kanji": "洗濯",
      "kana": "せんたく",
      "meaning": "washing"
    },
    "sentence": {
      "japanese": "洗濯物入れてきて。",
      "kana": "せんたくものいれてきて。",
      "english": "Bring the laundry in.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0502",
    "example_index": 1,
    "target_vocab": {
      "kanji": "洗濯",
      "kana": "せんたく",
      "meaning": "washing"
    },
    "sentence": {
      "japanese": "洗濯は私の仕事です。",
      "kana": "せんたくはわたしのしごとです。",
      "english": "Washing clothes is my work.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0502",
    "example_index": 2,
    "target_vocab": {
      "kanji": "洗濯",
      "kana": "せんたく",
      "meaning": "washing"
    },
    "sentence": {
      "japanese": "洗濯物はどこですか？",
      "kana": "せんたくものはどこですか？",
      "english": "Where is the laundry?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0504",
    "example_index": 0,
    "target_vocab": {
      "kanji": "来年",
      "kana": "らいねん",
      "meaning": "next year"
    },
    "sentence": {
      "japanese": "彼は来年外国旅行をする。",
      "kana": "かれはらいねんがいこくりょこうをする。",
      "english": "He will travel abroad next year.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0504",
    "example_index": 1,
    "target_vocab": {
      "kanji": "来年",
      "kana": "らいねん",
      "meaning": "next year"
    },
    "sentence": {
      "japanese": "来年は彼に会えるだろうか。",
      "kana": "らいねんはかれにあえるだろうか。",
      "english": "I'll be able to see him next year.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0504",
    "example_index": 2,
    "target_vocab": {
      "kanji": "来年",
      "kana": "らいねん",
      "meaning": "next year"
    },
    "sentence": {
      "japanese": "来年は会えるでしょう。",
      "kana": "らいねんはあえるでしょう。",
      "english": "I'll be able to see you next year.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0505",
    "example_index": 0,
    "target_vocab": {
      "kanji": "眼鏡",
      "kana": "めがね",
      "meaning": "glasses"
    },
    "sentence": {
      "japanese": "私はメガネがなくては読めない。",
      "kana": "わたしはめがねがなくてはよめない。",
      "english": "I cannot read without glasses.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0505",
    "example_index": 1,
    "target_vocab": {
      "kanji": "眼鏡",
      "kana": "めがね",
      "meaning": "glasses"
    },
    "sentence": {
      "japanese": "私はどこにメガネを置いたのだろう。",
      "kana": "わたしはどこにめがねをおいたのだろう。",
      "english": "I wonder where I put my glasses.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0505",
    "example_index": 2,
    "target_vocab": {
      "kanji": "眼鏡",
      "kana": "めがね",
      "meaning": "glasses"
    },
    "sentence": {
      "japanese": "私は、彼に、私の眼鏡を取りに私の部屋へ行くように頼んだ。",
      "kana": "わたしは、かれに、わたしのめがねをとりにわたしのへやへいくようにたのんだ。",
      "english": "I asked him to go to my room for my glasses.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0505",
    "example_index": 3,
    "target_vocab": {
      "kanji": "眼鏡",
      "kana": "めがね",
      "meaning": "glasses"
    },
    "sentence": {
      "japanese": "私のめがねを取って。",
      "kana": "わたしのめがねをとって。",
      "english": "Get me my glasses.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0505",
    "example_index": 4,
    "target_vocab": {
      "kanji": "眼鏡",
      "kana": "めがね",
      "meaning": "glasses"
    },
    "sentence": {
      "japanese": "私のめがねを持ってきて。",
      "kana": "わたしのめがねをもってきて。",
      "english": "Bring me my glasses.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0506",
    "example_index": 0,
    "target_vocab": {
      "kanji": "背",
      "kana": "せ",
      "meaning": "height"
    },
    "sentence": {
      "japanese": "私の姉は君より背が低い。",
      "kana": "わたしのあねはくんよりせがひくい。",
      "english": "My sister is shorter than you.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0506",
    "example_index": 1,
    "target_vocab": {
      "kanji": "背",
      "kana": "せ",
      "meaning": "height"
    },
    "sentence": {
      "japanese": "彼女は昨日背の高い男の人に会いました。",
      "kana": "かのじょはきのうせのたかいおとこのにんにあいました。",
      "english": "She saw a tall man yesterday.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0506",
    "example_index": 2,
    "target_vocab": {
      "kanji": "背",
      "kana": "せ",
      "meaning": "height"
    },
    "sentence": {
      "japanese": "彼女は君と同じ背の高さだ。",
      "kana": "かのじょはくんとおなじせのたかさだ。",
      "english": "She is as tall as you.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0506",
    "example_index": 3,
    "target_vocab": {
      "kanji": "背",
      "kana": "せ",
      "meaning": "height"
    },
    "sentence": {
      "japanese": "私は彼にそのビッグニュースを知らせた。",
      "kana": "わたしはかれにそのびっぐにゅーすをしらせた。",
      "english": "I told him the big news.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0506",
    "example_index": 4,
    "target_vocab": {
      "kanji": "背",
      "kana": "せ",
      "meaning": "height"
    },
    "sentence": {
      "japanese": "両親は私にそこへ行かせた。",
      "kana": "りょうしんはわたしにそこへいかせた。",
      "english": "My parents had me go there.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0506",
    "example_index": 5,
    "target_vocab": {
      "kanji": "背",
      "kana": "せ",
      "meaning": "height"
    },
    "sentence": {
      "japanese": "明日１日休ませてください。",
      "kana": "あした１にちきゅうませてください。",
      "english": "Will you let me have a holiday tomorrow?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0509",
    "example_index": 0,
    "target_vocab": {
      "kanji": "同じ",
      "kana": "おなじ",
      "meaning": "same"
    },
    "sentence": {
      "japanese": "彼女はあなたが持っているのと同じようなかばんを持っている。",
      "kana": "かのじょはあなたがもっているのとおなじようなかばんをもっている。",
      "english": "She has the same bag as you have.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0509",
    "example_index": 1,
    "target_vocab": {
      "kanji": "同じ",
      "kana": "おなじ",
      "meaning": "same"
    },
    "sentence": {
      "japanese": "君と僕とは同じ年だ。",
      "kana": "くんとぼくとはおなじねんだ。",
      "english": "You and I are the same age.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0509",
    "example_index": 2,
    "target_vocab": {
      "kanji": "同じ",
      "kana": "おなじ",
      "meaning": "same"
    },
    "sentence": {
      "japanese": "私たちは２人とも同じクラスです。",
      "kana": "わたしたちは２にんともおなじくらすです。",
      "english": "We are both in the same class.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0510",
    "example_index": 0,
    "target_vocab": {
      "kanji": "弾く",
      "kana": "ひく",
      "meaning": "to play an instrument with strings"
    },
    "sentence": {
      "japanese": "私はいつも冬に風邪をひく。",
      "kana": "わたしはいつもふゆにかぜをひく。",
      "english": "I always catch a cold in the winter.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0510",
    "example_index": 1,
    "target_vocab": {
      "kanji": "弾く",
      "kana": "ひく",
      "meaning": "to play an instrument with strings"
    },
    "sentence": {
      "japanese": "私はよく風邪をひく。",
      "kana": "わたしはよくかぜをひく。",
      "english": "I often catch cold.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0510",
    "example_index": 2,
    "target_vocab": {
      "kanji": "弾く",
      "kana": "ひく",
      "meaning": "to play an instrument with strings"
    },
    "sentence": {
      "japanese": "ギターをひくのはおもしろい。",
      "kana": "ぎたーをひくのはおもしろい。",
      "english": "Playing the guitar is fun.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0510",
    "example_index": 3,
    "target_vocab": {
      "kanji": "弾く",
      "kana": "ひく",
      "meaning": "to play an instrument with strings"
    },
    "sentence": {
      "japanese": "僕はギターを弾くのが好きだ。",
      "kana": "ぼくはぎたーをひくのがすきだ。",
      "english": "I am fond of playing the guitar.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0510",
    "example_index": 4,
    "target_vocab": {
      "kanji": "弾く",
      "kana": "ひく",
      "meaning": "to play an instrument with strings"
    },
    "sentence": {
      "japanese": "彼女はギターを弾くのが上手だ。",
      "kana": "かのじょはぎたーをひくのがじょうずだ。",
      "english": "She is good at playing the guitar.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0510",
    "example_index": 5,
    "target_vocab": {
      "kanji": "弾く",
      "kana": "ひく",
      "meaning": "to play an instrument with strings"
    },
    "sentence": {
      "japanese": "彼女はギターを弾きます。",
      "kana": "かのじょはぎたーをひきます。",
      "english": "She plays the guitar.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0512",
    "example_index": 0,
    "target_vocab": {
      "kanji": "階段",
      "kana": "かいだん",
      "meaning": "stairs"
    },
    "sentence": {
      "japanese": "なんて狭い階段なんだ！",
      "kana": "なんてせまいかいだんなんだ！",
      "english": "What narrow stairs!",
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
