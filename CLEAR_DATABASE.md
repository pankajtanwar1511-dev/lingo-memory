# Clear Corrupt Database

If you're experiencing database errors, follow these steps to clear the corrupt data:

## Option 1: Use the Reset Page (EASIEST!) ⭐

1. Go to: **http://localhost:3000/reset-database**
2. Click the **"Reset Database"** button
3. Wait for the reset to complete (5-10 seconds)
4. Click **"Go to Homepage"**
5. ✅ Done! Everything should work now

## Option 2: Clear via Browser Console

1. Open your app in the browser
2. Open DevTools (F12 or Right-click → Inspect)
3. Go to the **Console** tab
4. Paste this code and press Enter:

```javascript
// Clear IndexedDB
indexedDB.deleteDatabase('JapVocabDB').onsuccess = () => {
  console.log('✅ IndexedDB cleared');

  // Clear localStorage
  localStorage.removeItem('japvocab-study-store');
  console.log('✅ LocalStorage cleared');

  // Reload page
  console.log('🔄 Reloading...');
  window.location.reload();
};
```

## Option 2: Manual Clear via DevTools

### Clear IndexedDB:
1. Open DevTools (F12)
2. Go to **Application** tab
3. In the left sidebar, expand **IndexedDB**
4. Right-click on **JapVocabDB** → Delete

### Clear LocalStorage:
1. Still in **Application** tab
2. In the left sidebar, click **Local Storage**
3. Click on your domain (e.g., `http://localhost:3000`)
4. Find `japvocab-study-store`
5. Right-click → Delete

### Reload:
- Press `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac) to hard reload

## Verify It Worked

After clearing:
1. Page should reload
2. Database will reinitialize automatically
3. Seed data will load (50 vocabulary cards)
4. No more errors!

## What Was Fixed

✅ **Database Service**: Now checks if study cards exist before adding (prevents duplicates)
✅ **Study Store**: Properly deserializes dates from localStorage (fixes Date errors)
✅ **Both errors**: Should not happen again after clearing

---

**After clearing, your app should work perfectly!**
