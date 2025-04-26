// src/seeder/clearEvents.js
import { db } from "../firebase.js";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export const clearEvents = async () => {
  const snapshot = await getDocs(collection(db, "events"));
  for (const docRef of snapshot.docs) {
    await deleteDoc(doc(db, "events", docRef.id));
  }
  console.log("🧼 Cleared Events");
};
