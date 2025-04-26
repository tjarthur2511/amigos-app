// src/components/pages/Amigos/FollowedAmigos.jsx
import React, { useEffect, useState } from "react";
import { getFollowedAmigos } from "../../../utils/amigoUtils"; // ✅ correct path
import AmigoCard from "./AmigoCard";
import { motion } from "framer-motion"; // ✅ smooth page loading animation

const FollowedAmigos = ({ currentUser }) => {
  const [followedAmigos, setFollowedAmigos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowed = async () => {
      if (currentUser?.uid) {
        const amigos = await getFollowedAmigos(currentUser.uid);
        setFollowedAmigos(amigos);
        setLoading(false);
      }
    };
    fetchFollowed();
  }, [currentUser]);

  const handleUnfollow = (amigoId) => {
    console.log("Unfollow amigo:", amigoId);
    // 🛠 In the future: Actually remove amigo from Firestore here
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-40">
        <p className="text-[#FF6B6B] text-lg animate-pulse">Loading your amigos...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="followed-amigos w-full px-4"
    >
      <h2 className="text-3xl font-bold text-[#FF6B6B] mb-6 text-center">
        Your Amigos
      </h2>

      {followedAmigos.length === 0 ? (
        <p className="text-gray-600 text-center">You haven’t followed any amigos yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {followedAmigos.map((amigo) => (
            <AmigoCard
              key={amigo.id}
              name={amigo.displayName}
              bio={amigo.bio}
              photoURL={amigo.photoURL}
              isFollowing={true}
              onFollow={() => handleUnfollow(amigo.id)}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default FollowedAmigos;
