#!/usr/bin/env python3
"""
Generate comprehensive N4-level examples for N5_verbs_remaining.json
Creates rich examples with connectors, time periods, adjectives, adverbs
Processes verbs in batches based on start/end index
"""

import json
import sys
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).parent.parent
VERBS_JSON = BASE_DIR / "public/seed-data/N5_verbs_remaining.json"

# Time expressions
TIME_EXPRESSIONS = {
    'future': ['明日', '来週', '来月', '来年', '今度', 'もうすぐ'],
    'present': ['今', '今日', '今週', '今月', '今年', 'ちょうど'],
    'past': ['昨日', '先週', '先月', '去年', 'さっき', '最近'],
    'habitual': ['毎日', '毎週', '毎朝', '毎晩', 'いつも', 'よく']
}

# Adverbs
ADVERBS = ['よく', 'とても', 'すぐに', '少し', 'たくさん', 'ゆっくり', 'もっと', 'あまり', 'ちょっと', '初めて', 'ちょうど', '全然']

# Connectors
CONNECTORS = ['それから', 'そして', 'でも', 'だから', 'しかし']


def create_comprehensive_examples(verb):
    """Create 3-4 comprehensive examples with N4-level grammar for a verb."""

    kanji = verb['lemma']['kanji']
    kana = verb['lemma']['kana']
    masu_kanji = verb['forms']['masu']['kanji']
    masu_kana = verb['forms']['masu']['kana']
    te_kanji = verb['forms']['te']['kanji']
    te_kana = verb['forms']['te']['kana']
    dict_kanji = verb['lemma']['kanji']
    dict_kana = verb['lemma']['kana']

    primary_meaning = verb['meaning']['gloss'][0] if verb['meaning']['gloss'] else 'do'
    valency = verb['valency']['type']

    examples = {
        "dictionary": [],
        "masu": [],
        "te": []
    }

    # Verb-specific comprehensive examples
    verb_id = verb['id']

    # Dictionary form examples with ~前に, ~ために, ~つもりです
    if kanji == '空く':
        examples["dictionary"].append({
            "jp": "お腹が空く前に、軽い食事をします。",
            "kana": "おなかがすくまえに、かるいしょくじをします。",
            "en": "Before I get hungry, I have a light meal.",
            "grammarTag": "mae-ni",
            "pattern": "Verb(dict) + 前に",
            "highlight": "before doing"
        })
    elif kanji == '飼う':
        examples["dictionary"].append({
            "jp": "犬を飼うために、大きい家を探しています。",
            "kana": "いぬをかうために、おおきいいえをさがしています。",
            "en": "In order to keep a dog, I'm looking for a big house.",
            "grammarTag": "tame-ni",
            "pattern": "Verb(dict) + ために",
            "highlight": "in order to"
        })
    elif kanji == '準備する':
        examples["dictionary"].append({
            "jp": "明日のテストを準備するつもりです。",
            "kana": "あしたのてすとをじゅんびするつもりです。",
            "en": "I plan to prepare for tomorrow's test.",
            "grammarTag": "tsumori",
            "pattern": "Verb(dict) + つもりです",
            "highlight": "plan to"
        })
    elif kanji == '練習する':
        examples["dictionary"].append({
            "jp": "毎日練習する予定です。",
            "kana": "まいにちれんしゅうするよていです。",
            "en": "I plan to practice every day.",
            "grammarTag": "yotei",
            "pattern": "Verb(dict) + 予定です",
            "highlight": "plan to"
        })
    elif kanji == '片付ける':
        examples["dictionary"].append({
            "jp": "部屋を片付ける前に、音楽を聞きます。",
            "kana": "へやをかたづけるまえに、おんがくをききます。",
            "en": "Before tidying the room, I listen to music.",
            "grammarTag": "mae-ni",
            "pattern": "Verb(dict) + 前に",
            "highlight": "before doing"
        })
    elif kanji == '困る':
        examples["dictionary"].append({
            "jp": "お金がないと困ると思います。",
            "kana": "おかねがないとこまるとおもいます。",
            "en": "I think I'll be in trouble without money.",
            "grammarTag": "to-omou",
            "pattern": "Verb(dict) + と思います",
            "highlight": "think that"
        })
    else:
        # Default dictionary form example with ~前に
        examples["dictionary"].append({
            "jp": f"明日、{dict_kanji}前に、準備をします。",
            "kana": f"あした、{dict_kana}まえに、じゅんびをします。",
            "en": f"Tomorrow, before I {primary_meaning}, I will prepare.",
            "grammarTag": "mae-ni",
            "pattern": "Verb(dict) + 前に",
            "highlight": "before doing"
        })

    # Masu form examples with time expressions and adverbs
    if kanji == '空く':
        examples["masu"].extend([
            {
                "jp": "よくお腹が空きます。",
                "kana": "よくおなかがすきます。",
                "en": "I often get hungry.",
                "grammarTag": "habitual-adverb",
                "pattern": "Adverb + Verb(masu)",
                "highlight": "frequency adverb"
            },
            {
                "jp": "昨日、とてもお腹が空きました。",
                "kana": "きのう、とてもおなかがすきました。",
                "en": "Yesterday, I got very hungry.",
                "grammarTag": "past-adverb",
                "pattern": "Time + Adverb + Verb(past)",
                "highlight": "past with adverb"
            }
        ])
    elif kanji == '飼う':
        examples["masu"].extend([
            {
                "jp": "先週から犬を飼います。",
                "kana": "せんしゅうからいぬをかいます。",
                "en": "I've been keeping a dog since last week.",
                "grammarTag": "kara",
                "pattern": "Time + から + Verb(masu)",
                "highlight": "since/from"
            },
            {
                "jp": "初めて猫を飼いました。",
                "kana": "はじめてねこをかいました。",
                "en": "I kept a cat for the first time.",
                "grammarTag": "hajimete",
                "pattern": "初めて + Verb(past)",
                "highlight": "first time"
            }
        ])
    elif kanji == '準備する':
        examples["masu"].extend([
            {
                "jp": "毎日、よく準備します。",
                "kana": "まいにち、よくじゅんびします。",
                "en": "Every day, I prepare well.",
                "grammarTag": "habitual",
                "pattern": "Time + Adverb + Verb(masu)",
                "highlight": "habitual action"
            },
            {
                "jp": "昨日、初めて全部準備しました。",
                "kana": "きのう、はじめてぜんぶじゅんびしました。",
                "en": "Yesterday, I prepared everything for the first time.",
                "grammarTag": "past-hajimete",
                "pattern": "Time + 初めて + Verb(past)",
                "highlight": "first experience"
            }
        ])
    elif kanji == '練習する':
        examples["masu"].extend([
            {
                "jp": "毎日、一時間ぐらい練習します。",
                "kana": "まいにち、いちじかんぐらいれんしゅうします。",
                "en": "Every day, I practice for about an hour.",
                "grammarTag": "duration",
                "pattern": "Time + Duration + Verb(masu)",
                "highlight": "duration"
            },
            {
                "jp": "明日、もっと練習します。",
                "kana": "あした、もっとれんしゅうします。",
                "en": "Tomorrow, I will practice more.",
                "grammarTag": "comparative",
                "pattern": "Time + もっと + Verb(masu)",
                "highlight": "comparative"
            }
        ])
    else:
        # Default masu form examples
        examples["masu"].extend([
            {
                "jp": f"毎日、よく{masu_kanji}。",
                "kana": f"まいにち、よく{masu_kana}。",
                "en": f"Every day, I often {primary_meaning}.",
                "grammarTag": "habitual-adverb",
                "pattern": "Time + Adverb + Verb(masu)",
                "highlight": "habitual action"
            },
            {
                "jp": f"昨日、初めて{masu_kanji[:-2]}ました。",
                "kana": f"きのう、はじめて{masu_kana[:-2]}ました。",
                "en": f"Yesterday, I {primary_meaning}ed for the first time.",
                "grammarTag": "past-hajimete",
                "pattern": "Time + 初めて + Verb(past)",
                "highlight": "first experience"
            }
        ])

    # Te form examples with ~ている, ~てから, sequential actions
    if kanji == '空く':
        examples["te"].extend([
            {
                "jp": "今、お腹が空いています。",
                "kana": "いま、おなかがすいています。",
                "en": "I am hungry now.",
                "grammarTag": "te-iru",
                "pattern": "Time + Verb(teiru)",
                "highlight": "current state"
            },
            {
                "jp": "お腹が空いてから、すぐご飯を食べます。",
                "kana": "おなかがすいてから、すぐごはんをたべます。",
                "en": "After getting hungry, I eat right away.",
                "grammarTag": "te-kara",
                "pattern": "Verb(te) + から",
                "highlight": "after doing"
            }
        ])
    elif kanji == '飼う':
        examples["te"].extend([
            {
                "jp": "犬を飼って、毎日散歩します。",
                "kana": "いぬをかって、まいにちさんぽします。",
                "en": "I keep a dog and walk every day.",
                "grammarTag": "te-sequence",
                "pattern": "Verb(te) + Verb",
                "highlight": "sequential actions"
            },
            {
                "jp": "猫を飼っています。",
                "kana": "ねこをかっています。",
                "en": "I am keeping a cat.",
                "grammarTag": "te-iru-state",
                "pattern": "Verb(teiru)",
                "highlight": "ongoing state"
            }
        ])
    elif kanji == '準備する':
        examples["te"].extend([
            {
                "jp": "準備して、それからテストを受けます。",
                "kana": "じゅんびして、それからてすとをうけます。",
                "en": "I prepare, and then take the test.",
                "grammarTag": "te-sorekara",
                "pattern": "Verb(te) + それから + Verb",
                "highlight": "sequential with connector"
            },
            {
                "jp": "今、準備しています。",
                "kana": "いま、じゅんびしています。",
                "en": "I am preparing now.",
                "grammarTag": "te-iru",
                "pattern": "Time + Verb(teiru)",
                "highlight": "ongoing action"
            }
        ])
    elif kanji == '練習する':
        examples["te"].extend([
            {
                "jp": "毎日練習しています。",
                "kana": "まいにちれんしゅうしています。",
                "en": "I practice every day.",
                "grammarTag": "te-iru-habitual",
                "pattern": "Time + Verb(teiru)",
                "highlight": "habitual action"
            },
            {
                "jp": "練習してから、試合に出ます。",
                "kana": "れんしゅうしてから、しあいにでます。",
                "en": "After practicing, I will participate in the match.",
                "grammarTag": "te-kara",
                "pattern": "Verb(te) + から",
                "highlight": "after doing"
            }
        ])
    else:
        # Default te form examples
        examples["te"].extend([
            {
                "jp": f"{te_kanji}、それから次の仕事をします。",
                "kana": f"{te_kana}、それからつぎのしごとをします。",
                "en": f"After {primary_meaning}ing, I do the next task.",
                "grammarTag": "te-sorekara",
                "pattern": "Verb(te) + それから + Verb",
                "highlight": "sequential actions"
            },
            {
                "jp": f"今、ちょうど{te_kanji}います。",
                "kana": f"いま、ちょうど{te_kana}います。",
                "en": f"I am just {primary_meaning}ing now.",
                "grammarTag": "te-iru",
                "pattern": "Time + Adverb + Verb(teiru)",
                "highlight": "ongoing action"
            }
        ])

    return examples


