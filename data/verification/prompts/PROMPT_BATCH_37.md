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

**Batch Number**: 37
**Total Batches**: 38
**Examples in This Batch**: 50

---

### Examples:

[
  {
    "card_id": "n5_vocab_0637",
    "example_index": 2,
    "target_vocab": {
      "kanji": "紅茶",
      "kana": "こうちゃ",
      "meaning": "black tea"
    },
    "sentence": {
      "japanese": "私は紅茶よりコーヒーが好き。",
      "kana": "わたしはこうちゃよりこーひーがすき。",
      "english": "I prefer coffee to tea.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0638",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "そちら",
      "meaning": "over there"
    },
    "sentence": {
      "japanese": "わたしは彼がそちらに着いたのか聞いていない。",
      "kana": "わたしはかれがそちらについたのかきいていない。",
      "english": "I have not yet learned whether he reached there or not.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0638",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "そちら",
      "meaning": "over there"
    },
    "sentence": {
      "japanese": "そちらは暑いですか。",
      "kana": "そちらはあついですか。",
      "english": "Is it hot over there?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0638",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "そちら",
      "meaning": "over there"
    },
    "sentence": {
      "japanese": "そちらの天気はいかがですか。",
      "kana": "そちらのてんきはいかがですか。",
      "english": "How's the weather there?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0639",
    "example_index": 0,
    "target_vocab": {
      "kanji": "出かける",
      "kana": "でかける",
      "meaning": "to go out"
    },
    "sentence": {
      "japanese": "彼女はちょうど買い物に出かけるところです。",
      "kana": "かのじょはちょうどかいものにでかけるところです。",
      "english": "She is just going shopping.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0639",
    "example_index": 1,
    "target_vocab": {
      "kanji": "出かける",
      "kana": "でかける",
      "meaning": "to go out"
    },
    "sentence": {
      "japanese": "彼は毎日散歩に出かけると言った。",
      "kana": "かれはまいにちさんぽにでかけるといった。",
      "english": "He said that he takes a walk every day.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0639",
    "example_index": 2,
    "target_vocab": {
      "kanji": "出かける",
      "kana": "でかける",
      "meaning": "to go out"
    },
    "sentence": {
      "japanese": "彼は時々そこに出かける。",
      "kana": "かれはときどきそこにでかける。",
      "english": "He goes there now and again.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0639",
    "example_index": 3,
    "target_vocab": {
      "kanji": "出かける",
      "kana": "でかける",
      "meaning": "to go out"
    },
    "sentence": {
      "japanese": "時々散歩にでかける。",
      "kana": "ときどきさんぽにでかける。",
      "english": "I sometimes go out for a walk.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0640",
    "example_index": 0,
    "target_vocab": {
      "kanji": "兄",
      "kana": "あに",
      "meaning": "(humble) older brother"
    },
    "sentence": {
      "japanese": "私の兄は大学生です。",
      "kana": "わたしのあにはだいがくせいです。",
      "english": "My brother is a college student.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0640",
    "example_index": 1,
    "target_vocab": {
      "kanji": "兄",
      "kana": "あに",
      "meaning": "(humble) older brother"
    },
    "sentence": {
      "japanese": "はい、お兄ちゃん、半分こ。",
      "kana": "はい、おにいちゃん、はんぶんこ。",
      "english": "Here, bro, halfsies.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0640",
    "example_index": 2,
    "target_vocab": {
      "kanji": "兄",
      "kana": "あに",
      "meaning": "(humble) older brother"
    },
    "sentence": {
      "japanese": "僕には兄さんが一人と妹が二人いる。",
      "kana": "ぼくにはにいさんがひとりといもうとがふたりいる。",
      "english": "I have one big brother and two little sisters.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0643",
    "example_index": 0,
    "target_vocab": {
      "kanji": "締める",
      "kana": "しめる",
      "meaning": "to tie"
    },
    "sentence": {
      "japanese": "門を閉める時間だ。",
      "kana": "もんをしめるじかんだ。",
      "english": "It is time to shut the gate.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0643",
    "example_index": 1,
    "target_vocab": {
      "kanji": "締める",
      "kana": "しめる",
      "meaning": "to tie"
    },
    "sentence": {
      "japanese": "部屋の窓は閉めておくように。",
      "kana": "へやのまどはしめておくように。",
      "english": "See that the windows in your room are fastened.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0643",
    "example_index": 2,
    "target_vocab": {
      "kanji": "締める",
      "kana": "しめる",
      "meaning": "to tie"
    },
    "sentence": {
      "japanese": "彼女は戸を押して閉めた。",
      "kana": "かのじょはこをおしてしめた。",
      "english": "She pushed the door shut.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0644",
    "example_index": 0,
    "target_vocab": {
      "kanji": "熱い",
      "kana": "あつい",
      "meaning": "hot to the touch"
    },
    "sentence": {
      "japanese": "熱いコーヒーを入れてあげましょう。",
      "kana": "あついこーひーをいれてあげましょう。",
      "english": "I'll serve you a cup of nice and hot coffee.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0644",
    "example_index": 1,
    "target_vocab": {
      "kanji": "熱い",
      "kana": "あつい",
      "meaning": "hot to the touch"
    },
    "sentence": {
      "japanese": "そのコーヒーは非常に熱くて私には飲めなかった。",
      "kana": "そのこーひーはひじょうにあつくてわたしにはのめなかった。",
      "english": "The coffee was so hot that I couldn't drink it.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0644",
    "example_index": 2,
    "target_vocab": {
      "kanji": "熱い",
      "kana": "あつい",
      "meaning": "hot to the touch"
    },
    "sentence": {
      "japanese": "コーヒーは熱いのが好きだ。",
      "kana": "こーひーはあついのがすきだ。",
      "english": "I like coffee hot.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0646",
    "example_index": 0,
    "target_vocab": {
      "kanji": "細い",
      "kana": "ほそい",
      "meaning": "thin"
    },
    "sentence": {
      "japanese": "その細っこい体のどこに入るんだ？",
      "kana": "そのこまっこいからだのどこにいるんだ？",
      "english": "In that slender body, where does it all go?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0646",
    "example_index": 1,
    "target_vocab": {
      "kanji": "細い",
      "kana": "ほそい",
      "meaning": "thin"
    },
    "sentence": {
      "japanese": "彼は先の細い鉛筆を使う。",
      "kana": "かれはさきのこまいえんぴつをつかう。",
      "english": "He uses a pencil with a fine point.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0648",
    "example_index": 0,
    "target_vocab": {
      "kanji": "本棚",
      "kana": "ほんだな",
      "meaning": "bookshelves"
    },
    "sentence": {
      "japanese": "彼は本棚にたくさんの本を置いている。",
      "kana": "かれはほんだなにたくさんのほんをおいている。",
      "english": "He has a large number of books on his bookshelf.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0648",
    "example_index": 1,
    "target_vocab": {
      "kanji": "本棚",
      "kana": "ほんだな",
      "meaning": "bookshelves"
    },
    "sentence": {
      "japanese": "彼は彼女に本棚を作ってあげました。",
      "kana": "かれはかのじょにほんだなをつくってあげました。",
      "english": "He made her a bookshelf.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0648",
    "example_index": 2,
    "target_vocab": {
      "kanji": "本棚",
      "kana": "ほんだな",
      "meaning": "bookshelves"
    },
    "sentence": {
      "japanese": "本棚の本は全部読んだよ。",
      "kana": "ほんだなのほんはぜんぶよんだよ。",
      "english": "All of the books on the bookshelf have been read.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0649",
    "example_index": 0,
    "target_vocab": {
      "kanji": "結構",
      "kana": "けっこう",
      "meaning": "splendid"
    },
    "sentence": {
      "japanese": "行って結構です。",
      "kana": "いってけっこうです。",
      "english": "You can go now, sir.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0649",
    "example_index": 1,
    "target_vocab": {
      "kanji": "結構",
      "kana": "けっこう",
      "meaning": "splendid"
    },
    "sentence": {
      "japanese": "結構です。どうぞ。",
      "kana": "けっこうです。どうぞ。",
      "english": "OK. Go ahead.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0649",
    "example_index": 2,
    "target_vocab": {
      "kanji": "結構",
      "kana": "けっこう",
      "meaning": "splendid"
    },
    "sentence": {
      "japanese": "いえ結構、もう十分です。",
      "kana": "いえけっこう、もうじゅうぶんです。",
      "english": "No, thank you. I'm full.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0649",
    "example_index": 3,
    "target_vocab": {
      "kanji": "結構",
      "kana": "けっこう",
      "meaning": "splendid"
    },
    "sentence": {
      "japanese": "今日はけっこう風が強いね。",
      "kana": "こんにちはけっこうかぜがつよいね。",
      "english": "It's pretty windy today, no?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0650",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "こちら",
      "meaning": "this person or way"
    },
    "sentence": {
      "japanese": "私はといえば、こちらの方が好きです。",
      "kana": "わたしはといえば、こちらのほうがすきです。",
      "english": "For me, I like this better.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0650",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "こちら",
      "meaning": "this person or way"
    },
    "sentence": {
      "japanese": "ほら彼がこちらに来るよ。",
      "kana": "ほらかれがこちらにくるよ。",
      "english": "Here he comes.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0650",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "こちら",
      "meaning": "this person or way"
    },
    "sentence": {
      "japanese": "こちらは初めてですか。",
      "kana": "こちらははじめてですか。",
      "english": "Is this your first visit here?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0651",
    "example_index": 0,
    "target_vocab": {
      "kanji": "昨夜",
      "kana": "ゆうべ",
      "meaning": "last night"
    },
    "sentence": {
      "japanese": "昨夜は、遅かったんです。",
      "kana": "さくやは、おそかったんです。",
      "english": "I stayed up late last night.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0651",
    "example_index": 1,
    "target_vocab": {
      "kanji": "昨夜",
      "kana": "ゆうべ",
      "meaning": "last night"
    },
    "sentence": {
      "japanese": "彼は昨夜テレビに出た。",
      "kana": "かれはさくやてれびにでた。",
      "english": "He appeared on TV last night.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0651",
    "example_index": 2,
    "target_vocab": {
      "kanji": "昨夜",
      "kana": "ゆうべ",
      "meaning": "last night"
    },
    "sentence": {
      "japanese": "彼はゆうべの寒さで死んだ。",
      "kana": "かれはゆうべのさむさでしんだ。",
      "english": "He died from the cold last night.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0651",
    "example_index": 3,
    "target_vocab": {
      "kanji": "昨夜",
      "kana": "ゆうべ",
      "meaning": "last night"
    },
    "sentence": {
      "japanese": "彼はゆうべの寒さで死んだ。",
      "kana": "かれはゆうべのさむさでしんだ。",
      "english": "He died from the cold last night.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0651",
    "example_index": 4,
    "target_vocab": {
      "kanji": "昨夜",
      "kana": "ゆうべ",
      "meaning": "last night"
    },
    "sentence": {
      "japanese": "ゆうべ彼女が来ていたらなあ。",
      "kana": "ゆうべかのじょがきていたらなあ。",
      "english": "I wish she had come last night.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0651",
    "example_index": 5,
    "target_vocab": {
      "kanji": "昨夜",
      "kana": "ゆうべ",
      "meaning": "last night"
    },
    "sentence": {
      "japanese": "ゆうべは疲れていたので、早く寝ました。",
      "kana": "ゆうべはつかれていたので、はやくねました。",
      "english": "I was tired last night, so I went to bed early.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0653",
    "example_index": 0,
    "target_vocab": {
      "kanji": "絵",
      "kana": "え",
      "meaning": "picture"
    },
    "sentence": {
      "japanese": "彼女は絵をみる目がある。",
      "kana": "かのじょはえをみるめがある。",
      "english": "She's got a good eye for paintings.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0653",
    "example_index": 1,
    "target_vocab": {
      "kanji": "絵",
      "kana": "え",
      "meaning": "picture"
    },
    "sentence": {
      "japanese": "彼女はどんなに忙しくても毎日絵を書く。",
      "kana": "かのじょはどんなにいそがしくてもまいにちえをかく。",
      "english": "She paints every day no matter how busy she is.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0653",
    "example_index": 2,
    "target_vocab": {
      "kanji": "絵",
      "kana": "え",
      "meaning": "picture"
    },
    "sentence": {
      "japanese": "彼は犬の絵を書いた。",
      "kana": "かれはいぬのえをかいた。",
      "english": "He painted a picture of a dog.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0653",
    "example_index": 3,
    "target_vocab": {
      "kanji": "絵",
      "kana": "え",
      "meaning": "picture"
    },
    "sentence": {
      "japanese": "彼は言われたようにせざるをえなかった。",
      "kana": "かれはいわれたようにせざるをえなかった。",
      "english": "He had no choice but to do as he was told.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0653",
    "example_index": 4,
    "target_vocab": {
      "kanji": "絵",
      "kana": "え",
      "meaning": "picture"
    },
    "sentence": {
      "japanese": "私はまえもってあなたに知らせるだろう。",
      "kana": "わたしはまえもってあなたにしらせるだろう。",
      "english": "I'll let you know in advance.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0653",
    "example_index": 5,
    "target_vocab": {
      "kanji": "絵",
      "kana": "え",
      "meaning": "picture"
    },
    "sentence": {
      "japanese": "いえ結構、もう十分です。",
      "kana": "いえけっこう、もうじゅうぶんです。",
      "english": "No, thank you. I'm full.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0654",
    "example_index": 0,
    "target_vocab": {
      "kanji": "使う",
      "kana": "つかう",
      "meaning": "to use"
    },
    "sentence": {
      "japanese": "あの窓のそばの机は使うな。",
      "kana": "あのまどのそばのつくえはつかうな。",
      "english": "Don't use the desk by that window.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0654",
    "example_index": 1,
    "target_vocab": {
      "kanji": "使う",
      "kana": "つかう",
      "meaning": "to use"
    },
    "sentence": {
      "japanese": "この部屋は先生方に使われています。",
      "kana": "このへやはせんせいがたにつかわれています。",
      "english": "This room is used by teachers.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0654",
    "example_index": 2,
    "target_vocab": {
      "kanji": "使う",
      "kana": "つかう",
      "meaning": "to use"
    },
    "sentence": {
      "japanese": "その古い置き時計はまだ使われている。",
      "kana": "そのふるいおきどけいはまだつかわれている。",
      "english": "The old clock is still in use.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0655",
    "example_index": 0,
    "target_vocab": {
      "kanji": "休む",
      "kana": "やすむ",
      "meaning": "to rest"
    },
    "sentence": {
      "japanese": "木の下でちょっと休もうよ。",
      "kana": "きのしたでちょっとやすもうよ。",
      "english": "Let's take a little rest under the tree.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0655",
    "example_index": 1,
    "target_vocab": {
      "kanji": "休む",
      "kana": "やすむ",
      "meaning": "to rest"
    },
    "sentence": {
      "japanese": "明日は休みます。",
      "kana": "あしたはやすみます。",
      "english": "I'll be absent tomorrow.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0655",
    "example_index": 2,
    "target_vocab": {
      "kanji": "休む",
      "kana": "やすむ",
      "meaning": "to rest"
    },
    "sentence": {
      "japanese": "明日１日休ませてください。",
      "kana": "あした１にちきゅうませてください。",
      "english": "Will you let me have a holiday tomorrow?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0656",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "テスト",
      "meaning": "test"
    },
    "sentence": {
      "japanese": "テストで一問も答えられなかった。",
      "kana": "てすとでいちもんもこたえられなかった。",
      "english": "I couldn't answer any questions on the test.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0656",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "テスト",
      "meaning": "test"
    },
    "sentence": {
      "japanese": "来週からテストが始まる。",
      "kana": "らいしゅうからてすとがはじまる。",
      "english": "Tests start next week.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0656",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "テスト",
      "meaning": "test"
    },
    "sentence": {
      "japanese": "今日のテストは去年のと同じだった、と誰かが言った。",
      "kana": "きょうのてすとはきょねんのとおなじだった、とだれかがいった。",
      "english": "Somebody told me that today's test was identical to the one we had last year.",
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
