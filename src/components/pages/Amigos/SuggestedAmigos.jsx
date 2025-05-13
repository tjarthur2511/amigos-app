// ✅ SuggestedAmigos.jsx - White Card Cleanup, zIndex 0
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../../firebase';
import { collection, getDocs } from 'firebase/firestore';

const SuggestedAmigos = ({ amigosToExclude = [] }) => {
  const [suggested, setSuggested] = useState([]);
  const navigate = useNavigate();

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
            <li
              key={user.id}
              style={itemStyle}
              onClick={() => navigate(`/profile/${user.id}`)}
              className="hover:bg-[#fff7f7] transition cursor-pointer"
            >
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
  backgroundColor: '#ffffff',
  padding: '1rem',
  borderRadius: '1rem',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  fontFamily: 'Comfortaa, sans-serif',
  zIndex: 0
};

const listStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  marginTop: '1rem'
};

const itemStyle = {
  backgroundColor: '#ffffff',
  padding: '1rem',
  borderRadius: '1rem',
  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
  zIndex: 0
};

const userName = {
  fontSize: '1.2rem',
  fontWeight: 'bold',
  color: '#FF6B6B'
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
