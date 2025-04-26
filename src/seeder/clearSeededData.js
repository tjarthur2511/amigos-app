// src/seeder/clearSeededData.js
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase.js"; // (add .js so Vite doesn't cry)

const clearSeededData = async () => {
  console.log("🧹 Clearing only seeded (test) data...");

  const collections = ["users", "grupos", "events", "questionSets", "reactions"];

  for (const col of collections) {
    const snapshot = await getDocs(collection(db, col));
    const seededDocs = snapshot.docs.filter((docSnap) => docSnap.data().seeded === true);

    for (const seededDoc of seededDocs) {
      await deleteDoc(doc(db, col, seededDoc.id));
      console.log(`🗑️ Deleted seeded doc from ${col}: ${seededDoc.id}`);
    }
  }

  console.log("✅ Seeded test/demo data cleared safely.");
};

export default clearSeededData;
