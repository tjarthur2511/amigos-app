// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBsAP4a2a6BI7FReA2NoF3lbiTzzjEyG6U",
  authDomain: "amigos-f0b75.firebaseapp.com",
  projectId: "amigos-f0b75",
  storageBucket: "amigos-f0b75.firebasestorage.app",
  messagingSenderId: "188885971311",
  appId: "1:188885971311:web:73f51e65d7affb92c4f89a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
