// src/seeder/clearNotifications.js
import { db } from "../firebase.js";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export const clearNotifications = async () => {
  const snapshot = await getDocs(collection(db, "notifications"));

  for (const docRef of snapshot.docs) {
    const notif = docRef.data();
    if (notif.seeded === true) {
      await deleteDoc(doc(db, "notifications", docRef.id));
      console.log(`🗑️ Deleted seeded notification: ${docRef.id}`);
    } else {
      console.log(`🛡️ Skipped real notification: ${docRef.id}`);
    }
  }

  console.log("✅ Cleared seeded notifications only.");
};
