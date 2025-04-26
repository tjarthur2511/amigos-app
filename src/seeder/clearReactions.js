// src/seeder/clearReactions.js
import { db } from "../firebase.js";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export const clearReactions = async () => {
  const snapshot = await getDocs(collection(db, "reactions"));
  for (const docRef of snapshot.docs) {
    await deleteDoc(doc(db, "reactions", docRef.id));
  }
  console.log("🧼 Cleared Reactions");
};
