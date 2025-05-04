// src/components/pages/Grupos/SuggestedGrupos.jsx
import React, { useEffect, useState } from 'react';
import { db, auth } from '../../../firebase';
import { collection, getDocs } from 'firebase/firestore';

const SuggestedGrupos = ({ gruposToExclude = [] }) => {
  const [grupos, setGrupos] = useState([]);

  useEffect(() => {
    const fetchGrupos = async () => {
      const snapshot = await getDocs(collection(db, 'grupos'));
      const all = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const filtered = all.filter(grupo => !gruposToExclude.includes(grupo.id));
      setGrupos(filtered);
    };
    fetchGrupos();
  }, [gruposToExclude]);

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>Suggested Grupos</h3>
      {grupos.length > 0 ? (
        <ul style={listStyle}>
          {grupos.map(grupo => (
            <li key={grupo.id} style={itemStyle}>
              <p style={groupName}>{grupo.name}</p>
              <p style={groupDetail}>{grupo.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p style={noDataStyle}>No suggested grupos yet.</p>
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

export default SuggestedGrupos;
