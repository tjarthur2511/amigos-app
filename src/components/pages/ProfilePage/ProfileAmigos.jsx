// src/components/pages/ProfilePage/ProfileAmigos.jsx
import React, { useEffect, useState } from 'react';
import { db, auth } from '../../../firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
} from 'firebase/firestore';

const ProfileAmigos = () => {
  const [amigos, setAmigos] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), async (docSnap) => {
      if (!docSnap.exists()) return;
      const amigoIds = docSnap.data().amigos || [];

      const amigoDocs = await Promise.all(
        amigoIds.map(async (id) => {
          const snap = await getDoc(doc(db, 'users', id));
          return snap.exists() ? { id, ...snap.data() } : null;
        })
      );

      setAmigos(amigoDocs.filter(Boolean));
    });

    return () => unsubscribe();
  }, []);

  const removeAmigo = async (amigoId) => {
    const user = auth.currentUser;
    if (!user) return;
    await updateDoc(doc(db, 'users', user.uid), {
      amigos: arrayRemove(amigoId),
    });
  };

  return (
    <div style={wrapperStyle}>
      {amigos.length > 0 ? (
        <ul style={listStyle}>
          {amigos.map((amigo) => (
            <li key={amigo.id} style={itemStyle}>
              <p style={userName}>{amigo.displayName || 'Unnamed Amigo'}</p>
              <p style={userDetail}>{amigo.email}</p>
              <button onClick={() => removeAmigo(amigo.id)} style={removeButton}>❌ Remove</button>
            </li>
          ))}
        </ul>
      ) : (
        <p style={noDataStyle}>You haven’t added any amigos yet.</p>
      )}
    </div>
  );
};

const wrapperStyle = {
  fontFamily: 'Comfortaa, sans-serif',
  padding: '1rem',
  backgroundColor: '#fff0f0',
  borderRadius: '1rem',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
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

const removeButton = {
  fontSize: '0.8rem',
  marginTop: '0.5rem',
  backgroundColor: '#FF6B6B',
  color: 'white',
  border: 'none',
  padding: '0.4rem 0.8rem',
  borderRadius: '9999px',
  cursor: 'pointer'
};

const noDataStyle = {
  textAlign: 'center',
  color: '#FF6B6B'
};

export default ProfileAmigos;
