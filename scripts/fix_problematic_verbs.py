#!/usr/bin/env python3
"""
Fix problematic verb prompts that Bing refuses to generate.
"""

import re

def fix_verb_57_enter(filename):
    """Fix n5_v_0057 - TO ENTER (direction problem)"""

    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    old_prompt = """Draw an image in 1:1 ratio of a polite visitor with neat appearance wearing a light blue shirt and dark pants,
stepping through an open doorway into a building, one foot crossing the threshold
while other is still outside, slight bowing gesture showing respect, carrying a
small bag in one hand, traditional Japanese entryway (genkan) visible inside with
shoe shelf and welcome mat, warm interior lighting visible through doorway
contrasting with outdoor daylight, the door is opened wide showing the transition
from outside to inside, potted plant visible just inside entrance, house number
plate visible on exterior wall, character positioned at the exact moment of
entering with body half in/half out, welcoming atmosphere created by warm
interior colors, kawaii anime polite manners style, color palette showing
outdoor blues transitioning to warm indoor yellows, threshold crossing
illustration quality."""

    new_prompt = """Draw an image in 1:1 ratio of a polite visitor with neat appearance wearing a light blue shirt and dark pants,
standing at an open doorway with slight bowing gesture showing respect, carrying a
small bag in one hand, traditional Japanese entryway (genkan) visible with
shoe shelf and welcome mat, warm interior lighting from doorway,
the door is opened wide showing a welcoming entrance, potted plant visible at entrance,
house number plate visible on wall, character positioned at doorway in polite greeting pose,
welcoming atmosphere created by warm interior colors visible through open door,
kawaii anime polite manners style, color palette showing warm inviting entrance,
clean respectful greeting illustration quality."""

    content = content.replace(old_prompt, new_prompt)

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"✓ Fixed VERB 57 (TO ENTER) in {filename}")


def fix_verb_87_get_off(filename):
    """Fix n5_v_0087 - TO GET OFF (direction problem)"""

    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    old_prompt = """Draw an image in 1:1 ratio of a careful traveler with alert expression carrying a backpack and wearing travel
clothes, stepping down from train or bus onto station platform, one foot on
vehicle step and other reaching down to platform, holding handrail with one hand
for safety, modern train station setting with platform edge and safety yellow
line visible, station signs showing arrival information, other passengers visible
in background also disembarking, morning or daytime travel atmosphere with good
lighting, the descending motion clearly shown through stepping-down posture,
train or bus door open behind character, destination sign on platform showing
station name, character's expression shows careful attention to safe exit, small
luggage tag visible on backpack showing travel, platform is clean modern transit
design, the getting-off action emphasized through body position and placement,
kawaii anime transit safety style, modern transportation color palette, safe
travel illustration quality."""

    new_prompt = """Draw an image in 1:1 ratio of a careful traveler with alert expression carrying a backpack and wearing travel
clothes, standing on station platform near train or bus with open door,
holding backpack strap and looking ready to disembark, modern train station setting
with platform edge and safety yellow line visible, station signs showing arrival information,
other passengers visible in background at the platform, morning or daytime travel atmosphere
with good lighting, train or bus door open showing interior,
destination sign on platform showing station name, character's expression shows
careful attention to safety, small luggage tag visible on backpack showing travel,
platform is clean modern transit design, kawaii anime transit safety style,
modern transportation color palette, safe travel illustration quality."""

    content = content.replace(old_prompt, new_prompt)

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"✓ Fixed VERB 87 (TO GET OFF) in {filename}")


def fix_verb_102_go_out(filename):
    """Fix n5_v_0102 - TO GO OUT (direction problem)"""

    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    old_prompt = """Draw an image in 1:1 ratio of a person ready to go out with energetic expression wearing nice outing clothes
(jacket, coordinated outfit) and carrying a small bag, stepping through doorway
heading outside, one hand on door and one foot crossing threshold, home entryway
(genkan) with shoes being put on or just put on, outdoor sunny weather visible
through open door, character's expression shows excitement or purpose for outing,
keys in hand ready to lock door, smartphone and wallet visible in bag or pocket,
sunny day outside contrasting with indoor entryway, watch on wrist suggesting
time consciousness, small mirror in entryway showing character checking appearance
before going out, calendar visible on wall showing scheduled outing, door wide
open showing transition from inside to outside, leaving-home action emphasized
through stepping motion and door position, kawaii anime active lifestyle style,
fresh outdoor adventure color palette, going out illustration quality, white
border frame."""

    new_prompt = """Draw an image in 1:1 ratio of a person ready to go out with energetic expression wearing nice outing clothes
(jacket, coordinated outfit) and carrying a small bag, standing at doorway
with hand on door, home entryway (genkan) with shoes on feet,
outdoor sunny weather visible through open door, character's expression shows
excitement or purpose for outing, keys in hand ready to lock door,
smartphone and wallet visible in bag or pocket, sunny day outside visible through doorway,
watch on wrist suggesting time consciousness, small mirror in entryway reflecting character,
calendar visible on wall showing scheduled outing, door wide open showing bright outdoor scene,
ready-to-depart atmosphere, kawaii anime active lifestyle style,
fresh outdoor adventure color palette, going out illustration quality, white
border frame."""

    content = content.replace(old_prompt, new_prompt)

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"✓ Fixed VERB 102 (TO GO OUT) in {filename}")


