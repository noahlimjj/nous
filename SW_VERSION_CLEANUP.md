# Service Worker Version Cleanup Guide

**Issue:** Old service worker versions may still be registered in your browser
**Impact:** Reload loops, canceled requests, performance issues
**Solution:** Clear old registrations as documented below

---

## Quick Fix (Recommended)

### Option 1: Clear Site Data (Cleanest)

1. Open http://localhost:8081
2. Press **F12** to open DevTools
3. Go to **Application** tab
4. Click **"Clear site data"** (left sidebar)
5. Check **all boxes** (Cache, Storage, Service Workers)
6. Click **"Clear site data"** button
7. Hard reload: **Cmd+Shift+R** (Mac) or **Ctrl+Shift+F5** (Windows)
8. Wait 5 seconds for v18 to install
9. Reload once more (normal reload)

### Option 2: Unregister Old SWs Manually

1. Open http://localhost:8081
2. Press **F12** to open DevTools
3. Go to **Application** tab → **Service Workers**
4. You should see entries for:
   - `/service-worker.js` (v16 - OLD)
   - `/service-worker-v17.js` (v17 - OLD)
   - `/service-worker-v18.js` (v18 - CURRENT)
5. Click **"Unregister"** next to OLD versions only
6. Keep v18 registered
7. Reload page

---

## Service Worker Versions

###Current Version (Use This)
- **File:** `service-worker-v18.js`
- **Cache:** `nous-v18-phase2-2025-11-06`
- **Features:**
  - Full offline support
  - Navigation handling
  - Smart caching (stale-while-revalidate)
- **Status:** ✅ Production Ready

### Deprecated Versions (Remove These)

#### v17 - Basic Caching (No Offline Nav)
- **File:** `service-worker-v17.js`
- **Cache:** `nous-v17-phase1`
- **Status:** ❌ Deprecated - lacks offline navigation
- **Action:** Unregister

#### v16 - No Caching (Reset Mode)
- **File:** `service-worker.js`
- **Cache:** `nous-v16-2025-11-03-deprecated`
- **Status:** ❌ Deprecated - used for cache clearing only
- **Action:** Unregister

---

## How to Check Your Current SW Version

### Method 1: DevTools

1. Open http://localhost:8081
2. Press F12 → Application tab → Service Workers
3. Look at the "Source" column
4. Should show: `service-worker-v18.js`

### Method 2: Console

```javascript
// Run in browser console:
navigator.serviceWorker.getRegistrations().then(regs => {
  regs.forEach(reg => {
    console.log('SW:', reg.active?.scriptURL);
  });
});

// Expected output:
// SW: http://localhost:8081/service-worker-v18.js
```

### Method 3: Diagnostic Tool

1. Open http://localhost:8081/diagnose-offline.html
2. Click "Run Full Diagnostic"
3. Check "Service Worker Status" section
4. Version should show: ✅ v18

---

## Symptoms of Old SW Registered

### If you have v16 or v17 still registered:

**Symptoms:**
- Page reloads multiple times (4-10+)
- Requests show as "(canceled)" in Network tab
- Console shows multiple "[SW v16]" or "[SW v17]" messages
- Offline mode doesn't work properly
- "Offline - Please check connection" instead of cached app

**Solution:** Follow "Quick Fix" above to clear old versions

---

## Auto-Cleanup Behavior

The app **automatically upgrades** from old versions to v18:

### What Happens on Page Load:

1. `index.html` registration code checks existing SWs
2. If v18 found → Does nothing (already upgraded)
3. If v16/v17 found → Unregisters them, registers v18
4. If no SW → Registers v18

### Expected Behavior:

- **First visit after update:** 1-4 page reloads (one-time)
- **After upgrade complete:** No extra reloads
- **Old caches:** Automatically deleted (except v18 cache)

---

## Troubleshooting

### Problem: Page keeps reloading

**Diagnosis:**
```javascript
// In console:
navigator.serviceWorker.getRegistrations().then(r => console.log(r.length));
// If > 1, you have multiple SWs registered
```

**Fix:** Clear site data (see Quick Fix above)

### Problem: Shows "Offline" fallback instead of cached app

**Diagnosis:** v16 or v17 still registered (no offline nav support)

**Fix:** Unregister old versions, keep only v18

### Problem: Console shows "[SW v16]" messages

**Diagnosis:** v16 still active

**Fix:**
```javascript
// In console:
navigator.serviceWorker.getRegistrations().then(regs => {
  regs.forEach(r => {
    if (!r.active.scriptURL.includes('v18')) {
      r.unregister().then(() => console.log('Unregistered:', r.active.scriptURL));
    }
  });
});
// Then reload page
```

---

## For Developers

### When to Bump SW Version

Create a new version (v19, v20, etc.) when:
- Changing cache strategy
- Adding/removing cached files
- Fixing critical SW bugs
- Adding new offline features

### How to Create New Version

1. Copy `service-worker-v18.js` → `service-worker-v19.js`
2. Update version in file:
   ```javascript
   const CACHE_VERSION = 'nous-v19-phase3-YYYY-MM-DD';
   ```
3. Update registration in `index.html`:
   ```javascript
   const CURRENT_SW = '/service-worker-v19.js';
   const CURRENT_CACHE_PREFIX = 'nous-v19';
   ```
4. Test upgrade path from v18 → v19
5. Document changes

### Don't Delete Old Files

Keep old SW files (`service-worker.js`, `service-worker-v17.js`) for graceful upgrades:
- Users with old versions registered need the files to unregister cleanly
- After 1 month, safe to delete (all users will have upgraded)

---

## Production Deployment

### Pre-Deploy Checklist

- [ ] Bump SW version number
- [ ] Update cache name with new date
- [ ] Test upgrade path from previous version
- [ ] Verify old caches get deleted
- [ ] Test offline mode with new version

### Post-Deploy Monitoring

Check for:
- Multiple SW registrations (should be 1)
- Excessive page reloads (should be 1-2 max)
- Cache size (should be ~50KB)
- Console errors related to SW

### Emergency Rollback

If SW v19 has critical bug:

1. **Option A:** Revert to v18
   ```javascript
   const CURRENT_SW = '/service-worker-v18.js';
   ```

2. **Option B:** Disable SW entirely
   ```javascript
   const CURRENT_SW = null; // No SW
   ```

3. **Option C:** Deploy "nuke" SW
   ```javascript
   // service-worker-nuke.js
   self.addEventListener('activate', () => {
     caches.keys().then(names =>
       names.forEach(n => caches.delete(n))
     );
     self.registration.unregister();
   });
   ```

---

## FAQ

### Q: Why do I see requests to `/service-worker.js` instead of `/service-worker-v18.js`?

A: You still have v16 registered. Follow "Quick Fix" to upgrade.

### Q: How many service workers should be registered?

A: **Only 1** - service-worker-v18.js

### Q: Can I have both v17 and v18 registered?

A: No - only one SW per scope. The newer version will replace the old one.

### Q: Will clearing site data delete my user data?

A: It clears:
- ✅ Service worker registrations
- ✅ Cache (will be repopulated)
- ❌ **Does NOT delete Firebase data** (stored in IndexedDB, persists)
- ❌ **Does NOT delete localStorage** (habits, timers stay)

Safe to clear for SW cleanup!

---

**Last Updated:** November 6, 2025
**Current Version:** v18
**Cache Name:** `nous-v18-phase2-2025-11-06`
