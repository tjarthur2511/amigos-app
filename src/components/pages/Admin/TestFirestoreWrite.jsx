// src/components/pages/Admin/TestFirestoreWrite.jsx
import React, { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

const TestFirestoreWrite = () => {
  const [status, setStatus] = useState("");

  const writeTestData = async () => {
    const user = auth.currentUser;
    if (!user || (user.uid !== "user123" && user.email !== "tjarthur2511@gmail.com")) {
      setStatus("❌ Unauthorized");
      return;
    }

    try {
      const testRef = doc(db, "_test", "ping");
      await setDoc(testRef, {
        message: "Ping from admin",
        testedAt: serverTimestamp(),
        admin: user.email || user.uid,
      });

      const snap = await getDoc(testRef);
      if (snap.exists()) {
        setStatus(`✅ Firestore Write Success: ${JSON.stringify(snap.data())}`);
      } else {
        setStatus("❌ Write failed — doc missing");
      }
    } catch (err) {
      setStatus("❌ Error: " + err.message);
    }
  };

  const deleteTestData = async () => {
    try {
      await deleteDoc(doc(db, "_test", "ping"));
      setStatus("🗑️ Test doc deleted");
    } catch (err) {
      setStatus("❌ Deletion failed: " + err.message);
    }
  };

  useEffect(() => {
    writeTestData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-black font-[Comfortaa] p-8">
      <h1 className="text-3xl font-bold text-[#FF6B6B] mb-6">Admin Firestore Test</h1>

      <button
        onClick={writeTestData}
        className="bg-[#FF6B6B] text-white px-4 py-2 rounded-full mr-4"
      >
        🔄 Run Write Test
      </button>

      <button
        onClick={deleteTestData}
        className="bg-gray-300 text-black px-4 py-2 rounded-full"
      >
        🗑️ Delete Test Doc
      </button>

      <pre className="mt-6 p-4 bg-white rounded-xl shadow text-sm text-green-700 whitespace-pre-wrap">
        {status || "Test output will appear here..."}
      </pre>
    </div>
  );
};

export default TestFirestoreWrite;
