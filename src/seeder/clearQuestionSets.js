// src/seeder/clearQuestionSets.js
import { db } from "../firebase.js";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export const clearQuestionSets = async () => {
  const snapshot = await getDocs(collection(db, "questionSets"));
  for (const docRef of snapshot.docs) {
    await deleteDoc(doc(db, "questionSets", docRef.id));
  }
  console.log("🧼 Cleared Question Sets");
};
