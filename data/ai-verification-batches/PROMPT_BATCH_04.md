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

**Batch Number**: 4
**Total Batches**: 38
**Examples in This Batch**: 50

---

### Examples:

[
  {
    "card_id": "n5_vocab_0055",
    "example_index": 4,
    "target_vocab": {
      "kanji": "分かる",
      "kana": "わかる",
      "meaning": "to be understood"
    },
    "sentence": {
      "japanese": "彼女に会うのはむずかしいとわかるだろう。",
      "kana": "かのじょにあうのはむずかしいとわかるだろう。",
      "english": "You'll find it difficult to meet her.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0055",
    "example_index": 5,
    "target_vocab": {
      "kanji": "分かる",
      "kana": "わかる",
      "meaning": "to be understood"
    },
    "sentence": {
      "japanese": "彼は音楽がわかる。",
      "kana": "かれはおんがくがわかる。",
      "english": "He has an ear for music.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0056",
    "example_index": 0,
    "target_vocab": {
      "kanji": "言う",
      "kana": "いう",
      "meaning": "to say"
    },
    "sentence": {
      "japanese": "あからさまに言えば彼は嫌いだ。",
      "kana": "あからさまにいえばかれはきらいだ。",
      "english": "Frankly, I don't like him.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0056",
    "example_index": 1,
    "target_vocab": {
      "kanji": "言う",
      "kana": "いう",
      "meaning": "to say"
    },
    "sentence": {
      "japanese": "それを言われると弱いなあ。",
      "kana": "それをいわれるとよわいなあ。",
      "english": "That sure puts me on the spot.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0056",
    "example_index": 2,
    "target_vocab": {
      "kanji": "言う",
      "kana": "いう",
      "meaning": "to say"
    },
    "sentence": {
      "japanese": "「行った」というのが適切な言葉だ。",
      "kana": "「いった」というのがてきせつなことばだ。",
      "english": "\"Performed\" is the right word.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0056",
    "example_index": 3,
    "target_vocab": {
      "kanji": "言う",
      "kana": "いう",
      "meaning": "to say"
    },
    "sentence": {
      "japanese": "「行った」というのが適切な言葉だ。",
      "kana": "「いった」というのがてきせつなことばだ。",
      "english": "\"Performed\" is the right word.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0056",
    "example_index": 4,
    "target_vocab": {
      "kanji": "言う",
      "kana": "いう",
      "meaning": "to say"
    },
    "sentence": {
      "japanese": "彼が病気だというのは明らかなようだ。",
      "kana": "かれがびょうきだというのはあきらかなようだ。",
      "english": "It seems obvious that he is sick.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0056",
    "example_index": 5,
    "target_vocab": {
      "kanji": "言う",
      "kana": "いう",
      "meaning": "to say"
    },
    "sentence": {
      "japanese": "死ぬというのは痛いのかしら。",
      "kana": "しぬというのはいたいのかしら。",
      "english": "Would it hurt to die?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0057",
    "example_index": 0,
    "target_vocab": {
      "kanji": "飲む",
      "kana": "のむ",
      "meaning": "to drink"
    },
    "sentence": {
      "japanese": "この薬を飲まなければ行けませんか。",
      "kana": "このくすりをのまなければいけませんか。",
      "english": "Must I take this medicine?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0057",
    "example_index": 1,
    "target_vocab": {
      "kanji": "飲む",
      "kana": "のむ",
      "meaning": "to drink"
    },
    "sentence": {
      "japanese": "ちょっとそこまでコーヒーを飲みに行く。",
      "kana": "ちょっとそこまでこーひーをのみにいく。",
      "english": "Come round the corner for coffee.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0057",
    "example_index": 2,
    "target_vocab": {
      "kanji": "飲む",
      "kana": "のむ",
      "meaning": "to drink"
    },
    "sentence": {
      "japanese": "私は牛乳が飲みたいな。",
      "kana": "わたしはぎゅうにゅうがのみたいな。",
      "english": "I want to drink milk.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0058",
    "example_index": 0,
    "target_vocab": {
      "kanji": "練習",
      "kana": "れんしゅうする",
      "meaning": "to practice"
    },
    "sentence": {
      "japanese": "毎日練習あるのみよ。",
      "kana": "まいにちれんしゅうあるのみよ。",
      "english": "You just have to practise every day.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0059",
    "example_index": 0,
    "target_vocab": {
      "kanji": "何",
      "kana": "なん/なに",
      "meaning": "what"
    },
    "sentence": {
      "japanese": "ポケットに何を持っていますか。",
      "kana": "ぽけっとになにをもっていますか。",
      "english": "What do you have in your pocket?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0059",
    "example_index": 1,
    "target_vocab": {
      "kanji": "何",
      "kana": "なん/なに",
      "meaning": "what"
    },
    "sentence": {
      "japanese": "あなたには何人子供がいますか。",
      "kana": "あなたにはなんにんこどもがいますか。",
      "english": "How many children do you have?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0059",
    "example_index": 2,
    "target_vocab": {
      "kanji": "何",
      "kana": "なん/なに",
      "meaning": "what"
    },
    "sentence": {
      "japanese": "あなたは何人兄弟がいますか。",
      "kana": "あなたはなんにんきょうだいがいますか。",
      "english": "How many siblings do you have?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0060",
    "example_index": 0,
    "target_vocab": {
      "kanji": "厚い",
      "kana": "あつい",
      "meaning": "kind"
    },
    "sentence": {
      "japanese": "この本はとても厚い。",
      "kana": "このほんはとてもあつい。",
      "english": "This book is very thick.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0060",
    "example_index": 1,
    "target_vocab": {
      "kanji": "厚い",
      "kana": "あつい",
      "meaning": "kind"
    },
    "sentence": {
      "japanese": "あの厚い本を読んでたの？",
      "kana": "あのあついほんをよんでたの？",
      "english": "Did you read that thick book?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0060",
    "example_index": 2,
    "target_vocab": {
      "kanji": "厚い",
      "kana": "あつい",
      "meaning": "kind"
    },
    "sentence": {
      "japanese": "この雑誌は厚くて、重いです。",
      "kana": "このざっしはあつくて、おもいです。",
      "english": "This magazine is thick and heavy.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0061",
    "example_index": 0,
    "target_vocab": {
      "kanji": "毎月",
      "kana": "まいげつ/まいつき",
      "meaning": "every month"
    },
    "sentence": {
      "japanese": "この雑誌は毎月出る。",
      "kana": "このざっしはまいつきでる。",
      "english": "This magazine is issued every month.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0062",
    "example_index": 0,
    "target_vocab": {
      "kanji": "閉まる",
      "kana": "しまる",
      "meaning": "to close"
    },
    "sentence": {
      "japanese": "銀行がいつ閉まるかわかりますか。",
      "kana": "ぎんこうがいつしまるかわかりますか。",
      "english": "Do you have any idea when the bank closes?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0062",
    "example_index": 1,
    "target_vocab": {
      "kanji": "閉まる",
      "kana": "しまる",
      "meaning": "to close"
    },
    "sentence": {
      "japanese": "お店が閉まる前に行っといで。",
      "kana": "おみせがしまるまえにいっといで。",
      "english": "Go to the store before it closes.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0063",
    "example_index": 0,
    "target_vocab": {
      "kanji": "脱ぐ",
      "kana": "ぬぐ",
      "meaning": "to take off clothes"
    },
    "sentence": {
      "japanese": "私は服を脱いでいる。",
      "kana": "わたしはふくをぬいでいる。",
      "english": "I'm undressing.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0063",
    "example_index": 1,
    "target_vocab": {
      "kanji": "脱ぐ",
      "kana": "ぬぐ",
      "meaning": "to take off clothes"
    },
    "sentence": {
      "japanese": "彼女は上着を脱いだ。",
      "kana": "かのじょはうわぎをぬいだ。",
      "english": "She took off her coat.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0063",
    "example_index": 2,
    "target_vocab": {
      "kanji": "脱ぐ",
      "kana": "ぬぐ",
      "meaning": "to take off clothes"
    },
    "sentence": {
      "japanese": "彼女はそれを脱いだ。",
      "kana": "かのじょはそれをぬいだ。",
      "english": "She took it off.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0064",
    "example_index": 0,
    "target_vocab": {
      "kanji": "黒い",
      "kana": "くろい",
      "meaning": "black"
    },
    "sentence": {
      "japanese": "彼女は色が黒い。",
      "kana": "かのじょはいろがくろい。",
      "english": "She is dark-skinned.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0064",
    "example_index": 1,
    "target_vocab": {
      "kanji": "黒い",
      "kana": "くろい",
      "meaning": "black"
    },
    "sentence": {
      "japanese": "彼女は黒い服を着ていた。",
      "kana": "かのじょはくろいふくをきていた。",
      "english": "She was dressed in black.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0064",
    "example_index": 2,
    "target_vocab": {
      "kanji": "黒い",
      "kana": "くろい",
      "meaning": "black"
    },
    "sentence": {
      "japanese": "彼女はいつも黒い服を着ている。",
      "kana": "かのじょはいつもくろいふくをきている。",
      "english": "She is always dressed in black.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0065",
    "example_index": 0,
    "target_vocab": {
      "kanji": "登る",
      "kana": "のぼる",
      "meaning": "to climb"
    },
    "sentence": {
      "japanese": "彼女はいつかあの山に登るだろう。",
      "kana": "かのじょはいつかあのやまにのぼるだろう。",
      "english": "She is going to climb that mountain someday.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0065",
    "example_index": 1,
    "target_vocab": {
      "kanji": "登る",
      "kana": "のぼる",
      "meaning": "to climb"
    },
    "sentence": {
      "japanese": "私は山に登る、なぜならそれがそこにあるからだ。",
      "kana": "わたしはやまにのぼる、なぜならそれがそこにあるからだ。",
      "english": "I climb mountains because they are there.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0065",
    "example_index": 2,
    "target_vocab": {
      "kanji": "登る",
      "kana": "のぼる",
      "meaning": "to climb"
    },
    "sentence": {
      "japanese": "この山に登るのはとても難しい。",
      "kana": "このやまにのぼるのはとてもむずかしい。",
      "english": "Climbing this mountain is very difficult.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0065",
    "example_index": 3,
    "target_vocab": {
      "kanji": "登る",
      "kana": "のぼる",
      "meaning": "to climb"
    },
    "sentence": {
      "japanese": "彼は簡単に木にのぼる。",
      "kana": "かれはかんたんにきにのぼる。",
      "english": "He gets up the tree without difficulty.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0066",
    "example_index": 0,
    "target_vocab": {
      "kanji": "汚い",
      "kana": "きたない",
      "meaning": "dirty"
    },
    "sentence": {
      "japanese": "彼の部屋は汚い。",
      "kana": "かのへやはきたない。",
      "english": "His room is untidy.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0066",
    "example_index": 1,
    "target_vocab": {
      "kanji": "汚い",
      "kana": "きたない",
      "meaning": "dirty"
    },
    "sentence": {
      "japanese": "それはたいへんで、きたない仕事なのだ。",
      "kana": "それはたいへんで、きたないしごとなのだ。",
      "english": "It's a hard, dirty job.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0066",
    "example_index": 2,
    "target_vocab": {
      "kanji": "汚い",
      "kana": "きたない",
      "meaning": "dirty"
    },
    "sentence": {
      "japanese": "その汚い犬を台所に入れないで。",
      "kana": "そのきたないいぬをだいどころにいれないで。",
      "english": "Don't bring that dirty dog through the kitchen.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0066",
    "example_index": 3,
    "target_vocab": {
      "kanji": "汚い",
      "kana": "きたない",
      "meaning": "dirty"
    },
    "sentence": {
      "japanese": "それはたいへんで、きたない仕事なのだ。",
      "kana": "それはたいへんで、きたないしごとなのだ。",
      "english": "It's a hard, dirty job.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0067",
    "example_index": 0,
    "target_vocab": {
      "kanji": "雨",
      "kana": "あめ",
      "meaning": "rain"
    },
    "sentence": {
      "japanese": "にわかに雨が降ってきた。",
      "kana": "にわかにあめがふってきた。",
      "english": "Suddenly, the rain fell.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0067",
    "example_index": 1,
    "target_vocab": {
      "kanji": "雨",
      "kana": "あめ",
      "meaning": "rain"
    },
    "sentence": {
      "japanese": "その上雨が降り出している。",
      "kana": "そのうえあめがおりだしている。",
      "english": "Besides, it's starting to rain.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0067",
    "example_index": 2,
    "target_vocab": {
      "kanji": "雨",
      "kana": "あめ",
      "meaning": "rain"
    },
    "sentence": {
      "japanese": "明日雨が降るだろうか。",
      "kana": "あしたあめがふるだろうか。",
      "english": "Will it rain tomorrow?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0069",
    "example_index": 0,
    "target_vocab": {
      "kanji": "速い",
      "kana": "はやい",
      "meaning": "quick"
    },
    "sentence": {
      "japanese": "彼は歩くのが速い。",
      "kana": "かれはあるくのがはやい。",
      "english": "He's a quick walker.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0069",
    "example_index": 1,
    "target_vocab": {
      "kanji": "速い",
      "kana": "はやい",
      "meaning": "quick"
    },
    "sentence": {
      "japanese": "彼は足が速い。",
      "kana": "かれはあしがはやい。",
      "english": "He is a fast runner.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0069",
    "example_index": 2,
    "target_vocab": {
      "kanji": "速い",
      "kana": "はやい",
      "meaning": "quick"
    },
    "sentence": {
      "japanese": "彼は走るのが速い。",
      "kana": "かれははしるのがはやい。",
      "english": "He is a fast runner.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0071",
    "example_index": 0,
    "target_vocab": {
      "kanji": "新しい",
      "kana": "あたらしい",
      "meaning": "new"
    },
    "sentence": {
      "japanese": "あのデパートで新しいコートを買いたい。",
      "kana": "あのでぱーとであたらしいこーとをかいたい。",
      "english": "I would like to buy a new coat at that department store.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0071",
    "example_index": 1,
    "target_vocab": {
      "kanji": "新しい",
      "kana": "あたらしい",
      "meaning": "new"
    },
    "sentence": {
      "japanese": "私は新しい背広を買った。",
      "kana": "わたしはあたらしいせびろをかった。",
      "english": "I bought a new suit of clothes.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0071",
    "example_index": 2,
    "target_vocab": {
      "kanji": "新しい",
      "kana": "あたらしい",
      "meaning": "new"
    },
    "sentence": {
      "japanese": "彼女は新しい時計をなくした。",
      "kana": "かのじょはあたらしいとけいをなくした。",
      "english": "She lost her new watch.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0072",
    "example_index": 0,
    "target_vocab": {
      "kanji": "廊下",
      "kana": "ろうか",
      "meaning": "corridor"
    },
    "sentence": {
      "japanese": "廊下に箱がある。",
      "kana": "ろうかにはこがある。",
      "english": "There’s a box in the hall.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0073",
    "example_index": 0,
    "target_vocab": {
      "kanji": "茶色",
      "kana": "ちゃいろ",
      "meaning": "brown"
    },
    "sentence": {
      "japanese": "彼の靴は茶色だ。",
      "kana": "かのくつはちゃいろだ。",
      "english": "His shoes are brown.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0073",
    "example_index": 1,
    "target_vocab": {
      "kanji": "茶色",
      "kana": "ちゃいろ",
      "meaning": "brown"
    },
    "sentence": {
      "japanese": "茶色の靴がほしいんだ。黒いのではなくてね。",
      "kana": "ちゃいろのくつがほしいんだ。くろいのではなくてね。",
      "english": "I want brown shoes, not black ones.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0073",
    "example_index": 2,
    "target_vocab": {
      "kanji": "茶色",
      "kana": "ちゃいろ",
      "meaning": "brown"
    },
    "sentence": {
      "japanese": "その猫は茶色です。",
      "kana": "そのねこはちゃいろです。",
      "english": "That cat is brown.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0074",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "コート",
      "meaning": "coat"
    },
    "sentence": {
      "japanese": "あのデパートで新しいコートを買いたい。",
      "kana": "あのでぱーとであたらしいこーとをかいたい。",
      "english": "I would like to buy a new coat at that department store.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0074",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "コート",
      "meaning": "coat"
    },
    "sentence": {
      "japanese": "コートを持ちましょうか。",
      "kana": "こーとをもちましょうか。",
      "english": "Shall I carry your coat?",
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
