# 🧪 Quick Offline Mode Test Guide

## Method 1: Use Diagnostic Page (Easiest!)

1. Open: http://localhost:8081/diagnose-offline.html
2. Click **"Run Full Diagnostic"**
3. Check results:
   - ✅ Service Worker should be v18 and controlling
   - ✅ Cache should have 5 files including /index.html
4. If all green, follow on-screen instructions to test offline
5. If any red/orange, click **"Clear SW & Reload"**

## Method 2: Test Main App

### Update Service Worker First:
1. Open http://localhost:8081
2. Open DevTools (F12) → Application tab
3. Click "Clear site data" (left sidebar)
4. Check ALL boxes
5. Click "Clear site data" button
6. Hard reload: **Cmd+Shift+R** (Mac) or **Ctrl+Shift+F5** (Windows)
7. Wait 5 seconds
8. Reload once more (normal reload)

### Then Test Offline:
1. DevTools → Network tab
2. Throttling dropdown → select **"Offline"**
3. Reload page (Cmd/Ctrl + R)
4. **Expected:** Full Nous app loads with orange "Offline Mode" banner
5. **If you see "Offline - Please check connection":** Cache not populated, go back online and reload twice more

## What You Should See Offline:
- ✅ Full Nous login page
- ✅ Orange banner: "⚠️ Offline Mode - Some features unavailable"
- ✅ All buttons working
- ✅ Can click "continue as guest"
- ❌ Firebase features disabled (expected!)

## Troubleshooting:

**Problem:** Shows "Offline - Please check connection"
**Solution:** 
- Go back online
- Reload 2-3 times to populate cache
- Then try offline again

**Problem:** Old service worker version
**Solution:**
- Clear site data (DevTools → Application → Clear site data)
- Hard reload

**Problem:** Still not working
**Solution:**
- Use diagnostic page to see exact issue
- Check console for [SW Phase 2] logs
