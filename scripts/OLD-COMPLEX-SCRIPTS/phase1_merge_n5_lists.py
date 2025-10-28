#!/usr/bin/env python3
"""
Phase 1: Create Canonical N5 Master List

Merges multiple N5 vocabulary sources into a single canonical list.
Creates data/n5-phase1/n5-master-list.json with minimal fields.

Sources:
- JLPT Vocab API (existing file)
- Community lists (if provided)
- JMdict cross-references

Output: Deduplicated, normalized master list with:
  - id (n5_vocab_XXXX)
  - kanji
  - kana
  - romaji
  - meaning (array)
  - jlptLevel ("N5")
  - partOfSpeech (array)
  - source metadata

Usage:
    python3 scripts/phase1_merge_n5_lists.py \\
        --input public/seed-data/n5-comprehensive.json \\
        --output data/n5-phase1/n5-master-list.json
"""

import json
import sys
import argparse
from pathlib import Path
from typing import List, Dict, Any, Set
from collections import defaultdict

# Optional: pykakasi for romanization
try:
    import pykakasi
    PYKAKASI_AVAILABLE = True
except ImportError:
    PYKAKASI_AVAILABLE = False
    print("⚠️  pykakasi not available. Romanization will use simple conversion.")


class N5ListMerger:
    """Merge multiple N5 vocabulary sources into canonical master list"""

    def __init__(self):
        self.seen_entries: Set[str] = set()  # Track unique entries
        self.merged_cards: List[Dict[str, Any]] = []
        self.stats = defaultdict(int)

        # Initialize romanization
        if PYKAKASI_AVAILABLE:
            self.kks = pykakasi.kakasi()
        else:
            self.kks = None

    def normalize_kana(self, kana: str) -> str:
        """Normalize kana string (whitespace, punctuation)"""
        # Remove spaces
        normalized = kana.replace(" ", "").replace("　", "")
        # Normalize variants
        normalized = normalized.replace("・", "")
        return normalized.strip()

    def normalize_kanji(self, kanji: str) -> str:
        """Normalize kanji string"""
        if not kanji:
            return ""
        normalized = kanji.replace(" ", "").replace("　", "")
        return normalized.strip()

    def get_romaji(self, kana: str) -> str:
        """Convert kana to romaji"""
        if self.kks:
            result = self.kks.convert(kana)
            return " ".join([item['hepburn'] for item in result])
        else:
            # Simple fallback (not accurate, placeholder)
            return kana

    def create_unique_key(self, kanji: str, kana: str) -> str:
        """Create unique key for deduplication"""
        # Use kanji if present, otherwise kana
        normalized_kanji = self.normalize_kanji(kanji)
        normalized_kana = self.normalize_kana(kana)

        if normalized_kanji:
            return f"{normalized_kanji}:{normalized_kana}"
        return f":{normalized_kana}"

    def extract_from_existing_n5(self, filepath: str) -> List[Dict[str, Any]]:
        """Extract cards from existing N5 comprehensive file"""
        print(f"📥 Loading existing N5 file: {filepath}")

        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)

        cards = data.get('vocabulary', [])
        print(f"   Found {len(cards)} cards")

        extracted = []
        for card in cards:
            # Filter only N5 cards
            if card.get('jlptLevel') != 'N5':
                continue

            # Extract minimal fields
            kanji = card.get('kanji', '')
            kana = card.get('kana', '')

            # Skip if no kana (required)
            if not kana:
                self.stats['skipped_no_kana'] += 1
                continue

            # Get romaji
            romaji = self.get_romaji(kana)

            # Normalize meaning
            meaning = card.get('meaning', '')
            if isinstance(meaning, str):
                meaning = [m.strip() for m in meaning.split(',')]
            elif not isinstance(meaning, list):
                meaning = [str(meaning)]

            extracted_card = {
                'kanji': self.normalize_kanji(kanji),
                'kana': self.normalize_kana(kana),
                'romaji': romaji,
                'meaning': meaning,
                'jlptLevel': 'N5',
                'partOfSpeech': card.get('partOfSpeech', []),
                'tags': card.get('tags', []),
                'source': {
                    'type': 'jlpt-vocab-api',
                    'url': 'https://jlpt-vocab-api.vercel.app'
                }
            }

            extracted.append(extracted_card)

        self.stats['extracted_from_existing'] = len(extracted)
        return extracted

    def merge_cards(self, cards: List[Dict[str, Any]]) -> None:
        """Merge cards into master list, deduplicating"""
        for card in cards:
            kanji = card.get('kanji', '')
            kana = card.get('kana', '')

            # Create unique key
            key = self.create_unique_key(kanji, kana)

            # Skip duplicates
            if key in self.seen_entries:
                self.stats['duplicates_skipped'] += 1
                continue

            # Add to seen set
            self.seen_entries.add(key)

            # Add sequential ID
            card_id = f"n5_vocab_{len(self.merged_cards) + 1:04d}"
            card['id'] = card_id

            # Ensure required fields
            if 'jlptLevel' not in card:
                card['jlptLevel'] = 'N5'

            if 'partOfSpeech' not in card or not card['partOfSpeech']:
                card['partOfSpeech'] = ['unknown']

            if 'tags' not in card:
                card['tags'] = []

            # Add to merged list
            self.merged_cards.append(card)
            self.stats['merged_total'] += 1

    def save_master_list(self, output_path: str) -> None:
        """Save master list to JSON file"""
        output_path = Path(output_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)

        # Create output structure
        output_data = {
            'version': '1.0.0-phase1',
            'metadata': {
                'phase': 'Phase 1: Master List Creation',
                'createdAt': '2025-01-01',
                'description': 'Canonical N5 vocabulary master list (minimal fields, no examples yet)',
                'license': 'CC BY-SA 4.0',
                'totalCards': len(self.merged_cards)
            },
            'vocabulary': self.merged_cards
        }

        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, ensure_ascii=False, indent=2)

        print(f"\n💾 Saved master list: {output_path}")

    def print_stats(self) -> None:
        """Print merge statistics"""
        print("\n" + "=" * 60)
        print("📊 MERGE STATISTICS")
        print("=" * 60)
        print(f"Extracted from existing:  {self.stats['extracted_from_existing']}")
        print(f"Duplicates skipped:       {self.stats['duplicates_skipped']}")
        print(f"Skipped (no kana):        {self.stats['skipped_no_kana']}")
        print(f"Total merged:             {self.stats['merged_total']}")
        print("=" * 60)


