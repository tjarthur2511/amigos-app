// src/seeder/clearGrupos.js
import { db } from "../firebase.js";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const clearGrupos = async () => {
  console.log("🧹 Clearing Grupos collection...");
  const snapshot = await getDocs(collection(db, "grupos"));
  const deletePromises = snapshot.docs.map((docSnap) =>
    deleteDoc(doc(db, "grupos", docSnap.id))
  );
  await Promise.all(deletePromises);
  console.log("✅ Grupos collection cleared.");
};

export default clearGrupos;
