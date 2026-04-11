# Complete Guide: Adding Images to All 270 Verbs

## 🎯 RECOMMENDED: Quick Placeholder Images (5 minutes)

**Best for**: Getting started immediately with nice-looking images

```bash
# Install dependency
pip install Pillow

# Generate all 270 placeholder images
python3 scripts/generate_verb_placeholders.py
```

**What you get:**
- ✅ Beautiful placeholders with Japanese + English text
- ✅ Colorful pastel backgrounds
- ✅ Perfect for studying
- ✅ Can replace with AI images anytime
- ✅ Takes only 2-3 minutes to generate all 270

**Example output:**
```
┌─────────────────────┐
│                     │
│       会う          │  ← Kanji (large)
│     (あう)          │  ← Kana (medium)
│                     │
│     to meet         │  ← English (small)
│                     │
└─────────────────────┘
```

---

## 🤖 Option 2: Free AI Image Generation (Manual)

### A. **Bing Image Creator** (DALL-E 3 - Best Quality)

**FREE**: 15 boosts/day, unlimited slow generation

1. Go to: https://www.bing.com/images/create
2. Use this prompt format:
   ```
   minimalist illustration of [verb action], simple line art,
   educational flashcard style, clean white background,
   Japanese learning material
   ```
3. Download and save as `public/images/verbs/{verb_id}.png`

**Time**: ~2-3 weeks (15 verbs/day)

### B. **Leonardo.ai** (Free Tier)

**FREE**: 150 tokens/day (~30 images)

1. Sign up: https://leonardo.ai
2. Use "Leonardo Diffusion XL" model
3. Prompt: Same as above
4. Download images

**Time**: ~9 days (30 verbs/day)

### C. **Craiyon** (Completely Free, Unlimited)

**FREE**: Unlimited, no signup

1. Go to: https://www.craiyon.com
2. Generate 9 images at once
3. Lower quality but completely free
4. Download and crop

**Time**: ~2-3 days (dedicated work)

---

## 🚀 Option 3: Bulk AI Generation (Advanced)

### Using Replicate.com API

**Cost**: ~$2-5 for all 270 images

```python
# Install
pip install replicate

# Set API key (get from replicate.com)
export REPLICATE_API_TOKEN="your_token"

# Use our script (will create later if you want)
python3 scripts/generate_verb_images_replicate.py
```

### Using OpenAI DALL-E API

**Cost**: ~$5.40 for 270 images ($0.02/image)

```python
# Install
pip install openai

# Set API key
export OPENAI_API_KEY="your_key"

# Generate
python3 scripts/generate_verb_images_openai.py
```

---

## 📝 Option 4: Hybrid Approach (Recommended)

**Best balance of quality and effort:**

1. **Week 1**: Generate 15/day with Bing Image Creator (105 images)
2. **Week 2**: Generate 15/day with Bing Image Creator (105 more)
3. **Week 3**: Use placeholders for remaining 60 verbs
4. **Gradually**: Replace placeholders when you have time

---

## 🔧 After Getting Images

### Update JSON Files

Our scripts automatically update the JSON files, but if you add images manually:

```python
# Run this to add image URLs to JSON
python3 scripts/update_verb_image_urls.py
```

### Update UI to Show Images

I can help you update the verb pages to display images once you have them!

---

## 💡 Image Requirements

- **Format**: PNG (recommended) or JPG
- **Size**: 512x512 pixels (square)
- **Naming**: `{verb_id}.png` (e.g., `n5_v_0001.png`)
- **Location**: `public/images/verbs/`
- **Style**: Minimalist, educational, clean background

---

## 🎨 Prompt Engineering Tips

For best AI-generated images:

### Good Prompts:
```
✅ "minimalist illustration of person eating, simple line art, educational"
✅ "clean icon of walking action, flat design, white background"
✅ "simple drawing of studying, Japanese textbook style, clear"
```

### Avoid:
```
❌ Too complex: "detailed realistic photo of..."
❌ Too vague: "eating"
❌ Multiple subjects: "eating and drinking and..."
```

---

## 🚦 Getting Started Now

**Immediate action (5 minutes):**

```bash
# 1. Install Pillow
pip install Pillow

# 2. Generate placeholder images
python3 scripts/generate_verb_placeholders.py

# 3. Done! You now have all 270 images
```

**Your app will immediately show:**
- Japanese kanji in large text
- Kana reading
- English meaning
- Beautiful colored backgrounds

**Later:** Replace placeholders with AI images at your own pace!

---

## 📊 Comparison Table

| Method | Cost | Time | Quality | Effort |
|--------|------|------|---------|--------|
| Placeholder (Recommended) | $0 | 5 min | Good | None |
| Bing (Manual) | $0 | 2-3 weeks | Excellent | Medium |
| Leonardo.ai | $0 | 9 days | Excellent | Medium |
| Craiyon | $0 | 2-3 days | Fair | High |
| Replicate API | ~$3 | 30 min | Excellent | Low |
| DALL-E API | ~$5 | 30 min | Excellent | Low |

---

## 🎯 My Recommendation

1. **Start with placeholders** (5 minutes) - Get images immediately
2. **Use Bing daily** (15/day) - Gradually get high-quality AI images
3. **Replace placeholders** - Swap them out over time

This way:
- ✅ Your app works TODAY with nice images
- ✅ You get free high-quality AI images gradually
- ✅ No stress, no rush
- ✅ No cost!

---

## Need Help?

Let me know which approach you want and I'll help you:
- Set up the scripts
- Update the UI to show images
- Create bulk prompts for AI generation
- Anything else!

Just say: "Let's use [option name]"
