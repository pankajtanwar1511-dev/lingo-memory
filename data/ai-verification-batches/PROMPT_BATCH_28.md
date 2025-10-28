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

**Batch Number**: 28
**Total Batches**: 38
**Examples in This Batch**: 50

---

### Examples:

[
  {
    "card_id": "n5_vocab_0478",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "できる",
      "meaning": "to be able to"
    },
    "sentence": {
      "japanese": "問題は彼にそれができるかどうかだ。",
      "kana": "もんだいはかれにそれができるかどうかだ。",
      "english": "The question is whether he can do it or not.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0479",
    "example_index": 0,
    "target_vocab": {
      "kanji": "春",
      "kana": "はる",
      "meaning": "spring"
    },
    "sentence": {
      "japanese": "これらの花は春に咲く。",
      "kana": "これらのはなははるにさく。",
      "english": "These flowers bloom in spring.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0479",
    "example_index": 1,
    "target_vocab": {
      "kanji": "春",
      "kana": "はる",
      "meaning": "spring"
    },
    "sentence": {
      "japanese": "毎年、私たちの町は春には暖かい天気になる。",
      "kana": "まいとし、わたしたちのまちははるにはあたたかいてんきになる。",
      "english": "Every year, spring brings warm weather to our town.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0479",
    "example_index": 2,
    "target_vocab": {
      "kanji": "春",
      "kana": "はる",
      "meaning": "spring"
    },
    "sentence": {
      "japanese": "冬の後に春が来る。",
      "kana": "ふゆののちにはるがくる。",
      "english": "Spring comes after winter.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0480",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "する",
      "meaning": "to do"
    },
    "sentence": {
      "japanese": "彼は何でも、しったかぶりする。",
      "kana": "かれはなんでも、しったかぶりする。",
      "english": "He pretends to know everything.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0480",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "する",
      "meaning": "to do"
    },
    "sentence": {
      "japanese": "彼は来年外国旅行をする。",
      "kana": "かれはらいねんがいこくりょこうをする。",
      "english": "He will travel abroad next year.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0480",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "する",
      "meaning": "to do"
    },
    "sentence": {
      "japanese": "先生、ペン書きにするのでしょうか。",
      "kana": "せんせい、ぺんかきにするのでしょうか。",
      "english": "Sir, do we have to write in ink?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0482",
    "example_index": 0,
    "target_vocab": {
      "kanji": "町",
      "kana": "まち",
      "meaning": "town"
    },
    "sentence": {
      "japanese": "町は村よりも大きい。",
      "kana": "まちはむらよりもおおきい。",
      "english": "Towns are larger than villages.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0482",
    "example_index": 1,
    "target_vocab": {
      "kanji": "町",
      "kana": "まち",
      "meaning": "town"
    },
    "sentence": {
      "japanese": "この町は西も東も分かりません。",
      "kana": "このまちはにしもひがしもわかりません。",
      "english": "I'm quite a stranger in this town.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0482",
    "example_index": 2,
    "target_vocab": {
      "kanji": "町",
      "kana": "まち",
      "meaning": "town"
    },
    "sentence": {
      "japanese": "毎年、私たちの町は春には暖かい天気になる。",
      "kana": "まいとし、わたしたちのまちははるにはあたたかいてんきになる。",
      "english": "Every year, spring brings warm weather to our town.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0482",
    "example_index": 3,
    "target_vocab": {
      "kanji": "町",
      "kana": "まち",
      "meaning": "town"
    },
    "sentence": {
      "japanese": "彼がおまちかねよ。",
      "kana": "かれがおまちかねよ。",
      "english": "He is impatient to see you.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0483",
    "example_index": 0,
    "target_vocab": {
      "kanji": "渡す",
      "kana": "わたす",
      "meaning": "to hand over"
    },
    "sentence": {
      "japanese": "彼女が来たらこの手紙を渡してください。",
      "kana": "かのじょがきたらこのてがみをわたしてください。",
      "english": "Give her this letter when she comes.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0483",
    "example_index": 1,
    "target_vocab": {
      "kanji": "渡す",
      "kana": "わたす",
      "meaning": "to hand over"
    },
    "sentence": {
      "japanese": "その本を渡してください。",
      "kana": "そのほんをわたしてください。",
      "english": "Hand me that book, please.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0483",
    "example_index": 2,
    "target_vocab": {
      "kanji": "渡す",
      "kana": "わたす",
      "meaning": "to hand over"
    },
    "sentence": {
      "japanese": "彼に財布を渡して。",
      "kana": "かれにさいふをわたして。",
      "english": "Just give him the wallet.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0484",
    "example_index": 0,
    "target_vocab": {
      "kanji": "青",
      "kana": "あお",
      "meaning": "blue"
    },
    "sentence": {
      "japanese": "彼女の目の色は青です。",
      "kana": "かのじょのめのいろはあおです。",
      "english": "The color of her eyes is blue.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0484",
    "example_index": 1,
    "target_vocab": {
      "kanji": "青",
      "kana": "あお",
      "meaning": "blue"
    },
    "sentence": {
      "japanese": "彼の車は青で、彼女のは赤だった。",
      "kana": "かのくるまはあおで、かのじょのはあかだった。",
      "english": "His car was blue; hers was red.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0484",
    "example_index": 2,
    "target_vocab": {
      "kanji": "青",
      "kana": "あお",
      "meaning": "blue"
    },
    "sentence": {
      "japanese": "青と赤ではあなたはどちらの方が好きですか。",
      "kana": "あおとあかではあなたはどちらのほうがすきですか。",
      "english": "Which color do you like more, blue or red?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0485",
    "example_index": 0,
    "target_vocab": {
      "kanji": "白",
      "kana": "しろ",
      "meaning": "white"
    },
    "sentence": {
      "japanese": "私は黒の上着と白の上着をもっている。",
      "kana": "わたしはくろのうわぎとしろのうわぎをもっている。",
      "english": "I have a black and a white coat.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0485",
    "example_index": 1,
    "target_vocab": {
      "kanji": "白",
      "kana": "しろ",
      "meaning": "white"
    },
    "sentence": {
      "japanese": "それは完全に白です。",
      "kana": "それはかんぜんにしろです。",
      "english": "It's all white.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0485",
    "example_index": 2,
    "target_vocab": {
      "kanji": "白",
      "kana": "しろ",
      "meaning": "white"
    },
    "sentence": {
      "japanese": "俺の白のワイシャツ、どこ？",
      "kana": "おれのしろのわいしゃつ、どこ？",
      "english": "Where's my white dress shirt?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0485",
    "example_index": 3,
    "target_vocab": {
      "kanji": "白",
      "kana": "しろ",
      "meaning": "white"
    },
    "sentence": {
      "japanese": "好きにしろよ。",
      "kana": "すきにしろよ。",
      "english": "Suit yourself.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0485",
    "example_index": 4,
    "target_vocab": {
      "kanji": "白",
      "kana": "しろ",
      "meaning": "white"
    },
    "sentence": {
      "japanese": "君静かにしろよ。",
      "kana": "くんしずかにしろよ。",
      "english": "You be quiet.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0485",
    "example_index": 5,
    "target_vocab": {
      "kanji": "白",
      "kana": "しろ",
      "meaning": "white"
    },
    "sentence": {
      "japanese": "君、静かにしろ。",
      "kana": "くん、しずかにしろ。",
      "english": "You, be quiet!",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0486",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "ある",
      "meaning": "to be"
    },
    "sentence": {
      "japanese": "机の上に一冊の本がある。",
      "kana": "つくえのうえにいっさつのほんがある。",
      "english": "There is an album on the desk.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0486",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "ある",
      "meaning": "to be"
    },
    "sentence": {
      "japanese": "テレビはいつからあるの？",
      "kana": "てれびはいつからあるの？",
      "english": "When did TV appear?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0486",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "ある",
      "meaning": "to be"
    },
    "sentence": {
      "japanese": "あの仕事の口はまだあるよ。",
      "kana": "あのしごとのくちはまだあるよ。",
      "english": "The job offer still stands.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0487",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "ベッド",
      "meaning": "bed"
    },
    "sentence": {
      "japanese": "彼はまだベッドにいます。",
      "kana": "かれはまだべっどにいます。",
      "english": "He is still in bed.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0487",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "ベッド",
      "meaning": "bed"
    },
    "sentence": {
      "japanese": "どっちのベッドを使いたい？",
      "kana": "どっちのべっどをつかいたい？",
      "english": "Which bed do you want to use?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0487",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "ベッド",
      "meaning": "bed"
    },
    "sentence": {
      "japanese": "ベッドの下に猫がいる。",
      "kana": "べっどのしたにねこがいる。",
      "english": "There is a cat under the bed.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0488",
    "example_index": 0,
    "target_vocab": {
      "kanji": "水",
      "kana": "みず",
      "meaning": "water"
    },
    "sentence": {
      "japanese": "トイレの水が止まりません。",
      "kana": "といれのみずがどまりません。",
      "english": "The toilet won't stop running.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0488",
    "example_index": 1,
    "target_vocab": {
      "kanji": "水",
      "kana": "みず",
      "meaning": "water"
    },
    "sentence": {
      "japanese": "お水を持ってきてください。",
      "kana": "おみずをもってきてください。",
      "english": "Could you bring me some water?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0488",
    "example_index": 2,
    "target_vocab": {
      "kanji": "水",
      "kana": "みず",
      "meaning": "water"
    },
    "sentence": {
      "japanese": "薄い砂糖水を作った。",
      "kana": "うすいさとうみずをつくった。",
      "english": "I prepared a weak solution of sugar and water.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0490",
    "example_index": 0,
    "target_vocab": {
      "kanji": "楽しい",
      "kana": "たのしい",
      "meaning": "enjoyable"
    },
    "sentence": {
      "japanese": "旅行は楽しい。",
      "kana": "りょこうはたのしい。",
      "english": "It's fun to travel.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0490",
    "example_index": 1,
    "target_vocab": {
      "kanji": "楽しい",
      "kana": "たのしい",
      "meaning": "enjoyable"
    },
    "sentence": {
      "japanese": "旅行に行くのはとても楽しい。",
      "kana": "りょこうにいくのはとてもたのしい。",
      "english": "It's a lot of fun going on a trip.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0490",
    "example_index": 2,
    "target_vocab": {
      "kanji": "楽しい",
      "kana": "たのしい",
      "meaning": "enjoyable"
    },
    "sentence": {
      "japanese": "彼女は楽しそうに歌った。",
      "kana": "かのじょはたのしそうにうたった。",
      "english": "She sang happily.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0490",
    "example_index": 3,
    "target_vocab": {
      "kanji": "楽しい",
      "kana": "たのしい",
      "meaning": "enjoyable"
    },
    "sentence": {
      "japanese": "私達にはたのしい晩でした。",
      "kana": "わたしたちにはたのしいばんでした。",
      "english": "We had a pleasant evening.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0491",
    "example_index": 0,
    "target_vocab": {
      "kanji": "御飯",
      "kana": "ごはん",
      "meaning": "cooked rice"
    },
    "sentence": {
      "japanese": "彼らは沢山のご飯を食べる。",
      "kana": "かれらはたくさんのごめしをたべる。",
      "english": "They eat a lot of rice.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0491",
    "example_index": 1,
    "target_vocab": {
      "kanji": "御飯",
      "kana": "ごはん",
      "meaning": "cooked rice"
    },
    "sentence": {
      "japanese": "私はパンよりご飯の方が好きです。",
      "kana": "わたしはぱんよりごめしのほうがすきです。",
      "english": "I prefer rice to bread.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0491",
    "example_index": 2,
    "target_vocab": {
      "kanji": "御飯",
      "kana": "ごはん",
      "meaning": "cooked rice"
    },
    "sentence": {
      "japanese": "私はごはんよりパンのほうが好きだ。",
      "kana": "わたしはごはんよりぱんのほうがすきだ。",
      "english": "I like bread more than rice.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0491",
    "example_index": 3,
    "target_vocab": {
      "kanji": "御飯",
      "kana": "ごはん",
      "meaning": "cooked rice"
    },
    "sentence": {
      "japanese": "私はごはんよりパンのほうが好きだ。",
      "kana": "わたしはごはんよりぱんのほうがすきだ。",
      "english": "I like bread more than rice.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0491",
    "example_index": 4,
    "target_vocab": {
      "kanji": "御飯",
      "kana": "ごはん",
      "meaning": "cooked rice"
    },
    "sentence": {
      "japanese": "お昼ごはんは食べたの？",
      "kana": "おひるごはんはたべたの？",
      "english": "Have you eaten lunch yet?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0491",
    "example_index": 5,
    "target_vocab": {
      "kanji": "御飯",
      "kana": "ごはん",
      "meaning": "cooked rice"
    },
    "sentence": {
      "japanese": "ごはん食べたの？",
      "kana": "ごはんたべたの？",
      "english": "Have you eaten yet?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0493",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "おいしい",
      "meaning": "delicious"
    },
    "sentence": {
      "japanese": "ここではおいしい食べ物が出されます。",
      "kana": "ここではおいしいたべものがだされます。",
      "english": "They serve excellent food here.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0493",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "おいしい",
      "meaning": "delicious"
    },
    "sentence": {
      "japanese": "何かおいしいものが食べたいな。",
      "kana": "なにかおいしいものがたべたいな。",
      "english": "I want to eat something good.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0493",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "おいしい",
      "meaning": "delicious"
    },
    "sentence": {
      "japanese": "何がおいしいですか。",
      "kana": "なにがおいしいですか。",
      "english": "What do you suggest?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0495",
    "example_index": 0,
    "target_vocab": {
      "kanji": "外",
      "kana": "そと",
      "meaning": "outside"
    },
    "sentence": {
      "japanese": "外は真っ暗だった。",
      "kana": "そとはまっくらだった。",
      "english": "It was pitch black outside.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0495",
    "example_index": 1,
    "target_vocab": {
      "kanji": "外",
      "kana": "そと",
      "meaning": "outside"
    },
    "sentence": {
      "japanese": "昼ご飯を食べに外に出ませんか。",
      "kana": "ひるごめしをたべにそとにでませんか。",
      "english": "How about going out for lunch?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0495",
    "example_index": 2,
    "target_vocab": {
      "kanji": "外",
      "kana": "そと",
      "meaning": "outside"
    },
    "sentence": {
      "japanese": "外は真っ暗だ。",
      "kana": "そとはまっくらだ。",
      "english": "It's all dark outside.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0496",
    "example_index": 0,
    "target_vocab": {
      "kanji": "前",
      "kana": "まえ",
      "meaning": "before"
    },
    "sentence": {
      "japanese": "寝る前に電気を消してください。",
      "kana": "ねるまえにでんきをけしてください。",
      "english": "Turn off the light before you go to bed.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0496",
    "example_index": 1,
    "target_vocab": {
      "kanji": "前",
      "kana": "まえ",
      "meaning": "before"
    },
    "sentence": {
      "japanese": "若い男の人がドアの前で歌っています。",
      "kana": "わかいおとこのにんがどあのまえでうたっています。",
      "english": "A young man is singing in front of the door.",
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
