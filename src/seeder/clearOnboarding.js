// src/seeder/clearOnboarding.js
import { db } from "../firebase.js";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

const clearOnboarding = async () => {
  const ref = collection(db, "questionSets");
  const q = query(ref, where("type", "==", "onboarding"));

  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    console.log("⚠️ No onboarding questions found to delete.");
    return "⚠️ No onboarding documents found.";
  }

  for (const docSnap of snapshot.docs) {
    await deleteDoc(docSnap.ref);
  }

  console.log(`✅ Cleared ${snapshot.size} onboarding question sets.`);
  return `✅ Deleted ${snapshot.size} onboarding documents.`;
};

export default clearOnboarding;
