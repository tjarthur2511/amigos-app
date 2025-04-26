// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getFirestore, doc, getDoc, setDoc,
  deleteDoc, collection, getDocs,
  query, where
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBU6jGIQIOdctuxRz-HuDFwQjqEPwCRrJE",
  authDomain: "amigos-app-9fbfa.firebaseapp.com",
  projectId: "amigos-app-9fbfa",
  storageBucket: "amigos-app-9fbfa.appspot.com",
  messagingSenderId: "766654858394",
  appId: "1:766654858394:web:f36bc88b2348822be9804c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);

// Export services
export { db, auth, doc, getDoc, setDoc, deleteDoc, collection, getDocs, query, where };
