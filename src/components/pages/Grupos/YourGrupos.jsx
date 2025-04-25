// src/components/pages/Grupos/YourGrupos.jsx
import React, { useEffect, useState } from "react";
import { db, auth } from "../../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

const YourGrupos = () => {
  const [yourGrupos, setYourGrupos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGrupos = async () => {
      setLoading(true);
      setError("");
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) throw new Error("User not authenticated");

        const q = query(
          collection(db, "grupos"),
          where("members", "array-contains", uid)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setYourGrupos(data);
      } catch (err) {
        console.error("Error fetching user's grupos:", err);
        setError("Unable to load your grupos.");
      } finally {
        setLoading(false);
      }
    };

    fetchGrupos();
  }, []);

  return (
    <div className="your-grupos">
      <h2>Your Grupos</h2>
      {loading ? (
        <p>Loading your grupos...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : yourGrupos.length === 0 ? (
        <p>You haven't joined or created any grupos yet.</p>
      ) : (
        <ul>
          {yourGrupos.map((grupo) => (
            <li key={grupo.id}>
              <Link to={`/grupos/${grupo.id}`}>{grupo.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default YourGrupos;
