// src/seeder/clearEvents.js
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const clearEvents = async () => {
  try {
    const snapshot = await getDocs(collection(db, "events"));
    const deletions = snapshot.docs.map((docSnap) =>
      deleteDoc(doc(db, "events", docSnap.id))
    );
    await Promise.all(deletions);
    console.log("✅ Events collection cleared");
  } catch (error) {
    console.error("❌ Failed to clear Events:", error);
  }
};

export default clearEvents;
