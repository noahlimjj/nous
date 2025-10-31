# Common Errors & Quick Fixes

**Last Updated:** October 31, 2025

Quick reference for the most frequent issues encountered during development.

---

## 🔥 Critical Issues (Fix Immediately)

### 1. Users Can't Login to Production

**Error:** "Configuration Error" or "Firebase configuration missing"

**Quick Fix:**
```bash
# Configure Netlify environment variables
# See: NETLIFY_FIREBASE_SETUP.md for detailed steps
```

**Status:** Code fixed, awaiting Netlify env var configuration

**Priority:** CRITICAL - blocks all production users

---

## ⚡ Development Errors (Frequent)

### 2. Port 8081 Already in Use

**Error:**
```
OSError: [Errno 48] Address already in use
```

**Quick Fix:**
```bash
lsof -ti:8081 | xargs kill -9
npm start
```

**Why it happens:** Previous server didn't shut down properly

---

### 3. Firebase Config Missing (Local)

**Error:**
```
Firebase configuration is missing. The config.js file may not have been generated properly.
```

**Quick Fix:**
```bash
# Option 1: Use real Firebase (recommended for testing auth)
cat > config.js << 'EOF'
if (typeof window !== 'undefined') {
    window.__firebase_config = {
        apiKey: "YOUR_ACTUAL_API_KEY_HERE",
        authDomain: "study-d2678.firebaseapp.com",
        projectId: "study-d2678",
        storageBucket: "study-d2678.firebasestorage.app",
        messagingSenderId: "531881111589",
        appId: "1:531881111589:web:4f3acc170683d154210fcc",
        measurementId: "G-W95VY7VVSX"
    };
}
EOF

# Option 2: Use offline mode (for testing without Firebase)
cat > config.js << 'EOF'
if (typeof window !== 'undefined') {
    window.__firebase_config = null;
    window.__firebase_unavailable = true;
}
EOF
```

