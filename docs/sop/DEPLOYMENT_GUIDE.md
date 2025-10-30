# Deployment Guide

This guide walks you through deploying your Nous app securely.

## Pre-Deployment Checklist

### 1. Verify Local Setup
```bash
# Make sure config.js exists locally
ls -la config.js

# Should show config.js is gitignored
git status --ignored | grep config.js

# Test locally
npm start
# Visit http://localhost:8080
```

### 2. Configure Firebase Security

#### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artifacts/{appId}/users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Apply in Firebase Console:
1. Firestore Database → Rules
2. Paste the rules above
3. Click "Publish"

#### Enable Authentication Methods
1. Authentication → Sign-in method
2. Enable "Email/Password"
3. Enable "Anonymous" (optional)

## Deploying to Netlify

### Option 1: Via Netlify UI (Recommended)

#### Step 1: Prepare Repository
```bash
# Stage changes (config.js will be ignored automatically)
git add .
git commit -m "Secure Firebase config and prepare for deployment"
git push
```

#### Step 2: Connect to Netlify
1. Go to [Netlify](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Connect to your Git provider (GitHub/GitLab/Bitbucket)
4. Select your repository

#### Step 3: Configure Build Settings
- **Build command**: `./generate-config.sh`
- **Publish directory**: `.`
- **Node version**: 18 (set in netlify.toml)

#### Step 4: Set Environment Variables
In Netlify dashboard → Site settings → Environment variables, add:

```bash
FIREBASE_API_KEY=your_firebase_api_key_here
FIREBASE_AUTH_DOMAIN=study-d2678.firebaseapp.com
FIREBASE_PROJECT_ID=study-d2678
FIREBASE_STORAGE_BUCKET=study-d2678.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=531881111589
FIREBASE_APP_ID=1:531881111589:web:4f3acc170683d154210fcc
FIREBASE_MEASUREMENT_ID=G-W95VY7VVSX
```

#### Step 5: Deploy
1. Click "Deploy site"
2. Wait for build to complete
3. Your site will be live at `https://your-site.netlify.app`

### Option 2: Via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize (one time)
netlify init

# Set environment variables
netlify env:set FIREBASE_API_KEY "your_api_key"
netlify env:set FIREBASE_AUTH_DOMAIN "your_auth_domain"
netlify env:set FIREBASE_PROJECT_ID "your_project_id"
netlify env:set FIREBASE_STORAGE_BUCKET "your_storage_bucket"
netlify env:set FIREBASE_MESSAGING_SENDER_ID "your_sender_id"
netlify env:set FIREBASE_APP_ID "your_app_id"
netlify env:set FIREBASE_MEASUREMENT_ID "your_measurement_id"

# Deploy
netlify deploy --prod
```

## Post-Deployment Steps

### 1. Test Deployment
Visit your Netlify URL and verify:
- [ ] Page loads without errors
- [ ] Can sign up / log in
- [ ] Can create a habit
- [ ] Timer works correctly
- [ ] Sessions are saved
- [ ] Reports page displays data

### 2. Configure API Key Restrictions

#### Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Navigate to **APIs & Services** → **Credentials**
4. Click on your Firebase API key (Browser key)
5. Under **Application restrictions**:
   - Select "HTTP referrers (web sites)"
   - Add your domains:
     ```
     https://your-site.netlify.app/*
     https://*.netlify.app/*  (for preview branches)
     http://localhost:8080/*  (for local dev)
     ```

### 3. Set Up Custom Domain (Optional)
1. In Netlify: Domain settings → Add custom domain
2. Follow DNS configuration instructions
3. Enable HTTPS (automatic with Netlify)

### 4. Enable Firebase App Check (Recommended)
1. Firebase Console → App Check
2. Click "Get started"
3. Register your web app
4. Choose reCAPTCHA v3 as provider
5. Add your Netlify domain

## Troubleshooting

### Build Fails: "config.js not generated"
**Solution**: Verify environment variables are set in Netlify dashboard

### "Firebase config not found" in browser
**Solution**: Check browser console. Verify config.js is generated during build.

```bash
# Test build script locally
./generate-config.sh
cat config.js  # Should show your config
```

### "Permission denied" errors in app
**Solution**: Check Firestore Security Rules are published

### CORS errors
**Solution**: Verify your domain is added to Firebase Authorized Domains:
1. Firebase Console → Authentication → Settings
2. Authorized domains → Add domain

## Updating Credentials

If you need to change Firebase credentials:

### For Local Development
```bash
# Edit config.js directly
vim config.js
```

### For Production (Netlify)
1. Netlify dashboard → Site settings → Environment variables
2. Update the relevant variables
3. Trigger a new deploy: Deploys → Trigger deploy → Deploy site

## Rollback Procedure

If deployment fails:

```bash
# Via Netlify UI
# Deploys → Find working deploy → Publish deploy

# Via CLI
netlify rollback
```

## Monitoring

### Check Deployment Logs
- Netlify dashboard → Deploys → Select deploy → Deploy log

### Monitor Firebase Usage
- Firebase Console → Usage and billing
- Set up budget alerts

### Set Up Error Tracking (Optional)
Consider integrating:
- Sentry for error tracking
- Google Analytics for usage tracking
- Firebase Performance Monitoring

## Security Best Practices

✅ **Do:**
- Keep environment variables in Netlify dashboard only
- Regularly rotate credentials if compromised
- Monitor authentication logs
- Keep Firebase SDK updated
- Use HTTPS only (automatic with Netlify)

❌ **Don't:**
- Commit config.js to git
- Share environment variables publicly
- Use production credentials in development
- Disable security rules
- Ignore Firebase security warnings

## Need Help?

- **Netlify Documentation**: https://docs.netlify.com/
- **Firebase Documentation**: https://firebase.google.com/docs
- **Check logs**: Netlify deploy logs + Browser console
- **Community**: Netlify Community Forums / Firebase Discord

---

**Last Updated**: 2025-10-07
