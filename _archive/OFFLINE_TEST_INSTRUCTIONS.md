# Manual Offline Mode Test Instructions

**Service Worker v18 - Phase 2 Offline Test**

## 🧪 Manual Testing Steps

### Test 1: Main App Offline Mode

1. **Open Chrome/Edge** (best PWA support)
   ```
   http://localhost:8081
   ```

2. **Open DevTools** (F12 or Cmd+Option+I)

3. **Check Service Worker**
   - Go to "Application" tab
   - Click "Service Workers" in left sidebar
   - You should see: `service-worker-v18.js` - Status: activated and running
   - Should show "✓ Controlling" this page

4. **Check Cache**
   - In Application tab, click "Cache Storage"
   - Expand `nous-v18-phase2-2025-11-06`
   - Should see:
     - `/index.html`
     - `/index.js`
     - `/manifest.json`
     - `/` (root)

5. **Test Offline Mode**
   - Go to "Network" tab
   - In throttling dropdown (top of network panel), select "Offline"
   - **IMPORTANT:** You should now see "Offline" indicator

6. **Reload Page**
   - Press Cmd+R (Mac) or Ctrl+R (Windows)
   - **Expected:** Page loads normally from cache!
   - **Check console** for SW logs like `[SW Phase 2] ✓ Serving cached page offline`

7. **Verify Functionality**
   - Page should be fully interactive
   - Buttons should work
   - You can click "continue as guest"
   - **Note:** Firebase features won't work offline (expected)

### Test 2: Offline → Online → Offline Cycle

1. **Start Online**
   - Network tab: Select "No throttling"
   - Reload page

2. **Go Offline**
   - Network tab: Select "Offline"
   - Reload page
   - ✅ Should work

3. **Go Online**
   - Network tab: Select "No throttling"
   - Reload page
   - ✅ Should work (and sync Firebase)

4. **Go Offline Again**
   - Network tab: Select "Offline"
   - Reload page
   - ✅ Should still work

### Test 3: Fresh Browser (No Cache)

1. **Open Incognito/Private Window**
   ```
   http://localhost:8081
   ```

2. **Wait for SW to install** (watch Application tab)

3. **Reload once** to activate SW control

4. **Go offline and test**
   - Should work after initial setup

---

## ✅ Expected Results

### What Should Work Offline:
- ✅ Page loads (HTML, JS, CSS)
- ✅ UI is interactive
- ✅ Guest mode works
- ✅ Local storage features work
- ✅ Timer/stopwatch works
- ✅ Navigation works

### What Won't Work Offline:
- ❌ Firebase login
- ❌ Firebase sync
- ❌ Leaderboard (needs Firebase)
- ❌ Friends list (needs Firebase)

This is **expected** - Firebase requires internet!

---

## 📊 Success Criteria

**Pass if:**
1. ✅ Page loads when offline
2. ✅ UI is interactive and responsive
3. ✅ Console shows `[SW Phase 2]` logs
4. ✅ Guest mode accessible offline
5. ✅ No blank white screen

**Fail if:**
- ❌ Blank page when offline
- ❌ "ERR_INTERNET_DISCONNECTED" error
- ❌ No SW logs in console
- ❌ Page doesn't load at all

---

## 🐛 Troubleshooting

### If offline mode doesn't work:

1. **Clear everything and try again:**
   - Application tab > Clear storage > Clear site data
   - Hard reload (Cmd+Shift+R)
   - Wait for SW to install
   - Reload once more
   - Try offline

2. **Check SW status:**
   - Should say "activated and running"
   - Should say "Controlling"
   - If not, reload page

3. **Check cache:**
   - Should have 4-5 items cached
   - If empty, SW isn't caching properly

4. **Check console for errors:**
   - Red errors indicate problems
   - Look for SW-related errors

---

## 📸 Take Screenshots

Please take screenshots of:
1. ✅ Offline mode working (page loaded offline)
2. Application tab showing SW active
3. Cache storage showing cached files
4. Console showing SW logs

This helps verify everything works!

---

## 🎯 Why Manual Testing?

Playwright's `setOffline` has issues with service workers:
- It blocks SW fetch events
- Doesn't simulate real offline behavior
- Real browser test is more reliable

**Manual testing = Real-world testing!** ✨
