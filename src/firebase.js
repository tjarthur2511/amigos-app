// src/firebase.js
<<<<<<< HEAD
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
=======
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBU6jGIQIOdctuxRz-HuDFwQjqEPwCRrJE",
  authDomain: "amigos-app-9fbfa.firebaseapp.com",
  projectId: "amigos-app-9fbfa",
  storageBucket: "amigos-app-9fbfa.appspot.com",
  messagingSenderId: "766654858394",
  appId: "1:766654858394:web:f36bc88b2348822be9804c"
>>>>>>> 2e03023 (✅ Merged index.css and firebase.js with Amigos styling and Firebase Auth)
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

<<<<<<< HEAD
export { app, db, auth };
=======
export { db, auth };
>>>>>>> 2e03023 (✅ Merged index.css and firebase.js with Amigos styling and Firebase Auth)
