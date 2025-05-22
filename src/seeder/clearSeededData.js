// src/seeder/clearSeededData.js
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase.js";

const clearSeededData = async () => {
  try {
    console.log("🧹 Clearing all seeded test/demo data...");

    const topCollections = [
      "users",
      "grupos",
      "events",
      "questionSets",
      "reactions",
      "posts",
      "notifications",
      "amigos",
      "livestreams"
    ];

    for (const col of topCollections) {
      const snapshot = await getDocs(collection(db, col));
      const seededDocs = snapshot.docs.filter(docSnap => docSnap.data().seeded === true);

      for (const seededDoc of seededDocs) {
        const ref = doc(db, col, seededDoc.id);

        // Handle nested subcollections for livestreams
        if (col === "livestreams") {
          const subPaths = ["comments", "reactions"];
          for (const path of subPaths) {
            const subSnap = await getDocs(collection(db, `${col}/${seededDoc.id}/${path}`));
            for (const subDoc of subSnap.docs) {
              await deleteDoc(doc(db, `${col}/${seededDoc.id}/${path}`, subDoc.id));
              console.log(`   ⤷ Deleted ${path} in ${col}/${seededDoc.id}: ${subDoc.id}`);
            }
          }
        }

        await deleteDoc(ref);
        console.log(`🗑️ Deleted seeded doc from ${col}: ${seededDoc.id}`);
      }
    }

    console.log("✅ All seeded test/demo data cleared.");
    return "✅ All seeded test/demo data cleared.";
  } catch (err) {
    console.error("❌ clearSeededData failed:", err.message);
    throw new Error(`❌ clearSeededData error: ${err.message}`);
  }
};

export default clearSeededData;
