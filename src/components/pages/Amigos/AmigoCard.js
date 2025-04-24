// src/pages/Amigos/AmigoCard.js
import React from 'react';
import './AmigoCard.css';

const AmigoCard = ({ name, bio, photoURL, onFollow, isFollowing }) => {
  return (
    <div className="amigo-card">
      <img src={photoURL} alt={name} className="amigo-avatar" />
      <div className="amigo-info">
        <h3>{name}</h3>
        <p>{bio || "No bio yet."}</p>
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
