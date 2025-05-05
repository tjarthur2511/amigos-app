// src/seeder/clearEvents.js
import { db } from "../firebase.js";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export const clearEvents = async () => {
  const snapshot = await getDocs(collection(db, "events"));
  for (const docRef of snapshot.docs) {
    if (docRef.data()?.seeded === true) {
      await deleteDoc(doc(db, "events", docRef.id));
      console.log(`🗑️ Deleted seeded event: ${docRef.id}`);
    }
  }
  console.log("✅ Cleared seeded Events");
};
