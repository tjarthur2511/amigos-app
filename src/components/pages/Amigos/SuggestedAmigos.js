// src/pages/Amigos/SuggestedAmigos.js
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
    <div>
      <h2>Suggested Amigos</h2>
      {suggestedAmigos.length === 0 ? (
        <p>No suggestions at the moment.</p>
      ) : (
        suggestedAmigos.map((amigo) => (
          <AmigoCard
            key={amigo.id}
            amigo={amigo}
            onFollow={() => handleFollow(amigo.id)}
            isFollowing={amigo.isFollowing}
          />
        ))
      )}
    </div>
  );
};

export default SuggestedAmigos;
