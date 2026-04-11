#!/usr/bin/env python3
"""
Local Stable Diffusion image generation (FREE, NO API needed)
Best quality, no rate limits, requires GPU
"""

import os
import time
from pathlib import Path

try:
    import torch
    from diffusers import StableDiffusionPipeline
except ImportError:
    print("❌ Required packages not installed!")
    print()
    print("Install with:")
    print("  pip3 install torch torchvision --index-url https://download.pytorch.org/whl/cu118")
    print("  pip3 install diffusers transformers accelerate safetensors")
    exit(1)

# Configuration
MODEL_ID = "runwayml/stable-diffusion-v1-5"  # Smaller model for laptop GPUs
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

def load_pipeline():
    """Load Stable Diffusion model"""
    print("🔄 Loading Stable Diffusion 1.5 model...")
    print("   (This will download ~4GB on first run)")
    print()

    device = "cuda" if torch.cuda.is_available() else "cpu"

    if device == "cpu":
        print("⚠️  WARNING: No GPU detected, using CPU (much slower)")
        print()

    pipe = StableDiffusionPipeline.from_pretrained(
        MODEL_ID,
        torch_dtype=torch.float16 if device == "cuda" else torch.float32,
        safety_checker=None,  # Disable for speed
        requires_safety_checker=False
    )
    pipe = pipe.to(device)

    # Enable optimizations for laptop GPU
    if device == "cuda":
        pipe.enable_attention_slicing(1)  # Maximum memory savings
        pipe.enable_vae_slicing()

    print(f"✅ Model loaded on {device}")
    print()
    return pipe

def generate_image(pipe, prompt, output_path):
    """Generate single image"""
    try:
        # Add style keywords
        enhanced_prompt = f"kawaii anime educational flashcard, clean simple illustration, cute chibi art style, {prompt}"

        # Generate at 512x512 (SD 1.5 native resolution)
        image = pipe(
            enhanced_prompt,
            num_inference_steps=50,  # More steps for better quality
            guidance_scale=7.5,
            height=512,
            width=512,
        ).images[0]

        # Save
        image.save(output_path)
        print(f"  ✅ Saved: {output_path}")
        return True

    except Exception as e:
        print(f"  ❌ Error: {e}")
        return False

def extract_prompts_from_file(file_path):
    """Extract verb prompts from thread file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    verbs = []
    sections = content.split('VERB ')[1:]

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

        if 'SAVE AS:' in section:
            prompt = section.split('SAVE AS:')[0].strip()
            lines = prompt.split('\n')
            prompt_lines = []
            found_separator = False

            for line in lines:
                if '────' in line:
                    found_separator = True
                    continue
                if found_separator and line.strip():
                    prompt_lines.append(line.strip())

            prompt_text = ' '.join(prompt_lines)

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
    print("🎨 LOCAL STABLE DIFFUSION IMAGE GENERATOR")
    print("=" * 70)
    print()

    # Check GPU
    if torch.cuda.is_available():
        print(f"✅ GPU detected: {torch.cuda.get_device_name(0)}")
        print(f"   VRAM: {torch.cuda.get_device_properties(0).total_memory / 1e9:.1f} GB")
    else:
        print("⚠️  No GPU detected - will use CPU (slower)")
    print()

    # Collect prompts
    all_verbs = []
    for thread_file in THREAD_FILES:
        if os.path.exists(thread_file):
            print(f"📖 Reading: {os.path.basename(thread_file)}")
            verbs = extract_prompts_from_file(thread_file)
            all_verbs.extend(verbs)
            print(f"   Found {len(verbs)} verbs")

    print()
    print(f"📊 Total verbs: {len(all_verbs)}")
    print(f"💾 Output directory: {OUTPUT_DIR}")
    print()

    # Check existing
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

    # Estimate time
    time_per_image = 15 if torch.cuda.is_available() else 120  # seconds
    total_minutes = (len(remaining) * time_per_image) / 60
    print(f"⏱️  Estimated time: ~{total_minutes:.0f} minutes")
    print()

    response = input(f"Generate {len(remaining)} test images? (y/n): ")
    if response.lower() != 'y':
        print("Cancelled.")
        return

    # Load model
    pipe = load_pipeline()

    # Generate images
    print("🚀 Starting generation...")
    print()

    success_count = 0
    fail_count = 0
    start_time = time.time()

    for idx, verb in enumerate(remaining, 1):
        print(f"[{idx}/{len(remaining)}] {verb['id']}")
        output_path = os.path.join(OUTPUT_DIR, verb['filename'])

        if generate_image(pipe, verb['prompt'], output_path):
            success_count += 1
        else:
            fail_count += 1

        # Progress update
        if idx % 10 == 0:
            elapsed = time.time() - start_time
            avg_time = elapsed / idx
            remaining_time = avg_time * (len(remaining) - idx)
            print(f"  ⏱️  Progress: {idx}/{len(remaining)} | ETA: {remaining_time/60:.1f} min")
            print()

    elapsed_total = time.time() - start_time

    print()
    print("=" * 70)
    print("📊 GENERATION COMPLETE")
    print("=" * 70)
    print(f"✅ Success: {success_count}")
    print(f"❌ Failed: {fail_count}")
    print(f"⏱️  Total time: {elapsed_total/60:.1f} minutes")
    print(f"📁 Images saved to: {OUTPUT_DIR}")
    print()

if __name__ == "__main__":
    main()
