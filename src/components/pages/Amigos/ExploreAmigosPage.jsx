// ✅ ExploreAmigosPage - White Card Style, Consistent Layout
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
    <div style={containerStyle}>
      <h2 style={titleStyle}>🧭 Discover Unexpected Amigos</h2>
      {amigos.length > 0 ? (
        <ul style={listStyle}>
          {amigos.map((user) => (
            <li key={user.id} style={cardStyle}>
              <p style={userName}>{user.displayName || 'Unnamed Amigo'}</p>
              <p style={userDetail}>{user.email}</p>
              {user.language && <p style={userLang}>Speaks: {user.language}</p>}
            </li>
          ))}
        </ul>
      ) : (
        <p style={noDataStyle}>We’ll show you some interesting amigos soon!</p>
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

const userName = {
  fontWeight: 'bold',
  fontSize: '1.1rem',
  color: '#FF6B6B'
};

const userDetail = {
  fontSize: '0.9rem',
  color: '#555'
};

const userLang = {
  fontSize: '0.85rem',
  color: '#888'
};

const noDataStyle = {
  color: '#888',
  fontSize: '0.95rem',
  textAlign: 'center'
};

export default ExploreAmigosPage;