def process_batch(start_idx, end_idx):
    """Process a batch of verbs and add comprehensive examples."""

    # Load current data
    with open(VERBS_JSON, 'r', encoding='utf-8') as f:
        data = json.load(f)

    verbs = data['verbs']

    # Validate indices
    if start_idx < 0 or end_idx > len(verbs):
        print(f"❌ Error: Invalid indices. Total verbs: {len(verbs)}")
        return 0

    batch_verbs = verbs[start_idx:end_idx]

    print(f"\n📝 Processing batch {start_idx}-{end_idx} ({len(batch_verbs)} verbs)...")

    for i, verb in enumerate(batch_verbs):
        # Generate comprehensive examples
        new_examples = create_comprehensive_examples(verb)

        # Update the verb entry
        verbs[start_idx + i]['examples'] = new_examples

        if (i + 1) % 5 == 0:
            print(f"  ✓ Generated examples for {i + 1}/{len(batch_verbs)} verbs")

    # Save updated data
    data['verbs'] = verbs
    data['metadata']['version'] = "3.0.0"
    data['metadata']['description'] = "Additional N5 verbs with comprehensive N4-level examples and usage patterns"

    with open(VERBS_JSON, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"  ✅ Batch {start_idx}-{end_idx} complete!")
    return len(batch_verbs)


def main():
    # Get batch range from command line args
    if len(sys.argv) != 3:
        print("Usage: python3 generate_n4_examples.py <start_idx> <end_idx>")
        print("\nExample: python3 generate_n4_examples.py 0 20")
        print("  This will process verbs from index 0 to 19 (20 verbs)")
        sys.exit(1)

    start_idx = int(sys.argv[1])
    end_idx = int(sys.argv[2])

    print("=" * 60)
    print(f"Generating Comprehensive N4 Examples (Batch {start_idx}-{end_idx})")
    print("=" * 60)

    count = process_batch(start_idx, end_idx)

    print("\n" + "=" * 60)
    print(f"✅ Generated {count} comprehensive verb examples!")
    print("=" * 60)


if __name__ == "__main__":
    main()
