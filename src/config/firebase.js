import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoKeyForIndraniPaithaniStore2026",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "indrani-paithani.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "indrani-paithani",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "indrani-paithani.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "102938475610",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:102938475610:web:indranipaithani2026"
};

let app;
let auth;
let googleProvider;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
} catch (err) {
  console.warn("Firebase Initialization Fallback:", err);
  auth = {
    onAuthStateChanged: (cb) => {
      try { cb(null); } catch (e) {}
      return () => {};
    },
    currentUser: null
  };
  googleProvider = {};
}

export { auth, googleProvider };
