# 🚨 QUICK FIX - Blank Screen Issue

## Which scenario are you in?

### Scenario A: LOCAL (http://localhost:8080)

If blank on local:

**Step 1**: Open these test pages in your browser:
```
http://localhost:8080/react-test-createRoot.html
```

**If the test page shows ✅ createRoot WORKS:**
- React is fine, the issue is in index.html

**If the test page shows ❌ Error:**
- Copy the error message and send it to me

---

### Scenario B: DEPLOYED (Netlify - https://your-site.netlify.app)

If blank on Netlify:

**The Issue**: config.js is missing because environment variables aren't set!

**The Fix**:
1. Go to: https://app.netlify.com/
2. Select your site
3. Go to: **Site settings** → **Environment variables**
4. Add these 7 variables:

```
FIREBASE_API_KEY=AIzaSyAk5qHtY3Y_988RBWprbKMiiRc63IECsbg
FIREBASE_AUTH_DOMAIN=study-d2678.firebaseapp.com
FIREBASE_PROJECT_ID=study-d2678
FIREBASE_STORAGE_BUCKET=study-d2678.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=531881111589
FIREBASE_APP_ID=1:531881111589:web:4f3acc170683d154210fcc
FIREBASE_MEASUREMENT_ID=G-W95VY7VVSX
```

5. Click **Save**
6. Go to **Deploys** → **Trigger deploy** → **Deploy site**
7. Wait for deploy to finish
8. Refresh your site

---

## Quick Diagnostic

Open your browser console (F12) and paste this:

```javascript
console.log('Config:', window.__firebase_config);
console.log('React:', typeof React);
console.log('ReactDOM:', typeof ReactDOM);
```

Send me the output!

