// src/components/pages/ProfilePage/ProfileGrupos.jsx
import React, { useEffect, useState } from 'react';
import { db, auth } from '../../../firebase';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  deleteDoc
} from 'firebase/firestore';

const ProfileGrupos = () => {
  const [userGrupos, setUserGrupos] = useState([]);

  useEffect(() => {
    const fetchGrupos = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      const grupoIds = userData.grupos || [];

      const gruposSnap = await getDocs(collection(db, 'grupos'));
      const grupos = gruposSnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(g => grupoIds.includes(g.id));

      setUserGrupos(grupos);
    };

    fetchGrupos();
  }, []);

  const handleDeleteGrupo = async (grupoId) => {
    const confirmDelete = window.confirm('Delete this grupo?');
    if (!confirmDelete) return;
    try {
      await deleteDoc(doc(db, 'grupos', grupoId));
      setUserGrupos(prev => prev.filter(g => g.id !== grupoId));
    } catch (err) {
      console.error('Error deleting grupo:', err);
    }
  };

  return (
    <div style={{ fontFamily: 'Comfortaa, sans-serif', padding: '1rem', backgroundColor: '#fff0f0', borderRadius: '1rem', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
      {userGrupos.length > 0 ? (
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {userGrupos.map(grupo => (
            <li key={grupo.id} style={{ backgroundColor: '#ffecec', padding: '1rem', borderRadius: '1rem', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>
              <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{grupo.name}</p>
              <p style={{ fontSize: '0.9rem', color: '#555' }}>{grupo.description}</p>
              <button
                onClick={() => handleDeleteGrupo(grupo.id)}
                style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: '#FF6B6B', border: 'none', background: 'none', cursor: 'pointer' }}
              >
                🗑️ Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: '#FF6B6B', textAlign: 'center', marginTop: '1rem' }}>
          You haven't created or joined any grupos.
        </p>
      )}
    </div>
  );
};

export default ProfileGrupos;
