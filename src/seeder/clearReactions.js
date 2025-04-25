// src/seeder/clearReactions.js
import { db } from "../firebase.js";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const clearReactions = async () => {
  console.log("🧹 Clearing Reactions collection...");
  const snapshot = await getDocs(collection(db, "reactions"));
  const deletePromises = snapshot.docs.map((docSnap) =>
    deleteDoc(doc(db, "reactions", docSnap.id))
  );
  await Promise.all(deletePromises);
  console.log("✅ Reactions collection cleared.");
};

export default clearReactions;
