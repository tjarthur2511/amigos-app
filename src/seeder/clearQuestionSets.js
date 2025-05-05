// src/seeder/clearQuestionSets.js
import { db } from "../firebase.js";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export const clearQuestionSets = async () => {
  const snapshot = await getDocs(collection(db, "questionSets"));
  for (const docRef of snapshot.docs) {
    if (docRef.data()?.seeded === true) {
      await deleteDoc(doc(db, "questionSets", docRef.id));
      console.log(`🗑️ Deleted seeded question set: ${docRef.id}`);
    }
  }
  console.log("✅ Cleared seeded Question Sets");
};
