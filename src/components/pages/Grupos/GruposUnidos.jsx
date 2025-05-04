// src/components/pages/Grupos/GruposUnidos.jsx
import React, { useEffect, useState } from 'react';
import { db, auth } from '../../../firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';

const GruposUnidos = () => {
  const [joinedGrupos, setJoinedGrupos] = useState([]);

  useEffect(() => {
    const fetchJoinedGrupos = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) return;

      const { joinedGrupos = [] } = userSnap.data();
      if (!joinedGrupos.length) return;

      const allGruposSnap = await getDocs(collection(db, 'grupos'));
      const allGrupos = allGruposSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const userGrupos = allGrupos.filter(grupo => joinedGrupos.includes(grupo.id));
      setJoinedGrupos(userGrupos);
    };

    fetchJoinedGrupos();
  }, []);

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>Your Joined Grupos</h3>
      {joinedGrupos.length > 0 ? (
        <ul style={listStyle}>
          {joinedGrupos.map(grupo => (
            <li key={grupo.id} style={itemStyle}>
              <p style={groupName}>{grupo.name}</p>
              <p style={groupDetail}>{grupo.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p style={noDataStyle}>You haven’t joined any grupos yet.</p>
      )}
    </div>
  );
};

const containerStyle = {
  backgroundColor: '#fff0f0',
  padding: '1rem',
  borderRadius: '1rem',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  fontFamily: 'Comfortaa, sans-serif'
};

const titleStyle = {
  fontSize: '1.5rem',
  color: '#FF6B6B',
  textAlign: 'center'
};

const listStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  marginTop: '1rem'
};

const itemStyle = {
  backgroundColor: '#ffecec',
  padding: '1rem',
  borderRadius: '1rem',
  boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
};

const groupName = {
  fontSize: '1.2rem',
  fontWeight: 'bold'
};

const groupDetail = {
  fontSize: '0.9rem',
  color: '#555'
};

const noDataStyle = {
  textAlign: 'center',
  color: '#FF6B6B'
};

export default GruposUnidos;
