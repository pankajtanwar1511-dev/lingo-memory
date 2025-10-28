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

**Batch Number**: 2
**Total Batches**: 38
**Examples in This Batch**: 50

---

### Examples:

[
  {
    "card_id": "n5_vocab_0018",
    "example_index": 2,
    "target_vocab": {
      "kanji": "病気",
      "kana": "びょうき",
      "meaning": "illness"
    },
    "sentence": {
      "japanese": "病気だときいたので。",
      "kana": "びょうきだときいたので。",
      "english": "I've heard you've been sick.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0019",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "ポケット",
      "meaning": "pocket"
    },
    "sentence": {
      "japanese": "ポケットに何を持っていますか。",
      "kana": "ぽけっとになにをもっていますか。",
      "english": "What do you have in your pocket?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0019",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "ポケット",
      "meaning": "pocket"
    },
    "sentence": {
      "japanese": "彼はポケットに手を入れて立っていた。",
      "kana": "かれはぽけっとにてをいれてたっていた。",
      "english": "He was standing with his hands in his pockets.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0019",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "ポケット",
      "meaning": "pocket"
    },
    "sentence": {
      "japanese": "これはポケット型の辞書だ。",
      "kana": "これはぽけっとかたのじしょだ。",
      "english": "This is a pocket dictionary.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0020",
    "example_index": 0,
    "target_vocab": {
      "kanji": "頭",
      "kana": "あたま",
      "meaning": "head"
    },
    "sentence": {
      "japanese": "彼は何でも、しったかぶりする。",
      "kana": "かれはなんでも、しったかぶりする。",
      "english": "He pretends to know everything.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0020",
    "example_index": 1,
    "target_vocab": {
      "kanji": "頭",
      "kana": "あたま",
      "meaning": "head"
    },
    "sentence": {
      "japanese": "これは頭にくる。",
      "kana": "これはあたまにくる。",
      "english": "This is making me really angry.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0020",
    "example_index": 2,
    "target_vocab": {
      "kanji": "頭",
      "kana": "あたま",
      "meaning": "head"
    },
    "sentence": {
      "japanese": "頭が重いのです。",
      "kana": "あたまがおもいのです。",
      "english": "My head feels heavy.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0022",
    "example_index": 0,
    "target_vocab": {
      "kanji": "英語",
      "kana": "えいご",
      "meaning": "English language"
    },
    "sentence": {
      "japanese": "英語を声を出して読むべきだ。",
      "kana": "えいごをこえをだしてよむべきだ。",
      "english": "You ought to read English aloud.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0022",
    "example_index": 1,
    "target_vocab": {
      "kanji": "英語",
      "kana": "えいご",
      "meaning": "English language"
    },
    "sentence": {
      "japanese": "誰か英語を話す人はいますか。",
      "kana": "だれかえいごをはなすにんはいますか。",
      "english": "Is there an English speaker here?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0022",
    "example_index": 2,
    "target_vocab": {
      "kanji": "英語",
      "kana": "えいご",
      "meaning": "English language"
    },
    "sentence": {
      "japanese": "流暢に英語を話したいものだ。",
      "kana": "りゅうちょうにえいごをはなしたいものだ。",
      "english": "I would like to speak English fluently.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0023",
    "example_index": 0,
    "target_vocab": {
      "kanji": "家",
      "kana": "いえ",
      "meaning": "house"
    },
    "sentence": {
      "japanese": "その家なら一軒おいて隣ですよ。",
      "kana": "そのいえならいっけんおいてとなりですよ。",
      "english": "The house is next door but one.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0023",
    "example_index": 1,
    "target_vocab": {
      "kanji": "家",
      "kana": "いえ",
      "meaning": "house"
    },
    "sentence": {
      "japanese": "私は毎晩家にいます。",
      "kana": "わたしはまいばんいえにいます。",
      "english": "I am at home every evening.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0023",
    "example_index": 2,
    "target_vocab": {
      "kanji": "家",
      "kana": "いえ",
      "meaning": "house"
    },
    "sentence": {
      "japanese": "きみは何と大きい家を持っているんだろう。",
      "kana": "きみはなんとおおきいいえをもっているんだろう。",
      "english": "What a big house you have!",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0023",
    "example_index": 3,
    "target_vocab": {
      "kanji": "家",
      "kana": "いえ",
      "meaning": "house"
    },
    "sentence": {
      "japanese": "私は彼がどこに住んでいるのかは確実にはいえない。",
      "kana": "わたしはかれがどこにすんでいるのかはかくじつにはいえない。",
      "english": "I cannot say for sure where he lives.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0023",
    "example_index": 4,
    "target_vocab": {
      "kanji": "家",
      "kana": "いえ",
      "meaning": "house"
    },
    "sentence": {
      "japanese": "私はといえば、こちらの方が好きです。",
      "kana": "わたしはといえば、こちらのほうがすきです。",
      "english": "For me, I like this better.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0023",
    "example_index": 5,
    "target_vocab": {
      "kanji": "家",
      "kana": "いえ",
      "meaning": "house"
    },
    "sentence": {
      "japanese": "今のところなんともいえない。",
      "kana": "いまのところなんともいえない。",
      "english": "I can not say anything for the moment.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0025",
    "example_index": 0,
    "target_vocab": {
      "kanji": "暑い",
      "kana": "あつい",
      "meaning": "hot"
    },
    "sentence": {
      "japanese": "今日はとても暑い。",
      "kana": "こんにちはとてもあつい。",
      "english": "It is very hot today.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0025",
    "example_index": 1,
    "target_vocab": {
      "kanji": "暑い",
      "kana": "あつい",
      "meaning": "hot"
    },
    "sentence": {
      "japanese": "夜はとても暑い。",
      "kana": "よるはとてもあつい。",
      "english": "It is very hot at night.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0025",
    "example_index": 2,
    "target_vocab": {
      "kanji": "暑い",
      "kana": "あつい",
      "meaning": "hot"
    },
    "sentence": {
      "japanese": "猛烈な暑さだ。",
      "kana": "もうれつなあつさだ。",
      "english": "The heat is intense.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0026",
    "example_index": 0,
    "target_vocab": {
      "kanji": "遊ぶ",
      "kana": "あそぶ",
      "meaning": "to play"
    },
    "sentence": {
      "japanese": "「わたしは、年とっていて遊べないね」男の子は言いました。",
      "kana": "「わたしは、ねんとっていてあそべないね」おとこのこはいいました。",
      "english": "\"I am too old and sad to play,\" said the boy.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0026",
    "example_index": 1,
    "target_vocab": {
      "kanji": "遊ぶ",
      "kana": "あそぶ",
      "meaning": "to play"
    },
    "sentence": {
      "japanese": "遊びましょう。",
      "kana": "あそびましょう。",
      "english": "Let's play.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0026",
    "example_index": 2,
    "target_vocab": {
      "kanji": "遊ぶ",
      "kana": "あそぶ",
      "meaning": "to play"
    },
    "sentence": {
      "japanese": "遊びに行きたい。",
      "kana": "あそびにいきたい。",
      "english": "I wanna go out.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0027",
    "example_index": 0,
    "target_vocab": {
      "kanji": "取る",
      "kana": "とる",
      "meaning": "to take something"
    },
    "sentence": {
      "japanese": "あなたか私のどちらかが一位を取るだろう。",
      "kana": "あなたかわたしのどちらかがいちいをとるだろう。",
      "english": "Either you or I will get the first prize.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0027",
    "example_index": 1,
    "target_vocab": {
      "kanji": "取る",
      "kana": "とる",
      "meaning": "to take something"
    },
    "sentence": {
      "japanese": "これは私の妹を撮った写真です。",
      "kana": "これはわたしのいもうとをとったしゃしんです。",
      "english": "This is a picture of my sister.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0027",
    "example_index": 2,
    "target_vocab": {
      "kanji": "取る",
      "kana": "とる",
      "meaning": "to take something"
    },
    "sentence": {
      "japanese": "彼はとても年をとっているけれどたっしゃだ。",
      "kana": "かれはとてもねんをとっているけれどたっしゃだ。",
      "english": "Although he is very old, he is strong.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0028",
    "example_index": 0,
    "target_vocab": {
      "kanji": "九",
      "kana": "きゅう/く",
      "meaning": "nine"
    },
    "sentence": {
      "japanese": "彼は十中八九来るだろう。",
      "kana": "かれはじゅっちゅうはっくくるだろう。",
      "english": "He will come nine times out of ten.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0028",
    "example_index": 1,
    "target_vocab": {
      "kanji": "九",
      "kana": "きゅう/く",
      "meaning": "nine"
    },
    "sentence": {
      "japanese": "十中八九、彼は一位になるだろう。",
      "kana": "じゅっちゅうはっく、かれはいちいになるだろう。",
      "english": "In nine cases out of ten he will take the first place.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0028",
    "example_index": 2,
    "target_vocab": {
      "kanji": "九",
      "kana": "きゅう/く",
      "meaning": "nine"
    },
    "sentence": {
      "japanese": "一つ、二つ、三つ、四つ、五つ、六つ、七つ、八つ、九つ、十。",
      "kana": "ひとつ、ふたつ、みっつ、よつ、いつつ、むつ、ななつ、やつ、ここのつ、じゅう。",
      "english": "One, two, three, four, five, six, seven, eight, nine, ten.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0029",
    "example_index": 0,
    "target_vocab": {
      "kanji": "閉める",
      "kana": "しめる",
      "meaning": "to close something"
    },
    "sentence": {
      "japanese": "門を閉める時間だ。",
      "kana": "もんをしめるじかんだ。",
      "english": "It is time to shut the gate.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0029",
    "example_index": 1,
    "target_vocab": {
      "kanji": "閉める",
      "kana": "しめる",
      "meaning": "to close something"
    },
    "sentence": {
      "japanese": "ドアを閉めるのを忘れないでください。",
      "kana": "どあをしめるのをわすれないでください。",
      "english": "Please don't forget to shut the door.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0029",
    "example_index": 2,
    "target_vocab": {
      "kanji": "閉める",
      "kana": "しめる",
      "meaning": "to close something"
    },
    "sentence": {
      "japanese": "ドアを閉めるの、忘れないでよ。",
      "kana": "どあをしめるの、わすれないでよ。",
      "english": "Don't forget to close the door.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0030",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "たいへん",
      "meaning": "very"
    },
    "sentence": {
      "japanese": "彼女はたいへん流暢に英語を話す。",
      "kana": "かのじょはたいへんりゅうちょうにえいごをはなす。",
      "english": "She speaks English very fluently.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0030",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "たいへん",
      "meaning": "very"
    },
    "sentence": {
      "japanese": "彼は音楽がたいへん好きである。",
      "kana": "かれはおんがくがたいへんすきである。",
      "english": "He has a great fondness for music.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0030",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "たいへん",
      "meaning": "very"
    },
    "sentence": {
      "japanese": "彼はたいへん勇敢だ。",
      "kana": "かれはたいへんゆうかんだ。",
      "english": "He is very brave.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0032",
    "example_index": 0,
    "target_vocab": {
      "kanji": "作文",
      "kana": "さくぶん",
      "meaning": "composition"
    },
    "sentence": {
      "japanese": "彼女は作文が優秀だ。",
      "kana": "かのじょはさくぶんがゆうしゅうだ。",
      "english": "She is excellent in composition.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0032",
    "example_index": 1,
    "target_vocab": {
      "kanji": "作文",
      "kana": "さくぶん",
      "meaning": "composition"
    },
    "sentence": {
      "japanese": "この作文はとてもよく書けてますね。",
      "kana": "このさくぶんはとてもよくかけてますね。",
      "english": "This essay is very well written.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0033",
    "example_index": 0,
    "target_vocab": {
      "kanji": "便利",
      "kana": "べんり",
      "meaning": "useful"
    },
    "sentence": {
      "japanese": "電話は便利なものである。",
      "kana": "でんわはべんりなものである。",
      "english": "The telephone is a convenience.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0033",
    "example_index": 1,
    "target_vocab": {
      "kanji": "便利",
      "kana": "べんり",
      "meaning": "useful"
    },
    "sentence": {
      "japanese": "そりゃ便利だね。",
      "kana": "そりゃべんりだね。",
      "english": "That comes in handy.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0033",
    "example_index": 2,
    "target_vocab": {
      "kanji": "便利",
      "kana": "べんり",
      "meaning": "useful"
    },
    "sentence": {
      "japanese": "彼の家はいろいろと便利だ。",
      "kana": "かのいえはいろいろとべんりだ。",
      "english": "His house is full of convenience.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0034",
    "example_index": 0,
    "target_vocab": {
      "kanji": "右",
      "kana": "みぎ",
      "meaning": "right side"
    },
    "sentence": {
      "japanese": "もう少し右の方へ―ようし！",
      "kana": "もうすこしみぎのほうへ―ようし！",
      "english": "A little more to the right, just like so!",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0034",
    "example_index": 1,
    "target_vocab": {
      "kanji": "右",
      "kana": "みぎ",
      "meaning": "right side"
    },
    "sentence": {
      "japanese": "右の道を行け。",
      "kana": "みぎのみちをいけ。",
      "english": "Take the road on the right.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0034",
    "example_index": 2,
    "target_vocab": {
      "kanji": "右",
      "kana": "みぎ",
      "meaning": "right side"
    },
    "sentence": {
      "japanese": "もう少し右の方へ—ようし！",
      "kana": "もうすこしみぎのほうへ—ようし！",
      "english": "A little more to the right, just like so!",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0035",
    "example_index": 0,
    "target_vocab": {
      "kanji": "寒い",
      "kana": "さむい",
      "meaning": "cold"
    },
    "sentence": {
      "japanese": "寒かったうえに、風も強かった。",
      "kana": "さむかったうえに、かぜもつよかった。",
      "english": "It was cold, and, in addition, it was windy.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0035",
    "example_index": 1,
    "target_vocab": {
      "kanji": "寒い",
      "kana": "さむい",
      "meaning": "cold"
    },
    "sentence": {
      "japanese": "北の方では冬が寒いです。",
      "kana": "きたのほうではふゆがさむいです。",
      "english": "In the north, it's cold in winter.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0035",
    "example_index": 2,
    "target_vocab": {
      "kanji": "寒い",
      "kana": "さむい",
      "meaning": "cold"
    },
    "sentence": {
      "japanese": "今朝はとても寒かった。",
      "kana": "けさはとてもさむかった。",
      "english": "It was very cold this morning.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0037",
    "example_index": 0,
    "target_vocab": {
      "kanji": "十",
      "kana": "じゅうとお",
      "meaning": "ten"
    },
    "sentence": {
      "japanese": "彼女には子供が十二人もいる。",
      "kana": "かのじょにはこどもがじゅうににんもいる。",
      "english": "She has no less than twelve children.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0037",
    "example_index": 1,
    "target_vocab": {
      "kanji": "十",
      "kana": "じゅうとお",
      "meaning": "ten"
    },
    "sentence": {
      "japanese": "彼は十年前に死んだ。",
      "kana": "かれはじゅうねんまえにしんだ。",
      "english": "He has been dead for ten years.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0037",
    "example_index": 2,
    "target_vocab": {
      "kanji": "十",
      "kana": "じゅうとお",
      "meaning": "ten"
    },
    "sentence": {
      "japanese": "彼は十中八九来るだろう。",
      "kana": "かれはじゅっちゅうはっくくるだろう。",
      "english": "He will come nine times out of ten.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0038",
    "example_index": 0,
    "target_vocab": {
      "kanji": "中",
      "kana": "なか",
      "meaning": "middle"
    },
    "sentence": {
      "japanese": "僕は中に入ろう。",
      "kana": "ぼくはなかにいろう。",
      "english": "I'll get in.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0038",
    "example_index": 1,
    "target_vocab": {
      "kanji": "中",
      "kana": "なか",
      "meaning": "middle"
    },
    "sentence": {
      "japanese": "風は１日中吹いた。",
      "kana": "かぜは１にっちゅうふいた。",
      "english": "The wind blew all day.",
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
