# Firebase Configuration Troubleshooting

**Last Updated:** October 30, 2025

## Problem
The app shows this error when running locally:
```
Firebase configuration is missing required values. Please check your environment variables.
```

## Root Cause
The `config.js` file is missing or not properly configured. This file is required for Firebase authentication and database access.

## Solution

### For Local Development (Testing Only)

1. **Create config.js from template:**
```bash
cp config.template.js config.js
```

2. **Edit config.js** with placeholder values for local testing:
```javascript
// config.js
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
    console.log('Firebase config loaded for local development');
}
```

3. **Restart your local server:**
```bash
npm start
```

4. **Use "Continue as Guest"** mode for testing without real Firebase connection

### For Production Deployment

The production environment uses environment variables automatically. No manual config.js needed.

## Files Involved

- `config.js` - Local Firebase config (gitignored, not committed)
- `config.template.js` - Template file (committed to repo)
- `index.html` - Loads config.js on line 39
- `index.js` - Validates Firebase config on lines 5-7 and 6875-6879

## Important Notes

⚠️ **config.js is gitignored** - This is intentional for security. Never commit real Firebase credentials.

✅ **Guest mode works without Firebase** - You can test most features using "Continue as Guest"

🔒 **Production uses environment variables** - Netlify automatically generates config.js during build

## Quick Fix Command

If you get this error, just run:
```bash
# Create config.js if it doesn't exist
if [ ! -f config.js ]; then
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
    echo "config.js created for local development"
fi
```

## Verification

After creating config.js, you should see in the browser console:
```
Firebase config loaded for local development
```

Instead of:
```
Firebase configuration is missing...
```

## How to Test the Site Locally

### 1. Start the Development Server

```bash
npm start
```

This starts a local server on `http://localhost:8081`

### 2. Open in Browser

The server should automatically open the site, or manually navigate to:
```
http://localhost:8081
```

### 3. Testing Workflow

**Option A: Guest Mode (Recommended for Quick Testing)**
1. Click "Continue as Guest"
2. Enter any username
3. You can test all features without Firebase

**Option B: With Firebase (For Full Testing)**
1. Ensure config.js has valid Firebase credentials
2. Click "Sign in with Google" or "Continue as Guest"
3. Test authentication and data persistence

### 4. Testing Specific Features

**Test the Leaderboard:**
1. Go to Leaderboard tab
2. Test Daily, Weekly, Monthly, Total Hours buttons
3. Add friends to see leaderboard rankings

**Test the Tree Growth:**
1. Go to Dashboard
2. Use "Continue as Guest" with a random username
3. Manually add hours (e.g., 100 hours) in the profile or debug panel
4. Watch the tree grow
5. Try changing tree types to see different tree designs

**Test Reports:**
1. Add some study sessions
2. Go to Reports tab
3. Check "time of day analysis"
4. Verify times are in Singapore timezone (SGT, UTC+8)

**Test Habits:**
1. Go to Habits tab
2. Add/edit/remove habits
3. Check streak tracking

### 5. Common Test Scenarios

```bash
# Kill any processes using port 8081
lsof -ti:8081 | xargs kill -9

# Restart server
npm start

# Open in default browser
open http://localhost:8081
```

### 6. Browser Developer Tools

Press `F12` or `Cmd+Option+I` (Mac) to open DevTools:
- **Console**: Check for errors
- **Network**: Verify API calls
- **Application**: Check localStorage/indexedDB
- **Performance**: Monitor loading times

### 7. Testing Checklist

- [ ] Config.js exists and loads without errors
- [ ] Can continue as guest
- [ ] Dashboard displays correctly
- [ ] Can start/stop study sessions
- [ ] Tree grows with added hours
- [ ] Different tree types look distinct
- [ ] Leaderboard shows Daily/Weekly/Monthly/Total
- [ ] Reports show correct Singapore time
- [ ] Habits tracking works
- [ ] Friends can be added/removed
- [ ] Profile updates save

## Related Documentation

- See `SECURITY.md` for information about credential management
- See `DEPLOYMENT_GUIDE.md` for production deployment
- See `.gitignore` line for `config.js` exclusion
