// src/components/pages/Grupos/YourGrupos.jsx
import React, { useEffect, useState } from "react";
import { db, auth } from "../../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // ✅ animations

const YourGrupos = () => {
  const [yourGrupos, setYourGrupos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGrupos = async () => {
      setLoading(true);
      setError("");
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) throw new Error("User not authenticated");

        const q = query(
          collection(db, "grupos"),
          where("members", "array-contains", uid)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setYourGrupos(data);
      } catch (err) {
        console.error("Error fetching user's grupos:", err);
        setError("Unable to load your grupos.");
      } finally {
        setLoading(false);
      }
    };

    fetchGrupos();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-[#FF6B6B] animate-pulse text-lg font-semibold">Loading your grupos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
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
      <h2 className="text-3xl font-bold text-[#FF6B6B] text-center">Your Grupos</h2>

      {yourGrupos.length === 0 ? (
        <p className="text-gray-600 text-center">
          You haven't joined or created any grupos yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
          {yourGrupos.map((grupo) => (
            <Link
              key={grupo.id}
              to={`/grupos/${grupo.id}`}
              className="border rounded-2xl p-6 shadow-lg bg-white hover:shadow-xl transition-all flex flex-col space-y-2"
            >
              <h3 className="text-2xl font-bold text-[#FF6B6B] text-center">{grupo.name}</h3>
              <p className="text-gray-700 text-center">
                {grupo.description || "No description provided."}
              </p>
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default YourGrupos;
