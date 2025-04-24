import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { Link } from "react-router-dom";

const ExploreGrupos = () => {
  const [grupos, setGrupos] = useState([]);

  const fetchGrupos = async () => {
    const snapshot = await getDocs(collection(db, "grupos"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setGrupos(data);
  };

  const joinGrupo = async (grupoId) => {
    const grupoRef = doc(db, "grupos", grupoId);
    const grupoSnap = await getDocs(collection(db, "grupos"));
    const grupo = grupoSnap.docs.find((doc) => doc.id === grupoId);

    if (grupo) {
      const data = grupo.data();
      if (!data.members.includes(auth.currentUser.uid)) {
        await updateDoc(grupoRef, {
          members: [...data.members, auth.currentUser.uid],
        });
        alert("Joined grupo!");
        fetchGrupos(); // refresh
      } else {
        alert("Already a member.");
      }
    }
  };

  useEffect(() => {
    fetchGrupos();
  }, []);

  return (
    <div className="explore-grupos">
      <h2>Explore Grupos</h2>
      <ul>
        {grupos.map((grupo) => (
          <li key={grupo.id}>
            <Link to={`/grupos/${grupo.id}`}>{grupo.name}</Link>
            <button onClick={() => joinGrupo(grupo.id)}>Join</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExploreGrupos;
