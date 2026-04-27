# Gemini prompt — 5 common vocabulary per prerequisite kanji

You are a Japanese language curriculum designer building beginner-friendly study cards for a JLPT N5/N4 learner.

For each of the 117 prerequisite kanji listed at the bottom of this prompt, return **exactly 5 vocabulary words** that are:

1. **Very common** in everyday spoken/written Japanese (would appear in a typical N5 or N4 textbook, or in daily conversation/signage). No archaic, technical, classical-only, or name-only words.
2. **Beginner-learnable**: a learner with ~3 months of N5 study should recognize the surrounding kanji or be able to write the word in kana when needed.
3. **Contains the parent kanji as a literal character** in the word (compound or solo, verb stem with okurigana is fine).
4. **Distinct from each other** — don't return 5 forms of the same verb (avoid 行く / 行った / 行きます repetition); aim for 5 *different lexical items*.
5. **Not a duplicate** of anything in the `already linked` column for that kanji (the user already has those — pick 5 *new* useful words).

If a kanji has fewer than 5 truly common N5/N4 candidates, fill the remaining slots with the next-most-common N3 words and tag them honestly. Never invent words. Never include classical-only, surname-only, or place-name-only entries unless the place name is famous (e.g., 東京, 大阪).

## Output format

Return **strict JSON only** — no prose before or after, no markdown fences. Top-level shape:

```json
{
  "results": [
    {
      "parentKanji": "会",
      "vocabulary": [
        {
          "word": "会う",
          "reading": "あう",
          "meaning": "to meet",
          "jlpt": "N5",
          "partOfSpeech": "godan verb (う)",
          "readingType": "kun",
          "frequencyTier": "very common",
          "exampleJp": "友だちに会います。",
          "exampleEn": "I meet a friend.",
          "rationale": "Core N5 verb taught in week 1; pairs with 〜に particle."
        }
        // … 4 more entries …
      ]
    }
    // … one object per kanji, 117 total …
  ]
}
```

### Field rules

- `word` — Japanese as normally written (kanji + kana); must contain the `parentKanji` character literally.
- `reading` — full reading in **hiragana only** (no katakana, no romaji, no dots). For 会う → `あう`, for 銀行 → `ぎんこう`.
- `meaning` — concise English gloss, ≤ 8 words. Lead with the most common sense.
- `jlpt` — one of `"N5"`, `"N4"`, `"N3"`. Prefer N5, then N4. N3 only if no easier word fits.
- `partOfSpeech` — one of: `"noun"`, `"godan verb (う)"`, `"godan verb (る)"`, `"godan verb (く)"`, `"godan verb (す)"`, `"godan verb (つ)"`, `"godan verb (ぬ)"`, `"godan verb (ぶ)"`, `"godan verb (む)"`, `"godan verb (ぐ)"`, `"ichidan verb"`, `"suru verb"`, `"i-adjective"`, `"na-adjective"`, `"adverb"`, `"counter"`, `"expression"`, `"prefix"`, `"suffix"`. Use the most specific that fits.
- `readingType` — one of: `"on"` (Sino-Japanese reading of the parent kanji used here), `"kun"` (native Japanese reading), `"mixed"` (compound mixes on + kun, e.g., 重箱読み / 湯桶読み), `"irregular"` (jukujikun like 今朝=けさ).
- `frequencyTier` — one of: `"very common"` (in top ~3000 lemmas), `"common"` (top ~10000). Reject anything rarer.
- `exampleJp` — ONE short, natural sentence using only N5/N4 grammar. ≤ 8 Japanese words. Use the target word in a typical context. End with `。`.
- `exampleEn` — natural English translation of the example. ≤ 12 English words.
- `rationale` — ONE line (≤ 18 words) explaining why this word earns a slot for this kanji. Mention the kanji's role (which reading is used, useful pattern, common context).

### Hard constraints (will be machine-validated)

- Output is a single JSON object with key `"results"` whose value is an array of length **exactly 117**.
- Each `vocabulary` array has length **exactly 5**.
- Every `word` contains its `parentKanji` character.
- Every `reading` is pure hiragana, no spaces, no punctuation except 〜.
- No duplicate `word` strings across the entire output.
- No word from the `already linked` list of its parent kanji.

