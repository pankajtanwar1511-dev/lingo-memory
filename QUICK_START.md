# 🚀 LingoMemory Quick Start Guide

## One-Click Launch Options

### Windows

**Option 1: Double-Click Launcher**
1. Navigate to the project folder
2. Double-click `start-lingomemory.bat`
3. App automatically opens in Chrome!

**Option 2: Desktop Shortcut**
1. Right-click `start-lingomemory.bat`
2. Select "Send to" → "Desktop (create shortcut)"
3. Double-click desktop icon to launch

**Option 3: Taskbar Pin**
1. Create desktop shortcut (Option 2)
2. Right-click shortcut → "Pin to taskbar"
3. Click taskbar icon to launch

### Linux/Mac

**Option 1: Terminal**
```bash
./start-lingomemory.sh
```

**Option 2: Desktop Shortcut**
```bash
# Copy to Desktop
cp LingoMemory.desktop ~/Desktop/
chmod +x ~/Desktop/LingoMemory.desktop

# Or add to Applications menu
cp LingoMemory.desktop ~/.local/share/applications/
```

**Option 3: Application Launcher**
- Press Super/Windows key
- Type "LingoMemory"
- Press Enter

---

## What the Launcher Does

✅ Checks if Node.js is installed
✅ Installs dependencies if needed
✅ Starts the development server
✅ Waits for server to be ready
✅ Auto-opens Chrome browser
✅ Navigates to http://localhost:3000

---

## Stopping the App

**Windows:**
- Close the "LingoMemory Server" window
- Or press `Ctrl + C` in the server window

**Linux/Mac:**
- Press `Ctrl + C` in the terminal

---

## Troubleshooting

### "Node.js not found"
Install Node.js from: https://nodejs.org/

### "Chrome not found"
The script will use your default browser instead.

### Port 3000 already in use
Next.js will automatically try port 3001.
Visit: http://localhost:3001

### Script won't run (Linux/Mac)
Make it executable:
```bash
chmod +x start-lingomemory.sh
```

---

## Manual Start (Traditional Way)

If you prefer the manual approach:

```bash
# Terminal/Command Prompt
npm run dev

# Then open browser manually to:
# http://localhost:3000
```

---

## Files Created

- `start-lingomemory.bat` - Windows launcher
- `start-lingomemory.sh` - Linux/Mac launcher
- `LingoMemory.desktop` - Linux desktop entry
- `QUICK_START.md` - This guide

---

## Next Steps

Once the app opens:

1. ✅ Explore the **Verbs** page for verb practice
2. ✅ Try the new **Matching Exercise** mode
3. ✅ Check out **Conjugation Rules** reference
4. ✅ Take a **Quiz** to test your knowledge
5. ✅ Toggle **Dark Mode** in the top-right

Happy learning! 🎌
