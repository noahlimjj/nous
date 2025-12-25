# Netlify Firebase Configuration Setup

**Status:** REQUIRED for production deployment
**Last Updated:** October 31, 2025

---

## 🚨 Current Issue

Users cannot login to the production site because Firebase environment variables are not configured in Netlify.

**Symptoms:**
- "Firebase configuration is missing" errors
- "Invalid API key" errors
- "Continue as Guest" button fails
- Users completely locked out of the app

**Root Cause:**
After the security incident (exposed API key), Firebase credentials were removed from the codebase for security. However, Netlify environment variables were never configured, so production builds have no valid Firebase config.

---

## ✅ Solution: Configure Netlify Environment Variables

### Step 1: Get Firebase Credentials

You have two options:

#### Option A: Use Existing Firebase Project (Recommended)

The project `study-d2678` still exists. You can use it if:
- The API key was regenerated after the security incident
- Or you're comfortable using the current key with restrictions

**To get credentials:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **Nous (study-d2678)**
3. Click gear icon → **Project settings**
4. Scroll down to **"Your apps"** section
5. Find your web app or create a new one
6. Copy all configuration values

#### Option B: Regenerate API Key (Most Secure)

If the exposed key was not yet regenerated:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project: **Nous (study-d2678)**
3. Navigate to: **APIs & Services** → **Credentials**
4. Find API key: `AIzaSyAk5qHtY3Y_988RBWprbKMiiRc63IECsbg`
5. Click **Edit** (pencil icon)
6. Click **Regenerate Key** button
7. **Copy the new key immediately**
8. **Add restrictions** (see Step 3 below)

---

### Step 2: Add Environment Variables to Netlify

1. **Go to Netlify Dashboard**
   - Visit: https://app.netlify.com/
   - Select your site: **nousi.netlify.app**

2. **Navigate to Environment Variables**
   - Click **Site settings**
   - Scroll to **Environment variables** in left sidebar
   - Click **Add a variable**

3. **Add These Variables** (one at a time):

   ```
   FIREBASE_API_KEY=AIzaSy... (your actual API key)
   FIREBASE_AUTH_DOMAIN=study-d2678.firebaseapp.com
   FIREBASE_PROJECT_ID=study-d2678
   FIREBASE_STORAGE_BUCKET=study-d2678.firebasestorage.app
   FIREBASE_MESSAGING_SENDER_ID=531881111589
   FIREBASE_APP_ID=1:531881111589:web:4f3acc170683d154210fcc
   FIREBASE_MEASUREMENT_ID=G-W95VY7VVSX
   ```

   **Important:**
   - Replace `FIREBASE_API_KEY` value with your actual (regenerated) API key
   - Other values should match your Firebase project
   - Make sure there are **no spaces** around the `=` sign
   - No quotes needed in Netlify UI

4. **Save Changes**
   - Netlify will show all 7 variables
   - They will be available to all deployments

---

### Step 3: Add API Key Restrictions (Security)

**Critical for security:** Restrict your Firebase API key to prevent abuse.

1. Go to [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)
2. Click on your API key
3. Under **Application restrictions:**
   - Select **HTTP referrers (websites)**
   - Add these referrers:
     ```
     https://nousi.netlify.app/*
     http://localhost:8081/*
     ```

4. Under **API restrictions:**
   - Select **Restrict key**
   - Enable only these APIs:
     - Cloud Firestore API
     - Firebase Authentication API
     - Firebase Storage API
     - Identity Toolkit API

5. **Save** changes

---

### Step 4: Trigger Netlify Redeploy

After adding environment variables:

1. Go to **Deploys** tab in Netlify
2. Click **Trigger deploy** → **Deploy site**
3. Wait for build to complete (~2-3 minutes)

**The build will:**
- Run `npm run build` (compiles Tailwind CSS)
- Run `./scripts/generate-config.sh` (creates config.js from env vars)
- Generate a valid `config.js` file with your Firebase credentials
- Deploy the site with working Firebase

