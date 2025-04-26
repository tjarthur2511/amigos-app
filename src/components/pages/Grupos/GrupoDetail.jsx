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
    <div className="flex flex-col items-center space-y-6 mt-6">
      {loading ? (
        <p className="text-gray-500">Loading grupo...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : grupo ? (
        <div className="w-full max-w-3xl border rounded-xl p-6 shadow-md bg-white flex flex-col space-y-4">
          <h2 className="text-4xl font-bold text-[#FF6B6B]">{grupo.name}</h2>
          <p className="text-gray-700">{grupo.description || "No description provided."}</p>
          <p className="text-gray-600">
            <strong>Created by:</strong> {grupo.creatorId || "Unknown"}
          </p>
          {/* Future: Add members list, events list, RSVP buttons here */}
        </div>
      ) : null}
    </div>
  );
};

export default GrupoDetail;
