#!/usr/bin/env python3
"""
Build Complete N5 Vocabulary Dataset with Sentence Examples

Takes:
- 807 vocabulary words from N5_vocab_dataset_final.json
- 9,419 sentences from n5_807_vocab_n5_grammar_sentences_v2_enhanced.json

Creates:
- n5_vocab_with_examples.json (All 807 words with attached sentence examples)
- n5_vocab_with_examples.db (SQLite database version)

Each word will have:
- All existing vocabulary metadata
- ALL sentence examples containing that word
- Formality tags (formal/casual) for each sentence
- Question tags (yes/no) for each sentence
"""

import json
import sqlite3
import re
from pathlib import Path
from collections import defaultdict

BASE_DIR = Path(__file__).parent.parent
DATA_DIR = BASE_DIR / "data"

VOCAB_FILE = DATA_DIR / "N5_vocab_dataset_final.json"
SENTENCES_FILE = DATA_DIR / "n5_807_vocab_n5_grammar_sentences_v2_enhanced.json"
OUTPUT_JSON = DATA_DIR / "n5_vocab_with_examples.json"
OUTPUT_DB = DATA_DIR / "n5_vocab_with_examples.db"

print("="*80)
print("BUILDING N5 VOCABULARY WITH SENTENCE EXAMPLES")
print("="*80)
print()

# ============================================================================
# Load Data
# ============================================================================

print("Loading vocabulary dataset...")
with open(VOCAB_FILE, 'r', encoding='utf-8') as f:
    vocab_data = json.load(f)

vocab_list = vocab_data['vocabulary']
print(f"✓ Loaded {len(vocab_list)} vocabulary words")
print()

print("Loading sentences dataset...")
with open(SENTENCES_FILE, 'r', encoding='utf-8') as f:
    sentence_data = json.load(f)

if isinstance(sentence_data, dict) and 'sentences' in sentence_data:
    sentences = sentence_data['sentences']
else:
    sentences = sentence_data

print(f"✓ Loaded {len(sentences)} sentences")
print()

# ============================================================================
# Formality & Question Detection
# ============================================================================

def detect_formality(sentence):
    """Detect if sentence is formal (polite) or casual (plain)"""
    s = sentence.strip()
    end = s[-15:] if len(s) > 15 else s

    # Polite patterns (check BEFORE casual)
    polite_patterns = [
        "ですか", "ますか", "でしょうか",
        "でした", "ました",
        "です", "ます",
        "てください", "ください"
    ]

    for pattern in polite_patterns:
        if end.endswith(pattern):
            return "formal"

    # Casual patterns
    casual_patterns = [
        "だろう", "だよ", "だね", "だった", "だ。",
        "よね", "よ。", "ね。", "の？", "のか", "かな"
    ]

    for pattern in casual_patterns:
        if pattern in end:
            return "casual"

    # Fallback: check anywhere
    if "です" in s or "ます" in s:
        return "formal"

    return "casual"


def is_question(sentence):
    """Detect if sentence is a question"""
    s = sentence.strip()

    # Check for question mark
    if s.endswith("？") or s.endswith("?"):
        return True

    # Check for question patterns
    question_patterns = [
        "ですか", "ますか", "でしょうか",
        "の？", "のか", "かな", "だっけ"
    ]

    end = s[-15:] if len(s) > 15 else s
    for pattern in question_patterns:
        if pattern in end:
            return True

    return False


# ============================================================================
# Build Vocabulary with Examples
# ============================================================================

print("Analyzing sentences and attaching to vocabulary...")

# Create word -> examples mapping
word_examples = defaultdict(list)

for sentence in sentences:
    jp = sentence.get('japanese', '')
    eng = sentence.get('english', '')
    sent_id = sentence.get('id', '')

    # Detect formality and question
    formality = detect_formality(jp)
    is_quest = is_question(jp)

    # Find which vocabulary words appear in this sentence
    for entry in vocab_list:
        word_id = entry.get('id', '')
        kanji = entry.get('kanji', '')
        kana = entry.get('kana', '')

        # Check if word appears (kanji or kana form)
        found = False
        if kanji and kanji in jp:
            found = True
        elif kana and kana in jp:
            found = True

        if found:
            word_examples[word_id].append({
                'sentence_id': sent_id,
                'japanese': jp,
                'english': eng,
                'formality': formality,
                'is_question': is_quest,
                'source': sentence.get('source', 'tatoeba')
            })

print(f"✓ Analyzed {len(sentences)} sentences")
print()

# ============================================================================
# Build Complete Vocabulary List
# ============================================================================

print("Building complete vocabulary dataset...")

complete_vocab = []
stats = {
    'total_words': 0,
    'with_examples': 0,
    'without_examples': 0,
    'total_examples': 0,
    'formal_examples': 0,
    'casual_examples': 0,
    'questions': 0,
    'statements': 0
}

