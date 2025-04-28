// src/components/pages/Amigos/AmigoCard.jsx
import React from 'react';
import { motion } from 'framer-motion'; // ✅ Animations!

const AmigoCard = ({ name, bio, photoURL, onFollow, isFollowing }) => {
  const placeholderImage = "https://via.placeholder.com/300x200?text=Amigo";

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="amigo-card"
    >
      <img
        src={photoURL || placeholderImage}
        alt={name}
        className="amigo-avatar"
      />
      <div className="amigo-info">
        <h3 className="amigo-name">{name}</h3>
        <p className="amigo-bio">{bio || "No bio yet."}</p>
        <button
          className={`follow-btn ${isFollowing ? "following" : ""}`}
          onClick={onFollow}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      </div>
    </motion.div>
  );
};

export default AmigoCard;
