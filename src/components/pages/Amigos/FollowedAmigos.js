// src/pages/Amigos/FollowedAmigos.js
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

  return (
    <div>
      <h2>Your Amigos</h2>
      {followedAmigos.length === 0 ? (
        <p>You haven’t followed any amigos yet.</p>
      ) : (
        followedAmigos.map((amigo) => (
          <AmigoCard key={amigo.id} amigo={amigo} isFollowing={true} />
        ))
      )}
    </div>
  );
};

export default FollowedAmigos;