for entry in vocab_list:
    word_id = entry.get('id', '')
    examples = word_examples.get(word_id, [])

    # Create complete vocabulary entry
    vocab_entry = {
        # Original fields
        'id': entry.get('id', ''),
        'kanji': entry.get('kanji', ''),
        'kana': entry.get('kana', ''),
        'romaji': entry.get('romaji', ''),
        'meaning': entry.get('meaning', []),
        'jlptLevel': entry.get('jlptLevel', 'N5'),
        'partOfSpeech': entry.get('partOfSpeech', []),
        'tags': entry.get('tags', []),

        # Example sentences (NEW - main feature!)
        'examples': examples,
        'example_count': len(examples),

        # Statistics
        'example_stats': {
            'total': len(examples),
            'formal': len([e for e in examples if e['formality'] == 'formal']),
            'casual': len([e for e in examples if e['formality'] == 'casual']),
            'questions': len([e for e in examples if e['is_question']]),
            'statements': len([e for e in examples if not e['is_question']])
        },

        # Original metadata (keep for compatibility)
        'audio': entry.get('audio', {}),
        'source': entry.get('source', {}),
        'license': entry.get('license', {})
    }

    complete_vocab.append(vocab_entry)

    # Update stats
    stats['total_words'] += 1
    if len(examples) > 0:
        stats['with_examples'] += 1
    else:
        stats['without_examples'] += 1

    stats['total_examples'] += len(examples)
    stats['formal_examples'] += vocab_entry['example_stats']['formal']
    stats['casual_examples'] += vocab_entry['example_stats']['casual']
    stats['questions'] += vocab_entry['example_stats']['questions']
    stats['statements'] += vocab_entry['example_stats']['statements']

print(f"✓ Built complete vocabulary dataset")
print()

# ============================================================================
# Save JSON
# ============================================================================

output_data = {
    'metadata': {
        'version': '3.0.0',
        'date': '2025-11-03',
        'description': 'N5 Vocabulary with Complete Sentence Examples',
        'total_words': stats['total_words'],
        'total_examples': stats['total_examples'],
        'source_sentences': len(sentences),
        'source_vocab': str(VOCAB_FILE),
        'source_sentences_file': str(SENTENCES_FILE)
    },
    'statistics': stats,
    'vocabulary': complete_vocab
}

print("Saving JSON...")
with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
    json.dump(output_data, f, ensure_ascii=False, indent=2)

file_size = OUTPUT_JSON.stat().st_size / (1024 * 1024)
print(f"✓ Saved: {OUTPUT_JSON}")
print(f"  Size: {file_size:.2f} MB")
print()

# ============================================================================
# Create SQLite Database
# ============================================================================

print("Creating SQLite database...")

# Remove existing database
if OUTPUT_DB.exists():
    OUTPUT_DB.unlink()

conn = sqlite3.connect(str(OUTPUT_DB))
cursor = conn.cursor()

# Create vocabulary table
cursor.execute('''
CREATE TABLE vocabulary (
    id TEXT PRIMARY KEY,
    kanji TEXT,
    kana TEXT NOT NULL,
    romaji TEXT,
    meaning TEXT,
    jlpt_level TEXT,
    part_of_speech TEXT,
    tags TEXT,
    example_count INTEGER,
    formal_count INTEGER,
    casual_count INTEGER,
    question_count INTEGER,
    statement_count INTEGER
)
''')

# Create examples table
cursor.execute('''
CREATE TABLE examples (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vocab_id TEXT NOT NULL,
    sentence_id TEXT,
    japanese TEXT NOT NULL,
    english TEXT,
    formality TEXT NOT NULL,
    is_question INTEGER NOT NULL,
    source TEXT,
    FOREIGN KEY (vocab_id) REFERENCES vocabulary(id)
)
''')

# Create indexes
cursor.execute('CREATE INDEX idx_vocab_id ON examples(vocab_id)')
cursor.execute('CREATE INDEX idx_formality ON examples(formality)')
cursor.execute('CREATE INDEX idx_question ON examples(is_question)')

# Insert vocabulary
for entry in complete_vocab:
    cursor.execute('''
    INSERT INTO vocabulary VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        entry['id'],
        entry['kanji'],
        entry['kana'],
        entry['romaji'],
        json.dumps(entry['meaning'], ensure_ascii=False),
        entry['jlptLevel'],
        json.dumps(entry['partOfSpeech'], ensure_ascii=False),
        json.dumps(entry['tags'], ensure_ascii=False),
        entry['example_count'],
        entry['example_stats']['formal'],
        entry['example_stats']['casual'],
        entry['example_stats']['questions'],
        entry['example_stats']['statements']
    ))

    # Insert examples
    for example in entry['examples']:
        cursor.execute('''
        INSERT INTO examples (vocab_id, sentence_id, japanese, english, formality, is_question, source)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            entry['id'],
            example['sentence_id'],
            example['japanese'],
            example['english'],
            example['formality'],
            1 if example['is_question'] else 0,
            example['source']
        ))

