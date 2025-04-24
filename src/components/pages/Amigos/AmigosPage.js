// src/pages/AmigosPage.js
import React, { useEffect, useState } from "react";
import "./AmigosPage.css";
import {
  getCurrentUserAmigos,
  getSuggestedAmigos,
  getAmigosByGrupos,
} from "../utils/amigoUtils";
import { useAuth } from "../context/AuthContext";
import AmigoCard from './AmigoCard';
import './AmigosPage.css';


const AmigosPage = () => {
  const { currentUser } = useAuth();
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

  return (
    <div className="amigos-page">
      <h2>Your Amigos</h2>
      <div className="amigo-list">
        {yourAmigos.length > 0 ? (
          yourAmigos.map((amigo) => <AmigoCard key={amigo.id} amigo={amigo} />)
        ) : (
          <p>No amigos yet.</p>
        )}
      </div>

      <h2>Suggested Amigos</h2>
      <div className="amigo-list">
        {suggestedAmigos.length > 0 ? (
          suggestedAmigos.map((amigo) => (
            <AmigoCard key={amigo.id} amigo={amigo} />
          ))
        ) : (
          <p>No suggestions at the moment.</p>
        )}
      </div>

      <h2>Grupos Amigos</h2>
      <div className="amigo-list">
        {grupoAmigos.length > 0 ? (
          grupoAmigos.map((amigo) => (
            <AmigoCard key={amigo.id} amigo={amigo} />
          ))
        ) : (
          <p>You haven’t joined any Grupos yet.</p>
        )}
      </div>
    </div>
  );
};

export default AmigosPage;