def main():
    parser = argparse.ArgumentParser(description="Phase 1: Create canonical N5 master list")
    parser.add_argument("--input", required=True, help="Input N5 comprehensive JSON file")
    parser.add_argument("--output", default="data/n5-phase1/n5-master-list.json",
                       help="Output master list JSON file")
    parser.add_argument("--additional", nargs='*', help="Additional JSON files to merge")

    args = parser.parse_args()

    print("🚀 Phase 1: Creating Canonical N5 Master List")
    print("=" * 60)
    print()

    # Initialize merger
    merger = N5ListMerger()

    # Extract from existing N5 file
    cards = merger.extract_from_existing_n5(args.input)

    # TODO: Add additional sources if provided
    if args.additional:
        for additional_file in args.additional:
            print(f"📥 Loading additional file: {additional_file}")
            # Add extraction logic for other formats as needed

    # Merge all cards
    print(f"\n🔄 Merging {len(cards)} cards...")
    merger.merge_cards(cards)

    # Save master list
    merger.save_master_list(args.output)

    # Print statistics
    merger.print_stats()

    print("\n✅ Phase 1 Complete!")
    print(f"   Master list: {args.output}")
    print(f"   Total N5 words: {len(merger.merged_cards)}")
    print()
    print("📝 Next step: Run Phase 2 enrichment")
    print(f"   python3 scripts/phase2_enrich_from_tatoeba.py \\")
    print(f"     --input {args.output} \\")
    print(f"     --output data/n5-phase2/n5_with_examples_auto.json")


if __name__ == "__main__":
    main()
