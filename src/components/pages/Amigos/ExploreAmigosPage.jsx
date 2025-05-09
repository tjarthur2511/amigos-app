// src/components/pages/Amigos/ExploreAmigosPage.jsx
import React, { useEffect, useState } from 'react';
import { db, auth } from '../../../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

const ExploreAmigosPage = () => {
  const [amigos, setAmigos] = useState([]);

  useEffect(() => {
    const fetchAmigos = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) return;

      const { following = [], interestTags = [], language } = userSnap.data();
      const allSnap = await getDocs(collection(db, 'users'));

      const allUsers = allSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const filtered = allUsers.filter(u =>
        u.id !== user.uid &&
        !following.includes(u.id) &&
        (!u.interestTags?.some(tag => interestTags.includes(tag)) ||
         (u.language && u.language !== language))
      );

      const random = filtered.sort(() => 0.5 - Math.random()).slice(0, 10);
      setAmigos(random);
    };

    fetchAmigos();
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Comfortaa, sans-serif' }}>
      <h2 style={{ fontSize: '2rem', color: '#FF6B6B', marginBottom: '1rem' }}>🧭 Discover Unexpected Amigos</h2>
      {amigos.length > 0 ? (
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {amigos.map((user) => (
            <li key={user.id} style={{ backgroundColor: '#ffecec', padding: '1rem', borderRadius: '1rem', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
              <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{user.displayName || 'Unnamed Amigo'}</p>
              <p style={{ fontSize: '0.9rem', color: '#555' }}>{user.email}</p>
              {user.language && <p style={{ fontSize: '0.85rem', color: '#888' }}>Speaks: {user.language}</p>}
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: '#888', fontSize: '0.95rem' }}>We’ll show you some interesting amigos soon!</p>
      )}
    </div>
  );
};

export default ExploreAmigosPage;
