import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: window.ENV?.FIREBASE_API_KEY || "AIzaSyBNMK4bkwMcYjJzf8nruMtmn8hZDqeZG9g",
  authDomain: window.ENV?.FIREBASE_AUTH_DOMAIN || "washgo-app-2d669.firebaseapp.com",
  projectId: window.ENV?.FIREBASE_PROJECT_ID || "washgo-app-2d669",
  storageBucket: window.ENV?.FIREBASE_STORAGE_BUCKET || "washgo-app-2d669.firebasestorage.app",
  messagingSenderId: window.ENV?.FIREBASE_MESSAGING_SENDER_ID || "1064703566526",
  appId: window.ENV?.FIREBASE_APP_ID || "1:1064703566526:web:493c7d1c78d360e115f4ef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

console.log("Firebase (WashGo App) Initialized Successfully");

export { app, db, auth, analytics };

