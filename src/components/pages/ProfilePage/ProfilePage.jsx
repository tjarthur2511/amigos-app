// src/components/pages/ProfilePage/ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../../firebase';
import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import FallingAEffect from '../FallingAEffect';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [currentCard, setCurrentCard] = useState(0);
  const feedCards = ['Profile Info', 'Your Posts', 'Your Grupos', 'Preferences', 'Settings'];

  useEffect(() => {
    const loadProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) return;
      const userData = userSnap.data();
      setUserData(userData);

      const postSnap = await getDocs(query(collection(db, 'posts'), where('userId', '==', user.uid)));
      setPosts(postSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const grupoSnap = await getDocs(collection(db, 'grupos'));
      setGrupos(grupoSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(g => userData.grupos?.includes(g.id)));
    };
    loadProfile();
  }, []);

  const nextCard = () => setCurrentCard((prev) => (prev + 1) % feedCards.length);
  const prevCard = () => setCurrentCard((prev) => (prev - 1 + feedCards.length) % feedCards.length);

  const renderCurrent = () => {
    if (!userData) return <p>Loading profile...</p>;
    switch (feedCards[currentCard]) {
      case 'Profile Info':
        return (
          <div>
            <p><strong>Name:</strong> {userData.displayName}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Location:</strong> {userData.location || 'Not set'}</p>
          </div>
        );
      case 'Your Posts':
        return posts.length ? (
          <ul style={listStyle}>
            {posts.map(post => (
              <li key={post.id} style={itemStyle}>
                <p style={userName}>{post.title}</p>
                <p style={userDetail}>{post.content}</p>
              </li>
            ))}
          </ul>
        ) : <p>You haven't posted anything yet.</p>;
      case 'Your Grupos':
        return grupos.length ? (
          <ul style={listStyle}>
            {grupos.map(grupo => (
              <li key={grupo.id} style={itemStyle}>
                <p style={userName}>{grupo.name}</p>
                <p style={userDetail}>{grupo.description}</p>
              </li>
            ))}
          </ul>
        ) : <p>You have not joined any grupos yet.</p>;
      case 'Preferences':
        return (
          <div>
            <p><strong>Language:</strong> {userData.preferences?.language || 'Not set'}</p>
            <p><strong>Theme:</strong> {userData.preferences?.theme || 'Default'}</p>
          </div>
        );
      case 'Settings':
        return (
          <div>
            <p><strong>Account Created:</strong> {userData.createdAt?.toDate?.().toLocaleDateString() || 'Unknown'}</p>
            <p><strong>UID:</strong> {auth.currentUser?.uid}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ fontFamily: 'Comfortaa, sans-serif', backgroundColor: '#FF6B6B', minHeight: '100vh', overflow: 'hidden', position: 'relative' }}>
      <button onClick={() => auth.signOut()} style={logoutStyle}>Sign Out</button>
      <FallingAEffect />

      <header style={{ textAlign: 'center', paddingTop: '2rem' }}>
        <h1 style={{ fontSize: '3.5rem', color: 'white' }}>profile</h1>
      </header>

      <nav style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: 'white', padding: '0.8rem 1rem', borderRadius: '30px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)', display: 'flex', gap: '1rem' }}>
          <button onClick={() => navigate('/')} style={tabStyle}>Home</button>
          <button onClick={() => navigate('/amigos')} style={tabStyle}>Amigos</button>
          <button onClick={() => navigate('/grupos')} style={tabStyle}>Grupos</button>
          <button onClick={() => navigate('/profile')} style={tabStyle}>Profile</button>
        </div>
      </nav>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1.5rem', boxShadow: '0 5px 25px rgba(0,0,0,0.2)', width: '90%', maxWidth: '800px', minHeight: '60vh', maxHeight: '70vh', overflowY: 'auto', textAlign: 'center', position: 'relative', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', color: '#FF6B6B', marginBottom: '1rem' }}>{feedCards[currentCard]}</h2>
          {renderCurrent()}
          <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', zIndex: 20 }}>
            <button onClick={nextCard} style={arrowStyle}>→</button>
          </div>
          <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', zIndex: 20 }}>
            <button onClick={prevCard} style={arrowStyle}>←</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const tabStyle = {
  backgroundColor: '#FF6B6B',
  color: 'white',
  border: 'none',
  padding: '12px 20px',
  borderRadius: '30px',
  fontSize: '1rem',
  fontWeight: 'bold',
  fontFamily: 'Comfortaa, sans-serif',
  cursor: 'pointer',
  boxShadow: '0 3px 8px rgba(0,0,0,0.2)'
};

const arrowStyle = {
  fontSize: '1.5rem',
  backgroundColor: '#FF6B6B',
  color: 'white',
  border: 'none',
  borderRadius: '50%',
  padding: '0.5rem 1rem',
  cursor: 'pointer'
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

const logoutStyle = {
  position: 'absolute',
  top: '1rem',
  right: '1rem',
  backgroundColor: '#FF6B6B',
  color: 'white',
  border: 'none',
  padding: '0.4rem 1rem',
  borderRadius: '20px',
  fontSize: '0.9rem',
  fontFamily: 'Comfortaa, sans-serif',
  cursor: 'pointer',
  boxShadow: '0 3px 8px rgba(0,0,0,0.2)'
};

export default ProfilePage;
