# Claude Code Context & Error Documentation

**Last Updated:** October 30, 2025

This file documents common errors, solutions, and important context for working on this project.

## 🚨 Common Errors & Solutions

### 1. Firebase Configuration Missing

**Error:**
```
Firebase configuration is missing required values. Please check your environment variables.
```

**Cause:** The `config.js` file is missing or not properly configured.

**Solution:**
```bash
# Create config.js for local development
cat > config.js << 'EOF'
if (typeof window !== 'undefined') {
    window.__firebase_config = {
        apiKey: "local-dev-api-key",
        authDomain: "local-dev.firebaseapp.com",
        projectId: "local-dev-project",
        storageBucket: "local-dev.appspot.com",
        messagingSenderId: "123456789",
        appId: "1:123456789:web:abcdef123456",
        measurementId: "G-XXXXXXXXXX"
    };
}
EOF
```

**Note:** Use "Continue as Guest" mode for testing without real Firebase.

**Reference:** See `docs/FIREBASE_CONFIG_TROUBLESHOOTING.md`

---

### 2. Invalid API Key Error

**Error:**
```
FirebaseError: Firebase: Error (auth/api-key-not-valid.-please-pass-a-valid-api-key.)
```

**Cause:** The placeholder API key in `config.js` is being used for actual Firebase auth.

**Solution:**
- **Option A (Recommended):** Use **"Continue as Guest"** mode instead of Firebase auth
- **Option B:** Replace placeholder values in `config.js` with real Firebase credentials (not recommended for local dev)

**Note:** Guest mode works for all local testing and doesn't require Firebase connection.

---

### 3. Reports Showing Wrong Timezone (UTC instead of Singapore Time)

**Error:** Time of day analysis shows times in UTC (e.g., 08:00) instead of Singapore time (SGT, UTC+8)

**Cause:** Using `.getHours()` which returns local machine time, not Singapore time

**Solution:** Convert to Singapore timezone explicitly

**Fixed in:** `index.js` line 3233-3236
```javascript
// Convert to Singapore time (UTC+8)
const date = new Date(session.startTime.toMillis());
const singaporeHour = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Singapore' })).getHours();
```

---

### 4. Port 8081 Already in Use

**Error:**
```
OSError: [Errno 48] Address already in use
```

**Solution:**
```bash
# Kill process using port 8081
lsof -ti:8081 | xargs kill -9

# Restart server
npm start
```

---

### 5. Tree Designs Look Too Similar

**Issue:** All trees look nearly identical despite different tree types

**Cause:**
1. Branch colors all use same `mainBranchColor` (lines 4022-4028)
2. All trees use identical branch paths
3. All leaf positions are the same

**Solution:** (To be implemented)
1. Create depth variations for branch colors
2. Generate unique branch structures per tree type
3. Vary leaf positions by tree type

---

## 📝 Important Project Context

### Testing Workflow
1. Always create `config.js` for local development (see error #1)
2. Use **"Continue as Guest"** mode for quick testing
3. Test on `http://localhost:8081`
4. See full testing guide in `docs/FIREBASE_CONFIG_TROUBLESHOOTING.md`

### Timezone Handling
- **User Location:** Singapore (UTC+8)
- **All times must display in Singapore timezone**
- **Use:** `toLocaleString('en-US', { timeZone: 'Asia/Singapore' })`

### Key Files
- `index.html` - Main SPA entry point
- `index.js` - Main application logic (React components inline)
- `config.js` - Local Firebase config (gitignored)
- `config.template.js` - Template for config.js
- `docs/FIREBASE_CONFIG_TROUBLESHOOTING.md` - Full troubleshooting guide

### Recent Changes
- **Oct 30, 2025:** Added Daily Hours to leaderboard (index.js:6722)
- **Oct 30, 2025:** Fixed timezone in reports to show Singapore time (index.js:3233-3236)
- **Oct 30, 2025:** Created Firebase config troubleshooting doc

---

## 🔧 Quick Reference Commands

```bash
# Start local server
npm start

# Kill port 8081
lsof -ti:8081 | xargs kill -9

# Create config.js
cp config.template.js config.js

# Test in browser
open http://localhost:8081
```

---

## 📚 Related Documentation

- **Firebase Config Issues:** `docs/FIREBASE_CONFIG_TROUBLESHOOTING.md`
- **Deployment:** `docs/sop/DEPLOYMENT_GUIDE.md`
- **Security:** `SECURITY.md`
- **Architecture:** `docs/development/ARCHITECTURE.md`
- **Tree Design:** `docs/sop/TREE_DESIGN_IMPROVEMENTS.md`

---

## 💡 Best Practices

1. **Always test locally before pushing** using `npm start`
2. **Use guest mode** for quick feature testing
3. **Document all errors** in this file when encountered
4. **Check Singapore timezone** for any time-related features
5. **Never commit** `config.js` (it's gitignored)

---

**Note:** This file should be read by Claude Code at the start of each session to maintain context about common issues and solutions.
