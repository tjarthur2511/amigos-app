// src/pages/Amigos/SuggestedAmigos.jsx
import React, { useEffect, useState } from "react";
import { getSuggestedAmigos, toggleFollow } from "./amigoUtils";
import AmigoCard from "./AmigoCard";

const SuggestedAmigos = ({ currentUser }) => {
  const [suggestedAmigos, setSuggestedAmigos] = useState([]);

  useEffect(() => {
    if (currentUser?.uid) {
      getSuggestedAmigos(currentUser.uid).then(setSuggestedAmigos);
    }
  }, [currentUser]);

  const handleFollow = async (amigoId) => {
    await toggleFollow(currentUser.uid, amigoId);
    setSuggestedAmigos((prev) =>
      prev.map((amigo) =>
        amigo.id === amigoId ? { ...amigo, isFollowing: !amigo.isFollowing } : amigo
      )
    );
  };

  return (
    <div className="suggested-amigos">
      <h2 className="text-3xl font-bold text-[#FF6B6B] mb-4">Suggested Amigos</h2>

      {suggestedAmigos.length === 0 ? (
        <p className="text-gray-600">No suggestions at the moment.</p>
      ) : (
        <div className="amigo-list">
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
    </div>
  );
};

export default SuggestedAmigos;
