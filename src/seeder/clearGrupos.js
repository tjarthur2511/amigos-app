// src/seeder/clearGrupos.js
import { db } from "../firebase.js";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export const clearGrupos = async () => {
  const snapshot = await getDocs(collection(db, "grupos"));
  for (const docRef of snapshot.docs) {
    await deleteDoc(doc(db, "grupos", docRef.id));
  }
  console.log("🧼 Cleared Grupos");
};
