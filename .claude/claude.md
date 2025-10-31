# Claude Code Context & Error Documentation

**Last Updated:** October 31, 2025

This file provides quick context for Claude Code when working on this project.

---

## 📖 Quick Links

- **Common Errors:** [docs/errors/COMMON_ERRORS.md](../docs/errors/COMMON_ERRORS.md)
- **Firebase Errors:** [docs/errors/FIREBASE_ERRORS.md](../docs/errors/FIREBASE_ERRORS.md)
- **Error Index:** [docs/errors/README.md](../docs/errors/README.md)
- **Netlify Setup:** [NETLIFY_FIREBASE_SETUP.md](../NETLIFY_FIREBASE_SETUP.md)

---

## 🚨 Current Critical Issues

### CRITICAL: Users Can't Login to Production (Oct 31, 2025)

**Status:** FIXED (code), AWAITING NETLIFY CONFIGURATION

**What's Wrong:**
- Firebase environment variables not set in Netlify
- Production builds get invalid/placeholder Firebase config
- Users see "Configuration Error" and cannot login

**What Was Fixed:**
- ✅ `scripts/generate-config.sh` - Better offline mode fallback
- ✅ `index.js` - Added Firebase availability detection + offline mode
- ✅ Created comprehensive setup guide: `NETLIFY_FIREBASE_SETUP.md`

**What You Need to Do:**
1. Set 7 Firebase environment variables in Netlify dashboard
2. Trigger redeploy
3. Verify production login works

**Full Guide:** [NETLIFY_FIREBASE_SETUP.md](../NETLIFY_FIREBASE_SETUP.md)

---

## 🚨 Most Common Errors (Quick Reference)

### 1. Firebase Configuration Errors

**Quick Fixes:**
- **Local dev:** Create `config.js` with offline mode or real Firebase credentials
- **Production:** Set Netlify environment variables

**Full Guide:** [docs/errors/FIREBASE_ERRORS.md](../docs/errors/FIREBASE_ERRORS.md)

---

### 2. Port 8081 Already in Use

**Solution:**
```bash
lsof -ti:8081 | xargs kill -9
npm start
```

---

### 3. Timezone Shows Wrong Hours

**Status:** FIXED ✅

**Fix Location:** `index.js:3233-3236`
```javascript
const singaporeHour = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Singapore' })).getHours();
```

---

### 4. Dark Mode Not Working

**Status:** FIXED ✅ (Oct 30, 2025)

**What was wrong:** Toggle logic was inverted (`!isNightMode`)

**Fix Location:** `index.js:3843`

---

### 5. Tree Designs Look Too Similar

**Status:** DOCUMENTED, not yet implemented

**Fix Plan:** [docs/sop/TREE_DESIGN_IMPROVEMENTS.md](../docs/sop/TREE_DESIGN_IMPROVEMENTS.md)

---

## 📝 Important Project Context

### Testing Workflow
1. **Create `config.js`** for local development
   - Option A: Offline mode (no Firebase needed)
   - Option B: Real Firebase credentials
2. **Start server:** `npm start` → http://localhost:8081
3. **Test offline mode:** App works without Firebase (local storage only)
4. **Test with Firebase:** Use real config for auth/sync features

### Timezone Handling
- **User Location:** Singapore (UTC+8)
- **ALL times must display in Singapore timezone**
- **Always use:** `toLocaleString('en-US', { timeZone: 'Asia/Singapore' })`

### Key Files
- `index.html` - Main SPA entry point
- `index.js` - Main application logic (React components inline)
- `config.js` - Local Firebase config (gitignored, created by you)
- `config.template.js` - Template for config.js
- `scripts/generate-config.sh` - Generates config.js from env vars (used by Netlify)

### Recent Changes
- **Oct 31, 2025:** Fixed production login issue - added offline mode support
- **Oct 31, 2025:** Created comprehensive error documentation in `docs/errors/`
- **Oct 31, 2025:** Created Netlify setup guide: `NETLIFY_FIREBASE_SETUP.md`
- **Oct 30, 2025:** Added Daily Hours to leaderboard (index.js:6722)
- **Oct 30, 2025:** Fixed timezone in reports to show Singapore time (index.js:3233-3236)
- **Oct 30, 2025:** Fixed dark mode toggle logic (index.js:3843)

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

## 📚 Documentation Index

### Error Documentation (START HERE for bugs)
- **Common Errors:** `docs/errors/COMMON_ERRORS.md` - Quick fixes for frequent issues
- **Firebase Errors:** `docs/errors/FIREBASE_ERRORS.md` - Complete Firebase troubleshooting
- **Error Index:** `docs/errors/README.md` - Full error documentation index
- **Security Incidents:** `docs/errors/incidents/` - Historical incident reports

### Setup & Deployment
- **Netlify Setup:** `NETLIFY_FIREBASE_SETUP.md` - Configure Firebase for production
- **Deployment Guide:** `docs/sop/DEPLOYMENT_GUIDE.md` - General deployment procedures
- **Firebase Config Troubleshooting:** `docs/FIREBASE_CONFIG_TROUBLESHOOTING.md` - Detailed Firebase guide

### Development
- **Architecture:** `docs/development/ARCHITECTURE.md` - App structure and design
- **Database Schema:** `docs/development/DATABASE.md` - Firestore collections
- **Git Workflow:** `docs/development/GIT_WORKFLOW.md` - Branching and commits
- **Quick Reference:** `docs/development/QUICK_REFERENCE.md` - Command cheatsheet

### Features
- **Tree Design:** `docs/sop/TREE_DESIGN_IMPROVEMENTS.md` - Tree rendering improvements
- **PWA Guide:** `docs/pwa/PWA_GUIDE.md` - Progressive Web App features
- **Friends Feature:** `docs/sop/Friends.md` - Social features documentation

---

## 💡 Best Practices

1. **Always test locally before pushing** using `npm start`
2. **Use guest mode** for quick feature testing
3. **Document all errors** in this file when encountered
4. **Check Singapore timezone** for any time-related features
5. **Never commit** `config.js` (it's gitignored)

---

**Note:** This file should be read by Claude Code at the start of each session to maintain context about common issues and solutions.
