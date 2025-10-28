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

**Batch Number**: 12
**Total Batches**: 38
**Examples in This Batch**: 50

---

### Examples:

[
  {
    "card_id": "n5_vocab_0188",
    "example_index": 5,
    "target_vocab": {
      "kanji": "山",
      "kana": "やま",
      "meaning": "mountain"
    },
    "sentence": {
      "japanese": "雪がやまないね。",
      "kana": "ゆきがやまないね。",
      "english": "The snow doesn't stop.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0189",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "テレビ",
      "meaning": "television"
    },
    "sentence": {
      "japanese": "テレビはいつからあるの？",
      "kana": "てれびはいつからあるの？",
      "english": "When did TV appear?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0189",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "テレビ",
      "meaning": "television"
    },
    "sentence": {
      "japanese": "彼女は今晩テレビに出ます。",
      "kana": "かのじょはこんばんてれびにでます。",
      "english": "She is appearing on TV tonight.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0189",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "テレビ",
      "meaning": "television"
    },
    "sentence": {
      "japanese": "彼は昨夜テレビに出た。",
      "kana": "かれはさくやてれびにでた。",
      "english": "He appeared on TV last night.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0190",
    "example_index": 0,
    "target_vocab": {
      "kanji": "授業",
      "kana": "じゅぎょう",
      "meaning": "lesson"
    },
    "sentence": {
      "japanese": "彼等は授業中だ。",
      "kana": "かれらはじゅぎょうちゅうだ。",
      "english": "They are in class.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0190",
    "example_index": 1,
    "target_vocab": {
      "kanji": "授業",
      "kana": "じゅぎょう",
      "meaning": "lesson"
    },
    "sentence": {
      "japanese": "彼女は授業を休んだ。",
      "kana": "かのじょはじゅぎょうをやすんだ。",
      "english": "She absented herself from class.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0190",
    "example_index": 2,
    "target_vocab": {
      "kanji": "授業",
      "kana": "じゅぎょう",
      "meaning": "lesson"
    },
    "sentence": {
      "japanese": "彼は授業を休んだ。",
      "kana": "かれはじゅぎょうをやすんだ。",
      "english": "He absented himself from classes.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0191",
    "example_index": 0,
    "target_vocab": {
      "kanji": "暖かい",
      "kana": "あたたかい",
      "meaning": "warm"
    },
    "sentence": {
      "japanese": "毎年、私たちの町は春には暖かい天気になる。",
      "kana": "まいとし、わたしたちのまちははるにはあたたかいてんきになる。",
      "english": "Every year, spring brings warm weather to our town.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0191",
    "example_index": 1,
    "target_vocab": {
      "kanji": "暖かい",
      "kana": "あたたかい",
      "meaning": "warm"
    },
    "sentence": {
      "japanese": "暑いと言わないまでも、暖かい。",
      "kana": "あついといわないまでも、あたたかい。",
      "english": "It is warm, not to say hot.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0191",
    "example_index": 2,
    "target_vocab": {
      "kanji": "暖かい",
      "kana": "あたたかい",
      "meaning": "warm"
    },
    "sentence": {
      "japanese": "私のコートは軽いが暖かい。",
      "kana": "わたしのこーとはかるいがあたたかい。",
      "english": "My overcoat is light but warm.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0191",
    "example_index": 3,
    "target_vocab": {
      "kanji": "暖かい",
      "kana": "あたたかい",
      "meaning": "warm"
    },
    "sentence": {
      "japanese": "私に何かあたたかい飲み物をください。",
      "kana": "わたしになにかあたたかいのみものをください。",
      "english": "Please give me something hot to drink.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0192",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "セーター",
      "meaning": "sweater"
    },
    "sentence": {
      "japanese": "このセーターは洗っても大丈夫です。",
      "kana": "このせーたーはあらってもだいじょうぶです。",
      "english": "This sweater will stand washing.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0192",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "セーター",
      "meaning": "sweater"
    },
    "sentence": {
      "japanese": "彼女はセーターを着た。",
      "kana": "かのじょはせーたーをきた。",
      "english": "She pulled her sweater on.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0192",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "セーター",
      "meaning": "sweater"
    },
    "sentence": {
      "japanese": "彼は彼女にセーターを買ってあげた。",
      "kana": "かれはかのじょにせーたーをかってあげた。",
      "english": "He bought her a sweater.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0195",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "つける",
      "meaning": "to turn on"
    },
    "sentence": {
      "japanese": "どちらの道をいっても駅につける。",
      "kana": "どちらのみちをいってもえきにつける。",
      "english": "Whichever way you may take, you can get to the station.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0197",
    "example_index": 0,
    "target_vocab": {
      "kanji": "学校",
      "kana": "がっこう",
      "meaning": "school"
    },
    "sentence": {
      "japanese": "この学校はたくさんの生徒がいます。",
      "kana": "このがっこうはたくさんのせいとがいます。",
      "english": "This school has many students.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0197",
    "example_index": 1,
    "target_vocab": {
      "kanji": "学校",
      "kana": "がっこう",
      "meaning": "school"
    },
    "sentence": {
      "japanese": "あなたがたの学校祭はいつですか。",
      "kana": "あなたがたのがっこうまつりはいつですか。",
      "english": "When is your school festival?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0197",
    "example_index": 2,
    "target_vocab": {
      "kanji": "学校",
      "kana": "がっこう",
      "meaning": "school"
    },
    "sentence": {
      "japanese": "来週の今日は学校は休みだ。",
      "kana": "らいしゅうのこんにちはがっこうはやすみだ。",
      "english": "There will be no school a week from today.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0198",
    "example_index": 0,
    "target_vocab": {
      "kanji": "",
      "kana": "いくら",
      "meaning": "how much?"
    },
    "sentence": {
      "japanese": "このハンカチはいくらですか。",
      "kana": "このはんかちはいくらですか。",
      "english": "How much is this handkerchief?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0198",
    "example_index": 1,
    "target_vocab": {
      "kanji": "",
      "kana": "いくら",
      "meaning": "how much?"
    },
    "sentence": {
      "japanese": "いくらですか？",
      "kana": "いくらですか？",
      "english": "How much is it?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0198",
    "example_index": 2,
    "target_vocab": {
      "kanji": "",
      "kana": "いくら",
      "meaning": "how much?"
    },
    "sentence": {
      "japanese": "今日はおいくらですか。",
      "kana": "こんにちはおいくらですか。",
      "english": "How much should I pay today?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0199",
    "example_index": 0,
    "target_vocab": {
      "kanji": "四",
      "kana": "し/よん",
      "meaning": "four"
    },
    "sentence": {
      "japanese": "犬は四本足である。",
      "kana": "いぬはよんほんあしである。",
      "english": "A dog has four legs.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0199",
    "example_index": 1,
    "target_vocab": {
      "kanji": "四",
      "kana": "し/よん",
      "meaning": "four"
    },
    "sentence": {
      "japanese": "一つ、二つ、三つ、四つ、五つ、六つ、七つ、八つ、九つ、十。",
      "kana": "ひとつ、ふたつ、みっつ、よつ、いつつ、むつ、ななつ、やつ、ここのつ、じゅう。",
      "english": "One, two, three, four, five, six, seven, eight, nine, ten.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0199",
    "example_index": 2,
    "target_vocab": {
      "kanji": "四",
      "kana": "し/よん",
      "meaning": "four"
    },
    "sentence": {
      "japanese": "十、十一、十二、十三、十四、十五、十六、十七、十八、十九、二十。",
      "kana": "じゅう、じゅういち、じゅうに、じゅうさん、じゅうよん、じゅうご、じゅうろく、じゅうしち、じゅうはち、じゅうきゅう、にじゅう。",
      "english": "Ten, eleven, twelve, thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen, twenty.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0200",
    "example_index": 0,
    "target_vocab": {
      "kanji": "入る",
      "kana": "はいる",
      "meaning": "to enter"
    },
    "sentence": {
      "japanese": "今、女の人が１人入っていきましたよ。",
      "kana": "いま、おんなのひとが１にんいっっていきましたよ。",
      "english": "A woman is going into it now.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0200",
    "example_index": 1,
    "target_vocab": {
      "kanji": "入る",
      "kana": "はいる",
      "meaning": "to enter"
    },
    "sentence": {
      "japanese": "その細っこい体のどこに入るんだ？",
      "kana": "そのこまっこいからだのどこにいるんだ？",
      "english": "In that slender body, where does it all go?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0200",
    "example_index": 2,
    "target_vocab": {
      "kanji": "入る",
      "kana": "はいる",
      "meaning": "to enter"
    },
    "sentence": {
      "japanese": "来週になると一家族が入ってくる。",
      "kana": "らいしゅうになるとひとかぞくがいっってくる。",
      "english": "Next week a family will move in.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0200",
    "example_index": 3,
    "target_vocab": {
      "kanji": "入る",
      "kana": "はいる",
      "meaning": "to enter"
    },
    "sentence": {
      "japanese": "彼女には友だちが少しはいる。",
      "kana": "かのじょにはともだちがすこしはいる。",
      "english": "She has a few friends.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0201",
    "example_index": 0,
    "target_vocab": {
      "kanji": "曇り",
      "kana": "くもり",
      "meaning": "cloudy weather"
    },
    "sentence": {
      "japanese": "明日は曇りになるでしょう。",
      "kana": "あしたはくもりになるでしょう。",
      "english": "It will be cloudy tomorrow.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0201",
    "example_index": 1,
    "target_vocab": {
      "kanji": "曇り",
      "kana": "くもり",
      "meaning": "cloudy weather"
    },
    "sentence": {
      "japanese": "曇り時々雨でした。",
      "kana": "くもりときどきあめでした。",
      "english": "It was cloudy, with occasional rain.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0201",
    "example_index": 2,
    "target_vocab": {
      "kanji": "曇り",
      "kana": "くもり",
      "meaning": "cloudy weather"
    },
    "sentence": {
      "japanese": "晴れ後曇りでした。",
      "kana": "はれのちくもりでした。",
      "english": "It was sunny, then cloudy.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0202",
    "example_index": 0,
    "target_vocab": {
      "kanji": "外国",
      "kana": "がいこく",
      "meaning": "foreign country"
    },
    "sentence": {
      "japanese": "あなたは外国の本を持っていますか。",
      "kana": "あなたはがいこくのほんをもっていますか。",
      "english": "Do you have any foreign books?",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0202",
    "example_index": 1,
    "target_vocab": {
      "kanji": "外国",
      "kana": "がいこく",
      "meaning": "foreign country"
    },
    "sentence": {
      "japanese": "彼は来年外国旅行をする。",
      "kana": "かれはらいねんがいこくりょこうをする。",
      "english": "He will travel abroad next year.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0202",
    "example_index": 2,
    "target_vocab": {
      "kanji": "外国",
      "kana": "がいこく",
      "meaning": "foreign country"
    },
    "sentence": {
      "japanese": "彼は僕に外国へ行きたいかどうかと聞いた。",
      "kana": "かれはぼくにがいこくへいきたいかどうかときいた。",
      "english": "He asked me if I wanted to go abroad.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0203",
    "example_index": 0,
    "target_vocab": {
      "kanji": "温い",
      "kana": "ぬるい",
      "meaning": "luke warm"
    },
    "sentence": {
      "japanese": "このコーヒーはぬるいです。",
      "kana": "このこーひーはぬるいです。",
      "english": "This coffee is not hot enough.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0203",
    "example_index": 1,
    "target_vocab": {
      "kanji": "温い",
      "kana": "ぬるい",
      "meaning": "luke warm"
    },
    "sentence": {
      "japanese": "このコーヒー、ぬるいね。",
      "kana": "このこーひー、ぬるいね。",
      "english": "This coffee is not hot enough.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0203",
    "example_index": 2,
    "target_vocab": {
      "kanji": "温い",
      "kana": "ぬるい",
      "meaning": "luke warm"
    },
    "sentence": {
      "japanese": "ここはちょっと温いですね？",
      "kana": "ここはちょっとぬくいですね？",
      "english": "It's a bit warm in here, isn't it?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0203",
    "example_index": 3,
    "target_vocab": {
      "kanji": "温い",
      "kana": "ぬるい",
      "meaning": "luke warm"
    },
    "sentence": {
      "japanese": "このコーヒーはぬるいです。",
      "kana": "このこーひーはぬるいです。",
      "english": "This coffee is not hot enough.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0203",
    "example_index": 4,
    "target_vocab": {
      "kanji": "温い",
      "kana": "ぬるい",
      "meaning": "luke warm"
    },
    "sentence": {
      "japanese": "このコーヒー、ぬるいね。",
      "kana": "このこーひー、ぬるいね。",
      "english": "This coffee is not hot enough.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0206",
    "example_index": 0,
    "target_vocab": {
      "kanji": "仕事",
      "kana": "しごと",
      "meaning": "job"
    },
    "sentence": {
      "japanese": "その仕事でへとへとだ。",
      "kana": "そのしごとでへとへとだ。",
      "english": "That job took a lot out of me.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0206",
    "example_index": 1,
    "target_vocab": {
      "kanji": "仕事",
      "kana": "しごと",
      "meaning": "job"
    },
    "sentence": {
      "japanese": "あの仕事の口はまだあるよ。",
      "kana": "あのしごとのくちはまだあるよ。",
      "english": "The job offer still stands.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0206",
    "example_index": 2,
    "target_vocab": {
      "kanji": "仕事",
      "kana": "しごと",
      "meaning": "job"
    },
    "sentence": {
      "japanese": "妹は仕事を持っています。",
      "kana": "いもうとはしごとをもっています。",
      "english": "My sister has a job.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0207",
    "example_index": 0,
    "target_vocab": {
      "kanji": "窓",
      "kana": "まど",
      "meaning": "window"
    },
    "sentence": {
      "japanese": "あの窓のそばの机は使うな。",
      "kana": "あのまどのそばのつくえはつかうな。",
      "english": "Don't use the desk by that window.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0207",
    "example_index": 1,
    "target_vocab": {
      "kanji": "窓",
      "kana": "まど",
      "meaning": "window"
    },
    "sentence": {
      "japanese": "窓から手を出さないで。",
      "kana": "まどからてをださないで。",
      "english": "Don't stick your hand out of the window.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0207",
    "example_index": 2,
    "target_vocab": {
      "kanji": "窓",
      "kana": "まど",
      "meaning": "window"
    },
    "sentence": {
      "japanese": "部屋の窓は閉めておくように。",
      "kana": "へやのまどはしめておくように。",
      "english": "See that the windows in your room are fastened.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0208",
    "example_index": 0,
    "target_vocab": {
      "kanji": "晩",
      "kana": "ばん",
      "meaning": "evening"
    },
    "sentence": {
      "japanese": "もう朝から晩まで働いてクタクタだよ。",
      "kana": "もうあさからばんまではたらいてくたくただよ。",
      "english": "I'm beat. I've been working from dawn to dusk.",
      "source": "jmdict"
    }
  },
  {
    "card_id": "n5_vocab_0208",
    "example_index": 1,
    "target_vocab": {
      "kanji": "晩",
      "kana": "ばん",
      "meaning": "evening"
    },
    "sentence": {
      "japanese": "彼女は朝から晩まで働いた。",
      "kana": "かのじょはあさからばんまではたらいた。",
      "english": "She worked from morning till night.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0208",
    "example_index": 2,
    "target_vocab": {
      "kanji": "晩",
      "kana": "ばん",
      "meaning": "evening"
    },
    "sentence": {
      "japanese": "彼女は一晩中本を読んだ。",
      "kana": "かのじょはひとばんじゅうほんをよんだ。",
      "english": "She read the book all night.",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0209",
    "example_index": 0,
    "target_vocab": {
      "kanji": "難しい",
      "kana": "むずかしい",
      "meaning": "difficult"
    },
    "sentence": {
      "japanese": "勉強は難しいの？",
      "kana": "べんきょうはむずかしいの？",
      "english": "Is the school work hard?",
      "source": "tatoeba"
    }
  },
  {
    "card_id": "n5_vocab_0209",
    "example_index": 1,
    "target_vocab": {
      "kanji": "難しい",
      "kana": "むずかしい",
      "meaning": "difficult"
    },
    "sentence": {
      "japanese": "彼女はその質問に答えるのが難しいとわかった。",
      "kana": "かのじょはそのしつもんにこたえるのがむずかしいとわかった。",
      "english": "She found it difficult to answer the question.",
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