**Reference:** [FIREBASE_ERRORS.md](./FIREBASE_ERRORS.md#1-firebase-configuration-missing)

---

### 4. Timezone Shows Wrong Hours

**Error:** Reports show times in UTC instead of Singapore time (SGT)

**Example:** Session at 4pm SGT shows as "08:00" (UTC)

**Quick Fix:**
Already fixed in `index.js:3233-3236`

**Code:**
```javascript
// Convert to Singapore time (UTC+8)
const date = new Date(session.startTime.toMillis());
const singaporeHour = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Singapore' })).getHours();
```

**Reference:** `.claude/CLAUDE.md` - Error #3

---

### 5. "Continue as Guest" Button Doesn't Work

**Error:** Clicking guest button shows Firebase error

**Causes:**
- Invalid Firebase config
- Placeholder values in config.js
- API key restrictions blocking anonymous auth

**Quick Fix:**
```bash
# Use offline mode for local testing
cat > config.js << 'EOF'
if (typeof window !== 'undefined') {
    window.__firebase_config = null;
    window.__firebase_unavailable = true;
}
EOF

npm start
```

**Reference:** [FIREBASE_ERRORS.md](./FIREBASE_ERRORS.md#5-anonymous-sign-in-failed)

---

## 🎨 UI/Display Errors

### 6. Dark Mode Not Working

**Error:** Clicking dark mode toggle doesn't change theme

**Status:** FIXED (Oct 30, 2025)

**What was wrong:**
- Night mode state was controlled by `!isNightMode` (inverted)
- Toggle logic was backwards

**Fix Location:** `index.js:3843` - Changed to `isNightMode` (removed negation)

**Reference:** `docs/NIGHT_MODE_ANALYSIS.md`

---

### 7. Trees Look Too Similar

**Error:** All tree types look identical despite different names

**Cause:**
- All trees use same `mainBranchColor` (lines 4022-4028)
- Identical branch paths
- Same leaf positions

**Status:** DOCUMENTED, not yet fixed

**Fix Plan:** See `docs/sop/TREE_DESIGN_IMPROVEMENTS.md`

**TODO:**
- Create depth variations for branch colors
- Generate unique branch structures per tree type
- Vary leaf positions by tree type

---

## 🔐 Security Errors

### 8. API Key Exposed in Public Repo

**Detection:** Google Cloud automated alert, GitHub secret scanning

**Emergency Fix:**
```bash
# 1. Remove key from files
# 2. Amend commit or force push to rewrite history
git commit --amend --no-edit
git push --force

# 3. Regenerate key in Google Cloud Console
# 4. Update config.js and Netlify env vars
```

**Full Procedure:** [SECURITY_INCIDENT_OCT30.md](../../SECURITY_INCIDENT_OCT30.md)

**Prevention:**
- Never commit config.js (it's gitignored)
- Use placeholders in documentation
- Enable GitHub secret scanning
- Consider pre-commit hooks

---

## 🧪 Testing Errors

### 9. Playwright Tests Fail

**Error:** Various test failures

**Common Causes:**
- Server not running on port 8081
- Firebase not configured
- Service worker cache issues

**Quick Fix:**
```bash
# Start server
npm start

# In another terminal, run tests
npx playwright test

# If cache issues:
# Clear browser data in test or use incognito mode
```

---

### 10. Service Worker Update Loop

**Error:** Page keeps reloading infinitely

**Cause:** Service worker detecting version mismatch and forcing reload

**Quick Fix:**
```bash
# In browser console
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => reg.unregister())
})
# Then refresh page
```

**Long-term Fix:** Check service worker version logic in `sw.js`

---

## 📦 Build/Deployment Errors

### 11. Netlify Build Fails

**Error:** Build fails with various messages

**Common Causes:**

**A. generate-config.sh permission denied**
```bash
chmod +x scripts/generate-config.sh
git add scripts/generate-config.sh
git commit -m "fix: Make generate-config.sh executable"
git push
```

**B. Missing environment variables**
- Check Netlify dashboard → Site settings → Environment variables
- Must have all 7 Firebase env vars set
- See [NETLIFY_FIREBASE_SETUP.md](../../NETLIFY_FIREBASE_SETUP.md)

**C. Tailwind build fails**
```bash
# Ensure Tailwind is installed
npm install tailwindcss
npm run build
```

---

### 12. Config.js Not Generated in Production

**Error:** Production shows "offline mode" message

**Cause:** `generate-config.sh` not running or env vars not set

**Diagnostic:**
Check Netlify build logs for:
```
✓ Firebase environment variables found
✓ config.js generated successfully
```

Or:
```
⚠️  WARNING: Firebase environment variables not configured!
```

**Fix:** Set environment variables in Netlify (see [NETLIFY_FIREBASE_SETUP.md](../../NETLIFY_FIREBASE_SETUP.md))

---

## 🗂️ Data/State Errors

### 13. Data Not Syncing

**Error:** Changes don't appear on other devices

**Causes:**
- Offline mode enabled
- Firebase not connected
- Firestore rules blocking writes
- User not authenticated

**Quick Diagnostic:**
```javascript
// In browser console
window.auth?.currentUser
// Should show user object

window.db
// Should show Firestore instance
```

**Fix:**
1. Verify Firebase connection
2. Check Firestore rules
3. Ensure user is authenticated
4. Check browser console for errors

---

### 14. Session Data Lost After Reload

**Error:** Timer data disappears on page refresh

**Cause:**
- Using offline mode (data stored in localStorage only)
- Not authenticated to Firebase
- Session not properly saved to Firestore

**Fix:**
- Ensure Firebase is connected
- Log in (don't use guest mode)
- Check that sessions are being written to Firestore

---

## 🎯 Quick Diagnostic Commands

### Check Server Status
```bash
lsof -ti:8081  # Should return PID if running
curl http://localhost:8081  # Should return HTML
```

### Check Firebase Config
```bash
cat config.js  # Should show Firebase credentials or offline flag
```

### Check Git Status
```bash
git status  # Config.js should NOT appear (it's gitignored)
```

### Check Node/NPM
```bash
node --version  # Should be >= 14.0.0
npm --version
```

### Check Netlify Status
```bash
netlify status  # Shows linked site info
```

---

## 📚 See Also

- **Firebase Errors:** [FIREBASE_ERRORS.md](./FIREBASE_ERRORS.md)
- **Error Index:** [README.md](./README.md)
- **Project Context:** [.claude/CLAUDE.md](../../.claude/CLAUDE.md)
- **Troubleshooting:** [docs/sop/TROUBLESHOOTING_GUIDE.md](../sop/TROUBLESHOOTING_GUIDE.md)

---

## 💡 Tips

1. **Always check browser console** - Most errors show detailed messages there
2. **Use offline mode for testing** - No Firebase needed for basic functionality
3. **Check `.claude/CLAUDE.md` first** - Contains latest known issues and fixes
4. **Test locally before pushing** - Use `npm start` and verify changes
5. **Clear cache when in doubt** - Old cached data can cause mysterious bugs

---

**Last Updated:** October 31, 2025
**Maintained by:** Noah Lim
