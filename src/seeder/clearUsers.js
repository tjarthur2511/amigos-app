// src/seeder/clearUsers.js
import { db } from "../firebase.js";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export const clearUsers = async () => {
  const snapshot = await getDocs(collection(db, "users"));

  for (const docRef of snapshot.docs) {
    const userData = docRef.data();

    // ONLY delete if the user is marked as seeded
    if (userData?.seeded === true) {
      await deleteDoc(doc(db, "users", docRef.id));
      console.log(`🧹 Deleted seeded user: ${docRef.id}`);
    } else {
      console.log(`🛡️ Skipped real user (non-seeded): ${docRef.id}`);
    }
  }

  console.log("✅ Cleared only seeded users.");
};
