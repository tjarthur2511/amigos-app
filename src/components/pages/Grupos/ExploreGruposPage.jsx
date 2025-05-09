// src/components/pages/Grupos/ExploreGruposPage.jsx
import React, { useEffect, useState } from 'react';
import { db, auth } from '../../../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

const ExploreGruposPage = () => {
  const [grupos, setGrupos] = useState([]);

  useEffect(() => {
    const fetchGrupos = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) return;

      const { grupos: joined = [], interestTags = [], location = {} } = userSnap.data();
      const allSnap = await getDocs(collection(db, 'grupos'));
      const allGrupos = allSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const offInterestGrupos = allGrupos.filter(grupo =>
        !joined.includes(grupo.id) &&
        (!grupo.tags?.some(tag => interestTags.includes(tag)) ||
         grupo.location?.state !== location.state)
      );

      const random = offInterestGrupos.sort(() => 0.5 - Math.random()).slice(0, 10);
      setGrupos(random);
    };

    fetchGrupos();
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Comfortaa, sans-serif' }}>
      <h2 style={{ fontSize: '2rem', color: '#FF6B6B', marginBottom: '1rem' }}>🌱 Explore Offbeat Grupos</h2>
      {grupos.length > 0 ? (
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {grupos.map((grupo) => (
            <li key={grupo.id} style={{ backgroundColor: '#ffecec', padding: '1rem', borderRadius: '1rem', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
              <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{grupo.name}</p>
              <p style={{ fontSize: '0.9rem', color: '#555' }}>{grupo.description || 'No description yet.'}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: '#888', fontSize: '0.95rem' }}>No suggestions available right now.</p>
      )}
    </div>
  );
};

export default ExploreGruposPage;
