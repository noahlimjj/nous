# Nous App - Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: Blank Screen After Login

**Symptoms:**
- Login page loads fine
- After clicking "continue as guest" or logging in, the page goes blank
- Console shows: `Invalid document reference` errors
- React error: Component crashed

**Root Cause:**
Invalid Firestore document paths with odd number of segments.

**Solution:**
Firestore requires **even-numbered path segments** (collection/document/collection/document).

❌ **Wrong:** `/artifacts/study-tracker-app/users/{userId}/tree` (5 segments)
✅ **Correct:** `artifacts/study-tracker-app/users/{userId}` (4 segments)

**Fixed Files:**
- `index.html` (GrowthTree component, lines 1411, 1425, 1438)

**How to Fix:**
Store tree preferences directly in the user document using `treeName` and `treeType` fields instead of creating a separate `/tree` subcollection.

```javascript
// Before (WRONG - 5 segments)
const treeDoc = window.doc(db, `/artifacts/${appId}/users/${userId}/tree`);

// After (CORRECT - 4 segments)
const userDoc = window.doc(db, `artifacts/${appId}/users/${userId}`);
```

---

### Issue 2: Firebase Module Loading Race Condition

**Symptoms:**
- Blank screen on page load
- Console error: `TypeError: window.initializeApp is not a function`
- Firebase configuration appears correct

**Root Cause:**
Firebase SDK loads as ES6 module (`<script type="module">`) which is asynchronous, but the main app code runs synchronously and tries to use Firebase functions before they're available.

**Solution:**
Add state management to wait for Firebase SDK to be ready.

**Fixed Files:**
- `index.html` (lines 221-223, 2452, 2458-2467, 2530)

**Implementation:**

1. **Dispatch ready event from Firebase module:**
```javascript
<script type="module">
    // ... Firebase imports ...
    window.initializeApp = initializeApp;
    // ... other assignments ...

    // Signal that Firebase SDK is ready
    window.firebaseSDKReady = true;
    window.dispatchEvent(new Event('firebaseReady'));
</script>
```

2. **Wait for Firebase SDK in App component:**
```javascript
const [firebaseReady, setFirebaseReady] = useState(window.firebaseSDKReady || false);

// Listen for Firebase SDK ready event
useEffect(() => {
    if (window.firebaseSDKReady) {
        setFirebaseReady(true);
    } else {
        const handleFirebaseReady = () => setFirebaseReady(true);
        window.addEventListener('firebaseReady', handleFirebaseReady, { once: true });
        return () => window.removeEventListener('firebaseReady', handleFirebaseReady);
    }
}, []);

useEffect(() => {
    if (!firebaseReady) return; // Wait for Firebase SDK
    // ... Firebase initialization code ...
}, [firebaseReady, /* other deps */]);
```

---

### Issue 3: Babel Standalone Performance Warning

**Symptoms:**
- Browser console warning: "You are using the in-browser Babel transformer"
- Slow page load times
- Application works but performance is poor

**Root Cause:**
Unnecessary Babel standalone script transforming code client-side even though the app already uses `React.createElement()` patterns (no JSX).

**Solution:**
Remove Babel dependency.

**Fixed Files:**
- `index.html` (lines 167, 262)

**Changes:**
```html
<!-- REMOVE THIS LINE -->
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

<!-- CHANGE THIS -->
<script type="text/babel">

<!-- TO THIS -->
<script>
```

---

### Issue 4: Firebase Permission Denied Errors

**Symptoms:**
- Console error: `[code=permission-denied]: Missing or insufficient permissions`
- Friends page shows: "Failed to load friends"
- Leaderboard page shows: "Failed to load leaderboard"
- App works but can't access certain Firestore collections

**Root Cause:**
Firestore security rules haven't been configured to allow access to the new collections (`/users`, `/friendRequests`, `/friendships`).

**Solution:**
Update Firestore security rules in Firebase Console.

**Steps:**
1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project (study-d2678)
3. Go to Firestore Database → Rules
4. Update rules to:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Allow users to read any user profile (for friend discovery)
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create: if request.auth.uid == userId;
      allow update: if request.auth.uid == userId;
      allow delete: if request.auth.uid == userId;
    }

    // Friend requests
    match /friendRequests/{requestId} {
      allow create: if request.auth != null
        && request.resource.data.fromUserId == request.auth.uid;
      allow read: if request.auth.uid == resource.data.fromUserId
        || request.auth.uid == resource.data.toUserId;
      allow update: if request.auth.uid == resource.data.toUserId;
      allow delete: if request.auth.uid == resource.data.fromUserId
        || request.auth.uid == resource.data.toUserId;
    }

    // Friendships
    match /friendships/{friendshipId} {
      allow read: if request.auth.uid == resource.data.user1Id
        || request.auth.uid == resource.data.user2Id;
      allow create: if request.auth != null;
      allow delete: if request.auth.uid == resource.data.user1Id
        || request.auth.uid == resource.data.user2Id;
    }

    // Existing rules for artifacts
    match /artifacts/{appId}/users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

