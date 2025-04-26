// src/components/pages/Amigos/AmigosPage.jsx
import React, { useEffect, useState } from "react";
import "./AmigosPage.css";
import {
  getUserAmigos as getCurrentUserAmigos,
  getSuggestedAmigos,
  getAmigosByGrupos,
} from "../../../utils/amigoUtils";
import { useAuth } from "../../../context/AuthContext";
import AmigoCard from "./AmigoCard";

const AmigosPage = () => {
  const { currentUser } = useAuth();
  const [tab, setTab] = useState("your");
  const [yourAmigos, setYourAmigos] = useState([]);
  const [suggestedAmigos, setSuggestedAmigos] = useState([]);
  const [grupoAmigos, setGrupoAmigos] = useState([]);

  useEffect(() => {
    if (currentUser) {
      getCurrentUserAmigos(currentUser.uid).then(setYourAmigos);
      getSuggestedAmigos(currentUser.uid).then(setSuggestedAmigos);
      getAmigosByGrupos(currentUser.uid).then(setGrupoAmigos);
    }
  }, [currentUser]);

  const renderAmigoList = (list, emptyMessage) => (
    <div className="amigo-list">
      {list.length > 0 ? (
        list.map((amigo) => (
          <AmigoCard
            key={amigo.id}
            name={amigo.displayName}
            bio={amigo.bio}
            photoURL={amigo.photoURL}
            isFollowing={amigo.isFollowing || false}
            onFollow={() => {}}
          />
        ))
      ) : (
        <p className="text-gray-600">{emptyMessage}</p>
      )}
    </div>
  );

  return (
    <div className="amigos-page container">
      <h1 className="text-4xl font-bold text-[#FF6B6B] mb-6">Amigos</h1>

      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <button
          onClick={() => setTab("your")}
          className={`px-4 py-2 rounded-full font-semibold ${
            tab === "your"
              ? "bg-[#FF6B6B] text-white"
              : "bg-white text-[#FF6B6B] border border-[#FF6B6B]"
          }`}
        >
          Your Amigos
        </button>
        <button
          onClick={() => setTab("suggested")}
          className={`px-4 py-2 rounded-full font-semibold ${
            tab === "suggested"
              ? "bg-[#FF6B6B] text-white"
              : "bg-white text-[#FF6B6B] border border-[#FF6B6B]"
          }`}
        >
          Suggested
        </button>
        <button
          onClick={() => setTab("grupos")}
          className={`px-4 py-2 rounded-full font-semibold ${
            tab === "grupos"
              ? "bg-[#FF6B6B] text-white"
              : "bg-white text-[#FF6B6B] border border-[#FF6B6B]"
          }`}
        >
          Grupos Amigos
        </button>
      </div>

      {/* Renders based on selected tab */}
      {tab === "your" && renderAmigoList(yourAmigos, "No amigos yet.")}
      {tab === "suggested" && renderAmigoList(suggestedAmigos, "No suggestions at the moment.")}
      {tab === "grupos" && renderAmigoList(grupoAmigos, "You haven’t joined any Grupos yet.")}
    </div>
  );
};

export default AmigosPage;
