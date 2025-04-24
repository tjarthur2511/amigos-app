import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const GrupoDetail = () => {
  const { id } = useParams();
  const [grupo, setGrupo] = useState(null);

  useEffect(() => {
    const fetchGrupo = async () => {
      const docRef = doc(db, "grupos", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setGrupo(docSnap.data());
      }
    };

    fetchGrupo();
  }, [id]);

  return (
    <div className="grupo-detail">
      {grupo ? (
        <>
          <h2>{grupo.name}</h2>
          <p>{grupo.description}</p>
          <p><strong>Created by:</strong> {grupo.owner}</p>
          {/* Future: members, map, events, RSVP, etc. */}
        </>
      ) : (
        <p>Loading grupo...</p>
      )}
    </div>
  );
};

export default GrupoDetail;
