// src/components/pages/Amigos/AmigosPage.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  getUserAmigos as getCurrentUserAmigos,
  getSuggestedAmigos,
  getAmigosByGrupos,
} from "../../../utils/amigoUtils";
import { useAuth } from "../../../context/AuthContext";
import AmigoCard from "./AmigoCard";

const AmigosPage = () => {
  const { currentUser } = useAuth();
  const [tab, setTab] = useState("your");
  const [yourAmigos, setYourAmigos] = useState([]);
  const [suggestedAmigos, setSuggestedAmigos] = useState([]);
  const [grupoAmigos, setGrupoAmigos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAmigos = async () => {
      if (currentUser) {
        setLoading(true);
        await Promise.all([
          getCurrentUserAmigos(currentUser.uid).then(setYourAmigos),
          getSuggestedAmigos(currentUser.uid).then(setSuggestedAmigos),
          getAmigosByGrupos(currentUser.uid).then(setGrupoAmigos),
        ]);
        setLoading(false);
      }
    };
    fetchAmigos();
  }, [currentUser]);

  const renderAmigoList = (list, emptyMessage) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {list.length > 0 ? (
        list.map((amigo) => (
          <AmigoCard
            key={amigo.id}
            name={amigo.displayName}
            bio={amigo.bio}
            photoURL={amigo.photoURL}
            isFollowing={amigo.isFollowing || false}
            onFollow={() => {}} // 🛠 Hook for future follow/unfollow
          />
        ))
      ) : (
        <p className="text-gray-600 text-center col-span-full">{emptyMessage}</p>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-[#FF6B6B] text-xl font-semibold animate-pulse">Loading amigos...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-4xl font-bold text-[#FF6B6B] mb-6 text-center">Amigos</h1>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {[
          { id: "your", label: "Your Amigos" },
          { id: "suggested", label: "Suggested" },
          { id: "grupos", label: "Grupos Amigos" },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-4 py-2 rounded-full font-semibold ${
              tab === id
                ? "bg-[#FF6B6B] text-white"
                : "bg-white text-[#FF6B6B] border border-[#FF6B6B]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "your" && renderAmigoList(yourAmigos, "No amigos yet.")}
      {tab === "suggested" && renderAmigoList(suggestedAmigos, "No suggestions at the moment.")}
      {tab === "grupos" && renderAmigoList(grupoAmigos, "You haven’t joined any Grupos yet.")}
    </motion.div>
  );
};

export default AmigosPage;
