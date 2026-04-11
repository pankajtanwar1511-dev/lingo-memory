#!/usr/bin/env python3
"""
Generate REAL AI illustrations for verbs using Replicate.com
Shows actual depictions of verb actions (person eating, walking, etc.)

Cost: ~$3-5 for all 270 images
Quality: Excellent (Stable Diffusion XL or Flux)
"""

import json
import os
import requests
from pathlib import Path
import time

# Configuration
OUTPUT_DIR = Path("public/images/verbs")
DATASET_1 = Path("public/seed-data/N5_verbs_dataset.json")
DATASET_2 = Path("public/seed-data/N5_verbs_dataset_2.json")

# Create output directory
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Check for Replicate API token
REPLICATE_API_TOKEN = os.environ.get("REPLICATE_API_TOKEN")

def generate_illustration_prompt(verb: dict) -> str:
    """
    Generate a detailed prompt for realistic verb illustration

    Args:
        verb: Verb dictionary with lemma and meaning

    Returns:
        Detailed prompt for AI image generation
    """
    verb_kanji = verb['lemma']['kanji']
    verb_kana = verb['lemma']['kana']
    verb_meaning = verb['meaning']['primary']

    # Create action-focused prompts
    # These are optimized for clear, educational illustrations

    # Map verb meanings to better illustration prompts
    action_prompts = {
        "to meet": "two people greeting each other with a handshake",
        "to eat": "person eating a meal with chopsticks at a table",
        "to drink": "person drinking from a glass",
        "to walk": "person walking forward, side view",
        "to run": "person running, athletic pose",
        "to study": "person studying at a desk with books and notebook",
        "to read": "person reading a book",
        "to write": "person writing in a notebook with a pen",
        "to speak": "person speaking with speech bubble",
        "to listen": "person listening with hand cupped to ear",
        "to see": "person looking at something with focused expression",
        "to sleep": "person sleeping peacefully in bed",
        "to wake up": "person waking up and stretching in bed",
        "to sit": "person sitting on a chair",
        "to stand": "person standing upright",
        "to come": "person walking towards viewer",
        "to go": "person walking away from viewer",
        "to return": "person walking back with arrow motion",
        "to enter": "person entering through a doorway",
        "to exit": "person exiting through a doorway",
        "to buy": "person at checkout counter making a purchase",
        "to sell": "shopkeeper behind counter with items",
        "to make": "person crafting or building something",
        "to do": "person working on a task at desk",
        "to use": "person using a tool or device",
        "to think": "person with thoughtful expression, hand on chin",
        "to know": "person with lightbulb above head",
        "to understand": "person with understanding expression, finger pointing up",
        "to teach": "teacher pointing at a board",
        "to learn": "student taking notes at desk",
        "to open": "person opening a door or box",
        "to close": "person closing a door",
        "to give": "person handing an object to another person",
        "to receive": "person receiving an object with both hands",
        "to take": "person reaching out to take an object",
        "to put": "person placing an object on a surface",
        "to wear": "person putting on a jacket or shirt",
        "to remove": "person taking off a jacket",
    }

    # Get specific action prompt or use generic format
    action = action_prompts.get(verb_meaning.lower(), f"person doing the action of {verb_meaning}")

    # Create final prompt optimized for cartoon-style illustrations
    prompt = f"""cute cartoon illustration of {action},
simple anime style, kawaii educational character, clear and obvious action,
single person or simple scene, white or light neutral background,
colorful and friendly, no text, high quality, centered composition"""

    # Clean up extra whitespace
    prompt = " ".join(prompt.split())

    return prompt

