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

**Batch Number**: 20
**Total Batches**: 38
**Examples in This Batch**: 50

---

### Examples:

[
  {
    "card_id": "n5_vocab_0330",
    "example_index": 0,
    "target_vocab": {
      "kanji": "銀行",
      "kana": "ぎんこう",
      "meaning": "bank"
    },
    "sentence": {
      "japanese": "彼は銀行員です。",
      "kana": "かれはぎんこういんです。",
      "english": "He is a bank clerk.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0330",
    "example_index": 1,
    "target_vocab": {
      "kanji": "銀行",
      "kana": "ぎんこう",
      "meaning": "bank"
    },
    "sentence": {
      "japanese": "彼は銀行に入って行った。",
      "kana": "かれはぎんこうにいっっていった。",
      "english": "He went into the bank.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0330",
    "example_index": 2,
    "target_vocab": {
      "kanji": "銀行",
      "kana": "ぎんこう",
      "meaning": "bank"
    },
    "sentence": {
      "japanese": "彼は銀行で働いています。",
      "kana": "かれはぎんこうではたらいています。",
      "english": "He works for a bank.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0331",
    "example_index": 0,
    "target_vocab": {
      "kanji": "大切",
      "kana": "たいせつ",
      "meaning": "important"
    },
    "sentence": {
      "japanese": "どうぞお体を大切に。",
      "kana": "どうぞおからだをたいせつに。",
      "english": "Please take good care of yourself.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0331",
    "example_index": 1,
    "target_vocab": {
      "kanji": "大切",
      "kana": "たいせつ",
      "meaning": "important"
    },
    "sentence": {
      "japanese": "大切な話があるんです。",
      "kana": "たいせつなはなしがあるんです。",
      "english": "I'm about to tell you something important.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0331",
    "example_index": 2,
    "target_vocab": {
      "kanji": "大切",
      "kana": "たいせつ",
      "meaning": "important"
    },
    "sentence": {
      "japanese": "彼女は私の大切な人です。",
      "kana": "かのじょはわたしのたいせつなにんです。",
      "english": "She is dear to me.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0332",
    "example_index": 0,
    "target_vocab": {
      "kanji": "学生",
      "kana": "がくせい",
      "meaning": "student"
    },
    "sentence": {
      "japanese": "ある学生に会うところです。",
      "kana": "あるがくせいにあうところです。",
      "english": "I'm going to meet a certain student.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0332",
    "example_index": 1,
    "target_vocab": {
      "kanji": "学生",
      "kana": "がくせい",
      "meaning": "student"
    },
    "sentence": {
      "japanese": "彼女は優秀な学生だ。",
      "kana": "かのじょはゆうしゅうながくせいだ。",
      "english": "She is an excellent student.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0332",
    "example_index": 2,
    "target_vocab": {
      "kanji": "学生",
      "kana": "がくせい",
      "meaning": "student"
    },
    "sentence": {
      "japanese": "彼女は真面目な学生です。",
      "kana": "かのじょはまじめながくせいです。",
      "english": "She is an earnest student.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0333",
    "example_index": 0,
    "target_vocab": {
      "kanji": "部屋",
      "kana": "へや",
      "meaning": "room"
    },
    "sentence": {
      "japanese": "隣の部屋がうるさいのです。",
      "kana": "となりのへやがうるさいのです。",
      "english": "It's noisy next door.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0333",
    "example_index": 1,
    "target_vocab": {
      "kanji": "部屋",
      "kana": "へや",
      "meaning": "room"
    },
    "sentence": {
      "japanese": "彼女は勉強部屋から出ていった。",
      "kana": "かのじょはべんきょうへやからでていった。",
      "english": "She went out of her study.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0333",
    "example_index": 2,
    "target_vocab": {
      "kanji": "部屋",
      "kana": "へや",
      "meaning": "room"
    },
    "sentence": {
      "japanese": "この部屋は先生方に使われています。",
      "kana": "このへやはせんせいがたにつかわれています。",
      "english": "This room is used by teachers.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0334",
    "example_index": 0,
    "target_vocab": {
      "kanji": "昼御飯",
      "kana": "ひるごはん",
      "meaning": "midday meal"
    },
    "sentence": {
      "japanese": "昼ご飯を食べに外に出ませんか。",
      "kana": "ひるごめしをたべにそとにでませんか。",
      "english": "How about going out for lunch?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0334",
    "example_index": 1,
    "target_vocab": {
      "kanji": "昼御飯",
      "kana": "ひるごはん",
      "meaning": "midday meal"
    },
    "sentence": {
      "japanese": "毎日お昼ご飯を作っているよ。",
      "kana": "まいにちおひるごめしをつくっているよ。",
      "english": "I make lunch every day.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0334",
    "example_index": 2,
    "target_vocab": {
      "kanji": "昼御飯",
      "kana": "ひるごはん",
      "meaning": "midday meal"
    },
    "sentence": {
      "japanese": "彼女は昼ご飯を食べているところだ。",
      "kana": "かのじょはひるごめしをたべているところだ。",
      "english": "She is having lunch now.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0335",
    "example_index": 0,
    "target_vocab": {
      "kanji": "下",
      "kana": "した",
      "meaning": "below"
    },
    "sentence": {
      "japanese": "木の下でちょっと休もうよ。",
      "kana": "きのしたでちょっとやすもうよ。",
      "english": "Let's take a little rest under the tree.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0335",
    "example_index": 1,
    "target_vocab": {
      "kanji": "下",
      "kana": "した",
      "meaning": "below"
    },
    "sentence": {
      "japanese": "彼女は木の下に座っていた。",
      "kana": "かのじょはきのしたにすわっていた。",
      "english": "She was sitting under a tree.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0335",
    "example_index": 2,
    "target_vocab": {
      "kanji": "下",
      "kana": "した",
      "meaning": "below"
    },
    "sentence": {
      "japanese": "彼らは木の下に座った。",
      "kana": "かれらはきのしたにすわった。",
      "english": "They sat under a tree.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0335",
    "example_index": 3,
    "target_vocab": {
      "kanji": "下",
      "kana": "した",
      "meaning": "below"
    },
    "sentence": {
      "japanese": "橋のしたは暗かった。",
      "kana": "はしのしたはくらかった。",
      "english": "It was dark under the bridge.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0338",
    "example_index": 0,
    "target_vocab": {
      "kanji": "地図",
      "kana": "ちず",
      "meaning": "map"
    },
    "sentence": {
      "japanese": "少なくとも地図ぐらいはあるだろう。",
      "kana": "すくなくともちずぐらいはあるだろう。",
      "english": "At least they should have a map.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0338",
    "example_index": 1,
    "target_vocab": {
      "kanji": "地図",
      "kana": "ちず",
      "meaning": "map"
    },
    "sentence": {
      "japanese": "その地図はどこで手に入りますか。",
      "kana": "そのちずはどこでてにいりますか。",
      "english": "Where can I get the map?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0338",
    "example_index": 2,
    "target_vocab": {
      "kanji": "地図",
      "kana": "ちず",
      "meaning": "map"
    },
    "sentence": {
      "japanese": "これは地図です。",
      "kana": "これはちずです。",
      "english": "This is a map.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0339",
    "example_index": 0,
    "target_vocab": {
      "kanji": "八百屋",
      "kana": "やおや",
      "meaning": "greengrocer"
    },
    "sentence": {
      "japanese": "果物や野菜は八百屋で買ってるよ。",
      "kana": "くだものややさいはやおやでかってるよ。",
      "english": "I buy my fruits and vegetables at the greengrocer's.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0340",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "ネクタイ",
      "meaning": "tie"
    },
    "sentence": {
      "japanese": "赤いネクタイを買いました。",
      "kana": "あかいねくたいをかいました。",
      "english": "I bought a red tie.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0340",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "ネクタイ",
      "meaning": "tie"
    },
    "sentence": {
      "japanese": "素敵なネクタイですね。",
      "kana": "すてきなねくたいですね。",
      "english": "That's a nice tie you're wearing.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0340",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "ネクタイ",
      "meaning": "tie"
    },
    "sentence": {
      "japanese": "私は彼にネクタイを買ってあげた。",
      "kana": "わたしはかれにねくたいをかってあげた。",
      "english": "I bought him a tie.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0341",
    "example_index": 0,
    "target_vocab": {
      "kanji": "去年",
      "kana": "きょねん",
      "meaning": "last year"
    },
    "sentence": {
      "japanese": "わたしは去年一年生でした。",
      "kana": "わたしはきょねんいちねんせいでした。",
      "english": "I was a first year student last year.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0341",
    "example_index": 1,
    "target_vocab": {
      "kanji": "去年",
      "kana": "きょねん",
      "meaning": "last year"
    },
    "sentence": {
      "japanese": "去年の冬は暖かだった。",
      "kana": "きょねんのふゆはあたたかだった。",
      "english": "We had a mild winter last year.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0341",
    "example_index": 2,
    "target_vocab": {
      "kanji": "去年",
      "kana": "きょねん",
      "meaning": "last year"
    },
    "sentence": {
      "japanese": "私は去年三田に住んでいませんでした。",
      "kana": "わたしはきょねんみたにすんでいませんでした。",
      "english": "I did not live in Sanda last year.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0343",
    "example_index": 0,
    "target_vocab": {
      "kanji": "乗る",
      "kana": "のる",
      "meaning": "to get on"
    },
    "sentence": {
      "japanese": "ほら、あなたの乗る電車が来たわ。",
      "kana": "ほら、あなたののるでんしゃがきたわ。",
      "english": "Look, here comes your train.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0343",
    "example_index": 1,
    "target_vocab": {
      "kanji": "乗る",
      "kana": "のる",
      "meaning": "to get on"
    },
    "sentence": {
      "japanese": "毎日どこでバスに乗りますか。",
      "kana": "まいにちどこでばすにのりますか。",
      "english": "Where do you get on the bus every day?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0343",
    "example_index": 2,
    "target_vocab": {
      "kanji": "乗る",
      "kana": "のる",
      "meaning": "to get on"
    },
    "sentence": {
      "japanese": "彼女は病院までタクシーに乗った。",
      "kana": "かのじょはびょういんまでたくしーにじょうった。",
      "english": "She took a taxi to the hospital.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0344",
    "example_index": 0,
    "target_vocab": {
      "kanji": "弟",
      "kana": "おとうと",
      "meaning": "younger brother"
    },
    "sentence": {
      "japanese": "私は一人の弟がいます。",
      "kana": "わたしはひとりのおとうとがいます。",
      "english": "I have one brother.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0344",
    "example_index": 1,
    "target_vocab": {
      "kanji": "弟",
      "kana": "おとうと",
      "meaning": "younger brother"
    },
    "sentence": {
      "japanese": "彼の弟はとてもよく勉強する。",
      "kana": "かのおとうとはとてもよくべんきょうする。",
      "english": "His brother studies very hard.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0344",
    "example_index": 2,
    "target_vocab": {
      "kanji": "弟",
      "kana": "おとうと",
      "meaning": "younger brother"
    },
    "sentence": {
      "japanese": "弟は私より背が高い。",
      "kana": "おとうとはわたしよりせがたかい。",
      "english": "My younger brother is taller than I.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0345",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "あなた",
      "meaning": "you"
    },
    "sentence": {
      "japanese": "あなたはシャツをあべこべに着ている。",
      "kana": "あなたはしゃつをあべこべにきている。",
      "english": "You are wearing your shirt inside out.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0345",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "あなた",
      "meaning": "you"
    },
    "sentence": {
      "japanese": "ほら、あなたの乗る電車が来たわ。",
      "kana": "ほら、あなたののるでんしゃがきたわ。",
      "english": "Look, here comes your train.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0345",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "あなた",
      "meaning": "you"
    },
    "sentence": {
      "japanese": "私はもうあなたに夢中、メロメロなのよ。",
      "kana": "わたしはもうあなたにむちゅう、めろめろなのよ。",
      "english": "I'm stuck on you - really far gone.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0346",
    "example_index": 0,
    "target_vocab": {
      "kanji": "千",
      "kana": "せん",
      "meaning": "thousand"
    },
    "sentence": {
      "japanese": "千人もの人がそこにいた。",
      "kana": "せんにんものにんがそこにいた。",
      "english": "As many as a thousand people were there.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0346",
    "example_index": 1,
    "target_vocab": {
      "kanji": "千",
      "kana": "せん",
      "meaning": "thousand"
    },
    "sentence": {
      "japanese": "生徒は全部で約千人です。",
      "kana": "せいとはぜんぶでやくせんにんです。",
      "english": "There are about a thousand students in all.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0347",
    "example_index": 0,
    "target_vocab": {
      "kanji": "緑",
      "kana": "みどり",
      "meaning": "green"
    },
    "sentence": {
      "japanese": "私はみどり銀行に行ってきたところなんです。",
      "kana": "わたしはみどりぎんこうにいってきたところなんです。",
      "english": "I have just been to the Midori Bank.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0347",
    "example_index": 1,
    "target_vocab": {
      "kanji": "緑",
      "kana": "みどり",
      "meaning": "green"
    },
    "sentence": {
      "japanese": "その緑のシャツを見せてください。",
      "kana": "そのみどりのしゃつをみせてください。",
      "english": "Please show me the green shirt.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0347",
    "example_index": 2,
    "target_vocab": {
      "kanji": "緑",
      "kana": "みどり",
      "meaning": "green"
    },
    "sentence": {
      "japanese": "このはこの外は緑だが中は赤である。",
      "kana": "このはこのそとはみどりだがなかはあかである。",
      "english": "The outside of this box is green, but the inside is red.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0347",
    "example_index": 3,
    "target_vocab": {
      "kanji": "緑",
      "kana": "みどり",
      "meaning": "green"
    },
    "sentence": {
      "japanese": "私はみどり銀行に行ってきたところなんです。",
      "kana": "わたしはみどりぎんこうにいってきたところなんです。",
      "english": "I have just been to the Midori Bank.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0349",
    "example_index": 0,
    "target_vocab": {
      "kanji": "軽い",
      "kana": "かるい",
      "meaning": "light"
    },
    "sentence": {
      "japanese": "彼女は口が軽い。",
      "kana": "かのじょはくちがかるい。",
      "english": "She is a chatterbox.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0349",
    "example_index": 1,
    "target_vocab": {
      "kanji": "軽い",
      "kana": "かるい",
      "meaning": "light"
    },
    "sentence": {
      "japanese": "私は軽い靴が好きだ。",
      "kana": "わたしはかるいくつがすきだ。",
      "english": "I like light shoes.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0349",
    "example_index": 2,
    "target_vocab": {
      "kanji": "軽い",
      "kana": "かるい",
      "meaning": "light"
    },
    "sentence": {
      "japanese": "私のコートは軽いが暖かい。",
      "kana": "わたしのこーとはかるいがあたたかい。",
      "english": "My overcoat is light but warm.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0350",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "あまり",
      "meaning": "not very"
    },
    "sentence": {
      "japanese": "この手の本はあまり読まない。",
      "kana": "このてのほんはあまりよまない。",
      "english": "I don't read this kind of book much.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0350",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "あまり",
      "meaning": "not very"
    },
    "sentence": {
      "japanese": "あまりそれを鼻にかけるな。",
      "kana": "あまりそれをはなにかけるな。",
      "english": "Don't boast too much about that.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0350",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "あまり",
      "meaning": "not very"
    },
    "sentence": {
      "japanese": "生徒はあまり手を挙げません。",
      "kana": "せいとはあまりてをあげません。",
      "english": "Students don't raise their hands much.",
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
