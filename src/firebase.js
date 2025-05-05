import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

// ✅ Firebase config for amigos-f0b75 (NO storageBucket issue)
const firebaseConfig = {
  apiKey: "AIzaSyBsAP4a2a6BI7FReA2NoF3lbiTzzjEyG6U",
  authDomain: "amigos-f0b75.firebaseapp.com",
  projectId: "amigos-f0b75",
  storageBucket: "", // 🚫 Disabled storage
  messagingSenderId: "188885971311",
  appId: "1:188885971311:web:73f51e65d7affb92c4f89a"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

// Firebase Storage initialization - commented out since you don't need it for now
// const storage = getStorage(app);  // You can uncomment this when you're ready to use storage

export {
  db,
  auth,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  serverTimestamp
};
