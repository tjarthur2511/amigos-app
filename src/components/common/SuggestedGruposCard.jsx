// src/components/common/SuggestedGruposCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const SuggestedGruposCard = ({ grupo }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/grupos/${grupo.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white text-[#333] p-4 rounded-xl shadow-md flex items-center gap-4 cursor-pointer hover:bg-gray-100 transition"
    >
      <img
        src={grupo.photoURL || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
        alt={grupo.name}
        className="w-14 h-14 rounded-full object-cover"
      />
      <div>
        <h3 className="font-bold text-lg text-[#FF6B6B]">{grupo.name || "Unnamed Grupo"}</h3>
        <p className="text-sm">{grupo.description || "No description available"}</p>
      </div>
    </div>
  );
};

export default SuggestedGruposCard;