## Input data — the 117 prerequisite kanji

Each row is:
`- <kanji> | meaning: <KANJIDIC glosses> | on: <on'yomi> | kun: <kun'yomi> | teacher compounds: <textbook compounds> | already linked: <words already in the app — DO NOT REPEAT>`

- 会 | meaning: association, interview, join, meet, meeting, party | on: エ, カイ | kun: あ.う, あ.わせる, あつ.まる | teacher compounds: 会社, 会議, 会話, 会います | already linked: 会話
- 社 | meaning: association, company, firm, office, shrine | on: シャ | kun: やしろ | teacher compounds: 会社, 社長 | already linked: (none)
- 校 | meaning: correction, exam, printing, proof, school | on: キョウ, コウ | kun: — | teacher compounds: 学校, 小学校 | already linked: 小学校, 学校, 公立学校, 区立の学校, 市立の学校
- 曜 | meaning: weekday | on: ヨウ | kun: — | teacher compounds: 月曜日, 何曜日 | already linked: 日曜日, 月曜日, 火曜日, 水曜日, 木曜日, 金曜日, 土曜日, 何曜日
- 誕 | meaning: be arbitrary, be born, declension, lie, nativity | on: タン | kun: — | teacher compounds: 誕生日 | already linked: 誕生日
- 駅 | meaning: station | on: エキ | kun: — | teacher compounds: 駅, 東京駅, 上野駅 | already linked: 上野駅
- 飛 | meaning: fly, scatter, skip (pages) | on: ヒ | kun: -と.ばす, と.ばす, と.ぶ | teacher compounds: 飛行機 | already linked: 飛行機
- 機 | meaning: airplane, efficacy, loom, machine, mechanism, occasion | on: キ | kun: はた | teacher compounds: 飛行機 | already linked: 飛行機
- 銀 | meaning: silver | on: ギン | kun: しろがね | teacher compounds: 銀行 | already linked: 銀行
- 旅 | meaning: travel, trip | on: リョ | kun: たび | teacher compounds: 旅行 | already linked: 旅行
- 部 | meaning: bureau, class, copy, counter for copies of a newspaper or magazine, dept, part | on: ブ | kun: -べ | teacher compounds: 部屋, 部長; 中部, 部屋 | already linked: (none)
- 屋 | meaning: dealer, house, roof, seller, shop | on: オク | kun: や | teacher compounds: 部屋, 飲み屋 | already linked: 飲み屋
- 映 | meaning: projection, reflect, reflection | on: エイ | kun: -ば.え, うつ.す, うつ.る, は.える | teacher compounds: 映画 | already linked: (none)
- 画 | meaning: brush-stroke, picture | on: エ, カイ, カク, ガ | kun: えが.く, かぎ.る, かく.する, はか.る, はかりごと | teacher compounds: 映画; 計画, 映画 | already linked: (none)
- 電 | meaning: electricity | on: デン | kun: — | teacher compounds: 電車, 電話 | already linked: 電車, 電話
- 新 | meaning: new | on: シン | kun: あたら.しい, あら-, あら.た, にい- | teacher compounds: 新聞, 新宿 | already linked: 新聞, 東北新幹線
- 勉 | meaning: diligent, encourage, endeavour, exertion, make effort, strive | on: ベン | kun: つと.める | teacher compounds: 勉強 | already linked: (none)
- 強 | meaning: strong | on: キョウ, ゴウ | kun: こわ.い, し.いる, つよ.い, つよ.まる, つよ.める | teacher compounds: 勉強 | already linked: (none)
- 試 | meaning: attempt, experiment, ordeal, test, try | on: シ | kun: こころ.みる, ため.す | teacher compounds: 試験 | already linked: (none)
- 験 | meaning: effect, testing, verification | on: ケン, ゲン | kun: あかし, しるし, ため.す, ためし | teacher compounds: 試験 | already linked: (none)
- 誌 | meaning: document, records | on: シ | kun: — | teacher compounds: 名詞, 雑誌 | already linked: (none)
- 詞 | meaning: part of speech, poetry, words | on: シ | kun: ことば | teacher compounds: 名詞, 雑誌 | already linked: 名詞
- 英 | meaning: England, English, calyx, hero, outstanding | on: エイ | kun: はなぶさ | teacher compounds: 英語 | already linked: 英語, 英国
- 米 | meaning: USA, metre, rice | on: ベイ, マイ, メエトル | kun: こめ, よね | teacher compounds: 米国 | already linked: 米国
- 韓 | meaning: Korea | on: カン | kun: いげた, から | teacher compounds: 韓国 | already linked: (none)
- 宿 | meaning: be pregnant, dwell, dwelling, home, inn, lodge | on: シュク | kun: やど, やど.す, やど.る | teacher compounds: 新宿, 宿 | already linked: (none)
- 科 | meaning: course, department, section | on: カ | kun: — | teacher compounds: 内科, 外科, 耳鼻科 | already linked: 耳鼻科, 内科, 外科
- 地 | meaning: earth, ground | on: ジ, チ | kun: — | teacher compounds: 地下鉄, 地方 | already linked: 地下鉄, 東北地方
- 鉄 | meaning: iron | on: テツ | kun: くろがね | teacher compounds: 地下鉄 | already linked: 地下鉄
- 転 | meaning: change, revolve, turn around | on: テン | kun: うたた, うつ.る, くる.めく, ころ.がす, ころ.がる, ころ.げる, ころ.ぶ, まろ.ぶ | teacher compounds: 自転車 | already linked: 自転車
- 自 | meaning: oneself | on: シ, ジ | kun: おの.ずから, おの.ずと, みずか.ら | teacher compounds: 自転車, 自動車, 自分 | already linked: 自動車, 自転車
- 動 | meaning: change, confusion, motion, move, shake, shift | on: ドウ | kun: うご.かす, うご.く | teacher compounds: 自動車, 運動 | already linked: 自動車
- 運 | meaning: advance, carry, destiny, fate, lot, luck | on: ウン | kun: はこ.ぶ | teacher compounds: 運動, 運 | already linked: (none)
- 真 | meaning: Buddhist sect, reality, true | on: シン | kun: ま, ま-, まこと | teacher compounds: 真ん中, 写真 | already linked: 真ん中
- 写 | meaning: be photographed, copy, describe | on: シャ, ジャ | kun: うつ-, うつ.し, うつ.す, うつ.る | teacher compounds: 写真 | already linked: (none)
- 街 | meaning: boulevard, street, town | on: カイ, ガイ | kun: まち | teacher compounds: (街) | already linked: (none)
- 寺 | meaning: Buddhist temple | on: ジ | kun: てら | teacher compounds: お寺, 清水寺 | already linked: (none)
- 清 | meaning: Manchu dynasty, cleanse, exorcise, pure, purify | on: ショウ, シン, セイ | kun: きよ.い, きよ.まる, きよ.める | teacher compounds: 清水寺 | already linked: (none)
- 祖 | meaning: ancestor, founder, pioneer | on: ソ | kun: — | teacher compounds: 祖父, 祖母 | already linked: 祖父, 祖母
- 息 | meaning: breath, coming to an end, interest (on money), nuture, respiration, rest | on: ソク | kun: いき | teacher compounds: 息子 | already linked: (none)
- 娘 | meaning: daughter, girl | on: ジョウ | kun: こ, むすめ | teacher compounds: 娘 | already linked: (none)
- 双 | meaning: comparison, counter for pairs, pair, set | on: ソウ | kun: たぐい, ならぶ, ふた, ふたつ | teacher compounds: 双子 | already linked: 双子
- 性 | meaning: gender, nature, sex | on: ショウ, セイ | kun: さが | teacher compounds: 男性, 女性 | already linked: 男性, 女性
- 料 | meaning: fee, materials | on: リョウ | kun: — | teacher compounds: 料金 | already linked: 料金
- 持 | meaning: have, hold | on: ジ | kun: -も.ち, も.つ, も.てる | teacher compounds: お金持ち | already linked: お金持ち
- 計 | meaning: measure, plan, plot, scheme | on: ケイ | kun: はか.らう, はか.る | teacher compounds: 時計, 計画; 計画 | already linked: 時計, めざまし時計, 腕時計
- 番 | meaning: number in a series, turn | on: バン | kun: つが.い | teacher compounds: 交番 | already linked: (none)
- 交 | meaning: association, coming & going, mingle, mixing | on: コウ | kun: -か.う, か.わす, かわ.す, こもごも, ま.ざる, ま.じる, ま.ぜる, まじ.える, まじ.る, まじ.わる | teacher compounds: 交番 | already linked: (none)
- 近 | meaning: akin, early, near, tantamount | on: キン, コン | kun: ちか.い | teacher compounds: 近畿 | already linked: (none)
- 州 | meaning: province, state | on: シュウ, ス | kun: す | teacher compounds: 九州 | already linked: (none)
- 方 | meaning: alternative, direction, person | on: ホウ | kun: -かた, -がた, かた | teacher compounds: 地方, 方言 | already linked: 方言, 東北地方
- 海 | meaning: ocean, sea | on: カイ | kun: うみ | teacher compounds: 海, 海外, 北海道 | already linked: 海水浴, 海外, 東海道線, 北海道
- 道 | meaning: course, district, journey, moral, road-way, street | on: トウ, ドウ | kun: いう, みち | teacher compounds: 北海道, 水道, 書道, 横断歩道 | already linked: 水道, 東海道線, 北海道, 書道, 横断歩道
- 極 | meaning: 10**48, conclusion, electric poles, end, extremely, highest rank | on: キョク, ゴク | kun: -ぎ.め, き.まる, き.める, きわ.まり, きわ.まる, きわ.み, きわ.める | teacher compounds: 南極 | already linked: 南極
- 関 | meaning: barrier, concerning, connection, gateway, involve | on: カン | kun: -ぜき, かか.わる, からくり, かんぬき, せき | teacher compounds: 関東, 関西 | already linked: 関東, 関西
- 幹 | meaning: capability, main part, talent, tree trunk | on: カン | kun: みき | teacher compounds: 新幹線 | already linked: 東北新幹線
- 線 | meaning: line, track | on: セン | kun: すじ | teacher compounds: 新幹線, 東海道線 | already linked: 東北新幹線, 東海道線
- 太 | meaning: big around, plump, thick | on: タ, タイ | kun: ふと.い, ふと.る | teacher compounds: 太陽 | already linked: (none)
- 陽 | meaning: daytime, heaven, male, positive, sunshine, yang principle | on: ヨウ | kun: ひ | teacher compounds: 太陽 | already linked: (none)
- 公 | meaning: governmental, official, prince, public | on: ク, コウ | kun: おおやけ | teacher compounds: 公園, 公立 | already linked: 公立学校
- 園 | meaning: farm, garden, park, yard | on: エン | kun: その | teacher compounds: 公園 | already linked: (none)
- 資 | meaning: assets, be conducive to, capital, contribute to, data, funds | on: シ | kun: — | teacher compounds: 資料 | already linked: (none)
- 議 | meaning: consideration, consultation, debate, deliberation | on: ギ | kun: — | teacher compounds: 会議 | already linked: (none)
- 札 | meaning: bid, counter for bonds, paper money, placard, tag | on: サツ | kun: ふだ | teacher compounds: 改札 | already linked: 改札口
- 改 | meaning: change, examine, inspect, mend, modify, reformation | on: カイ | kun: あらた.まる, あらた.める | teacher compounds: 改札 | already linked: 改札口
- 紙 | meaning: paper | on: シ | kun: かみ | teacher compounds: 手紙 | already linked: 手紙
- 音 | meaning: noise, sound | on: -ノン, イン, オン | kun: おと, ね | teacher compounds: 足音, 音楽 | already linked: 足音, 音楽
- 楽 | meaning: comfort, ease, music | on: ガク, ゴウ, ラク | kun: この.む, たの.しい, たの.しむ | teacher compounds: 音楽 | already linked: 音楽
- 買 | meaning: buy | on: バイ | kun: か.う | teacher compounds: 買いました, 買い物 | already linked: (none)
- 物 | meaning: matter, object, thing | on: ブツ, モツ | kun: もの, もの- | teacher compounds: 買い物, 飲みもの, 食べもの | already linked: (none)
- 帰 | meaning: arrive at, homecoming, lead to, result in | on: キ | kun: おく.る, かえ.す, かえ.る, とつ.ぐ | teacher compounds: 帰ります | already linked: (none)
- 失 | meaning: disadvantage, error, fault, lose, loss | on: シツ | kun: う.せる, うしな.う | teacher compounds: 失礼 | already linked: (none)
- 礼 | meaning: bow, ceremony, remuneration, salute, thanks | on: ライ, レイ | kun: — | teacher compounds: 失礼 | already linked: (none)
- 切 | meaning: be sharp, cut, cutoff | on: サイ, セツ | kun: -き.り, -き.る, -き.れ, -き.れる, -ぎ.り, -ぎ.れ, き.り, き.る, き.れ, き.れる | teacher compounds: 大切 | already linked: (none)
- 昨 | meaning: previous, yesterday | on: サク | kun: — | teacher compounds: 昨日 | already linked: 昨日
- 朝 | meaning: (North) Korea, dynasty, epoch, morning, period, regime | on: チョウ | kun: あさ | teacher compounds: 今朝, 毎朝, 朝 | already linked: 今朝
- 夜 | meaning: evening, night | on: ヤ | kun: よ, よる | teacher compounds: 今夜, 夜 | already linked: 今夜
- 夏 | meaning: summer | on: カ, ガ, ゲ | kun: なつ | teacher compounds: 夏休み | already linked: 夏休み
- 春 | meaning: spring (season), springtime | on: シュン | kun: はる | teacher compounds: 春休み | already linked: 春休み
- 冬 | meaning: winter | on: トウ | kun: ふゆ | teacher compounds: 冬休み | already linked: 冬休み
- 秋 | meaning: autumn | on: シュウ | kun: あき, とき | teacher compounds: (autumn) | already linked: (none)
- 葉 | meaning: blade, counter for flat things, fragment, leaf, lobe, needle | on: ヨウ | kun: は | teacher compounds: 言葉, 千葉 | already linked: 千葉, 言葉
- 橋 | meaning: bridge | on: キョウ | kun: はし | teacher compounds: 橋本さん | already linked: 橋本さん
- 岡 | meaning: hill, knoll, mount | on: コウ | kun: おか | teacher compounds: 岡本さん | already linked: 岡本さん
- 駄 | meaning: burdensome, horse load, pack horse, send by horse, trivial, worthless | on: タ, ダ | kun: — | teacher compounds: 千駄ヶ谷, 駄目 | already linked: 千駄ヶ谷
- 谷 | meaning: valley | on: コク | kun: きわ.まる, たに | teacher compounds: 千駄ヶ谷 | already linked: 千駄ヶ谷
- 笠 | meaning: bamboo hat, one's influence | on: リュウ | kun: かさ | teacher compounds: 小笠原 | already linked: (none)
- 原 | meaning: field, meadow, original, plain, prairie, primitive | on: ゲン | kun: はら | teacher compounds: 小笠原 | already linked: (none)
- 壱 | meaning: one (in documents) | on: イチ, イツ | kun: ひとつ | teacher compounds: 壱万円 | already linked: 一万円 / 壱万円
- 鼻 | meaning: nose, snout | on: ビ | kun: はな | teacher compounds: 耳鼻科 | already linked: 耳鼻科
- 錠 | meaning: fetters, lock, shackles | on: ジョウ | kun: — | teacher compounds: 1錠 (pill counter) | already linked: (none)
- 断 | meaning: apologize, cutting, decision, decline, dismiss, judgement | on: ダン | kun: ことわ.る, さだ.める, た.つ | teacher compounds: 横断歩道 | already linked: 横断歩道
- 横 | meaning: horizontal, perverse, side, sideways, unreasonable, width | on: オウ | kun: よこ | teacher compounds: 横断歩道 | already linked: 横断歩道
- 辞 | meaning: expression, resign, term, word | on: ジ | kun: いな.む, や.める | teacher compounds: 辞書 | already linked: 辞書
- 調 | meaning: exorcise, harmonize, investigate, key (music), mediate, meter | on: チョウ | kun: しら.べ, しら.べる, ととの.う, ととの.える | teacher compounds: 調べる | already linked: (none)
- 掘 | meaning: delve, dig, excavate | on: クツ | kun: ほ.る | teacher compounds: 掘ります | already linked: 土を掘る
- 卒 | meaning: die, graduate, private, soldier | on: シュツ, ソツ | kun: お.える, お.わる, そっ.する, ついに, にわか | teacher compounds: 卒業 | already linked: (none)
- 業 | meaning: arts, business, performance, vocation | on: ギョウ, ゴウ | kun: わざ | teacher compounds: 卒業, 授業 | already linked: (none)
- 趣 | meaning: become, elegance, gist, interest, proceed to, purport | on: シュ | kun: おもむ.く, おもむき | teacher compounds: 趣味 | already linked: (none)
- 味 | meaning: flavor, taste | on: ミ | kun: あじ, あじ.わう | teacher compounds: 趣味 | already linked: (none)
- 曲 | meaning: bend, composition, crooked, curve, fault, injustice | on: キョク | kun: くま, ま.がる, ま.げる | teacher compounds: 作曲, 曲 | already linked: 作曲
- 章 | meaning: badge, chapter, composition, design, poem | on: ショウ | kun: — | teacher compounds: 文章 | already linked: 文章
- 類 | meaning: class, genus, kind, sort, variety | on: ルイ | kun: たぐ.い | teacher compounds: 書類 | already linked: 書類
- 禁 | meaning: ban, forbid, prohibition | on: キン | kun: — | teacher compounds: 使用禁止 | already linked: 使用禁止
- 止 | meaning: halt, stop | on: シ | kun: -さ.し, -さ.す, -と.める, -ど.まり, -ど.め, -や.む, と.まる, と.める, とど.まる, とど.め, とど.める, や.む, や.める, よ.す | teacher compounds: 禁止 | already linked: 使用禁止
- 用 | meaning: business, employ, service, use, utilize | on: ヨウ | kun: もち.いる | teacher compounds: 使用中 | already linked: 使用中, 使用禁止
- 帳 | meaning: account book, album, curtain, net, notebook, tent | on: チョウ | kun: とばり | teacher compounds: 手帳 | already linked: (none)
- 館 | meaning: building, large building, mansion, palace | on: カン | kun: たて, やかた | teacher compounds: 図書館, 大使館 | already linked: 図書館, 大使館
- 図 | meaning: audacious, drawing, extraordinary, map, plan | on: ズ, ト | kun: え, はか.る | teacher compounds: 図書館 | already linked: 図書館
- 明 | meaning: bright, light | on: ミョウ, ミン, メイ | kun: -あ.け, あ.かす, あ.かり, あ.く, あ.くる, あ.ける, あか.らむ, あか.るい, あか.るむ, あき.らか | teacher compounds: 明日 | already linked: 明日
- 古 | meaning: old | on: コ | kun: -ふる.す, ふる-, ふる.い | teacher compounds: (old) | already linked: (none)
- 置 | meaning: deposit, employ, keep, leave behind, pawn, placement | on: チ | kun: -お.き, お.く | teacher compounds: 置きます | already linked: (none)
- 遊 | meaning: play | on: ユ, ユウ | kun: あそ.ばす, あそ.ぶ | teacher compounds: 遊んでいます | already linked: (none)
- 温 | meaning: warm | on: オン | kun: あたた.か, あたた.かい, あたた.まる, あたた.める, ぬく | teacher compounds: 気温 | already linked: (none)
- 気 | meaning: air, atmosphere, mind, mood, spirit | on: キ, ケ | kun: き | teacher compounds: 気温, 気 | already linked: (none)
- 服 | meaning: admit, clothing, discharge, obey | on: フク | kun: — | teacher compounds: (clothes) | already linked: (none)
- 去 | meaning: divorce, elapse, eliminate, gone, leave, past | on: キョ, コ | kun: -さ.る, さ.る | teacher compounds: 去年 | already linked: (none)

## Final reminders

- Return ONLY the JSON object. No leading/trailing prose, no ```json fences.
- 117 kanji × 5 words = **585 vocabulary entries** total.
- Validate before responding: every word contains its parent kanji, every reading is hiragana-only, every array length matches.
- If you cannot find 5 truly N5/N4 words for a kanji, pad with the lowest-JLPT common alternatives and mark them honestly. Never invent words.
