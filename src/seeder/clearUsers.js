// src/seeder/clearUsers.js
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

const clearUsers = async () => {
  console.log("🧹 Clearing all users...");
  const snapshot = await getDocs(collection(db, "users"));

  const deletions = snapshot.docs.map((userDoc) =>
    deleteDoc(doc(db, "users", userDoc.id))
  );

  await Promise.all(deletions);
  console.log("✅ All users cleared.");
};

export default clearUsers;
