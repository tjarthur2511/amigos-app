// src/components/pages/Grupos/GrupoDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase.js"; // 🔥 Corrected path
import { doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";

const GrupoDetail = () => {
  const { id } = useParams();
  const [grupo, setGrupo] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrupo = async () => {
      try {
        const docRef = doc(db, "grupos", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setGrupo(docSnap.data());
        } else {
          setError("Grupo not found.");
        }
      } catch (err) {
        console.error("Failed to fetch grupo:", err);
        setError("Error loading grupo details.");
      } finally {
        setLoading(false);
      }
    };

    fetchGrupo();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-[#FF6B6B] animate-pulse text-xl font-semibold">Loading grupo...</p>
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
      <div className="w-full max-w-3xl border rounded-2xl p-6 shadow-lg bg-white flex flex-col space-y-4">
        <h2 className="text-4xl font-bold text-[#FF6B6B] text-center">{grupo.name}</h2>
        <p className="text-gray-700 text-center">{grupo.description || "No description provided."}</p>
        <p className="text-gray-600 text-center">
          <strong>Created by:</strong> {grupo.creatorId || "Unknown"}
        </p>
        {/* 🛠 Future: Add members list, events, RSVP button here */}
      </div>
    </motion.div>
  );
};

export default GrupoDetail;
