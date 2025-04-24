// src/firebase.js

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBU6jGIQIOdctuxRz-HuDFwQjqEPwCRrJE",
  authDomain: "amigos-app-9fbfa.firebaseapp.com",
  projectId: "amigos-app-9fbfa",
  storageBucket: "amigos-app-9fbfa.appspot.com",
  messagingSenderId: "766654858394",
  appId: "1:766654858394:web:f36bc88b2348822be9804c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
