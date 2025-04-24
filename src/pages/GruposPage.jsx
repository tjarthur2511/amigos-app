import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import '../styles/GruposPage.css';

function GruposPage() {
  const [grupos, setGrupos] = useState([]);

  useEffect(() => {
    const fetchGrupos = async () => {
      const querySnapshot = await getDocs(collection(db, 'grupos'));
      const fetchedGrupos = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setGrupos(fetchedGrupos);
    };

    fetchGrupos();
  }, []);

  return (
    <div className="grupos-container">
      <h2>Explore Grupos</h2>
      <p>Join or create groups based on your interests and location.</p>

      <div className="grupos-list">
        {grupos.map(grupo => (
          <div key={grupo.id} className="grupo-card">
            <h3>{grupo.name}</h3>
            <p>{grupo.description}</p>
            <button className="join-btn">Join</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GruposPage;
