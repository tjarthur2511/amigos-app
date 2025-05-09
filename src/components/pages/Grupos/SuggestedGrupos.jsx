// ✅ SuggestedGrupos.jsx - White Cards, Clean Layout, zIndex 0
import React, { useEffect, useState } from 'react';
import { db, auth } from '../../../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

const SuggestedGrupos = ({ gruposToExclude = [] }) => {
  const [grupos, setGrupos] = useState([]);

  useEffect(() => {
    const fetchSuggestedGrupos = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) return;

      const userData = userSnap.data();
      const userTags = userData.interestTags || [];
      const userLocation = userData.location || {};
      const blockedGrupos = userData.blockedGrupos || [];

      const snapshot = await getDocs(collection(db, 'grupos'));
      const all = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const filtered = all.filter(grupo =>
        !gruposToExclude.includes(grupo.id) &&
        !blockedGrupos.includes(grupo.id) &&
        grupo.tags?.some(tag => userTags.includes(tag)) &&
        grupo.location?.state === userLocation.state
      );

      setGrupos(filtered);
    };

    fetchSuggestedGrupos();
  }, [gruposToExclude]);

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>Suggested Grupos</h3>
      {grupos.length > 0 ? (
        <div style={scrollBox}>
          <ul style={listStyle}>
            {grupos.map(grupo => (
              <li key={grupo.id} style={itemStyle}>
                <p style={groupName}>{grupo.name}</p>
                <p style={groupDetail}>{grupo.description}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p style={noDataStyle}>No suggested grupos yet.</p>
      )}
    </div>
  );
};

const containerStyle = {
  backgroundColor: '#ffffff',
  padding: '1rem',
  borderRadius: '1rem',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  fontFamily: 'Comfortaa, sans-serif',
  zIndex: 0
};

const scrollBox = {
  maxHeight: '300px',
  overflowY: 'auto',
  marginTop: '1rem'
};

const titleStyle = {
  fontSize: '1.5rem',
  color: '#FF6B6B',
  textAlign: 'center'
};

const listStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
};

const itemStyle = {
  backgroundColor: '#ffffff',
  padding: '1rem',
  borderRadius: '1rem',
  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
  zIndex: 0
};

const groupName = {
  fontSize: '1.2rem',
  fontWeight: 'bold',
  color: '#FF6B6B'
};

const groupDetail = {
  fontSize: '0.9rem',
  color: '#555'
};

const noDataStyle = {
  textAlign: 'center',
  color: '#FF6B6B'
};

export default SuggestedGrupos;