conn.commit()
conn.close()

db_size = OUTPUT_DB.stat().st_size / (1024 * 1024)
print(f"✓ Saved: {OUTPUT_DB}")
print(f"  Size: {db_size:.2f} MB")
print()

# ============================================================================
# Print Statistics
# ============================================================================

print("="*80)
print("STATISTICS")
print("="*80)
print()

print(f"📚 VOCABULARY:")
print(f"  Total words: {stats['total_words']}")
print(f"  With examples: {stats['with_examples']} ({stats['with_examples']/stats['total_words']*100:.1f}%)")
print(f"  Without examples: {stats['without_examples']} ({stats['without_examples']/stats['total_words']*100:.1f}%)")
print()

print(f"📝 EXAMPLES:")
print(f"  Total examples: {stats['total_examples']}")
print(f"  Formal: {stats['formal_examples']} ({stats['formal_examples']/stats['total_examples']*100:.1f}%)")
print(f"  Casual: {stats['casual_examples']} ({stats['casual_examples']/stats['total_examples']*100:.1f}%)")
print(f"  Questions: {stats['questions']} ({stats['questions']/stats['total_examples']*100:.1f}%)")
print(f"  Statements: {stats['statements']} ({stats['statements']/stats['total_examples']*100:.1f}%)")
print()

print(f"📊 COVERAGE:")
avg_examples = stats['total_examples'] / stats['total_words'] if stats['total_words'] > 0 else 0
print(f"  Average examples per word: {avg_examples:.2f}")
print()

# Show distribution
print(f"📈 EXAMPLE DISTRIBUTION:")
distribution = defaultdict(int)
for entry in complete_vocab:
    count = entry['example_count']
    if count == 0:
        distribution['0'] += 1
    elif count == 1:
        distribution['1'] += 1
    elif count <= 5:
        distribution['2-5'] += 1
    elif count <= 10:
        distribution['6-10'] += 1
    elif count <= 20:
        distribution['11-20'] += 1
    else:
        distribution['20+'] += 1

print(f"  0 examples:    {distribution['0']:4d} words")
print(f"  1 example:     {distribution['1']:4d} words")
print(f"  2-5 examples:  {distribution['2-5']:4d} words")
print(f"  6-10 examples: {distribution['6-10']:4d} words")
print(f"  11-20 examples: {distribution['11-20']:4d} words")
print(f"  20+ examples:  {distribution['20+']:4d} words")
print()

# Show top 10 words by example count
print(f"🔝 TOP 10 WORDS BY EXAMPLE COUNT:")
sorted_vocab = sorted(complete_vocab, key=lambda x: x['example_count'], reverse=True)
for i, entry in enumerate(sorted_vocab[:10], 1):
    kanji_display = entry['kanji'] if entry['kanji'] else '(none)'
    meaning = entry['meaning'][0] if entry['meaning'] else 'N/A'
    print(f"  {i:2d}. {kanji_display} / {entry['kana']} - {meaning}")
    print(f"      Examples: {entry['example_count']} (F:{entry['example_stats']['formal']}, C:{entry['example_stats']['casual']}, Q:{entry['example_stats']['questions']})")
print()

# Show words with no examples
if stats['without_examples'] > 0:
    print(f"⚠️  WORDS WITH NO EXAMPLES (first 20):")
    no_example_words = [e for e in complete_vocab if e['example_count'] == 0]
    for entry in no_example_words[:20]:
        kanji_display = entry['kanji'] if entry['kanji'] else '(none)'
        meaning = entry['meaning'][0] if entry['meaning'] else 'N/A'
        print(f"  {entry['id']}: {kanji_display} / {entry['kana']} - {meaning}")

    if len(no_example_words) > 20:
        print(f"  ... and {len(no_example_words) - 20} more")
    print()

print("="*80)
print("COMPLETE!")
print("="*80)
print()

print("Generated files:")
print(f"  1. {OUTPUT_JSON} ({file_size:.2f} MB)")
print(f"     - All 807 words with examples attached")
print(f"     - Each example has: japanese, english, formality, is_question")
print()
print(f"  2. {OUTPUT_DB} ({db_size:.2f} MB)")
print(f"     - SQLite database version")
print(f"     - Tables: vocabulary (807 rows), examples ({stats['total_examples']} rows)")
print()

print("Usage example (Python):")
print("""
import json
with open('data/n5_vocab_with_examples.json', 'r', encoding='utf-8') as f:
    vocab = json.load(f)

# Get all words
words = vocab['vocabulary']

# Find word by id
word = next(w for w in words if w['id'] == 'n5_vocab_0001')
print(f"Word: {word['kanji']} / {word['kana']}")
print(f"Examples: {word['example_count']}")

# Show formal examples only
formal_examples = [e for e in word['examples'] if e['formality'] == 'formal']
for ex in formal_examples[:5]:
    print(f"  {ex['japanese']}")
    print(f"  {ex['english']}")
""")