---

### Step 5: Verify It Works

1. **Check Build Logs:**
   - In Netlify deploy details, check build log
   - Look for: `✓ Firebase environment variables found`
   - Should NOT see: `⚠️  WARNING: Firebase environment variables not configured!`

2. **Test Production Site:**
   - Visit: https://nousi.netlify.app
   - Open browser console (F12)
   - Should see: `✓ Firebase config loaded from environment variables`
   - Should NOT see: `⚠️  Firebase not configured`

3. **Test Login:**
   - Try logging in with existing account
   - Try "Continue as Guest"
   - Both should work without errors

4. **Check Firebase Console:**
   - Go to Firebase Console → Authentication
   - Check for new authentication events
   - Verify users can sign in successfully

---

## 📝 Local Development Setup

For local testing, you need a local `config.js` file:

### Option 1: Use Real Firebase Config (Recommended)

```bash
cat > config.js << 'EOF'
// Firebase Configuration - Local Development
// This file is gitignored - safe to store credentials locally

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
    console.log('✓ Firebase config loaded successfully');
}
EOF
```

### Option 2: Use Offline Mode (Testing Only)

```bash
cat > config.js << 'EOF'
// Firebase Configuration - OFFLINE MODE
if (typeof window !== 'undefined') {
    window.__firebase_config = null;
    window.__firebase_unavailable = true;
    console.warn('⚠️  Offline mode for testing');
}
EOF
```

Then test:
```bash
npm start
# Visit http://localhost:8081
```

---

## 🔒 Security Checklist

After setup, verify:

- [ ] API key is regenerated (if it was exposed)
- [ ] API key has HTTP referrer restrictions
- [ ] API key has API restrictions enabled
- [ ] Environment variables are set in Netlify
- [ ] Local `config.js` is gitignored (verify: `git status` should NOT show config.js)
- [ ] No credentials in public files or documentation
- [ ] Production site login works
- [ ] Firebase Authentication logs show valid activity only

---

## 🐛 Troubleshooting

### Build fails with "generate-config.sh: Permission denied"

```bash
chmod +x scripts/generate-config.sh
git add scripts/generate-config.sh
git commit -m "fix: Make generate-config.sh executable"
git push
```

### Build shows "WARNING: Firebase environment variables not configured"

- Verify all 7 environment variables are set in Netlify
- Variable names must match exactly (case-sensitive)
- No extra spaces in variable values
- After fixing, trigger new deploy

### "Invalid API key" errors in production

- Verify `FIREBASE_API_KEY` in Netlify matches your Firebase project
- Check API key restrictions in Google Cloud Console
- Make sure `https://nousi.netlify.app/*` is allowed

### Local testing fails

- Make sure `config.js` exists locally (not gitignored by mistake)
- Verify `config.js` has valid Firebase credentials
- Try offline mode to test without Firebase

---

## 📚 Related Documentation

- **Security Incident:** `SECURITY_INCIDENT_OCT30.md`
- **General Troubleshooting:** `.claude/CLAUDE.md`
- **Firebase Setup:** `docs/sop/DEPLOYMENT_GUIDE.md`

---

## 🎯 Quick Reference

**Netlify Dashboard:**
https://app.netlify.com/ → Select site → Site settings → Environment variables

**Firebase Console:**
https://console.firebase.google.com/ → study-d2678 → Project settings

**Google Cloud Console:**
https://console.cloud.google.com/ → study-d2678 → APIs & Services → Credentials

**Required Environment Variables:**
1. `FIREBASE_API_KEY`
2. `FIREBASE_AUTH_DOMAIN`
3. `FIREBASE_PROJECT_ID`
4. `FIREBASE_STORAGE_BUCKET`
5. `FIREBASE_MESSAGING_SENDER_ID`
6. `FIREBASE_APP_ID`
7. `FIREBASE_MEASUREMENT_ID`

---

**Last Updated:** October 31, 2025
**Status:** Awaiting Netlify configuration
