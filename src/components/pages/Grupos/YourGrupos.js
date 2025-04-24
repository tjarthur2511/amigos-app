import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

const YourGrupos = () => {
  const [yourGrupos, setYourGrupos] = useState([]);

  useEffect(() => {
    const fetchGrupos = async () => {
      const q = query(
        collection(db, "grupos"),
        where("members", "array-contains", auth.currentUser?.uid)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setYourGrupos(data);
    };

    fetchGrupos();
  }, []);

  return (
    <div className="your-grupos">
      <h2>Your Grupos</h2>
      {yourGrupos.length === 0 ? (
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
