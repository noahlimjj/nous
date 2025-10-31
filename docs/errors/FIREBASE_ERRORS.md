# Firebase Configuration & Authentication Errors

**Last Updated:** October 31, 2025

Complete guide to Firebase-related errors and their solutions.

---

## 🚨 Production Login Issues (CURRENT CRITICAL BUG)

### Error: Users Cannot Login to Production

**Status:** FIXED (code), AWAITING DEPLOYMENT

**Symptoms:**
- "Firebase configuration is missing" error
- "Invalid API key" error
- "Continue as Guest" button fails
- Users see "Configuration Error" screen

**Root Cause:**
After the security incident (exposed API key), Firebase credentials were removed from the codebase. Netlify environment variables were never configured, so production builds have no valid Firebase config.

**Solution:**
Follow the complete setup guide: [NETLIFY_FIREBASE_SETUP.md](../../NETLIFY_FIREBASE_SETUP.md)

**Quick Steps:**
1. Set 7 Firebase environment variables in Netlify dashboard
2. Trigger redeploy
3. Verify production site works

**Code Changes Made:**
- `scripts/generate-config.sh` - Better offline mode fallback
- `index.js` - Added Firebase availability detection
- Now shows helpful "offline mode" message instead of complete lockout

---

## 🔧 Common Firebase Errors

### 1. Firebase Configuration Missing

**Error Message:**
```
Firebase configuration is missing required values. Please check your environment variables.
```

**Where it appears:** Console, production builds

**Cause:**
- `config.js` file missing or not generated
- Environment variables not set in Netlify
- `generate-config.sh` failed during build

**Solution:**

**For Local Development:**
```bash
# Create config.js manually
cat > config.js << 'EOF'
if (typeof window !== 'undefined') {
    window.__firebase_config = {
        apiKey: "YOUR_ACTUAL_API_KEY",
        authDomain: "study-d2678.firebaseapp.com",
        projectId: "study-d2678",
        storageBucket: "study-d2678.firebasestorage.app",
        messagingSenderId: "531881111589",
        appId: "1:531881111589:web:4f3acc170683d154210fcc",
        measurementId: "G-W95VY7VVSX"
    };
}
EOF
```

**For Production (Netlify):**
See [NETLIFY_FIREBASE_SETUP.md](../../NETLIFY_FIREBASE_SETUP.md)

---

### 2. Invalid API Key

**Error Message:**
```
FirebaseError: Firebase: Error (auth/api-key-not-valid.-please-pass-a-valid-api-key.)
```

**Cause:**
- Using placeholder values like `{{FIREBASE_API_KEY}}`
- Old/expired API key
- Regenerated key not updated in config

**Solution:**
1. Get the correct API key from Firebase Console
2. Update local `config.js` OR Netlify environment variables
3. If key was regenerated, update everywhere

**To get your API key:**
```
1. Go to https://console.firebase.google.com/
2. Select project: "Nous (study-d2678)"
3. Click gear icon → Project settings
4. Scroll to "Your apps" → Web app
5. Copy the apiKey value
```

---

### 3. Offline Mode (Not an Error)

**Message:**
```
⚠️  Firebase not configured. Running in offline-only mode.
Cloud features (sync, friends, leaderboard) are disabled.
Your data is stored locally in this browser only.
```

**When it appears:**
- `config.js` explicitly sets `window.__firebase_unavailable = true`
- Firebase env vars not set in Netlify
- Using offline testing mode

