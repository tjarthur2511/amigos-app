// src/components/pages/Amigos/AmigosPage.jsx
import React, { useEffect, useState } from "react";
import "./AmigosPage.css";
import {
  getCurrentUserAmigos,
  getSuggestedAmigos,
  getAmigosByGrupos,
} from "../../utils/amigoUtils";
import { useAuth } from "../../context/AuthContext";
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
        list.map((amigo) => <AmigoCard key={amigo.id} amigo={amigo} />)
      ) : (
        <p>{emptyMessage}</p>
      )}
    </div>
  );

  return (
    <div className="amigos-page container">
      <h1>Amigos</h1>
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        <button onClick={() => setTab("your")}>Your Amigos</button>
        <button onClick={() => setTab("suggested")}>Suggested</button>
        <button onClick={() => setTab("grupos")}>Grupos Amigos</button>
      </div>

      {tab === "your" && renderAmigoList(yourAmigos, "No amigos yet.")}
      {tab === "suggested" && renderAmigoList(suggestedAmigos, "No suggestions at the moment.")}
      {tab === "grupos" && renderAmigoList(grupoAmigos, "You haven’t joined any Grupos yet.")}
    </div>
  );
};

export default AmigosPage;
