// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, deleteDoc, collection, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase configuration object from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyBU6jGIQIOdctuxRz-HuDFwQjqEPwCRrJE",  // Update this with your actual Firebase API key
  authDomain: "amigos-app-9fbfa.firebaseapp.com",  // Update with your Firebase Auth domain
  projectId: "amigos-app-9fbfa",  // Firebase Project ID
  storageBucket: "amigos-app-9fbfa.appspot.com",  // Firebase Storage bucket
  messagingSenderId: "766654858394",  // Firebase messaging sender ID
  appId: "1:766654858394:web:f36bc88b2348822be9804c"  // Firebase App ID
};

// Initialize Firebase app with config
const app = initializeApp(firebaseConfig);

// Initialize Firestore (database) and Authentication
const db = getFirestore(app);  // Firestore instance for DB operations
const auth = getAuth(app);  // Firebase Auth instance for user authentication

// Export Firebase services for use in your app
export { db, auth, doc, getDoc, setDoc, deleteDoc, collection, getDocs, query, where };
