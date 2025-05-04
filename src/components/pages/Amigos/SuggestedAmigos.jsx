// src/components/pages/Amigos/SuggestedAmigos.jsx
import React, { useEffect, useState } from 'react';
import { db, auth } from '../../../firebase';
import { collection, getDocs } from 'firebase/firestore';

const SuggestedAmigos = ({ amigosToExclude = [] }) => {
  const [suggested, setSuggested] = useState([]);

  useEffect(() => {
    const loadSuggestions = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const allUsers = await getDocs(collection(db, 'users'));
      const filtered = allUsers.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(u => u.id !== currentUser.uid && !amigosToExclude.includes(u.id));

      setSuggested(filtered);
    };

    loadSuggestions();
  }, [amigosToExclude]);

  return (
    <div style={containerStyle}>
      {suggested.length > 0 ? (
        <ul style={listStyle}>
          {suggested.map((user) => (
            <li key={user.id} style={itemStyle}>
              <p style={userName}>{user.displayName}</p>
              <p style={userDetail}>{user.email}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p style={noDataStyle}>No suggested amigos yet.</p>
      )}
    </div>
  );
};

const containerStyle = {
  backgroundColor: '#fff0f0',
  padding: '1rem',
  borderRadius: '1rem',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
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

const userName = {
  fontSize: '1.2rem',
  fontWeight: 'bold'
};

const userDetail = {
  fontSize: '0.9rem',
  color: '#555'
};

const noDataStyle = {
  textAlign: 'center',
  color: '#FF6B6B',
  marginTop: '1rem'
};

export default SuggestedAmigos;
