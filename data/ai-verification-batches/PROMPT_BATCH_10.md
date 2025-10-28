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

**Batch Number**: 10
**Total Batches**: 38
**Examples in This Batch**: 50

---

### Examples:

[
  {
    "card_id": "n5_vocab_0156",
    "example_index": 2,
    "target_vocab": {
      "kanji": "来週",
      "kana": "らいしゅう",
      "meaning": "next week"
    },
    "sentence": {
      "japanese": "来週になると一家族が入ってくる。",
      "kana": "らいしゅうになるとひとかぞくがいっってくる。",
      "english": "Next week a family will move in.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0157",
    "example_index": 0,
    "target_vocab": {
      "kanji": "財布",
      "kana": "さいふ",
      "meaning": "wallet"
    },
    "sentence": {
      "japanese": "財布をなくしたの。",
      "kana": "さいふをなくしたの。",
      "english": "I have lost my wallet.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0157",
    "example_index": 1,
    "target_vocab": {
      "kanji": "財布",
      "kana": "さいふ",
      "meaning": "wallet"
    },
    "sentence": {
      "japanese": "病気は財布を空にする。",
      "kana": "びょうきはさいふをそらにする。",
      "english": "Sickness empties the wallet.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0157",
    "example_index": 2,
    "target_vocab": {
      "kanji": "財布",
      "kana": "さいふ",
      "meaning": "wallet"
    },
    "sentence": {
      "japanese": "彼は財布を家に忘れてきたと言った。",
      "kana": "かれはさいふをいえにわすれてきたといった。",
      "english": "He said that he had left his wallet at home.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0158",
    "example_index": 0,
    "target_vocab": {
      "kanji": "知る",
      "kana": "しる",
      "meaning": "to know"
    },
    "sentence": {
      "japanese": "なぜ空が青いか知っているか。",
      "kana": "なぜそらがあおいかしっているか。",
      "english": "Do you know why the sky is blue?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0158",
    "example_index": 1,
    "target_vocab": {
      "kanji": "知る",
      "kana": "しる",
      "meaning": "to know"
    },
    "sentence": {
      "japanese": "彼は何でも、しったかぶりする。",
      "kana": "かれはなんでも、しったかぶりする。",
      "english": "He pretends to know everything.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0158",
    "example_index": 2,
    "target_vocab": {
      "kanji": "知る",
      "kana": "しる",
      "meaning": "to know"
    },
    "sentence": {
      "japanese": "私はその動物の名前を知っている。",
      "kana": "わたしはそのどうぶつのなまえをしっている。",
      "english": "I know the name of this animal.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0159",
    "example_index": 0,
    "target_vocab": {
      "kanji": "教える",
      "kana": "おしえる",
      "meaning": "to teach"
    },
    "sentence": {
      "japanese": "ええ、じゃあ私の電話番号教えるね。",
      "kana": "ええ、じゃあわたしのでんわばんごうおしえるね。",
      "english": "OK. Let me give you my number.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0159",
    "example_index": 1,
    "target_vocab": {
      "kanji": "教える",
      "kana": "おしえる",
      "meaning": "to teach"
    },
    "sentence": {
      "japanese": "あなたに公園の行き方を教えましょう。",
      "kana": "あなたにこうえんのいきかたをおしえましょう。",
      "english": "I will show you how to go to the park.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0159",
    "example_index": 2,
    "target_vocab": {
      "kanji": "教える",
      "kana": "おしえる",
      "meaning": "to teach"
    },
    "sentence": {
      "japanese": "詳らかに教えてください。",
      "kana": "つまびらかにおしえてください。",
      "english": "Please explain in detail.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0160",
    "example_index": 0,
    "target_vocab": {
      "kanji": "朝御飯",
      "kana": "あさごはん",
      "meaning": "breakfast"
    },
    "sentence": {
      "japanese": "朝ご飯に何を食べますか。",
      "kana": "あさごめしになにをたべますか。",
      "english": "What do you usually have for breakfast?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0160",
    "example_index": 1,
    "target_vocab": {
      "kanji": "朝御飯",
      "kana": "あさごはん",
      "meaning": "breakfast"
    },
    "sentence": {
      "japanese": "私は毎朝朝ごはんを食べます。",
      "kana": "わたしはまいあさあさごはんをたべます。",
      "english": "I have breakfast every morning.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0160",
    "example_index": 2,
    "target_vocab": {
      "kanji": "朝御飯",
      "kana": "あさごはん",
      "meaning": "breakfast"
    },
    "sentence": {
      "japanese": "彼はここでよく朝ご飯を食べる。",
      "kana": "かれはここでよくあさごめしをたべる。",
      "english": "He often eats breakfast here.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0161",
    "example_index": 0,
    "target_vocab": {
      "kanji": "飛ぶ",
      "kana": "とぶ",
      "meaning": "to fly"
    },
    "sentence": {
      "japanese": "ワシが空を飛んでいる。",
      "kana": "わしがそらをとんでいる。",
      "english": "An eagle is flying in the sky.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0161",
    "example_index": 1,
    "target_vocab": {
      "kanji": "飛ぶ",
      "kana": "とぶ",
      "meaning": "to fly"
    },
    "sentence": {
      "japanese": "彼の話はいろいろなところへ飛ぶ。",
      "kana": "かのはなしはいろいろなところへとぶ。",
      "english": "He frequently jumps from one topic to another while he is talking.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0161",
    "example_index": 2,
    "target_vocab": {
      "kanji": "飛ぶ",
      "kana": "とぶ",
      "meaning": "to fly"
    },
    "sentence": {
      "japanese": "飛ぶ魚もいる。",
      "kana": "とぶさかなもいる。",
      "english": "Some fish fly.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0162",
    "example_index": 0,
    "target_vocab": {
      "kanji": "言葉",
      "kana": "ことば",
      "meaning": "word"
    },
    "sentence": {
      "japanese": "言葉が出てこなかった。",
      "kana": "ことばがでてこなかった。",
      "english": "Words failed me.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0162",
    "example_index": 1,
    "target_vocab": {
      "kanji": "言葉",
      "kana": "ことば",
      "meaning": "word"
    },
    "sentence": {
      "japanese": "「行った」というのが適切な言葉だ。",
      "kana": "「いった」というのがてきせつなことばだ。",
      "english": "\"Performed\" is the right word.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0162",
    "example_index": 2,
    "target_vocab": {
      "kanji": "言葉",
      "kana": "ことば",
      "meaning": "word"
    },
    "sentence": {
      "japanese": "分からない言葉がたくさんある。",
      "kana": "わからないことばがたくさんある。",
      "english": "There are many words that I don't understand.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0162",
    "example_index": 3,
    "target_vocab": {
      "kanji": "言葉",
      "kana": "ことば",
      "meaning": "word"
    },
    "sentence": {
      "japanese": "あいつ、奇妙なことば話してたよ。",
      "kana": "あいつ、きみょうなことばはなしてたよ。",
      "english": "He was speaking a strange language.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0164",
    "example_index": 0,
    "target_vocab": {
      "kanji": "赤",
      "kana": "あか",
      "meaning": "red"
    },
    "sentence": {
      "japanese": "彼の車は青で、彼女のは赤だった。",
      "kana": "かのくるまはあおで、かのじょのはあかだった。",
      "english": "His car was blue; hers was red.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0164",
    "example_index": 1,
    "target_vocab": {
      "kanji": "赤",
      "kana": "あか",
      "meaning": "red"
    },
    "sentence": {
      "japanese": "赤鉛筆を持っていますか。",
      "kana": "あかえんぴつをもっていますか。",
      "english": "Have you got a red pencil?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0164",
    "example_index": 2,
    "target_vocab": {
      "kanji": "赤",
      "kana": "あか",
      "meaning": "red"
    },
    "sentence": {
      "japanese": "私の大好きな色は赤です。",
      "kana": "わたしのだいすきないろはあかです。",
      "english": "My favorite color is red.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0165",
    "example_index": 0,
    "target_vocab": {
      "kanji": "自分",
      "kana": "じぶん",
      "meaning": "oneself"
    },
    "sentence": {
      "japanese": "彼女は自分の話をするのが好きだった。",
      "kana": "かのじょはじぶんのはなしをするのがすきだった。",
      "english": "She was fond of talking about herself.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0165",
    "example_index": 1,
    "target_vocab": {
      "kanji": "自分",
      "kana": "じぶん",
      "meaning": "oneself"
    },
    "sentence": {
      "japanese": "彼女は自分の本を手に取った。",
      "kana": "かのじょはじぶんのほんをてにとった。",
      "english": "She took her book.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0165",
    "example_index": 2,
    "target_vocab": {
      "kanji": "自分",
      "kana": "じぶん",
      "meaning": "oneself"
    },
    "sentence": {
      "japanese": "彼女は自分の子どもに甘い。",
      "kana": "かのじょはじぶんのこどもにあまい。",
      "english": "She lets her children have their own way too much.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0166",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "デパート",
      "meaning": "department store"
    },
    "sentence": {
      "japanese": "あのデパートで新しいコートを買いたい。",
      "kana": "あのでぱーとであたらしいこーとをかいたい。",
      "english": "I would like to buy a new coat at that department store.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0166",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "デパート",
      "meaning": "department store"
    },
    "sentence": {
      "japanese": "彼はデパートへ買い物に行った。",
      "kana": "かれはでぱーとへかいものにいった。",
      "english": "He went shopping at a department store.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0166",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "デパート",
      "meaning": "department store"
    },
    "sentence": {
      "japanese": "デパートで買った。",
      "kana": "でぱーとでかった。",
      "english": "I bought it at a department store.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0167",
    "example_index": 0,
    "target_vocab": {
      "kanji": "薄い",
      "kana": "うすい",
      "meaning": "thin"
    },
    "sentence": {
      "japanese": "薄い砂糖水を作った。",
      "kana": "うすいさとうみずをつくった。",
      "english": "I prepared a weak solution of sugar and water.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0167",
    "example_index": 1,
    "target_vocab": {
      "kanji": "薄い",
      "kana": "うすい",
      "meaning": "thin"
    },
    "sentence": {
      "japanese": "コーヒーは薄いのが好きです。",
      "kana": "こーひーはうすいのがすきです。",
      "english": "I'd like my coffee weak.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0167",
    "example_index": 2,
    "target_vocab": {
      "kanji": "薄い",
      "kana": "うすい",
      "meaning": "thin"
    },
    "sentence": {
      "japanese": "この薄い本は私のです。",
      "kana": "このうすいほんはわたしのです。",
      "english": "This thin book is mine.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0168",
    "example_index": 0,
    "target_vocab": {
      "kanji": "高い",
      "kana": "たかい",
      "meaning": "tall"
    },
    "sentence": {
      "japanese": "どんなに高くても、あの古い時計を買います。",
      "kana": "どんなにたかくても、あのふるいとけいをかいます。",
      "english": "I'll buy that old clock, however expensive it is.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0168",
    "example_index": 1,
    "target_vocab": {
      "kanji": "高い",
      "kana": "たかい",
      "meaning": "tall"
    },
    "sentence": {
      "japanese": "高くてとても手が出ないよ。",
      "kana": "たかくてとてもてがでないよ。",
      "english": "I can't afford to buy it.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0168",
    "example_index": 2,
    "target_vocab": {
      "kanji": "高い",
      "kana": "たかい",
      "meaning": "tall"
    },
    "sentence": {
      "japanese": "僕たちはもう空高くにいるんだね。",
      "kana": "ぼくたちはもうそらたかくにいるんだね。",
      "english": "We're already high up in the sky.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0169",
    "example_index": 0,
    "target_vocab": {
      "kanji": "帰る",
      "kana": "かえる",
      "meaning": "to go back"
    },
    "sentence": {
      "japanese": "疲れたので早く家に帰ると彼は言った。",
      "kana": "つかれたのではやくいえにかえるとかれはいった。",
      "english": "He said he was tired, so he would go home early.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0169",
    "example_index": 1,
    "target_vocab": {
      "kanji": "帰る",
      "kana": "かえる",
      "meaning": "to go back"
    },
    "sentence": {
      "japanese": "彼女はいつ家に帰るのか。",
      "kana": "かのじょはいついえにかえるのか。",
      "english": "When will she return home?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0169",
    "example_index": 2,
    "target_vocab": {
      "kanji": "帰る",
      "kana": "かえる",
      "meaning": "to go back"
    },
    "sentence": {
      "japanese": "彼は私に、私が帰るまで待っていると言った。",
      "kana": "かれはわたしに、わたしがかえるまでまっているといった。",
      "english": "He told me that he would wait till I returned.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0170",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "はい",
      "meaning": "yes"
    },
    "sentence": {
      "japanese": "はい。これならそらで歌えます。",
      "kana": "はい。これならそらでうたえます。",
      "english": "Yes. This one I can sing from memory.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0170",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "はい",
      "meaning": "yes"
    },
    "sentence": {
      "japanese": "「彼女は若いですか」「はい」",
      "kana": "「かのじょはわかいですか」「はい」",
      "english": "\"Is she young?\" \"Yes, she is.\"",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0170",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "はい",
      "meaning": "yes"
    },
    "sentence": {
      "japanese": "彼女は赤いスカートをはいていた。",
      "kana": "かのじょはあかいすかーとをはいていた。",
      "english": "She was wearing a red skirt.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0171",
    "example_index": 0,
    "target_vocab": {
      "kanji": "卵",
      "kana": "たまご",
      "meaning": "egg"
    },
    "sentence": {
      "japanese": "彼は医者の卵だ。",
      "kana": "かれはいしゃのたまごだ。",
      "english": "He's a future doctor.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0171",
    "example_index": 1,
    "target_vocab": {
      "kanji": "卵",
      "kana": "たまご",
      "meaning": "egg"
    },
    "sentence": {
      "japanese": "卵は嫌いです。",
      "kana": "たまごはきらいです。",
      "english": "I don't care for eggs.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0171",
    "example_index": 2,
    "target_vocab": {
      "kanji": "卵",
      "kana": "たまご",
      "meaning": "egg"
    },
    "sentence": {
      "japanese": "新しい卵がテーブルの上にたくさんある。",
      "kana": "あたらしいたまごがてーぶるのうえにたくさんある。",
      "english": "There are plenty of fresh eggs on the table.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0172",
    "example_index": 0,
    "target_vocab": {
      "kanji": "低い",
      "kana": "ひくい",
      "meaning": "short"
    },
    "sentence": {
      "japanese": "この机は私にはちょっと低い。",
      "kana": "このつくえはわたしにはちょっとひくい。",
      "english": "This desk is a little low for me.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0172",
    "example_index": 1,
    "target_vocab": {
      "kanji": "低い",
      "kana": "ひくい",
      "meaning": "short"
    },
    "sentence": {
      "japanese": "私の姉は君より背が低い。",
      "kana": "わたしのあねはくんよりせがひくい。",
      "english": "My sister is shorter than you.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0172",
    "example_index": 2,
    "target_vocab": {
      "kanji": "低い",
      "kana": "ひくい",
      "meaning": "short"
    },
    "sentence": {
      "japanese": "でも可能性は低そうだね。",
      "kana": "でもかのうせいはひくそうだね。",
      "english": "But the possibility seems unlikely.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0173",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "なぜ",
      "meaning": "why"
    },
    "sentence": {
      "japanese": "なぜ空が青いか知っているか。",
      "kana": "なぜそらがあおいかしっているか。",
      "english": "Do you know why the sky is blue?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0173",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "なぜ",
      "meaning": "why"
    },
    "sentence": {
      "japanese": "あなたはなぜ働いているの。",
      "kana": "あなたはなぜはたらいているの。",
      "english": "How come you're still working?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0173",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "なぜ",
      "meaning": "why"
    },
    "sentence": {
      "japanese": "私はなぜか夜の方が元気だ。",
      "kana": "わたしはなぜかよるのほうがげんきだ。",
      "english": "For some reason I feel more alive at night.",
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
