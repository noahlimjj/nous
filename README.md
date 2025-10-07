# Nous - Study Tracker App

A modern, single-page web application for tracking study habits and time management. Built with React, Firebase, and Tailwind CSS.

## Features

- ⏱️ **Real-time Timer**: Track time with millisecond precision
- 📊 **Habit Management**: Create and track multiple habits
- 📈 **Monthly Reports**: Visualize your progress with charts
- 🔐 **User Authentication**: Secure login or guest mode
- 💾 **Cloud Sync**: Data stored in Firebase for cross-device access
- ➕ **Manual Entry**: Backdate sessions when needed

## Prerequisites

- Python 3 (for local development server)
- Firebase account with a project set up
- Modern web browser

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Study_tracker_app
```

### 2. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable **Firestore Database** and **Authentication**
4. In Authentication, enable:
   - Email/Password provider
   - Anonymous authentication
5. Get your Firebase config from Project Settings

### 3. Create Configuration File

```bash
cp config.template.js config.js
```

Edit `config.js` and replace the placeholder values with your actual Firebase credentials:

```javascript
window.__firebase_config = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.firebasestorage.app",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};
```

⚠️ **Important**: Never commit `config.js` to version control! It's already in `.gitignore`.

### 4. Run Locally

```bash
npm start
# or
python3 -m http.server 8080
```

Then open http://localhost:8080 in your browser.

## Deployment

### Deploy to Netlify

1. Push your code to GitHub (make sure config.js is not included)
2. Connect your repository to Netlify
3. In Netlify's build settings:
   - Build command: `echo 'Static site - no build required'`
   - Publish directory: `.`
4. Add a `netlify/functions/config.js` file or use Netlify's snippet injection to inject your Firebase config
5. Deploy!

**For Production**: You'll need to inject the Firebase config at build time or use Netlify's environment variables with a build script.

### Environment Variables for Netlify

Create a build script that generates config.js from environment variables:

```bash
# In Netlify, set these environment variables:
FIREBASE_API_KEY
FIREBASE_AUTH_DOMAIN
FIREBASE_PROJECT_ID
FIREBASE_STORAGE_BUCKET
FIREBASE_MESSAGING_SENDER_ID
FIREBASE_APP_ID
FIREBASE_MEASUREMENT_ID
```

Then update `netlify.toml` with a build command to generate config.js.

## Security Notes

🔒 **Firebase Security**:
- Your API key is safe to be public (it identifies your project, not authenticates requests)
- Security is enforced through Firestore Security Rules
- Set up proper security rules in Firebase Console:

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

## Project Structure

```
Study_tracker_app/
├── index.html          # Main application file
├── config.js           # Firebase configuration (gitignored)
├── config.template.js  # Template for Firebase config
├── package.json        # Project metadata
├── netlify.toml        # Netlify configuration
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## Usage

### Creating Habits

1. Log in or continue as guest
2. Enter a habit name (e.g., "Study Math", "Coding", "Reading")
3. Click "Add Habit"

### Tracking Time

1. Click the **Play** button to start tracking
2. Click **Pause** to pause the timer
3. Click **Stop** to save the session
4. Use the **+** button to manually add a session

### Viewing Reports

1. Click the chart icon in the header
2. Select a month to view
3. See total time per habit and individual sessions

## Troubleshooting

### "Firebase config not found"
- Make sure you've created `config.js` from the template
- Verify the file is in the root directory

### "Permission denied" errors
- Check your Firestore Security Rules
- Make sure you're authenticated
- Verify the user ID matches in the rules

### Timer not updating
- Check browser console for errors
- Ensure JavaScript is enabled
- Try refreshing the page

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions:
- Open an issue on GitHub
- Check Firebase Console for backend errors
- Review browser console for frontend errors

---

Built with ❤️ using React, Firebase, and Tailwind CSS
