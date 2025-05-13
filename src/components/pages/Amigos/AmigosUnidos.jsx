// ✅ AmigosUnidos - White Layout with Zero zIndex
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../../firebase';
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';

const AmigosUnidos = () => {
  const [followedAmigos, setFollowedAmigos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFollowedAmigos = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) return;

      const { following = [] } = userSnap.data();

      const allUsersSnap = await getDocs(collection(db, 'users'));
      const amigos = allUsersSnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(user => following.includes(user.id));

      setFollowedAmigos(amigos);
    };

    loadFollowedAmigos();
  }, []);

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>Amigos Unidos</h3>
      {followedAmigos.length > 0 ? (
        <ul style={listStyle}>
          {followedAmigos.map(amigo => (
            <li
              key={amigo.id}
              style={itemStyle}
              onClick={() => navigate(`/profile/${amigo.id}`)}
              className="hover:bg-[#fff7f7] transition cursor-pointer"
            >
              <p style={userName}>{amigo.displayName}</p>
              <p style={userDetail}>{amigo.email}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p style={noDataStyle}>You aren’t following any amigos yet.</p>
      )}
    </div>
  );
};

const containerStyle = {
  fontFamily: 'Comfortaa, sans-serif',
  backgroundColor: '#ffffff',
  padding: '2rem',
  borderRadius: '1.5rem',
  boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
  zIndex: 0
};

const titleStyle = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: '#FF6B6B',
  textAlign: 'center',
  marginBottom: '1rem'
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

const userName = {
  fontSize: '1.2rem',
  fontWeight: 'bold'
};

const userDetail = {
  fontSize: '0.9rem',
  color: '#555'
};

const noDataStyle = {
  color: '#FF6B6B',
  textAlign: 'center',
  marginTop: '1rem'
};

export default AmigosUnidos;
