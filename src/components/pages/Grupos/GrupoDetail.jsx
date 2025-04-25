// src/components/pages/Grupos/GrupoDetail.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";

const GrupoDetail = () => {
  const { id } = useParams();
  const [grupo, setGrupo] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrupo = async () => {
      try {
        const docRef = doc(db, "grupos", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setGrupo(docSnap.data());
        } else {
          setError("Grupo not found.");
        }
      } catch (err) {
        console.error("Failed to fetch grupo:", err);
        setError("Error loading grupo details.");
      } finally {
        setLoading(false);
      }
    };

    fetchGrupo();
  }, [id]);

  return (
    <div className="grupo-detail">
      {loading ? (
        <p>Loading grupo...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : grupo ? (
        <>
          <h2>{grupo.name}</h2>
          <p>{grupo.description}</p>
          <p><strong>Created by:</strong> {grupo.owner}</p>
          {/* Future: members, map, events, RSVP, etc. */}
        </>
      ) : null}
    </div>
  );
};

export default GrupoDetail;
