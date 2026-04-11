#!/usr/bin/env python3
"""
Automated image generation using Hugging Face Inference API (FREE)
Generates kawaii anime verb flashcard images from prompts
"""

import requests
import json
import time
import os
from pathlib import Path

# Configuration
HF_API_TOKEN = "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"  # Get free token from huggingface.co/settings/tokens
API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"
OUTPUT_DIR = "/home/pankaj/bumble/lingomemory/public/images/verbs"
THREAD_FILES = [
    "/home/pankaj/bumble/lingomemory/scripts/THREAD_1_VERBS_001-054_DETAILED.txt",
    "/home/pankaj/bumble/lingomemory/scripts/THREAD_2_VERBS_055-108_DETAILED.txt",
    "/home/pankaj/bumble/lingomemory/scripts/THREAD_3_VERBS_109-162_DETAILED.txt",
    "/home/pankaj/bumble/lingomemory/scripts/THREAD_4_VERBS_163-216_DETAILED.txt",
    "/home/pankaj/bumble/lingomemory/scripts/THREAD_5_VERBS_217-270_DETAILED.txt",
]

# Create output directory
os.makedirs(OUTPUT_DIR, exist_ok=True)

def generate_image(prompt, output_path, retries=3):
    """Generate image using Hugging Face API"""
    headers = {"Authorization": f"Bearer {HF_API_TOKEN}"}

    for attempt in range(retries):
        try:
            print(f"  Generating... (attempt {attempt + 1}/{retries})")

            response = requests.post(
                API_URL,
                headers=headers,
                json={"inputs": prompt},
                timeout=120
            )

            if response.status_code == 200:
                with open(output_path, 'wb') as f:
                    f.write(response.content)
                print(f"  ✅ Saved: {output_path}")
                return True
            elif response.status_code == 503:
                print(f"  ⏳ Model loading... waiting 20s")
                time.sleep(20)
            else:
                print(f"  ❌ Error {response.status_code}: {response.text}")
                time.sleep(5)

        except Exception as e:
            print(f"  ❌ Exception: {e}")
            time.sleep(5)

    return False

def extract_prompts_from_file(file_path):
    """Extract verb prompts from thread file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    verbs = []
    sections = content.split('VERB ')[1:]  # Skip header

    for section in sections:
        # Extract verb ID from line like "1: n5_v_0001 - 会う (to meet)"
        first_line = section.split('\n')[0]
        if 'n5_v_' not in first_line:
            continue

        # Extract n5_v_XXXX from the first line
        verb_id = None
        parts = first_line.split()
        for part in parts:
            if part.startswith('n5_v_'):
                verb_id = part
                break

        if not verb_id:
            continue

        # Extract prompt (everything between separator line and "SAVE AS:")
        if 'SAVE AS:' in section:
            prompt = section.split('SAVE AS:')[0].strip()
            # Remove the separator line and verb header
            lines = prompt.split('\n')
            # Find where the actual prompt starts (after separator line)
            prompt_lines = []
            found_separator = False
            for line in lines:
                if '────' in line:
                    found_separator = True
                    continue
                if found_separator and line.strip():
                    prompt_lines.append(line.strip())

            prompt_text = ' '.join(prompt_lines)

            # Clean up the prompt - remove the text specification part
            if 'At the very bottom' in prompt_text:
                prompt_text = prompt_text.split('At the very bottom')[0].strip()

            verbs.append({
                'id': verb_id,
                'prompt': prompt_text,
                'filename': f"{verb_id}.png"
            })

    return verbs

def main():
    """Main execution"""
    print("=" * 70)
    print("🎨 AUTOMATED VERB IMAGE GENERATOR")
    print("=" * 70)
    print()

    if HF_API_TOKEN == "YOUR_HF_TOKEN_HERE":
        print("❌ ERROR: Please set your Hugging Face API token!")
        print()
        print("To get a FREE token:")
        print("1. Go to: https://huggingface.co/settings/tokens")
        print("2. Click 'New token'")
        print("3. Copy the token and paste it in this script")
        print()
        return

    # Collect all prompts
    all_verbs = []
    for thread_file in THREAD_FILES:
        if os.path.exists(thread_file):
            print(f"📖 Reading: {os.path.basename(thread_file)}")
            verbs = extract_prompts_from_file(thread_file)
            all_verbs.extend(verbs)
            print(f"   Found {len(verbs)} verbs")

    print()
    print(f"📊 Total verbs to generate: {len(all_verbs)}")
    print(f"💾 Output directory: {OUTPUT_DIR}")
    print()

    # Check existing images
    existing = [v for v in all_verbs if os.path.exists(os.path.join(OUTPUT_DIR, v['filename']))]
    remaining = [v for v in all_verbs if not os.path.exists(os.path.join(OUTPUT_DIR, v['filename']))]

    if existing:
        print(f"✅ Already generated: {len(existing)} images")
    if remaining:
        print(f"⏳ Need to generate: {len(remaining)} images")
    else:
        print("🎉 All images already generated!")
        return

    # TEST MODE: Only generate first 5 images
    print()
    print("🧪 TEST MODE: Generating first 5 images only")
    remaining = remaining[:5]
    print(f"📝 Will generate: {len(remaining)} images")

    print()
    response = input(f"Generate {len(remaining)} test images? (y/n): ")
    if response.lower() != 'y':
        print("Cancelled.")
        return

    print()
    print("🚀 Starting generation...")
    print()

    # Generate images
    success_count = 0
    fail_count = 0

    for idx, verb in enumerate(remaining, 1):
        print(f"[{idx}/{len(remaining)}] {verb['id']}")
        output_path = os.path.join(OUTPUT_DIR, verb['filename'])

        # Add style keywords to enhance anime style
        enhanced_prompt = f"kawaii anime educational flashcard style, {verb['prompt']}"

        if generate_image(enhanced_prompt, output_path):
            success_count += 1
        else:
            fail_count += 1
            print(f"  ⚠️  Failed to generate {verb['id']}")

        # Rate limiting - wait between requests
        if idx < len(remaining):
            time.sleep(3)  # 3 second delay between images

    print()
    print("=" * 70)
    print("📊 GENERATION COMPLETE")
    print("=" * 70)
    print(f"✅ Success: {success_count}")
    print(f"❌ Failed: {fail_count}")
    print(f"📁 Images saved to: {OUTPUT_DIR}")
    print()

if __name__ == "__main__":
    main()
