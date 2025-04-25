// src/seeder/clearSeededData.js
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Clears only the data that was marked as seeded for testing/demo purposes.
 * Assumes documents have a field `seeded: true`.
 */
const clearSeededData = async () => {
  console.log("🧼 Clearing seeded data only...");

  const collections = ["users", "grupos", "events", "questionSets", "reactions"];

  for (const col of collections) {
    const snapshot = await getDocs(collection(db, col));
    const seededDocs = snapshot.docs.filter((docSnap) => docSnap.data().seeded === true);

    for (const seededDoc of seededDocs) {
      await deleteDoc(doc(db, col, seededDoc.id));
      console.log(`🗑️ Deleted seeded doc from ${col}: ${seededDoc.id}`);
    }
  }

  console.log("✅ Seeded data cleared.");
};

export default clearSeededData;
