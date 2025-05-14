// src/components/common/SuggestedAmigosCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const SuggestedAmigosCard = ({ amigo }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/profile/${amigo.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white text-[#333] p-4 rounded-xl shadow-md flex items-center gap-4 cursor-pointer hover:bg-gray-100 transition"
    >
      <img
        src={amigo.photoURL || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
        alt={amigo.displayName}
        className="w-14 h-14 rounded-full object-cover"
      />
      <div>
        <h3 className="font-bold text-lg text-[#FF6B6B]">{amigo.displayName || "Unnamed Amigo"}</h3>
        <p className="text-sm">{amigo.bio || "No bio available"}</p>
      </div>
    </div>
  );
};

export default SuggestedAmigosCard;
