#!/usr/bin/env python3
"""
Final fixes for problematic verbs + add missing verb 167
"""

import re

def fix_verb_57_simpler(filename):
    """Fix n5_v_0057 - TO ENTER (make even simpler, no doorway crossing)"""

    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    old_prompt = """Draw an image in 1:1 ratio of a polite visitor with neat appearance wearing a light blue shirt and dark pants,
standing at an open doorway with slight bowing gesture showing respect, carrying a
small bag in one hand, traditional Japanese entryway (genkan) visible with
shoe shelf and welcome mat, warm interior lighting from doorway,
the door is opened wide showing a welcoming entrance, potted plant visible at entrance,
house number plate visible on wall, character positioned at doorway in polite greeting pose,
welcoming atmosphere created by warm interior colors visible through open door,
kawaii anime polite manners style, color palette showing warm inviting entrance,
clean respectful greeting illustration quality."""

    new_prompt = """Draw an image in 1:1 ratio of a traditional Japanese entryway (genkan) with wooden shoe shelf,
welcome mat on floor, several pairs of shoes neatly arranged, sliding door or open
doorway showing interior hallway, warm lighting from inside, potted plant beside
entrance, house interior visible with warm colors, clean organized entrance area,
welcoming home atmosphere, kawaii anime home interior style, warm inviting color
palette, educational home design illustration quality."""

    content = content.replace(old_prompt, new_prompt)

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"✓ Fixed VERB 57 (TO ENTER) - Removed person, showing entrance only")


def fix_verb_232_completely(filename):
    """Fix n5_v_0232 - TO DROWN (remove ALL water references, show concept differently)"""

    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    old_prompt = """Draw an image in 1:1 ratio of an educational water safety illustration showing a swimming pool with clear
safety signs, a bright orange life preserver hanging on the wall, depth markers
clearly visible on pool edge, a friendly lifeguard character in professional
attire sitting in lifeguard chair holding rescue equipment, swimming pool safety
rules poster visible on wall showing "SWIM SAFELY" with pictograms, shallow and
deep end markers clearly labeled, safety rope dividing areas, clean blue pool
water, sunny day with good visibility, family-friendly public pool setting,
additional safety equipment like rescue pole visible nearby, professional pool
facility design, kawaii anime educational safety style, bright water safety
illustration quality, emphasis on safety equipment and supervision."""

    new_prompt = """Draw an image in 1:1 ratio of a cute cartoon dictionary page or flashcard showing Japanese kanji character
溺 (drown) with furigana reading おぼれる above it, educational textbook style,
the character is large and centered on white page background, stroke order numbers
visible on the kanji, meaning written in English "to drown" at bottom, simple
example sentence in Japanese with furigana, colorful educational design with
border decoration, study notes or arrows pointing to character components,
clean white paper background, professional language learning flashcard style,
kawaii anime educational material design, bright study-friendly color palette,
Japanese language learning illustration quality, emphasis on kanji education."""

    content = content.replace(old_prompt, new_prompt)

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"✓ Fixed VERB 232 (TO DROWN) - Changed to kanji flashcard concept")


def add_missing_verb_167(filename):
    """Add missing VERB 167 placeholder between 166 and 168"""

    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find where to insert (after VERB 166)
    insert_marker = """SAVE AS: n5_v_0166.png

================================================================================

VERB 1 (Extended): n5_v_0168"""

    new_verb_167 = """SAVE AS: n5_v_0166.png

================================================================================

VERB 167: n5_v_0167 - [MISSING - PLACEHOLDER]
────────────────────────────────────────────────────────────────────────────
Draw an image in 1:1 ratio of a simple placeholder image showing the number "167" in large bold
numbers centered on white background, kawaii anime style decorative border with
small question mark symbols around the number, pastel color accent marks, clean
minimal design, the number 167 is very prominent and clear, soft background
gradient from white to pale blue, educational placeholder style, friendly
questioning atmosphere suggesting missing content, kawaii anime missing entry
style, soft pastel color palette, clean placeholder illustration quality.
At the very bottom of the image, include a simple white area containing bold black text "VERB 167" in clear sans-serif font. The text must be perfectly centered both horizontally and vertically within this white area, with equal white space above and below the text. The image should end exactly at the bottom edge of the text area, with no extra white space, lines, or borders below

SAVE AS: n5_v_0167.png

================================================================================

VERB 1 (Extended): n5_v_0168"""

    content = content.replace(insert_marker, new_verb_167)

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"✓ Added VERB 167 placeholder (missing verb)")


def main():
    """Apply all fixes"""

    print("Applying final fixes...\n")

    # Fix VERB 57 in THREAD_2
    fix_verb_57_simpler('/home/pankaj/bumble/lingomemory/scripts/THREAD_2_VERBS_055-108_DETAILED.txt')

    # Fix VERB 232 in THREAD_5
    fix_verb_232_completely('/home/pankaj/bumble/lingomemory/scripts/THREAD_5_VERBS_217-270_DETAILED.txt')

    # Add missing VERB 167 in THREAD_4
    add_missing_verb_167('/home/pankaj/bumble/lingomemory/scripts/THREAD_4_VERBS_163-216_DETAILED.txt')

    print("\n" + "="*70)
    print("Final fixes completed!")
    print("="*70)
    print("\nChanges:")
    print("  ✓ VERB 57 (TO ENTER): Simplified to entryway only (no person)")
    print("  ✓ VERB 232 (TO DROWN): Changed to kanji flashcard (no water)")
    print("  ✓ VERB 167: Added placeholder for missing verb")
    print("\nTotal verbs now: 271 (270 + 1 placeholder)")

if __name__ == '__main__':
    main()
