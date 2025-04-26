// src/components/pages/Grupos/ExploreGrupos.jsx
import React, { useEffect, useState } from "react";
import { db, auth } from "../../../firebase";
import { collection, getDocs, updateDoc, doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // ✅ animations

const ExploreGrupos = () => {
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchGrupos = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "grupos"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setGrupos(data);
    } catch (err) {
      console.error("Error fetching grupos:", err);
      setError("Failed to load grupos.");
    } finally {
      setLoading(false);
    }
  };

  const joinGrupo = async (grupoId) => {
    try {
      const grupoRef = doc(db, "grupos", grupoId);
      const grupoSnap = await getDoc(grupoRef);

      if (grupoSnap.exists()) {
        const data = grupoSnap.data();
        const uid = auth.currentUser?.uid;
        if (!uid) return alert("You must be logged in.");

        if (!data.members.includes(uid)) {
          await updateDoc(grupoRef, {
            members: [...data.members, uid],
          });

          setGrupos((prev) =>
            prev.map((g) =>
              g.id === grupoId ? { ...g, members: [...g.members, uid] } : g
            )
          );

          alert("🎉 Joined grupo!");
        } else {
          alert("Already a member.");
        }
      }
    } catch (err) {
      console.error("Join grupo error:", err);
      alert("Failed to join grupo.");
    }
  };

  useEffect(() => {
    fetchGrupos();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-[#FF6B6B] animate-pulse text-lg font-semibold">Loading grupos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center space-y-6 mt-6 px-4"
    >
      <h2 className="text-3xl font-bold text-[#FF6B6B] text-center">Explore Grupos</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
        {grupos.map((grupo) => (
          <div
            key={grupo.id}
            className="border rounded-2xl p-6 shadow-lg bg-white hover:shadow-xl transition-all flex flex-col space-y-4"
          >
            <Link
              to={`/grupos/${grupo.id}`}
              className="text-2xl font-bold text-[#FF6B6B] hover:underline text-center"
            >
              {grupo.name}
            </Link>
            <p className="text-gray-700 text-center">{grupo.description || "No description provided."}</p>
            <button
              onClick={() => joinGrupo(grupo.id)}
              className="bg-[#FF6B6B] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#e15555] transition-all"
            >
              Join Grupo
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ExploreGrupos;
