// ✅ ExploreGruposPage - White Cards, Clean Theme, zIndex 0
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
    <div style={containerStyle}>
      <h2 style={titleStyle}>🌱 Explore Offbeat Grupos</h2>
      {grupos.length > 0 ? (
        <ul style={listStyle}>
          {grupos.map((grupo) => (
            <li key={grupo.id} style={cardStyle}>
              <p style={groupName}>{grupo.name}</p>
              <p style={groupDesc}>{grupo.description || 'No description yet.'}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p style={noDataStyle}>No suggestions available right now.</p>
      )}
    </div>
  );
};

const containerStyle = {
  padding: '2rem',
  fontFamily: 'Comfortaa, sans-serif',
  backgroundColor: '#ffffff',
  borderRadius: '1.5rem',
  boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
  zIndex: 0
};

const titleStyle = {
  fontSize: '2rem',
  color: '#FF6B6B',
  marginBottom: '1rem',
  textAlign: 'center'
};

const listStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
};

const cardStyle = {
  backgroundColor: '#ffffff',
  padding: '1rem',
  borderRadius: '1rem',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  zIndex: 0
};

const groupName = {
  fontWeight: 'bold',
  fontSize: '1.1rem',
  color: '#FF6B6B'
};

const groupDesc = {
  fontSize: '0.9rem',
  color: '#555'
};

const noDataStyle = {
  color: '#888',
  fontSize: '0.95rem',
  textAlign: 'center'
};

export default ExploreGruposPage;