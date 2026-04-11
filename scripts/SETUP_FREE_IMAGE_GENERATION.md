# Free Automated Image Generation Setup

Generate all 270 verb images automatically without manual copy-paste!

## Option 1: Hugging Face API (Recommended - Easiest) ⭐

**Pros:**
- Free forever
- No installation needed
- Cloud-based (works on any computer)
- Simple Python script

**Cons:**
- Rate limited (but sufficient for our needs)
- Takes ~15-20 minutes for all 270 images

### Setup Steps:

1. **Get FREE Hugging Face Token** (1 minute):
   ```bash
   # Go to: https://huggingface.co/settings/tokens
   # Click "New token" → Create (read access is enough)
   # Copy the token
   ```

2. **Edit the script**:
   ```bash
   nano /home/pankaj/bumble/lingomemory/scripts/generate_images_hf.py

   # Replace this line:
   HF_API_TOKEN = "YOUR_HF_TOKEN_HERE"

   # With your actual token:
   HF_API_TOKEN = "hf_xxxxxxxxxxxxxxxxxxxxx"
   ```

3. **Install dependencies**:
   ```bash
   pip install requests
   ```

4. **Run the generator**:
   ```bash
   cd /home/pankaj/bumble/lingomemory
   python3 scripts/generate_images_hf.py
   ```

5. **Wait for completion** (~15-20 minutes for all 270 images)

---

## Option 2: Local Stable Diffusion (Advanced - Best Quality)

**Pros:**
- Completely free
- No rate limits
- Best quality
- Full control

**Cons:**
- Requires good GPU (NVIDIA recommended)
- 10-15 GB disk space
- Initial setup time

### Requirements:
- NVIDIA GPU with 6GB+ VRAM (or CPU mode, but slower)
- 15 GB free disk space
- Ubuntu/Linux

### Setup Steps:

1. **Install dependencies**:
   ```bash
   # Install CUDA if you have NVIDIA GPU
   sudo apt update
   sudo apt install -y wget git python3-pip

   # Install PyTorch
   pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

   # Install diffusers and dependencies
   pip3 install diffusers transformers accelerate safetensors
   ```

2. **Create local generation script**:
   ```bash
   # I'll create this script for you
   ```

3. **Run generator**:
   ```bash
   python3 scripts/generate_images_local.py
   ```

---

## Option 3: Craiyon (DALL-E Mini) - Super Easy but Lower Quality

**Pros:**
- No API token needed
- Completely free
- Very easy setup

**Cons:**
- Lower quality images
- Slower generation

### Setup:
```bash
pip install craiyon
python3 scripts/generate_images_craiyon.py
```

---

## Comparison Table

| Feature | Hugging Face | Local SD | Craiyon |
|---------|-------------|----------|---------|
| **Cost** | Free | Free | Free |
| **Quality** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Speed** | Medium | Fast | Slow |
| **Setup** | Easy | Hard | Easy |
| **GPU Needed** | No | Yes | No |
| **Rate Limit** | Soft | None | Yes |

---

## Recommended Workflow

### For Most Users: Use Hugging Face (Option 1)
1. Get free token (1 minute)
2. Edit script with token
3. Run: `python3 scripts/generate_images_hf.py`
4. Wait ~20 minutes
5. Done! All 270 images generated

### For Best Quality: Use Local SD (Option 2)
- If you have NVIDIA GPU with 6GB+ VRAM
- Follow setup steps above
- Generate unlimited images locally

---

## Troubleshooting

### Hugging Face: "Model is loading"
- Wait 20-30 seconds and retry
- The model needs to warm up on first use

### Hugging Face: Rate limit errors
- Script has built-in 3-second delays
- If you still hit limits, increase delay in script

### Local SD: Out of memory
- Reduce batch size
- Use lower resolution (512x512 instead of 768x768)
- Try CPU mode (slower but works)

### Images don't match style
- The prompts are already optimized for kawaii anime style
- If quality is poor, try Local SD option

---

## Next Steps After Generation

1. Images will be in: `/home/pankaj/bumble/lingomemory/public/images/verbs/`
2. Check a few samples: `ls public/images/verbs/ | head -10`
3. View in app: Images auto-load in verb study pages
4. Regenerate specific images if needed

---

## Cost Comparison

| Method | Cost for 270 Images |
|--------|---------------------|
| Hugging Face | **$0** (Free) |
| Local SD | **$0** (Free) |
| Craiyon | **$0** (Free) |
| Bing (Manual) | **$0** but 18 days of work |
| DALL-E 3 API | ~$8.10 (270 × $0.03) |
| Midjourney | ~$10/month subscription |

**Conclusion:** Use Hugging Face for free automated generation! 🎉
