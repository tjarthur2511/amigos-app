// src/seeder/clearReactions.js
import { db } from "../firebase.js";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export const clearReactions = async () => {
  const snapshot = await getDocs(collection(db, "reactions"));
  for (const docRef of snapshot.docs) {
    if (docRef.data()?.seeded === true) {
      await deleteDoc(doc(db, "reactions", docRef.id));
      console.log(`🗑️ Deleted seeded reaction: ${docRef.id}`);
    }
  }
  console.log("✅ Cleared seeded Reactions");
};
