// src/components/pages/Amigos/SuggestedAmigos.jsx
import React, { useEffect, useState } from "react";
import { getSuggestedAmigos, toggleFollow } from "../../../utils/amigoUtils"; // ✅ correct path
import AmigoCard from "./AmigoCard";
import { motion } from "framer-motion"; // ✅ animations

const SuggestedAmigos = ({ currentUser }) => {
  const [suggestedAmigos, setSuggestedAmigos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (currentUser?.uid) {
        const suggestions = await getSuggestedAmigos(currentUser.uid);
        setSuggestedAmigos(suggestions);
        setLoading(false);
      }
    };
    fetchSuggestions();
  }, [currentUser]);

  const handleFollow = async (amigoId) => {
    await toggleFollow(currentUser.uid, amigoId);
    setSuggestedAmigos((prev) =>
      prev.map((amigo) =>
        amigo.id === amigoId ? { ...amigo, isFollowing: !amigo.isFollowing } : amigo
      )
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-40">
        <p className="text-[#FF6B6B] text-lg animate-pulse">Finding amigos...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="suggested-amigos w-full px-4"
    >
      <h2 className="text-3xl font-bold text-[#FF6B6B] mb-6 text-center">
        Suggested Amigos
      </h2>

      {suggestedAmigos.length === 0 ? (
        <p className="text-gray-600 text-center">No suggestions at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {suggestedAmigos.map((amigo) => (
            <AmigoCard
              key={amigo.id}
              name={amigo.displayName}
              bio={amigo.bio}
              photoURL={amigo.photoURL}
              isFollowing={amigo.isFollowing}
              onFollow={() => handleFollow(amigo.id)}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default SuggestedAmigos;
