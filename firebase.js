// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAk5qHtY3Y_988RBWprbKMiiRc63IECsbg",
  authDomain: "study-d2678.firebaseapp.com",
  projectId: "study-d2678",
  storageBucket: "study-d2678.appspot.com",
  messagingSenderId: "531881111589",
  appId: "1:531881111589:web:4f3acc170683d154210fcc",
  measurementId: "G-W95VY7VVSX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