**Is this a problem?**
- **No** - if you're testing locally without Firebase
- **Yes** - if this appears in production (means users can't sync data)

**What works in offline mode:**
- ✓ Timer/stopwatch
- ✓ Study sessions (stored locally)
- ✓ Habits tracking
- ✗ Cloud sync
- ✗ Friends feature
- ✗ Leaderboards

**To fix for production:**
Configure Netlify environment variables (see [NETLIFY_FIREBASE_SETUP.md](../../NETLIFY_FIREBASE_SETUP.md))

---

### 4. Firebase Initialization Failed

**Error Message:**
```
Firebase initialization error: [various error messages]
```

**Common Causes:**

**A. Duplicate App Error**
```
Error: Firebase app named '[DEFAULT]' already exists
```
**Solution:** Already handled in code (line 6923-6928 in index.js)

**B. Invalid Project ID**
```
Error: projectId must be a valid string
```
**Solution:** Check `FIREBASE_PROJECT_ID` in config - should be `study-d2678`

**C. Network/CORS Errors**
```
Error: Failed to fetch
```
**Solution:**
- Check internet connection
- Verify API key restrictions in Google Cloud Console
- Make sure your domain is allowlisted

---

### 5. Anonymous Sign-In Failed

**Error Message:**
```
Firebase connection failed. Please check config.js file.
```

**Where:** Clicking "Continue as Guest" button

**Cause:**
- Invalid Firebase config
- Firebase Authentication API not enabled
- API key restrictions blocking anonymous auth

**Solution:**
1. Verify Firebase Authentication is enabled in Firebase Console
2. Check API key restrictions in Google Cloud Console
3. Ensure "Identity Toolkit API" is enabled

**Quick test:**
```bash
# In browser console
window.__isFirebaseAvailable
// Should return: true
```

---

### 6. Google Sign-In Failed

**Error Message:**
Various OAuth errors

**Common Causes:**
- OAuth client not configured
- Wrong domain in authorized origins
- Pop-up blocked by browser

**Solution:**
1. Enable Google Sign-In in Firebase Console → Authentication
2. Add authorized domains: `nousi.netlify.app`, `localhost`
3. Allow pop-ups in browser settings

---

## 🔐 API Key Security Errors

### Error: API Key Exposed

**Detection:**
- Google Cloud sends automated alert
- GitHub secret scanning alert
- Security audit finds hardcoded keys

**Immediate Actions:**
1. **Remove key from all public files**
2. **Force push to rewrite git history** (if needed)
3. **Regenerate the API key** in Google Cloud Console
4. **Add API restrictions**

**Full Procedure:**
See [SECURITY_INCIDENT_OCT30.md](../../SECURITY_INCIDENT_OCT30.md)

---

## 📋 Diagnostic Checklist

When encountering Firebase errors, check these in order:

### 1. Config File Status
```bash
# Check if config.js exists
ls -la config.js

# View contents
cat config.js
```

**Expected:** File exists and contains valid Firebase config

### 2. Firebase Availability
```javascript
// In browser console
window.__isFirebaseAvailable
// Should return: true (for normal operation)
// Returns: false (offline mode)

window.__firebase_config
// Should return: object with Firebase credentials
// Returns: null (offline mode)
```

### 3. Firebase SDK Loaded
```javascript
// In browser console
typeof window.initializeApp
// Should return: "function"
```

### 4. Auth Instance
```javascript
// In browser console
window.auth
// Should return: Auth instance
// Returns: undefined (not initialized)
```

### 5. Console Messages
Open browser console (F12) and look for:
- ✓ `✓ Firebase config loaded from environment variables`
- ✓ `✓ Firebase config loaded successfully`
- ⚠️  `⚠️  Firebase not configured. Running in offline-only mode.`
- ❌ `Firebase initialization error: ...`

---

## 🛠️ Testing Firebase Configuration

### Test 1: Check Config Generation (Local)
```bash
cd scripts
./generate-config.sh
cat ../config.js
```

**Expected output:** Valid config.js file with Firebase credentials

### Test 2: Check Config Generation (Simulated Netlify)
```bash
# Unset env vars to simulate missing Netlify config
unset FIREBASE_API_KEY
cd scripts
./generate-config.sh
```

**Expected output:**
```
⚠️  WARNING: Firebase environment variables not configured!
Creating offline-only config...
```

### Test 3: Test Authentication (Browser)
1. Start local server: `npm start`
2. Visit http://localhost:8081
3. Click "Continue as Guest"
4. Should sign in without errors

### Test 4: Test Firebase Connection
```javascript
// In browser console
fetch('https://firestore.googleapis.com/v1/projects/study-d2678/databases/(default)/documents/test')
  .then(r => r.json())
  .then(console.log)
// Should NOT return CORS or network errors
```

---

## 📚 Related Documentation

- **Netlify Setup:** [NETLIFY_FIREBASE_SETUP.md](../../NETLIFY_FIREBASE_SETUP.md)
- **General Troubleshooting:** [FIREBASE_CONFIG_TROUBLESHOOTING.md](../FIREBASE_CONFIG_TROUBLESHOOTING.md)
- **Security Incident:** [SECURITY_INCIDENT_OCT30.md](../../SECURITY_INCIDENT_OCT30.md)
- **Deployment Guide:** [docs/sop/DEPLOYMENT_GUIDE.md](../sop/DEPLOYMENT_GUIDE.md)

---

## 🆘 Still Having Issues?

### For Local Development:
1. Try offline mode: set `window.__firebase_unavailable = true` in config.js
2. Use "Continue as Guest" to test without real Firebase
3. Check `.claude/CLAUDE.md` for latest known issues

### For Production:
1. Check Netlify build logs for errors
2. Verify all 7 environment variables are set
3. Trigger fresh deploy
4. Test with incognito window (clears cache)

### Need Help?
- Check GitHub Issues: https://github.com/your-repo/issues
- Review `.claude/CLAUDE.md` for recent fixes
- Contact administrator for Firebase access

---

**Last Updated:** October 31, 2025
**Status:** Production fix ready, awaiting Netlify configuration
