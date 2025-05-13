// src/components/pages/Admin/FirebaseTester.jsx
import React, { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, deleteObject } from "firebase/storage";
import { useNavigate } from "react-router-dom";

const FirebaseTester = () => {
  const [status, setStatus] = useState([]);
  const navigate = useNavigate();
  const storage = getStorage();
  const user = auth.currentUser;

  const isAdmin =
    user?.uid === "user123" || user?.email === "tjarthur2511@gmail.com";

  useEffect(() => {
    if (!user || !isAdmin) navigate("/");
  }, [user]);

  const testCollections = async () => {
    const results = [];
    try {
      // USERS
      const userRef = doc(db, "users", "test-user-doc");
      await setDoc(userRef, {
        test: true,
        createdAt: serverTimestamp(),
      });
      results.push("✅ USERS collection write success");

      // POSTS
      await addDoc(collection(db, "posts"), {
        userId: "test-user",
        content: "Test post",
        createdAt: serverTimestamp(),
      });
      results.push("✅ POSTS collection write success");

      // COMMENTS
      await addDoc(collection(db, "comments"), {
        userId: "test-user",
        postId: "test-post",
        content: "Test comment",
        createdAt: serverTimestamp(),
      });
      results.push("✅ COMMENTS collection write success");

      // GRUPOS
      await addDoc(collection(db, "grupos"), {
        name: "Test Grupo",
        description: "Temporary test",
        ownerId: "test-user",
        createdAt: serverTimestamp(),
      });
      results.push("✅ GRUPOS collection write success");

      // EVENTS
      await addDoc(collection(db, "events"), {
        name: "Test Event",
        location: "Testville",
        date: serverTimestamp(),
        createdAt: serverTimestamp(),
      });
      results.push("✅ EVENTS collection write success");

      // NOTIFICATIONS
      await addDoc(collection(db, "notifications"), {
        targetUserId: "test-user",
        senderId: "admin",
        category: "test",
        type: "react",
        content: "test notification",
        createdAt: serverTimestamp(),
        seen: false,
      });
      results.push("✅ NOTIFICATIONS collection write success");

      // STORAGE
      const testRef = ref(storage, "test/test-file.txt");
      await uploadBytes(testRef, new Blob(["Amigos test upload"]));
      results.push("✅ STORAGE upload success");

      setStatus(results);

      // CLEANUP (Optional)
      await deleteObject(testRef);
      await deleteDoc(userRef);
    } catch (err) {
      results.push("❌ ERROR: " + err.message);
      setStatus(results);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-center py-10 font-[Comfortaa]">
      <h2 className="text-3xl font-bold text-[#FF6B6B] mb-6">
        Firebase Integration Test
      </h2>
      <button
        onClick={testCollections}
        className="bg-[#FF6B6B] text-white px-6 py-2 rounded-full hover:bg-[#e15555]"
      >
        Run Test
      </button>

      <div className="mt-8 max-w-2xl mx-auto text-left space-y-2">
        {status.map((line, i) => (
          <p key={i} className={line.includes("✅") ? "text-green-600" : "text-red-600"}>
            {line}
          </p>
        ))}
      </div>
    </div>
  );
};

export default FirebaseTester;
