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

**Batch Number**: 16
**Total Batches**: 38
**Examples in This Batch**: 50

---

### Examples:

[
  {
    "card_id": "n5_vocab_0263",
    "example_index": 2,
    "target_vocab": {
      "kanji": "果物",
      "kana": "くだもの",
      "meaning": "fruit"
    },
    "sentence": {
      "japanese": "新鮮な果物が食べたいんだ。",
      "kana": "しんせんなくだものがたべたいんだ。",
      "english": "I have a craving for fresh fruit.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0264",
    "example_index": 0,
    "target_vocab": {
      "kanji": "止まる",
      "kana": "とまる",
      "meaning": "to come to a halt"
    },
    "sentence": {
      "japanese": "トイレの水が止まりません。",
      "kana": "といれのみずがどまりません。",
      "english": "The toilet won't stop running.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0264",
    "example_index": 1,
    "target_vocab": {
      "kanji": "止まる",
      "kana": "とまる",
      "meaning": "to come to a halt"
    },
    "sentence": {
      "japanese": "電車が停まるまで開けないで。",
      "kana": "でんしゃがとまるまでひらけないで。",
      "english": "Don't open before the train stops.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0264",
    "example_index": 2,
    "target_vocab": {
      "kanji": "止まる",
      "kana": "とまる",
      "meaning": "to come to a halt"
    },
    "sentence": {
      "japanese": "彼女はバスが止まるように手を上げた。",
      "kana": "かのじょはばすがとまるようにてをあげた。",
      "english": "She raised her hand for the bus to stop.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0265",
    "example_index": 0,
    "target_vocab": {
      "kanji": "着く",
      "kana": "つく",
      "meaning": "to arrive at"
    },
    "sentence": {
      "japanese": "私が先にそこへ着くよ。",
      "kana": "わたしがさきにそこへつくよ。",
      "english": "I'll get there before you will.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0265",
    "example_index": 1,
    "target_vocab": {
      "kanji": "着く",
      "kana": "つく",
      "meaning": "to arrive at"
    },
    "sentence": {
      "japanese": "あちらに着いたら手紙をください。",
      "kana": "あちらについたらてがみをください。",
      "english": "Please write to me when you get there.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0265",
    "example_index": 2,
    "target_vocab": {
      "kanji": "着く",
      "kana": "つく",
      "meaning": "to arrive at"
    },
    "sentence": {
      "japanese": "いつ着くの？",
      "kana": "いつつくの？",
      "english": "When do we arrive?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0265",
    "example_index": 3,
    "target_vocab": {
      "kanji": "着く",
      "kana": "つく",
      "meaning": "to arrive at"
    },
    "sentence": {
      "japanese": "私の犬は、どこでも私の行くところへついてくる。",
      "kana": "わたしのいぬは、どこでもわたしのいくところへついてくる。",
      "english": "My dog follows me wherever I go.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0265",
    "example_index": 4,
    "target_vocab": {
      "kanji": "着く",
      "kana": "つく",
      "meaning": "to arrive at"
    },
    "sentence": {
      "japanese": "彼女は「私は昨日ここにつきました」と言った。",
      "kana": "かのじょは「わたしはきのうここにつきました」といった。",
      "english": "She said, \"I arrived here yesterday.\"",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0265",
    "example_index": 5,
    "target_vocab": {
      "kanji": "着く",
      "kana": "つく",
      "meaning": "to arrive at"
    },
    "sentence": {
      "japanese": "彼らはレストランのテーブルについた。",
      "kana": "かれらはれすとらんのてーぶるについた。",
      "english": "They were seated at a table in a restaurant.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0266",
    "example_index": 0,
    "target_vocab": {
      "kanji": "大好き",
      "kana": "だいすき",
      "meaning": "to be very likeable"
    },
    "sentence": {
      "japanese": "大好きになるか大嫌いになるかどちらかなんですね。",
      "kana": "だいすきになるかだいきらいになるかどちらかなんですね。",
      "english": "It's love-it-or-hate-it stuff.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0266",
    "example_index": 1,
    "target_vocab": {
      "kanji": "大好き",
      "kana": "だいすき",
      "meaning": "to be very likeable"
    },
    "sentence": {
      "japanese": "僕は犬が大好きです。",
      "kana": "ぼくはいぬがだいすきです。",
      "english": "I like dogs very much.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0266",
    "example_index": 2,
    "target_vocab": {
      "kanji": "大好き",
      "kana": "だいすき",
      "meaning": "to be very likeable"
    },
    "sentence": {
      "japanese": "頻繁にパーティーを開くのが大好きだ。",
      "kana": "ひんぱんにぱーてぃーをひらくのがだいすきだ。",
      "english": "They love to give parties all the time.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0267",
    "example_index": 0,
    "target_vocab": {
      "kanji": "妹",
      "kana": "いもうと",
      "meaning": "(humble) younger sister"
    },
    "sentence": {
      "japanese": "これは私の妹を撮った写真です。",
      "kana": "これはわたしのいもうとをとったしゃしんです。",
      "english": "This is a picture of my sister.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0267",
    "example_index": 1,
    "target_vocab": {
      "kanji": "妹",
      "kana": "いもうと",
      "meaning": "(humble) younger sister"
    },
    "sentence": {
      "japanese": "あなたの妹さんに会いたいものです。",
      "kana": "あなたのいもうとさんにあいたいものです。",
      "english": "I'd like to see your sister.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0267",
    "example_index": 2,
    "target_vocab": {
      "kanji": "妹",
      "kana": "いもうと",
      "meaning": "(humble) younger sister"
    },
    "sentence": {
      "japanese": "君の妹さんは何年生なの？",
      "kana": "くんのいもうとさんはなんねんうなの？",
      "english": "What grade is your sister in?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0268",
    "example_index": 0,
    "target_vocab": {
      "kanji": "夏",
      "kana": "なつ",
      "meaning": "summer"
    },
    "sentence": {
      "japanese": "涼しい夏は好きですか。",
      "kana": "すずしいなつはすきですか。",
      "english": "Do you like a cool summer?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0268",
    "example_index": 1,
    "target_vocab": {
      "kanji": "夏",
      "kana": "なつ",
      "meaning": "summer"
    },
    "sentence": {
      "japanese": "彼女はこの前の夏から私たちといっしょに住んでいます。",
      "kana": "かのじょはこのまえのなつからわたしたちといっしょにすんでいます。",
      "english": "She has lived with us since last summer.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0268",
    "example_index": 2,
    "target_vocab": {
      "kanji": "夏",
      "kana": "なつ",
      "meaning": "summer"
    },
    "sentence": {
      "japanese": "彼らはある夏の午後に初めて会った。",
      "kana": "かれらはあるなつのごごにはじめてあった。",
      "english": "They first met on a summer afternoon.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0269",
    "example_index": 0,
    "target_vocab": {
      "kanji": "今晩",
      "kana": "こんばん",
      "meaning": "this evening"
    },
    "sentence": {
      "japanese": "では今晩またね、さようなら。",
      "kana": "ではこんばんまたね、さようなら。",
      "english": "See you tonight, then. Cheers!",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0269",
    "example_index": 1,
    "target_vocab": {
      "kanji": "今晩",
      "kana": "こんばん",
      "meaning": "this evening"
    },
    "sentence": {
      "japanese": "今晩暇かな？",
      "kana": "こんばんひまかな？",
      "english": "Are you free tonight?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0269",
    "example_index": 2,
    "target_vocab": {
      "kanji": "今晩",
      "kana": "こんばん",
      "meaning": "this evening"
    },
    "sentence": {
      "japanese": "友達が今晩来ます。",
      "kana": "ともだちがこんばんきます。",
      "english": "A friend of mine is coming this evening.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0270",
    "example_index": 0,
    "target_vocab": {
      "kanji": "塩",
      "kana": "しお",
      "meaning": "salt"
    },
    "sentence": {
      "japanese": "塩を入れましたか。",
      "kana": "しおをいれましたか。",
      "english": "Did you put in any salt?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0270",
    "example_index": 1,
    "target_vocab": {
      "kanji": "塩",
      "kana": "しお",
      "meaning": "salt"
    },
    "sentence": {
      "japanese": "塩を取ってくださいませんか。",
      "kana": "しおをとってくださいませんか。",
      "english": "Will you pass me the salt?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0270",
    "example_index": 2,
    "target_vocab": {
      "kanji": "塩",
      "kana": "しお",
      "meaning": "salt"
    },
    "sentence": {
      "japanese": "お塩とって。",
      "kana": "おしおとって。",
      "english": "Pass me the salt.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0271",
    "example_index": 0,
    "target_vocab": {
      "kanji": "先週",
      "kana": "せんしゅう",
      "meaning": "last week"
    },
    "sentence": {
      "japanese": "彼女は先週から病気である。",
      "kana": "かのじょはせんしゅうからびょうきである。",
      "english": "She has been sick since last week.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0271",
    "example_index": 1,
    "target_vocab": {
      "kanji": "先週",
      "kana": "せんしゅう",
      "meaning": "last week"
    },
    "sentence": {
      "japanese": "彼らに先週子供が生まれた。",
      "kana": "かれらにせんしゅうこどもがうまれた。",
      "english": "They had a baby last week.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0271",
    "example_index": 2,
    "target_vocab": {
      "kanji": "先週",
      "kana": "せんしゅう",
      "meaning": "last week"
    },
    "sentence": {
      "japanese": "先週彼は病気だった。",
      "kana": "せんしゅうかれはびょうきだった。",
      "english": "He was sick last week.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0272",
    "example_index": 0,
    "target_vocab": {
      "kanji": "欲しい",
      "kana": "ほしい",
      "meaning": "want"
    },
    "sentence": {
      "japanese": "何か甘いものがほしい。",
      "kana": "なにかあまいものがほしい。",
      "english": "I want something sweet to eat.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0272",
    "example_index": 1,
    "target_vocab": {
      "kanji": "欲しい",
      "kana": "ほしい",
      "meaning": "want"
    },
    "sentence": {
      "japanese": "飴がほしい。",
      "kana": "あめがほしい。",
      "english": "I want a piece of candy.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0272",
    "example_index": 2,
    "target_vocab": {
      "kanji": "欲しい",
      "kana": "ほしい",
      "meaning": "want"
    },
    "sentence": {
      "japanese": "欲しいものは何でもあげるよ。",
      "kana": "ほしいものはなんでもあげるよ。",
      "english": "I will give you whatever you want.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0272",
    "example_index": 3,
    "target_vocab": {
      "kanji": "欲しい",
      "kana": "ほしい",
      "meaning": "want"
    },
    "sentence": {
      "japanese": "何か甘いものがほしい。",
      "kana": "なにかあまいものがほしい。",
      "english": "I want something sweet to eat.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0272",
    "example_index": 4,
    "target_vocab": {
      "kanji": "欲しい",
      "kana": "ほしい",
      "meaning": "want"
    },
    "sentence": {
      "japanese": "飴がほしい。",
      "kana": "あめがほしい。",
      "english": "I want a piece of candy.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0272",
    "example_index": 5,
    "target_vocab": {
      "kanji": "欲しい",
      "kana": "ほしい",
      "meaning": "want"
    },
    "sentence": {
      "japanese": "車がほしいですか。",
      "kana": "くるまがほしいですか。",
      "english": "Do you want a car?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0273",
    "example_index": 0,
    "target_vocab": {
      "kanji": "木",
      "kana": "き",
      "meaning": "tree"
    },
    "sentence": {
      "japanese": "木の下でちょっと休もうよ。",
      "kana": "きのしたでちょっとやすもうよ。",
      "english": "Let's take a little rest under the tree.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0273",
    "example_index": 1,
    "target_vocab": {
      "kanji": "木",
      "kana": "き",
      "meaning": "tree"
    },
    "sentence": {
      "japanese": "彼女は木の下に座っていた。",
      "kana": "かのじょはきのしたにすわっていた。",
      "english": "She was sitting under a tree.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0273",
    "example_index": 2,
    "target_vocab": {
      "kanji": "木",
      "kana": "き",
      "meaning": "tree"
    },
    "sentence": {
      "japanese": "彼らは木の下に座った。",
      "kana": "かれらはきのしたにすわった。",
      "english": "They sat under a tree.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0273",
    "example_index": 3,
    "target_vocab": {
      "kanji": "木",
      "kana": "き",
      "meaning": "tree"
    },
    "sentence": {
      "japanese": "にわかに雨が降ってきた。",
      "kana": "にわかにあめがふってきた。",
      "english": "Suddenly, the rain fell.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0273",
    "example_index": 4,
    "target_vocab": {
      "kanji": "木",
      "kana": "き",
      "meaning": "tree"
    },
    "sentence": {
      "japanese": "お水を持ってきてください。",
      "kana": "おみずをもってきてください。",
      "english": "Could you bring me some water?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0273",
    "example_index": 5,
    "target_vocab": {
      "kanji": "木",
      "kana": "き",
      "meaning": "tree"
    },
    "sentence": {
      "japanese": "風が出てきました。",
      "kana": "かぜがでてきました。",
      "english": "The wind is picking up.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0275",
    "example_index": 0,
    "target_vocab": {
      "kanji": "薬",
      "kana": "くすり",
      "meaning": "medicine"
    },
    "sentence": {
      "japanese": "この薬を飲まなければ行けませんか。",
      "kana": "このくすりをのまなければいけませんか。",
      "english": "Must I take this medicine?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0275",
    "example_index": 1,
    "target_vocab": {
      "kanji": "薬",
      "kana": "くすり",
      "meaning": "medicine"
    },
    "sentence": {
      "japanese": "薬の飲み方を教えてください。",
      "kana": "くすりののみほうをおしえてください。",
      "english": "Please explain how to take the medicine.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0275",
    "example_index": 2,
    "target_vocab": {
      "kanji": "薬",
      "kana": "くすり",
      "meaning": "medicine"
    },
    "sentence": {
      "japanese": "もう薬を飲みましたか？",
      "kana": "もうくすりをのみましたか？",
      "english": "Have you taken your medicine yet?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0278",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "まずい",
      "meaning": "unpleasant"
    },
    "sentence": {
      "japanese": "学校でたばこ吸うのはまずいよ。",
      "kana": "がっこうでたばこすうのはまずいよ。",
      "english": "You are not supposed to smoke at school.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0278",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "まずい",
      "meaning": "unpleasant"
    },
    "sentence": {
      "japanese": "あの店は安いですが、まずいです。",
      "kana": "あのみせはやすいですが、まずいです。",
      "english": "That restaurant is cheap, but the food isn't very good.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0280",
    "example_index": 0,
    "target_vocab": {
      "kanji": "多い",
      "kana": "おおい",
      "meaning": "many"
    },
    "sentence": {
      "japanese": "彼女には男友達は多いが、この男は特別だ。",
      "kana": "かのじょにはおとこともだちはおおいが、このおとこはとくべつだ。",
      "english": "She has many boyfriends, but this one is special.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0280",
    "example_index": 1,
    "target_vocab": {
      "kanji": "多い",
      "kana": "おおい",
      "meaning": "many"
    },
    "sentence": {
      "japanese": "冬には雪が多いんですよ。",
      "kana": "ふゆにはゆきがおおいんですよ。",
      "english": "We have a lot of snow in the winter.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0280",
    "example_index": 2,
    "target_vocab": {
      "kanji": "多い",
      "kana": "おおい",
      "meaning": "many"
    },
    "sentence": {
      "japanese": "前の冬は雪が多かった。",
      "kana": "まえのふゆはゆきがおおかった。",
      "english": "We had much snow last winter.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0281",
    "example_index": 0,
    "target_vocab": {
      "kanji": "動物",
      "kana": "どうぶつ",
      "meaning": "animal"
    },
    "sentence": {
      "japanese": "私はその動物の名前を知っている。",
      "kana": "わたしはそのどうぶつのなまえをしっている。",
      "english": "I know the name of this animal.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0281",
    "example_index": 1,
    "target_vocab": {
      "kanji": "動物",
      "kana": "どうぶつ",
      "meaning": "animal"
    },
    "sentence": {
      "japanese": "昨日動物園に行った。",
      "kana": "きのうどうぶつえんにいった。",
      "english": "I went to the zoo yesterday.",
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