def generate_image_replicate(prompt: str, verb_id: str) -> bool:
    """
    Generate image using Replicate.com API (SDXL or Flux)

    Requires REPLICATE_API_TOKEN environment variable
    Cost: ~$0.01-0.02 per image

    Args:
        prompt: Text prompt for image generation
        verb_id: Verb ID for filename

    Returns:
        True if successful, False otherwise
    """
    output_path = OUTPUT_DIR / f"{verb_id}.png"

    # Skip if already exists
    if output_path.exists():
        print(f"  ⏭️  Already exists")
        return True

    if not REPLICATE_API_TOKEN:
        print(f"  ❌ REPLICATE_API_TOKEN not set!")
        return False

    try:
        # Using Flux Schnell (fast and good quality, $0.003 per image)
        # Alternative: "stability-ai/sdxl" ($0.008 per image)

        response = requests.post(
            "https://api.replicate.com/v1/predictions",
            headers={
                "Authorization": f"Token {REPLICATE_API_TOKEN}",
                "Content-Type": "application/json",
            },
            json={
                "version": "f2ab8a5569279bc6a363e0cb649adb653c6e0a8b9b3f8e6c1f0f9e8b2d7e9f0a",  # Flux Schnell
                "input": {
                    "prompt": prompt,
                    "width": 512,
                    "height": 512,
                    "num_outputs": 1,
                }
            }
        )

        if response.status_code != 201:
            print(f"  ❌ Error {response.status_code}: {response.text[:100]}")
            return False

        prediction = response.json()
        prediction_url = prediction["urls"]["get"]

        # Poll for completion
        max_wait = 60  # seconds
        start_time = time.time()

        while time.time() - start_time < max_wait:
            response = requests.get(
                prediction_url,
                headers={"Authorization": f"Token {REPLICATE_API_TOKEN}"}
            )
            prediction = response.json()

            if prediction["status"] == "succeeded":
                # Download image
                image_url = prediction["output"][0]
                image_response = requests.get(image_url)

                with open(output_path, 'wb') as f:
                    f.write(image_response.content)

                print(f"  ✅ Generated ({len(image_response.content):,} bytes)")
                return True

            elif prediction["status"] == "failed":
                print(f"  ❌ Generation failed: {prediction.get('error', 'Unknown error')}")
                return False

            time.sleep(2)

        print(f"  ❌ Timeout after {max_wait}s")
        return False

    except Exception as e:
        print(f"  ❌ Exception: {str(e)}")
        return False

def update_dataset_with_images(dataset_path: Path):
    """Update verb dataset JSON with image URLs"""
    print(f"\n📝 Updating {dataset_path.name}...")

    with open(dataset_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    updated_count = 0
    for verb in data['verbs']:
        verb_id = verb['id']
        image_path = OUTPUT_DIR / f"{verb_id}.png"

        if image_path.exists():
            verb['image'] = {
                "url": f"/images/verbs/{verb_id}.png",
                "source": "replicate-flux-schnell",
                "generated": True,
                "type": "illustration"
            }
            updated_count += 1

    with open(dataset_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"  ✅ Updated {updated_count} verbs")

def main():
    print("=" * 70)
    print("🎨 REAL AI VERB ILLUSTRATIONS - Replicate.com")
    print("=" * 70)
    print()

    if not REPLICATE_API_TOKEN:
        print("❌ ERROR: REPLICATE_API_TOKEN not found!")
        print()
        print("To use this script:")
        print("1. Sign up at https://replicate.com (free account)")
        print("2. Get API token from https://replicate.com/account/api-tokens")
        print("3. Set environment variable:")
        print("   export REPLICATE_API_TOKEN='your_token_here'")
        print("4. Run this script again")
        print()
        print("Cost: ~$3-5 for all 270 images (very affordable!)")
        return

    print(f"Using: Replicate.com API (Flux Schnell model)")
    print(f"Cost: ~$0.01 per image (~$3 total for 270 images)")
    print(f"Quality: High-quality AI illustrations")
    print(f"Time: ~30-45 minutes")
    print()

    datasets = [
        (DATASET_1, "Main Verbs (166)"),
        (DATASET_2, "Extended Verbs (104)")
    ]

    total = 0
    generated = 0
    failed = 0

    for dataset_path, dataset_name in datasets:
        print(f"\n{'='*70}")
        print(f"📚 {dataset_name}")
        print(f"{'='*70}")

        with open(dataset_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        for i, verb in enumerate(data['verbs'], 1):
            verb_id = verb['id']
            verb_kanji = verb['lemma']['kanji']
            verb_meaning = verb['meaning']['primary']

            print(f"\n[{i}/{len(data['verbs'])}] {verb_id}: {verb_kanji} ({verb_meaning})")

            # Generate prompt
            prompt = generate_illustration_prompt(verb)
            print(f"  📝 {prompt[:80]}...")

            # Generate image
            success = generate_image_replicate(prompt, verb_id)

            if success:
                generated += 1
            else:
                failed += 1

            total += 1

            # Small delay between requests
            time.sleep(1)

    print("\n" + "=" * 70)
    print("📊 GENERATION SUMMARY")
    print("=" * 70)
    print(f"Total: {total}")
    print(f"✅ Generated: {generated}")
    print(f"❌ Failed: {failed}")
    print()

    if generated > 0:
        print("=" * 70)
        print("📝 UPDATING JSON FILES")
        print("=" * 70)
        update_dataset_with_images(DATASET_1)
        update_dataset_with_images(DATASET_2)

    print("\n" + "=" * 70)
    print("✅ COMPLETE!")
    print("=" * 70)
    print(f"\nImages saved to: {OUTPUT_DIR}")
    print(f"\nEstimated cost: ${generated * 0.003:.2f}")
    print()

if __name__ == "__main__":
    main()
