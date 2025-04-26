// src/pages/Amigos/FollowedAmigos.jsx
import React, { useEffect, useState } from "react";
import { getFollowedAmigos } from "./amigoUtils";
import AmigoCard from "./AmigoCard";

const FollowedAmigos = ({ currentUser }) => {
  const [followedAmigos, setFollowedAmigos] = useState([]);

  useEffect(() => {
    if (currentUser?.uid) {
      getFollowedAmigos(currentUser.uid).then(setFollowedAmigos);
    }
  }, [currentUser]);

  const handleUnfollow = (amigoId) => {
    // TODO: Add unfollow logic if you want later
    console.log("Unfollow amigo:", amigoId);
  };

  return (
    <div className="followed-amigos">
      <h2 className="text-3xl font-bold text-[#FF6B6B] mb-4">Your Amigos</h2>

      {followedAmigos.length === 0 ? (
        <p className="text-gray-600">You haven’t followed any amigos yet.</p>
      ) : (
        <div className="amigo-list">
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
    </div>
  );
};

export default FollowedAmigos;
