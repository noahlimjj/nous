// Firebase Configuration Template
// This file is used as a fallback if environment variables are not set

if (typeof window !== 'undefined') {
    window.firebaseConfig = {
        apiKey: "{{FIREBASE_API_KEY}}",
        authDomain: "{{FIREBASE_AUTH_DOMAIN}}",
        projectId: "{{FIREBASE_PROJECT_ID}}",
        storageBucket: "{{FIREBASE_STORAGE_BUCKET}}",
        messagingSenderId: "{{FIREBASE_MESSAGING_SENDER_ID}}",
        appId: "{{FIREBASE_APP_ID}}",
        measurementId: "{{FIREBASE_MEASUREMENT_ID}}"
    };
    console.log('Firebase config loaded (template)');
}