5. Click "Publish"

**Security Notes:**
- Users can only read their own data and their friends' public profiles
- Friend requests can only be updated by the recipient
- Friendships can only be deleted by either user in the friendship

---

### Issue 5: Local Development - Config File Not Set

**Symptoms:**
- Local server shows: "Configuration Error"
- Message: "Firebase configuration is missing required values"
- Netlify deployment works fine

**Root Cause:**
Local `config.js` file is set to `null` or has placeholder values.

**Solution:**
Update local `config.js` with actual Firebase credentials.

**File:** `config.js` (gitignored)

```javascript
window.__firebase_config = {
    apiKey: "YOUR_FIREBASE_API_KEY_HERE",
    authDomain: "study-d2678.firebaseapp.com",
    projectId: "study-d2678",
    storageBucket: "study-d2678.firebasestorage.app",
    messagingSenderId: "531881111589",
    appId: "1:531881111589:web:4f3acc170683d154210fcc",
    measurementId: "G-W95VY7VVSX"
};

window.__app_id = "study-tracker-app";
```

**Important:**
- `config.js` is gitignored for security
- Use `config.template.js` as reference
- Never commit `config.js` to version control

---

### Issue 6: Browser Cache Showing Old Version

**Symptoms:**
- Deployment successful but browser shows old version
- New features don't appear after refresh
- Console shows old errors that were fixed

**Solution:**
Hard refresh the browser to clear cache.

**Mac:**
- `Cmd + Shift + R` (hard refresh)
- `Cmd + Option + E` (clear cache) then reload

**Windows/Linux:**
- `Ctrl + F5` (hard refresh)
- `Ctrl + Shift + R` (hard refresh)

**Alternative:**
1. Open browser DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

---

## Testing Checklist

After making configuration changes, test these scenarios:

### Basic Functionality
- [ ] Login page loads
- [ ] Guest login works
- [ ] Email login works (if applicable)
- [ ] Dashboard displays after login
- [ ] Timer component works
- [ ] Habits can be created/deleted
- [ ] Sessions are recorded

### Social Features
- [ ] Friends button appears in navigation
- [ ] Leaderboard button appears in navigation
- [ ] Friends page loads without errors
- [ ] Friend code is displayed
- [ ] Can search for users
- [ ] Leaderboard page loads without errors
- [ ] Metric selector buttons work

### Error Checking
- [ ] No console errors about invalid document references
- [ ] No "window.X is not a function" errors
- [ ] No Babel warnings in production
- [ ] Firebase permissions allow necessary operations

---

## Debugging Tools

### Browser Console Inspection
```javascript
// Check if Firebase is loaded
console.log(typeof window.initializeApp); // Should be "function"

// Check config
console.log(window.__firebase_config); // Should show your Firebase config

// Check Firebase SDK ready state
console.log(window.firebaseSDKReady); // Should be true
```

### Network Tab Inspection
1. Open DevTools → Network tab
2. Reload page
3. Check for failed requests (red items)
4. Common issues:
   - `config.js` 404: Missing configuration file
   - Firebase SDK 403: CORS or auth issues
   - Long load times: Cache or CDN issues

### Firestore Data Inspection
1. Firebase Console → Firestore Database
2. Check collections exist:
   - `users/{userId}` - User profiles
   - `friendRequests/{requestId}` - Pending requests
   - `friendships/{friendshipId}` - Accepted friendships
   - `artifacts/study-tracker-app/users/{userId}` - User data

---

## Deployment Checklist

Before deploying to Netlify:

1. **Test locally first**
   ```bash
   npm start
   # Visit http://localhost:8080
   ```

2. **Check for console errors**
   - Open DevTools
   - Perform all major actions
   - Ensure no red errors

3. **Verify Firebase paths**
   - All document references have even segments
   - No `/tree` or other odd-segment subcollections

4. **Update Firestore rules** (if needed)
   - Check Firebase Console
   - Publish new rules before deploying

5. **Commit and push**
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```

6. **Monitor Netlify deployment**
   - Check build logs for errors
   - Wait for "Published" status

7. **Test deployed site**
   - Hard refresh browser
   - Test all features
   - Check console for errors

---

## Emergency Rollback

If a deployment breaks production:

```bash
# Find last working commit
git log --oneline

# Revert to that commit
git reset --hard <commit-hash>

# Force push (CAUTION)
git push --force
```

**Note:** Netlify will auto-deploy the reverted version.

---

## Contact & Resources

- **Firebase Console:** https://console.firebase.google.com/project/study-d2678
- **Netlify Dashboard:** https://app.netlify.com/ (check your sites)
- **GitHub Repo:** https://github.com/noahlimjj/nous

---

**Last Updated:** 2025-10-09
**Document Version:** 1.0
