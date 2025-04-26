// src/seeder/clearWeeklyQuestion.js
import { db } from "../firebase.js";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export const clearWeeklyQuestion = async () => {
  const snapshot = await getDocs(collection(db, "weeklyQuestions"));
  for (const docRef of snapshot.docs) {
    await deleteDoc(doc(db, "weeklyQuestions", docRef.id));
  }
  console.log("🧼 Cleared Weekly Questions");
};
