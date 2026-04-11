# Verb Image Generation Guide

## 🎨 Automatic Free Image Generation for All 270 Verbs

This script uses **Hugging Face's free Stable Diffusion API** to generate images for all verbs.

---

## Features

✅ **Completely FREE** - No API key required
✅ **No daily limits** - Generate all 270 images in one go
✅ **Automatic** - Reads datasets, generates images, updates JSON
✅ **Resume support** - Skips already generated images
✅ **Error handling** - Retries failed generations

---

## Installation

```bash
# Install dependencies (only needs 'requests' library)
pip install -r scripts/requirements_images.txt
```

---

## Usage

### Generate all images (270 total)

```bash
python3 scripts/generate_verb_images.py
```

**Time:** ~30-45 minutes (with 3-second delays between requests)

**Output:** Images saved to `public/images/verbs/`

---

## What It Does

1. ✅ Reads both datasets:
   - `N5_verbs_dataset.json` (166 verbs)
   - `N5_verbs_dataset_2.json` (104 verbs)

2. ✅ For each verb:
   - Generates optimized Stable Diffusion prompt
   - Calls Hugging Face API (free, public)
   - Downloads image as `{verb_id}.png`
   - Shows progress

3. ✅ Updates JSON files:
   - Adds `image` field to each verb
   - Format: `{ "url": "/images/verbs/n5_v_0001.png", "source": "stable-diffusion-2-1", "generated": true }`

---

## Example Output

```
========================================================================
🎨 VERB IMAGE GENERATOR - Stable Diffusion (Free)
========================================================================

Using: Hugging Face free Stable Diffusion API
Cost: $0 (completely free)
Time: ~30-45 minutes for 270 images

📚 Processing: Main Verbs (166)
----------------------------------------------------------------------

[1/166] n5_v_0001: 会う (to meet)
  📝 Prompt: minimalist illustration of to meet, simple line art...
  ✅ Generated: n5_v_0001.png

[2/166] n5_v_0002: 遊ぶ (to enjoy oneself, play)
  📝 Prompt: minimalist illustration of to enjoy oneself, play...
  ✅ Generated: n5_v_0002.png

...

========================================================================
📊 GENERATION SUMMARY
========================================================================
Total verbs: 270
✅ Generated: 270
⏭️  Skipped (already exist): 0
❌ Failed: 0

========================================================================
✅ COMPLETE!
========================================================================
Images saved to: public/images/verbs
Total images: 270
```

---

## Customization

Want to change the image style? Edit the `generate_prompt()` function:

```python
# Current style: minimalist, line art, educational
prompt = f"minimalist illustration of {verb_meaning}, simple line art..."

# Alternative styles:
# Anime style:
prompt = f"anime illustration of {verb_meaning}, Japanese anime art style..."

# Realistic:
prompt = f"realistic photo of person doing {verb_meaning}, natural lighting..."

# Chibi/cute:
prompt = f"cute chibi character {verb_meaning}, kawaii style..."
```

---

## Troubleshooting

### Rate Limit Errors

If you get 503 errors, the model is loading. The script automatically waits and retries.

### Failed Generations

Re-run the script - it skips existing images and only generates failed ones.

### Model Loading

First few requests might be slow (model needs to load). Be patient!

---

## Alternative: With Hugging Face API Token (Optional)

For faster generation, you can use a free Hugging Face API token:

1. Sign up at https://huggingface.co (free)
2. Get API token from https://huggingface.co/settings/tokens
3. Add to script:

```python
headers={
    "Authorization": f"Bearer YOUR_TOKEN_HERE",
    "Content-Type": "application/json",
}
```

**Still 100% free, just faster!**

---

## Next Steps After Generation

Once images are generated:

1. ✅ JSON files automatically updated with image URLs
2. ✅ Update verb UI to display images
3. ✅ Create image-based flashcards
4. ✅ Add image galleries

---

## Cost Breakdown

- Hugging Face API: **$0** (free, public model)
- Storage: ~5-10MB (270 small images)
- Time: ~30-45 minutes
- **Total: $0**

---

## Support

If you encounter issues:
1. Check internet connection
2. Verify `requests` library is installed
3. Try re-running (resumes from last successful image)
4. Check Hugging Face status: https://status.huggingface.co