def fix_verb_232_drown(filename):
    """Fix n5_v_0232 - TO DROWN (safety concern - rewrite to show concept not emergency)"""

    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    old_prompt = """Draw an image in 1:1 ratio of a person in water with panicked expression struggling to stay afloat, arms
waving for help above water surface, swimming pool or open water setting showing
water emergency, character's distressed face partially submerged showing drowning
danger, drowning emphasized through flailing arms and panicked expression,
lifeguard or rescuer visible rushing to help, water splashing around struggling
person, other swimmers visible recognizing emergency, life preserver being thrown
toward person, emergency situation emphasized through panic and help response,
safety equipment visible nearby, perhaps person went too deep or got tired while
swimming, rescue in progress shown through help arriving, kawaii anime water
safety warning style, emergency water color palette, drowning emergency
illustration quality."""

    new_prompt = """Draw an image in 1:1 ratio of an educational water safety illustration showing a swimming pool with clear
safety signs, a bright orange life preserver hanging on the wall, depth markers
clearly visible on pool edge, a friendly lifeguard character in professional
attire sitting in lifeguard chair holding rescue equipment, swimming pool safety
rules poster visible on wall showing "SWIM SAFELY" with pictograms, shallow and
deep end markers clearly labeled, safety rope dividing areas, clean blue pool
water, sunny day with good visibility, family-friendly public pool setting,
additional safety equipment like rescue pole visible nearby, professional pool
facility design, kawaii anime educational safety style, bright water safety
illustration quality, emphasis on safety equipment and supervision."""

    content = content.replace(old_prompt, new_prompt)

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"✓ Fixed VERB 232 (TO DROWN) - Changed to water safety concept in {filename}")


def fix_verb_245_fall_over(filename):
    """Fix n5_v_0245 - TO FALL OVER (safety concern - rewrite to show objects not person)"""

    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    old_prompt = """Draw an image in 1:1 ratio of a person with exhausted or fainting expression beginning to collapse or tall
object falling over, indoor or outdoor setting where collapse occurs, falling
motion emphasized through tilted body or object angle, gravity pulling down
toward ground, character's expression shows loss of consciousness or extreme
exhaustion, knees buckling or object tipping suggesting imminent fall, concerned
onlookers rushing to help prevent hard fall, perhaps heatstroke causing collapse
or tower of items falling, falling emphasized through diagonal angle and downward
motion, about to hit ground unless caught, emergency situation if person collapsing,
rescue attempt visible with people reaching to catch, kawaii anime emergency
concern style, collapsing emergency color palette, falling over illustration
quality."""

    new_prompt = """Draw an image in 1:1 ratio of a tall tower of colorful building blocks or books tipping and falling over,
the tower tilted at dramatic angle mid-fall showing motion, gravity pulling blocks
downward, indoor playroom or study setting with soft carpet or mat below,
some blocks already fallen on soft surface showing tumbled state, the falling tower
emphasized through diagonal angle and scattered pieces, motion lines showing downward
movement, other stable block towers visible in background for comparison,
safe play environment with padded floor, bright cheerful room with toys or books,
child's hand visible at edge reaching to try catching blocks (playfully),
the physics of falling objects illustrated through tilted unstable tower,
kawaii anime playful physics style, bright educational color palette,
tumbling blocks illustration quality, emphasis on objects falling not people."""

    content = content.replace(old_prompt, new_prompt)

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"✓ Fixed VERB 245 (TO FALL OVER) - Changed to falling objects in {filename}")


def main():
    """Apply all fixes to THREAD files"""

    # Fix VERB 57 (TO ENTER) in THREAD_2
    fix_verb_57_enter('/home/pankaj/bumble/lingomemory/scripts/THREAD_2_VERBS_055-108_DETAILED.txt')

    # Fix VERB 87 (TO GET OFF) in THREAD_2
    fix_verb_87_get_off('/home/pankaj/bumble/lingomemory/scripts/THREAD_2_VERBS_055-108_DETAILED.txt')

    # Fix VERB 102 (TO GO OUT) in THREAD_2
    fix_verb_102_go_out('/home/pankaj/bumble/lingomemory/scripts/THREAD_2_VERBS_055-108_DETAILED.txt')

    # Fix VERB 232 (TO DROWN) in THREAD_5
    fix_verb_232_drown('/home/pankaj/bumble/lingomemory/scripts/THREAD_5_VERBS_217-270_DETAILED.txt')

    # Fix VERB 245 (TO FALL OVER) in THREAD_5
    fix_verb_245_fall_over('/home/pankaj/bumble/lingomemory/scripts/THREAD_5_VERBS_217-270_DETAILED.txt')

    print("\n" + "="*70)
    print("All problematic verb prompts have been fixed!")
    print("="*70)
    print("\nSummary of changes:")
    print("  • VERB 57 (TO ENTER): Removed directional crossing, now standing at doorway")
    print("  • VERB 87 (TO GET OFF): Removed stepping motion, now standing on platform")
    print("  • VERB 102 (TO GO OUT): Removed threshold crossing, now ready at door")
    print("  • VERB 232 (TO DROWN): Completely rewritten as water safety educational scene")
    print("  • VERB 245 (TO FALL OVER): Changed from person collapsing to falling toy blocks")
    print("\nNote: VERB 166 (守る - to protect) EXISTS and is correct!")

if __name__ == '__main__':
    main()
