# Security Policy

## Firebase Configuration Security

### Local Development
- **Never commit `config.js`** - This file contains your Firebase credentials and is gitignored
- Use `config.template.js` as a reference for setting up your local config
- Keep your Firebase credentials secure and don't share them publicly

### Production Deployment (Netlify)
Set these environment variables in your Netlify dashboard:

```
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
```

The `generate-config.sh` script will automatically generate `config.js` during build.

## Firestore Security Rules

**CRITICAL**: Set up proper Firestore security rules to protect user data.

### Recommended Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /artifacts/{appId}/users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Setting Up Security Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Firestore Database** > **Rules**
4. Paste the rules above
5. Click **Publish**

## Authentication Security

### Email/Password Authentication
- Enforce strong passwords (6+ characters minimum)
- Consider enabling email verification
- Implement password reset functionality

### Anonymous Authentication
- Anonymous users have temporary data
- Warn users that guest data is not persistent
- Provide option to upgrade to authenticated account

## API Key Security

**Important Note**: Firebase API keys are safe to include in client-side code because:
- They identify your Firebase project, not authenticate API requests
- Security is enforced through Firestore Security Rules and Authentication
- They're designed to be public (similar to OAuth client IDs)

However, you should still:
- Restrict API key usage in Firebase Console
- Set up application restrictions (HTTP referrers)
- Monitor usage for anomalies

### Restricting Your API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** > **Credentials**
3. Click on your Firebase API key
4. Under **Application restrictions**, select **HTTP referrers**
5. Add your domains:
   ```
   https://your-domain.netlify.app/*
   http://localhost:8080/*
   ```

## Data Privacy

### User Data Storage
- All user data is stored in Firestore under the user's UID
- Data includes: habits, sessions, and timestamps
- No personally identifiable information beyond email (if provided)

### Data Access
- Users can only access their own data
- No cross-user data sharing
- Admin access requires Firebase Admin SDK (not exposed to client)

## Reporting Security Issues

If you discover a security vulnerability:
1. **Do NOT open a public issue**
2. Email the maintainer directly
3. Provide detailed information about the vulnerability
4. Allow time for the issue to be addressed before public disclosure

## Security Checklist for Deployment

- [ ] Firebase Security Rules are set up
- [ ] Email/Password authentication is enabled
- [ ] Anonymous authentication is enabled (if desired)
- [ ] API key restrictions are configured
- [ ] Environment variables are set in Netlify
- [ ] `config.js` is not committed to git
- [ ] HTTPS is enabled (automatic with Netlify)
- [ ] Content Security Policy headers are configured

## Additional Recommendations

### Enable Firebase App Check
Protect your backend resources from abuse:
1. Go to Firebase Console > App Check
2. Enable App Check for your web app
3. Use reCAPTCHA v3 as the provider

### Monitor Usage
- Set up Firebase usage alerts
- Monitor authentication attempts
- Review Firestore access logs regularly

### Regular Updates
- Keep Firebase SDK up to date
- Review and update security rules periodically
- Audit user access patterns

---

**Last Updated**: 2025-10-07
