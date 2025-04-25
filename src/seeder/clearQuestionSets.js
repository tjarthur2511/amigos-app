// src/seeder/clearQuestionSets.js
import { db } from "../firebase.js";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const clearQuestionSets = async () => {
  console.log("🧹 Clearing QuestionSets collection...");
  const snapshot = await getDocs(collection(db, "questionSets"));
  const deletePromises = snapshot.docs.map((docSnap) =>
    deleteDoc(doc(db, "questionSets", docSnap.id))
  );
  await Promise.all(deletePromises);
  console.log("✅ QuestionSets collection cleared.");
};

export default clearQuestionSets;
