// src/pages/Amigos/AmigoCard.jsx
import React from 'react';
import './AmigoCard.css';

const AmigoCard = ({ name, bio, photoURL, onFollow, isFollowing }) => {
  const placeholderImage = "https://via.placeholder.com/150";

  return (
    <div className="amigo-card">
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
    </div>
  );
};

export default AmigoCard;
