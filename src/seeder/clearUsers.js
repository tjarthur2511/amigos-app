// src/seeder/clearUsers.js
import { db } from "../firebase.js";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export const clearUsers = async () => {
  const snapshot = await getDocs(collection(db, "users"));

  for (const docRef of snapshot.docs) {
    const userData = docRef.data();

    // Delete if user is a known bot or test account (customize list here)
    const isSeededBot =
      ["luna@amigos.ai", "zen@amigos.ai"].includes(userData?.email) ||
      userData?.displayName?.includes("Bot");

    if (isSeededBot) {
      await deleteDoc(doc(db, "users", docRef.id));
      console.log(`🧹 Deleted seeded user: ${docRef.id}`);
    } else {
      console.log(`🛡️ Kept real user: ${userData?.displayName || docRef.id}`);
    }
  }

  console.log("✅ Done clearing seeded users.");
};
