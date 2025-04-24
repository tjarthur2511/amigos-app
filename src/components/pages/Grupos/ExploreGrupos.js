// src/components/pages/Grupos/ExploreGrupos.js
import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { collection, getDocs, updateDoc, doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

const ExploreGrupos = () => {
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchGrupos = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "grupos"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setGrupos(data);
    } catch (err) {
      console.error("Error fetching grupos:", err);
      setError("Failed to load grupos.");
    } finally {
      setLoading(false);
    }
  };

  const joinGrupo = async (grupoId) => {
    try {
      const grupoRef = doc(db, "grupos", grupoId);
      const grupoSnap = await getDoc(grupoRef);

      if (grupoSnap.exists()) {
        const data = grupoSnap.data();
        const uid = auth.currentUser?.uid;
        if (!uid) return alert("You must be logged in.");

        if (!data.members.includes(uid)) {
          await updateDoc(grupoRef, {
            members: [...data.members, uid],
          });
          alert("Joined grupo!");
          fetchGrupos();
        } else {
          alert("Already a member.");
        }
      }
    } catch (err) {
      console.error("Join grupo error:", err);
      alert("Failed to join grupo.");
    }
  };

  useEffect(() => {
    fetchGrupos();
  }, []);

  return (
    <div className="explore-grupos">
      <h2>Explore Grupos</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading ? (
        <p>Loading grupos...</p>
      ) : (
        <ul>
          {grupos.map((grupo) => (
            <li key={grupo.id}>
              <Link to={`/grupos/${grupo.id}`}>{grupo.name}</Link>
              <button onClick={() => joinGrupo(grupo.id)}>Join</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExploreGrupos;
