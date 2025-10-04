# Nous

A modern, single-page Nous web application that allows users to monitor the time they spend on various habits like studying, training, or any custom activity.

## Features

### 🔐 User Authentication
- **Firebase Authentication** with email/password signup and login
- **Anonymous Guest Mode** for trying the app without creating an account
- **Persistent Data** - all data is saved and synced across devices

### 📊 Habit Management
- Create, edit, and delete custom habits (e.g., "React Practice," "Morning Run," "Meditation")
- User-specific habit lists (each user only sees their own habits)
- Intuitive habit creation with instant feedback

### ⏱️ Time Tracking
- **Real-time Timer** with start, pause, and stop functionality
- **Manual Entry** for past sessions with date and duration selection
- **Session History** displaying all completed sessions with timestamps

### 📈 Data Persistence & Reporting
- **Firebase Firestore** database for secure, cloud-based data storage
- **Monthly Reports** with visual bar charts showing total time per habit
- **Session Logs** with detailed breakdown of all recorded sessions

### 📱 Responsive Design
- **Mobile-First** design that works seamlessly on phones, tablets, and desktops
- **Tailwind CSS** for modern, utility-first styling
- **Clean UI/UX** with intuitive navigation and smooth interactions

## Technology Stack

- **Frontend**: React.js with functional components and hooks
- **Backend**: Firebase (Authentication + Firestore)
- **Styling**: Tailwind CSS
- **Deployment**: Netlify (single-page application)

## Setup Instructions

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable "Email/Password" and "Anonymous" providers
4. Enable Firestore Database:
   - Go to Firestore Database
   - Create database in production mode
   - Set up security rules (see below)

### 2. Firebase Security Rules

Add these rules to your Firestore Database:

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

### 3. Configuration

1. Get your Firebase configuration from Project Settings > General
2. Replace the placeholder configuration in `index.html`:

```javascript
window.__firebase_config = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 4. Local Development

1. Clone or download this repository
2. Start a local server:
   ```bash
   python3 -m http.server 8000
   # or
   npx serve .
   ```
3. Open `http://localhost:8000` in your browser

### 5. Deploy to Netlify

#### Option A: Drag & Drop
1. Zip the entire project folder
2. Go to [Netlify](https://netlify.com)
3. Drag and drop the zip file to deploy

#### Option B: Git Integration
1. Push your code to GitHub/GitLab/Bitbucket
2. Connect your repository to Netlify
3. Set build command: `echo 'Static site'`
4. Set publish directory: `.`
5. Deploy!

## Usage

1. **First Time**: Sign up with email/password or continue as guest
2. **Create Habits**: Add your study activities or habits
3. **Track Time**: Use the timer or manually enter past sessions
4. **View Progress**: Check your dashboard for recent activity
5. **Monthly Reports**: Review your monthly progress with visual charts

## File Structure

```
nous/
├── index.html          # Main HTML file with Firebase setup
├── hi                  # React application code
├── package.json        # Project configuration
├── netlify.toml        # Netlify deployment configuration
└── README.md          # This file
```

## Features in Detail

### Dashboard
- **Habit List**: View all your habits with individual timers
- **Timer Controls**: Start, pause, stop, and add manual entries
- **Recent Sessions**: Quick view of your latest activity
- **Real-time Updates**: All data syncs instantly across devices

### Monthly Reports
- **Visual Charts**: Bar charts showing time distribution
- **Session Logs**: Detailed list of all sessions in selected month
- **Month Selection**: Choose any month to view historical data
- **Time Totals**: See exactly how much time you've spent on each habit

### Data Security
- **User Isolation**: Each user only sees their own data
- **Secure Authentication**: Firebase handles all authentication securely
- **Cloud Backup**: All data is automatically backed up to Firebase

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Contributing

This is a single-file application designed for easy deployment. To contribute:

1. Fork the repository
2. Make your changes to the `hi` file
3. Test locally
4. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions:
1. Check the Firebase Console for authentication/database errors
2. Verify your Firebase configuration is correct
3. Ensure your Firestore security rules allow authenticated users
4. Check browser console for JavaScript errors

---

**Happy Studying! 📚⏱️**
