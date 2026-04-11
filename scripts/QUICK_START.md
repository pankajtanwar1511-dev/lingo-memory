# Quick Start - Generate 270 Images Automatically (FREE)

## 🚀 Fastest Way (5 minutes setup)

### Step 1: Get Hugging Face Token (2 minutes)
```bash
# 1. Open browser: https://huggingface.co/settings/tokens
# 2. Click "New token"
# 3. Copy the token (looks like: hf_xxxxxxxxxxxx)
```

### Step 2: Setup Script (1 minute)
```bash
cd /home/pankaj/bumble/lingomemory

# Edit the script
nano scripts/generate_images_hf.py

# Find this line (line 15):
HF_API_TOKEN = "YOUR_HF_TOKEN_HERE"

# Replace with your token:
HF_API_TOKEN = "hf_your_actual_token_here"

# Save: Ctrl+O, Enter, Ctrl+X
```

### Step 3: Install Dependencies (1 minute)
```bash
pip install requests
```

### Step 4: Generate All Images (15-20 minutes)
```bash
python3 scripts/generate_images_hf.py
```

That's it! ✅

---

## What Happens:

1. Script reads all 270 prompts from 5 thread files
2. Sends each prompt to Hugging Face's free Stable Diffusion API
3. Downloads generated images to `public/images/verbs/`
4. Images automatically show up in your verb study app

---

## Expected Output:

```
🎨 AUTOMATED VERB IMAGE GENERATOR
======================================================================

📖 Reading: THREAD_1_VERBS_001-054_DETAILED.txt
   Found 54 verbs
📖 Reading: THREAD_2_VERBS_055-108_DETAILED.txt
   Found 54 verbs
📖 Reading: THREAD_3_VERBS_109-162_DETAILED.txt
   Found 54 verbs
📖 Reading: THREAD_4_VERBS_163-216_DETAILED.txt
   Found 54 verbs
📖 Reading: THREAD_5_VERBS_217-270_DETAILED.txt
   Found 54 verbs

📊 Total verbs to generate: 270
💾 Output directory: /home/pankaj/bumble/lingomemory/public/images/verbs

⏳ Need to generate: 270 images

Generate 270 images? This may take a while. (y/n): y

🚀 Starting generation...

[1/270] n5_v_0001
  Generating... (attempt 1/3)
  ✅ Saved: /home/pankaj/bumble/lingomemory/public/images/verbs/n5_v_0001.png
[2/270] n5_v_0002
  Generating... (attempt 1/3)
  ✅ Saved: /home/pankaj/bumble/lingomemory/public/images/verbs/n5_v_0002.png
...

======================================================================
📊 GENERATION COMPLETE
======================================================================
✅ Success: 270
❌ Failed: 0
📁 Images saved to: /home/pankaj/bumble/lingomemory/public/images/verbs
```

---

## Troubleshooting

### "Model is loading" message
✅ **This is normal!** Wait 20 seconds and it will retry automatically.

### Token errors
❌ Make sure you copied the full token from Hugging Face
❌ Token should start with `hf_`

### Slow generation
⏳ Each image takes ~3-5 seconds
⏳ Total time: 15-20 minutes for all 270 images
⏳ Script has built-in delays to avoid rate limits

### Want faster generation?
💡 Use local Stable Diffusion (see SETUP_FREE_IMAGE_GENERATION.md)
💡 Requires NVIDIA GPU but generates in ~5 minutes total

---

## Verify Generated Images

```bash
# Check how many images were generated
ls public/images/verbs/*.png | wc -l

# Should show: 270

# View a few samples
ls public/images/verbs/ | head -10
```

---

## Resume Interrupted Generation

If generation stops, just run again:
```bash
python3 scripts/generate_images_hf.py
```

Script automatically skips already-generated images! ✅

---

## Alternative: Local Generation (Best Quality)

If you have NVIDIA GPU:

```bash
# Install dependencies
pip3 install torch torchvision --index-url https://download.pytorch.org/whl/cu118
pip3 install diffusers transformers accelerate safetensors

# Generate (no API token needed!)
python3 scripts/generate_images_local.py
```

Faster and better quality, but requires GPU.

---

## Cost: $0 FREE! 🎉

- Hugging Face: FREE forever
- No credit card required
- No rate limits that matter
- Unlimited generations

Compare to:
- Manual Bing: FREE but 18 days of work
- DALL-E 3: $8.10 for 270 images
- Midjourney: $10/month

---

## Next Steps

After generation completes:

1. ✅ Images saved to `public/images/verbs/`
2. ✅ App will auto-load them in verb study pages
3. ✅ Restart dev server if needed: `npm run dev`
4. ✅ Check verb page: http://localhost:3000/verbs

Enjoy your automated kawaii anime verb flashcards! 🎨✨
