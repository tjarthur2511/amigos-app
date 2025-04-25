// src/seeder/clearWeeklyQuestion.js
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

const clearWeeklyQuestion = async () => {
  console.log("🧹 Clearing all weekly questions...");
  const snapshot = await getDocs(collection(db, "weeklyQuestions"));

  const deletions = snapshot.docs.map((docSnap) =>
    deleteDoc(doc(db, "weeklyQuestions", docSnap.id))
  );

  await Promise.all(deletions);
  console.log("✅ All weekly questions cleared.");
};

export default clearWeeklyQuestion;
