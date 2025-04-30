// src/components/pages/Amigos/AmigosPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../../firebase';
import { collection, getDocs, doc, getDoc, query, where, limit } from 'firebase/firestore';
import FallingAEffect from '../FallingAEffect';

const AmigosPage = () => {
  const navigate = useNavigate();

  const [suggestedAmigos, setSuggestedAmigos] = useState([]);
  const [followedAmigos, setFollowedAmigos] = useState([]);
  const [followedPosts, setFollowedPosts] = useState([]);
  const [currentCard, setCurrentCard] = useState(1); // Set Followed Amigos as the default landing card

  const feedCards = ['Suggested Amigos', 'Followed Amigos', 'Your Amigos Posts'];

  useEffect(() => {
    const loadData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) return;
      const userData = userSnap.data();

      const allUsers = await getDocs(query(collection(db, 'users'), limit(100)));
      const amigos = allUsers.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(u => u.id !== user.uid);

      setSuggestedAmigos(amigos.filter(a => !(userData.following || []).includes(a.id)));
      setFollowedAmigos(amigos.filter(a => (userData.following || []).includes(a.id)));

      const postsQuery = query(collection(db, 'posts'), where('userId', '==', user.uid));
      const postDocs = await getDocs(postsQuery);
      const posts = postDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFollowedPosts(posts);
    };
    loadData();
  }, []);

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % feedCards.length);
  };

  const prevCard = () => {
    setCurrentCard((prev) => (prev - 1 + feedCards.length) % feedCards.length);
  };

  const renderCurrentFeed = () => {
    switch (feedCards[currentCard]) {
      case 'Suggested Amigos':
        return suggestedAmigos.length ? (
          <ul style={listStyle}>
            {suggestedAmigos.map((user) => (
              <li key={user.id} style={itemStyle}>
                <p style={userName}>{user.displayName}</p>
                <p style={userDetail}>{user.email}</p>
              </li>
            ))}
          </ul>
        ) : <p>No suggested amigos yet.</p>;
      case 'Followed Amigos':
        return followedAmigos.length ? (
          <ul style={listStyle}>
            {followedAmigos.map((user) => (
              <li key={user.id} style={itemStyle}>
                <p style={userName}>{user.displayName}</p>
                <p style={userDetail}>{user.email}</p>
              </li>
            ))}
          </ul>
        ) : <p>No followed amigos yet.</p>;
      case 'Your Amigos Posts':
        return followedPosts.length ? (
          <ul style={listStyle}>
            {followedPosts.map((post) => (
              <li key={post.id} style={itemStyle}>
                <p style={userName}>{post.title}</p>
                <p style={userDetail}>{post.content}</p>
              </li>
            ))}
          </ul>
        ) : <p>You haven’t posted anything yet.</p>;
      default:
        return null;
    }
  };

  return (
    <div style={{ fontFamily: 'Comfortaa, sans-serif', backgroundColor: '#FF6B6B', minHeight: '100vh', overflow: 'hidden', position: 'relative' }}>
      <FallingAEffect />

      <header style={{ textAlign: 'center', paddingTop: '2rem' }}>
        <h1 style={{ fontSize: '3.5rem', color: 'white' }}>amigos</h1>
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
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1.5rem', boxShadow: '0 5px 25px rgba(0,0,0,0.2)', width: '90%', maxWidth: '800px', minHeight: '60vh', textAlign: 'center', position: 'relative', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', color: '#FF6B6B', marginBottom: '1rem' }}>{feedCards[currentCard]}</h2>
          {renderCurrentFeed()}
          <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)' }}>
            <button onClick={nextCard} style={arrowStyle}>→</button>
          </div>
          <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}>
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

export default AmigosPage;
